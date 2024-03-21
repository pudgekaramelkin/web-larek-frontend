import './scss/styles.scss';

import { cloneTemplate, ensureElement } from './utils/utils';
import { EventEmitter } from './components/base/events';
import { LarekAPI } from './components/LarekAPI';
import { API_URL, CDN_URL } from './utils/constants';
import { Page } from './components/view/Page';
import { Modal } from './components/view/Modal';
import { ShoppingCart } from './components/view/ShoppingCart';
import { Card } from './components/view/Card';
import { Success } from './components/view/Success';
import { CatalogChangeEvent, IFormErrors, IItem, IPaymentType } from './types';
import { AppState } from './components/model/AppState';
import { DeliveryForm } from './components/view/DeliveryForm';
import { ContactsForm } from './components/view/ContactsForm';
import { ShoppingCartItem } from './components/view/ShoppingCartItem';

const api = new LarekAPI(CDN_URL, API_URL);
const events = new EventEmitter();

const templates = {
	cardCatalog: ensureElement<HTMLTemplateElement>('#card-catalog'),
	cardPreview: ensureElement<HTMLTemplateElement>('#card-preview'),
	cardShoppingCart: ensureElement<HTMLTemplateElement>('#card-shoppingCart'),
	shoppingCart: ensureElement<HTMLTemplateElement>('#shoppingCart'),
	delivery: ensureElement<HTMLTemplateElement>('#order'),
	contacts: ensureElement<HTMLTemplateElement>('#contacts'),
	success: ensureElement<HTMLTemplateElement>('#success'),
};

const appData = new AppState({}, events);

const page = new Page(document.body, events);
const modal = new Modal(ensureElement<HTMLElement>('#modal-container'), events);

const shoppingCart = new ShoppingCart(
	cloneTemplate(templates.shoppingCart),
	events
);
const deliveryForm = new DeliveryForm(
	cloneTemplate(templates.delivery),
	events
);
const contactsForm = new ContactsForm(
	cloneTemplate(templates.contacts),
	events
);

events.on<CatalogChangeEvent>('catalog:changed', () => {
	page.gallery = appData.catalog.map((item) => {
		const card = new Card(
			'card',
			cloneTemplate(templates.cardCatalog),
			events,
			{
				onClick: () => events.emit('card:open', item),
			}
		);
		return card.render({
			category: item.category,
			title: item.title,
			image: item.image,
			price: item.price,
		});
	});
});

const openModal = (content: HTMLElement) => {
	modal.render({ content });
};

events.on('shoppingCart:open', () => {
	openModal(
		shoppingCart.render({ valid: appData.getShoppingCartLength() > 0 })
	);
});

events.on('card:open', (item: IItem) => {
	const card = new Card('card', cloneTemplate(templates.cardPreview), events, {
		onClick: () => {
			if (appData.isLotInShoppingCart(item)) {
				item.removeFromShoppingCart();
			} else {
				item.placeInShoppingCart();
			}
			events.emit('card:open', item);
		},
	});

	openModal(
		card.render({
			category: item.category,
			title: item.title,
			description: item.description,
			image: item.image,
			price: item.price,
			button: !item.isOrdered ? 'Купить' : 'Удалить',
		})
	);
});

events.on('lot:changed', () => {
	page.counter = appData.getShoppingCartLength();

	shoppingCart.items = appData.shoppingCart.map((item, index) => {
		const card = new ShoppingCartItem(
			cloneTemplate(templates.cardShoppingCart),
			events,
			{
				onClick: () => {
					item.removeFromShoppingCart();
					events.emit('basket:open');
				},
			}
		);
		return card.render({
			index: index,
			title: item.title,
			price: item.price,
		});
	});

	shoppingCart.total = appData.getTotalAmount();
});

events.on('order_payment:open', () => {
	const order = appData.initOrder();
	openModal(
		deliveryForm.render({
			payment: order.payment,
			address: order.address,
			valid: false,
			errors: [],
		})
	);
});

interface PaymentData {
	target: string;
}

events.on('payment:changed', (data: PaymentData) => {
	appData.order.payment = data.target as IPaymentType;
});

interface AddressData {
	value: string;
}

events.on('order.address:change', (data: AddressData) => {
	appData.order.address = data.value;
});

interface EmailData {
	value: string;
}

events.on('contacts.email:change', (data: EmailData) => {
	appData.order.email = data.value;
});

interface PhoneData {
	value: string;
}

events.on('contacts.phone:change', (data: PhoneData) => {
	appData.order.phone = data.value;
});

events.on('formErrors:changed', (errors: Partial<IFormErrors>) => {
	const { payment, address, email, phone } = errors;

	deliveryForm.valid = !payment && !address;
	deliveryForm.errors = Object.values({ payment, address })
		.filter((error) => !!error)
		.join('; ');

	contactsForm.valid = !email && !phone;
	contactsForm.errors = Object.values({ email, phone })
		.filter((error) => !!error)
		.join('; ');
});

events.on('order:submit', () => {
	events.emit('order_contacts:open');
});

events.on('order_contacts:open', () => {
	const order = appData.order;
	openModal(
		contactsForm.render({
			email: order.email,
			phone: order.phone,
			valid: false,
			errors: [],
		})
	);
});

events.on('contacts:submit', () => {
	const order = appData.order;
	const orderData = {
		payment: order.payment,
		address: order.address,
		email: order.email,
		phone: order.phone,
		total: appData.getTotalAmount(),
		items: appData.getShoppingCartIds(),
	};

	api
		.postOrderLots(orderData)
		.then((result) => {
			const success = new Success(cloneTemplate(templates.success), events, {
				onClick: () => {
					modal.close();
				},
			});

			modal.render({
				content: success.render({
					total: result.total,
				}),
			});

			appData.clearShoppingCart();
		})
		.catch((err) => {
			console.error(err);
		});
});

events.on('modal:open', () => {
	page.locked = true;
});

events.on('modal:close', () => {
	page.locked = false;
});

api
	.getLotList()
	.then((res) => {
		appData.catalog = res;
	})
	.catch(console.error);

import './scss/styles.scss';

import { cloneTemplate, ensureElement } from './utils/utils';
import { EventEmitter } from './components/base/events';
import { LarekAPI } from './components/LarekAPI';
import { API_URL, CDN_URL } from './utils/constants';
import { AppState } from './components/model/AppState';
import { Page } from './components/view/Page';
import { Modal } from './components/view/Modal';
import { ShoppingCart } from './components/view/ShoppingCart';
import { Card } from './components/view/Card';
import { Success } from './components/view/Success';
import { DeliveryForm } from './components/view/DeliveryForm';
import { ContactsForm } from './components/view/ContactsForm';
import { ShoppingCartItem } from './components/view/ShoppingCartItem';
import { CatalogChangeEvent, IFormErrors, IItem, IPaymentType } from './types';

const events = new EventEmitter();
const api = new LarekAPI(CDN_URL, API_URL);

const templates = {
	shoppingCart: ensureElement<HTMLTemplateElement>('#shoppingCart'),
	delivery: ensureElement<HTMLTemplateElement>('#order'),
	contacts: ensureElement<HTMLTemplateElement>('#contacts'),
	success: ensureElement<HTMLTemplateElement>('#success'),
	cardCatalog: ensureElement<HTMLTemplateElement>('#card-catalog'),
	cardPreview: ensureElement<HTMLTemplateElement>('#card-preview'),
	cardShoppingCart: ensureElement<HTMLTemplateElement>('#card-shoppingCart'),
};

const page = new Page(document.body, events);
const modal = new Modal(ensureElement<HTMLElement>('#modal-container'), events);

const appData = new AppState({}, events);

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
		return card.render({ ...item });
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
			...item,
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
			...item,
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

interface IOrderData {
	payment: IPaymentType;
	address: string;
	email: string;
	phone: string;
	total: number;
	items: string[];
}

events.on('contacts:submit', () => {
	const order = appData.order;
	const orderData: IOrderData = {
		payment: order.payment,
		address: order.address,
		email: order.email,
		phone: order.phone,
		total: appData.getTotalAmount(),
		items: appData.getShoppingCartIds(),
	};

	const handleOrderSubmission = async (orderData: IOrderData) => {
		try {
			const result = await api.postOrderLots(orderData);
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
		} catch (err) {
			console.error(err);
		}
	};

	handleOrderSubmission(orderData);
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

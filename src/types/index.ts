interface IItem {
	id: string;
	title: string;
	description?: string;
	image: string;
	category: string;
	price: number | null;
	isOrdered: boolean;
	placeInShoppingCard: () => void;
	removeFromShoppingCard: () => void;
}

type PaymentType = 'card' | 'cash';

interface IOrderDeliveryForm {
	payment: PaymentType;
	address: string;
}

interface IOrderContactsForm {
	email: string;
	phone: string;
}

type IOrderForm = IOrderDeliveryForm & IOrderContactsForm;

interface IOrder extends IOrderForm {
	items: IItem[];
	validateOrder(): void;
	clearOrder(): void;
	validatePayment(): void;
	validateAddress(): void;
	validateEmail(): void;
	validatePhone(): void;
	postOrder(): void;
}

interface IAppState {
	catalog: IItem[];
	basket: IItem[];
	order: IOrder;
	preview: IItem;
	isLotInBasket(item: IItem): boolean;
	clearBasket(): void;
	getTotalAmount(): number;
	getBasketIds(): number;
	getBasketLength(): number;
	initOrder(): IOrder;
}

export {
	IItem,
	PaymentType,
	IOrderDeliveryForm,
	IOrderForm,
	IOrder,
	IAppState,
};

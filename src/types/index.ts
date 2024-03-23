type IItemCategory =
	| 'кнопка'
	| 'софт-скил'
	| 'дополнительное'
	| 'хард-скил'
	| 'другое';

interface IItem {
	id: string;
	title: string;
	description?: string;
	image: string;
	category: IItemCategory;
	price: number | null;
	isOrdered: boolean;
	placeInShoppingCart: () => void;
	removeFromShoppingCart: () => void;
}


interface IOrderData {
	payment: IPaymentType;
	address: string;
	email: string;
	phone: string;
	total: number;
	items: string[];
}

type IPaymentType = 'card' | 'cash';

interface IOrderDeliveryForm {
	payment: IPaymentType;
	address: string;
}

interface IOrderContactsForm {
	email: string;
	phone: string;
}

type IOrderForm = IOrderDeliveryForm & IOrderContactsForm;

interface IOrderAPI extends IOrderForm {
	items: string[];
	total: number;
}

type IFormErrors = Partial<Record<keyof IOrderForm, string>>;

interface IOrderResult {
	id: string;
	total: number;
}

interface ILarekAPI {
	getLotItem: (id: string) => Promise<IItem>;
	getLotList: () => Promise<IItem[]>;
	postOrderLots: (order: IOrderAPI) => Promise<IOrderResult>;
}

type CatalogChangeEvent = {
	catalog: IItem[]
}

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
	shoppingCart: IItem[];
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
	IItemCategory,
	IItem,
	IFormErrors,
	IPaymentType,
	CatalogChangeEvent,
	IOrderDeliveryForm,
	IOrderContactsForm,
	IOrderForm,
	IOrderAPI,
	IOrderResult,
	IOrderData,
	ILarekAPI,
	IOrder,
	IAppState,
};

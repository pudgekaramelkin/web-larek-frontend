import { IAppState, IItem, IOrder } from '../../types';
import { Model } from '../base/Model';
import { IEvents } from '../base/events';
import { Item } from './Item';
import { Order } from './Order';

export class AppState extends Model<IAppState> {
	private _catalog: IItem[];
	private _order: IOrder;
	private _preview: IItem;

	constructor(data: Partial<IAppState>, events: IEvents) {
		super(data, events);
	}

	set catalog(items: IItem[]) {
		this._catalog = items.map((item) => new Item(item, this.events));
		this.emitChanges('catalog:changed', { catalog: this.catalog });
	}

	get catalog(): IItem[] {
		return this._catalog;
	}

	get shoppingCart(): IItem[] {
		return this._catalog.filter((item) => item.isOrdered);
	}

	get order(): IOrder {
		return this._order;
	}

	get preview(): IItem {
		return this._preview;
	}

	set preview(value: IItem) {
		this._preview = value;
		this.emitChanges('preview:changed', this.preview);
	}

	isLotInShoppingCart(item: IItem): boolean {
		return item.isOrdered;
	}

	clearShoppingCart(): void {
		this.shoppingCart.forEach((lot) => lot.removeFromShoppingCart());
	}

	getTotalAmount(): number {
		return this.shoppingCart.reduce(
			(prev: number, item: IItem) => prev + item.price,
			0
		);
	}

	getShoppingCartIds(): string[] {
		return this.shoppingCart.map((item) => item.id);
	}

	getShoppingCartLength(): number {
		return this.shoppingCart.length;
	}

	initOrder(): IOrder {
		this._order = new Order({}, this.events);
		this.order.clearOrder();
		return this.order;
	}
}

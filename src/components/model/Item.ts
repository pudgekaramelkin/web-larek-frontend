import { IItem, IItemCategory } from '../../types';
import { Model } from '../base/Model';

export class Item extends Model<IItem> {
	id: string;
	title: string;
	description?: string;
	image: string;
	category: IItemCategory;
	price: number | null;
	isOrdered: boolean;
	placeInShoppingCart(): void {
		this.isOrdered = true;
		this.emitChanges('lot:changed', { isOrdered: this.isOrdered });
	}
	removeFromShoppingCart(): void {
		this.isOrdered = false;
		this.emitChanges('lot:changed', { isOrdered: this.isOrdered });
	}
}

import { createElement, ensureElement, formatSinaps } from '../../utils/utils';
import { View } from '../base/View';
import { EventEmitter } from '../base/Events';

interface IShoppingCart {
	items: HTMLElement[];
	total: number;
	valid: boolean;
}

export class ShoppingCart extends View<IShoppingCart> {
	protected _list: HTMLElement;
	protected _total: HTMLElement;
	protected _button: HTMLElement;

	constructor(container: HTMLElement, events: EventEmitter) {
		super(container, events);

		this._list = ensureElement<HTMLElement>(
			'.shoppingCart__list',
			this.container
		);
		this._total = this.container.querySelector('.shoppingCart__price');
		this._button = this.container.querySelector('.shoppingCart__button');

		if (this._button) {
			this._button.addEventListener('click', () => {
				events.emit('order_payment:open');
			});
		}

		this.items = [];
	}

	set items(items: HTMLElement[]) {
		if (items.length) {
			this._list.replaceChildren(...items);
		} else {
			this._list.replaceChildren(
				createElement<HTMLParagraphElement>('p', {
					textContent: 'Корзина пуста',
				})
			);
		}
	}

	set total(total: number) {
		this.setText(this._total, formatSinaps(total));
	}

	set valid(value: boolean) {
		this.setDisabled(this._button, !value);
	}
}

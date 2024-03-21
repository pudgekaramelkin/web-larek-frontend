import { ensureElement, formatNumber } from '../../utils/utils';
import { View } from '../base/View';
import { IEvents } from '../base/events';

interface IPage {
	counter: number; 
	gallery: HTMLElement[];
	locked: boolean; 
}

export class Page extends View<IPage> {
	private _counter: HTMLElement;
	private _gallery: HTMLElement;
	private _wrapper: HTMLElement;
	private _shoppingCart: HTMLButtonElement;

	constructor(container: HTMLElement, events: IEvents) {
		super(container, events);

		this._counter = ensureElement<HTMLElement>('.header__shoppingCart-counter');
		this._gallery = ensureElement<HTMLElement>('.gallery');
		this._wrapper = ensureElement<HTMLElement>('.page__wrapper');
		this._shoppingCart = ensureElement<HTMLButtonElement>('.header__shoppingCart');

		this._shoppingCart.addEventListener('click', () => {
			this.events.emit('shoppingCart:open');
		});
	}

	set counter(value: number) {
		this.setText(this._counter, formatNumber(value));
	}

	set gallery(items: HTMLElement[]) {
		this._gallery.replaceChildren(...items);
	}

	set locked(value: boolean) {
		this.toggleClass(this._wrapper, 'page__wrapper_locked', value);
	}
}

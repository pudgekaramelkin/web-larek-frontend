import { ensureElement } from '../../utils/utils';
import { View } from '../base/View';
import { IEvents } from '../base/Events';

interface IModalData {
	content: HTMLElement;
}

export class Modal extends View<IModalData> {
	private _closeButton: HTMLButtonElement;
	private _content: HTMLElement;

	constructor(container: HTMLElement, events: IEvents) {
		super(container, events);

		this._closeButton = ensureElement<HTMLButtonElement>(
			'.modal__close',
			container
		);
		this._content = ensureElement<HTMLElement>('.modal__content', container);

		[this._closeButton, this.container].forEach((element) => {
			element.addEventListener('click', () => {
				this.close();
			});
		});
		this._content.addEventListener('click', (event) => event.stopPropagation());
	}

	set content(value: HTMLElement) {
		this._content.replaceChildren(value);
	}

	open(): void {
		this.toggleClass(this.container, 'modal_active', true);
		this.events.emit('modal:open');
	}

	close(): void {
		this.toggleClass(this.container, 'modal_active', false);
		this.content = null;
		this.events.emit('modal:close');
	}

	render(data: IModalData): HTMLElement {
		super.render(data);
		this.open();
		return this.container;
	}
}

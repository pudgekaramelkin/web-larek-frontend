import { ensureElement, formatSinaps } from '../../utils/utils';
import { View } from '../base/View';
import { IEvents } from '../base/Events';

interface ISuccess {
	total: number; 
}

interface ISuccessActions {
	onClick: () => void;
}

export class Success extends View<ISuccess> {
	protected _close: HTMLElement;
	protected _total: HTMLElement;

	constructor(
		container: HTMLElement,
		events: IEvents,
		actions: ISuccessActions
	) {
		super(container, events);
		this._total = ensureElement<HTMLElement>(
			'.order-success__description',
			this.container
		);
		this._close = ensureElement<HTMLElement>(
			'.order-success__close',
			this.container
		);

		if (actions?.onClick) {
			this._close.addEventListener('click', actions.onClick);
		}
	}

	set total(value: number) {
		this.setText(this._total, `Списано ${formatSinaps(value)}`)
	}
}

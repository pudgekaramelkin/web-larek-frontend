import { IFormErrors, IItem, IOrder, IPaymentType } from '../../types';
import { Model } from '../base/Model';

export class Order extends Model<IOrder> {
	protected _payment: IPaymentType = 'card';
	protected _address: string = '';
	protected _email: string = '';
	protected _phone: string = '';
	protected _items: IItem[] = [];
	protected _formErrors: IFormErrors = {};
	validateOrder(): void {
		this.validatePayment();
		this.validateAddress();
		this.validateEmail();
		this.validatePhone();
		this.emitChanges('formErrors:changed', this._formErrors);
	}
	clearOrder(): void {
		this._payment = 'card';
		this._address = '';
		this._email = '';
		this._phone = '';
	}
	set payment(value: IPaymentType) {
		this._payment = value;
		this.validateOrder();
	}
	get payment(): IPaymentType {
		return this._payment;
	}

	validatePayment(): void {
		if (!this._payment) {
			this._formErrors.payment =
				'Вам необходимо выбрать удобный способ оплаты!';
		} else {
			this._formErrors.payment = '';
		}
	}

	set address(value: string) {
		this._address = value;
		this.validateOrder();
	}

	get address(): string {
		return this._address;
	}

	validateAddress(): void {
		if (!this._address) {
			this._formErrors.address = 'Вам необходимо выбрать адрес доставки!';
		} else {
			this._formErrors.address = '';
		}
		this.emitChanges('formErrors:changed', this._formErrors);
	}

	set email(value: string) {
		this._email = value.toLowerCase();
		this.validateOrder();
	}

	get email(): string {
		return this._email;
	}

	validateEmail(): void {
		const emailPattern = /[^@ \t\r\n]+@[^@ \t\r\n]+\.[^@ \t\r\n]+/gm;
		if (!this._email) {
			this._formErrors.email = 'Вам необходимо ввести электронную почту!';
		} else if (!emailPattern.test(this._email)) {
			this._formErrors.email =
				'Вам необходимо ввести электронную почту в верном формате!';
		} else {
			this._formErrors.email = '';
		}
		this.emitChanges('formErrors:changed', this._formErrors);
	}

	set phone(value: string) {
		this._phone = value;
		this.validateOrder();
	}

	get phone(): string {
		return this._phone;
	}

	validatePhone(): void {
		const phonePattern =
			/^[\+]?[(]?[0-9]{3}[)]?[-\s\.]?[0-9]{3}[-\s\.]?[0-9]{4,6}$/gim;
		if (!this._phone) {
			this._formErrors.phone = 'Вам необходимо ввести номер телефона!';
		} else if (!phonePattern.test(this._phone)) {
			this._formErrors.phone =
				'Вам необходимо ввести корректный номер телефона!';
		} else {
			this._formErrors.phone = '';
		}
		this.emitChanges('formErrors:changed', this._formErrors);
	}

	set items(value: IItem[]) {
		this._items = value;
	}

	get items(): IItem[] {
		return this._items;
	}

	postOrder(): void {
		this.clearOrder();
		this.emitChanges('order:post');
	}
}

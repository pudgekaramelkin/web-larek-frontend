import { Api, ApiListResponse } from './base/api';
import { IItem, IOrderAPI, ILarekAPI, IOrderResult } from '../types';

export class LarekAPI extends Api implements ILarekAPI {
	private readonly cdn: string;

	constructor(cdn: string, baseUrl: string, options?: RequestInit) {
		super(baseUrl, options);
		this.cdn = cdn;
	}

	getLotItem(id: string): Promise<IItem> {
		return this.get(`/product/${id}`).then((item: IItem) => ({
			...item,
			image: this.cdn + item.image,
		}));
	}

	getLotList(): Promise<IItem[]> {
		return this.get('/product/').then((data: ApiListResponse<IItem>) =>
			data.items.map((item) => ({
				...item,
				image: this.cdn + item.image,
			}))
		);
	}

	postOrderLots(order: IOrderAPI): Promise<IOrderResult> {
		return this.post('/order', order).then((data: IOrderResult) => data);
	}
}

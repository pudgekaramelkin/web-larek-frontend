import { IItemCategory } from '../types';

export const API_URL = `${process.env.API_ORIGIN}/api/weblarek`;
export const CDN_URL = `${process.env.API_ORIGIN}/content/weblarek`;

export const SETTINGS = {};

export const CATEGORY_MAP: Record<IItemCategory, string> = {
	'софт-скил': 'soft',
	'хард-скил': 'hard',
	'кнопка': 'button',
	'другое': 'other',
	'дополнительное': 'additional',
};

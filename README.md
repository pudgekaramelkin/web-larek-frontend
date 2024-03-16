# Проектная работа "Веб-ларек"

Стек: HTML, SCSS, TS, Webpack

Структура проекта:
- src/ — исходные файлы проекта
- src/components/ — папка с JS компонентами
- src/components/base/ — папка с базовым кодом

Важные файлы:
- src/pages/index.html — HTML-файл главной страницы
- src/types/index.ts — файл с типами
- src/index.ts — точка входа приложения
- src/styles/styles.scss — корневой файл стилей
- src/utils/constants.ts — файл с константами
- src/utils/utils.ts — файл с утилитами

## Установка и запуск
Для установки и запуска проекта необходимо выполнить команды

```
npm install
npm run start
```

или

```
yarn
yarn start
```
## Сборка

```
npm run build
```

или

```
yarn build
```
## Архитектура проекта 
Данный сайт реализован по MPV (Model-View-Presenter) паттерну и использует событийно-ориентированный подход, реализующийся с помощью класса EventEmitter:

| **Компонент** | **Описание**                  | **Первичный класс (абстрактный)** | **Дочерние классы** |
|:------------: |:----------------------------: | :-------------------------------:	|	:-----------------: |
| Model         | Уровень данных                | Model       		                  | AppState <br> Item <br> Order   |
| View          | Уровень отображения           | View        		                  | Page <br> Modal <br> ShoppingCart <br> Card <br> ShoppingCartItem <br> Form <br> ContactsForm <br> DeliveryForm <br> Success |                   
| Presenter     | Прослойка между View и Model  | Отсутствует        		            | Отсутствуют (Реализация в index.ts) |

## Основные (базовые) классы 

### Класс EventEmitter
Обеспечивает работу событий. Его функции: возможность установить и снять слушателей событий, вызвать слушателей при возникновении события.

### Класс Api
Обеспечивает доступ к веб-сервису. Его функции: реализация основных операций GET, POST, DELETE.

### Класс View 
Класс для наследование модели отображения. Его функции: реализация базовые элементы для работы с элементами (например, установка текста у элемента).

### Класс Modal
Класс для компонентов уровня данных. Его функции: связывание переданных данных со свойством объекта.

## Компоненты уровня данных

### Класс AppState 
Класс для общих данных приложения, отслеживающий состояние и события.
* `order` - отслеживает состояние заказа
* `preview` - отслеживает тот лот, который находится в модальном окне
* `catalog` - отслеживание списка доступных лотов
```typescript
interface IAppState {
	_catalog: IItem[];
	_order: Order;
	_preview: IItem;
	isItemInShoppingCard: (item: IItem) => boolean;
	clearShoppingCard: () => void;
	getTotalAmoint: () => stringp[];
	getShoppingCardIds: () => string[];
	getShoppingCardLength: () => number;
	initOrder: () => void;
}
```

### Класс Item
Класс для отдельной карточки.
```typescript
interface IItem {
	id: number;
	title: string;
	description?: string;
	image: string;
	category: string;
	price: number;
	isOrdered: boolean;
	placeInShoppingCard: () => void;
	removeFromShoppingCard: () => void;
}
```

### Класс Order
Класс данных заказа, включая валидацию и генерацию события formErrors:changed.
```typescript
interface IOrder {
	_payment: IPaymentType;
	_adress: string;
	_email: string;
	_phone: string;
	_items: IItem[];
	_formErrors: object;
	validateOrder: () => void;
	clearOrder: () => void;
	validatePayment: () => void;
	validateAddress: () => void;
	validateEmail: () => void;
	validatePhone: () => void;
	postOrder: () => void;
}
```

## Компоненты уроня отображения

### Класс Page 
Класс для страницы, с элементами counter, gallery, wrapper, shoppingCard.

### Класс Modal 
Класс для модального окна с содержанием и кнопкой закрытия.

### Класс ShoppingCart 
Класс для корзины с элементами list, total, button.

### Класс Card 
Класс для карточки с элементами category, title, image, description, button, price.

### Класс ShoppingCardItem
Класс для представления элементов корзины с элементами index, title, price, deleteButton

### Класс Form 
Первоначальный (базовый) класс формы с кнопкой submit и блоком для ошибок (errors).

### Класс DeliveryForm 
Потомок Form для формы заказа с платежной информацией и адресом доставки с элементами payment, address.
```typescript
type IPaymentType = 'card' | 'cash'
interface IOrderDeliveryForm {
	payment: IPaymentType;
	address: string;
}
```

### Класс ContactsForm 
Потомок Form для формы заказа с контактной информацией с элементами email, phone.
```typescript
interface IOrderContactsForm {
		email: string; 
		phone: string;
}
type IOrderForm = IOrderDeliveryForm & IOrderContactsForm;
```

### Класс Success 
Представление основной информации об оформленном заказе с общей суммой заказа с элементом total.

## Внешние связи

### LarekAPI
Класс взаимодействия с API-сервером, методы getLotItem, getLotList, postOrderLots.

https://github.com/pudgekaramelkin/web-larek-frontend
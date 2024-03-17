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
- src/scss/styles.scss— корневой файл стилей
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
|:------------ |:----------------------------: | :-------------------------------:	|	:-----------------: |
| Model         | Уровень данных                | Model       		                  | AppState <br> Item <br> Order   |
| View          | Уровень отображения           | View        		                  | Page <br> Modal <br> ShoppingCart <br> Card <br> ShoppingCartItem <br> Form <br> ContactsForm <br> DeliveryForm <br> Success |                   
| Presenter     | Прослойка между View и Model  | Отсутствует        		            | Отсутствуют (Реализация в index.ts) |

## Базовый код

### Класс `EventEmitter`
Реализует паттерн «Наблюдатель» и позволяет подписываться на события и уведомлять подписчиков о наступлении события. Класс имеет методы `on`, `off`, `emit`  — для подписки на событие, отписки от события и уведомления подписчиков о наступлении события соответственно. Дополнительно реализованы методы `onAll` и `offAll` — для подписки на все события и сброса всех подписчиков. Интересным дополнением является метод `trigger`, генерирующий заданное событие с заданными аргументами. Это позволяет передавать его в качестве обработчика события в другие классы. Эти классы будут генерировать события, не будучи при этом напрямую зависимыми от класса `EventEmitter`.

### Класс `Api`
Абстрактный базовый класс, который обеспечивает доступ к веб-сервису. Он реализует основные операций: GET, POST.
* `constructor(baseUrl: string, options: RequestInit)` - принимает домен сервера и параметры запроса при помощи встроенного типа `RequestInit`<br>
Методы:
- `getServerAnswer(result: Response): Promise<object>` - обрабатывает ответ сервера.
- `get(uri: string): Promise<object>` - реализация метода GET.
- `post(uri: string, data: object, method: ApiPostMethods = 'POST'): Promise<object>` - реализация метода POST.

### Класс `View<T>` 
Абстрактный базовый класс, предназначенным для создания компонентов пользовательского интерфейса. Класс обеспечивает инструментарий для управления DOM элементами и поведением компонента. Наследуется всеми классами представления (View).
* `constructor(container: HTMLElement, events: IEvents)` - принимает элемент контейнера, в который будет помещен компонент и брокер событий.<br>
Методы:
- `toggleClass(element: HTMLElement, className: string, force?: boolean): void` - переключается класс для переданного элемента.
- `setText(element: HTMLElement, value: unknown): void` - устанавливает текстовое содержимое для переданного элемента.
- `setImage(element: HTMLImageElement, src: string, alt?: string): void` - устанавливает изображения и альтернативный текст для изоображения (опционально) для переданного элемента типа HTMLImageElement
- `setDisabled(element: HTMLElement, state: boolean): void` - изменяет статус блокировки для переданного элемента.
- `setHidden(element: HTMLElement): void`, `setVisible(element: HTMLElement): void` - скрывает, отоброжает переданный элемент.
- `render(data?: Partial<T>): HTMLElement` - рендерит компонент, используя переданные данные. Метод должен быть переназначен в дочерних классах.
 
### Класс `Model<T>`
Абстрактный базовый класс, предназначенный для компонентов уровня данных. Его функции: связывание переданных данных со свойством объекта (это реализовано в конструкторе) и инициализация вызова именованных событий через метод `emitChanges`. Наследуется всеми классами представления (Model).
* `constructor(data: Partial<T>, protected events: IEvents)` - принимает используемые моделью данные и объект брокера событий.<br>
Методы:
- `emitChanges(event: string, payload?: object): void` - сообщает об изменении в модели.

## Компоненты уровня данных

### Класс `AppState` 
Класс уровня данных для общих данных приложения, отслеживающий состояние всего приложения.
* `constructor(data: Partial<IAppState>, events: IEvents)` - принимает используемые моделью данные и объект брокера событий.<br>
Поля:
* `_order: IOrder` - элемент состояние заказа.
* `_preview: IItem` - элемент лота, который находится в модальном окне.
* `_catalog: IItem[]` - элемент списка доступных лотов, при установке данного свойства вызывается событие `catalog:changed`.<br>
Методы:
- `set сatalog(items: IItem[])` - устанавливает каталог и вызывает `emitChanges`.
- `set preview(items: IItem)` - устанавливает элемент лота, который находися в модальном окне и вызывает `emitChanges`.
- `isItemInShoppingCart(item: IItem): boolean` - проверят, находится ли лот в корзине.
- `clearShoppingCart(): void` - чистит корзину.
- `getTotalAmount(): number` - возращает общую стоимость всех товаров в корзине.
- `getShoppingCartIds(): string[]` - возращает массив индексов товаров в корзине. 
- `initOrder(): IOrder` - инициализирует объект заказа.


### Класс `Item`
Класс уровня данных для отдельной карточки. Реализует событие `lot:changed`.<br>
Поля:
* `id: string` - id лота.
* `title: string` - название лота.
* `description?: string` - описание лота (необязательный пункт).
* `image: string` - картинка лота.
* `category: string` - категория лота.
* `price: number` - цена лота.
* `isOrdered: boolean` - заказан ли лот.<br>
Методы:
- `placeInShoppingCart(): void` - добавляет лот в корзину.
- `removeFromShoppingCart(): void` - метод, удаляет лот из корзины.

### Класс `Order`
Класс уровня данных для процесса оформления заказа. Он содержит те свойства, которые отображаются на соответствующих форм и реализует простейшую логику валидации свойств на наличие значений. Если происходят изменения в любом из доступных свойств, то вызывается проверка всех полей и генерируется событие `formErrors:changed`<br>
Поля:
* `_payment: IPaymentType` - способ оплаты.
* `_address: string` - адрес пользователя.
* `_email: string ` - электронная почта пользователя.
* `_phone: string` - номер почта пользователя.
* `_items: IItem[] ` - категория лота.
* `_formErrors: IFormErrors` - цена лота.<br>
Методы:
- `placeInShoppingCart(): void` - добавляет лот в корзину.
- `removeFromShoppingCart(): void` - метод, удаляет лот из корзины.

## Компоненты уроня отображения

### Класс `Page` 
Класс уровня отображения для всей страницы.
* `constructor(container: HTMLElement, evens: IEvents)` - принимает родительский контейнер для элемента и брокер событий.<br>
Поля: 
* `_counter: HTMLElement` - элемент отображения количества товаров в корзине.
* `_galery: HTMLElement` - элемент отображения всех лотов.
* `_wrapper: HTMLElement` - обертка, которая позволяет блокировать прокрутка страницы, если открыто модальное окно.
* `_shoppingCart: HTMLButtonElement` - кнопка, которая отображет корзину. При нажатии на кнопку вызывается событие `shoppingCart:open`.<br>
Методы:
- `set counter(value: number)` - устанавливает количество лотов в корзине.
- `set galery(items: HTMLElement[])` - обновляет список карточек.
- `set locked(value: boolean)` - обрабатывает блокировку страницы.

### Класс `Modal` 
Класс уровня отображения для модального окна.
* `constructor(container: HTMLElement, evens: IEvents)` - принимает родительский контейнер для элемента и брокер событий.<br>
Поля:
* `_closeButton: HTMLButtonElement` - элемент для отображения кнопки закрытия модального окна.
* `_content: HTMLElement` - элемент для отображения внутреннего контента модального окна.<br>
Методы:
- `set content(value: HTMLElement)` - назначает внутренний контент модального окна.
- `open(): void` - открывает модальное окно.
- `close(): close` - закрывает модальное окно.

### Класс `ShoppingCart` 
Класс отображения для корзины.
* `constructor(container: HTMLElement, evens: IEvents)` - принимает родительский контейнер для элемента (темплейта) и брокер событий.<br>
Поля:
* `_list: HTMLElement` - элемент списка отображаемых элементов в корзине.
* `_total: HTMLElement` - элемент общей стоимости корзины.
* `_button: HTMLElement` - элемент кнопки для открытия формы оформления заказа, который вызывает событие `order_payment:open`.<br>
Методы: 
- `set items(item: HTMLElement[])` - назначает список отображаемых элементов.
- `set total(value: number)` - назначает общую стоимость корзины.
- `set valid(value: boolean)` - назначает закрытие/открытие кнопки длы формы оформления заказа.

### Класс `Card` 
Класс отображения для карточки.
* `constructor(protected blockName: string, container: HTMLElement, events: IEvents, actions?: ICardActions)` - принимает название блока, объект контейнера, брокер события и доступные события для привязки.<br>
Поля:
* `_title: HTMLElement` - элемент названия карточки.
* `_description?: HTMLElement` - элемент описания карточки.
* `_image: HTMLImageElement` - элемент изображения карточки.
* `_category: HTMLElement` - элемент категории карточки.
* `_price: HTMLElement` - элемент стоимости лота.
* `_button: HTMLButtonElement` - элемент открытия карточки.<br>
Методы: 
- `set title(value: IItemCategory)` - назначает название карточки.
- `set description(value: string)` - назначает описание карточки.
- `set image(value: string)` - назначает изображение карточки.
- `set category(value: string)` - назначает категорию карточки.
- `set price(value: number)` - назначает цену карточки.
- `set button(value: string)` -назначает кнопку открытия карточки.

### Класс `ShoppingCartItem`
Класс отображение для элементов корзины.
* `constructor(container: HTMLElement, events: IEvents, actions?: ICardActions)` - принимает объект контейнера, брокер события и доступные события для привязки.<br>
Поля:
* `_index: HTMLElement` - элемент порядкового номера элемента в корзине.
* `_title: HTMLElement` - элемент названия элемента в корзине.
* `_price: HTMLElement` - элемент стоимости элемента в корзине.
* `_deleteButton: HTMLButtonElement` - элемент кнопки удаления элемента из корзины.<br>
Методы:
- `set index(value: number)` -назначает номер элемента в корзине.
- `set title(value: string)` -назначает название элемента в корзине.
- `set price(value: number)` -назначает цену элемента в корзине.

### Класс `Form<T>` 
Класс отображения для базовой формы. На данный класс на весь контейнер отображения привязывается событие отслеживание `input`, для того, чтобы можно было вызвать события `container.field:change`, `container:submit`
* `constructor(container: HTMLElement, evens: IEvents)` - принимает родительский контейнер для элемента (темплейта) и брокер событий.<br>
Поля:
* `_submit: HTMLButtonElement;` - элемент кнопки отправки формы.
* `_errors: HTMLElement` - элемент блока отображения ошибок в форме.<br>
Методы:
- `protected onInputChange(field: keyof T, value: string): void` - генерирует событие при каком-либо изменении в поле ввода.
- `set valid(value: boolean)` - назначает закрытие/открытие формы.
- `set errors(value: string)` - назначает текст ошибки.
- `render(state: Partial<T> & IFormState): HTMLFormElement` - возращает обработанный контейнер.

### Класс `DeliveryForm` 
Класс отображения для формы оформления заказа с адресом и способом оплаты, наследуется от класса `Form`.
* `constructor(container: HTMLElement, evens: IEvents)` - принимает родительский контейнер для элемента (темплейта) и брокер событий.<br>
Поля:
* `_paymentContainer: HTMLDivElement` - элемент контейнера оплаты.
* `_paymentButtons: HTMLButtonElement[]` - элемент кнопок оплаты.<br>
Методы:
- `setClassPaymentMethod(className: string): void` - управляет выделением кнопки в зависимости от способа оплаты.
- `set payment(value: string)` - назначает способ оплаты.
- `set address(value: IPaymentType)` - назначает адрес оплаты.

### Класс `ContactsForm` 
Класс отображения для формы оформления заказа с информацией, наследуется от класса `Form`.
* `constructor(container: HTMLElement, evens: IEvents)` - принимает родительский контейнер для элемента (темплейта) и брокер событий.<br>
Методы:
- `set phone(value: string)` - назначает номер пользователя для формы.
- `set email(value: string)` - назначает электронную почту пользователя для формы.

### Класс `Success` 
Класс отображения для информации об успешном оформленном заказе.
* `constructor(container: HTMLElement, events: IEvents, actions: ISuccessActions)` - принимает объект контейнера, брокер события и доступные события для привязки.<br>
Поля:
* `_close: HTMLElement` - элемент закрытия окна.
* `_total: HTMLElement` - элемент общей суммы.<br>
Методы: 
- `set total(value: number)` - назначает списанную сумму.

## Внешние связи

### LarekAPI
Класс взаимодействия с API-сервером.
* `constructor(cdn: string, baseUrl: string, options?: RequestInit)` - принимает используемый домен со статикой, домен сервера и параметры запроса.<br>
Поля:
* `private cdn: string` - используемый домен со статикой.<br>
Методы:
- `getLotItem(id: string): Promise<IItem>` - получает всю информация для конкертного лота.
- `getLotList: Promise<IItem[]>` - выгружает все доступные лоты.
- `postOrderLots(order: IOrderAPI): Promise<IOrderResult>` -отправляет запрос на оформление заказа на сервер.

## Ключевые типы данных
```typescript
interface IAppState {
	_catalog: IItem[];
	_order: Order;
	_preview: IItem;
	isItemInShoppingCart: (item: IItem) => boolean;
	clearShoppingCart: () => void;
	getTotalAmount: () => string[];
	getShoppingCartIds: () => string[];
	initOrder: () => void;
}

interface IItem {
	id: number;
	title: string;
	description?: string;
	image: string;
	category: string;
	price: number;
	isOrdered: boolean;
	placeInShoppingCart: () => void;
	removeFromShoppingCart: () => void;
}

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

type IPaymentType = 'card' | 'cash'

interface IOrderDeliveryForm {
	payment: IPaymentType;
	address: string;
}

interface IOrderContactsForm {
		email: string; 
		phone: string;
}

type IOrderForm = IOrderDeliveryForm & IOrderContactsForm;
```

## Размещение в сети
Ссылка на репозиторий: https://github.com/pudgekaramelkin/web-larek-frontend

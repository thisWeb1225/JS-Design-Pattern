# 觀察者模式 Observer

觀察者模式是一種行為型的設計模式，他用於物件之間，建立一對多或一對一的依賴關係，當一個物件發生狀態改變時，所有依賴於它的物件都能夠自動接收到通知並做出相應的更新。

舉例來說，你在咖啡廳點了一杯咖啡，當咖啡做好時，會有震動器自動通知你取餐，你沒必要站在櫃檯旁邊等店員作完咖啡，這就是一種觀察者模式。

再舉個例子，你很喜歡一家服飾店，每天都要去店家確定他們有沒有進新衣服，這樣很麻煩，所以它們進新衣服時，會用 email 通知你，這也是一種觀察者模式。

## 觀察者模式中的兩個角色：
在觀察者模式中，有兩種主要的角色：

1. 主題（Subject）：也被稱為可觀察物件（Observable），它是被觀察的對象。主題有著一份觀察者清單，並提供方法來註冊、刪除和通知觀察者。
2. 觀察者（Observer）：觀察者是依賴於主題的物件，它們在主題的狀態發生變化時接收通知並執行相應的操作。
   
```ts
class Subject {
  private state: number;
  private observers: Observer[];

  constructor () {
    this.state = 0;
    this.observers = [];
  }

  getState() {
    return this.state;
  }

  setState(state: number) {
    this.state = state;
    this.notifyAllObservers();
  }

  notifyAllObservers() {
    // 循環全部的 observers
    this.observers.forEach(observer => {
      observer.update();
    })
  }

  attach(observer: Observer) {
    this.observers.push(observer)
  }
}

class Observer {
  private name: string;
  private subject: Subject;

  constructor (name: string, subject: Subject) {
    this.name = name;
    this.subject = subject;
    this.subject.attach(this);
  }

  update() {
    console.log(`${this.name} update, state: ${this.subject.getState()}`)
  }
}

const subject = new Subject();
const object1 = new Observer('obj1', subject);

subject.setState(1); // obj1 update, state: 1
```

可以發現當主題 `subject` 更新時，會自動通知 `obj1`，並打印 `subject` 的狀態。

## 實際的應用例子
在前端中有個非常常用的觀察者模式例子，也就是事件綁定

```js
const btn = document.querySelector('.btn');
btn.addEventListener('click', () => console.log('btn'));
```
當用戶點擊按鈕時，打印 `console.log('btn')`，這就是一個觀察者模式的經典應用。

除了事件以外，前端也有其它應用的例子，假設現在有個商城網站，網站中有 header、nav、cart(購物車)、消息列表等模塊(module)，而這幾個模塊是否渲染的前提是，必須先用 ajax 非同步請求來獲取使用者的登錄資訊，這是很常發生的事情，例如 header 可能要顯示使用者的頭像。

但 ajax 什麼時候返回訊息我們無法確定，雖然可以利用回調函數來解決這個問題，不過更重要的是，我們不知道除了這些模塊，未來還有沒有其他模塊需要使用者的資訊，如果利用回調函數控制這些模塊渲染，容易發生強耦合:

所以我們可以利用觀察者模式來解決強偶合的問題

```ts
// 定義觀察者介面
interface Observer {
  update(data: any): void;
}

// 定義主題介面
interface Subject {
  registerObserver(observer: Observer): void;
  removeObserver(observer: Observer): void;
  notifyObservers(data: any): void;
}

// 實現主題類別
class UserLoginSubject implements Subject {
  private observers: Observer[] = [];
  private loggedIn: boolean = false;

  registerObserver(observer: Observer): void {
    this.observers.push(observer);
  }

  removeObserver(observer: Observer): void {
    const index = this.observers.indexOf(observer);
    if (index !== -1) {
      this.observers.splice(index, 1);
    }
  }

  notifyObservers(data: any): void {
    for (const observer of this.observers) {
      observer.update(data);
    }
  }

  setLoggedIn(loggedIn: boolean): void {
    this.loggedIn = loggedIn;
    this.notifyObservers(this.loggedIn);
  }
}

// 實現觀察者類別 - Header 模塊
class HeaderModule implements Observer {
  update(data: any): void {
    if (data) {
      console.log('Header 模塊：用戶已登錄');
      // 執行 Header 模塊的相應操作
    } else {
      console.log('Header 模塊：用戶未登錄');
      // 執行 Header 模塊的相應操作
    }
  }
}

// 實現觀察者類別 - Nav 模塊
class NavModule implements Observer {
  update(data: any): void {
    if (data) {
      console.log('Nav 模塊：用戶已登錄');
      // 執行 Nav 模塊的相應操作
    } else {
      console.log('Nav 模塊：用戶未登錄');
      // 執行 Nav 模塊的相應操作
    }
  }
}

// 實現觀察者類別 - Cart 模塊
class CartModule implements Observer {
  update(data: any): void {
    if (data) {
      console.log('Cart 模塊：用戶已登錄');
      // 執行 Cart 模塊的相應操作
    } else {
      console.log('Cart 模塊：用戶未登錄');
      // 執行 Cart 模塊的相應操作
    }
  }
}

// 實現觀察者類別 - 消息列表模塊
class MessageListModule implements Observer {
  update(data: any): void {
    if (data) {
      console.log('消息列表模塊：用戶已登錄');
      // 執行消息列表模塊的相應操作
    } else {
      console.log('消息列表模塊：用戶未登錄');
      // 執行消息列表模塊的相應操作
    }
  }
}

// 創建主題實例
const userLoginSubject = new UserLoginSubject();

// 創建觀察者實例
const headerModule = new HeaderModule();
const navModule = new NavModule();
const cartModule = new CartModule();
const messageListModule = new MessageListModule();

// 註冊觀察者
userLoginSubject.registerObserver(headerModule);
userLoginSubject.registerObserver(navModule);
userLoginSubject.registerObserver(cartModule);
userLoginSubject.registerObserver(messageListModule);

// 模擬使用者登錄資訊的非同步請求
function simulateAjaxRequest(): void {
  // 假設這裡發送了 AJAX 請求獲取使用者的登錄資訊
  // 假設獲取到的資訊為 { loggedIn: true } 表示用戶已登錄
  const response = { loggedIn: true };

  // 執行回呼函式，模擬 AJAX 請求完成後的處理
  setTimeout(() => {
    userLoginSubject.setLoggedIn(response.loggedIn);
  }, 2000);
}

// 模擬執行網站初始化時的操作
function initWebsite(): void {
  simulateAjaxRequest();
}

// 執行網站初始化
initWebsite();

// "Header 模塊：用戶已登錄" 
// "Nav 模塊：用戶已登錄" 
// "Cart 模塊：用戶已登錄" 
// "消息列表模塊：用戶已登錄" 
```

## 發布訂閱模式
有一種和觀察者很類似的模式，稱為發布訂閱，這兩者的差別是實現二者所需的角色數量。

觀察者模式本身只需要2個角色便可成型，即觀察者和主題(被觀察者)，其中主題是重點。

而發布訂閱需要至少3個角色來組成，包括發布者、訂閱者和發布訂閱中心，其中發布訂閱中心是重點。

```js
class PubSub {
  messages: { [key: string]: any[] };
  listeners: { [key: string]: Function[] };

  constructor() {
    this.messages = {}; // 儲存不同類型訊息的容器
    this.listeners = {}; // 儲存不同類型訂閱者的容器
  }

  publish(type: string, content: any) {
    const existContent = this.messages[type];
    if (!existContent) {
      this.messages[type] = [];
    }
    this.messages[type].push(content);
  }

  subscribe(type: string, cb: Function) {
    const existListener = this.listeners[type];
    if (!existListener) {
      this.listeners[type] = [];
    }
    this.listeners[type].push(cb);
  }

  notify(type: string) {
    const messages = this.messages[type];
    const subscribers = this.listeners[type] || [];
    subscribers.forEach((cb) => cb(messages));
  }
}

class Publisher {
  name: string;
  context: PubSub;

  constructor(name: string, context: PubSub) {
    this.name = name;
    this.context = context;
  }

  publish(type: string, content: any) {
    this.context.publish(type, content);
  }
}

class Subscriber {
  name: string;
  context: PubSub;

  constructor(name: string, context: PubSub) {
    this.name = name;
    this.context = context;
  }

  subscribe(type: string, cb: Function) {
    this.context.subscribe(type, cb);
  }
}

function main() {
  const TYPE_A = 'music';
  const TYPE_B = 'movie';
  const TYPE_C = 'novel';

  const pubsub = new PubSub();

  const publisherA = new Publisher('publisherA', pubsub);
  publisherA.publish(TYPE_A, 'we are young');
  publisherA.publish(TYPE_B, 'the silicon valley');
  const publisherB = new Publisher('publisherB', pubsub);
  publisherB.publish(TYPE_A, 'stronger');
  const publisherC = new Publisher('publisherC', pubsub);
  publisherC.publish(TYPE_B, 'imitation game');

  const subscriberA = new Subscriber('subscriberA', pubsub);
  subscriberA.subscribe(TYPE_A, (res: any[]) => {
    console.log('subscriberA received', res);
  });
  const subscriberB = new Subscriber('subscriberB', pubsub);
  subscriberB.subscribe(TYPE_C, (res: any[]) => {
    console.log('subscriberB received', res);
  });
  const subscriberC = new Subscriber('subscriberC', pubsub);
  subscriberC.subscribe(TYPE_B, (res: any[]) => {
    console.log('subscriberC received', res);
  });

  pubsub.notify(TYPE_A);
  pubsub.notify(TYPE_B);
  pubsub.notify(TYPE_C);
}

main();


// subscriberA received [ 'we are young', 'stronger' ]
// subscriberC received [ 'the silicon valley', 'imitation game' ]
// subscriberB received undefined
```

## 小結
今天介紹了觀察者模式，和和他很像的發布訂閱模式，其實它們主要的差別在於角色的數量，觀察者模式是直接讓主題依賴觀察者，而發布訂閱是透過管理中心來管理觀察者和訂閱者。
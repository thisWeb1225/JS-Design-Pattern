# 單例模式 Singleton

## 甚麼是單例模式？
單例模式的定義是：**一個類只有一個實例，並提供一個訪問它的全局訪問點**。舉例來說，瀏覽器的 window 物件。

## 實現單例模式
```js
class Singleton {
  constructor(name) {
    this.name = name;
  }

  getName() {
    console.log(this.name)
  }

  static getInstance(name) {
    if (!this.instance) {
      this.instance = new Singleton(name);
    }
    return this.instance
  }
}

const a = Singleton.getInstance('a');
const b = Singleton.getInstance('b');

console.log(a === b) // true
```

這段程式碼雖然已經實現單例模式了，但還有一個問題，就是**不透明性**，使用者必須要知道它是一個單例類，且跟以往用 new XXX 的方式不同，這裡偏要用 getInstance 來創建實例。

## 透明的單例模式
```js
class CreateDiv {
  constructor(html) {
    if (CreateDiv.instance) {
      return CreateDiv.instance;
    }
    CreateDiv.html = html;
    CreateDiv.init();
    CreateDiv.instance = this;
  }

  static init() {
    const div = document.createElement('div');
    div.innerHTML = CreateDiv.html;
    document.body.appendChild(div);
  }
}

const a = new CreateDiv('a');
const b = new CreateDiv('b');

console.log(a === b); // true
```
這段程式碼中，`CreateDiv` 實際上負責兩件事情，第一是創建物件和執行初始化 `init` 方法，第二是保證只有一個物件，雖然我們還沒接觸過**單一職責原則**，但感覺得出來這是不好的做法，起碼這個 class 看起來很奇怪。

所以我們可以額外寫一個類，這個類負責保證只會有一個 `CreateDiv` 實例。

## 用代理模式實現單例模式
我們可以透過代理模式的方式，只訪問代理的物件，而這個代理物件負責保證只有一個 `CreateDiv` 實例:

```js
class CreateDiv {
  constructor(html) {
    CreateDiv.html = html;
    CreateDiv.init()
  }
  
  static init() {
    const div = document.createElement('div');
    div.innerHTML = CreateDiv.html;
    document.body.appendChild(div); 
  }
}

class ProxySingletonCreateDiv {
  constructor(html) {
    if (!ProxySingletonCreateDiv.instance) {
      ProxySingletonCreateDiv.instance = new CreateDiv(html)
    }
    return ProxySingletonCreateDiv.instance;
  }
}

const a = new ProxySingletonCreateDiv('a'); 
const b = new ProxySingletonCreateDiv('b'); 

console.log(a === b); // true
```

## 惰性單例模式
惰性單例是指需要的時候才創造物件實例。

舉例來說，一個網站可能有一個懸浮的登錄視窗，很明顯這個登陸浮窗是唯一的，不會同時出現兩個登陸浮窗，這種時候就可以運用單例模式，不過我們需要再點擊登陸時，才創建這個登陸浮窗，而非一進入這個網站就創建登陸浮窗，因為並不是每個人進入網站都會執行登陸動作，也許它只是要看看文章，所以需要用到惰性單例。

最簡單的辦法是在按鈕上添加點擊事件，點擊之後創建登陸視窗。
```js
class LoginLayer {
  constructor() {
    LoginLayer.init();
  }

  static init() {
    if (!this.instance) {
      const div = document.createElement('div');
      div.innerHTML = '這是登陸視窗';
      document.body.appendChild(div);
      this.instance = div;
    }

    return this.instance;
  }

  static hide() {
    this.instance.style.display = 'none';
  }
}

const createLoginLayer = () => {
  new LoginLayer();
};

btn.addEventListener('click', createLoginLayer);
```

## 通用的惰性單例模式
我們完成惰性單例了，但它其實還有一個問題，如果我們需要創建另一個不同功能的懸浮視窗，我們需要再寫一次幾乎一樣的程式碼，這樣絕對不是一件好事。

```js
class Singleton {
  constructor(fn) {
    let result;
    return function() {
      return result || (result = fn.apply(this, arguments));
    };
  }
}

class LoginLayer {
  constructor() {
    const div = document.createElement('div');
    div.innerHTML = '這是登陸視窗';
    document.body.appendChild(div);
    return div;
  }
}

class AnotherLayer {
  constructor() {
    const div = document.createElement('div');
    div.innerHTML = '這是其它視窗';
    document.body.appendChild(div);
    return div;
  }
}

const createSingleLoginLayer = new Singleton(LoginLayer);
const createAnotherLoginLayer = new Singleton(AnotherLayer);
```

## 利用閉包和 IIFE 製作簡單的單例物件
在很多函式庫都會看到閉包和 IIFE 結合使用，製作私有變數，其實這樣也算是一種單例模式，以上面登錄模塊的例子:

```js
const LoginLayer = (function() {
  const div = document.createElement('div');

  const init = () => {
    div.innerHTML = '這是登陸視窗';
    document.body.appendChild(div);
  }

  const hide = () => {
    div.style.display = 'none';
  }

  return {
    init,
    hide,
  }
})();

LoginLayer.init();
```
因為 IIFE 會馬上執行函數，並返回包含 `init` 和 `hide` 兩個方法的物件，所以只會有一個 `LoginLayer` 物件。
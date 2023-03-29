# 單例模式 Singleton

## 甚麼是單例模式？
單例模式的定義是：**一個類只有一個實例，並提供一個訪問它的全局訪問點**。舉例來說，瀏覽器的 window 物件。

## 實現單例模式
```js
class Singleton {
  constructor(name) {
    this.name = name;
    this.instance = null;
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
      return CreateDiv.instance
    }
    this.html = html;
    CreateDiv.init();
    CreateDiv.instance = this;
  }

  static init() {
    const div = document.createElement('div');
    div.innerHTML = this.html;
    document.body.appendChild(div);
  }
}

const a = new CreateDiv('sven1');
const b = new CreateDiv('sven2');

console.log(a === b);
```
這段程式碼中，`CreateDiv` 實際上負責兩件事情，第一是創建物件和執行初始化 `init` 方法，第二是保證只有一個物件，雖然我們還沒接觸過**單一職責原則**，但感覺得出來這是不好的做法，起碼這個 class 看起來很奇怪。

## 用代理模式實現單例模式
```js
class CreateDiv {
  constructor(html) {
    this.html = html;
    CreateDiv.init()
  }
  
  static init() {
    const div = document.createElement('div');
    div.innerHTML = this.html;
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
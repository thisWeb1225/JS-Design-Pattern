# 命令模式 command

命令模式最常見的應用場景是: 有時候需要像某些對象發送請求，但不知道接收者是誰，也不知道被請求的操作是什麼，此時希望用一種鬆耦合的方式設計程式，使得發送者和接收者能夠消除彼此之間的耦合關係。

舉例來說，一個大型專案有數十個 button 按鈕，因此分工成兩部分，一個工程師負責繪製這些按鈕，另一個負責處理按鈕的具體行為。

此時對於繪製 button 的工程師並不知道這些按鈕的功用，它只知道點擊這些按鈕會發生一些事情，那在繪製完按鈕後，應該如何給它綁定 onclick 事件呢？

此時就可以運用命令模式:

```html
<button class="button1">按鈕一</button>
<button class="button2">按鈕二</button>
<button class="button3">按鈕三</button>
```

```js
const button1 = document.querySelector('.button1')
const button2 = document.querySelector('.button2')
const button3 = document.querySelector('.button3')
```
接著定義 `setCommand()` 函數
```js
const setCommand = (button, func) => {
  button.addEventListner('click', () => {
    func();
  })
}
```
此時另一名工程師就可以將寫好的按鈕事件綁定到按鈕上，比如一個主按鈕負責刷新菜單，另外兩個按鈕負責稱加/刪除子菜單
```js
const MenuBar = {
  refresh() {
    console.log('刷新 menu')
  }
}

const SubMenu = {
  add() {
    console.log('增加 submenu');
  },

  delete() {
    console.log('刪除 submenu');
  }
}

setCommand(button1, MenuBar.refresh());
setCommand(button2, SubMenu.add());
setCommand(button3, SubMenu.delete());
```
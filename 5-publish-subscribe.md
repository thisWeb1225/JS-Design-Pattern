# 發布 - 訂閱模式 Publish - Subscribe

假設有個商城網站，網站中有 header、nav、cart(購物車)、消息列表等模塊(module)，而這幾個模塊是否渲染的前提是，必須先用 ajax 非同步請求來獲取使用者的登錄資訊，這是很常發生的事情，例如 header 可能要顯示使用者的頭像。

但 ajax 什麼時候返回訊息我們無法確定，雖然可以利用回調函數來解決這個問題，不過更重要的是，我們不知道除了這些模塊，未來還有沒有其他模塊需要使用者的資訊，如果利用回調函數控制這些模塊渲染，容易發生強耦合:

```js
login.succ(function(data){ 
  header.setAvatar( data.avatar); // 设置 header 模組的頭像
  message.refresh(); // 刷新消息列表
  cart.refresh(); // 刷新購物車商品
}); 
```

如果有一天需要增加收貨地址的模塊，就會需要在增加:

```js
login.succ(function( data ){ 
  header.setAvatar( data.avatar); 
  message.refresh(); 
  cart.refresh(); 
  address.refresh(); // 增加這行程式碼
});
```
我們會在未來的維護不斷去更新這些煩人的程式碼，而且 header 裡的 setAvatar 也不能亂改名稱，不然這裡的程式碼又一起更改，這就是耦合現象。

所以我們可以使用發布訂閱模式重寫，當使用者登陸成功後，登陸模塊只需要發布登陸成功的消息，其他模塊就會自動接收到這些消息，進而去處理他們負責的程式碼

```js
$.ajax( 'http://xxx.com?login', (data) => { // 登陸成功
  login.trigger( 'loginSucc', data); // 發布登陸成功的消息
}); 
```

其它模塊監聽登陸成功的消息:

```js
const header = (function(){ // header 模塊
 login.listen( 'loginSucc', function( data){ 
 header.setAvatar( data.avatar ); 
 }); 

 return { 
 setAvatar: function( data ){ 
 console.log( '設置 header 模塊的头像' ); 
 } 
 } 
})();  
```
此時我們不管是要更換 `header` 的變數名字，還是要更改 `setAvatar` 函數名稱，都不需要更動 `login` 模塊。

## 全局的發布訂閱物件
# 工廠模式方法 2-Factory-Method
當需求越來越多，簡單工廠模式已經無法負荷時，就可以將每個需求單獨寫成基類。

## 安全模式類別
假設現在有一個類別叫做 `Demo`，如果其它人不知道它是類別，可能就會沒有加上 `new` 關鍵字，直接寫 `const d = Demo()`，為了避免這種情況發生，我們可以在類別裡面加上判斷:

```js
const Demo = function() {
  if ((this instanceof Demo) === false) {
    return new Demo()
  }
}
```
## 安全的工廠方法
```js
const Factory = function(type, content) {
  if (this instanceof Factory) {
    const s = new this[type](content);
    return s;
  } else {
    return new Factory(type, content);
  }
}

Factory.prototype = {
  product1: function(content) {
    this.type = 'product1';
    this.content = content;
  },
  product2: function(content) {
    this.type = 'product2';
    this.content = content;
  },
  product3: function(content) {
    this.type = 'product3';
    this.content = content;
  },
}

const product1 = new Factory('product1', 'content1')
```
這樣當要新增商品時，就只要修改一處地方即可，不用像上篇文一樣要修改兩處地方。

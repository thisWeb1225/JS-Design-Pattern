# 代理模式
代理模式就像明星的經紀人，我們在對目標物件進行操作時，代理物件會進行攔截，對其進行一些額外的管理、擴展或保護...等操作。

客戶 -> 代理 -> 本體

## 代理的意義
先來看看不使用代理模式下的圖片懶加載：
```js
class MyImage {
  constructor() {
    this.imgNode = document.createElement('img');
    document.body.appendChild(this.imgNode);
    this.img = new Image();
    this.img.onload = () => {
      this.imgNode.src = this.img.src;
    };
  }
  
  setSrc(src) {
    this.imgNode.src = '本地的 lodaing gif 路徑'; 
    this.img.src = src; 
  }
}

const myImage = new MyImage();
myImage.setSrc('https://.../img.jpg');
```
雖然成功做出懶加載的效果，但這不符合單一職責原則。

單一職責原則指是，一個類（通常也包括物件或函數）而言，應該**僅有一個引起它變
化的原因**。如果一個對象承擔了多項職責，就意味著這個物件將變得巨大，引起它變化的原因可能會有多個。面向對象設計鼓勵將行為分佈到細粒度的對象之中，如果一個物件承擔的職責過多，等於把這些職責耦合到了一起，這種耦合會導致脆弱和低內聚的設計。當變化發生時，設計可能會遭到意外的破壞。

職責被定義為“引起變化的原因”。上段代碼中的 MyImage 對象除了負責給 img 節點設置 src外，還要負責預加載圖片。我們在處理其中一個職責時，有可能因為其強耦合性影響另外一個職責的實現。

實際上，我們需要的只是給 **img 節點設置 src，預加載圖片只是一個錦上添花的功能。如果
能把這個操作放在另一個物件裡面，自然是一個非常好的方法。**於是代理的作用在這裡就體現出來了，**代理負責預加載圖片**，預加載的操作完成之後，把請求重新交給本體 MyImage。

```js
class MyImage {
  constructor() {
    this.imgNode = document.createElement('img');
    document.body.appendChild(this.imgNode);
  }
  
  setSrc(src) {
    this.imgNode.src = src;
  }
}

class ProxyImage {
  constructor() {
    this.img = new Image();
    this.img.onload = () => {
      this.myImage.setSrc(this.img.src);
    }
    this.myImage = new MyImage();
  }

  setSrc(src) {
    this.myImage.setSrc('本地的 loading gif 路徑');
    this.img.src = src;
  }
}

const proxyImage = new ProxyImage();
proxyImage.setSrc('https://.../img.jpg');
```
## 快取代理
快取可以為一些開銷大的運算結果提供暫時的儲存，若下次運算傳遞進來的參數跟之前一樣，則可以返回前面儲存的結果。

以數字相乘為例：
```js
const mult = (...nums) => {
  return nums.reduce((total, val) => total * val, 1);
}

mult( 2, 3 ); // 6 
mult( 2, 3, 4 ); // 24
```
現在加入快取代理函數：
```js
// 定義了一個代理函數 proxyMult
const proxyMult = (function(){ 
  // 定義一個緩存對象 cache
  const cache = {}; 
  return function(...nums){ 
    // 把傳入的參數轉化為字串
    const strNums = nums.join(',');
    // 如果緩存中已經存在對應的結果，直接返回緩存中的結果
    if ( strNums in cache ){ 
      return cache[ strNums ]; 
    } 
    // 否則，計算結果並且保存到緩存中
    return cache[ strNums ] = mult(...nums); 
  } 
})(); 

// 第一次調用代理函數，會計算乘積 1*2*3*4=24，並且把結果保存到緩存中
proxyMult( 1, 2, 3, 4 ); // 输出：24 
```


# 策略模式 Strategy
在程式設計中，我們要做一種功能可以有多種方案可以實現，這些方案可以隨意替換，這種解決方案就是策略模式：**定義一系列的算法，把它們一個個封裝起來，並且使它們可以相互替換**

## 表單驗證
在網站中，提交表單是非常常見的功能，我們利用策略模式來完成一個表單驗證。

假設我們再送出表單前，有幾條驗證邏輯：
1. 使用者名稱不能為空
2. 密碼長度不能少於 6 位數
3. 手機號碼必須符合格式

基於這幾條邏輯，我們可以寫出以下程式碼：
```html
<form action="http://xxx.com/register" id="registerForm" method="post"> 
 请输入使用者名稱：<input type="text" name="userName"/ > 
 请输入密碼：<input type="text" name="password"/ >
 请输入手機號碼：<input type="text" name="phoneNumber"/ > 
 <button>送出</button> 
</form> 
```
```js
const registerFrom = document.querySelcetor('#registerFrom');

registerFrom.onsubmit = () => {
  if ( registerForm.userName.value === '' ){ 
    alert ( '使用者名稱不能为空' ); 
    return false; 
  } 
  if ( registerForm.password.value.length < 6 ){ 
    alert ( '密碼長度不能少於 6 位' ); 
    return false; 
  } 
 if (!/^09\d{8}$/.test(registerForm.phoneNumber.value)) { 
  alert ( '手機號碼格式不正确' ); 
  return false; 
 }
}
```
這是很常見的一種寫法，它的缺點很明顯：
1. registerForm.onsubmit 函數龐大，包含很多 if-else 語法
2. registerForm.onsubmit 函數缺乏彈性，如果增加一種新的驗證規則，或是想把密碼的長度驗證從 6 改成 8，必須修改函數內部的程式碼，這違反開放-封閉原則
3. 算法的復用性很差，如果在程序中有多個表單，他們有類似的驗證規則，那我們很可能要到處複製這些程式碼

所以我們要根據著幾個缺點來改善：  
1. 將驗證方法獨立出來，方便閱讀及維護
2. 新增一個 Validator 類，方便對表單新增規則及驗證，並增加複用性。

## 用策略模式重構表單驗證
接著我們使用策略模式來重寫整個表單驗證的邏輯，我們可以先將驗證表單的邏輯封裝成一個物件：
```js
/**
 * 策略物件
 */
const formStrategies = {
  isNotEmpty: function(value, errorMsg) {
    if (value === '') {
      return errorMsg;
    }
  },

  minLength: function(value, minLength, erroeMsg) {
    if (value.length < minLength) {
      return errorMsg;
    }
  },

  isMobile: function(value, errorMsg) {
    if (!/^09\d{8}$/.test(value)) {
      return errorMsg;
    }
  }
}
```

接著我們想把驗證表單的邏輯簡化成這樣：
```js
/**
 * 驗證表單邏輯處理
 */
const registerFrom = document.querySelector('#registerFrom');

const validataForm = function() {
  const validator = new Validator();

  const {userName, password, phoneNumber} = registerForm;

  validator.add(userName, 'isNotEmpty', '使用者名稱不能為空');
  validator.add(password, 'minLength:6', '密碼常不能少於 6 位'); 
  validator.add(phoneNumber, 'isMobile', '手機號碼格式不正確'); 
  const errorMsg = validator.start(); // 獲得驗證結果

  return errorMsg; // 返回驗證結果
}

registerFrom.addEventListener('submit', (event) => {
  const errorMsg = validataForm();
  if (errorMsg) {
    alert(erroMsg);
    event.preventDefault(); // 阻止表單提交
  }
})
```
這樣的好處是，如果我們需要更改密碼長度，或是需要更改錯誤訊息，可以非常方便的修改，復用性也非常強：
```js
validator.add(password, 'minLength:6', '密碼常不能少於 6 位'); 
// 改成
validator.add(password, 'minLength:8', '密碼常不能少於 8 位'); 
```
可以發現我們需要一個類 class 來實現，這個類裡面需要封裝兩個方法：  
第一個是 `add`，它接收三個參數，第一是 DOM 元素，第二個是策略方法，第三個是錯誤訊息；  
第二個是 `start` 函數，它會驗證每個輸入框的規則，如果不正確，會直接返回錯誤訊息。

接著動手來寫 Validator 類吧
```js
/**
 * Validator 類
 */
class Validator {
  constructor() {
    this.rules = [] // 保存驗證規則
  }

  add(dom, rule, errorMsg) {
    // 將策略模式和參數解構出來
    const [strategy, params] = rule.split(':');
    // 將驗證方法存入陣列
    this.rules.push(() => {
      return formStrategies[strategy].call(dom, dom.value, errorMsg)
    });
  },

  start() {
    // 分別執行驗證方法，如有不正確直接返回錯誤訊息
    for (const validatorFunc of this.rules) {
      const msg = validatorFunc();
      if (msg) return msg;
    }
  }
}

```

## 給某個輸入框添加多種驗證規則
上面的策略模式已經很好了，但有個缺點是每個輸入框只能對應一種驗證規則，比如使用者不能為空，也不能少於 8 個字母，想要改寫成：
```js
validator.add(userName, [
  {
    strategy: 'isNotEmpty',
    errorMsg: '使用者名稱不能為空',
  },
  {
    strategy: 'minLength:8',
    errorMsg: '使用者長度不能小於 8 位',
  }
])
```
那我們可以將 Validator 類改寫成：
```js
class Validator {
  constructor() {
    this.rules = [] // 保存驗證規則
  }

  add(dom, rules, errorMsg) {
    rules.forEach(rule => {
      const [strategy, params] = rule.split(':');
      this.rules.push(() => {
        return formStrategies[strategy].call(dom, dom.value, errorMsg)
      });
    })
  },

  start() {
     for (const validatorFunc of this.rules) {
      const msg = validatorFunc();
      if (msg) return msg;
    }
  }
}
```

## 策略模式的優缺點
優點：  
* 避免多個 if-else 條件語句
* 將算法封裝在獨立的 strategy 中，使它們易於切換、理解、擴展
* 複用性強

缺點：
* 在程式碼中會增加策略的類和物件，初次閱讀成本較高
* 必須了解所有的策略和它門之間的不同點，才方便複用

不過總的來說，使用策略模式對於後續的維護是利大於弊的，你也可以在自己的專案中嘗試用看看喔！
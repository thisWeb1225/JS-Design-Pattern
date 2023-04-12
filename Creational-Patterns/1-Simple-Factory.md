# 簡單工廠模式 Simple Factory Pattern

簡單工廠模式是工廠模式最簡單的一種形式，簡單工廠模式通常包括**一個工廠類別**和**多個產品類別**，工廠類別根據傳入的參數創建對應的產品實例。

假設我們一個網站有多種提示框，分別為警告框、確認框、提示框等三種，可以知道這三種提示框一定有一個共同的屬性，也就是文字內容，還有一個共同的顯示行為，但他們分別又有不同的行為邏輯，此時就可以利用簡單工廠模式:

```js
class Pop {
  constructor(content) {
    this.content = content;
  }
  
  show() {
    // show pop
  }
}

class AlertPop extends Pop {
  constructor(content) {
    super(content);
  }
  
  alert() {
    // handle alert
  }
}

class PromptPop extends Pop {
  constructor(content) {
    super(content);
  }
  
  prompt() {
    // handle prompt
  }
}

class ConfirmPop extends Pop {
  constructor(content) {
    super(content);
  }
  
  confirm() {
    // handle confirm
  }
}

function createPop(type, text) {
  if (type === 'alert') {
    return new AlertPop(text);
  } else if (type === 'prompt') {
    return new PromptPop(text);
  } else if (type === 'confirm') {
    return new ConfirmPop(text);
  }
}

const userNameAlert = createPop('alert', '使用者名稱最多 10 個字');
```

簡單工廠模式的好處是能夠將產品的創建和使用分離開來，從而降低類別之間的耦合性，使系統更加靈活和易於擴展。
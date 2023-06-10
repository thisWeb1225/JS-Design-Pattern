# 裝飾器模式 Decorator
裝飾器模式是在不改變一個對象原有的結構和功能下，為其添加新功能，比如有個對象原本有a、b、c 三種方法，現在要為其添加 d、e 方法，就可以使用裝飾器模式。

以現實生活舉例，手機殼就是一個是裝飾器模式，他既不改變手機的功能，又為其添加新的功能，像是保護手機、支撐看劇等等。

## 購物車應用
假設我們現在在開發一個購物車應用程序，我們需要在某些產品原有的價格上添加促銷價格，或是添加運費，這時候就可以使用裝飾器模式

```ts
// 定義接口
interface Product {
  getPrice(): number;
}

// 產品的具體類
// 並用 getPrice() 來返回價格
class ConcreteProduct implements Product {
  private price: number;

  constructor(price: number) {
    this.price = price;
  }

  getPrice(): number {
    return this.price;
  }
}
```

現在我們用裝飾器模式擴展產品的功能，我們先定義裝飾器的介面
 
```ts
// 定義裝飾器的介面
interface ProductDecorator extends Product {
  decorate(): void;
}

/**
 * 實現具體的裝飾器類別
 */
// 增加促銷產品
class PromotionDecorator implements ProductDecorator {
  // 定義產品本身，因為我們不想改變產品對象，所以會將它整個當成參數傳入
  private product: Product;

  constructor(product: Product) {
    this.product = product;
  }

  getPrice(): number {
    // 在產品價格上應用促銷折扣
    const originalPrice = this.product.getPrice();
    const discountedPrice = originalPrice * 0.9; // 90% off
    return discountedPrice;
  }

  decorate(): void {
    if (this.product instanceof PromotionDecorator) {
      this.product.decorate();
    }
    // 添加促銷標籤或其他額外的促銷行為
    console.log("添加促銷標籤");
  }
}

// 增加運費
class ShippingDecorator implements ProductDecorator {
  private product: Product;

  constructor(product: Product) {
    this.product = product;
  }

  getPrice(): number {
    // 在產品價格上添加運費
    const originalPrice = this.product.getPrice();
    const totalPrice = originalPrice + 10; // 加上 10 元的運費
    return totalPrice;
  }

  decorate(): void {
    if (this.product instanceof PromotionDecorator) {
      this.product.decorate();
    }
    // 添加運費資訊或其他與運費相關的行為
    console.log("添加運費資訊", );
  }
}
```
此時就可以用裝飾器來擴展功能了

```ts
// 創建一個具體的產品
const product = new ConcreteProduct(100);

// 使用促銷裝飾器擴展功能
const productWithPromotion = new PromotionDecorator(product);
console.log(productWithPromotion.getPrice()); // 輸出：90
productWithPromotion.decorate(); // 輸出：添加促銷標籤

// 使用運費裝飾器擴展功能
const productWithShipping = new ShippingDecorator(product);
console.log(productWithShipping.getPrice()); // 輸出：110
productWithShipping.decorate(); // 輸出：添加運費資訊

// 也可以同時使用
const productWithBoth = new ShippingDecorator(new PromotionDecorator(product));
console.log(productWithBoth.getPrice()); // 輸出：100
productWithBoth.decorate(); // 輸出：添加促銷標籤 添加運費資訊
```
裝飾器模式可以運用在很多地方，比如遊戲中的角色生級時，增加技能。或是網頁中的表單需要根據不同的情況顯示不同的表格，都可以使用裝飾器模式。


## 裝飾器模式的總概念
最後我們來簡單寫一次比較概念化的裝飾器模式吧！

```ts
// 要被裝飾的對象
interface Component {
    operation(): string;
}

class ConcreteComponent implements Component {
    public operation(): string {
        return 'ConcreteComponent';
    }
}

// 裝飾器
class Decorator implements Component {
    protected component: Component;

    constructor(component: Component) {
        this.component = component;
    }

    public operation(): string {
        return this.component.operation();
    }
}

// 裝飾器 A
class ConcreteDecoratorA extends Decorator {
    public operation(): string {
        return `ConcreteDecoratorA(${super.operation()})`;
    }
}

// 裝飾器 B
class ConcreteDecoratorB extends Decorator {
    public operation(): string {
        return `ConcreteDecoratorB(${super.operation()})`;
    }
}

// 執行的程式碼
function clientCode(component: Component) {
  console.log(`RESULT: ${component.operation()}`);
}

const simple = new ConcreteComponent();
clientCode(simple); // RESULT: ConcreteComponent

const decorator1 = new ConcreteDecoratorA(simple);
const decorator2 = new ConcreteDecoratorB(decorator1);
clientCode(decorator2); // RESULT: ConcreteDecoratorB(ConcreteDecoratorA(ConcreteComponent))
```
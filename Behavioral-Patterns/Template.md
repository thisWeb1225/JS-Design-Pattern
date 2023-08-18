# 模板方法

模板方法（Template Method）是一種行為型設計模式，它允許你定義一個演算法的骨架，但將某些步驟的實現留給子類別。

## 場景 & 問題

想像一下，我們正在創建一個分析公司文檔的數據挖掘應用程序。用戶會以各種格式（PDF、DOC、CSV）提供應用程序文檔，我們要嘗試以統一的格式從這些文檔中提取有意義的數據。

這個應用程序的第一個版本只能使用 DOC 文件。在接下來的迭代中，我們讓它能夠支持CSV 和 PDF 文件。 

在某些時候，你注意到處理這三個文件的類都有很多相似的程式碼。雖然所有類中處理各種數據格式的程式碼完全不同，但數據處理和分析的步驟幾乎一樣。

此時就能夠使用模板模式。

## 模板模式

模板方法模式建議將算法分解為一系列步驟，將這些步驟轉換為方法，並將對這些方法的一系列調用放入單個模板方法中。這些步驟可以是抽象的，也可以具有默認的實現。

要使用該算法，繼承的子類要重寫父類的抽象方法，實現所有抽象步驟，並根據需要重寫一些可選步驟。

## 程式碼

```tsx
abstract class AbstractClass {
  // 模板方法，定義演算法的骨架
  templateMethod(): void {
    this.step1();
    this.step2();
    this.step3();
  }

  // 具體的步驟，由子類別實現
  abstract step1(): void;
  abstract step2(): void;
  abstract step3(): void;
}

class ConcreteClass extends AbstractClass {
  step1(): void {
    console.log("ConcreteClass: Step 1");
  }

  step2(): void {
    console.log("ConcreteClass: Step 2");
  }

  step3(): void {
    console.log("ConcreteClass: Step 3");
  }
}

// 使用
const instance = new ConcreteClass();
instance.templateMethod();
```

```tsx
/**
 * The Abstract Class defines a template method that contains a skeleton of some
 * algorithm, composed of calls to (usually) abstract primitive operations.
 *
 * Concrete subclasses should implement these operations, but leave the template
 * method itself intact.
 */
abstract class AbstractClass {
    /**
     * The template method defines the skeleton of an algorithm.
     */
    public templateMethod(): void {
        this.baseOperation1();
        this.requiredOperations1();
        this.baseOperation2();
        this.hook1();
        this.requiredOperation2();
        this.baseOperation3();
        this.hook2();
    }

    /**
     * These operations already have implementations.
     */
    protected baseOperation1(): void {
        console.log('AbstractClass says: I am doing the bulk of the work');
    }

    protected baseOperation2(): void {
        console.log('AbstractClass says: But I let subclasses override some operations');
    }

    protected baseOperation3(): void {
        console.log('AbstractClass says: But I am doing the bulk of the work anyway');
    }

    /**
     * These operations have to be implemented in subclasses.
     */
    protected abstract requiredOperations1(): void;

    protected abstract requiredOperation2(): void;

    /**
     * These are "hooks." Subclasses may override them, but it's not mandatory
     * since the hooks already have default (but empty) implementation. Hooks
     * provide additional extension points in some crucial places of the
     * algorithm.
     */
    protected hook1(): void { }

    protected hook2(): void { }
}

/**
 * Concrete classes have to implement all abstract operations of the base class.
 * They can also override some operations with a default implementation.
 */
class ConcreteClass1 extends AbstractClass {
    protected requiredOperations1(): void {
        console.log('ConcreteClass1 says: Implemented Operation1');
    }

    protected requiredOperation2(): void {
        console.log('ConcreteClass1 says: Implemented Operation2');
    }
}

/**
 * Usually, concrete classes override only a fraction of base class' operations.
 */
class ConcreteClass2 extends AbstractClass {
    protected requiredOperations1(): void {
        console.log('ConcreteClass2 says: Implemented Operation1');
    }

    protected requiredOperation2(): void {
        console.log('ConcreteClass2 says: Implemented Operation2');
    }

    protected hook1(): void {
        console.log('ConcreteClass2 says: Overridden Hook1');
    }
}

/**
 * The client code calls the template method to execute the algorithm. Client
 * code does not have to know the concrete class of an object it works with, as
 * long as it works with objects through the interface of their base class.
 */
function clientCode(abstractClass: AbstractClass) {
    // ...
    abstractClass.templateMethod();
    // ...
}

console.log('Same client code can work with different subclasses:');
clientCode(new ConcreteClass1());
console.log('');

console.log('Same client code can work with different subclasses:');
clientCode(new ConcreteClass2());
```

## 結構

1. 抽像類聲明了算法的方法，和以特定順序調用這些方法的實際模板方法。這些步驟可以被聲明為 `abstract` 的，也可以具有一些默認的實現。
2. 具體類可以覆蓋所有步驟，但不能覆蓋模板方法本身。

## 適用場景

1. 當我們想讓使用者僅擴展算法的特定步驟而不是整個算法或其結構時，請使用模板方法模式。
    1. 模板方法可以將整體算法拆分為一系列的步驟，這些步驟可以通過子類輕鬆擴展，同時保持 superclass 中定義的結構完整。
2. 當有多個類包含幾乎相同的算法但有一些細微差別時，請使用該模式。因此，當算法更改時，您可能需要修改所有類。
    1. 當把這樣的算法轉變為模板方法時，還可以將具有類似實現的步驟提取到 superclass 中，從而消除程式碼的重複。子類之間不同的程式碼可以保留在子類中。

## 如何使用

1. 分析目標算法，看看是否可以將其分解為步驟。考慮哪些步驟對於所有子類都是通用的，哪些步驟始終是唯一的。
2. 創建抽象基類並聲明模板方法和一組表示算法步驟的抽象方法。通過執行相應的步驟，在模板方法中勾勒出算法的結構。考慮將模板方法設置為最終方法，以防止子類覆蓋它。
3. 如果所有步驟最終都變得抽像也沒關係。但是，某些步驟可能會受益於默認實現。子類不必實現這些方法。
4. 考慮在算法的關鍵步驟之間添加**掛子 Hook** 。
5. 對於算法的每個變體，創建一個新的具體子類。它必須實現所有抽象步驟，但也可以覆蓋一些可選步驟。

### 好萊塢原則

前面提到的掛勾，可以用以下場景來想像：

好萊塢無疑是演員的天堂，但仍然有非常多在好萊塢找不到工作的新人演員，他們頭完履歷後，就只能等待公司，若它們按耐不住打電話去公司詢問，只會收到：不要來找我，我會打給你，等類似的回復

這就跟 Hook 一樣，底層(新人演員)可以將自己掛勾到高層組建中(投履歷給演藝公司)，但底層組件不能掉用方法，只能讓高層組件來決定要不要掉用。

舉泡咖啡、茶的例子，基本可以分為

1. 煮水
2. 沖泡咖啡 or 茶
3. 倒進杯子
4. 加糖

但客戶可以決定要不要加糖，這就是一個 Hook

```tsx
abstract class Beverage {
  boilWater(): void {
    console.log('把水煮沸');
  }

  abstract brew(): void;
  abstract pourInCup(): void;
  abstract addSuger(): void;

  customerWantsSuger(): boolean {
    return true; // 默認加糖
  }

  init(): void {
    this.boilWater();
    this.brew();
    this.pourInCup();
    if (this.customerWantsSuger()) {
      this.addSuger();
    }
  }
}

class CoffeeWithHook extends Beverage {
  brew(): void {
    console.log('用沸水冲泡咖啡');
  }

  pourInCup(): void {
    console.log('把咖啡倒進杯子');
  }

  addSuger(): void {
    console.log('加糖')
  }

  customerWantsSuger(): boolean {
    // return window.confirm('加糖？');
    return Math.random() > 0.5 ? true : false;
  }
}

const coffeeWithHook = new CoffeeWithHook();
coffeeWithHook.init();
```

## 優缺點

1. 可以讓客戶端僅使用大型算法的某些部分，從而減少它們受到算法其它部分發生更改時的影響。
2. 可以將重複的程式碼拉入到 superclass 中。

1. 某些客戶端可能會受到所提供的算法框架的限制。
2. 可能會通過子類抑制默認步驟實現來違反里氏替換原則。
3. 模板方法的步驟越多，維護起來就越困難。

## 和其他模式的比較

1. 工廠方法是模板方法的特化。同時，工廠方法可以充當大型模板方法中的一個步驟。
2. 模板方法基於繼承：它允許我們通過在子類中擴展這些部分來更改算法的部分。
3. 策略基於組合：我們可以通過為對象提供與該行為相對應的不同策略來改變對象的部分行為。
4. 模板方法在類級別工作，因此它是靜態的。策略在對象級別起作用，讓我們可以在運行時切換行為。
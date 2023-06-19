# 設計模式

> 寫程式時要保持這種心態：就好像將來要維護你這些程式的人是一位殘暴的精神病患者，而且他知道你住在哪。- Martin Golding

在開始設計模式之前，要先知道設計模式是針對物件導向程式(面向對象)的一套經驗系統。

## 甚麼是物件導向 OOP Object-oriented programming
(物件和對象是同個意思，台灣和對岸的講法不同而已)

物件導向有兩個重要的概念:
1. 類 class: 就像一個模板，他可以創造很多實例(對象)
2. 物件(對象): 由類創造出來的物件，又叫做實例


除了這兩個重要的概念，物件導向還有三個重要的要素:
1. 繼承: 子類繼承父類
2. 封裝: 數據的權限和保密
3. 多態: 同一接口不同實現

### 類  class
```js
class People {
  constructor(name, age) {
    this.name = name;
    this.age = age;
  }
  speak() {
    console.log(`My name is ${this.name}, I am ${age} old.`)
  }
}
```
一個類會有多個屬性和方法，通過這個類創造的對象，都會有這些屬性和方法，所以類就像是一個模板。

### 實例

```js
let Jack = new Person('Jack', 20);
let Rose = new Person('Rose', 18);
Jack.speak(); // My name is Jack, I am 20 old.
Rose.speak(); // My name is Rose, I am 18 old.
```
由類創造出來的實例，會有相同的屬性名和方法。

### 繼承
在物件導向中，可以用子類繼承父類，比如我們現在要創造 `student` 這個類:

```js
class People {
  constructor(name, age) {
    this.name = name;
    this.age = age;
  }
  speak() {
    console.log(`My name is ${this.name}, I am ${age} old.`)
  }
}

class Student extends People {
  constructor(name, age, numberId) {
    super(name, age);
    this.numberId = numberId;
  }

  study() {
    console.log(`${this.name} study`)
  }
}

let Jason = new Student('Jason', 16, 'B112');
Jason.speak() // My name is JaJasonck, I am 16 old.
Jason.study() // Jason study
```
`super()` 就是先執行父類的構造函數，要先使用 `super()` 繼承父類的屬性後，才能定義子類自己的屬性，而子類會自動繼承父類的方法。

總結一下繼承:
1. 父類 `people` 是公共的，不僅僅服務於 `student`
2. 繼承可以將相同的方法抽離出來，提高複用性

### 封裝
封裝可以用來操作數據的權限和保密，有三個關鍵字:
1. public: 完全開放
2. protected: 只對子類和實例開放
3. private: 只對自己開放，只能在類裡面使用

儘管在 JS 裡沒有這三個關鍵字，但 JS 仍然可以用閉包或 IIFE 來進行封裝。不過這裡不討論這個方法，所以我們用 TypeScript 來示範。

前面若沒有關鍵字，則默認 public
```ts
class People {
  name: string;
  age: number;
  protected weight: number;
  constructor(name, age) {
    this.name = name;
    this.age = age;
    this.weight = 120;
  }
  speak() {
    console.log(`My name is ${this.name}, I am ${this.age} old.`)
  }
}

class Student extends People {
  numberId: string;
  private girlfriend: string;
  constructor(name, age, numberId) {
    super(name, age);
    this.numberId = numberId;
    this.girlfriend = 'Rose'
  }

  study() {
    console.log(`${this.name} study`)
  }

  getWeight() {
    console.log(`${this.weight} kg`)
  }

  getGirlfreind() {
    console.log(`${this.name}'s girlfriend is ${this.girlfriend}`)
  }
}

let Jason = new Student('Jason', 16, 'B112');
Jason.speak() // My name is JaJasonck, I am 16 old.
Jason.getWeight() // 120 kg
Jason.getGirlfreind() // Jason's girlfriend is Rose

Json.girlfriend // 編譯時就會報錯，不會通過
```

封裝的好處
1. 減少耦合，不該外露的就不外露
2. 利於數據、接口的權限管理
3. ES6 目前不支持，一般認為用 `_` 開頭的屬性被認為不希望被訪問的，例如 `_id`，但這不是強制規定，只是大家的默認規範。

### 多態

1. 同一個接口，不同表現
2. JS 應用比較少，這裡用 ts 展示

```ts
abstract class Animal {
  abstract makeSound(): void;
}

class Dog extends Animal {
  makeSound(): void {
    console.log('汪汪');
  }
}

class Cat extends Animal {
  makeSound(): void {
    console.log('喵喵');
  }
}

// 測試代碼
const dog = new Dog();
const cat = new Cat();

dog.makeSound(); // 輸出：汪汪
cat.makeSound(); // 輸出：喵喵
```
如上，父類 `Animal` 定義了一個抽象的 `makeSound` 方法，表示所有的動物都有聲音，但具體的聲音可能因動物而異。這就是同個接口不同表現

多態的好處
1. 保持子類的開放性和靈活
2. 面向接口
3. JS 用的很少，了解即可

如果真的想知道封裝或多態，可以稍微了解一下 JAVA。

## 甚麼是設計模式
介紹完了 OOP，該是來進入正題了。甚麼是設計模式?

設計模式是一套被反覆使用、經過分類和無數實戰設計經驗總結的系統。設計模式讓程式碼可複用、擴展、解耦並保證程式碼可靠性。

就好比你買家具，並將物品分類擺放，也是經過長期的生活經驗告訴你要如何分類、買哪些家具，才能將物品好好擺放。這些買家具和分類擺放的經驗就如同經歷長期實戰，被總結出來的設計模式。

設計模式在任何語言表現方式都是一樣的，只是語法略有不同。

## 設計模式原則 s.o.l.i.d
設計模式存在的根本原因是為了程式碼的複用、增加可維護性，有如下原則:
1. 單一職責原則 (Single Responsibility Principle, SRP)：一個類別應該只有一個負責的職責。如果一個類別具有多個職責，當其中一個職責需要修改時，可能會影響到其他職責，導致程式碼變得脆弱且難以維護。

2. 開放封閉原則 (Open-Closed Principle, OCP)：對擴展開放，但對修改封閉。當需要新增功能時，我們應該儘量通過擴展現有的程式碼來實現，而不是修改原有的程式碼，以避免破壞已經運作正常的程式碼。Promise 的 `.then()` 就符合開放封閉。

3. 里氏替換原則 (Liskov Substitution Principle, LSP)：子類別應該能夠替換其父類別並保持程式的正確性。這意味著在程式中使用繼承時，必須確保子類別可以完全替代父類別的行為，而不會產生錯誤或不一致的結果。

4. 介面隔離原則 (Interface Segregation Principle, ISP)：保持介面的單一獨立，不應該強迫類依賴於它們不需要使用的介面。這意味著應該根據客戶端的需求，將大的介面拆分成多個小的專用介面，以避免類別實現不必要的方法。

5. 依賴反轉原則 (Dependency Inversion Principle, DIP)：高層模組不應該依賴於低層模組，**兩者都應該依賴於抽象**。這代表我們應該更專注在抽象，而不是具體的實現。

## 設計模式的類型
設計模式可以分為三大類，包括:
1. 創建型模式: 提供創建對象的機制，增加程式碼的靈活性和複用性
  * 工廠模式
  * 抽象工廠模式
  * 單例模式
  * 建造者模式
  * 原型模式
  
2. 結構型模式: 保持結構靈活的情況下，將對象和類組裝成較大的結構
  * 適配器模式
  * 橋接模式
  * 過濾器模式
  * 組合模式
  * 裝飾器模式
  * 外觀模式
  * 享元模式
  * 代理模式

3. 行為型模式: 負責處理對象之間的溝通
  * 責任鏈模式
  * 命令模式
  * 解釋器模式
  * 迭代器模式
  * 中介者模式
  * 備忘錄模式
  * 觀察者模式
  * 狀態模式
  * 空對象模式
  * 策略模式
  * 模板模式
  * 訪問者模式

## 小結
今天介紹了 OOP 和設計模式，也各自講了他們的一些概念和原則，希望能讓你更了解物件導向的世界，之後會慢慢分享有關設計模式的文章，如果有激起你的好奇心，趕快上網自學先吧！
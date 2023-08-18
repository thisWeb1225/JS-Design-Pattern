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
# 設計模式

設計模式是一套被反覆使用、經過分類和無數實戰設計經驗總結的系統。設計模式讓程式碼可複用、擴展、解耦並保證程式碼可靠性。

就好比你買家具，並將物品分類擺放，也是經過長期的生活經驗告訴你要如何分類、買哪些家具，才能將物品好好擺放。這些買家具和分類擺放的經驗就如同經歷長期實戰，被總結出來的設計模式。

設計模式在任何語言表現方式都是一樣的，只是語法略有不同。

## 設計模式原則 
設計模式存在的根本原因是為了程式碼的複用、增加可維護性，有如下原則:
1. 開閉原則 Open/close principle(OCP): 對擴展開放、對修改關閉。
   好比考試老師出卷子，如果要增加難度，要修改整張卷子肯定很麻煩，所以可以增加複加題，而不是修改整張卷子
2. 里式轉換原則 Liskov substitution principle(LSP): 子類繼承父類，單獨調也可以運行
3. 依賴倒轉原則 Dependency Inversion Principle(DIP): 引用一個對象，如果這個對象有底層類型，直接引用底層的類型
4. 接口隔離原則 Interface Segregation Principle(ISP): 每一個接口應該是一種角色
5. 合成/聚合原則: 新的對象應該使用一些已用的對象，使之成為新對象的一部份
6. 迪米特原則: 一個對象應該對其它對象盡可能的少了解
7. 單一職責原則 Single responsibility principle(SRP): 一個類盡量只做一件事情

## 設計模式的類型
設計模式可以分為三大類，包括:
1. 創建型模式
  * 工廠模式
  * 抽象工廠模式
  * 單例模式
  * 建造者模式
  * 原型模式
2. 結構型模式
  * 適配器模式
  * 橋接模式
  * 過濾器模式
  * 組合模式
  * 裝飾器模式
  * 外觀模式
  * 享元模式
  * 代理模式
3. 行為型模式
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
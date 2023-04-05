# 迭代器模式 Iterator
迭代器模式是指提供一種方法，讓你可以依照順序訪問一個物件、陣列中的各個元素，而又不需要暴露物件中的內部表示。使用迭代器模式後，即使不關心物件的內部構造，也可以按順序訪問其中的每個元素。

其實迭代器模式在日常開發中經常使用，例如 `forEach()`、`map()`、`filter()`... 等等，只是之前並不知道它是一種設計模式，在目前大部分的程式語言，都會內建迭代器了，不過今天我們來練習如何實現自己的迭代器。

## 實現自己的迭代器
先來試著實現一個 `forEach` 函數，它接收兩個參數，第一個為被循環的陣列，第二個為循環每一步後將被觸發的回調函數。

```js
const myForEach = (arr, callback) => {
  for (let i = 0; i < arr.length; i++) {
    callback.call(arr[i], arr[i], i) // 將元素和 index 當作參數傳給 callback 函數
  }
}

const arr1 = [1, 2, 3];
myForEach(arr1, (val, i) => console.log(i, val));
```
恭喜你完成了簡易版的 `forEach` 方法。

## 內部迭代器和外部迭代器
我們剛剛寫的 myForEach 屬於內部迭代器，它內部已經訂好了迭代規則，知道自己該如何遍歷集合中的元素，完全接手整個迭代過程，外部只需要一次調用即可，這樣的設計對使用者來說更加方便。

不過缺點是內部迭代器無法提前退出循環，如果需要在迭代過程中中斷，就需要使用拋出錯誤來實現。第二個缺點是，內部迭代器無法更改內部規則，假設我們需要同時迭代兩個陣列去比較它們是否相同：
```js
const compare = ( arr1, arr2 ) => { 
  if ( arr1.length !== arr2.length ){ 
    throw new Error ( 'arr1 和 arr2 不相等' ); 
  } 
  each( arr1, ( i, n ) => { 
    if ( n !== arr2[ i ] ){ 
      throw new Error ( 'arr1 和 arr2 不相等' ); 
    } 
  }); 
 console.log( 'arr1 和 arr2 相等' ); 
}; 
compare( [ 1, 2, 3 ], [ 1, 2, 4 ] ); // throw new Error ( 'arr1 和 arr2 不相等' ); 
```
這個 compare 一點都不好看，我們目前能完成這個需求，還要感謝 JS 裡可以把函數當成參數傳遞，但在其它程式語言就未必有那麼幸運了。

##　外部迭代器
外部迭代器則是由用戶控制的迭代器，用戶必須自己顯式地請求下一個元素，直到所有元素都被遍歷為止。

外部迭代器相對於內部迭代器來說，具有更高的控制力和彈性，可以在迭代過程中隨時退出迭代，也可以實現多個迭代器之間的交互操作。缺點是外部迭代器的語法比內部迭代器要複雜，需要用戶自己實現遍歷的邏輯。

```js
const Iterator = (obj) => {
  let current = 0;
  const next = () => current++;

  const isDone = () => current >= obj.length;

  const getCurrentItem = () => obj[current];

  return {
    next,
    isDone,
    getCurrentItem,
  }
}

// 改寫 compare 函數
const compare (iterator1, iterator2) => {
  while( !iterator1.isDone() && !iterator2.isDone() ){ 
    if ( iterator1.getCurrItem() !== iterator2.getCurrItem() ){ 
      throw new Error ( 'iterator1 和 iterator2 不相等' ); 
    } 
    iterator1.next(); 
    iterator2.next(); 
  } 
 alert ( 'iterator1 和 iterator2 相等' ); 
}

const iterator1 = Iterator( [ 1, 2, 3 ] ); 
const iterator2 = Iterator( [ 1, 2, 3 ] ); 
compare( iterator1, iterator2 ); // 输出：iterator1 和 iterator2 相等 
```

外部迭代器雖然調用方式相對複雜，但適用性更廣，也能滿足各種需求，不過內部迭代器和外部迭代器並沒有優劣之分，只要根據情況選擇即可。

## ES6 generator
ES6 generator 是一種在 JavaScript 中引入的新功能。它是一種蠻特殊的函數，可以在運行過程中暫停並返回中間結果，也可以從暫停的地方繼續開始執行。

使用方法是在函數名字前加 `*`，內部的 `yield` 是暫停的地方且會返回下一個元素的值，`next()` 是繼續執行的意思

當使用 `next()` 方法時，生成器會執行到下一個 `yield` 關鍵字處，並將 `yield` 關鍵字後的表達式的值返回給調用者。如果沒有下一個 `yield` 關鍵字，生成器會自動結束並返回 `undefined`:

```js
function* numberGenerator() {
  let number = 0;
  while (true) {
    yield number;
    number++;
    if (number > 3) break;
  }
}

const generator = numberGenerator();
console.log(generator.next().value); // 0
console.log(generator.next().value); // 1
console.log(generator.next().value); // 2
console.log(generator.next().value); // 3
console.log(generator.next().value); // undefined

// 也可以使用 for of 來迭代整個 generator

for (let val of generator) {
  console.log(val); 
}
// 0
// 1
// 2
// 3
```
使用 generator 可以實現一些複雜的陣列操作，例如迭代多維陣列

```js
function* iterate2DArray(arr) {
  for (let i = 0; i < arr.length; i++) {
    if (Array.isArray(arr[i])) {
      yield* iterate2DArray(arr[i]);
    } else {
      yield arr[i];
    }
  }
}

const arr = [1, [2, [3, 4], 5], 6];
const gen = iterate2DArray(arr);

for (let val of gen) {
  console.log(val); // 1 2 3 4 5 6
}
```
或是過濾陣列的元素 (當然用 `filter()` 可能更快，這裡只是舉例)：
```js
function* filterOdd(arr) {
  for (let i = 0; i < arr.length; i++) {
    if (arr[i] % 2 === 1) {
      yield arr[i];
    }
  }
}

const arr = [1, 2, 3, 4, 5];
const gen = filterOdd(arr);

for (let val of gen) {
  console.log(val);
}
```

## 小結
今天介紹了迭代器模式和 ES6 增加的 `generator`，在現在的程式語言中，大部分都有內建迭代器的 API，不過學習迭代器模式除了讓我們更好理解迭代器的本質和原理，在某些場景也可以自己實現一些自定義的迭代器，滿足不同的需求。
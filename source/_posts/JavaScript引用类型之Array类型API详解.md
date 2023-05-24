---
title: JavaScript引用类型之Array类型API详解
date: 2018-11-07 00:42
tags:
- 博客园
- JavaScript
---

博客迁移 [原博客园链接](https://www.cnblogs.com/peerless1029/p/9919908.html)

Array类型也是ECMASCRIPT中最常见的数据类型，而且数据的每一项可以保存任何类型的数值，而且数组的大小是可以动态调整的，可以随着数据的添加自动增长以容纳新的数据。下面，总结数据的一些常用方法：
<!--more-->
#### 1.创建数组
  1.1.使用Array构造函数
~~~javascript
var arr=new Array(4); //创建一个包含3项的空数组
var arr2=new Array('red','blue','yellow'); //['red','blue','yellow']
~~~
1.2.数组字面量创建
~~~javascript
var arr3=[]; //[]
var arr4=['red','yellow']; //['red','yellow']
var arr5=[1,2,]; //[1,2,]
~~~
#### 2.读取和设置数组的值
- index数组的索引，即下标，当index<arr.length时，可以获取数组中的值，否则取到的值为undefined。
- 通过设置数组的length，可以对数组的末尾移除或添加
~~~javascript
var arr4=['red','yellow'];
console.log(
  arr4[0],
  arr4[2],
);
//red
//undefined

var arr4=['red','yellow'];
arr4.length=1;
console.log(arr4);
arr4.length=3;
console.log(arr4);
//["red"] 长度变为1
//["red", empty × 2] 长度变为3，后两项为空
 
var arr=[1,2,3];
arr[10]=10;
console.log(arr);
//[1, 2, 3, empty × 7, 10] length为10中间的值为undefined
~~~
**小结：通过arr[arr.length-1]可以获取到数组的最后一项，通过arr[length]=item可以设置最后一项的值并动态增加了数组的长度**
#### 3.数组的方法
3.1.连接两个数组或多个数组-concat
不改变原始数组，需要用新的变量保存返回的新数组
~~~javascript
var arr1=[1,2];
var arr2=[2,3];
arr1.concat(arr2);
console.log(arr1,arr2);
var arr3=arr1.concat(arr2);
console.log(arr3);

// [1, 2] (2) [2, 3]
// [1, 2, 2, 3]
~~~
3.2.截取数组一部分-slice
arr.slice(startIndex,endIndex);截取的项包括数组开始的索引的项，不包括数组结束的索引的项,也不改变原始数组，需要用新的变量保存返回的新数组。
~~~javascript
var arr=[1,2,3];
arr.slice(0,1);
console.log(arr);
var sub=arr.slice(0,1);
console.log(sub);
// [1, 2, 3]
// [1]
~~~
3.3用不同的分隔符构建字符串-join
默认以','拼接，
~~~javascript
var arr=[1,2,3];
var str1=arr.join();
var str2=arr.join("-");
console.log(str1,str2);
//1,2,3
//1-2-3

// 根据数组拼接成html字符串
var arr=["HTML","CSS","JS"];
var html='<li>'+arr.join('</li><li>')+'</li>';
console.log(html);
// HTML</li><li>CSS</li><li>JS</li>
~~~
3.4.数组的反转-reverse
~~~javascript
var arr=[1,2,3,4,5];
arr.reverse();
// [5, 4, 3, 2, 1]
~~~
3.5.数组的排序-sort方法
这里只是通过出入比较函数给sort方法来保持正确的排序，对象也可以根据某一属性来进行正确的排序，这里暂不赘述。
~~~javascript
var arr=[1,2,11,5,50];
arr.sort();
// [1, 11, 2, 5, 50] 按照uicode编码排序不是我们想要的结果
通过传入比较函数保证正确的排序
arr.sort(function(a,b){
  if(a<b){
    return -1;
  }else if(a>b){
    return 1;
  }else{
    return 0;
  }
})
// [1, 2, 5, 11, 50]
~~~
3.6.数组的删除，替换，插入-splice方法
~~~javascript
array.splice(index,howmany,item1,.....,itemX)；
// 删除开始索引后的第几个元素
var arr=[1,2,3,4,5];
arr.splice(1,1); //[1, 3, 4, 5]

// 删除开始索引后的第几个元素然后插入新的值
var arr1=[1,2,3,4,5];
arr1.splice(1,2,11,22); // [1, 11, 22, 4, 5]
~~~
3.7.栈方法
数组提供了一种让数组类似于其他数据结构的方法，栈是一种LIFO（Last-In-First-Out）后进先出的数据结构，也就是最新添加的最早被移除。
- 栈中的推入-push,接收任意变量的参数，把他们添加到数组的末尾，并返回修改后数组的长度
- 栈中的弹出-pop，从数组末尾移除最后一项，减少length值，然后返回移除的项
都发生在同一位置-栈的顶部。
~~~javascript
var arr=[1,2,3];
arr.push('a'); //4 返回数组的长度
arr // [1, 2, 3, "a"]

var arr=[1,2,3];
arr.pop(); //3  返回数组最后一项的弹出值
arr // [1, 2]
~~~
3.8.队列方法
队列的数据结构是FIFO（First-In-First-Out），队列在数组的末端添加项，在列表的前端移除项。
- 末端添加项-push,
- 前端移除项-shift,移除数组中的第一项，并返回该项，同时将数组长度减1,
- 前端新增项-unshift,在数组前端新增一项并返回数组的新长度。
- 通过数组的unshift和pop方法可以从相反方向的来模拟队列
~~~javascript
var arr=[1,2,3];
arr.push(4) //4
arr.shift();  //1
arr; //[2,3,4]
arr.unshift("a"); //4
arr; //["a",1,2,3]
~~~
3.9.数组的位置方法-indexOf,lastIndexOf
- indexOf() 方法可返回数组中某个指定的元素位置。该方法将从头到尾地检索数组，看它是否含有对应的元素。开始检索的位置在数组 start 处或数组的开头（没有指定 start 参数时）。如果找到一个 item，则返回 item 的第一次出现的位置。开始位置的索引为 0。如果在数组中没找到指定元素则返回 -1。
- lastIndexOf() 方法可返回数组中从尾到头方向上的位置，找到返回第一次出现的位置，否则返回-1。
~~~javascript
var arr=[1,2,3,1,4];
arr.indexOf(1); //0
arr.lastIndexOf(1); //3
~~~
3.10.数组的平铺（有些低版本浏览器不兼容）
方法会递归到指定深度将所有子数组连接，并返回一个新数组。arr.flat(depth);默认深度为1
~~~javascript
var arr=[1,2,3,[4,5],[7,8]];
var arr2=arr.flat(); //等价于arr.flat(1)
console.log(arr2);
// [1, 2, 3, 4, 5, 7, 8]
~~~
#### 4.数组的迭代方法
4.1.every():对数组的每一项运行给定函数，如果该函数对每一项都返回true,则返回true
~~~javascript
var numbers=[1,2,3,4,5];
var result=numbers.every(function(item,index,arr){
  return item>2;
})
result  //false
~~~
4.2.some():对数组的每一项运行给定函数，如果该函数对任一项返回true,则返回true
~~~javascript
var numbers=[1,2,3,4,5];
var result=numbers.some(function(item,index,arr){
  return item>2;
})
result  //false
~~~
4.3.filter():对数组中每一项运行给定的函数，返回该函数会返回true的项组成新的数组
~~~javascript
var numbers=[1,2,3,4,5];
var result=numbers.filter(function(item,index,arr){
  return item>2;
});
result //[3, 4, 5]
~~~
4.4.map():对数组中每一项运行给定的函数，返回每次函数调用的结果组成新的数组
~~~javascript
var numbers=[1,2,3,4,5];
var result=numbers.map(function(item,index,arr){
  return item*item;
});
result // [1, 4, 9, 16, 25]
~~~
4.5.foreach():对数组中每一项运行给定函数，这个方法没有结果，与for循环迭代数组一样

###### 眼过千遍，不如手写一遍，以上是对JavaScript数组常用API的一些总结，也是平常业务开发中会经常使用到的，如有不足，欢迎指正。
参考资料：
《JavaScript高级程序设计》
[《菜鸟教程》](https://www.runoob.com/)
[《MDN》](https://developer.mozilla.org/zh-CN/)

　　　　


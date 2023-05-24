---
title: 面试题-浅谈JavaScript中的This指向问题
date: 2018-11-16 08:01
tags:
- 博客园
- JavaScript
---

博客迁移 [原博客园链接](https://www.cnblogs.com/peerless1029/p/9967098.html)

各位小伙伴在面试中被面试官问道this指向问题一定不少吧，同时还被问道apply,call和bind的用法区别，现在，就来简单的聊一聊this到底指向何方。

#### 1.基本概念

MDN的官方解释：与其他语言相比，函数的 this 关键字在 JavaScript 中的表现略有不同，此外，在严格模式和非严格模式之间也会有一些差别。在绝大多数情况下，函数的调用方式决定了this的值。this不能在执行期间被赋值，并且在每次函数被调用时this的值也可能会不同。

简而言之：

1.this指向的对象称为函数的上下文对象context；　　

2.this的指向取决于函数被调用方式 
<!--more-->
不管函数怎么调用的天花乱坠，我们只要记住这几点即可清晰的找出this的指向。

#### 2.小试牛刀
~~~javascript
function foo(){
  console.log(this);
}
~~~
面试官问你this指向哪里，当然大声回答不知道，原因：谁调用指向谁，函数都没被调用，确实不知道指向。
![1103967-20181115235340230-267684254.png](https://i.loli.net/2019/10/20/WkrNIn6GeCBfl8Y.png)

**小结：直接通过函数名来调用函数，this指向全局变量window;通过对象.函数名调用函数，this指向该对象。**

#### 3.DOM对象调用函数时this的指向问题
1.通过选择器选择元素加事件属性来绑定事件，this指向该DOM对象，例子如下：
~~~javascript
document.getElementById('btn').onclick=function(){
    console.log('click'); //click
    console.log(this); //<button id="btn">button</button>
  }
~~~
2.直接在DOM标签中写事件，this指向window,我们可以通过吧this作为参数传入方法中再使用，例子如下
~~~html
html:
<button onclick="modify()">add</button>
<span id="count">0</span>
<button onclick="modify()">reduce</button>

script：
// 操作方法
  function modify(){
    console.log(this); //window
  }
~~~
因为这个时候是直接调用方法的，所以this指向全局window对象，那么问题来了，我们想判断我们点击的是哪一个按钮，应该怎么做呢，我们可以把this的值作为参数传入方法中再使用，例子如下。
~~~html
html:
<button onclick="modify(this)">add</button>
<span id="count">0</span>
<button onclick="modify(this)">reduce</button>

script：
// 操作方法
  function modify(_this){
    console.log(_this); 
// <button onclick="modify(this)">add</button>
// <button onclick="modify(this)">reduce</button>
  }
~~~
#### 4.对象中this的指向问题
先看一个简单的例子：

~~~javascript
var a=1;
function printA(){
  console.log(this.a);
}
var obj={
  a:2,
  foo:printA,
  bar:function(){
    printA();
  }
}

obj.foo(); //2
obj.bar(); //1
var foo=obj.foo;
foo(); //1
~~~
我们定义了一个全局变量a和一个打印a的全局变量方法，之后又定义了一个obj对象，其中包含a属性和foo,bar两个方法。当我们调用obj.foo()打印了2，调用obj.bar()打印了1.
分析：
- 不管printA在哪里定义的，我们this的指向只取决于被谁调用的。在obj.foo()，foo的属性值为printA，被obj直接调用，所以this指向obj，this.a就是obj.a=2了；
- 当我们调用obj.bar()时，bar的属性值为function(){printA()}，没有明确哪个对象来调用printA方法，this默认指向全局对象window，所以this.a=window.a=1；
- 第三种情况我们把obj.foo值赋予了foo变量，在调用的时候就相当于是window.foo()了，打印1。
**小结：this的指向不是函数声明是绑定的，而是在函数运行过程中动态绑定的。**
  
5.改变this的指向方法：applay call bind
话不多话：写了一个例子，大家先看，万一比喻不恰当，大家能理解其中意思即可
~~~javascript
var liLei={
  name:'liLei',
  money:10,
  buyPen:function(){
    this.money=this.money-1;
    console.log(this.name+" have money:"+this.money)
  }
}

var hanMeiMei={
  name:'hanMeiMei',
  money:20,
  buyPan:function(){
    this.money=this.money-2;
    console.log(this.name+" have money:"+this.money)
  }
}

liLei.buyPen(); // liLei have money:9
hanMeiMei.buyPan(); //hanMeiMei have money:18
~~~
例子很好理解，输出的结果相信大家也能看得明白，哪天，韩梅梅想买一个盆，她买不了，因为她还没有这个方法，她一想：我没有这个方法，但是李雷有啊，我打电话给李雷把钱他让他帮我买啊；后来李雷想买一个盘，实现方法也是如此。那么，在代码中如何实现呢？

JavaScript有好几个方法可以实现：call,apply,bind。

**call方法:**
- 语法：call(thisObj，Object)
- 定义：调用一个对象的一个方法，以另一个对象替换当前对象。
- 说明：call 方法可以用来代替另一个对象调用一个方法。call 方法可将一个函数的对象上下文从初始的上下文改变为由 thisObj 指定的新对象。如果没有提供 thisObj 参数，那么 Global 对象被用作 thisObj。
~~~javascript
liLei.buyPen.call(hanMeiMei); //hanMeiMei have money:19
hanMeiMei.buyPan.call(liLei); //liLei have money:8
~~~
**apply方法：**
- 语法：apply(thisObj，[argArray])
- 定义：应用某一对象的一个方法，用另一个对象替换当前对象。
- 说明：如果 argArray 不是一个有效的数组或者不是 arguments 对象，那么将导致一个 TypeError。如果没有提供 argArray 和 thisObj 任何一个参数，那么 Global 对象将被用作 thisObj， 并且无法被传递任何参数。

**bind方法：**
~~~javascript
liLei.buyPen.bind(hanMeiMei)(); //hanMeiMei have money:19
hanMeiMei.buyPan.apply(liLei)(); //liLei have money:8
~~~
**小结：三种方法的相同指出是：可以改变this的指向，不同之处是：apply接受的参数为一个数组，call接收的参数为一个个独立的值；apply，call会直接调用方法，bind改变this的指向返回一个方法不调用。**

_注：有些低版本的浏览器不支持函数使用bind方法，我们在做浏览器兼容时可以加以判断，具体实现方法暂不赘述。_

###### 以上就是个人对于this的指向问题的理解，我们只需记住一点：this指向-谁调用，指向谁。不得不说JavaScript真是个奇妙的世界，文中有纰漏不足的地方，欢迎指正。

参考资料：
[MDN-this](https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Operators/this)
[杰瑞教育](https://www.cnblogs.com/jerehedu/%20)
[外婆的彭湖湾](https://www.cnblogs.com/penghuwan/p/7356210.html)
_转载请注明出处，谢谢！_
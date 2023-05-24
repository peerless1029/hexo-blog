---
title: ES6语法的学习与实践
date: 2018-09-19 22:39
tags: 
- 博客园
- JavaScript
---

博客迁移 [原博客园链接](https://www.cnblogs.com/peerless1029/p/9678130.html)

ES6是JavaScript语言的新一代标准，是ECMAScript的第六个版本，加入了很多新的功能和语法，在很多框架，如在使用Vue,React等框架的项目中一般都采用ES6语法来编写的，下面对经常用到的ES6语法做简要的介绍。
<!-- more -->
#### 1.let,const
let和const是ES6中新增的两个关键字，用来生命变量，let和const都是块级作用域。let声明的变量只在let命令所在的代码块内有效。const声明一个只读变量，一旦声明，常量的值就不可更改。与var声明的变量不同，var声明的是函数作用域，且存在变量提升。例如：　
``` javascript
// let示例
{
  var a=1;

  let b=2;
}
a;  // 1
b;  // ReferenceError:b is not undefined.

// const示例
const c=3;
c=4; //  Assignment to constant variable.

// var 示例
console.log(d); // undefined
var d=3;
console.log(d); //3
声明提前后浏览器执行顺序为：
var d;
console.log(d); // undefined
d=3;
console.log(d); // 3
```
#### 2.箭头函数
ES6允许使用“箭头”（=>）定义函数。这种函数创建的函数不需要函数关键字，并且还可以省略return关键字。与此同时，箭头函数内的this指向函数定义时所在的上下文对象。例如：
``` javascript
var foo1=(a,b)=>a+1;
// 等价于 
var foo1=function(a,b){
  return a+b;
}
// 在return只有一个表达式时，使用箭头函数可以省略return和{}

var name='jhon';
var obj={
  name:"tom",
  sayName1:function(){
    setTimeout(function(){
      console.log(this.name)
    },500)
  },
 sayName2:function(){
    setTimeout(()=>{
      console.log(this.name)
    },500)
  },
}
obj.sayName1(); // jhon
obj.sayName2(); // tom
// 第一个this值window对象，第二个方法里面指向当前的obj对象，
```
**小结：1.使用箭头函数可以简写代码量；2.可以改变this的指向，可以替代apply,call,bind一些方法。**
#### 3.模板字符串
相信许多小伙伴在js里面用‘’，+拼接字符串很让人头疼了，如果字符串量比较少还好，一旦比较多，最后拼的自己都不认识了，而且严重影响代码的整洁优雅度。ES6的反引号（``）标识字符串，除了可以当做普通字符串使用外，还可以用来定义多行字符串，以及在字符串内嵌入变零，功能很强大。例如：
``` javascript
// 普通字符串
`Hello World`

// 多行字符串
`Hello World，
  Hello JavaScript!
`
// 字符串内嵌入变量
let name='Peer';
`Hello,${name}`
```
#### 4.解构赋值
ES6允许按照一定模式从数组和对象中提取值，对变量进行赋值，这被称为解构。例如：
``` javascript
// 数组解构
var [a,b,c]=[1,2,3];
a //1
b //2
c //3

// 对象解构
let name='Peer';
let age=23;
let person={name,age};
person //{name:"Peer",age:23}

// 函数的参数也可以使用解构赋值，例如：
// 数组的参数解构
function sum([x,y]){
  return x+y;
}
sum([1,2]); // 3
// 对象的参数解构
function sum2({x,y}){
  return x+y;
}
sum2({x:5,y:6}); // 11

// 解构同样适用于嵌套的数组与对象
// 嵌套数组解构
let [a,[b],c]=[1,[2],3]
a; //1
b; //2
c: //3
// 嵌套对象解构
let {person:{name,age},foo}={person:{name:"Peer",age:23},foo:"foo"}
name;  // "Peer"
age;  // 23
foo; // "foo"
```
**小结：对象和数组的解构只需和声明好的对象数组形式保持一致即可，在获取对象里面的属性值还是很方便的，在Vue，React等框架的开发中也用的比较多，如:import { a , b , c } from 'component',所以不难理解这段代码，就是把component这个模块里面的啊，a,b,c属性对应的值取出来再分别赋值给a,b,c变量，确实大大简化了代码，提高了开发效率。**
#### 5.rest参数
rest打开软件翻译为：休息; 剩余部分; 支持物; 宁静，安宁。ES6引入rest参数（形式为...变零名）用于获取多数的多余参数，以替代arguments对象的使用。rest参数是一个数组，数组中的元素是多余的参数。例如：
``` javascript
function printName(a,...names){
  console.log(a);
  console.log(names)
}
printName("Peer","jhon","toom")
// Peer
//["jhon", "toom"]
```
#### 6.扩展运算符
扩展运算符是三个点（...）,它将一个数组转为用逗号分隔的参数序列，类似于rest参数的逆运算。例如：

``` javascript
function sum(a,b,c){
  return a+b+c;
}
sum(...[1,2,3])
// 6
```
#### 7.import ,export
ES6实现了自己的模块化表标准，在语言层面上实现了模块化，它逐渐取代了CommonJS和AMD规范。ES6的模块功能主要有两个关键字构成：export和import。export用于规定模块对外暴露的接口，import用于引入其他模块提供的接口。例如：

``` bash
// a.js
const a=function(){
  return 'this is a.js'
}
export default a;
// b.js
const b=function(){
  return 'this is b.js'
}
export {b}
// c.js
import a from './a';
import {b} from './b';
console.log(a,b); // 'this is a.js', 'this is b.js'
```
**小结：ES6的模块化解决了JavaScript没有模块化系统的缺陷，同时也使得各个模块相互独立，有独立的作用域。**
#### 8.Class
``` javascript
// 定义一个类
class Person{
  constructor(name,age){
    this.name=name;
    this.age=age;
  }
  getName(){
    return this.name;
  }
}
var person=new Person("Peer",23);

// 通过extends 关键字实现继承
class Man extends Person{
  constructor(anme,age){
    super(name,age)
  }
  getGender(){
    return 'male'
  }
}
var man=new Man("Peer",23)；
man.getName(); //Peer
console.dir(man);
```
![es6-1.png](https://i.loli.net/2019/10/20/uj4Ddmsf2ZMScKk.png)

**从打印man对象的结构来看，getGender是Man原型的方法，getName是Man继承Person的构造方法，man.getName()方法首先再man.__proto__的原型上查找，如果没有就在man.__proto__.proto__上查找，于是一级一级就构成了作用域链。**

话说好记性不如烂笔头，书写文章也是自我反思与总结的过程。以上就是个人在项目开发中用的比较多的地方分享给大家，不足之处，多多指正。

参考书籍：_《React进阶之路》_，_《深入浅出Webpack》_

 

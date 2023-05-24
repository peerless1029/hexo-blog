---
title: ES6之Promise学习与实践
date: 2018-12-23 17:17
tags:
- 博客园
- JavaScript
---

博客迁移 [原博客园链接](https://www.cnblogs.com/peerless1029/p/10164858.html)

#### 1.前言

在平时的业务开发中，前端通常需要请求后台获取数据，或者NodeJs读取文件等等一系列的异步操作，我们通常需要利用异步操作的结果或者对异步操作的结果进行处理。通常我们的解决方案是：在异步操作成功或者失败的回调函数里面写方法，在异步操作比较简单的时候这样写代码还是比较好理解的，当业务逐渐趋于复杂，这就形成了回调地狱，代码嵌套层数太多并且难以理解。不过，办法总是有的，可以使用ES6的新特性Promise来解决问题。
<!--more-->

#### 2.Promise的定义

Promise 是异步编程的一种解决方案，比传统的解决方案——回调函数和事件——更合理和更强大。它由社区最早提出和实现，ES6 将其写进了语言标准，统一了用法，原生提供了Promise对象。

所谓Promise，简单说就是一个容器，里面保存着某个未来才会结束的事件（通常是一个异步操作）的结果。从语法上说，Promise 是一个对象，从它可以获取异步操作的消息。Promise 提供统一的 API，各种异步操作都可以用同样的方法进行处理。

Promise对象有以下两个特点。

1.对象的状态不受外界影响。Promise对象代表一个异步操作，有三种状态：pending（进行中）、fulfilled（已成功）和rejected（已失败）。只有异步操作的结果，可以决定当前是哪一种状态，任何其他操作都无法改变这个状态。这也是Promise这个名字的由来，它的英语意思就是“承诺”，表示其他手段无法改变。

2.一旦状态改变，就不会再变，任何时候都可以得到这个结果。Promise对象的状态改变，只有两种可能：从pending变为fulfilled和从pending变为rejected。只要这两种情况发生，状态就凝固了，不会再变了，会一直保持这个结果，这时就称为 resolved（已定型）。如果改变已经发生了，你再对Promise对象添加回调函数，也会立即得到这个结果。这与事件（Event）完全不同，事件的特点是，如果你错过了它，再去监听，是得不到结果的。

有了Promise对象，就可以将异步操作以同步操作的流程表达出来，避免了层层嵌套的回调函数。此外，Promise对象提供统一的接口，使得控制异步操作更加容易。

Promise也有一些缺点。首先，无法取消Promise，一旦新建它就会立即执行，无法中途取消。其次，如果不设置回调函数，Promise内部抛出的错误，不会反应到外部。第三，当处于pending状态时，无法得知目前进展到哪一个阶段（刚刚开始还是即将完成）。

#### 3.基本用法

ES6规定，Promise对象是一个构造函数，用来生成Promise实例

代码如下：

~~~javascript
const promise=new Promise(function(resolve,reject){
  if(/* 异步操作成功*/){
    resolve(value)
  }else{
    reject(error);
  }
});
~~~

Promise构造函数接受一个函数作为参数，改函数的两个参数分别是resolve与reject,resolve函数的作用是：将Promise对象的状态从“未完成”变为“成功”，在异步操作成功时回调，并将异步操作的结果value作为参数传递出去；reject函数的作用是：Promise对象的状态由“未完成”变为“失败”，在异步操作失败时调用，并将异步操作报出的错误作为参数传递出去。

**Promise实例生成以后，可以用then方法分别制定resolved的状态和reject状态的回调函数。**

代码如下：

~~~javascript
promise.then(function(value) {
  // success
}, function(error) {
  // failure
});
~~~

#### 4.小例子-封装Ajax操作

~~~javascript
const getJSON = function(url) {
    const promise = new Promise(function(resolve, reject){
      const handler = function() {
        if (this.readyState !== 4) {
          return;
        }
        if (this.status === 200) {
          resolve(this.response);
        } else {
          reject(new Error(this.statusText));
        }
      };
      const client = new XMLHttpRequest();
      client.open("GET", url);
      client.onreadystatechange = handler;
      client.responseType = "json";
      client.setRequestHeader("Accept", "application/json");
      client.send();

    });

    return promise;
  };

  getJSON("./js/package.json").then(function(json) {
    console.log('Contents: ' , json);
  }, function(error) {
    console.error('出错了', error);
  });
~~~

以上的代码是通过用原生的Ajax和Promise实现的获取json的一个方法，在网页中运行得出以下的结果：

![Promsie1.png](https://i.loli.net/2019/10/20/MnhFwLqlKIbo9jf.png)

#### 5.reject状态回调方法的写法

~~~javascript
promise
  .then(function(data) {
    // success
  }, function(err) {
    // error
  });
~~~

以上是我们的reject状态方法，可以作为promise对象then方法的第二个参数。不过这样写有个缺点是：如果在resolve状态之后再抛出错误，则不会捕获。

~~~javascript
// 推荐写法
promise
  .then(function(data) { //cb
    // success
  })
  .catch(function(err) {
    // error
  });
~~~

###### 通过Promise这种写法，我们使很多异步操作的方法写法同步化，能够更好的组织优化代码，而且在捕获错误也更加容易，方便我们调试解决问题。不足之处，多多指正。

参考资料：
 [《ECMAScript 6 入门》-阮一峰](http://es6.ruanyifeng.com/#docs/promise)
 [《MDN-Promise》](https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Guide/Using_promises)





---
title: 页面性能优化-原生JS实现图片懒加载
date:  2019-04-25 22:55
tags:
- 博客园
- JavaScript
- HTML
---

博客迁移 [原博客园链接](https://www.cnblogs.com/peerless1029/p/10771695.html)

#### 前言

在项目开发中，我们往往会遇到一个页面需要加载很多图片的情况。我们可以一次性加载全部的图片，但是考虑到用户有可能只浏览部分图片。所以我们需要对图片加载进行优化，只加载浏览器窗口内的图片，当用户滚动时，再加载更多的图片。这种加载图片的方式叫做图片懒加载，又叫做按需加载或图片的延时加载。这样做的好处是：1.可以加快页面首屏渲染的速度；2.节约用户的流量。
<!--more-->

#### 一.实现思路

1.图片img标签自定义一个属性data-src来存放真实的地址。

2.当滚动页面时，检查所有的img标签，判断是否出现在视野中，如果出现在视野中，继续进行判断，看齐是否被加载过了，如果没有加载，那就进行加载。

判断图片元素是否处于浏览器视野中的示意图（手绘）：


![imgLazyLoading1.jpg](https://i.loli.net/2019/10/21/lAaodkMi6LmJIWP.jpg)

#### 二.根据思路完成代码如下：

~~~html
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <title>原生js实现图片懒加载</title>
  <style>
    *{
      margin: 0;
      padding: 0;
      box-sizing: border-box;
    }
    ul{
      overflow: hidden;
      list-style: none;
    }
    li{
      float: left;
      width: 50%;
      height: 200px;
      padding: 10px;
    }
    li img{
      display: inline-block;
      width: 100%;
      height: 100%;
    }
  </style>
</head>
<body>
<div class="container">
  <ul>
    <li><img src="http://cdn.jirengu.com/book.jirengu.com/img/1.jpg" alt="" data-src="http://cdn.jirengu.com/book.jirengu.com/img/1.jpg"></li>
    <li><img src="" alt="" data-src="http://cdn.jirengu.com/book.jirengu.com/img/2.jpg"></li>
    <li><img src="" alt="" data-src="http://cdn.jirengu.com/book.jirengu.com/img/3.jpg"></li>
    <li><img src="" alt="" data-src="http://cdn.jirengu.com/book.jirengu.com/img/4.jpg"></li>
    <li><img src="" alt="" data-src="http://cdn.jirengu.com/book.jirengu.com/img/5.jpg"></li>
    <li><img src="" alt="" data-src="http://cdn.jirengu.com/book.jirengu.com/img/6.jpg"></li>
    <li><img src="" alt="" data-src="http://cdn.jirengu.com/book.jirengu.com/img/7.jpg"></li>
    <li><img src="" alt="" data-src="http://cdn.jirengu.com/book.jirengu.com/img/8.jpg"></li>
    <li><img src="" alt="" data-src="http://cdn.jirengu.com/book.jirengu.com/img/9.jpg"></li>
    <li><img src="" alt="" data-src="http://cdn.jirengu.com/book.jirengu.com/img/10.jpg"></li>
    <li><img src="" alt="" data-src="http://cdn.jirengu.com/book.jirengu.com/img/11.jpg"></li>
    <li><img src="" alt="" data-src="http://cdn.jirengu.com/book.jirengu.com/img/12.jpg"></li>
    <li><img src="" alt="" data-src="http://cdn.jirengu.com/book.jirengu.com/img/13.jpg"></li>
    <li><img src="" alt="" data-src="http://cdn.jirengu.com/book.jirengu.com/img/14.jpg"></li>
    <li><img src="" alt="" data-src="http://cdn.jirengu.com/book.jirengu.com/img/15.jpg"></li>
    <li><img src="" alt="" data-src="http://cdn.jirengu.com/book.jirengu.com/img/16.jpg"></li>
  </ul>
</div>
<script>
  // window绑定滚动事件
  window.addEventListener('scroll',function(){
    // 遍历所有的img标签
    Array.prototype.slice.apply(document.getElementsByTagName('li')).forEach((li)=>{
      let img=li.getElementsByTagName('img')[0];
      // 判断当前img是否出现在了视野中
      // 判断当前img是否被加载过了
      if(checkShow(img) && !isLoaded(img)){
        loadImg(img);
      }
    })
  });

  // 判断img是否出现浏览器视野中
  function checkShow(img) {
    let scrollTop=document.documentElement.scrollTop; // 页面向上滚动的高度
    let windowHeight=window.innerHeight; //浏览器自身高度
    let offsetTop=img.offsetTop; //目标标签相对于document的高度
    return (offsetTop > scrollTop && offsetTop <(windowHeight + scrollTop));
  }

  // 判断是否已经加载过
  function isLoaded(img) {
    return img.getAttribute('src')===img.getAttribute('data-src');
  }

  // 加载图片
  function loadImg(img) {
   img.setAttribute('src',img.getAttribute('data-src'));
  }
</script>
</body>
</html>
~~~

好了，在浏览器中运行一下，第一次进页面如果不滚动滚轮的话什么也看不到，所以第一次进页面需要调用checkShow(),处于视野中的图片也加载出来。

在代码最后加上：

~~~javascript
// 第一次进页面加载处于视野中的图片
Array.prototype.slice.apply(document.getElementsByTagName('li')).forEach((li)=>{
let img=li.getElementsByTagName('img')[0];
// 判断当前img是否出现在了视野中
// 判断当前img是否被加载过了
if(checkShow(img) && !isLoaded(img)){
  loadImg(img);
}
})
~~~

此时我们发现判断加载视野中的图片代码存在重复，直接封装成一个新的方法lazyRenderImg();

~~~javascript
// window绑定滚动事件
window.addEventListener('scroll',function(){
// 遍历所有的img标签
lazyRenderImg();
});

function lazyRenderImg(){
Array.prototype.slice.apply(document.getElementsByTagName('li')).forEach((li)=>{
  let img=li.getElementsByTagName('img')[0];
  // 判断当前img是否出现在了视野中
  // 判断当前img是否被加载过了
  if(checkShow(img) && !isLoaded(img)){
    loadImg(img);
  }
})
}

// 第一次进页面加载处于视野中的图片
lazyRenderImg();
~~~

#### 三.性能优化

问题：window.scroll 方法页面只要一滚动就会触发里面的方法，对性能影响很大

解决方法：当页面停止滚动的时候，再去执行页面中的方法，类似与函数节流（throttle）

Tips:**函数节流**：等时间间隔执行函数， 让一个函数不要执行得太频繁，减少一些过快的调用来节流。

~~~javascript
// window绑定滚动事件
let timer;
window.addEventListener('scroll',function(){
console.log('scroll')
// 遍历所有的img标签
if(timer){
  clearTimeout(timer)
}
timer=setTimeout(()=>{
  console.log('lazyRenderImg...');
  lazyRenderImg();
},300);
~~~
通过打印的日志发现当滚动停止后才执行lazyRenderImg方法的，确实减少了不必要调用lazyRenderImg的次数。

![imgLazyLoading2.png](https://i.loli.net/2019/10/20/XDBNU1jrdmwIoCS.png)

###### 页面性能优化之图片懒加载就写这么多了，网页优化还有很多方法与技巧，前端路漫漫其修远兮，吾将上下而求索。本文不足之处，请多指正。

参考资料：

[https://www.jianshu.com/p/1b32e16ed0e5](https://www.jianshu.com/p/1b32e16ed0e5)
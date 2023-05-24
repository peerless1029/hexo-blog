---
title: 为什么设置overflow为hidden可以清除浮动带来的影响
date: 2018-11-28 08:11
tags:
- 博客园
- CSS
- HTML
---

博客迁移 [原博客园链接](https://www.cnblogs.com/peerless1029/p/10029959.html)

#### 1.问题起源　　

在平时的业务开发写CSS中，为了满足页面布局，元素的浮动特性我们用的不能再多了。使用浮动的确能够解决一些布局问题，但是也带了一些副作用影响，比如，父元素高度塌陷，我们有好几种可以清除浮动的方法，最常用的就是设置父元素的overflow:hidden这个属性，每次在写代码的时候总是这样写，但是，自己从没深度思考过这些写为什么能够清除浮动，最近，自己也查阅了一些资料，谈谈自己的理解。
<!--more-->
#### 2.情景再现

先上代码：
~~~html
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <title>清除浮动</title>
  <style>
    .container{
      border: 1px solid #000;
　　   background: #0f0;
    }
   .child{
     float: left;
   }
  </style>
</head>
<body>
<div class="container">
 <div class="child">
   Lorem ipsum dolor sit amet, consectetur adipisicing elit. Alias aperiam dolorem eligendi laudantium libero magnam magni numquam voluptas voluptatem voluptatibus? Consequuntur delectus dolorem esse explicabo minus neque non quaerat voluptatum!
 </div>
</div>
</body>
</html>
~~~
代码很简单，就是父元素container里面包含了一个子div元素child，然后我们使子元素的div向左浮动，页面展示效果如下：

![overflowHidden1.png](https://i.loli.net/2019/10/20/hlunfBr3Ze2WgYG.png)

结果来看，父元素只显示了四个方向边框的高度，背景颜色未显示，这是因为子元素浮动脱离文档流造成父元素高度塌陷。

#### 3.解决方法
~~~html
**
 .container{
      border: 1px solid #000;
      background: #0f0;
      overflow: hidden;
    }
**
~~~
只在container父元素加了一行overflow:hidden

![overflowHidden2.png](https://i.loli.net/2019/10/20/3sVB9hMyL1fezQm.png)

父元素高度被撑起来了，背景颜色也显示出来了。

我们先了解一个名词：**BFC**（block formatting context），中文为“**块级格式化上下文**”。

先记住一个原则：如果一个元素具有BFC,那么内部元素再怎么翻江倒海，翻云覆雨，都不会影响外面的元素。所以，BFC元素是不可能发生margin重叠的，因为margin重叠会影响外面的元素的；BFC元素也可以用来清楚浮动带来的影响，因为如果不清楚，子元素浮动则会造成父元素高度塌陷，必然会影响后面元素的布局和定位，这显然有违BFC元素的子元素不会影响外部元素的设定。

以下情况会触发BFC:

- html根元素
- float的值不为none
- overflow的值为auto，scroll，hidden
- display的值为table-cell，table-caption和inline--block中的任何一个
- position的值不为relative和static

显然我们在设置overflow值为hidden时使container元素具有BFC，那么子元素child浮动便不会带来父元素的高度坍塌影响。

#### 5.总结

###### 设置overflow为hidden使元素具有BFC而不会受子元素的影响，但是当子元素过多需要滚动显示时，我们可以设置overflow的值为auto或acroll，超出父元素之外的元素会被隐藏。使用overflo:hidden也具有一定的局限性，所以我们应该根据具体的业务场景来选择合适的方法。

参考资料：
《CSS世界》-张鑫旭
[overflow:hidden清除浮动原理解析及清除浮动常用方法总结](https://www.cnblogs.com/luoqian/p/5987788.html)
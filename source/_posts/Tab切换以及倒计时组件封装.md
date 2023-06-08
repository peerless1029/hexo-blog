---
title: Tab切换以及倒计时组件封装
date: 2023-06-08 23:03:33
tags:
- JavaScript
- Vue
---

### 1、Tab组件 
![](/imgs/02_common_componets/1.gif)

**功能**
  - 支持默认选中tab
  - 子元素可以是文本或者图片
  - 自定义tab的数量，并自适应展示
<!--more-->
**实现方式**
  1. 用ul > li标签遍历传入的tabs数组参数渲染
     ![](/imgs/02_common_componets/1.png)
  2. 判断是否传入背景，未传则显示文字
     ![](/imgs/02_common_componets/2.png)
  3. 绑定点击事件

**特点**
  - 简单易用
  - 可适配性

### 2、倒计时组件 
![](/imgs/02_common_componets/2.gif)

**功能**
- 常用于榜单或者活动结束倒计时、或者开始倒计时、从而提高用户的参与度与期待感
- 距离倒计时预设时间可触发事件

**实现方式**
1. 通过传入倒计时通过定时器每隔1秒计算剩余的时间，以数组形式返回
   ![](/imgs/02_common_componets/3.png)
2. 将计算出来的时间数组countdown 通过times属性传递给子组件插槽内容
   ![](/imgs/02_common_componets/4.png)
   ![](/imgs/02_common_componets/5.png)
3. 注意：倒计时结束或者页面卸载时，清除定时器
   ![](/imgs/02_common_componets/6.png)

**特点**
- 只需要传递时间间隔，与业务组件解耦
- 返回一个 [天，时，分，秒] 数组，灵活性高

---
title: React的入门知识与概念【1】
date: 2018-10-26 01:37
tags: 
- 博客园
- JavaScript
- React
---

博客迁移 [原博客园链接](https://www.cnblogs.com/peerless1029/p/9853823.html)

回顾在以往的项目开发中，从最初的使用的原生html+js+css+jquery开发，到后来随着项目功能的增加，也渐渐学习了Vue.js框架的开发，以及Vue.js的全家桶Axios,Vue-router等的使用。自己大概在两年前有过浅尝辄止地学习过React，由于在业务开发项目中没有太多的使用，很多API也逐渐的淡忘。最近，利用业余时间，以一个小白的身份重拾React，毕竟技多不压身嘛。下面，对React入门知识做一个总结。
<!--more-->
#### 1.React简介

首先学习一门框架或技术我们先去其官网阅读下官方文档，看看其到底是什么以及有什么特点以及如何使用。React顾名思义有响应的意思，UI界面根据状态数据的改变而渲染，你只负责处理好数据即可，其他的交给ReactDOM去完成。官方对React的描述是：A JavaScript library for building user interfaces （一个用于构建用户界面的javascript库），实际上它并不是一个MUV框架，从MVC的分层来看，React相对于V这一层，它关注的是如何根据状态创建可复用的UI组件，如何根据组件创建可组合的UI。

**React的特点可归结于以下四点：**

（1）声明式的视图层。
（2）简单的更新流程。
（3）灵活的渲染实现。
（4）高效的DOM操作。

#### 2.React的开发环境的搭建
2.1确保[Node.js](https://nodejs.org/zh-cn/)的安装（安装方法自行百度）
2.2安装React脚手架工具：
~~~bash
npm install create-react-app
~~~
2.3安装之后就可以选择一个文件夹生成一个项目了，例如
~~~bash
create-react-app todolist
~~~
_todoList是项目的名称_
2.4安装完毕 ,启动
~~~bash
cd todolist
npm start
~~~
![react1.png](https://i.loli.net/2019/10/20/5mbyjT84EVkLuz7.png)
![react1.1.png](https://i.loli.net/2019/10/20/dA8WMnEH6cORJVF.png)
![react2.png](https://i.loli.net/2019/10/20/IPMkH1viVEgwldC.png)

_以上3张图分别是进入项目目录启动项目，项目目录结构，页面呈现效果。（个人对项目目录部分不用的文件有删减，以实际生成的目录结构为准）。_

#### 3、JSX简介
**JSX是一种用于描述UI的JavaScript的扩展语法，React使用这种语法描述组件的UI。简单理解为JavaScriptXML。**　

3.1基本语法：
~~~jsx
const ele=(
  <div>
    <h1>Hello,React</h1>
  </div>
)
~~~
　3.2标签类型：自己定义以首字母大写的自定义组件类型的标签，以及DOM类型的标签，两种标签可以互相嵌套使用
~~~jsx
// DOM类型的标签
const ele=<h1>Hello,React</h1>

// React组件类型的标签
const ele=<HelloWorld/>

// 二者互相嵌套使用
const ele=(
<div>
  <HelloWorld/>
<div>
)
~~~
3.3JavaScript表达式
- 事件名用小驼峰命名法
- 部分属性名称要改变：class写成className，for写成htmlFor

3.5注释
~~~jsx
{/*多行注释：*/}
{
// 单行注释
 }
~~~
3.6其他
元素返回要包裹在一个标签内，如果要在页面中隐藏最外层标签，可以引用<Fragment><Fragment/>，代码如下
~~~jsx
import React,{Component,Fragment} from 'react';
class TodoList extends Component{
    render(){
    return(
        <Fragment>
          <div></div>
          <ul></ul>
        </Fragment>
    )
  }
}
~~~
#### 4.组件
**组件是React的核心概念，组件将应用的UI拆分成独立的，可复用的模块，React应用程序正是由一个一个的组建搭建而成的。**

4.1组件的类型
- 有状态组件：ES6 class组件
- 无状态组件：函数组件
~~~jsx
// 无状态组件
function Hello(){
  return <h1>Hello World</h1>
}
// 有状态组件
class TodoList extends Component{
  // 最优先执行的函数
  constructor(props){
    super(props);
    this.state={
      inputValue:'',
    }
  }

  render(){
    return(
        <Fragment>
          <div>
            <label htmlFor="input">输入内容：</label>
            <input className='input' id='input' type="text" value={this.state.inputValue}>提交</button>
          </div>
        </Fragment>
    )
  }
}
~~~

4.2组件的props
组件的props用于吧父组件的数据或方法传递给子组件
~~~jsx 
// 父组件
getTodoItem(){
    return(
        this.state.list.map((item,index)=> {
         return (
            <TodoItem
                key={index}
                content={item}
            />
      )
    })
    )
  }
 
// 子组件
render(){
  const {content}=this.props;
  return(
      <div onClick={this.handleClick} key={this.props.index}>{content}</div>
 
  )
}
~~~
4.3组件的state
组件的state是组件的内部状态，state的变化最终反映到组件UI的变化上。我们在组件的构造方法constructor中通过this.state定义组件的状态，通过this.setState方法改变组件的状态（概念：immutable state不允许我们做任何的改变 改变副本就可以）。

###### 以上是React的基础知识概念，后面再通过一些具体的Demo来加深对React的理解与使用，最后能以最优雅的方式来书写JS代码以及精通React，如有不足，请多指正。

参考书籍
《React进阶之路》



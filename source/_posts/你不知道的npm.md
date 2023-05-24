---
title: 你不知道的npm
date: 2022-02-22 23:33:27
tags:
- JavaScript
---
#### 一、前言
现在的前端开发或者是工程化项目搭建都是基于Node.js搭建的，说起Node.js必然绕不开npm（全称 Node Package Manager，即“node包管理器”）是Node.js默认的、用JavaScript编写的软件包管理系统。），npm是随同NodeJS一起安装的包管理工具，能解决NodeJS代码部署上的很多问题。

#### 二、npm简介
1、组成部分
- [网站](https://www.npmjs.com/)
- CLI-终端命令号界面。
- registry JavaScript包及其相关元信息的大型公共数据库。

2、一个javascript包都会对应有一个package.json文件，下面对这个文件里常见字段加以说明
~~~json
{
  name: "",
  //包名
  version: "",
  //包的版本号
  description: "",
  //包的描述
  homepage: "",
  //包的官网 url
  author: "",
  //包的作者姓名
  contributors: "",
  //包的其他贡献者姓名
  dependencies: "",
  //依赖包列表。如果依赖包没有安装，npm 会自动将依赖包安装在 node_module 目录下。
  repository: "",
  // 包代码存放的地方的类型，可以是 git 或 svn，git 可在 Github 上。
  main: "",
  //指定了程序的主入口文件，require('moduleName') 就会加载这个文件。这个字段的默认值是模块根目录下面的 index.js。
  "keywords":"" //关键字
}
~~~
#### 三、CLI常用命令行
1.可以用来设置一个新的或已有的NPM package.json文件。
~~~javascript
npm init
~~~
2.可以用来设置一个新的或已有的NPM package.json文件。
~~~javascript
npm install pkgName
~~~
3.可以用来设置一个新的或已有的NPM package.json文件。
~~~javascript
npm install pkgName
~~~
3.可以用来设置一个新的或已有的NPM package.json文件。
~~~javascript
npm install pkgName
~~~
3.搜索注册包 显示包名、描述、作者、发布日期、版本号、关键字等
***和 https://www.npmjs.com/search?q=pkgName 官方搜索功能一致***
~~~javascript
npm search pkgName
~~~
4.在浏览器打开包的github仓库网页 当想了解某些包源码的时候可以使用
~~~javascript
npm repo pkgName
~~~
5.显示包的相关信息
~~~javascript
npm view pkgName
~~~
6.本地收藏/取消收藏包 展示收藏的安装包
~~~javascript
npm star
npm unstar 
npm stars
~~~
7.设置淘宝镜像源，提升安装包速度
~~~javascript
npm install -g cnpm --registry=https://registry.npmmirror.com
~~~

#### 五、一些有趣的npm包
1.控制台黑板擦功能 [wipeclean](https://www.npmjs.com/package/wipeclean)
![npm1](/imgs/2022/npm/01.png)
2.创建ASCII美术字体 [figlet](https://www.npmjs.com/package/figlet)
![npm2](/imgs/2022/npm/02.png)
3.翻译软件 [fanyi](https://www.npmjs.com/package/fanyi)
4.[yosay](https://www.npmjs.com/package/yosay)
![npm3](/imgs/2022/npm/03.png)


参考资料：
1、[npm官网](https://docs.npmjs.com/cli/v8/)
2、[菜鸟教程NPM](https://www.runoob.com/nodejs/nodejs-npm.html)
3、[维基百科](https://zh.wikipedia.org/wiki/Npm)




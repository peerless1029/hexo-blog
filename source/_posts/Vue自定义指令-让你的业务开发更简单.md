---
title: Vue自定义指令-让你的业务开发更简单 
date: 2023-4-7 00:00 
tags:
- 博客园
- JavaScript
- Vue

---

## 1、使用场景

在日常开发中，我们会将重复代码抽象为一个函数或者组件，然后在需要时调用或者引入。但是，对于某些功能，这种方法可能不够优雅或者不够灵活。例如，我们可能需要在DOM元素上添加一些自定义属性或者绑定一些事件，这些操作可能难以通过函数或组件来实现。这时，[自定义指令](https://v2.cn.vuejs.org/v2/guide/custom-directive.html)就派上用场了。

## 2、简介

1.注册使用(官网例子：页面加载时，该元素将获得焦点)

> - 全局注册
> ``` javascript
Vue.directive('focus', { // 当被绑定的元素插入到 DOM 中时…… inserted: function (el) { // 聚焦元素 el.focus()
} });

```
> - 组件注册
> ``` javascript
...
directives: {
  focus: {
    // 指令的定义
    inserted: function (el) {
      el.focus()
    }
  }
}
...
```

> - 使用
> ```
<input v-focus>
```
<!--more-->
2.钩子函数

一个指令定义对象可以提供如下几个钩子函数 (均为可选)：

- bind： 只调用一次，指令第一次绑定到元素时调用。在这里可以进行一次性的初始化设置。
- inserted：被绑定元素插入父节点时调用 (仅保证父节点存在，但不一定已被插入文档中)。
- update：所在组件的 VNode 更新时调用，但是可能发生在其子 VNode 更新之前。
- componentUpdated：指令所在组件的 VNode 及其子 VNode 全部更新后调用。
- unbind：只调用一次，指令与元素解绑时调用。

3.钩子函数参数

- el：指令所绑定的元素，可以用来直接操作 DOM。
- binding：一个对象，包含以下 property：
- vnode：Vue 编译生成的虚拟节点
- oldVnode：上一个虚拟节点，仅在 update 和 componentUpdated 钩子中可用。

![image](/imgs/01_custom_directives/8.png)
4.举个例子

``` javascript
<div>
    <button @click="changeCustom">显示:{{ isShowCustom }}</button>
    <button @click="changeCustomText">生成随机数</button>
</div>
<div class="custom-box" v-if="isShowCustom">
    <div v-change-style="'#0f0'">{{ customMsg1 }}</div>
</div>
...
// 注册全局自定义指令
Vue.directive('change-style', {
    bind: (el) => {
        console.log('1、只调用一次，指令第一次绑定到元素时调用。在这里可以进行一次性的初始化设置。');
    },
    inserted: () => {
        console.log('2、被绑定元素插入父节点时调用 (仅保证父节点存在，但不一定已被插入文档中)。');
    },
    update: () => {
        console.log('3、所在组件的 VNode 更新时调用，但是可能发生在其子 VNode 更新之前。');
    },
    componentUpdated: () => {
        console.log('4、指令所在组件的 VNode 及其子 VNode 全部更新后调用。');
    },
    unbind: () => {
        console.log('5、只调用一次，指令与元素解绑时调用。');
    },
});
```

![image](/imgs/01_custom_directives/1.gif)

## 3、优点

1.**重用性**：多个组件之间共享代码 2.**封装性**: 将特定的操作封装在指令中，使得组件代码更加简洁，易于维护 3.**灵活性**：可以处理一些特定的操作，例如修改DOM属性、绑定事件等 4.**可读性**：
让模板更加清晰和易于阅读。在模板中使用指令可以让代码更加简洁明了，从而降低了代码的复杂度 5.**可维护性**：把特定的逻辑封装在指令内部，从而让代码更加易于维护。如果需要更改某个行为，只需要在指令中修改即可，不需要修改多个组件 6.**
可扩展性**：如果需要添加新的特殊行为，只需要创建一个新的指令即可

## 4、常用自定义指令

以下总结了个人在日常活动开发中常用的自定义指令

1.防止重复操作(节流)
一段时间内只允许操作一次 适用场景：接口请求、频率限制

``` javascript
// 用法：v-throttle = [节流时间] 
// 单位：毫秒
<button v-throttle="2000" @click="print">提交</button>
```

![image](/imgs/01_custom_directives/2.gif)

2.一键复制

``` javascript
// 用法：v-copy = [待复制内容文本] 
// 类型：string
<button v-copy="'这是一段复制内容'">复制按钮</button>
```

![image](/imgs/01_custom_directives/3.gif)

3.活动埋点 页面曝光埋点以及点击事件埋点

``` javascript
// 用法 v-track:[埋点上报页面].[埋点类型].[是否延时] = "埋点"
// 埋点上报页面 - page_id 默认值：:activity_page
// 埋点类型 - event| exposure 默认值： click
// 是否延时 - delay 默认值：2000ms

// 点击事件指令
<button v-track:activity_page.click.delay="'btn_click'">点击事件</button>
// 等价于以下方法：
setTimeout(() => {
    track({
        page_id: 'activity_page',
    }, 'click');
}, 2000);

// 曝光事件指令
<div v-track:activity_page.exposure></div>
// 等价于以下方法：
track({
    page_id: 'activity_page',
}, 'exposure');
```

![image](/imgs/01_custom_directives/4.gif)

4.图片懒加载 在图片出现在视窗区域时开始加载，减少不必要的请求以及流量，适用于无限滚动列表以及瀑布流页面。

``` javascript
用法：v-lazy = [图片地址]
<img v-lazy="item">
```

![image](/imgs/01_custom_directives/5.gif)

5.悬浮拖拽 悬浮可拖拽按钮

``` javascript
// 用法： v-drag
// 备注：目前暂支持移动端
<button v-drag @click="print">拖拽按钮</button>
```

6.无限滚动加载 让网页在滚动到页面底部时自动加载更多的内容，从而提高用户体验和页面性能。

``` javascript
// 用法：v-scroll-bottom = "事件"
v-scroll-bottom="loadMore"
<div class="list-box h-[300px] !px-[10px] overflow-scroll" v-scroll-bottom="loadMore">
    <div class="h-[50px] leading-[50px] bg-[#CCC] mb-[12px] text-center" v-for="(item, index) in list"
         :key="index">
        {{ index }}
    </div>
</div>
```

![image](/imgs/01_custom_directives/7.gif)

7.其他自定义指令

- 非活动时间操作提示
- 金额处理
- 表单输入框处理判断处理
- 权限管理

## 5、总结

可以看到，通过封装使用自定义指令，使我们的代码更简洁优雅，在实际开发中，可以根据具体场景和需求来使用自定义指令，以提高开发效率和代码质量。

****
注：代码基于vue2.x版本

参考：
[自定义指令 — Vue.js](https://v2.cn.vuejs.org/v2/guide/custom-directive.html)
[撸一个 Vue 自定义指令实现一键 Copy的功能 - 掘金](https://juejin.cn/post/6844903942321602568)
[v-track](https://www.npmjs.com/package/v-track)

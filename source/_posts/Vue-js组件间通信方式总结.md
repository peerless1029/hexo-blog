---
title: Vue.js组件间通信方式总结
date: 2018-11-23 08:06
tags: 
- 博客园
- JavaScript
- Vue
---

博客迁移 [原博客园链接](https://www.cnblogs.com/peerless1029/p/10005316.html)

平时在使用Vue框架的业务开发中，组件不仅仅要把模板的内容进行复用，更重要的是组件之间要进行通信。组件之间通信分为三种：父-子；子-父；跨级组件通信。下面，就组件间如何通信做一些总结。

#### 1.父组件到子组件通过props通信
在组件中，使用选项props来声明需要从父级组件接受的数据，props的值可以是两种：一种是字符串数组，一种是对象。props中声明的数据与组件data函数return的主要区别在于props来自父级，而data中的组件是自己的数据，作用域是组件本身，这两种数据都可以在模板template及计算属性computed和方法methods中使用。
<!--more-->如以下例子：
~~~vue
// 父组件 ParentComponent
<template>
  <div class="parent-component">
    <h2>这是一个父组件</h2>
    <ChildComponent :parentMessage="parentMessage"/>
  </div>
</template>

<script>
  import ChildComponent from './ChildComponent'
  export default {
    name: "ParentComponent",
    data(){
      return{
        parentMessage:'这是来自父组件的数据'
      }
    },
    components:{
      ChildComponent
    }
  }
</script>
~~~
~~~vue
// 子组件 ChildComponent
<template>
<div class="child-component">
  <h2>这是一个子组件</h2>
  <h3>{{parentMessage}}</h3>
</div>
</template>

<script>
  export default {
    name: "ChildComponent",
    props:["parentMessage"]
  }
</script>
~~~
![vuePostValue1.png](https://i.loli.net/2019/10/20/VrOesGm7THFxNcW.png)

**小结：父组件传递个子组件的数据可以写死，也可以用父级的动态数据用v-bind来绑定props的值。**
#### 2.子组件到父组件通过$emit，$on通信
~~~vue
// ParentComponent 父组件
<template>
  <div class="parent-component">
    <h2>这是一个父组件total:{{total}}</h2>
    <ChildComponent :parentMessage="parentMessage" :total="total" @handleAdd10="getTotal"/>
  </div>
</template>

<script>
  import ChildComponent from './ChildComponent'
  export default {
    name: "ParentComponent",
    data(){
      return{
        parentMessage:'这是来自父组件的数据',
        total:10,
      }
    },
    components:{
      ChildComponent
    },
    methods:{
      getTotal(total){
        this.total=total;
        console.log('ParentComponent total:',total);
      }
    }
  }
</script>
~~~
~~~vue
// ChildComponent 子组件
<template>
<div class="child-component">
  <h2>这是一个子组件</h2>
  <h3>{{parentMessage}}</h3>
  <button @click="handleAdd10">+10按钮</button>
</div>
</template>

<script>
  export default {
    name: "ChildComponent",
    props:["parentMessage","total"],
    methods:{
      handleAdd10(){
        let total=this.total+10;
        console.log('ChildComponent $emit:');
        this.$emit('handleAdd10',total);
      }
    }
  }
</script>
~~~
![vuePostValue2.png](https://i.loli.net/2019/10/20/jwMItcL18rzY3Fi.png)


上面例子中，子组件有一个按钮，实现加10的效果，子组件通过props项来接收父组件传入的total值，在改变total后，通过$emit把它传给父组件，父组件定义事件@handleAdd10方法，子组件$emit()方法第一个参数是自定义事件的名称，后面的参数是要传的数据，对应的父组件通过getTotal(total)来接收子组件传递的数据，由此子组件到父组件通信完成。
#### 3.表单子组件到父组件通过v-model来通信(语法糖)
~~~vue
// ParentComponent 改动如下
**
<h2>这是一个父组件total:{{total}}</h2>
<ChildComponent :parentMessage="parentMessage" :total="total" @handleAdd10="getTotal"/>
<InputComponent v-model="total"/>
**
<script>
import InputComponent from './InputComponent'
</script>
**
~~~
~~~vue
// InputComponent 子组件
<template>
  <input type="text" @input="updateValue($event)">
</template>

<script>
  export default {
    name: "InputComponent",
    methods:{
      updateValue(evt){
        this.$emit('input',evt.target.value)
      }
    }
  }
</script>
**
~~~
![vuePostValue3.png](https://i.loli.net/2019/10/20/JE3kMsBTZPlnrR5.png)
以上示例中：因为子组件的事件名是特殊的input，在使用组件的父级，可以通过v-model来绑定数据total，这种实现方式也可以称作语法糖，大大减少了父组件代码量。

#### 4.非父子组件通过中央事件总线(bus)来通信
在vue.js2.x中推荐使用一个空的Vue实例作为中央事件总线（bus）,先看一个例子：

~~~vue
// ParentComponent 父组件
<template>
  <div class="parent-component">
    {{message}}
    <br>
    <br>
    <component-a/>
  </div>
</template>

<script>
  import Vue from 'vue'
  let bus=new Vue();
  export default {
    name: "ParentComponent",
    data(){
      return{
        message:'',
      }
    },
    components:{
      componentA:{
        template:'<button @click="handleClick">传递事件</button>',
        methods:{
          handleClick(){
            bus.$emit('on-message','来自子组件component-a的内容')
          }
        }
      }
    },
    mounted(){
      bus.$on('on-message',(msg)=>{
        this.message=msg;
      });
    }
  }
</script>
~~~
![vuePostValue4.png](https://i.loli.net/2019/10/20/ZbVNvgi42JozDTn.png)

以上例子中：首先创建了一个bus的空Vue实例，里面没有任何内容，然后全局定义了组件component-a,，在父组件ParentChild的生命周期mounted钩子函数中监听来自bus的事件on-message。而在组件component-a中，点击按钮会通过bus把事件on-message发出去，父组件会接受来自bus的事件，改变message的值。

这种方法巧妙轻量的实现了任何组件之间的通信，包括父子，兄弟，跨级组件。

#### 5.状态管理与Vuex与总结

在实际业务中，经常会有跨组件共享数据的需求，如果项目不复杂，使用bus就能简单的解决问题，但是使用bus在数据的管理、维护、架构设计上还只是一个简单的组件，在大型单页应用，多然开发的项目中，Vuex能更加优雅和高效的完成状态管理。

![vuePostValue5.png](https://i.loli.net/2019/10/20/hiTtLPz5grSDp1y.png)

###### 根据以上组件间通信的描述，用一张图来表示组件间的通信示例，以上就是个人对于Vue组件间通信的实践与理解，如果有纰漏不足的地方，请多指正。

参考资料：

《Vue.js实践》
[Vue.js](https://cn.vuejs.org/) 
[Vuex](https://vuex.vuejs.org/zh/guide/)
















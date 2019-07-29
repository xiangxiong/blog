>  React 基础知识问题.

* react 生命周期有哪些?
    * react 组件的生命周期有三个不同的阶段:
    - 初始化阶段: 这是组件即将开始其生命并进入DOM阶段.
    - 更新阶段: 一旦组件被添加到DOM，它只有在prop 或状态发生变化时才可能更新和重新渲染。这些只发生在这个阶段.
    - 卸载阶段: 这是组件生命周期的最后阶段,组件被销毁从DOM中删除.

* 一些重要的生命周期方法:
    * componentWillMount**()** – 在渲染之前执行，在客户端和服务器端都会执行。
    * componentDidMount – 仅在第一次渲染后在客户端执行.
    * componentWillReceiveProps 当从父类接收到 props 并且在调用另一个渲染器之前调用.
    * shouldComponentUpdate – 根据特定条件返回 true 或 false。如果你希望更新组件.
    * componentWillUpdate**()** – 在 DOM 中进行渲染之前调用.
    * componentDidUpdate**()** – 在渲染发生后立即调用.
    * componentWillUnmount**()** – 从 DOM 卸载组件后调用。用于清理内存空间.

* 出彩的地方:
    * 16 版本里面新增了:componentDidCatch 这个钩子函数，划分出错误组件与边界组件，每个边界组件能修复下方组件错误一次，再次出错，转交给更上层的组件来处理，解决异常处理问题.
   
    * 自React16起, 任何未被错误边界捕获的错误将会导致整个React 组件被卸载. 

    * 注意错误边界仅可以捕获其子组件的错误，它无法捕获其自身的错误。如果一个错误边界无法渲染错误信息，则错误会冒泡至最近的上层错误边界，这也类似于 JavaScript 中 catch {} 的工作机制.

    * https://codesandbox.io/s/lOo5AV12M.
    * https://codepen.io/gaearon/pen/wqvxGa?editors=0010

* 高阶组件用过吗? 怎么使用的?

* 高阶组件 基本定义:
    * 高阶组件就是一个高阶函数.
    * const EnhancedComponent = higherOrderComponent(WrappedComponent);
    * 高阶组件最大的好处就是解耦和灵活性，在react的开发中还是很有用的.

* 你在项目里面是怎么使用的?
    * 1、抽取公用代码和业务逻辑.功能和页面类似的页面，可以把一些共同的操作抽离到HOC组件中.:
    * 2、抽离state. react 处理表单的时候，如果使用了受控组件，可以把onChange 事件同步改变state 的代码，封装到高阶组件中,还有提交的事件.
    * 3、劫持渲染.(loading 动效,页面权限管理)
    * 4、操作props,增加用户信息属性对象.
    * 5、反向继承. 场景:两个页面的相似度非常高，要新加一些属性的时候可以考虑使用.

 * 问 题:
    * 不要在render方法内部使用高阶组件。简单来说react的差分算法会去比较 NowElement === OldElement, 来决定要不要替换这个elementTree。也就是如果你每次返回的结果都不是一个引用，react以为发生了变化，去更替这个组件会导致之前组件的状态丢失.

    * refs不会传递。 意思就是HOC里指定的ref，并不会传递到子组件，如果你要使用最好写回调函数通过props传下去。

    * 最重要的原则就是，注意高阶组件不会修改子组件，也不拷贝子组件的行为。高阶组件只是通过组合的方式将子组件包装在容器组件中，是一个无副作用的纯函数.

    * 继承和组合有什么区别?

        * 继承的优点: 继承的优点是子类可以重写父类的方法来方便实现对父类的扩展.

        * 集成的缺点:  is a 的关系.
            * 1、父类的内部细节对子类是可见的.
            * 2、子类从父类继承的方法在编译的时候就确定下来了，所以无法在运行期间改变从父类继承的方法和行为.
            * 3、子类与父类是一种高耦合，违背了面向对象的思想.
            * 4、继承关系最大的弱点是打破了封装，子类能够访问父类的实现细节，子类与父类之间紧密耦合，子类缺乏独立性，从而影响了子类的可维护性。
            * 5、不支持动态继承，在运行时，子类无法选择不同的父类。

        * 组合 has a 关系.
            * 1、不破坏封装，整体类与局部类之间松耦合，彼此独立。
            * 2、具有较好的可扩展性。
            * 3、支持动态组合。在运行时，整体对象可以选择不同类型的局部对象.

    * React.Component 里面有啥东西?
        * react 里面有个 ReactBaseClasses.js 里面.
        * Component(props, context, updater) 里面有三个参数.
        * Component 方法: isReactComponent,forceUpdate,setState,isPureReactComponent
        * pureComponent 集成来自 React.Component.
        * this.updater = updater || ReactNoopUpdateQueue; 这个属于渲染的方法. react native  & react 渲染的方法，更新的流程不同.
        * 渲染的方法不一样:

        ```
        (type.prototype && type.prototype.isPureReactComponent) {
            shouldUpdate =
                !shallowEqual(oldProps, props) || !shallowEqual(oldState, state);
        }
        ReactFiberClassComponent.js
        ```

 * 衍生的知识:
    * 1、使用 compose 组合 HOC.

* minxins 使用:
    * 1、es6 不支持 minxins。
    * 2、在多个minxin 混合使用的时候，可能会遇到state 冲突.（命名冲突）.
    * 3、多个hoc 组件包装的时候也会出现属性冲突的问题. WithMouseHoc(WithCatHoc(CatItem))。当有多个高级组件嵌套的时候会有属性冲突.
    * 4、render props 和 hoc 组合使用.

* render Props的基本定义.
    * 1、

* 可以使用react Hooks 来替换 HOC 和 render Props?
    * 1、

* 将错误组件封装成高阶组件 HOC & render Props & react Hooks.
    * 解决代码重复书写多次的问题.
    * 你在项目里面是怎么使用的?
    ```
        import React, { Component } from 'react';

        // 这个函数，是生成高阶组件的函数
        // 这个函数，返回一个组件
        export default (DecoratedComponent, styles) => {
            // 返回的这个组件，叫做高阶组件
            return class NewComponent extends Component {
                componentWillMount() {
                    if (this.props.staticContext) {
                        this.props.staticContext.css.push(styles._getCss());
                    }
                }
                render() {
                    return <DecoratedComponent {...this.props} />
                }
            }
        }
        装饰器.
    ```

    ```
    使用表单案例场景.
    https://github.com/sunyongjian/blog/issues/25

    * 衍生的知识:
        * 函数柯里化.
        * https://zhuanlan.zhihu.com/p/26794822
        init(){
            var add3 = this.add(3);
            console.log('add3',add3(4));

            let add4 = (x,y) => x + y;
            console.log('add4',add4(3,4));

            // https://zhuanlan.zhihu.com/p/26794822
            let add5 = x => y => x + y;
            console.log('add5',add5(3)(4));
        }

        add(a){
            return function(b){
                return a+b;
            }
        }
    ```

    * 衍生的问题: 受控组件可以理解为通过事件来控制，每个状态的改变多有一个与之相关的处理函数。好处是直接修改或验证用户输入.

    * 非受控组件不同于受控组件数据是react组件处理的,通过dom进行处理.

    * 参考文献:
        *  https://github.com/sunyongjian/blog/issues/25
        *  https://segmentfault.com/a/1190000010869171

        *  https://coding.imooc.com/lesson/276.html#mid=18430

        * https://medium.com/@franleplant/react-higher-order-components-in-depth-cf9032ee6c3e#.wwp0tbukh

    *  

* react.componet vs react.pureComponent 对比?

    * React.PureComponent 与 React.Component 几乎完全相同，但 React.PureComponent 通过prop和state的浅对比来实现 shouldComponentUpate().

    * 如果对象嵌套层级较深或者函数该如何做比较呢?
        * 对于引用类型只能对其进行递归比较才能判断其是否相等.
        * 实现代码:
            * 1、验证基本类型.
            * 2、验证数组.
            * 3、验证对象.
            * 4、检查是否有循环引用的部分.
        ```
        function equalArray(arr1,arr2,deepCheck){
            if(arr1 === arr2){
                return true;
            }

            if(arr1.length !== arr2.length){
                return false;
            }

            // 浅度检测
            if(deepCheck){
                return arr1.toString() === arr2.toString();
            }

            // 判断每个基本数据类型是否一样.
            var type1,type2;
            for(var i=0;i<arr1.length;i++){
                type1 = type(arr1[i]);
                type2 = type(arr2[i]);

                if(type1 !== type2){
                    return false;
                }
                if(type === "Object"){
                    if (!equalObject(obj1[key], obj2[key], true)) {
                                    return false;
                      };
                }
                else if(){
                    if (!equalArray(obj1[key], obj2[key],true)) {
                        return false;
                    };
                }
                else if (obj1[key] !== obj2[key]) {
                    return false;
                }
            }
        }

        function type(data){
            return object.prototype.toString.call(data).slice(8,-1);
        }

        /**
            * 判断两个对象是否相等
            * 浅度判断：
            *      1.只判断obj的第一层属性总数是否一样
            *      2.值的===判断是否为真
            * 深度判断：
            *      值为对象，参考本规则
            *      值为数组，参考equalArray的深度判断
            *      值为其他类型，用===判断
       **/


       /**
        * 对比两个function是否一样
        * 主要对比两者toString是否一样，
        * 对比会去掉函数名进行对比，其它哪怕差个回车都会返回false
        * 
        * @param  {[type]} fn1
        * @param  {[type]} fn2
        * @return {[type]}
        */

        参考文献:
        * https://gist.github.com/smallnewer/6535788.
        * https://imweb.io/topic/598973c2c72aa8db35d2e291.
        ```
    * 
    * React.PureComponent 的 shouldComponentUpdate() 只会对对象进行浅对比。如果对象包含复杂的数据结构，它可能会因深层的数据不一致而产生错误的否定判断(表现为对象深层的数据已改变视图却没有更新, 原文：false-negatives)。当你期望只拥有简单的props和state时，才去继承 PureComponent ，或者在你知道深层的数据结构已经发生改变时使用 forceUpate() 。或者，考虑使用不可变对象来促进嵌套数据的快速比较.

    * 此外,React.PureComponent 的 shouldComponentUpate() 会忽略整个组件的子级。请确保所有的子级组件也是”Pure”的.

* 扩展的知识点?

    * 深拷贝和浅拷贝.

    （1）基本类型：
5种基本数据类型Undefined、Null、Boolean、Number 和 String，变量是直接按值存放的，存放在栈内存中的简单数据段，可以直接访问.

    （2）引用类型：
存放在堆内存中的对象，变量保存的是一个指针，这个指针指向另一个位置。当需要访问引用类型（如对象，数组等）的值时，首先从栈中获得该对象的地址指针，然后再从堆内存中取得所需的数据.

    JavaScript存储对象都是存地址的，所以浅拷贝会导致 obj1 和obj2 指向同一块内存地址。改变了其中一方的内容，都是在原来的内存上做修改会导致拷贝对象和源对象都发生改变，而深拷贝是开辟一块新的内存地址，将原对象的各个属性逐个复制进去。对拷贝对象和源对象各自的操作互不影响.

    * 浅拷贝实现的方式

        *  object.assign 来解决这个问题.
        *  扩展运算符来解决. （…）
        *  存在的问题:
            * 会忽略 undefined.
            * 会忽略 symbol.
            * 不能序列化函数.
            * 不能解决循环引用的对象. 如何解决: === 

            ```
                // 深度拷贝.
                function deepCopy(p,c){
                    var c = c || {};
                    var value;
                    for(var i in p){
                        value = p[i];
                        // 解决循环引用的问题.
                        if(value === p){
                            continue;
                        }
                        if(typeof p[i] === 'object'){
                            c[i] = (p[i].constructor === Array) ? [] : {};
                            deepCopy(p[i],c[i]);
                            console.log('c[i]',c[i]);
                        }
                        else{
                            c[i] =p[i];
                        }
                    }
                    return c;
                }
            ```

    * 深拷贝实现的方式:
        * JSON.parse(JSON.stringify(object))

    * 浅比较为什么没办法对嵌套的对象比较?
        * pureComponent 源码中只对,Object.is 可以对基本数据类型,做出精确的比较,但是对于引用类型是没有办法直接比较的.

    * immutable 解决什么问题? 为什么用immutable 对象? 项目里面是怎么使用的?

        1、为什么用immutable?

    * Immutable Data 就是一旦创建，就不能被更改的数据。
 对Immutable 对象的任何修改或添加删除多会返回一个新的Immutable 对象.Immutable 实现的原理是 Persistent Data Structure（持久化数据结构），也就是使用旧数据创建新数据时，要保证旧数据同时可用且不变。同时为了避免deepCopy 把所有节点都复制一遍带来的性能损耗。Immutable 使用了 结构共享，即如果对象树一个节点发生变化，只修改这个节点和受到影响的父节点，其它节点共享. (算法如何实现？)

 优点:
* 节省内存
* mmutable.js 使用了 Structure Sharing 会尽量复用内存，甚至以前使用的对象也可以再次被复用。没有被引用的对象会被垃圾回收.

* Immutable 降低了 Mutable 带来的复杂度.
    
 缺点:
* 需要学习新的 API.
* 容易与原生对象混淆.
* 虽然 Immutable.js 尽量尝试把 API 设计的原生对象类似，有的时候还是很难区别到底是 Immutable 对象还是原生对象，容易混淆操作.

* ImmutableJS 最大的两个特性就是: immutable data structures（持久性数据结构）与 structural sharing（结构共享），持久性数据结构保证数据一旦创建就不能修改，使用旧数据创建新数据时，旧数据也不会改变，不会像原生 js 那样新数据的操作会影响旧数据。而结构共享是指没有改变的数据共用一个引用，这样既减少了深拷贝的性能消耗,也减少了内存.

* 问题:
    * 为什么redux 要返回一个新的对象？或者state 为啥不能是不可变的.

* React Hooks 相关问题:
    * 1、react 诞生的背景是什么?
        * 1. 在组件之间复用状态逻辑很难
            * render props,hoc 这类方案需要重新组织你的组件结构，使得代码难以理解，高级组件和render props 这些抽象层的组件会形成地狱嵌套。 React 需要为共享状态逻辑提供更好的原生途径
            * Hook 使你在无需修改组件结构的情况下复用状态逻辑。
            * 可以使用 Hook 从组件中提取状态逻辑，使得这些逻辑可以单独测试并复用。

        * 2. 复杂组件变得难以理解
            * Hook 将组件中相互关联的部分拆分成更小的函数.
            * 我们经常维护一些组件，组件起初很简单，但是逐渐会被状态逻辑和副作用充斥。每个生命周期常常包含一些不相关的逻辑.
            * 组件常常在 componentDidMount 和 componentDidUpdate 中获取数据。但是，同一个 componentDidMount 中可能也包含很多其它的逻辑，如设置事件监听，而之后需在 componentWillUnmount 中清除.
            * 而完全不相关的代码却在同一个方法中组合在一起。如此很容易产生 bug，并且导致逻辑不一致.

        * 3. 使用 Hook 其中一个目的就是要解决 class 中生命周期函数经常包含不相关的逻辑，但又把相关逻辑分离到了几个不同方法中的问题.

        * hooks faq
            * https://zh-hans.reactjs.org/docs/hooks-faq.html.
            * https://medium.com/@dan_abramov/making-sense-of-react-hooks-fdbde8803889

        * 4、什么是hook?
            * Hook 是一些可以让你在函数组件里面使用state 以及生命周期等特性的函数。Hook 不能在class 中使用。

    * 2、核心知识点有哪些?
        * 第三方的库会有哪些改变. redux,react router.
        * 如何测试react hook 组件.
        * 生命周期如何对应hook?
            * useEffect 将 componentDidMount、componentDidUpdate 和 componentWillUnmount 具有相同的用途，只不过被合并成了一个 API.

        * 调用 useState 方法的时候做了什么?
            * 

        * 如何获取数据?
        *  https://codesandbox.io/s/jvvkoo8pq3.
        *  https://www.robinwieruch.de/react-hooks-fetch-data/.


        * 相关的约束:
            * 1、只能在函数最外层调用 Hook。不要在循环、条件判断或者子函数中调用。
            * 2、只能在 React 的函数组件中调用 Hook。
            * 

        * 自定义hook
            * 

        * State Hook.
            * 

        * Effect Hook.
            * 

        * 其他Hook
            * useContext.
            * 
            
    * 3、如何对现有代码进行改善?
        * 
        * 
        * 

    * 4、我将如何使用?
        * 写一个具体的例子.
        * 

    * 和 class 相比有哪些优点:
        * 1、在这个 class 中，我们需要在两个生命周期函数中编写重复的代码。
        * useEffect 做了什么？
            * 通过使用这个 Hook，你可以告诉 React 组件需要在渲染后执行某些操作，并且在执行 DOM 更新之后调用它.
        * 为什么在组件内部调用 useEffect？
        * useEffect 会在每次渲染后都执行吗?
            * 是的，默认情况下，它在第一次渲染之后和每次更新之后都会执行.
        * 忘记正确地处理 componentDidUpdate 是 React 应用中常见的 bug 来源.
            * 1、举例子:好友在线状态的例子. 根据好友id 显示是否在线的状态，如果状态更新了的话，卸载的时候还可能是记住了原来的id。
            * 2、hook 并不需要特定的代码来处理更新逻辑，因为 useEffect 默认就会处理。它会在调用一个新的 effect 之前对前一个 effect 进行清理。

        * 跳过 Effect 进行性能优化
            * 每次渲染后都执行清理或者执行 effect 可能会导致性能问题.
                * 这是很常见的需求，所以它被内置到了 useEffect 的 Hook API 中。如果某些特定值在两次重渲染之间没有发生变化，你可以通知 React 跳过对 effect 的调用，只要传递数组作为 useEffect 的第二个可选参数即可
                ```
                useEffect(() => {
                document.title = `You clicked ${count} times`;
                }, [count]); // 仅在 count 更改时更新
                ```
                * 如果想执行只运行一次的 effect（仅在组件挂载和卸载时执行），可以传递一个空数组（[]）作为第二个参数。这就告诉 React 你的 effect 不依赖于 props 或 state 中的任何值，所以它永远都不需要重复执行。这并不属于特殊情况 —— 它依然遵循依赖数组的工作方式.

    * 注意:
        * 与 class 组件中的 setState 方法不同，useState 不会自动合并更新对象。你可以用函数式的 setState 结合展开运算符来达到合并更新对象的效果.
        * 要记住 effect 外部的函数使用了哪些 props 和 state 很难。这也是为什么 通常你会想要在 effect 内部 去声明它所需要的函数。 这样就能容易的看出那个 effect 依赖了组件作用域中的哪些值.
        
    * 思考题目:
         * 问题:Hook 使用了 JavaScript 的闭包机制 是怎么使用的?
         * react hooks 如何在项目中使用? 一个新的项目. 写5个页面. ok
         * reack hooks 多提供了哪些api? 多什么用法?
            * useState.
            * useEffect.
            * useContext.
            * useReducer.
            * useCallback.
            * useMemo.
            * useRef.
            * useImperativeHandle.
            * useLayoutEffect.
            * useDebugValue.

         * useReducer 之后 还要 redux 干啥？ ok了.

    * 好的项目:
        * https://github.com/tannerlinsley/react-form.
        * https://github.com/kentcdodds/advanced-react-hooks | https://kentcdodds.com/workshops/advanced-react-hooks/
        * https://juejin.im/post/5bf20ce6e51d454a324dd0e6#heading-4  hooks 的一些使用场景.

* key 值有什么用?
    * 

* 为什么state 是异步的?
    *

* 为什么state 更新进行批处理?
    *

* context api 用过没有?

    *

* 高阶组件有没有用过?
    * 

* 继承和高阶组件有啥区别?

* 采用NextJs 和 ssr 有啥区别?

* setState 第二个参数是什么?

* react Hooks 用过吗?

* 受控组件和非受控组件的区别?

* 16 版本有哪些新的东西? 有哪些不同?
    * 

* 调用 setState 之后发生了什么？
    * 

* react diff 原理?
    * 1.用Javascript 对象结构表示DOM树的结构; 然后用这个树构建一个真正的DOM树,插入到文档当中.
    * 2.当状态变更的时候，重新构造一颗新的对象树。然后用新的树和旧的树进行比较，记录两颗树的差异.
    * 3.把2所记录的差异应用到步骤1所构建的真正的DOM树上,视图就更新了.

* React 中 refs 的作用是什么?
    * 

* 展示组件(Presentational component)和容器组件(Container component)之间有何不同

* 类组件(Class component)和函数式组件(Functional component)之间有何不同

* (组件的)状态(state)和属性(props)之间有何不同?

* 为什么建议传递给 setState 的参数是一个 callback 而不是一个对象?

* 除了在构造函数中绑定 this，还有其它方式吗?

* (在构造函数中)调用 super(props) 的目的是什么?

* redux 有什么缺点?

* react 面试题目. https://github.com/semlinker/reactjs-interview-questions

* 三大框架背后的设计思想?

* https://juejin.im/post/5cf0733de51d4510803ce34e#heading-19

> redux 相关的面试题目

* redux 架构

* flux 起源?

* 说一下redux 的流程?

* 什么是Redux及其工作原理

* 

> React Router 相关面试题目.

* 什么是React路由器及其工作原理

> webpack 知识点.
* 

> javascript 知识点.


> javascript 安全知识点


> 项目准备
* 

> 非技术问题
* 你还有什么问题要问我吗?
* 你有什么优势?
* 你平时多是怎么学习的?

> 简历更新


> HR 会问的问题



参考文献: 
 * https://segmentfault.com/a/1190000016885832?utm_source=tag-newest
 * https://www.jianshu.com/p/dc53594d1d8b
 * https://muyiy.vip/question/#%E7%AC%AC-1-%E9%A2%98%EF%BC%9A%E5%86%99-react-vue-%E9%A1%B9%E7%9B%AE%E6%97%B6%E4%B8%BA%E4%BB%80%E4%B9%88%E8%A6%81%E5%9C%A8%E5%88%97%E8%A1%A8%E7%BB%84%E4%BB%B6%E4%B8%AD%E5%86%99-key%EF%BC%8C%E5%85%B6%E4%BD%9C%E7%94%A8%E6%98%AF%E4%BB%80%E4%B9%88%EF%BC%9F
 * https://github.com/yygmind/blog





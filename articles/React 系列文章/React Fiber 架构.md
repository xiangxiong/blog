* React 16 启用了全新的架构, 叫做Fiber,其最大的使命是解决大型项目的性能问题, 在顺手解决之前的一些痛点.
* 痛点:
    * 主要有如下几个:
        * 组件不能返回数组,常见的场合是UL元素下只能使用LI，TR元素下只能使用TD和TH,这时这里有一个组件循环生成LI或者TD列表时，我们并不想再放一个DIV,这会破坏HTML的语义.

        * 弹窗问题，之前一直使用不稳定的unstable_renderSubtreeContainer. 弹窗是依赖原来DOM书的上下文,因此这个API 第一个参数是组件实例，通过它得到对应虚拟DOM，然后一级级往上找，得到上下文。它的其他参数也非常好用，但这个方法一直没有转正。(怎么解决的？初衷是什么？)

        * 异常处理，我想知道哪个组件出错，虽然有了React DevTool,但是太深的祖建树找起来还是非常吃力。希望有个方法告诉我处错误的位置，并且错能让我有机会进行一些修复工作.

        * HOC 的流行带来两个问题，毕竟是社区的方案，没有考虑到ref 与 context 的向下传递的问题.

        * 组件的性能优化全部需要人工手动优化，并且主要集中在SCU，希望框架能干些事情，即使不能SCU，性能也能上去.

* 解决进度
    * 16.0 让组件支持返回任何数组类型,从而解决数组问题; 推出createPortal API，解决弹窗问题; (背景是什么?) 推出componentDidCatch 新钩子,划出错误组件与边界组件。每个边界组件能修复下方组件错误一次，在出错，转交更上层的边界组件来处理，解决异常处理难题.
    * 16.2 推出 Fragment 组件, 可以看做是组件一种语法糖.
    * 16.3 推出 createRef 与 forwardRef 解决Ref 在Hoc 的传递问题, 推出new Context API,解决HOC 的context 传递问题.
    * 而性能问题，从16.0 开始一直由一些内部机制来保证，涉及批量更新及基于时间分片的限量更新.

* 一个小实验:
    * 我们可以通过以下实验来窥探React 16 版本的优化思想.
        ```
            function randomHexColor(){
                return "#" + ("0000"+ (Math.random() * 0x1000000 << 0).toString(16)).substr(-6);
            }
            setTimeout(function() {
                var k = 0;
                var root = document.getElementById("root");
                for(var i = 0; i < 10000; i++){
                    k += new Date - 0 ;
                    var el = document.createElement("div");
                    el.innerHTML = k;
                    root.appendChild(el);
                    el.style.cssText = `background:${randomHexColor()};height:40px`;
                }
            }, 1000);

        ```
    * 这是一个拥有10000 个节点的插入操作,包含了innerHtml 与样式设置,花掉1000ms.
    * 我们在改进以下,分派次出入节点,每次只操作 100 个节点, 共100次, 发现性能异常好.
    ```
        function randomHexColor() {
            return "#" + ("0000" + (Math.random() * 0x1000000 << 0).toString(16)).substr(-6);
        }
        var root = document.getElementById("root");
        setTimeout(function () {
            function loop(n) {
                var k = 0;
                console.log(n);
                for (var i = 0; i < 100; i++) {
                    k += new Date - 0;
                    var el = document.createElement("div");
                    el.innerHTML = k;
                    root.appendChild(el);
                    el.style.cssText = `background:${randomHexColor()};height:40px`;
                }
                if (n) {
                    setTimeout(function () {
                        loop(n - 1);
                    }, 40);
                }
            }
            loop(100);
        }, 1000);
    ```
* 究其原因是因为浏览器是单线程,它将GUI描绘，时间处理器，事件处理，js 执行，远程资源加载统统放在一起。当做某件事，只有将它做完才能做下一件事。如果有足够的时间，浏览器是会对我们的代码进行编译优化（JIT）及进行热代码优化, 一些DOM 操作，内部也会对reflow 进行处理。reflow 是一个性能黑洞，很可能让页面的大多数元素进行重新布局.

* 浏览器的运作流程.
    * 渲染 -> tasks -> 渲染 -> tasks.

* 这些tasks 中有些我们可控，有些不可控，比如 setTimeOut 什么时候执行不好说，它总是不准时；资源加载时间不可控。但一些js 我们可以控制，让它们分派执行, tasks的时长不宜过长，这样浏览器就有时间优化js 代码与修正reflow。 

* 总之就是让浏览器休息好，浏览器就能跑得更快.

* 如何让代码断开重连.
    * JSX  是一个快乐出奇蛋，一下子满足你两个愿望: 组件化及标签化. 并且JSX成为组件化的标准化语言.
    ```
        <div>
        <Foo>
            <Bar />
        </Foo>
        </div>
    ```
    * 标签化是天然嵌套的结构,意味着它会最终编译成递归执行的代码.因此React 团队称React
16 之前的调度器为栈调度器，栈没有什么不好，栈显浅易懂，代码量少，但它的坏处不能随意break 掉,
continue 掉. 根据我们上面的实验，break 后我们还需要重新执行，我们需要一种链表的结构。
    
    * 链表是对异步友好的。链表在循环时不用每次都进入递归函数,重新生成什么执行上下文，变量对象，
激活对象，性能当然比递归好.

    * 因此react 16 设法将组建的递归更新, 改成链表的依次执行. 如果页面有多个虚拟DOM树，那么就
    将它们的跟保存到一个数组中.

    ```
        ReactDOM.render(<A />, node1)
        ReactDOM.render(<B />, node2)
        //node1与node2不存在包含关系，那么这页面就有两棵虚拟DOM树
    ```

    * 如果仔细阅读源码，React 这个纯视图库其实也是三层架构。在React 15 有 虚拟DOM 层,它只负责描述结构与逻辑，内部组件层，它们负责组建的更新, ReactDOM.render,setState,forceUpdate() 都是与他们打交道，能让你多次setState,只执行一次真实渲染, 比如浏览器端，它使用元素节点，文本节点，在Native 端，会调用oc, java的GUI, 在canvas 中,有专门的API方法.

    * 虚拟DOM 是由JSX 转义过来的,JSX  的入口函数是React.creatElement,可操作空间不大，第三个的底层API 也非常稳定, 因此我们只能改变第二层.

    * React 16 将内部组件层改成Fiber 这种数据结构，因此它的架构名也改名叫Fiber 架构。 Fiber 节点拥有return ,child,sibling 三个属性，分别对应父节点，第一个孩子, 它右边的兄弟,有了他们足够将一棵树变成一个链表，实现深度优先遍历.

* 如何决定每次更新的数量.
    * React 15 中,每次更新时，都是从根组件或setState 后的组件开始, 更新整个子树，我们唯一能做的是，在某个节点中使用SCU 断开某一部分的更新, 或者是优化SCU的比较效率.

    * React 15 则是需要将虚拟DOM 转换为Fiber 节点,首先它规定一个时间段内, 然后在这个时间段能转换多少个FiberNode，就更新多少个.

    * 因此我们需要将我们的更新逻辑分成两个阶段,第一个阶段是将虚拟DOM 转换成Fiber,Fiber 转换成组件实例或真实DOM (不插入DOM树，插入DOM树会reflow). Fiber 转换成后两者明显会耗时，需要计算还剩下多少时间。并且转换实例需要调用一些钩子，如 componentWillMount,如果是重复利用已有的实例，这时就是调用 componentWillReceiveProps, shouldComponentUpdate,componentWillUpdate,这时也会耗时。

    * 为了让读者能直观了解React Fiber 的运作过程，我们简单实现以下 ReactDOM.render, 但不保证会跑起来.

    * 首先是一些简单的方法:

    ```
        var queue = [];

        ReactDOM.render = function(root,container){
            queue.push(root);

        }

        function getVdomFormQueue(){
            return queue.shift();
        }

        function Fiber(vnode){
            for(var i in vnode){
                this[i] = vnode[i]
            }

            this.uuid = Math.random()
        }


        // 我们简单的Fiber 目前开看，只比vdom 多了一个uuid 属性.
        function toFiber(vnode){
            if(!vnode.uuid){
                return new Fiber(vnode);
            }

            return vnode;
        }
    ```

    * updateFiberAndView 要实现React 的时间分片，我们先用setTimeout模拟。我们暂时不用理会updateView 怎么实现，可能它就是update ComponentOrElement 中将它们放到又一个队列,需要出来执行insertBefore,componentDidMount 操作呢!

    ```
    function updateFiberAndView() {
    var now = new Date - 0;
    var deadline = new Date + 100;
    updateView() //更新视图，这会耗时，因此需要check时间
    if (new Date < deadline) {
        var vdom = getVdomFormQueue()
        var fiber = vdom, firstFiber
        var hasVisited = {}
        do {//深度优先遍历
            var fiber = toFiber(fiber);//A处
            if(!firstFiber){
                fibstFiber = fiber
            }
            if (!hasVisited[fiber.uuid]) {
                hasVisited[fiber.uuid] = 1
                //根据fiber.type实例化组件或者创建真实DOM
                //这会耗时，因此需要check时间
                updateComponentOrElement(fiber);
                if (fiber.child) {
                    //向下转换
                    if (newDate - 0 > deadline) {
                        queue.push(fiber.child)//时间不够，放入栈
                        break
                    }
                    fiber = fiber.child;
                    continue  //让逻辑跑回A处，不断转换child, child.child, child.child.child
                }
            }
            //如果组件没有children，那么就向右找
            if (fiber.sibling) {
                fiber = fiber.sibling;
                continue //让逻辑跑回A处
            }
            // 向上找
            fiber = fiber.return
            if(fiber === fibstFiber || !fiber){
               break
            }
        } while (1)
    }
    if (queue.length) {
        setTimeout(updateFiberAndView, 40)
    }
}
    ```
    * 里面有一个do while 循环,每一次都是小心翼翼进行计时，时间不够将来不及处理的二节点放进列队.
    * updateComponentOrElement 无非是这样.
   
* 如何调度时间才能保证流畅
    *  刚才的updateFiberAndView其实有一个问题,我们安排了100ms 来更新视图与虚拟Dom，然后再安排
40ms 来给浏览器来做其他事。如果我们的虚拟DOM树很小，其实不需要100ms;如果我们的代码之后，浏览器有更多其他事要干，40ms 可能不够。IE10 出现了 setImmediate, requestAnimationFrame 这些新定时器，让我们这些情断，其实浏览器有能力让页面更流畅地运行起来.
    * 浏览器本身也在不断进化中,随着页面由简单的展示转向 webApp,它需要一些新能力承载更多节点的展示与更新。
    
    * 下面是一些自救措施
        * requestAnimationFrame.
        * requestIdleCallback.
        * web worker.
        * IntersectionObserver.
    * 我们依次称为浏览器层面的帧数控制调用,闲时调用,多线程调用，进入可视区调用.
    * requsetAnimationFrame 在做动画时经常用到,jQuery 新版本多用，web worker 在angular2 开始就释放出一些包，实验性地用它来进行diff 数据,intersectionObserver 可用到ListView 中，而requestIdleCallback 是有个生脸面，而React 官方恰恰看上他.
    * 刚才说updateFiberAndView 有出两个时间段，一个给自己的, 一个给浏览器的。 requestAnimationFrame 能帮助我们解决第二个时间段，从而确保整体都是60帧或75 流畅运行.
    * 我们看requestIdleCallBack 是怎么解决这个问题的
    * 它的第一个参数是一个回调，回调有一个参数对象,对象有一个timeRemaining 方法，就相当于new Date - deadLine，并且它是一个高精度数据，比毫秒更精确，至少浏览器到底安排了多少时间给更新DOM与 虚拟DOM，
    我们不用管。第二个时间也不用管，不过浏览器可能1,2秒才执行这个回调，因此保险起见，我们可以设置第二个参数，让它在回调结束后300ms 才执行。要相信浏览器，因为都是大牛们写的，时间调度比你安排更有效率。
    * 于是我们的updateFiberAndView 可以改写成这样:
    * 到这里，React Fiber 基于时间分片的限量更新就讲完了。实际上React 为了照顾绝大多数的浏览器，自己实现了requestIdleCallback.
    
    * 批量更新
        * 但react 团队觉得还不够，需要更强大的东西。因为有的业务对视图的实时同步需求并不强烈，希望将所有逻辑跑完才更新视图，于是有了 bactchedUpdates,目前它还不是一个稳定的API，因此大家使用它时要这样用 
        ReactDOM.unstable_batchedUpdates.
        * 这个东西怎么实现呢？ 就是搞一个全局开关，如果打开了，就让updateView 不起作用.
        * React 内部也大量使用 batchedUpdates 来优化代码，比如在事件回调中setState,在commit 阶段的钩子(componentDidXXX) 中 setState.
        * 可以说，setState 是对单个组件的合并渲染，batchedUpdates 是对多个组件的合并渲染。合并渲染是React 最主要的优化手段.

    * 为什么使用深度优先遍历
        * React 通过Fiber 将书的遍历变成了链表的遍历，但遍历手段有这么多种，为什么偏偏使用DFS?
        * 这涉及到一个很经典的消息通讯问题。如果是父子通信，我们可以通过props 进行通信，子组件可以保存父的引用，可以随时call父组件。如果多级组件间通信，或不存在包含关系的组件通信就麻烦了，于是React
        发明了上下文对象(Context).
        * context 一开始时一个空对象，为了方便起见，我们称之为 unmaskedContext。
        * 当它遇到一个getChildContext 方法的组件时，那个方法会产生一个新context，与上面的合并，然后
        将新context 作为 unmaskedContext 往下传。
        * 当它遇到一个有contextTyps的组件，context 就抽取一部分内容给这个组件进行实例化。这个只有部分内容的context，我们称之为 maskedContext。
        * 组件遇到一个 contextTypes 的组件，context 就抽取一部分内容给这个组件进行实例化。这个只有部分的context，我们称之为maskedContext。
        * 组件总是从unmaskedContext 中割一块荣作为自己的context。
        * 如果子组件没有contextTypes，那么它就没有任何属性.

    * 参考文献
        * https://zhuanlan.zhihu.com/p/37095662。



    

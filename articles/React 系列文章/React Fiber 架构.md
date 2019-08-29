
React Fiber架构
 *  https://zhuanlan.zhihu.com/p/37095662

 * React 这个纯视图库其实也是三层架构:
    * 虚拟DOM 层:
        * 它负责描述结构与逻辑。
    * 内部组件层:
        * 他们负责组件的更新,ReactDOM.render,setState、forceUpdate 都是他们打交道，能让你多次setState,只执行一次真实的渲染，在合适的时机执行你组件实例的生命周期钩子.
    * 底层渲染层:
        * 不同的显示介质有不同的渲染方法, 比如说浏览器端，它使用元素节点，文本节点，在Native 端
    会调用oc,Java的gui,在 canvas 中，有专门的API 方法.



亮点:
    * https://juejin.im/post/5d3184596fb9a07eeb13e12c 推出 hooks 解决组件复用的问题.
    * https://my.oschina.net/chkui/blog/1830225 解决 refs hoc 传递的问题.
    * https://my.oschina.net/chkui/blog/1570500 解决弹窗的问题文章. 以及异常处理.
    * https://www.jianshu.com/p/423e2054878a  解决 hoc context 传递的问题.
    * https://juejin.im/post/5d3184596fb9a07eeb13e12c  从Mixins到HOC再到React Hooks



  * 性能优化是一个系统性的工程，如果只看局部的话，引入算法，当然是越快越好，但从整体来看大话，在关键点引入缓存，可以秒杀N算法，或另辟蹊径，探索事件的本质，可能用户需要的并不是快。。。


  * React16 启动了全新的架构，Fiber,其最大的使命是解决大型项目的性能问题，在顺手解决之前的一些痛点。

  * 痛点
    * 主要有如下几个:
        * 组件不能返回数组，最常见的场合是UL元素下只能使用LI,TR元素下只能使用td或th,这时这里有一个组件循环生成li或td列表，我们并不想再放一个div,这会破坏HTML的语义.
        * 弹窗问题，之前一直使用不稳定的unstable_renderSubtreeIntoContaienr.弹窗是依赖原来Dom 树的上下文，因此这个API第一个参数是组件实例，通过它得到对应虚拟DOM，然后一级级往上找，得到上下文。它的其他参数也很好用，但这个方法一直没有转正。
        * 异常处理，我们都想知道那个组件出错，虽然有了React DevTool,但是太深的祖建树查找起来还是很吃力。希望有个方法告诉我出错的位置，并且出错时，能让我有机会进行一些修复工作。
        * HOC 的流行带来两个问题，毕竟是社区兴起的方案，没有考虑到ref与context 的向下传递。
        * 组件的性能优化全凭人肉，并且主要集中在SCU,希望框架能干些事情，及时不用SCU，性能有能上去.

    * 解决进度:
        * 16.0 让组件支持返回任何数组类型，从而解决数组问题：推出createPotal API,解决弹窗问题; 推出componentDidCatch新钩子，划分出错误组件与边界组件，每个边界组件能修复下方组件错误一次，再次出错，转交更上层的边界组件来处理，解决异常处理问题。
        * 16.2 推出createRef 与 forwardRef 解决Ref 在HOC 中的传递问题，推出new Context APi 解决HOC 的context 传递问题（主要是SCU坐悰）
        * 而性能问题，从16.0 开始一直由一些内部机制来保证，涉及到批量更新基于时间分片的限量更新。

    * 一个小实验:
        * 我们可以通过以下实验来窥探React16的优化思想.

        * 这是一个拥有10000个节点的插入操作，包含了innerHTML与样式设置，花掉1000ms。

        * 我们再改进一下，分派次插入节点，每次只操作100个节点，共100次，发现性能异常的好！

        * 究其原因是因为浏览器是单线程，它将GUI描绘，时间器处理，事件处理，JS执行，远程资源加载统统放在一起。当做某件事情，只有将它做完才能做下一件事。如果有足够的时间，浏览器是会对我们的代码进行编译优化（JIT）及进行热代码优化，一些DOM操作，内部会对进行reflow 进行处理。relow 是一个性能黑洞，很可能让页面的大多数元素进行重新布局。

        * 浏览器的运作流程：
            * 渲染 -> tasks -> 渲染 -> tasks -> 渲染 -> tasks -> ....

        * 这写tasks 有些我们可控，有些不可控，比如setTimeout 什么时候执行不好说，它总是不准时，资源加载时间不可控。但一些JS 我们可以控制，让他们分派执行，tasks 的时长不宜过长，这样浏览器就有时间优化JS代码与修正reflow ! 下图是我们理想中的渲染过程.

        * 总结一句：就是让浏览器休息好，浏览器就能跑得更快.

    * 如何让代码断开重连

        * JSX  是一个快乐出奇蛋，一下子满足你两个愿望：组件化与标签化，并且JSX 成为组件化的标准化语言.

        ```
        <div>
            <Foo>
                <Bar/>
            </Foo>
        </div>
        ```

        * 但标签化是天然嵌套的结构，意味着它会最终编译成递归执行的代码。因此React 团队称为React 16 之前的调度器为栈调度器，栈没什么不好，栈显浅易懂，代码量少，但它的坏处是不能随意break 掉,continue 掉。根据我们上面的实验，break 后我们还要重新执行，我们需要一种链表的结构.

        * 链表是对异步友好的，链表在循环时不用函数都进入递归函数，重新生成什么执行上下文，变量对象，激活对象，性能当然比递归好。

        * 因此React 16 没法将组件的递归更新，改成链表的依次执行，如果页面有多个虚拟DOM树，那么就将它们的根保存到一个数组中。

        ```
            ReactDOM.render(<A />, node1)
            ReactDOM.render(<B />, node2)
            //node1与node2不存在包含关系，那么这页面就有两棵虚拟DOM树
        ```

        * 如果仔细阅读源码,React 这个纯视图库其实也是三层架构. 在React 15 有虚拟DOM层，它只负责描述结构与逻辑; 内部组件层,它们负责组建的更新,ReactDom.render,setState,forceUpdate都是它们组建打交道，能让你多次setState,只执行一次真实的渲染，在合适的时机执行你的组件实例的生命周期钩子，底层渲染层：不同的显示介质有不同的渲染方法，比如说浏览器端，它使用元素节点，文本节点，在Native 端，会调用oc，java的GUI,在 canvas 中，有专门的API方法....

        * 虚拟DOM是由JSX 转移过来的，JSX的入口函数式React.createElement,可操作空间不大，第三大的底层API也非常稳定，因此我们只能改变第二层.

        * React 16 将内部组件层改为Fiber 这种数据结构，因此它的架构名也改为叫Fiber 架构。Fiber 节点拥有 return ,child,sibling 三个属性，分别对应父节点，第一个孩子，它有变动兄弟，有了它们就足够将一颗树变成一个链表，实现深度优先遍历。

    * 如何决定每次更新的数量
        
        * 在React 15 中，每次更新时，都是从组件或setState 后的组件开始，更新整个子树，我们唯一能做的是，在某个节点中使用SCU断开某一部分更新，或者是优化SCU的比较效率。

        * React 16 则是需要将虚拟DOM 转换成Fiber 节点，首先它规定一个时间段内，然后在这个时间段能转换多少个FiberNode,就更新多少个.

        * 因此我们需要将我们的更新逻辑分成两个阶段，第一个阶段是将虚拟DOM 转换成Fiber,Fiber 转换成实例或真实DOM (不插入DOM树，插入DOM树会reflow).Fiber 转换成后两者明显会耗时，需要计算还剩下多少时间。这时就是调用componentWillReceiveProps,shouldComponentUpdate,componentWillUpdate,这时也会耗时.

        * 为了让读者直观了解React Fiber 的运作过程，我们简单实现了ReactDom.render  但不保证跑起来.

        * 首先是一些简单的方法:
        ```
            var queue = [];

            ReactDOM.render = function(root,container){
                queue.push(root);
                updateFiberAndView();
            }

            function getVdomFormQueue(){
                return queue.shift();
            }

            function Fiber(){
                for(var i in vnode){
                    this[i] = vnode[i]
                }
                this.uuid = Math.random();
            }

            // 我们简单的Fiber 目前来看，只比vdom 多了一个uuid属性.
            function toFiber(){
                if(!vnode.uuid){
                    return new Fiber(vnode);
                }

                return vnode;
            }
        ```
    * updateFiberAndView 要实现React 的时间分片, 我们先用setTimeout 模拟。我们暂时不用理会updateView 怎么实现，可能它就是updateComponentOrElement 中他们放到一个队列, 需要出来执行insertBefore,componentDidMount 操作呢?
    
    ```
    function updateFiberAndView(){
        var now = new Date - 0;
        var deadLine = new Date + 100;

        updateView(); // 更新视图，这会耗时，因此需要check时间

        if(new Date < deadline){
            var vdom = getVdomFormQueue();
            var fiber = vdom,firstFiber;
            var hasVisited = {};

            do{ // 深度优先遍历
                var fiber = toFiber(fiber); // A 处

                if(!firstFiber){
                    firstFiber = fiber
                }
                if(!hasVisted[fiber.uuid]){
                    hasVisited[fiber.uuid] = 1;
                    updateComponentOrElement(fiber);
                    if(fiber.child){
                        if(newDate - 0 > deadline){
                            queue.push(fiber.child);
                            break;
                        }
                        fiber = fiber.child;
                        continue;
                    }
                }
                // 如果组件没有children,那么就向右找
                if(fiber.sibling){
                    fiber = fiber.sibling;
                    continue;
                }
                // 向上找
                fiber = fiber.return
                if(fiber === fibstFiber || !fiber){
                    break;
                }
            }while(1)
        }
        if(queue.length){
            setTimeout(updateFiberAndView,40);
        }
    }
    ```

    * 里面有一个do ...while 循环，每一次都是小心翼翼进行计时，时间不够就将来不及处理的节点放进队列.

    * updateComponentOrElement 无非是这样:
    ```
    function updateComponentOrElement(fiber){
        var {type, stateNode, props} = fiber;

        if(!stateNode){
            if(typeof type === "string"){
                fiber.stateNode = document.createElement(type);
            }
            else{
                var context = {};
                fiber.stateNode = new type(props,context)
            }
        }
        if(stateNode.render)
        {
            children = stateNode.render()
        }
        else{
            children = fiber.children;
        }

        var prev = null;

        // 这里实现mount 的实现，update 还需要一个 oldChidren ,进行key匹配，重复利用已有节点

        for(var i =0,n = children.length; i<n;i++){
            var child = children[i];
            child.return = fiber;
            if(!prev){
                fiber.child = child;
            }else{
                prev.sibling = child;
            }
            prev = child;
        }
    }
    ```

    * 因此这样Fiber 的return,child,sibling 就有了，可以happy地 进行深度优先遍历了.

    * 如何调度时间才能保证流畅

        * 刚才的updateFiberAndView 其实有一个问题，我们安排了100ms 来更新视图与虚拟Dom,然后再安排40ms 来给浏览器来做其他事情。如果我们的虚拟DOM树很小，其实不需要100ms,如果我们代码之后，浏览器有更多其他事情要干，40ms 可能还不够。IE 10 出现了 setImmediate,
        requestAnimationFrame 这些新定时器，让我们这些前端，其实浏览器有能力让页面更流畅的运行起来。

        * 浏览器本身也不断进行优化中，随着页面由简答展示转向WebApp,它需要一些新能力来承载更多节点和展示和更新:

            * 下面是一些自救措施:
                
                * requestAnimationFrame.
                * requestIdleCallBack.
                * web worker.
                * IntersectionObserver.

            * 我们依次成为浏览器层面的帧数控制调用，闲时调用，多线程调用，进入可视区调用.

                * requestAnimationFrame 在做动画时经常用到。jQuery 新版本多使用它，web work 在angular 开始释放出一些包，实验性地用它进行diff 数据，intersectionObserver 可以用到ListView 中。而 requstAnimationFrame 能帮我们解决第二个时间段，从而确保整体都是60s 或者 75s，流畅性.

                * 我们看到 requstIdleCallback 是怎么解决这个问题的.

                * 它的第一个参数是一个回调，回调有一个参数对象，对象有一个timeRemain 方法，就相当于newDate - deadLine，并且它是一个高精度数据，比毫秒更准确，至少浏览器到底安排了多少时间更新DOM与虚拟DOM，我们不用管。第二个时间段也不用管，不过浏览器可能1，2s 才执行这个回调，因此为了保险起见，我们可以设置第二个参数，让它在回调结束后300ms才执行。要相信浏览器，因为都是大牛们写的，时间的调度比你安排更有效率。

                * 于是我们的updateFiberAndView 可以改写成这样:

                ```
                function updateFiberAndView(dl) {
                    updateView() //更新视图，这会耗时，因此需要check时间
                    if (dl.timeRemaining() > 1) {
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
                                    if (dl.timeRemaining() > 1) {
                                        queue.push(fiber.child)//时间不够，放入栈
                                        break
                                    }
                                    fiber = fiber.child;
                                    continue  //让逻辑跑回A处，不断转换child, child.child, child.child.child
                                }
                            }
                            //....略
                        } while (1)
                    }
                    if (queue.length) {
                        requetIdleCallback(updateFiberAndView, {
                        timeout:new Date + 100
                        }
                    )
                    }
                }
                ```

        * 到这里，ReactFiber 基于时间分片的限量更新讲完了。实际上React 为了照顾绝大多数的浏览器，自己实现了requstIdleCallBack.

        * 批量更新

            * 但 React 团队觉得还不够，需要更强大的东西。因为有的业务对视图的实时同步需求并不强烈，希望将所有逻辑跑完才更新视图，于是有了batchedUpdates,目前它还不是一个稳定的API,因此大家使用它时需要用ReactDOM.unstable__batchedUpdates.

            * 这个东西是怎么实现的? 就是搞一个全局的开关，如果打开了，就让updateView 不起作用.

            ```
            var isBatching = false;

            function batchUpdates(callback,event){
                let keepbook = isBatchiing;
                isBatchiing = true;

                try{
                    return callBack(event);
                }catch(){

                }finally{
                    isBatching = keepbook;
                    if(!isBatching){
                        requestIdleCallback(updateFiberAndView,{
                            timeout:new Date + 1
                        })
                    }
                }

            }

            function updateView(){
                if(isBatching){
                    return;
                }

                // 更新视图.
            }
            ```

    * 事实上，当然没有这么简单，考虑到大家看不懂React 的源码，大家可以看一下 anujs 到底是如何实现的?

    * React 内部也大量使用batchedUpdates 来优化用户代码，比如说在事件回调中setState,在commit 阶段的钩子（componentDidxxx） 中setState.

    * 可以说，setState 是对单个组件的合并渲染，batchedUpdates 是对多个组件的合并渲染。合并渲染是React 最主要的优化手段.

    * 为什么要使用深度优先遍历?
        * React 通过Fiber 将书的遍历变成了链表的遍历，但遍历手段有这么多种，为什么偏偏使用DFS?
        * 这涉及到一个经典的消息通信问题。如果是父子同行，我们可以通过props 进行通信，子组件可以保存父的引用，可以随时call 父组件。如果是多级组件间的通信，或不存在包含关系的组件通信就麻烦了，于是React 发明了上下文对象(context)。
        * context 一开始是一个空对象，为了方便起见，我们称之为 unmaskedContext.
        * 当它遇到一个有getChildContext方法的组件时，那个方法会产生一个新context,与上面的合并，然后将新context作为unmaskedContext往下传.
        * 当它遇到一个有contextTypes的组件，context 就抽取一部分内容给这个组件进行实例化。这个只有部分内容的context，我们称之为maskedContext.
        
        * 组件总是从unmaskedContext 中割一块肉下来作为自己的context.
        * 如果子组件没有contextTypes，那么它就没有任何属性.

        * React 15中,为了传递unmaskedContext，于是大部分方法与钩子都留了一个参数给它。但这么大架子的context 竟然在文档中没有什么地位。那时React 团队还没有想好如何处理组件通信，因此社区一直用舶来品Redux 来救命，这情况一直到Redux 作者入住React 团队.

        * 还有一个隐患，它可能被SCU比较时用maskedContext，而不是unmaskedContext。

        * 基于这些问题，终于new Context API 出来了。首先，unmaksedContext 不像以前那样各个方法来往穿梭了，有一个独立的contextStack.开始时，就push 进一个空对象，到达某个组件需要实例化时，就取它第一个。当再次访问这个组件时，就像它从栈中弹出。因此我们需要深度优先遍历，保证每点节点都访问两次。

        * 相同的情况还有container，container 是我们某个元素虚拟DOM 需要用到的真实父节点。在React 15中，它会装在一个containerInfo 对象也层层传送.

        * 我们知道,虚拟DOM 分成两大类，一种是组件虚拟DOM，type 为函数或类，它本身不产生节点，而是生成组件实例，而通过render 方法，产生下一级的虚拟DOM。一种是元素虚拟Dom, type 为标签名，会产生DOM 节点。上面的元素虚拟DOM 的stateNode（DOM节点），就是下方的元素虚拟DOM的contaienr.

        * 这种独立的栈机制有效的解决了内部方法参数冗余问题。

        * 但有一个问题，但第一次渲染完毕后，contextStack置为空了。然后我们位于虚拟DOM树的某个setState,这时它的context 应该如何获取呢？React 的解决方式是，每次都是从根开始渲染，通过updateQueue 加速跳过没有更新的节点 -- 每个组件在setState 或 foreceUpdate时，多会创建一个UpdateQueue 属性在它的上面。unmaskedContext 可以看作是上面所有context 的并集，并且一个可以当做多个使用。

        * 当我们批量更新时，可以有多少不连续的子组件被更新了，其中两个组件之间的某个组件使用了SCU return false, 这个SCU 应该要被忽视。因此我们引用一些变量让他透明化。就像foreceUpdate 能让组件无视SCU 一样.

    * 为什么要对生命周期钩子大换血

        * React 将虚拟DOM 的更新过程划分为两个阶段，reconciler 阶段与 commit 阶段。reconciler 阶段为早期版本diff 过程,commit 阶段对应早期版本的patch 过程.

        * 一些迷你React,如Preact 会将它们混合在一起，一遍diff 一边 patch.
        * 其实基于算法的优化是一种绝望的优化，就类似玛雅文明因为找不到铜矿一直停留于石器时代，诞生了伟大的工匠精神把石器打磨得美伦美奂。
        * 之所以这么说，因为diff 算法都用于组件的新旧children 比较，chhildren 一般不会出现过长的情况，有点大炮打蚊子。况且当我们的应用变得非常庞大，页面有上万个组件，要diff 这么多组件，再卓越的算法也不能保证浏览器会不累趴。因为他们没有想到浏览器也会累趴，也没有想到这个是一个长跑的问题。如果是100m 短跑，或者1000m 竞赛，当然越快越好。如果是马拉松，就需要考虑到保存体力了，需要注意休息了，性能是一个系统性的工程。

        * 在我们的代码里面，休息就是检测时间然后端口Fiber链。

        * updateFiberAndView 里面先进行updateView，由于节点的更新不可控，因此全部更新完，才检测时间。并且我们完全不担心updateView会出现问题，因为updateView实质是在batchedUpdates中，里面有try....catch.而接下来我们基于DFS 更新节点，每个节点多要check 时间，这个过程其实很害怕出错，因为组件在挂载过程中会调用三次钩子/方法(construtor,componentWillMount,render) ，组件在更新过程中会调用4次钩子（
            componentWillRecevieProps,shouldUpdate,componentWillUpdate
        ）try ..catch 包起来，这样会性能差。而constructor,render 是不可避免的，于是对三个willXx 动刀了.

        * reconciler 阶段的钩子都不应该操作DOM,最好也不要setState,我们称之为轻量钩子，commit 阶段的钩子则对应称为重量钩子.
        
* 任务系统
    * updateFiberAndView 是位于一个requestCallBack中,因此他的时间很有限，分给DFS部分的时间更少了，因此它们不能做太多事情，这怎么办呢？标记一下，留给commit 阶段做，于是产生了任务系统。
        * 每个Fiber 分配到新的任务时，就通过位操作，累加一个sideEffect. sideEffect 字面上是副作用的意思，非常重FP的味道，但我们理解为任务更方便我们的理解.

        * 每个Fiber 可能有多个任务，比如它要插入DOM或移动，就需要加上ReplaceMent,需要设置样式,需要加上Update。

        * 怎么添加任务?

            * fiber.effectTag != Update.

        * 怎么保证不会重复添加相同的任务?

            * fiber.effectTag &= DidCapture.

        * 在commit阶段，怎么知道它包含了某项任务？

            * if(fiber.effectTag & Update)

            * React 内置这么多任务，从DOM 操作到Ref处理到回调唤起...

    * 我冲这篇文章中学到什么了:
        * React 16 启用了全新的架构Fiber,其最大的使命是解决大型的项目的性能问题，在顺手解决了一些其他的痛点。

        * React 16 优化的思想是什么:
            * 而性能问题，从16.0 开始一直由一些内部机制来保证，涉及到批量更新基于时间分片的限量更新。

        * ReactFiber基于时间分片的原理是什么?
            * 

        * React 视图层分为三层架构:
            * 虚拟DOM层: <它只负责描述结构与逻辑>.
            * 内部组件层: <它们负责组件的更新>,ReactDOM.render、 setState、 forceUpdate都是与它们打交道，能让你多次setState，只执行一次真实的渲染, 在适合的时机执行你的组件实例的生命周期钩子.
            * 底层渲染层: 不同的显示介质有不同的渲染方法,比如说浏览器端，它使用元素节点，文本节点，在Natvie端, 会调用oc, java 的UI.

        * react 16将组件层改成 Fiber 这种数据结构.

        * 
        * js 是单线程的每执行一个task 多会执行: GUI 描绘, 时间器处理, 事件处理, JS 执行,远程资源加载。 只有等上次任务把这些task 全部做完，才能做下一个步骤.

    * 思考点：
        * 技术诞生的背景? 解决什么问题？别人多是怎么做的?
        * createPotal,HOC,context,Fiber 诞生的背景？
        * 浏览器的运作流程?
        * 浏览器渲染的流程是什么?
        * React 纯视图可以分为三层架构: 虚拟DOM层,内部组件层,底层渲染层.
        * setState 更新的流程到底是什么?
        * react 15 与 react 16 有啥区别?
        * reflow,repaint.
        * 为什么要使用深度优先遍历?  这个东西很难懂.
        * 为什么要对生命周期钩子大换血?
        * react 组件之间传值实现的原理是什么?
        * 为什么要存在context.
        
    * 参考文献
        * https://zhuanlan.zhihu.com/p/37095662。
        * https://juejin.im/post/5c31ffad6fb9a04a0a5f56f4 react Fiber 翻译文章.
        * https://medium.com/react-in-depth/inside-fiber-in-depth-overview-of-the-new-reconciliation-algorithm-in-react-e1c04700ef6e
        * https://github.com/facebook/react/issues/7942#issue-182373497
        * https://github.com/acdlite/react-fiber-architecture  react Fiber 架构描述.
        * http://echizen.github.io/tech/2019/04-06-react-fiber.
        



    

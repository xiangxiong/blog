* fiber 架构是什么?
    *  fiber 架构是对React 底层算法的一次重写.

* 痛点.
    *  解决javascript 执行DOM操作时间过程，阻塞了主进程.

* 解决方案.
    * 采用基于时间分片的方式来解决该问题。


* 如何让代码断开重连.
    * 

* 如何决定每次更新的数量.

    * 采用链表的方式来取缔递归的方式对组件来进行遍历。采用链表的方式可以随时终端任务执行其他任务，而递归任务不能随时被中断.

* 如何调度时间才能保证流畅.
    * 刚才的updateFiberAndView 其实是一个问题,我们安排了100ms，来更新视图与虚拟DOM，然后再安排40ms 来给浏览器来做其他事情,如果我们的虚拟DOM树很小,其实不需要100ms;如果我们的代码之后，浏览器还有更多其他事情要干，40ms 可能还不够。IE10 出现了setImmeiate,requestAnimationFrame 这些新的定时器, 让我们这些前端, 其实浏览器有能力让页面更流畅地运行起来.

    * 浏览本省也不断进化，随着页面由简单的展示转向webApp,它需要一些新能力来承载更多节点的展示与更新。

    * 下面是一些自救措施:
        * requestAnimationFrame.
        * requestIdleCallBack.
        * web worker.
        * intersectionObserver.

    * 我们依次成为浏览器层面的帧数控制调用,闲时调用，多线程调用,进入可视区调用.

    * requestAnimationFrame 在做动画时经常调用,jQuery 新版本都使用它，IntersectionObserver 可以用到ListView 中. 而requestIdleCallBack 是一个生脸孔，而React 官方用了他。

    * 刚才说updateFiberAndView 有出两个时间段, 一个给自己的，一个给浏览器的，requestAnimationFrame 能帮我们解决第二个时间段, 从而确保整体都是60帧或75帧 流畅运行.

    * requestdleCallBack 是怎么解决这个问题的.
        * 它的第一个参数是一个回调，回调有一个参数对象, 对象有一个timeRemaining 方法,就相当于new Date - deadline, 并且它是一个高精度数据，比毫秒更准确，至少浏览器到底安排了多少时间给更新DOM 与 虚拟DOM，我们不用管。第二个时间段我也不用管, 不过浏览器可能1,2 秒才执行这个回调，因此未来保险起见，我们可以设置第二个参数，让它在回调结束后300ms 执行。要相信浏览器，因为都是大牛们写的, 时间的调度比你安排更有效率.

    * 

    * 看下源码是如何实现的?

    * requestIdleCallback 函数的调用.

* 批量更新.

* 为什么要使用深度优先遍历.

* 为什么要对生命周期钩子大换血.

* 总结:

    *  

*  参考文献:
    * https://www.youtube.com/watch?v=aS41Y_eyNrU   React Fiber 深度解析。
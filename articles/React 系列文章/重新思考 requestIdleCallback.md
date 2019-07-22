* requestIdleCallback 是什么?

    * window.requestIdleCallback() 会在浏览器空闲时期依次调用函数, 这就可以让开发者在主事件循环中执行后台或低优先级的任务,而且不会对像动画和交互这样延迟敏感的时间产生影响。函数一般会按先进先调用的顺序执行，然而，如果回调函数指定量执行超时时间，则有可能为了在超时前执行函数而打乱顺序.

* 我们为什么要使用requestIdleCallback?

    * 可以控制任务的优先级.
    
    * 自己安排非必要的工作很难做到。无法准确确定剩余的帧时间，因为在requestAnimationFrame回调执行后，需要运行样式计算，布局，绘图和其他浏览器内部。自制的解决方案无法解决任何问题。为了确保用户不会以某种方式进行交互，你还需要监听器连接到各种互动活动（的scroll，touch，click），即使你不需要他们的功能，只是让你可以绝对确保用户没有互动。另一方面，浏览器确切知道帧结束时可用的时间，以及用户是否正在进行交互，等等requestIdleCallback 我们获得了一个API，使我们能够以最有效的方式利用任何空余时间。

* requestIdleCallback 可以用来解决哪些问题？

    * Fiber 里面的任务调度.
    * 上报分析书。比如用户轻触的时候，需要将该事件上报。为了影响轻触之后动画的流畅性，可以使用requestIdleCallback 实现.
    * 实现模板的预编译和组装。比如懒加载的页面组装新元素,再用 requesAnimationFrame 更新到DOM上。注意,不要在 requestIdleCallBack 中直接修改DOM.

* 使用 RequestIdleCallBack 发送分析数据.
    *  
    * 
    * 
    
* 思考的问题:
    * requestAnimationFrame & requestIdleCallback & setImmediate 有啥区别?
    * 浏览器帧原理.
    * 

* 参考文献:
     * https://developers.google.com/web/updates/2015/08/using-requestidlecallback
     * https://juejin.im/post/5c9c66075188251dab07413d 今日头条 字节跳动.
     * https://aerotwist.com/blog/the-anatomy-of-a-frame/ 在google 浏览器部门工作.
     
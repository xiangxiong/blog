* stack .
    * 更新节点时相关信息入栈.
    * 完成节点时相关信息出栈.
    * 用不同的cursor 记录不同的信息.
    * 文件:ReactFiberStack.js

* 遗留 context-api 的实现过程:
    * childContextApi 的方式.
    * 会影响整个子树.
    * 对性能影响比较大.
    * 视频中带领阅读的源码:很难听懂.
    * 需要重新去理解.

* 新的context 的实现.
    * 组件化的使用方式.
    * context 的提供方和订阅方多是独立的.
    * 没有什么附带的性能影响.

    ```
    ReactFiberBeginWork.js
    updateContextProvider.
    ReactFiberNewContext.js
    prepareToReadContext.
    ```
    * 去网上查一下大概的实现思路，然后在看下源码?


* 9-1 优先级和任务挂起的含义.
    * priority and suspend.
    * 什么叫Suspend.
        * 字面意思是挂起. 
        * 某次更新的任务暂时不提交. render - commit 阶段.
        * 这个更新可能在下一次更新中被执行.
        * current 
    * root => RootFiber => childFiber.
        * workInProgress   * childWIP
    
    * 三种 suspend 的三种方式.（ ReactFiberScheduler.js）
        * 把提交放到低优先级的任务上. 
        * 直接发起一个新的同步更新.
        * 设置timeout 然后提交.
        * onSuspend.
        * commitRoot.
        * findHighestPrioritRoot.
        * onSuspend(
            root,
            rootWorkInProgress,
            rootExpirationTime.
        )

    * 优先级和任务挂起的含义.
        * flushRoot.
        * performSyncWork().
        * completeWork().
        * commitRoot.
        * pendingTime.
        * suspendTime.
        * ReactFiberPendingPriority.

    * suspense 组件的更新过程.
        * 同步渲染:
            * 先直接渲染子节点为Null.
            * commit 的时候设置state.
            * 再发起一次同步渲染fallback.

        * 异步模式下的更新:
            * 设置 shouldCapture.
            * unwindWork 设置state.
            * 渲染fallback.

    * Hooks.
        * hooks 的用法?
        * 
    * 参考文献:
        * https://zhuanlan.zhihu.com/p/60307571  
        * https://www.youtube.com/watch?v=v6iR3Zk4oDY  Time Slicing和Suspense  Dan
            * 笔记:  
        * https://www.zhihu.com/question/268028123/answer/332182059.
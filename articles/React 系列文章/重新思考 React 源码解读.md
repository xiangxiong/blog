写文章的目的:
   * 要自己去想通这个源码的体系，他每个细节，每个变量，到底是什么作用，他处于什么目的去这样去设计.

* React 整体的调度流程.
    * 
    * 是否在render 阶段.
    * requestWork.
    * if expirationTime Sync.
    * performSyncWork.
    * performAsycWork.
    * 每一帧有多余的时间回调给react。
    * requestIdleCallBack.


* 回答2个问题：
    * 1. React Fiber 是如何解决卡顿问题的?
        * 保证浏览器的动画要在 30 fps 以上.

    * root Scheduler 更新.
        * 产生更新，维护一队列.

        * react-reconciler 对应的是 react Fiber. Fiber 结构 React Fiber 帮我我们把整个
        树的应用更新流程，能够拆成每个Fiber 对象为单元的更新流程, 这种单元的形式把更新拆分出来之后，我们可以把每个不同的任务，划分一个优先级，以及我们在更新的过程中，我们可以中断，我们可以记录我们可以记录更新到了那个单元，然后中断了之后 可以过一会回过头来，继续从这个单元开始，继续之前没有做完的更新，而react 16 之前setState 产生的更新，必须从头到尾更新完成，然后在执行之后的代码， 如果我们的整个应用树他的节点非常的多，那么整个更新会导致他占用的JS的运行的时间会非常的多，让页面的其他的一些操作就会进入一个停滞的状态，比如说动画的刷新，或者说input 里面输入的内容，会产生卡顿的效果，所以React 16 之后，他的整体的更新流程是完全不一样的，因为加入了中断，或者是suspense 这样的功能，导致他的整个更新流程的调度变得非常的复杂，那么从这章开始到第五章，多会围绕这一系列的内容进行讲解.

        * 测试.

* Scheduler 的整体流程概览.
    *  流程图解析:
        *  ReactDom.render,setState,forceUpdate. 多会产生更新,然后进入scheduleWork 进行调度, 第一步操作是addRootToScheuler （可以解释为，我们在更新的过程中不仅仅存在一个root 节点，每次调用一个ReactDom.render 多会产生fiber 节点,）这些节点可以在内部进行setState 调度，他们多会有独立的UpdateQuen,有独立的Fiber Tree.来进行应用的更新,一个应用当中可能存在多个Root,所以这个时候就要去维护一个在同一时间可能有多个Root会有更新存在.所以需要有一个这么一个地方去维护他，这个就是 addRootToScheuler 的一个作用,

    * 

* 调度过程中的各种全局变量一览.
    * 
    * 

* 构建任务调度的概念.
    * 
    * 
    * 




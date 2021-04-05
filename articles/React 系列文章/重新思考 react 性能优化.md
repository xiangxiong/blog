* react 性能优化.
  * React 早期的优化多是停留在于JS层面(vdom 的 create/diff) ，诸如减少组件的复杂度(stateless), 减少向下diff的
  规模(SCU), 减少diff 的成本(immutable.js) ,当然，也有例外，比如针对老式的IE的LazyDOMTree。到React 16,则升级到浏览器渲染机制层面,在patch 上取得了突破. 众所周知，浏览器是单线程的。想象一下，如果有两个线程, 一个线程要对这节点进行移除，一个要对他进行样式操作。线程是并发的，无法决定顺序，这样页面的效果是不可控的。换单线程则简单可控，但JS 执行与视图渲染与资源加载与事件回调是如何调度呢,于是有了EventLoop 这种东西.

  * 缺点:
    * 性能:PureRenderMinxin,PureComponent,StateLess,SCU,Immutable.js.

  * EventLoop 是非常复杂的,但有一个点，你一下子分配它许多任务，它的处理速度就下降。如果你把相同的任务放在一起，它的速度就上去了（如className 替换多个dom.style.xxx = yyy,fragment,替换多个节点插入）。一下子创建1000个DIV,并设置随机innerHtml，随机背景，它在chrome 都会卡很久。如果打散，每隔60ms 处理当中的100个，分10次处理，则页面很流畅.

  * 改进:
    * 性能: 任务分拣，时间分片，异步渲染，节点合并.
    * 引用: forwardRef, 无视hoc, 使用render props.

  * react16 的优化思想就是基于这点。由于Fiber 调度算法分为两个阶段，第一个阶段是创建DOM,实例，执行willXX轻量Hooc,并且
  标记它的各种可能任务（sadeEffect）. 第二个阶段才执行他们。这时它会优先进行DOM插入或移动操作,然后才是属性样式操作。didxxx 重行hook,ref.

  * 其中先操作DOM,在设置属性就是一个非常大的优化。DOM插入移除变成了批处理了，样式属性也变成了批处理了。

  * 当然这时同步模式下的超级优化。更绝的是异步模式的时间分片。上面已经说了EventLoop 在繁忙状态下会让页面卡顿低效,于是需要一个时间调度器。浏览器刚好实现一个requestIdleCallBack. 根据参数不同，而已在限制时间内安排一定量的JS任务，从而不影响视图渲染/事件回调；也可以强制在浏览器不断更新视图的瞎忙中，强制中断这个行为，立即安插进我们ReactJs 逻辑。

* 正因为有了这个神器，我们在requestIdleCallBack 的回调中加入一个WorkLoop 的方法，它每次接触一个fiber时，就判定一下当前的时间，看是否有闲空的时间让他进行beginWork 操作(相当于刚才的第一个阶段，设置dom,instance,willlXXX) ，没有就把它放进队列中。把控制器让渡给视图渲染。下一次requestIdleCallBack唤起是，从队列将刚才那个fiber取出来，执行beginWork.

    * react.componet vs react.pureComponent 对比?
        * React.PureComponent 与 React.Component 几乎完全相同，但 React.PureComponent 通过prop和state的浅对比来实现 shouldComponentUpate().
        * React.PureComponent 的 shouldComponentUpdate() 只会对对象进行浅对比。如果对象包含复杂的数据结构，它可能会因深层的数据不一致而产生错误的否定判断(表现为对象深层的数据已改变视图却没有更新, 原文：false-negatives)。当你期望只拥有简单的props和state时，才去继承 PureComponent ，或者在你知道深层的数据结构已经发生改变时使用 forceUpate() 。或者，考虑使用不可变对象来促进嵌套数据的快速比较。
        * 此外,React.PureComponent 的 shouldComponentUpate() 会忽略整个组件的子级。请确保所有的子级组件也是”Pure”的.

    *  

    * 参考文献:
        * 1、https://juejin.im/post/5b45d406f265da0f8e19d4c8.
    
    * 

* 解读 Beyond React 16 by Dan Abramov - JsConf.

    *  time Slice
        * 这个概念的背景是什么?
            * React 在渲染（render）的时候，不会阻塞现在的线程。
            * 如果你的设备足够快，你会感觉渲染是同步的。
            * 如果你设备非常慢，你会感觉还算是灵敏的。
            * 虽然是异步渲染，但是你将会看到完整的渲染，而不是一个组件一行行的渲染出来。
            * 
        * 可以在哪些场景下使用? 3个场景.
        * 优缺点是什么?
        * 如何在我的项目中使用?

        * 参考文献:
            * https://react-timeslicing-demo.netlify.com/
            * 验证登录权限 https://auth0.com/blog/time-slice-suspense-react16/
            
    *  Suspense
        * 主要解决什么问题?
            * Suspense主要解决的就是网络IO问题。网络IO问题其实就是我们现在用Redux+saga等等一系列乱七八糟的库来解决的「副作用」问题。
        * 可以在哪些场景下使用? 3个场景.
            * 引入新的api，可以使得任何state更新暂停，直到条件满足时，再渲染（像async/await）.
            * 可以在任何一个组件里放置异步获取数据，而不用做多余的设置
            * 在网速非常快的时候，可设置，整个数据到达Dom，更新完毕以后再渲染
            * 会给我们提供 high-level (createFetcher)和 low-level( ) 的 API，可以供给业务代码和一些小组件的书写.

    * Lazy
        *
        * 



* 参考文献:
    * https://www.youtube.com/watch?v=v6iR3Zk4oDY  Time Slicing 和 Suspense  Dan.
    * https://www.zhihu.com/question/268028123 
    * https://zhuanlan.zhihu.com/p/35578843 
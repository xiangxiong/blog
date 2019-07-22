*  ReactDom,render,setState,forceUpdate. 多会产生更新,然后进入scheduleWork 进行调度,第一步操作是 addRootToScheduler（可以解释为,我们在更新的过程中不仅仅存在一个root 节点，每次调用一个ReactDom.render 多会产生fiber 节点） 这些节点可以在内部进行setState 调度，他们会有多个独立的UpdateQuen，有独立的Fiber Tree. 来进行应用的更新, 一个应用当中可能存在多个Root，所以这个时候就要在维护一个在同一时间可能有多个Root 会有更新存在,所以需要一个这么一个地方维护他，这个就是 addRootToScheduler 的一个作用.

* 加入之后我们要判断是否正在render 阶段或者前后root 不同，如果正式在render 阶段，或者前后root 不同，就要开始进行工作了,如果不是则要进行return.
因为之前的任务可能正在做，或者处于这个阶段呢我们不需要主动去获取requestWork 去进行一次更新了,这里具体的一个逻辑先不详细更跟大家讲解，因为涉及到一些
公共变量的判断, 到具体的函数具体来讲.

* 
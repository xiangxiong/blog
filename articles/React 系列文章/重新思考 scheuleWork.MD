* 核心知识点
    * 寻找更新对应的FiberRoot 节点.
    * 如果符合条件重置stack.
    * 如果符合条件就请求工作调度.

*  // Update the source fiber's expiration time
* 

```

 if (
    !isWorking &&
    nextRenderExpirationTime !== NoWork &&
    expirationTime < nextRenderExpirationTime
  ) {
    // This is an interruption. (Used for performance tracking.)
    interruptedBy = fiber;
    resetStack();
  }


  function resetStack(){
  
  if (nextUnitOfWork !== null) {
    let interruptedWork = nextUnitOfWork.return;
    while (interruptedWork !== null) {
      unwindInterruptedWork(interruptedWork);
      interruptedWork = interruptedWork.return;
    }
  }

  if (__DEV__) {
    ReactStrictModeWarnings.discardPendingWarnings();
    checkThatStackIsEmpty();
  }

  nextRoot = null;
  nextRenderExpirationTime = NoWork;
  nextLatestAbsoluteTimeoutMs = -1;
  nextRenderDidError = false;
  nextUnitOfWork = null;
}

```


```
 markPendingPriorityLevel(root, retryTime);
```

* 总结:
  * currentTime.
    * 在一次渲染中产生的更新需要使用相同的时间.
    * 在一次批处理的更新应该得到相同的时间.
    * 挂起任务用于记录的时候应该相同.
  
* 总结：
  * react 16 版本是react 团队对react 底层算法一次大的调整,这个版本叫react fiber,fiber 结构帮我们把整个树的应用更新流程, 能够拆成每个Fiber 对象为单元的更新流程, 这种单元的形式把更新拆分之后，我们可以把每个不同的任务,划分一个优先级，以及我们在更新的过程中, 我们可以中断, 我们可以记录更新到了那个单元，然后中断之后可以继续之前没有做完的更新,而 react 16 之前的setState产生的更新，必须从头到尾更新完成,然后执行之后的代码,如果我们的整个应用树的节点非常的多，那么整个更新会导致他占用的JS运行的时间会非常的长，让页面的其他的一些操作就会进入一个停滞的状态，比如动画刷新，用户输入，会产生卡顿的效果. react 16 之后,他的整体更新流程就是完全不一样的，因为加入了中断，或者是suspense 这样的功能,导致他的整个更新流程的调度非常的复杂.

  * reactScheduler 调度过程:
    * 流程图解析:
      * ReactDom.render,setState,forceUpdate。多会产生更新,然后进入scheduleWork 进行调度,第一步操作是addRootToScheuler (可以解释为，我们在更新的过程中不仅仅存在一个root 节点, 每次调用一个ReactDom.render 多会产生fiber 节点) 这些节点可以在内部进行setState 调度,他们会独立的UpdateQueen,有独立的Fiber Tree, 来进行应用的更新, 一个应用当中可能存在多个Root,所以这个时候就要去维护一个在同一时间可能有多个Root 会更新存在,所以需要有一个统一的地方去维护,这个就是addRootToScheuler 的一个作用.

    * 加入之后我们要判断是否正在render阶段或者前后root不同,如果正式在render 阶段,或者前后root不同,我们就调用requestWork, 就要开始进行工作了,如果不是则进行return, 因为之前的任务可能正在做, 或者处于这个阶段我们不需要主动去获取requestWork, 去进行一次更新了。

    * 关于 requestWork 里面做了什么? 主要判断一下 expirationTime 是否是Sync,回想一下,我们在创建一个Update 的时候，我们在调用 ReactDom.render, setState，forceUpdate 去创建一个更新,我们要计算一个 expirationTime 来计算Sync 的expirationTime 或者 异步的expiration Time，这个时候他最终导致, 我们整体的一个更新模式的不同, 因为如果是Sync 模式,代表着这个更新要立马执行,要立马更新到最终的domTree 上面, 所以我们调用的是 performSyncWork, 如果他是一个Sync 模式的，说明他的优先级不是特别高, 他会进入一个 scheuleCallbackWithExpirationTime 调度的流程, 因为他可以不立即更新, 因为他本身的期望，就是 exprationTime 结束之前能够被更新完成就可以了, 所以他优先级非常低, 会进入一个整个调度的流程里面, 

    * 问题1: 如何区分他是异步任务还是同步任务?
    * 问题2: 

    * async scheduler work,这部分就涉及到整个异步的调度的过程, 他利用的浏览器中一个较新的api，requestIdleCallBack,能够让浏览器优先进行他自己的任务, 比如更新动画在每一帧多余的时间的时候，他来调用react 给他设置的一个 callback， 然后他可以去执行react 的更新, 然后 react 会自己挤计算时间，我可以执行我自己的工作,如果这个时间内我的工作没有执行完毕，我要把 javascript 的运行的主动权，交还给浏览器，让浏览器去执行新的动画的更新,来保证一些操作他的高优先级的任务能够被立即执行,所以这就是这个蓝色这片区域他的一个作用，我们调用一个方法叫scheduleDeferedCallBack, 然后会有一个叫 add to callback list 因为我们可能多次调用这个方法,会把这个callback 方法设置进去, 然后在这里面呢? 我们虽然想要使用requestIdleCallBack 这个 api 但是因为大部分浏览器可能还不兼容,他的浏览器兼容性也不是特别好, 所以在react 里面他实现了自己的一个模拟的requestIdleCallBack 的一个方式,那么他具体的实现我们到时候会再跟进,主要通过 requestAnimateFrame 和 javascript 的任务队列的原理来进行一个模拟, 我们调用reqeustIdleCallBack 之后,说明浏览器有空了,我们可以去执行react 的更新了, 这些就是我们加入到异步里面的更新任务.

   * 他的优先级比较低，所以这个时候浏览器有空的时候，我们再来执行，那这个时候执行，react 的任务有一个  expirationTime 所以他这里要判断一下，我的任务有没有超时，如果已经超时，那么我要把所有在这个，就是我们加入的callback list 这个队列里面的所有的已经超时了的任务我要多先给他执行掉，因为这个任务已经超时了，说明他必须要立刻完成，然后执行到第一个非超时的任务之后，如果还有时间，我要继续去执行，如果没有时间我要把主动权交给浏览器让
        浏览器去执行它其他的一些任务，那么最终我要执行的任务是什么调用的一个performSyncWork,这个方法，那么这个方法是我们这里面去调用这个schduleCallBackWithExpartionTime 的时候 设置到 reactSchedule 里面一个回调函数，我们每次设置进来的多是一个相同的方法，那么在调用 performSyncWork 这个方法的时候呢，Schedule 会传给 peforWork 一个 with deadline 的一个对象， 这个对象用来判断，我们进入到 performSyncWork 的时候，就进入到了 react 的一个更新流程，那么react 更新流程他去遍历整颗树，他遍历每棵树的每个单元，然后对他进行一个更新的操作，我每个单元更新完了之后，我回过头来，通过这个deadline 对象判断一下我现在是否还有 javascript 运行的一个时间片，因为 reactSchedule 给每一次我调用 performSyncWork 的任务是有一个时间限制的，比如说默认的情况下是22ms， 在这个时间片内，你可以去执行这个操作，如果你没有在这个时间片内把任务执行完，那么这个就是deadline 对象的一个作用，我们有deadline 和 performSyncWork 最终也多是调用 peforeWork 这个方法， 最终他们在这个地方汇集，根据是否有deadline, 我们会进入一个循环，那么这个循环是什么呢？ 这个循环就是我们要遍历整棵树，每一个fiber节点进行更新的操作，
        那么对于同步的任务，我们没有什么可以讲的东西，因为他可以遍历完整棵树，把整个应用更新掉，就完了，因为他就是同步的。和一起老的 react 是一样的，那么对于异步的来讲，是否符合条件，我们进入 performWrokOnRoot->findHightestPriofityRoot->recompteCurrentRenderTime->
        找到一个最高优先级的任务进行更新，在performWorkOnRoot 里面还会有一个循环，就是在renderRoot里面， 因为要等最终 peformWorkRoot 返回之后我们才能进行下面的操作，那么继续下面的操作，那么对于有deadline 的情况我会重新请求一个时间，去判断一下，deadline 是否已经过期，如果已经过期，如果已经过期的话，那么我会回过头来到这个地方在进行一个判断，这个判断发现deadline 已经过期他又会去调用 scheduleCallBackWithExpirationTime,再次进行一个异步的回调，因为这个是一个递归的过程。

        * 我们在这个过程中加入了 addRootToScheduler，他就有一个队列在维护所有的更新的情况，那么对于我们每一次的更新，我们只能更新一个优先级的任务，及一个root 上的任务，那这个时候红色的这个东西是一个循环的条件判断，他每次更新一个节点上的一个优先级任务他更新完之后，具体的更新操作在performWorkOnRoot 里面， 他会去调用相对应的方法，那么这个root上的优先级，当对应的优先级任务他更新完了之后，他要找到下一个root 上面的对应的优先级的任务，然后再次进入这个循环，所以这个就是deadline 的一个用处。他帮助我们去判断我们是否应该跳出这个循环，如果我们一直处于这个循环，要把所有任务多更新完，那么可能占用的javascript 的运行时间会非常的长，导致我们的动画停滞了，导致我们用户输入卡顿了，在这个deadline 如果已经超过了之后呢? 我们这个循环直接跳出，然后继续调回到 scheduleCallBackExpirationTime , 再次进入一个调度把javascript 执行权交给浏览器让他先执行动画或者用户输入的响应，然后等有空了，我们在回过头来，在去执行这个任务回到异步循环条件这里，然后之前没有完成的任务，继续执行我们这样一个循环。

        * 最终要达到的目的是要把addRootToScheduler 他里面的所有的节点上面的所有的更新多执行完毕为止，那这个就是整的一个循环的过程。那么对于同步的我们没有什么可以讲的东西。因为同步的，他执行完就ok了，主要考虑的是异步的情况，那么这个就是整体的一个调度的流程，那么对于performWorkOnRoot  他做的是什么呢？ 他做的是一个更新的过程，更新的过程我会在后面的几节课来讲，前面几节主要讲的是一个调度的过程，我们通过这几个方法产生了更新， 产生了更新之后维护一个队列，去保存这些更新，以及对应的root节点，然后根据他的一些任务的优先级，来进行判断，我要是同步的更新还是异步的更新，那么异步的更新如果有多个任务，那会一直处于先执行浏览器优先级最高的更新，然后有空的时候来更新react 树，react 树更新完了，如果我的root上我对应的某一个优先级的任务更新完了，那我先输出到dom 上，然后我执行下一个更新，在这个循环的过程当中，根据我这个调度器，他传入的deadline对象，我判断我是否有超时，我超时了，我在传递一个对象 scheduleCallBackWithExpriationTime ,然后先把执行权交给浏览器，然后让他保证动画的流畅运行，然后等他有空，我们在回过头继续执行之前的任务，那这个就是整个调度的核心原理，他要实现的目的是要保证低优先级的 react 任务不会阻止浏览器的一些高要求的动画更新，能够保证浏览器的一些动画在30fps以上这么一个情况，所以这个就是整个react 调度的过程。


* react 完整的更新流程:
  * 入口和优化:
  * 判断组件更新是否可以优化。
  * 根据节点类型分发处理.
  * 更加expirationTime 等信息判断是否可以跳过. 

* completeUnitOfWork 的整体流程和意义。
  * 根据是否有中断调用不同的处理方法.
  * 判断是否有兄弟节点是否有兄弟节点的操作.
  * 完成节点之后赋值effect链.

* commitRoot 的总体工作内容.
  * 预备工作
  * 三个循环.
  * 善后工作.
  * 
  ```
   commitRoot(){
     
   }
  ```
  * context-stack.
    * 

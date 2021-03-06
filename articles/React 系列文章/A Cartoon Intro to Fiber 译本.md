

### 为什么要搞React Fiber.
* React 更新过程是同步的,这可能导致性能问题.
* 当React 决定要加载或更新祖建树时，会做很多事情，比如调用各个组件的生命周期函数，计算和比对Virtual DOM ,最后更新DOM树，这整个过程是同步进行的，也就是说只要一个加载或者更新过程开始，会一直占用主线程，知道渲染完毕.
* 表面上看,这样的设计也是挺合理的，因为更新过程不会有任何I/O操作，完全是CPU计算,所以无需异步操作,
的确只要等待渲染完成就可以。但是，当组件树比较庞大的时候，问题就来了， 假如更新一个组件需要1毫秒，如果有200个组件需要更新，那就需要200毫秒，在这200毫秒的更新过程中，浏览器那个惟一的主线程多在专心运行
更新操作，无暇去做任何其他的事情，想象一下，在这200毫秒内，用户往一个input 元素输入什么，敲击键盘也不会获得响应，因为渲染输入结果也是浏览器主线程的工作，但是浏览器主线程被React 占用着，抽不出空，
最后的结果就是用户敲击了按键看不出任何反应，等React 更新过程结束之后，按键一下子出现在input 元素中.

* 这就是所谓的界面卡顿，很不好的用户体验.
* 现有的react 版本，当组件很大的时候就会出现这种问题，因为更新过程是同步地一层组件套一层组件，
逐渐深入的过程，在更新完所有组件之前不停止，函数的调用栈就像下面这样，调用后很深，而且很长时间不会返回.
* 因为javascript 单线程的特点，每个同步任务不能耗时太长，不然就会让程序不会对其他输入做出响应，react 的更新过程就是犯了这个禁忌，而且React Fiber 就是要改变现状.

### React Fiber 的方式
* 破解 javascript 中同步操作时间过长的方法其实很简单---分片》
* 把一个耗时长的任务分成很多小片，每个小片的运行时间很短，虽然总时间依然很长，但是在每个小片执行完之后，多给其他任务一个执行的机会，这样唯一的线程都不会被占用，其他任务依然有运行的机会。
* 维护每一个分片的树结构，就是fiber.

### React Fiber 的方式
* 理想情况下，React Fiber 一次更新过程会分成多个分片完成，多以完全可能一个更新任务还没有完成，就被
另一个更高优先级的更新过程打断了，这时候，优先级高的更新任务会优先处理，而低优先级更新任务所做的工作则会完全作废，然后等待机会重新再来.
* 因为一个更新过程可能被打断，所以React Fiber 一个更新过程分为两个阶段：第一个阶段 Reconciliation Phase 和 第二个阶段 Commit Phase.

* 在第一阶段 Reconciliation Phase  协调阶段.
* 在第二阶段 Commit Phase 提交阶段.


* 这两个阶段大部分工作多是react Fiber 做, 和我们相关也就是生命周期函数.

* 以render 函数为界, 第一阶段可能会调用下面这些生命周期函数,说是可能会调用是因为不同生命周期调用函数不同.
    * componentWillMount
    * componentWillRecevieProps
    * shouldComponentUpdate
    * componentWillUpdate.

* 下面这些生命周期函数则会在第二阶段调用.
    * componentDidUpdate()
    * componentDidMount()
    * componentWillUmount().

* 因为第一个阶段的过程会被打断重来，就会造成意想不到的情况.
* 比如说，一个低优先级的任务A 正在执行，已经调用了某个组件componentWillUpdate 函数，接下来发现自己的时间分片已经用完了，于是冒出水面，看看有没有紧急任务，如果有紧急任务B,接下来React Fiber 就会去执行这个紧急任务B，任务A虽然进行了一半，但是没办法，只能完全放弃，等到任务B完全搞定之后，任务A重新再来一遍。也就是componentWillUpdate 函数会再被调用一次.

* 现有React 中，每个生命周期函数在一个加载或者更新过程中，绝对只会被调用一次，在React Fiber 中，不再这样了，第一阶段中的生命周期函数在一次加载和更新过程中可能会被多次调用.
* React Fiber 只会，一定要检查一下第一阶段相关的这些生命周期函数，看看有没有逻辑是在一个更新过程中只调用一次，有电话就要更改了.

* componentWillRecevieProps,即使当前组件不更新，只要父组件更新也会引发这个函数调用.

* shouldComponentUpdate，这个函数的作用是返回一个true 或者 false. 不会有影响.

* componentWillMount 和 componentWillUpdate 这两个函数往往包含副作用，要重点看下

### 用最简单的话来描述.
*  Fiber 是什么?
    * react 对核心算法的一次重新实现.

*  Fiber 解决什么问题?
    * 解决JavaScript中同步操作时间过长的导致长时间占用主线程.

*  Fiber 有什么缺点，如果移植会对现有程序造成什么影响?
    *  

### 精度文章:
* https://zhuanlan.zhihu.com/p/37095662
* https://zhuanlan.zhihu.com/p/35578843

Taro 要看哪些部分:

解决什么问题? 
只书写一套代码，再通过 Taro 的编译工具，将源代码分别编译出可以在不同端.

用什么方案解决的? 做了哪些取舍?
taro 将 react 编译成 小程序原生代码分为几步？
1、首先是 parse:将代码 解析（Parse）成 抽象语法树（Abstract Syntex Tree).
2、然后对 AST 进行 遍历（traverse）和 替换(replace)（这对于前端来说其实并不陌生，可以类比 DOM 树的操作）. 最后是 生成（generate）.
3、根据新的 AST 生成编译后的代码.

新词汇:
monorepo

Lerna

Babel 编译器.

JS 抽象语法树.
https://pines-cheng.github.io/blog/#/posts/55
https://segmentfault.com/a/1190000016231512

cli 工具编写  动手撸一个工具.
https://juejin.im/post/5c93585bf265da611459b7c5
https://juejin.im/post/5bd90d3ce51d4579362b0390
https://www.jianshu.com/p/5d0eef9724e0
https://cloud.tencent.com/developer/article/1005105

参考文献:
http://www.wxsell.com/web/index.php?c=article&a=news-show&do=detail&id=99961661
https://segmentfault.com/a/1190000015340294  cli 工具.

小程序与普通网页开发有什么区别:
1、普通网页开发可以使用浏览器提供的DOM API,进行DOM 操作,小程序的逻辑层和渲染层是分开的,逻辑层运行在JSCore中，没有一个完整的浏览器对象，因此缺少相关的DOM API 和 BOM API.
2、普通网页开发渲染线程和脚本线程是互斥的，这也是为什么长时间的脚本运行可能会导致页面失去响应，而在小程序中，二者是分开的，分别在不同的线程中运行.
3、小程序的执行环境。
4、小程序的开发环境和开发工具。

双线程模型:
1、小程序的渲染层和逻辑层由2个线程管理：视图层的界面使用了WebView 渲染，逻辑层采用了JsCore 线程运行Js 脚本.

为什么要这样设计?
1、为了管控体验和系统安全,为了解决这些问题，我们需要阻止开发者使用一些浏览器的window 对象, 跳转页面, 操作Dom, 动态执行脚本的开发性接口.

小程序模型可以分为三层:
1、逻辑层: 创建一个单独的线程去执行Javascript,在这里执行的都是有关小程序业务逻辑的代码,负责逻辑处理,数据请求,接口调用.
2、视图层: 界面渲染相关的任务都在WebView 线程里执行,通过逻辑层代码去控制渲染哪些界面. 一个小程序有多个界面, 所以视图层存在多个WebView 线程.
3、JsBridage 起到架起了上层开发与Native 的桥梁, 使得小程序可通过API使用原生的功能.

双线程通信:
1、把开发者的JS 逻辑代码放到单线程去运行, 但在webview 线程里，开发者就没法直接操作DOM.
2、DOM 的更新通过简单的数据通信来实现.
大概是这么一个过程: 用Js 对象模拟DOM树,比较两颗虚拟DOM树的差异,把差异应用到真正的DOM树上.

详细描述:
1、在渲染层把WXML 转换成对应的JS 对象.
2、在逻辑层发生数据变更的时候，通过宿主环境提供的setData 方法把数据从逻辑层传递到Native,在转发到渲染层.
3、经过对比前后差异, 把差异应用在原来的DOM树上，更新界面.

我们通过吧WXML 转化为数据，通过Native 进行转发,来实现逻辑层和渲染层的交互和通信.

小程序性能优化:
1、精简代码，降低WXML结构和JS代码的复杂性。
2、合理使用setData调用，减少setData次数和数据量；
3、必要时使用分包优化.

setData 工作原理:
1、小程序的视图层目前使用 WebView 作为渲染载体，而逻辑层是由独立的 JavascriptCore 作为运行环境。在架构上，WebView 和 JavascriptCore 都是独立的模块，并不具备数据直接共享的通道。当前，视图层和逻辑层的数据传输，实际上通过两边提供的 evaluateJavascript 所实现。即用户传输的数据，需要将其转换为字符串形式传递，同时把转换后的数据内容拼接成一份 JS 脚本，再通过执行 JS 脚本的形式传递到两边独立环境。
而 evaluateJavascript 的执行会受很多方面的影响，数据到达视图层并不是实时的。

开发小程序遇到的问题:
1、重复生成海报的问题.
https://segmentfault.com/a/1190000019083548
2、富文本的问题.
3、性能优化的问题.

差异:
1、生命周期对比.
2、JS 对比.
3、模板对比.
4、ESTree Spec.
5、小程序组件 vs web 组件.
6、小程序API vs WebAPI
7、多端适配.
8、性能问题.

有哪些优点和缺点?
最佳实践是什么?
同类还有其他什么方案?
Taro 的源码基本流程看看?
原生小程序:
小程序云开发 来做一个企业小程序.


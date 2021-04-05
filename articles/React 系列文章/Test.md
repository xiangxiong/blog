* 1、Javascript 基础知识.
原型,原型链:
1、什么是原型? 
每一个JavaScript对象(null除外)在创建的时候就会与之关联另一个对象，这个对象就是我们所说的原型，每一个对象都会从原型"继承"属性.
2、什么是原型链?
Person(构造函数) => prototype => Person.prototype 
Person.prototype => constructor => Person
Person => person => _proto_ => Person.prototype

new 的实现.
var person = {};
var person = new Person();
var person = Object.Create();
ver person = new Object();

继承的原理
1、原型模式: 
function Parent () {
    this.name = 'kevin';
}
Parent.prototype.getName = function () {
    console.log(this.name);
}
function Child () {
}
Child.prototype = new Parent();
var child1 = new Child();
console.log(child1.getName())
在创建 Child 的实例时，不能向Parent传参

2、构造函数继承:
function Parent () {
    this.names = ['kevin', 'daisy'];
}
function Child () {
    Parent.call(this);
}
var child1 = new Child();
1.避免了引用类型的属性被所有实例共享.
2.可以在 Child 中向 Parent 传参

3、组合模式:
function Parent (name) {
    this.name = name;
    this.colors = ['red', 'blue', 'green'];
}
Parent.prototype.getName = function () {
    console.log(this.name)
}
function Child (name, age) {
    Parent.call(this, name);
    this.age = age;
}
Child.prototype = new Parent();
Child.prototype.constructor = Child;

https://github.com/mqyqingfeng/Blog/issues/2

对象是如何实现的?
function objectFactory() {
    var obj = new Object(),
    Constructor = [].shift.call(arguments);
    obj.__proto__ = Constructor.prototype;
    Constructor.apply(obj, arguments);
    return obj;
};
1、用new Object() 的方式新建了一个对象 obj
2、取出第一个参数，就是我们要传入的构造函数。此外因为 shift 会修改原数组，所以 arguments 会被去除第一个参数
3、将 obj 的原型指向构造函数，这样 obj 就可以访问到构造函数原型中的属性
4、使用 apply，改变构造函数 this 的指向到新建的对象，这样 obj 就可以访问到构造函数中的属性
5、返回 obj.

bind,call,apply:
1、bind() 方法会创建一个新函数。当这个新函数被调用时，bind() 的第一个参数将作为它运行时的 this，之后的一序列参数将会在传递的实参前传入作为它的参数。(来自于 MDN )
2、call 一个参数.
3、apply 传一个数组.

闭包相关问题:
1、闭包是指那些能够访问自由变量的函数.

那什么是自由变量呢?
2、自由变量是指在函数中使用的，但既不是函数参数也不是函数的局部变量的变量.
由此，我们可以看出闭包共有两部分组成:
3、闭包 = 函数 + 函数能够访问的自由变量

闭包的使用场景是什么?
最流行的闭包类型是广为人知的模块模式。它允许你模拟公共的，私有的和特权成员.
https://yanhaijing.com/javascript/2013/08/30/understanding-scope-and-context-in-javascript/

深拷贝:
var new_arr = arr.slice();
var new_arr = JSON.parse(JSON.stringify(arr));
var deepCopy = function(obj) {
    if (typeof obj !== 'object') return;
    var newObj = obj instanceof Array ? [] : {};
    for (var key in obj) {
        if (obj.hasOwnProperty(key)) {
            newObj[key] = typeof obj[key] === 'object' ? deepCopy(obj[key]) : obj[key];
        }
    }
    return newObj;
}
JavaScript专题之数组去重:
var array = [1, 1, '1'];

function unique(array) {
    var res = [];
    for (var i = 0, len = array.length; i < len; i++) {
        var current = array[i];
        if (res.indexOf(current) === -1) {
            res.push(current)
        }
    }
    return res;
}
console.log(unique(array));

```
var array = [1, 1, '1'];

function unique(array) {
    var res = [];
    var sortedArray = array.concat().sort();
    var seen;
    for (var i = 0, len = sortedArray.length; i < len; i++) {
        // 如果是第一个元素或者相邻的元素不相同
        if (!i || seen !== sortedArray[i]) {
            res.push(sortedArray[i])
        }
        seen = sortedArray[i];
    }
    return res;
}
console.log(unique(array));
```
性能优化:

promise 的模拟实现.

Es6 用过哪些?

ES6 系列之模块加载方案:
https://github.com/mqyqingfeng/Blog/issues/108
AMD

CMD
AMD 是 RequireJS 在推广过程中对模块定义的规范化产出
CMD 是 SeaJS 在推广过程中对模块定义的规范化产出

CommonJS
AMD 和 CMD 都是用于浏览器端的模块规范，而在服务器端比如 node，采用的则是 CommonJS 规范。
AMD规范则是非同步加载模块，允许指定回调函数.

ES6 与 CommonJS
CommonJS 模块输出的是一个值的拷贝，ES6 模块输出的是值的引用.
CommonJS 模块是运行时加载，ES6 模块是编译时输出接口.

ES6 模块

async await.
class
promise 
箭头函数 与 普通函数的区别:
1、箭头函数是匿名函数，不能作为构造函数，不能使用new.
2、普通函数的this指向调用它的那个对象. 
3、箭头函数的 this 永远指向其上下文的  this ，任何方法都改变不了其指向.
defineProperty 与 proxy
我们也可以发现，使用 defineProperty 和 proxy 的区别，当使用 defineProperty，我们修改原来的 obj 对象就可以触发拦截，而使用 proxy，就必须修改代理对象，即 Proxy 的实例才可以触发拦截
https://github.com/mqyqingfeng/Blog/issues/107

Object.assign()
浏览器 渲染的原理:

JS 的运行机制:

解决跨域问题的集中手段:
jsonp:
cors:
nginx 代理:

输入http 浏览器发生了什么?
* css 相关问题.
1、如何让div 居中.
===================================================>
 div{
            width:200px;
            height: 200px;
            background:green;
            position: absolute;
            left:50%;
            top:50%;
            margin-left:-100px;
            margin-top:-100px;
}
.box{

             height:600px;/去掉高度，只能垂直居中。
             display:flex;
             justify-content:center;
             align-items:center;
               /* aa只要三句话就可以实现不定宽高水平垂直居中。 */
}
.box>div{
            background: green;
            width: 200px;
            height: 200px;
}
div {
            width: 200px;
            height: 200px;
            background: green;
            position: absolute;
            left:50%;    /* 定位父级的50% */
            top:50%;
            transform: translate(-50%,-50%); /*自己的50% */
}
===================================================>

2、样式的优先级的问题.
！important>行内样式>id选择器>类选择器>标签选择器>通配符>继承.

* 2、React 基础知识.
官方网站: 
* 3、React 原理层面的知识.

* 4、小程序 基础知识.
* 5、小程序 原理层面的知识.

* 6、基础的算法题目.
* 7、webpack 工程化方面的知识以及原理.

* 8、项目经验方面以及公共组件的知识.
安居客: m 站
技术栈: react + redux + ssr
项目背景: 安居客m站是全面覆盖新房、二手房、租房、商业地产四大业务，同时为开发商与经纪人提供高效的网络推广平台.
价值点: 组件库 + 物料开发.

React 16 版本有哪些更新:
1、解决弹窗问题.推出 createPortal API.
2、react Fiber 而性能问题，从16.0开始一直由一些内部机制来保证，涉及到批量更新及基于时间分片的限量更新
3、异常处理 ComponentDidCatch 方法.
4、React Hooks.
5、16.2 推出Fragment组件, 可以看作是数组的一种. 组件不能返回数组，最见的场合是UL元素下只能使用LI，TR元素下只能使用TD或TH，这时这里有一个组件循环生成LI或TD列表时，我们并不想再放一个DIV，这会破坏HTML的语义.

react Fiber 了解多少?
react 16 版本是react 团队对react 底层算法一次大的调整,这个版本叫react fiber,fiber 结构帮我们把整个树的应用更新流程, 能够拆成每个Fiber 对象为单元的更新流程, 这种单元的形式把更新拆分之后，我们可以把每个不同的任务,划分一个优先级，以及我们在更新的过程中, 我们可以中断, 我们可以记录更新到了那个单元，然后中断之后可以继续之前没有做完的更新,而 react 16 之前的setState产生的更新，必须从头到尾更新完成,然后执行之后的代码,如果我们的整个应用树的节点非常的多，那么整个更新会导致他占用的JS运行的时间会非常的长，让页面的其他的一些操作就会进入一个停滞的状态，比如动画刷新，用户输入，会产生卡顿的效果. react 16 之后,他的整体更新流程就是完全不一样的，因为加入了中断，或者是suspense 这样的功能,导致他的整个更新流程的调度非常的复杂.

性能优化?
链表在循环时不用每次都进入递归函数，重新生成什么执行上下文，变量对象，激活对象，性能当然比递归好.

链表是什么?
https://blog.csdn.net/Plus_L/article/details/82597514

fiber 对象里面有什么?
fiber节点拥有return, child, sibling三个属性,分别对应父节点, 第一个孩子,它右边的兄弟,有了它们就足够将一棵树变成一个链表,实现深度优化遍历.

高阶组件: 

项目中遇到了哪些问题:
1、服务端渲染获取数据的问题.
服务器端不能运行: componentDidMount.

Home.loadData = (store) => {
    // 这个函数，负责在服务器端渲染之前，把这个路由需要的数据提前加载好.
    // 返回promise 对象.
   return store.dispatch(getHomeList()); promise
}
promise all 方法.
需要路由的来调用数据.
loadData: Home.loadData.
根据路由的路径，来往store里面加数据.
让matchRoutes 里面的所有组件，对应的LoadData方法执行一次.

2、数据的脱水和注水.(如何让客户端和服务端数据统一).

1、在服务端
window.context = {
    state: ${JSON.stringify(store.getState())}
}
export const getClientStore = () =>{
    const defaultState = window.context.state;
    // 改变客户端store的内容,一定要使用clientAxios.
    return createStore(reducer,defaultState,applyMiddleware(thunk.withExtraArgument(clientAxios)));
}
3、如何实现css 样式在服务端渲染.
4、

redux 源码:

webpack 工程化构建:

自我介绍:
你好，我叫向雄，目前在申通快递，担任前端工程师, 主要用的技术栈: react 技术栈.
比较有特色的项目有: 安居客m站, 安居客小程序.

安居客 小程序:
原生小程序 + taro.
项目背景: 安居客m站、是全面覆盖新房、二手房、租房、商业地产四大业务，同时为开发商与经纪人提供高效的网络推广平台.
价值点: taro 来做多端统一的，减少工作量.
项目中遇到了哪些问题:
1、拆包分包的问题.
2、
taro 遇到的问题:

* 9、为什么离职.
1、公司距离我家太远，路上时间太长, 一天来回要将近4个小时，短期还可以，长期我确实坚持不下来了.
2、公司转型，职位目前的定位和我的发展初衷不一致.                                                                                  

* 10、薪资方面有没有谈妥.
* 11、最快啥时候入职. 下周可以入职.


携程的人会问什么样的问题呢?
1、携程笔试5道简单的题目原型链深拷贝 一面自我介绍 克服过的技术难点与细节亮点 keepaliverollup打包的优点降维最优解hash去重路由数组扁平化项目优化 二面性能优化具体做了什么提供国际化思路docker.
2、同样是三轮，每轮半小时会问历史项目，也会问业务相关的问题。最后一轮HR很强硬，会压工资不太舒服。给offer后会有个考试，智商一类的测验.
3、技术面因为基础和准备的问题，答得不是很好，但是因为是内部推荐，而且学习能力也被认可，所以基本过了技术面。但是最后在hr面上，因为薪资和价值观的回答可能不够让hr满意，最后被挂了.
4、ES6特性有哪些 请你说一下async/await  说一下jquery框架与其他框架之间的区别 你说一下 垂直居中的方法有哪些 axios 与ajax 之间的区别 写一个链表的问题
5、先和一位技术深度比较深的聊的技术。主要聊了函数式编程，es6， webpack， 尖头函数和普通函数的比较，bind的实现原理。
6、被hr带到别的部门聊了一下react 原理和设计模式，感觉答的不是很好
7、webpack 原理 ，单说了下基于事件的工作流，然后配合各种插件完成不同的功能。 然后重点说了下treeshark 和热加载。 treeshark 是基于es6的语法分析，热加载是通过websocket 实时的将变化的模块脚本传给客户端.

React-Router 的原理是什么?
实现URL与UI界面的同步。其中在react-router中，URL对应Location对象，而UI是由react components来决定的，这样就转变成location与components之间的同步问题.


执行URL前进
createBrowserHistory: pushState、replaceState
createHashHistory: location.hash=*** location.replace()
createMemoryHistory: 在内存中进行历史记录的存储

检测URL回退
createBrowserHistory: popstate

state的存储:
为了维护state的状态，将其存储在sessionStorage里面:

Promise 的原理是什么? 如何手动写一个.
https://mengera88.github.io/2017/05/18/Promise%E5%8E%9F%E7%90%86%E8%A7%A3%E6%9E%90/

观察者和订阅有什么不同?

http 缓存相关的请求头.
http 和 https 的区别?
基于HTTP协议，通过SSL或TLS提供加密处理数据、验证对方身份以及数据完整性保护.
1、client向server发送请求https://baidu.com，然后连接到server的443端口，发送的信息主要是随机值1和客户端支持的加密算法.
2、server接收到信息之后给予client响应握手信息，包括随机值2和匹配好的协商加密算法，这个加密算法一定是client发送给server加密算法的子集。
3、随即server给client发送第二个响应报文是数字证书.
4、客户端解析证书，这部分工作是由客户端的TLS来完成的，首先会验证公钥是否有效，比如颁发机构，过期时间等等.
5、客户端认证证书通过之后，接下来是通过随机值1、随机值2和预主秘钥组装会话秘钥。然后通过证书的公钥加密会话秘钥.
6、同样服务端也会通过会话秘钥加密一条消息回传给客户端，如果客户端能够正常接受的话表明SSL层连接建立完成了.

移动端浏览器 和 PC浏览器的兼容性问题.

EventLoop 的问题.

Webpack 工程化这块内容在加强.
webpack loader:
插件:
多进程，多实例构建。
webpack 原理 ，单说了下基于事件的工作流，然后配合各种插件完成不同的功能。 然后重点说了下treeshark 和热加载。 treeshark 是基于es6的语法分析，热加载是通过websocket 实时的将变化的模块脚本传给客户端.

1、webpack 配合热更新的原理:
2、多页打包如何配置?  获取文件的路径，动态去生成htmlwebpackPlugins.
3、treeshark 的使用和原理分析. 
代码不会被执行到,不可到达.

利用Es6 模块的特点:

概念: 1 个模块有多个方法，只要其中的某个方法用到了，则整个文件多会被打包进去bundle 里面去，tree shaking 就是只把用到的方法打入bundle 中, 没用到的方法会在unglify 阶段被拆除掉.
1、只能作为模块顶层的语句出现.
2、import 的模块名只能是字符串常用.
3、import binding 是immutable 的.

性能优化的点:
1、
2、
3、
4、

体积优化:
1、多进程多实例构建. happlyPack.   worker 多个线程中.
2、thread-loader.

代码拆除: ugify 阶段删除
代码分割动态导入: 动态import.
React Hooks.

基础知识 + 原理知识 + 项目经验.

----- 模拟面试 ------

面 试:
自我介绍:
你好，我叫向雄，目前在申通快递，担任前端工程师, 主要用的技术栈: react 技术栈.
做过的应用有: m站, 小程序, 中后台.
拿其中的一个例子来讲: m 站. (react + redux + node.js).
项目中遇到了哪些问题:
1、服务端不能执行生命周期的问题.
2、服务端如何执行 css.
3、注水和脱水的过程.
4、移动端适配的问题.

Taro 小程序:
基础知识考查:
1、EventLoop 机制. 异步和同步.
理解哪些语句是会放入异步任务队列.
理解语句放入异步任务队列的时机.
理解任务队列.

microtask queue: process.nextTick, Promises, Object.observe, MutationObserver.
macrotask queue: setTimeout, setInterval, setImmediate, requestAnimationFrame, I/O, UI rendering.
参考文章:
https://segmentfault.com/a/1190000019123388

怎么区分:
和html交互密切相关的异步操作，一般是macrotasks；由emcascript的相关接口返回的异步操作，一般是microtasks.

2、浏览器渲染的原理.
关键渲染路径:
1、

3、闭包, 原型链, 作用域链.  5 min.


4、性能优化的问题.  5min.

RAIL 测量模型.

(1)、渲染优化.
(2)、代码优化.

(3)、资源优化.
减少http 请求.
减少资源请求大小.
(4)、构建优化.
(5)、CDN缓存.

http 缓存.  5min.
5、web 安全这块.  5min.

5、https 和 http 的区别, http 编码.

http 实现的原理:
客户端输入url 回车, dns 解析域名得到服务器的IP地址, 服务器在80端口监听客户端请求, 端口通过TCP/IP协议 建立连接. http 属于 tcp/ip 模型中的
运用层协议, 所以通信的过程其实是对应数据的入栈和出栈. 网络七层协议: 应用层, 传输层, 网络层, 链路层.

tcp 三次握手:
1、客户端发送 syn 报文，并置发送序号为X;
2、服务端发送 syn + ack 报文, 并置发送序号为: Y, 在确认序号为 X+1; 
3、客户端发送 ack 报文,并置发送序号为Z,在确认序号为 Y+1; 

tcp 四次握手:
为什么需要四次挥手呢？TCP是全双工模式，当client发出FIN报文段时，只是表示client已经没有数据要发送了, client告诉server，它的数据已经全部发送完毕了；但是，这个时候client还是可以接受来server的数据；当server返回ACK报文段时，表示它已经知道client没有数据发送了，但是server还是可以发送数据到client的；当server也发送了FIN报文段时，这个时候就表示server也没有数据要发送了，就会告诉client，我也没有数据要发送了，如果收到client确认报文段，之后彼此就会愉快的中断这次TCP连接.

https 实现的原理:
ssl 建立连接过程:
https://blog.csdn.net/xiaoming100001/article/details/81109617

http 编码:
1、1xx:指示信息-表示请求已接收，继续处理.
2、2xx: 成功-表示请求已被成功接收. 200.
3、3xx: 重定向-要完成请求必须进行更进一步的操作. 301 代表永久性转移, 302 代表暂时性转移. 搜索引擎pr 值转换不一样.
4、4xx: 客户端错误 - 请求有错误或请求无法实现.
403: 对被请求页面的访问被禁止.
404: 请求资源不存在.

5、5xx:服务器错误 - 服务器未能实现合法请求.
500: 服务器错误.
503: 服务器宕机 、过载.

HTTP 1.1:
HTTP 1.0 使用非持久连接, HTTP1.1 实现持久连接. 
HTTP 1.1 还提供了身份认证、状态管理 和 Cache缓存等机制. 
参考文献: https://blog.csdn.net/xiaoming100001/article/details/81109617

http 相关的请求头: HOST,Connection,cookie
http 缓存:
Cache-Control: no-cache 不直接使用缓存, no-store 不适用缓存, max-age 秒来计算.
协商缓存相关的Header: ETag/If-Not-Match、Last-Modified/If-Modified-Since.

> http 缓存:
6、浏览器缓存的机制原理.
7、promise 的原理.
8、Es6 基本语法及原理.
9、css 样式的问题.

React 相关的知识:
1、React 生命周期是如何实现的?
2、React SetState是同步的还是异步的?
3、React 16 版本和15 版本有什么区别?
4、React Hooks 的原理. 和相关知识点?
5、Redux 的知识点.

NodeJs 相关的知识:
1、丰富的移动端前端开发经验，熟悉模块化、前端编译和构建工具，熟练运用主流的移动端JS库和开发框架，并深入理解其设计原理，熟悉ReactJs, Webpack, Gulp等.
2、5年以上前端开发经验，2年以上移动互联网开发经验；前端基础扎实，熟练运用JavaScript语言与HTML5、CSS3等技术.

安居客 - 小程序:
原生小程序 + taro.
项目背景: 安居客m站、是全面覆盖新房、二手房、租房、商业地产四大业务，同时为开发商与经纪人提供高效的网络推广平台.
价值点: taro 来做多端统一的，减少工作量.

项目中遇到了哪些问题: 
1、拆包分包的问题.
2、taro 遇到的问题.

准备的东西:
1、基础知识夯实. 闭包,原型链,作用域链.

2、工程化的方案.
3、项目梳理一下.

> web 性能优化:
1、构建优化.
2、传输加载优化.
3、代码优化.
4、渲染优化.
5、资源优化.
6、更多流行优化技术.

Metrics:

移动端挑战更多.
1、首屏渲染的手段.
2、RAIL 测量模型. (量化的指标.)

什么是RAIL:
1、Response 响应.
 响应: 处理事件应在 50ms 内完成.  1s = 60fps.

2、Animation 动画.
1s = 50 fps.

3、Idle 空闲.
空闲: 尽可能增加空闲时间.

4、Load 加载.
加载: 在5s内完成内容加载并可以交互.

性能测量工具:
1、Chrome DevTools 开发调试,性能评测.
2、Lighthouse 网站整体质量评估.
3、WebPageTest 多测试地点,全面性能报告.

WebPageTest 评估Web 网站性能优化:
1、https://webpagetest.org/
2、waterfall chart 请求瀑布图.
3、first view 首次访问.  http 缓存.
4、repeat view 二次访问.
5、如何本地部署WebPageTest 工具.


Lighthouse:
1、

RAIL 的目标:
1、让用户有最好的体验.


DevTools 分析性能:
Performance 去分析哪些行数有性能问题.
设置浏览器缓存.
NetWork 网络加载分析
Throtting 调整网络吞吐.
Audit

常用性能测试APIs.
1、客户端服务端协商.
2、网络状态.

浏览器渲染原理和关键渲染路径:
1、JavaScript => Style => Layout => Paint => Composite.

回流与重绘、如何避免布局抖动?

影响回流的操作:
1、添加/删除操作. 操作styles, display: none , offsetLeft, scrollTop, clientWidth, 移动元素位置.
2、修改浏览器大小, 字体大小.

避免 layout thrashing.
避免回流.
读写分离.

使用FastDom [防止布局抖动的利器]
1、
2、

避免重绘.
1、
2、
3、

总结:
高频事件防抖:

V8 引 擎:
1、脚本流.
2、字节码缓存.
3、懒解析.

函数优化:
1、

对象优化(JS 对象被坑指南):
1、以相同顺序初始化对象成员, 避免隐藏类的调整.
2、实例化后避免添加新属性.
3、尽量使用Array 替换 array-like 对象.

HTML 优化:
1、减少iframes 使用.
2、压缩空白符.
3、避免节点深层级嵌套.
4、避免table 布局.
5、删除注释.
6、CSS & Javascript 尽量外链.
7、删除元素默认属性.

CSS  对性能的影响:
1、降低 CSS 对渲染的阻塞.
2、利用 GPU 进行完成动画.
3、使用Contain 属性进行优化.
4、使用font-display 属性.
5、资源的压缩与合并.

> 为什么要压缩&合并:
1、减少http 请求数量.
2、减少请求资源大小.
3、html-minifier-terser.

> css 压缩:
1、使用在线工具进行压缩.
2、使用clean-css 等工具.

> JS 压缩与混淆.
1、使用在线工具进行压缩.
2、使用webpack 对JS 在构建时压缩.

> css js 文件合并.
> 图片优化的方案.
> 性能优化的手段和方案.

* 你做过哪些性能相关的事情?

1、性能指标和优化目标是什么?
2、使用 WebPageTest 评估网站性能, LightHouse 去分析网站的性能. 关键是如何去分析和定位问题? 
3、性能优化有哪几种手段?
  * 渲染优化.
    * 浏览器渲染的原理.
    * 如何避免重绘和回流.
    * 高频事件防抖和节流

  * 代码优化.
    * JS 开销和如何缩短解析时间.
      * 加载、执行、解析和编译.
      * 同样的大小 js 比 jpg 加 载更慢一些.
      * loadsh 拆包，不要加载到客户端.
        * Code splitting 代码拆分, 按需加载.
        * Tree shaking 代码减重.

      *  减少主线程工程。
        * 避免长任务.
        * 避免超过1Kb的行间脚本.?
        * 使用 rAF 和 rIC 进行时间调度.
      * 首屏资源的规划，注意行间脚本不要超过 1KB.
        *  
      * Progressive Bootstarpping
        * 把首屏需要的资源加载，其他的不需要加载.
      * 配合 v8 执行代码优化. -- todo
        * 

    * 函数优化.
        * 
    * HTML 优化, css 优化.

  * 资源优化.
    * 资源的压缩与合并
        * 减少http 请求梳理.
        * 减少请求资源的大小.
        * html 压缩.
    * 图片格式优化.
        * 
    * 图片加载优化.
        * 
  * 构建优化.
    * webpack 持久化缓存.
    * webpack 代码拆分.
    * webpack 应用大小检测与分析.
    * React 按需加载方式.

  * 传输加载优化.
    * http 缓存.
    * 启用 Gzip.
    * 启用 Keep Alive.
    * SSR 技术给前端减负.

聊 10 min 左右.

重点聊那几个方面:
一、自我介绍
二、项目亮点
亮点: docker, ssr, taro 小程序, 组件库, 组件化.

三、js 基本概念以及原理. 
1、JavaScript底层知识，重点讲解如原型、作用域、执行上下文、变量对象、this、闭包、按值传递、call、apply、bind、new、继承、promise 实现原理.

2、ES6 相关知识.
3、React 原理相关.

四、性能优化相关以及安全相关问题
性能相关: react 按需加载方式, http缓存, 图片加载优化, 如何避免重绘和回流.

五、工程化相关问题.
webpack: 多一个打包, 拆包, 如何编写插件, 如何编写Loader.

六、网络相关问题.
http vs https | http 状态码 | 


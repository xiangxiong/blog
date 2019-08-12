* redux 解决什么问题:


* 有用处的代码:
    * isPlainObject.
    * 

    * 验证类型:
    ```
    if (
        (typeof preloadedState === 'function' && typeof enhancer === 'function') ||
        (typeof enhancer === 'function' && typeof arguments[3] === 'function')
    ){
        throw new Error(
        'It looks like you are passing several store enhancers to ' +
            'createStore(). This is not supported. Instead, compose them ' +
            'together to a single function.'
        )
    }
    ```

参考文献:
* https://juejin.im/post/5c094492e51d4571ea6b0c0a#heading-7.


需要搞懂的语法:
    * Array.prototype.reduce
    * slice 
    * ...args
    * reduce https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Global_Objects/Array/Reduce.

总结:
    * 看源码每次多要带着只解决一个问题的思路看，否则是会非常难看懂.
    * 源码别后的核心思想是什么？
        * 实现redux 工作流.
        * 主要包括:
            * applyMiddleware。
            * combineReducers.
            * createStore.
            * bindActionCreateors.
            * compose.

        * redux 中间件实现的原理:
            * action 发起之后到达reducer 之前的扩展点, 将 store.dispatch 方法进行替换.

            * 中间件的基本结构:
            ```
            function createThunkMiddleWare(){
                return ({dispatch,getState}) => next => action => {
                    if(typeof action === 'function'){
                        return action(dispatch,getState,extraArgument)
                    }

                    return next(action);
                }
            }
            ```

            * 如何理解 applyMiddleware.

            ```
            const middlewareAPI = {
                getState:store.getState,
                dispatch:(...args)=>dispatch(...args)
            }

            const chain = middlewares.map(middleware=>middleware(middlewareAPI))

            dispatch = compose(...chain)(store.dispatch)

            return {
                ...store,
                dispatch
            }
            ```

            * 有没有自己写过中间件:
            ```
            function createThunkMiddleWare(){
                return ({dispatch,getState}) => next => action => {
                    if(typeof action === 'function'){
                        return action(dispatch,getState,extraArgument)
                    }

                    return next(action);
                }
            }
            ```

 * 讲讲 asyc await 的实现原理:
    * async 使得后面的 function 始终返回一个promise.
    * await 必须在 async 函数内部使用,只有等到 await 后面的部分执行后，函数才会继续执行.
    * https://zhuanlan.zhihu.com/p/53944576 深入理解await 函数.
    * https://developers.google.com/web/fundamentals/primers/async-functions 

 * 基本原理:
    * async/await 本质上是 gennerator 的语法糖.
    ```
    本质上就是个 Promise。所有 async 函数都返回 Promise，所有 await 都相当于把之后的代码放在 then callback 里，而 try-catch 要变为 then 的 rejection callback
    ```

 * 衍生的问题: 
    * promise 对象的知识.

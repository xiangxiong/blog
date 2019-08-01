
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
        


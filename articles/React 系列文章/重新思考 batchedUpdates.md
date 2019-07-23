* batchedUpdates 
    * 批量更新的操作:
    * 
    *
```
  isBatchedUpdates.

  handleClick = () => {
    // 主动`batchedUpdates`
    setTimeout(() => {
      this.countNumber()
    }, 0)
    
    // setTimeout中没有`batchedUpdates`
    // setTimeout(() => {
    //   batchedUpdates(() => this.countNumber())
    // }, 0)

    // 事件处理函数自带`batchedUpdates`
    // this.countNumber()
  }

  function batchedUpdates<A, R>(fn: (a: A) => R, a: A): R {
  const previousIsBatchingUpdates = isBatchingUpdates;
  isBatchingUpdates = true;
  try {
    return fn(a);
  } finally {
    isBatchingUpdates = previousIsBatchingUpdates;
    if (!isBatchingUpdates && !isRendering) {
      performSyncWork();
    }
  }
}

1、了解公共变量的作用.
2、setState 是同步还是一部.
   setState 的方法本身是同步的，但是不标准data立马就更新了,
   更新时要根据我们当前环境的上下文来决定的. 如果我处于批量更新的情况下，不是立马更新，如果不处于批量更新的情况下，也有可能是立马更新的.
3、问题: setState 为啥是异步的?



```
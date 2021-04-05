* 核心知识点.
    * 维护时间片.
    * 模拟 requestIdleCallBack.
    * 调度列表和超时判断.

*  1秒 30 帧以上.
*  react scheduler  不超过一个特定的时限.
*  时间片的概念:
    * 至少要渲染30帧以上.
    * 平均 33 ms.
    * 每一帧固定的时间来渲染.
    * 1秒钟 分成 30 帧以后, 每一帧 33ms 里面, 11ms 浏览器，22ms 算 react 的.
    * 保证react 更新的时间不超过在浏览器里面的一个特定的时限. 这个就是react scheduler 的目的.

```
function scheduleCallbackWithExpirationTime(
  root: FiberRoot,
  expirationTime: ExpirationTime,
) {
  if (callbackExpirationTime !== NoWork) {
    // A callback is already scheduled. Check its expiration time (timeout).
    if (expirationTime > callbackExpirationTime) {
      // Existing callback has sufficient timeout. Exit.
      return;
    } else {
      if (callbackID !== null) {
        // Existing callback has insufficient timeout. Cancel and schedule a
        // new one.
        cancelDeferredCallback(callbackID);
      }
    }
    // The request callback timer is already running. Don't start a new one.
  } else {
    startRequestCallbackTimer();
  }

  callbackExpirationTime = expirationTime;
  const currentMs = now() - originalStartTimeMs;
  const expirationTimeMs = expirationTimeToMs(expirationTime);
  const timeout = expirationTimeMs - currentMs;
  callbackID = scheduleDeferredCallback(performAsyncWork, { timeout });
}


  // TODO: Get rid of Sync and use current time?
  if (expirationTime === Sync) {
    performSyncWork();
  } else {
    scheduleCallbackWithExpirationTime(root, expirationTime);
  }


```


* reactScheduler CallBack 第二节课: (没看懂.todo)

```
scaduleCallBack().


```

* reactScheduler CallBack 第三节课: (没看懂.todo)
 * 测试.
```
var messageKey =
    '__reactIdleCallback$' +
    Math.random()
      .toString(36)
      .slice(2);
  var idleTick = function(event) {
    if (event.source !== window || event.data !== messageKey) {
      return;
    }

    isMessageEventScheduled = false;

    var prevScheduledCallback = scheduledHostCallback;
    var prevTimeoutTime = timeoutTime;
    scheduledHostCallback = null;
    timeoutTime = -1;

    var currentTime = getCurrentTime();

    var didTimeout = false;
    if (frameDeadline - currentTime <= 0) {
      // There's no time left in this idle period. Check if the callback has
      // a timeout and whether it's been exceeded.
      if (prevTimeoutTime !== -1 && prevTimeoutTime <= currentTime) {
        // Exceeded the timeout. Invoke the callback even though there's no
        // time left.
        didTimeout = true;
      } else {
        // No timeout.
        if (!isAnimationFrameScheduled) {
          // Schedule another animation callback so we retry later.
          isAnimationFrameScheduled = true;
          requestAnimationFrameWithTimeout(animationTick);
        }
        // Exit without invoking the callback.
        scheduledHostCallback = prevScheduledCallback;
        timeoutTime = prevTimeoutTime;
        return;
      }
    }

    if (prevScheduledCallback !== null) {
      isFlushingHostCallback = true;
      try {
        prevScheduledCallback(didTimeout);
      } finally {
        isFlushingHostCallback = false;
      }
    }
  };

// Assumes that we have addEventListener in this environment. Might need

// something better for old IE.
window.addEventListener('message', idleTick, false);

```

* Flush Work.

```

```

* reactScheduler 4 CallBack 第四节课: (没看懂.todo)
  *  这四张多在解释一件事情，是如何1秒执行30帧的?
  *  

* performWork.
  * 核心知识点:
    * 是否有deadline 的区分.
    * 循环渲染Root的条件.
    * 超过时间片的处理.
    * performSyncWork  performAsyncWork
    
    ```
      export function didExpireAtExpirationTime(
        root: FiberRoot,
        currentTime: ExpirationTime,
      ): void {
        const expirationTime = root.expirationTime;
        if (expirationTime !== NoWork && currentTime >= expirationTime) {
          // The root has expired. Flush all work up to the current time.
          root.nextExpirationTimeToWorkOn = currentTime;
        }
      }
    ```
    * commitRoot.
    * 



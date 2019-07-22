* requestWork
    * 加入到root 调度队列.
    * 判断是否批量更新.
    * 根据expirationTime 判断调度类型.

    * requestWork

    * 


    ```
    单项链表结构. 插入到最后的一个操作.
    function addRootToSchedule(root: FiberRoot, expirationTime: ExpirationTime) {
        // Add the root to the schedule.
        // Check if this root is already part of the schedule.
        if (root.nextScheduledRoot === null) {
            // This root is not already scheduled. Add it.
            root.expirationTime = expirationTime;
            if (lastScheduledRoot === null) {
            firstScheduledRoot = lastScheduledRoot = root;
            root.nextScheduledRoot = root;
            } else {
            lastScheduledRoot.nextScheduledRoot = root;
            lastScheduledRoot = root;
            lastScheduledRoot.nextScheduledRoot = firstScheduledRoot;
            }
        } else {
            // This root is already scheduled, but its priority may have increased.
            const remainingExpirationTime = root.expirationTime;
            if (
            remainingExpirationTime === NoWork ||
            expirationTime < remainingExpirationTime
            ) {
            // Update the priority.
            root.expirationTime = expirationTime;
            }
        }
    }
    ```


    ```
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
    ```

    ```
        function requestWork(root: FiberRoot, expirationTime: ExpirationTime) {
        addRootToSchedule(root, expirationTime);
        if (isRendering) {
            // Prevent reentrancy. Remaining work will be scheduled at the end of
            // the currently rendering batch.
            return;
        }

        if (isBatchingUpdates) {
            // Flush work at the end of the batch.
            if (isUnbatchingUpdates) {
            // ...unless we're inside unbatchedUpdates, in which case we should
            // flush it now.
            nextFlushedRoot = root;
            nextFlushedExpirationTime = Sync;
            performWorkOnRoot(root, Sync, true);
            }
            return;
        }

        // TODO: Get rid of Sync and use current time?
        if (expirationTime === Sync) {
            performSyncWork();
        } else {
            // 类似于requestIdleCallBack() 方法.
            scheduleCallbackWithExpirationTime(root, expirationTime);
        }
        }
    ```
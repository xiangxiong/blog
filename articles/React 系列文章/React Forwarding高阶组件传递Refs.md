> 在一般组件中使用Forwarding Refs

通常情况下，我们想获取一个组建或则一个HTML元素的实例通过 Ref特性 就可以实现，但是某些时候我们需要在子父级组建中传递使用实例，Forwarding Refs提供了一种技术手段来满足这个要求，特别是开发一些重复使用的组建库时。比如下面的例子:

```
function MyButton(props) {
  return (
    <button className="MyButton">
      {props.children}
    </button>
  );
}
```

上面的代码中MyButton组件渲染了一个HTML元素。对于使用者而言，React隐藏了将代码渲染成页面元素的过程，当其他组件使用MyButton时，并没有任何直接的方法来获取MyButton中的 button 元素，这样的设计方法有利于组建的分片管理，降低耦合.

但是像MyButton这样的组建，其实仅仅是对基本的HTML元素进行了简单的封装。某些时候，上层组建使用他时更希望将其作为一个基本的HTML元素来看待，实现某些效果需要直接操作DOM，比如focus、selection和animations效果.






下面的例子将Forwarding Refs添加到MyButton组件中，以实现实例传递的效果。













### 仿 taro-ui 实现 modal 组件 小程序组件.

* 简介:

    * 项目中使用到弹窗类的组件,重新制造了一个轮子.
    * 源码地址: https://github.com/xiangxiong/webapp-mp/tree/master/src/components/modal
    * 编写完modal组件总计花了28分钟.

* 效果图:

  *  ![image](https://github.com/xiangxiong/blog/blob/master/articles/images/ship.gif)

* 编写组件的基本思路:
    * 1、分析组件要实现的基本功能.对组件进行拆分.确定实现功能的先后顺序.
    * 2、确定使用方法, 在做之前应该想好输入和输出. 确定好数据结构.
    * 3、先写基本结构, 后写样式, 在追加事件和交互, 细节优化.
    * 4、技术总结.

> 一、 组件拆分

 * 该组件可以分为三个部分.

    * 1、遮罩层,点击遮罩层可以关闭弹窗.
    * 2、标题，内容，操作. 这些功能多是可以动态配置的.
    * 3、点击取消关闭弹窗,点击确认可以给父页面传值.

> 二、确定使用方法

  * modal 参数:

    参数 | 说明 | 类型
    ---|---|---
    title | 元素的标题 | String
    content | 元素的内容	 | String
    cancelText | 取消按钮的文本		 | String
    closeOnClickOverlay | 点击浮层的时候时候自动关闭			 | Boolean
    confirmText | 确认按钮的文本				 | String	
     isOpened | 是否显示模态框					 | Boolean	

  * modal 事件:
      事件名称 | 说明 
    ---|---|---
     onClose | 触发关闭时的事件	 
     onCancel | 点击取消按钮触发的样式	
     onConfirm | 点击确认按钮触发的事件	

  * 数据结构

  ```
    this.state = {
        modal:{
            isOpened:false,
            title:'标题',
            content:'内容',
            cancelText:'取消',
            confirmText:'确认',
            closeOnClickOverlay:false
        }
    }
  ```
> 三、分步骤实施

* 实现 UI 功能.

    * 实现modal 的结构
        * mp-modal mp-modal--active 控制这个modal 是否显示隐藏。
        * mp-modal__overlay 通用的遮罩层.
        * mp-modal__container modal 显示区域.
        * mp-modal__title,mp-modal__content,mp-modal__footer 分别为 标题，内容，事件触发.

    ```
     <View className='mp-modal mp-modal--active'>
            <View className="mp-modal__overlay"> </View>
            <View className="mp-modal__container">
                  <View className="mp-modal__title">标题</View>
                  <View className="mp-modal__content">内容</View>
                  <View  className="mp-modal__footer">
                                <View className="mp-modal__action">
                                   <Button>取消</Button>
                                   <Button>确认</Button> 
                                </View>
                  </View>
            </View>
      </View>
    ```

    * 实现modal 的 css 样式.(说重要的几个点)
        * 通用的遮罩层.
        ```
        {
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            position: absolute;
            background-color: rgba($color: #000, $alpha: 0.3);
        }
        ```
        * modal 居中定位
        ```
        {
            position: $pos;
            top: 50%;
            left: 50%;
            transform: translate(-50%, -50%);
        }
        ```
    * 这两部分可以做成公共的css 给整个项目提供使用.

* react 部分功能实现.

    * 核心点有2个:
        * 1、在子组件生命周期 componentWillReceiveProps 中监听父组件状态的变化决定是否渲染子组件.

        ```
        componentWillReceiveProps(nextProps){
            const {_isOpened} = this.state;

            if(_isOpened != nextProps.isOpened){
            this.setState({
                _isOpened:nextProps.isOpened
            });
            }
        }
        ```

        * 2、子组件接收父组件传递过来的属性和事件.
 

    * 组件的代码:

    ```
        <Modal
        title={this.modal.title} 
        content={this.modal.content} 
        isOpened={this.modal.isOpened}
        cancelText={this.modal.cancelText}
        confirmText={this.modal.confirmText}
        closeOnClickOverlay={this.modal.closeOnClickOverlay}
        onClose={this.onClose}
        onConfirm={this.onConfirm}
        onCancel={this.onCancel}
        />
    ```


> 四、技术总结:

* 1、掌握sass 的写法,css 3 掌握的基础知识, css 伪类 :after ,:before , 选择器 :not(:first-child) :last-child, transition 动画, flex 布局, transform 选择. 掌握这些知识之后轻松可以写出UI. 

* 2、掌握react 父子之间数据的传递.

* 3、掌握 componentWillReceiveProps 这个生命周期函数的用法。

* 4、其他的项目使用了 classnames 拼装样式, lodash 验证传入的属性是否是函数, PropTypes 验证父组件传入的数据格式是否正确.


> 五、参考文献:

*  [谈谈React--componentWillReceiveProps的使用](https://juejin.im/post/5a39de3d6fb9a045154405ec).
* [css before 使用场景](https://www.imooc.com/article/21636 ). 
#### css 全解析
* Html 元素的嵌套关系是怎么确定的 哪些嵌套不可以发生?
* css 选择器的权重是如何计算的 写代码时要注意什么.
* 浮动布局是怎么回事 有什么优缺点 国内用得多吗?
* css 可以做逐帧动画吗 性能如何
* BootStrap 怎么做响应式布局.
* 如何解决Css 模块化过程中的选择器相互干扰问题.

#### html 常见元素
* div/section/article/aside/header/footer
* p
* span/em/strong
* table/thead/tbody/tr/td
* ul/ol/li/dl/dt/dd
* a
* form/input/select/textarea/button

* w3c 规范检测规范.
* https://validator.w3.org/check

#### HTML5
* section/article/nav/aside/header/footer 头尾.
* em / strong 强调.
* 日期/ 时间 /搜索
* 表单验证.
* placeholder 自动聚焦.
* i icon. 做图标.
* 功能进行区分.
* html xhtml html5 的区别.

#### html 元素分类
* 按默认样式分
 * 块级 block.
 * 行内 inline.
 * inline-block 元素.

 #### html 元素嵌套关系.
 * 块级元素可以包含行内元素.
 * 块级元素不一定能包含块级元素. p 不能包含 div.
 * 行内元素一般不能包含块级元素. a 元素可以包含 div. span 不能包含 div.
 * 为什么a > div 是合法的?
 * w3c 规范. 浏览器推出了容错机制.
 * 

#### html 元素默认样式.
* 默认样式的意义.
* 默认样式带来的问题.
* user agent stylesheet 。 浏览器默认样式.
* css reset. 初始化的工作. yui 工具.

```
 *{
     margin:0;
     padding:0;
 }
```
Normalize.css.
* 

#### html 面试真题.
1、doctype 的意义是什么?
 
 * 让浏览器以标准模式渲染.
 * 让浏览器知道元素的合法性.
 
2、html xhtml html5 的关系.

 html 属于 sgml。
 xhtml 属于 xml，是html 进行xml 严格化的结果.

 3、html5 有什么变化.

   新的语义化元素.
   表单增强.
   新的API（离线、音视频、图形、实时通信、本地存储、设备能力.）
   分类和嵌套变更. a 元素 嵌套 div.

4、ServiceWork.

5、em 和 i 有啥区别

    em 是语义化的标签, 表强调.
    i 是纯样式的标签,表斜体.

6、语义化的意义是什么?

   * 开发者容易理解.
   * 机器容易理解结构（搜索,读屏软件）.
   * 有助于SEO.
   * semantic microdata.

7、哪些元素可以自闭合。

   * 表单元素input.
   * 图片 img .
   * br hr.
   * meta link.

8、html 和 dom 的关系?

   * HTML 是 死的.
   * DOM 由 HTML 解析而来，是活的.
   * JS 可以维护 DOM.

9、property 和 attribute 的区别.
  
   * attribute 是死的.
   * property 是活的.

10、form 的作用有哪些?
   
   * 直接提交表单.
   * 使用submit/reset 按钮.
   * 便于浏览器保存表单.
   * 第三方可以整体提取值.
   * 第三方库可以进行表单验证.
   

##### Css 基础.
* 选择器.
* 

* 非布局样式.
 * 字体、字重、颜色、大小、行高.
 * 背景、边框.
 * 滚动、换行.
 * 粗体、斜体、下划线.
 * 其他.

* 字体族.
    * serif sans-serif monospance
    * cursive fantasy.
    * 适配不同的平台.

* 多字体 fallback 取决于你的用户.
* 网络字体、自定义字体.
* iconfont.
* fallback 机制.
* 针对每一个字符去找.
* font-face 自定义字体.

* 自定义字体。
    
    * 做图标.
    * iconfont.
    * 如何把把图标变成一个字体.
    * 多平台下字体如何做好适配. 

> 非布局样式 (行高)
* 行高的构成.
    * 

* 行高相关的现象和方案.

    * 

* 行高的调整.    

    *

> 非布局样式 (背景)

* 背景颜色.

* 渐变色背景.

    ```
    background: linear-gradient(0deg,red,green) 
    ```

* 多背景叠加.
  * css 实现波浪线.

* 背景图片和属性(雪碧图)

  * background-position: -34px 40px;
  * 高清屏的方案.
    * 同样一张图. 多一些像素来做, 大图片缩写来做.
    * 高清屏，2倍图，如果是3倍 那就除以3. 做一个3倍尺寸的图除以3.
    * 自适应屏幕的问题.

* base 64 和 性能优化.
    * base64 图 使用 load 加载图片.
    * 写图片地址，通过webpack 打包成 base64.

* 多分辨率适配.
    * 

> 非布局样式 (边框)
    * 边框的属性: 线形状 , 大小, 颜色.

    * 边框怎么使用图片:
        * border-width:30px;
        * border-image:url(./image.jpg) 30 repeat round;
    *  使用场景.（9 宫格）

* 边框 （三角形）

    * 利用 border-right:
    * 利用 border-left:
    * width:0;
    * 边框衔接使用了斜切.

*  加上border-radios:做成扇形.


> 非布局样式 (滚动)
* 滚动行为和滚动条.
* overflow:hidden;
* overflow:scroll;
* overflow:auto;


> 非布局样式 (文字折行)

* overflow-wrap:word-wrap 通用换行控制.
* 是否保留单词.
* word-break 针对多字节文字.
* 中文句子也是单词.
* white-space 空白处是否断行.

* 使用场景:

    ```
            border: 1px solid;
            width: 8em;
            overflow-wrap: normal; break-word 把单词打断.
            word-break: break-word;  keep-all;
            break-word 所有的单词换行，keep-all 单词换行，中文句子换行。
            white-space: normal;

    ```

> hack 案例.

* 


> 布局.














# Javascript 基础回顾

## javascript 基本语法/流程控制语句.
 变量要先声明,在使用.

 加减乘除的先后顺序以及优先级. 先乘除，后加减.

 && || ! 逻辑判断符号.

 if else else if

 while(true) 循环 do ... while 循环先执行一次.

 for 循环

 continue;  跳出本次执行，继续执行下一次.

 break;  跳出整个循环.

 switch case default  判断语句. 

 i++,++i,--i,i--;

## javascript 数组

// 声明一个数组
var myarr = new Array(8); // 数组的长度为8
// 虽然创建数组时，指定了长度，但实际上数组都是变长的，也就是说即使指定了长度为8，仍然可以将元素存储在规定长度以外.

//创建数组同时赋值
var myarray = new Array(66,80,90,77,59);

//直接输入一个数组（称 “字面量数组”）
var myarray = [66,80,90,77,59];

// 追加一个元素.
var myArr = new Array();
myarr.push(1);
myarr.push(2);

数组的长度.


myarray.length

  二维数组的方法


  一维数组的表示: myarray[ ]


  二维数组的表示: myarray[ ][ ]


二维数组的定义方法一
```
var myarr=new Array();  //先声明一维 
for(var i=0;i<2;i++){   //一维长度为2
   myarr[i]=new Array();  //再声明二维 
   for(var j=0;j<3;j++){   //二维长度为3
   myarr[i][j]=i+j;   // 赋值，每个数组元素的值为i+j
   }
 }

```
二维数组的定义方法二

```
var Myarr = [[0 , 1 , 2 ],[1 , 2 , 3]]
```

## javascript 函数
* 函数的作用，可以写一次代码，然后反复地重用这个代码. 函数的目的就是重用.

## javascript 事件

## javascript 内置对象
> 什么是对象?

JavaScript 中的所有事物都是对象，如:字符串、数值、数组、函数等，每个对象带有属性和方法.

> 字符串对象 (String)

返回指定的字符串首次出现的位置 indexOf.

字符串分割  split() .
 
提取字符串   substring()

提取指定数目的字符  substr() 

> Math 对象

向上取整 ceil()

向下取整 floor()

四舍五入 round()

随机数 random()

> Array 数组对象

数组连接 concat()  

concat() 方法用于连接两个或多个数组。此方法返回一个新数组，不改变原来的数组

指定分隔连接数元素 join()

join()方法用于把数组中的所有元素放入一个字符串。元素是通过指定的分隔符进行分隔的.

颠倒数组元素顺序 reverse()

reverse() 方法用于颠倒数组中元素的顺序.


选定元素 slice()


slice() 方法可从已有的数组中返回选定的元素.


数组排序 sort()

sort()方法使数组中的元素按照一定的顺序排列.

> 实践题目:

1、substring,slice,concat,sort,split 对象多是如何封装的？ 面试题目.

## 浏览器对象 / window 对象
window对象是BOM的核心，window对象指当前的浏览器窗口.
window 对象的方法

alert

close

setTimeout,setInterval().

clearInterval(),clearTimeOut()

confrim

Location 对象
* location用于获取或设置窗体的URL，并且可以用于解析URL.

Navigator 对象
* Navigator 对象包含有关浏览器的信息，通常用于检测浏览器与操作系统的版本。

userAgent 对象
* 返回用户代理头的字符串表示(就是包括浏览器版本信息等的字符串)

screen 对象
* screen对象用于获取用户的屏幕信息。

History 对象
* history对象记录了用户曾经浏览过的页面(URL)，并可以实现浏览器前进与后退相似导航的功能.
* 注意:从窗口被打开的那一刻开始记录，每个浏览器窗口、每个标签页乃至每个框架，都有自己的history对象与特定的window对象关联

## Dom 对象 
* 文档对象模型DOM（Document Object Model）定义访问和处理HTML文档的标准方法。DOM 将HTML文档呈现为带有元素、属性和文本的树结构（节点树).

getElementByID,getElementsByName,getElementsByTagName 区别

1. ID 是一个人的身份证号码，是唯一的。所以通过getElementById获取的是指定的一个人。

2. Name 是他的名字，可以重复。所以通过getElementsByName获取名字相同的人集合。

3. TagName可看似某类，getElementsByTagName获取相同类的人集合。如获取小孩这类人，getElementsByTagName("小孩")。

操作dom 元素

* appendChild(),insertBefore(),replaceChild(),
createElement(),setAttribute(),getAttribue().

## 思考题目:
1、在leetCode 多看看javascript 面试题目?





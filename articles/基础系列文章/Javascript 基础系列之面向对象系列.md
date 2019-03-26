# 学习思路
1、面向对象程序设计.
2、如何将这些知识应用于实践。
3、查看javascript 高级程序设计.
4、写文章分享.

# 面向对象程序设计
## 学习目标:

##  面向对象概念 - （没仔细看）
- 了解面向对象程序的特点
- 学会JS模拟对象的方式
- 理解prototype
- 理解继承.

面向对象之概念详解.

两种定义类的方式,三种定义类的实例的方法.

// 构造函数 原型对象 实例对象
// 构造函数.prototype = 原型对象.
// 原型对象.constructor = 构造函数.
// 实例对象.prototype = Person.prototype.(原型对象).

原型图例

## 面向对象之常用方法详解.

这些东西可以用来做什么?

class CarStore{
    constructor(floor){
        this.floor = new Floor();
    }

    getFloorLocationCount(){
       return floor.getCountCarLocation();
    }
}

class Floor{
    constructor(){
    }

    private int carLocationCount;

    private int numberFloor;

    getCountCarLocation(number){
        return total;
    }

    add(numberFloor){

    }

    sub(numberFloor){

    }
}

class Location{

    constructor(car,floor){
        this.car = new Car();
        this.floor = new Floor();
    }

    Entry(){
        floor.add(1);
    }

    Leave(){
        floor.sub(1);
    }
}

class Car{
    constructor(){
    }

    private string brandNumber;

    private datetime entrytime;
}

class Carmera{
    contructor(car){
        this.car = new Car();
    }

    showCarBrand(){
        return car.brandNo;
    }

    private string brandNo;

    private string endTime;

}

class Screen{
    constructor(car){
        this.car = new Car();
    }

    getLeaveTime(){
        return time;
    }
}

// 测试
Car car = new Car('xx001');
Floor floor = new Floor(1);
Location location = new Location(car,floor);
CarStore store = new CarStore(floor);
store.getFloorLocationCount();

Carmera carmer = new Carmer(car);
carmer.show();
location.add();

Screen screen = new Screen(car);
screen.getLeaveTime();
location.sub();












  





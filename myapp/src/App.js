import React,{useEffect} from 'react';
import './App.css';
import LocalStore from './store/localstore';
// import localforage from "localforage";
// import Core from './Core';
// import LocalForage from './forage/localforage';

function App() {

  useEffect(()=>{
    const init = () =>{
      LocalStore.config({
        description: '测试',
      });
      LocalStore.setDriver(LocalStore.WEBSQL);
      LocalStore.setItem('key');
      console.log(' LocalStore ', LocalStore);
    }
    init();
  },[]);

    // LocalForage.setDriver(LocalForage.WEBSQL);
    // console.log(' LocalForage ', LocalForage);
    //   LocalStore.setItem('key22','333',((err)=>{
    //     console.log('err',err);
    //     LocalStore.getItem('key22',((err,value)=>{
    //     console.log('value',value);
    //   }));
    // }));
  //   LocalForage.setItem('key','222',((err)=>{
  //     console.log('err',err);
  //     LocalForage.getItem('key',((err,value)=>{
  //     console.log('value',value);
  //   }));
  // }));
  // console.log('LocalStore',LocalStore);
  // LocalStore.setItem('key', 'some value').then(function(value){
  //     console.log('value',value);
  // })
  // .catch(function(err){
  //   console.log('err',err);
  // });
  // LocalStore.getItem('key',((err,value)=>{
  //   console.log('value',value);
  // }));
  // localforage.config({
  //   driver: localforage.WEBSQL
  // });
  // console.log('localforage',localforage);
  // console.log('LocalForage',LocalForage);
  // console.log('init');
  // localforage.config({
  //   driver: localforage.WEBSQL,
  //   name:'myApp',
  //   version: "1.0",
  //   size: 4980736,
  //   storeName: 'keyvaluepairs',
  //   description: 'some description'
  // });
  // console.log('LocalStore',LocalStore.setDriver('websql'));
  // LocalStore.setItem('localStore','localStore',((err,value)=>{
  //   console.log('value',value);
  // }));
  // const WebSqlCoreInstance = new Core({
  //   dbName: 'school',
  //   version: '1.0',
  //   desc:'学校数据库',
  //   size: 1024 * 1024
  // });
  // // WebSqlCoreInstance.insert('insert into Student(id,name,age,sex) values(?,?,?,?)',
  // // [1,"小明", 21, "男"],(ts,result)=>{
  // //   console.log('result isSuccess',result);
  // // },(ts,result)=>{
  // //   console.log('result error',result);
  // // });
  // WebSqlCoreInstance.insert('Student',
  // {
  //   id:'1',
  //   name:'2',
  //   age:'23',
  //   sex:'男'
  // },(ts,result)=>{
  //   console.log('result isSuccess',result);
  // },(ts,result)=>{
  //   console.log('result error',result);
  // });


  return (
    <div className="App">
     websql
    </div>
  );
}

export default App;

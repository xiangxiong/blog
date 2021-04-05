import websqlDriver from './drivers/websql';
import idbDriver  from './drivers/indexeddb';
import isArray from './utils/isArray';

const DefinedDrivers = {};

const LibaryMethods = [
  'clear',
  'getItem',
  'iterate',
  'key',
  'keys',
  'length',
  'removeItem',
  'setItem',
  'dropInstance'
];

function callWhenReady(localStoreInstance,libraryMethod){
  localStoreInstance[libraryMethod] = function(){
    const _args = arguments;
    return localStoreInstance.ready().then(function(){
      return localStoreInstance[libraryMethod].apply(localStoreInstance,_args);
    })
  }
}

const DefaultDrivers = {
  INDEXDDB: idbDriver,
  WEBSQL: websqlDriver
};

const DefaultDriverOrder = [
  DefaultDrivers.INDEXDDB._driver,
  DefaultDrivers.WEBSQL._driver,
];

const DefaultConfig = {
  description:'localStore',
  driver: DefaultDriverOrder.slice(),
  name: 'localStore',
  size: 4980736,
  storeName: 'keyvaluepairs',
  version: 1.0
}

const DriverSupport = ['webSQLStorage','asyncStorage'];

function extend(){
  for(let i = 1; i < arguments.length; i++){
    const arg = arguments[i];
    if(arg){
      for(let key in arg){
        if(arg.hasOwnProperty(key)){
          if(isArray(arg[key])){
            arguments[0][key] = arg[key].slice();
          }
          else{
            arguments[0][key] = arg[key];
          }
        }
      }
    }
  }
  return arguments[0];
}

class LocalStore{

  constructor(options){
    for(let driverTypeKey in DefaultDrivers){
      if(DefaultDrivers.hasOwnProperty(driverTypeKey)){
        const driver = DefaultDrivers[driverTypeKey];
        const driverName = driver._driver;
        this[driverTypeKey] = driverName;
      }
    }
    this._defaultConfig = extend({}, DefaultConfig);
    this._config = extend({}, this._defaultConfig, options);
    this._driverSet = null;
    this._initDriver = null;
    this._ready = false;
    this._dbInfo = null;
  }

  defineDriver(driverObject,callback, errorCallback){
    this._extend(driverObject);
  }

  _extend(libraryMethodsAndProperties){
    extend(this, libraryMethodsAndProperties);
  }

  config(options){
    this._config = options;
  }

  supports(driverName){
    return  DriverSupport.filter((item=>item === driverName)) ? true :false;
  }

  _getSupportedDrivers(drivers){
    const supportedDrivers = [];
    for(let i = 0, len = drivers.length;i < len; i++) {
      const driverName = drivers[i];
      if(this.supports(driverName)){
        supportedDrivers.push(driverName);
      }
    }
    return supportedDrivers;
  }

  setDriver(drivers, callback, errorCallback){
    const self = this;
    if(!isArray(drivers)){
      drivers = [drivers];
    }
    // 验证是否支持驱动类型.
    const supportedDrivers = this._getSupportedDrivers(drivers);
    function initDriver(){
      if(supportedDrivers.indexOf('webSQLStorage')>-1){
        // 核心的方法就是实例合并给extend
        extendSelfWithDriver(websqlDriver);
      }
      if(supportedDrivers.indexOf('asyncStorage')>-1){
        extendSelfWithDriver(idbDriver);
      }
    }
    function extendSelfWithDriver(driver){
      self._extend(driver);
      self._initStorage(self._config);
    }
    initDriver();
  }

  driver(){
    return this._driver || null;
  }

  getDriver(driverName){
    return DefinedDrivers[driverName];
  }

  ready(callback){
    const promise = new Promise((resolve, reject) => {
      resolve();
    });
    return promise;
  }
}

export default new LocalStore();
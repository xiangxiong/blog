
function _setItem(key,value,callback,retriesLeft){
  var self = this;
  console.log('_setItem websql',self);
}

function setItem(key,value,callback){
  return _setItem.apply(this,[key,value,callback,1]);
}

function createDbTable(t,dbInfo,callback, errorCallback){
  t.executeSql(
    `CREATE TABLE IF NOT EXISTS ${dbInfo.storeName} ` +
    '(id INTEGER PRIMARY KEY, key unique, value)',
    [],
    callback,
    errorCallback
  )
}

function _initStorage(options){
  var self = this;
  var dbInfo = {
    db:null
  };

  if(options){
    for(var i in options){
      dbInfo[i] = 
        typeof options[i] !== 'string'
          ? options[i].toString()
          : options[i];
    }
  }

  dbInfo.db = openDatabase(
    dbInfo.name,
    String(dbInfo.version),
    dbInfo.description,
    dbInfo.size
  );

  dbInfo.db.transaction(function (t) {
    createDbTable(
      t,
      dbInfo,
      function (){
        self._dbInfo = db;
      },
      function (t,error){
        console.log(error);
      }
    )
  });
  console.info('options',options);
}

var webSQLStorage = {
  _driver: 'webSQLStorage',
  _initStorage: _initStorage,
  setItem: setItem
};

export default webSQLStorage;
class Core{

  /**
   *  @dbName: 1、数据库名称。
   *  @dbVersion: 2、数据库的版本号
   *  @dbDescription: 3、对数据库的描述。
   *  @dbSize: 4、设置分配的数据库的大小(单位是kb)
   * @param {*} initOptions 
   */
  constructor(initOptions){
    this.instanceDataBase = openDatabase(initOptions.dbName,initOptions.version,initOptions.desc,initOptions.size);
  }

  /**
   *  创建表
   */
  create(){
    this.instanceDataBase.transaction((ts)=>{
      ts.executeSql("create table if not exists Student(id int,name text null,age int,sex text null)",[],function(ts,result){
        console.info("创建数据库成功"+result);
      },function(ts,message){
          console.info("创建数据库失败",message);
      });
    });
  }


  /**
   * 
   * @param {*} tableName 表名 tablename
   * @param {*} tableField 表字段对象 { name : '2'}
   * @param {*} onSuccess 成功回调
   * @param {*} onError 错误回调
   */
  insert(tableName,tableField,onSuccess,onError){
    if(!tableField)
      throw new Error('Error: FUNCTION dbinsert tableField is Null');
    let fieldKeyArr = [], fieldValueArr = [], fieldKey = null, fieldValue = null, i = 0;
    for (var field in tableField){
      field.toString();
      tableField[field].toString();
      fieldKeyArr[i] = field;
      fieldValueArr[i] = tableField[field];
      if(typeof(fieldValueArr[i]) !== 'number'){
        fieldValueArr[i] = '"'+fieldValueArr[i]+'"';
      }
      i++;
    }
    fieldKey = fieldKeyArr.join(',');
    fieldValue = fieldValueArr.join(',');
    let sql = 'INSERT INTO '+tableName+' (';
    sql += fieldKey;
    sql += ') ';
    sql += 'VALUES (';
    sql += fieldValue;
    sql += ')';
    console.log('sql',sql);
    this.instanceDataBase.transaction((ts)=>{
        ts.executeSql(sql, [], function (ts, result) {
          onSuccess(ts,result);
        }, function (ts, result) {
          onError(ts,result);
        });
    });
  }

  /**
   *  更新记录
   */
  update(){
    this.instanceDataBase.transaction((ts)=>{
      ts.executeSql("update Student set name = ? where id = ? ", ["小红s",2], function (ts, result) {
        console.info("更新数据成功！"+result);
      }, function (ts, message) {
          console.info("更新数据失败！"+message);
      });
    });
  }

  /**
   * 删除记录
   */
  delete(){
   return this.instanceDataBase.transaction((ts)=>{
      ts.executeSql("delete from Student where id = ? ", [2], function (ts, result) {
        console.info("删除数据成功！"+result);
      }, function (ts, message) {
          console.info("删除数据失败！"+message);
      });
    });
  }

  /**
   * 查询结果
   */
  query(){
    this.instanceDataBase.transaction((ts)=>{
      ts.executeSql("select * from Student ", [], function (ts, result) {
        if (result) {
           for (var i = 0; i < result.rows.length; i++) {
               console.info((result.rows.item(i)));
           }
        }
      }, function (ts, message) {
          console.info("查询数据失败！"+message);
      });
    });
  }
}

export default Core;

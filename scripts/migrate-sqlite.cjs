require('dotenv').config();
const {DatabaseSync}=require('node:sqlite');
const source=process.env.SQLITE_SOURCE;if(!source)throw new Error('Set SQLITE_SOURCE to a read-only SQLite backup');
const database=require('../src/database/models');const {sequelize}=database;const schema=process.env.DB_SCHEMA;
const quote=value=>'"'+value.replaceAll('"','""')+'"';
(async()=>{const sqlite=new DatabaseSync(source,{readOnly:true});try{
 await sequelize.authenticate();await sequelize.sync();const models=Object.values(database).filter(model=>model&&typeof model.getTableName==='function');
 await sequelize.transaction(async transaction=>{
 for(const model of models){const table=model.getTableName().tableName;await sequelize.query('LOCK TABLE '+quote(schema)+'.'+quote(table)+' IN ACCESS EXCLUSIVE MODE',{transaction});if(await model.count({transaction}))throw new Error('Destination is not empty; import aborted without overwriting data');}
 const [constraints]=await sequelize.query("SELECT c.conname,c.condeferrable,c.condeferred,t.relname FROM pg_constraint c JOIN pg_class t ON t.oid=c.conrelid JOIN pg_namespace n ON n.oid=t.relnamespace WHERE c.contype='f' AND n.nspname=$1",{bind:[schema],transaction});
 for(const constraint of constraints)await sequelize.query('ALTER TABLE '+quote(schema)+'.'+quote(constraint.relname)+' ALTER CONSTRAINT '+quote(constraint.conname)+' DEFERRABLE INITIALLY DEFERRED',{transaction});
 await sequelize.query('SET CONSTRAINTS ALL DEFERRED',{transaction});let total=0;
 for(const model of models){const table=model.getTableName().tableName;const rows=sqlite.prepare('SELECT * FROM '+quote(table)).all();const booleans=new Set(Object.values(model.rawAttributes).filter(a=>a.type.key==='BOOLEAN').map(a=>a.field));
 for(const row of rows){const columns=Object.keys(row);const values=columns.map(key=>booleans.has(key)&&row[key]!==null?Boolean(row[key]):row[key]);await sequelize.query('INSERT INTO '+quote(schema)+'.'+quote(table)+' ('+columns.map(quote).join(',')+') VALUES('+values.map((_,i)=>'$'+(i+1)).join(',')+')',{bind:values,transaction});}
 const id=model.rawAttributes.id;if(id?.autoIncrement){const qualified=quote(schema)+'.'+quote(table);await sequelize.query('SELECT setval(pg_get_serial_sequence($1,$2),GREATEST(COALESCE((SELECT MAX('+quote(id.field)+') FROM '+qualified+'),0),1),(SELECT COUNT(*)>0 FROM '+qualified+'))',{bind:[qualified,id.field],transaction});}const count=await model.count({transaction});if(count!==rows.length)throw new Error('Row count mismatch in '+table);total+=count;console.log(table+': '+count+' rows verified');}
 await sequelize.query('SET CONSTRAINTS ALL IMMEDIATE',{transaction});for(const constraint of constraints){const mode=constraint.condeferrable?'DEFERRABLE INITIALLY '+(constraint.condeferred?'DEFERRED':'IMMEDIATE'):'NOT DEFERRABLE';await sequelize.query('ALTER TABLE '+quote(schema)+'.'+quote(constraint.relname)+' ALTER CONSTRAINT '+quote(constraint.conname)+' '+mode,{transaction});}console.log(schema+': '+total+' rows migrated; foreign keys validated');
 });
 }finally{sqlite.close();await sequelize.close();}})().catch(error=>{console.error(error.message);process.exit(1)});

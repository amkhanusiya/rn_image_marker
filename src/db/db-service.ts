import {
  enablePromise,
  openDatabase,
  SQLiteDatabase,
} from 'react-native-sqlite-storage';
import {Rectangle} from './../state/Rectangle';

const tableName = 'images';
enablePromise(true);

export const getDBConnection = async () => {
  return openDatabase({name: 'images-annotation.db', location: 'default'});
};

export const createTable = async (db: SQLiteDatabase) => {
  const createQuery =
    'CREATE TABLE IF NOT EXISTS ' +
    tableName +
    '(name TEXT NOT NULL,path TEXT NOT NULL,markers TEXT NOT NULL)';
  await db.executeSql(createQuery);
};

export const saveImage = async (
  db: SQLiteDatabase,
  name: String,
  rectangles: Rectangle[],
  imagePath: String,
) => {
  const imageData = await getImageByName(db, name);
  console.log('stored image data => ', imageData);
  const annotationArray = JSON.stringify(rectangles);
  let query;
  if (imageData) {
    query = `update ${tableName} set markers='${annotationArray}' where name='${name}' `;
  } else {
    query = `INSERT INTO ${tableName}(name,path,markers)
        values('${name}','${imagePath}','${annotationArray}')`;
  }

  console.log(query);
  return db.executeSql(query);
};

export const getAllImages = async (db: SQLiteDatabase) => {
  const query = `select * from ${tableName}`;
  const results = await db.executeSql(query);
  const images = [];
  results.forEach(result => {
    for (let index = 0; index < result.rows.length; index++) {
      const item = result.rows.item(index);
      images.push(item);
    }
  });
  return images;
};

const getImageByName = async (db: SQLiteDatabase, name: String) => {
  const query = `select * from ${tableName} where name='${name}' limit 1`;
  const results = await db.executeSql(query);
  if (results && results[0].rows) {
    const data = results[0].rows.item(0);
    return data;
  }
  return null;
};

const gc = require('../config')
const bucket = gc.bucket('cdn.onedayonly.co.za');
import { logAt, levels } from '../log';
import fs from "fs";

const uploadImage = (fileName) => new Promise((resolve, reject) => {

  logAt(levels.info, `GCP upload image request for ${fileName}`);
 
  const file = bucket.file(fileName.replace(/ /g, "_"))

  file.name = `mailers/2020/${file.name}`; //TODO: config out the dates

  const uploadUrl = `https://cdn.onedayonly.co.za/${file.name}`;

  fs.createReadStream(`./assets/${fileName}`)
  .pipe(file.createWriteStream({
    metadata: {
      contentType: 'image/jpeg',
      metadata: {
        custom: 'metadata'
      }
    }
  }))
  .on('error', function(err) {
    console.log(`ERR: ${err}`);
    logAt(levels.error, `GCP upload image FAILURE for ${fileName} with ERROR: ${err}`);
    resolve();
  })
  .on('finish', function() {
    logAt(levels.info, `GCP upload image SUCCESS for ${uploadUrl}`);
    resolve();
  });

})

export default uploadImage;
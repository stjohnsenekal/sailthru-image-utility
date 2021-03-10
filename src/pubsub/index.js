
import { logAt, levels } from '../log';
import 'dotenv/config';
import redis from 'redis';
import fs from "fs";
import bakeImage from "../image/bake.mjs";
import uploadImage from '../helpers/gcp.js';

const startConsumer = () => {

  const consumer = redis.createClient({
    port: process.env.REDIS_PORT,
    host: process.env.REDIS_HOST
  });

  consumer.on('ready', function () {

    const subscriptions = JSON.parse(process.env.SUBSCRIPTIONS);
    for(let item of subscriptions) {
      consumer.subscribe(item);
    }

  });

  consumer.on('message', function (channel, message) {
    logAt(levels.info, `channel ${channel} consumer received message:  ${message}.`);
    switch(channel) {
      case "image-request":

        const packet = JSON.parse(message);
        const imageToUpload = `${packet.productId}.${packet.type}.${packet.random}.jpg`;

        (async function() {
          let imageBuffer;

          if(packet.isBestSeller == true) {
            // special case best seller pill
            imageBuffer = await bakeImage(packet.url, packet.hasLunch, 190 * 5, 
              packet.savings, "BEST SELLER", packet.isLandscape, packet.multiplier, "#FF7D00",  "#FFFFFF", true);
          } else if (parseInt(packet.priority) == 0) { 
            // main image must have no pill per marketing
            const size = (packet.isLandscape ? 350 : 950);
            logAt(levels.info, `Banner ${packet.type} - landscape: ${packet.isLandscape}, size: ${size}.`);
            imageBuffer = await bakeImage(packet.url, packet.hasLunch, size, 
              packet.savings, "", packet.isLandscape, packet.multiplier);
          } else { // default case including pills
            imageBuffer = await bakeImage(packet.url, packet.hasLunch, 190 * 5, 
              packet.savings, packet.pill.toUpperCase(), packet.isLandscape, packet.multiplier);
          }

          fs.writeFileSync(`./assets/${imageToUpload}`, imageBuffer); 

          uploadImage(imageToUpload).then(() => {
            fs.unlinkSync(`./assets/${imageToUpload}`);
            logAt(levels.info, `Deleted processed image ./assets/${imageToUpload}`);
          })
          
        }());
        
        break;

      default:
        logAt(levels.error, `channel ${channel} unrecognized:  ${message}.`);
        break;
    }
});

  consumer.on('subscribe', function (channel, count) {
    logAt(levels.info, `consumer subscribed to the ${channel} channel at ${count} total.`);
  });

  consumer.on('unsubscribe', function (channel, count) {
    logAt(levels.info, `consumer unsubscribed to the ${channel} channel at ${count} total.`);
  });

}

export { startConsumer };
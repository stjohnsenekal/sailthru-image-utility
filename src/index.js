import 'dotenv/config'; 
import { logAt, levels } from './log';
import { startConsumer } from './pubsub/index.js';

logAt(levels.info, "ODO SAILTHRU IMAGE MANIPULATION SERVICE booted up");

startConsumer();


/* TEST CODE

import redis from 'redis';

const publisher = redis.createClient({
  port: process.env.REDIS_PORT,
  host: process.env.REDIS_HOST
});

const artifact = {
  productId: "1112342",
  type: "email_365x365",
  url: "https://cdni.onedayonly.co.za/catalog/product/159/465/1594658368.897.jpeg?auto=compress&bg=fff&fit=fill&h=800&w=800",
  savings: "29%",
  pill: "MORE OPTIONS"
};

setTimeout(function() {
  publisher.publish("image-request", JSON.stringify(artifact));
}, 2000);

*/

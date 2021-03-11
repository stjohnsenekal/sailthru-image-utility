import fs from "fs";
import bakeImage from "../src/image/bake.mjs";

const imageUrl =
  "https://cdni.onedayonly.co.za/catalog/product/161/397/1613974954.4587.jpeg?h=240&w=240&bg=fff&fit=fill";

(async function() {

  //all other images generated test
  // const imageBuffer = await bakeImage(imageUrl, false, 190*5, "50%", "BEST SELLER", false, 1, "#FF7D00",  "#FFFFFF", true);

  const imageBuffer = await bakeImage(imageUrl, false, 190*5, "50%", "BEST SELLER", false, 1, "#FF7D00",  "#FFFFFF", true);

  fs.writeFileSync("./test/test-3col.jpg", imageBuffer);


}());


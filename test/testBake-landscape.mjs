import fs from "fs";
import bakeImage from "../src/image/bake.mjs";

  const imageUrlLandscape = "https://cdni.onedayonly.co.za/catalog/product/160/708/1607084830.068.jpeg?h=auto&w=750&bg=fff&fit=fill";

(async function() {

  //landscape morning mailer test
  const imageBuffer = await bakeImage(imageUrlLandscape, false, 350, "50%", "", true, 1);

  fs.writeFileSync("./test/test-landscape.jpg", imageBuffer);


}());



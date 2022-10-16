import sdk from "./1-initialize-sdk.js";
import { readFileSync } from "fs";

const EditionDrop = sdk.getEditionDrop("0x51d479D93D413a006677f82e55e7abbd7Dd985D4");

(async () => {

    try {
        await EditionDrop.createBatch([
            {
                name: "Spiderman NFT",
                description: "This NFT will give access to Marvels Dao",
                image: readFileSync("scripts/assets/spiderman.jpg")

            }
        ])
        console.log("😎Succesfly Added Spiderman Nft in the dao");
    }
    catch (error) {
        console.log(error);
    }
})()
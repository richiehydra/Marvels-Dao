import {AddressZero} from "@ethersproject/constants"
import sdk from "./1-initialize-sdk.js"
import {readFileSync} from "fs";
;
(async()=>
{
try
{
    const EditionDropAddress=await sdk.deployer.deployEditionDrop(
        {
            name:"Marvels Dao",
            description:"A Dao for Marvels Fans",
            image:readFileSync("scripts/assets/marvels.jpg"),
            primary_sale_recipient:AddressZero
        }
    )

    const editionDrop=await sdk.getEditionDrop(EditionDropAddress);
    const metadata=await editionDrop.metadata.get();
    console.log("✅😁The Metadata of Dao is :",metadata);
    console.log("✅😘The address of EditionDrop is:",EditionDropAddress);
}
catch(err)
{
    console.log(err);
}
})()
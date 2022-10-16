import sdk from  "./1-initialize-sdk.js"

const EditionDrop=sdk.getEditionDrop("0x51d479D93D413a006677f82e55e7abbd7Dd985D4");
(async()=>
{
   try{ const ClaimCondition=[
        {
            startTime:new Date(),
            price:0,
            maxQuantity:50_000,
        }
    ]
        EditionDrop.claimConditions.set("0",ClaimCondition);
        console.log("✅Claimed Conditions For Spiderman NFT")
}
catch(error)
{
    console.log(error);
}


})()
import sdk from "./1-initialize-sdk.js"
import { AddressZero } from "@ethersproject/constants";

(async () => {

    try {
        const tokenAddress = await sdk.deployer.deployToken({
            name: "Hydra Token",
            symbol: "HT",
            primary_sale_recipient: AddressZero
        })
        console.log("✅😎SuccesFully Created A Token at ", tokenAddress);
    }
    catch (err) {
        console.log(err)
    }

})()
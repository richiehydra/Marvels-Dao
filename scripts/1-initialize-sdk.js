import { ThirdwebSDK } from "@thirdweb-dev/sdk";
import ethers from "ethers";
import dotenv from "dotenv";
dotenv.config();

if (!process.env.ALCHEMY_API_URL || !process.env.PRIVATE_KEY || !process.env.WALLET_ADDRESS) {
    console.log("😑Didnt Get All the Credentials");
}

const provider = new ethers.providers.JsonRpcProvider(process.env.ALCHEMY_API_URL);
const wallet = new ethers.Wallet(process.env.PRIVATE_KEY, provider);
const sdk = new ThirdwebSDK(wallet);

(async () => {
    try {
        const address = await sdk.getSigner().getAddress();
        console.log("😁✅The Sdk is initialized With the Address:", address);

    }
    catch (err) {
       console.log("👎SDK is not initialized");
    }
})()
export default sdk;
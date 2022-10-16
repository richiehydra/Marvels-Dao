import sdk from "./1-initialize-sdk.js";

const vote = sdk.getVote("0x7Dfbef8c0D394041827BAd3EBC00B85F295140Ae");
const token = sdk.getToken("0x4F4d41ACcFe9845E81219785f2088275cA5d0cF1");

(async () => {
    try {
        await token.roles.grant("minter", vote.getAddress());

        console.log(
            "Successfully gave vote contract permissions to act on token contract"
        );
    } catch (error) {
        console.error(
            "failed to grant vote contract permissions on token contract",
            error
        );
        process.exit(1);
    }

    try {
        const ownedTokenBalance = await token.balanceOf(
            process.env.WALLET_ADDRESS
        );

        const ownedAmount = ownedTokenBalance.displayValue;
        const percent90 = Number(ownedAmount) / 100 * 90;
        await token.transfer(
            vote.getAddress(),
            percent90
        );

        console.log("✅ Successfully transferred " + percent90 + " tokens to vote contract");
    } catch (err) {
        console.error("failed to transfer tokens to vote contract", err);
    }
})();

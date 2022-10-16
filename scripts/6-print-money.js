import sdk from "./1-initialize-sdk.js";

const token = sdk.getToken("0x4F4d41ACcFe9845E81219785f2088275cA5d0cF1");

(async () => {
  try {
    const amount = 1_000_000;

    await token.mintToSelf(amount);
    const totalSupply = await token.totalSupply();

    console.log(
      "✅ There now is",
      totalSupply.displayValue,
      "$W3W in circulation"
    );
  } catch (error) {
    console.error("Failed to print money", error);
  }
})();
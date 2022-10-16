import sdk from "./1-initialize-sdk.js"

(async () => {
    try {
        const voterContractAddress = await sdk.deployer.deployVote(
            {
                name: "A Fighting Proposal",
                voting_token_address:"0x4F4d41ACcFe9845E81219785f2088275cA5d0cF1",
                voting_delay_in_blocks: 0,
                voting_period_in_blocks: 6570,
                voting_quorum_fraction: 0,
                proposal_token_threshold: 0
            }
        )
        console.log("😎😎The Contract Of Deploying vote id Done at:",voterContractAddress);
    }
    catch(error)
    {
        console.log(error);
    }
})()

import { useState, useEffect } from 'react';
import { useAddress, useMetamask, useEditionDrop, useToken, useVote,useNetwork } from '@thirdweb-dev/react';
import { ChainId } from '@thirdweb-dev/react';

const App = () => {
  // Use the hooks thirdweb give us.
  const [proposals, setProposals] = useState([]);
const [isVoting, setIsVoting] = useState(false);
const [hasVoted, setHasVoted] = useState(false);
 const token=useToken("0x4F4d41ACcFe9845E81219785f2088275cA5d0cF1");
   const network=useNetwork();


  const address = useAddress();
  const connectWithMetamask = useMetamask();
  console.log("👋 Address:", address);

  // Initialize our editionDrop contract
  const editionDrop = useEditionDrop("0x51d479D93D413a006677f82e55e7abbd7Dd985D4");
  // State variable for us to know if user has our NFT.
  const [hasClaimedNFT, setHasClaimedNFT] = useState(false);
  // isClaiming lets us easily keep a loading state while the NFT is minting.
  const [isClaiming, setIsClaiming] = useState(false);
  const vote=useVote("0x7Dfbef8c0D394041827BAd3EBC00B85F295140Ae");

  useEffect(() => {
    // If they don't have an connected wallet, exit!
    if (!address) {
      return;
    }

    const checkBalance = async () => {
      try {
        const balance = await editionDrop.balanceOf(address, 0);
        if (balance.gt(0)) {
          setHasClaimedNFT(true);
          console.log("🌟 this user has a membership NFT!");
        } else {
          setHasClaimedNFT(false);
          console.log("😭 this user doesn't have a membership NFT.");
        }
      } catch (error) {
        setHasClaimedNFT(false);
        console.error("Failed to get balance", error);
      }
    };
    checkBalance();
  }, [address, editionDrop]);

  const mintNft = async () => {
    try {
      setIsClaiming(true);
      await editionDrop.claim("0", 1);
      console.log(`🌊 Successfully Minted! Check it out on OpenSea: https://testnets.opensea.io/assets/${editionDrop.getAddress()}/0`);
      setHasClaimedNFT(true);
    } catch (error) {
      setHasClaimedNFT(false);
      console.error("Failed to mint NFT", error);
    } finally {
      setIsClaiming(false);
    }
  };
  useEffect(() => {
    if (!hasClaimedNFT) {
      return;
    }
  
    const getAllProposals = async () => {
      try {
        const proposals = await vote.getAll();
        setProposals(proposals);
        console.log(" Proposals:", proposals);
      } catch (error) {
        console.log("failed to get proposals", error);
      }
    };
    getAllProposals();
  }, [hasClaimedNFT, vote]);
  
  useEffect(() => {
    if (!hasClaimedNFT) {
      return;
    }
  
    if (!proposals.length) {
      return;
    }
  
    const checkIfUserHasVoted = async () => {
      try {
        const hasVoted = await vote.hasVoted(proposals[0].proposalId, address);
        setHasVoted(hasVoted);
        if (hasVoted) {
          console.log("🥵 User has already voted");
        } else {
          console.log("🙂 User has not voted yet");
        }
      } catch (error) {
        console.error("Failed to check if the wallet has voted", error);
      }
    };
    checkIfUserHasVoted();
  
  }, [hasClaimedNFT, proposals, address, vote]);
  

  // This is the case where the user hasn't connected their wallet
  // to your web app. Let them call connectWallet.
  if (address && (network?.[0].data.chain.id !== ChainId.Goerli)) {
    return (
      <div className="unsupported-network">
        <h2>Please connect to Goerli</h2>
        <p>
          This dapp only works on the Goerli network. Please switch networks
          in your connected wallet.
        </p>
      </div>
    );
  }
  
  if (!address) {
    return (
      <div className="landing">
        <h1>Welcome to Marvel DAO</h1>
        <button onClick={connectWithMetamask} className="btn-hero">
          Connect your wallet
        </button>
      </div>
    );
  }

  // Render mint nft screen.
  if(!hasClaimedNFT)
  {
  return (
    <div className="mint-nft">
      <h1>Mint your free 🍪DAO Membership NFT</h1>
      <button
        disabled={isClaiming}
        onClick={mintNft}
      >
        {isClaiming ? "Minting..." : "Mint your nft (FREE)"}
      </button>
    </div>
  );
  }

  if(hasClaimedNFT)
  {
    return (
      <div className="member-page">
      <h1>🍪DAO Member Page</h1>
      <p>Congratulations on being a member</p>
      <div>
        
        <div>
          <h2>Active Proposals</h2>
          <form
            onSubmit={async (e) => {
              e.preventDefault();
              e.stopPropagation();

              //before we do async things, we want to disable the button to prevent double clicks
              setIsVoting(true);

              // lets get the votes from the form for the values
              const votes = proposals.map((proposal) => {
                const voteResult = {
                  proposalId: proposal.proposalId,
                  //abstain by default
                  vote: 2,
                };
                proposal.votes.forEach((vote) => {
                  const elem = document.getElementById(
                    proposal.proposalId + "-" + vote.type
                  );

                  if (elem.checked) {
                    voteResult.vote = vote.type;
                    return;
                  }
                });
                return voteResult;
              });

              // first we need to make sure the user delegates their token to vote
              try {
                //we'll check if the wallet still needs to delegate their tokens before they can vote
                const delegation = await token.getDelegationOf(address);
                // if the delegation is the 0x0 address that means they have not delegated their governance tokens yet
                
                // then we need to vote on the proposals
                try {
                  await Promise.all(
                    votes.map(async ({ proposalId, vote: _vote }) => {
                      // before voting we first need to check whether the proposal is open for voting
                      // we first need to get the latest state of the proposal
                      const proposal = await vote.get(proposalId);
                      // then we check if the proposal is open for voting (state === 1 means it is open)
                      if (proposal.state === 1) {
                        // if it is open for voting, we'll vote on it
                        return vote.vote(proposalId, _vote);
                      }
                      // if the proposal is not open for voting we just return nothing, letting us continue
                      return;
                    })
                  );
                  try {
                    // if any of the propsals are ready to be executed we'll need to execute them
                    // a proposal is ready to be executed if it is in state 4
                    await Promise.all(
                      votes.map(async ({ proposalId }) => {
                        // we'll first get the latest state of the proposal again, since we may have just voted before
                        const proposal = await vote.get(proposalId);

                        //if the state is in state 4 (meaning that it is ready to be executed), we'll execute the proposal
                        if (proposal.state === 4) {
                          return vote.execute(proposalId);
                        }
                      })
                    );
                    // if we get here that means we successfully voted, so let's set the "hasVoted" state to true
                    setHasVoted(true);
                    // and log out a success message
                    console.log("successfully voted");
                  } catch (err) {
                    console.error("failed to execute votes", err);
                  }
                } catch (err) {
                  console.error("failed to vote", err);
                }
              } catch (err) {
                console.error("failed to delegate tokens");
              } finally {
                // in *either* case we need to set the isVoting state to false to enable the button again
                setIsVoting(false);
              }
            }}
          >
            {proposals.map((proposal) => (
              <div key={proposal.proposalId} className="card">
                <h5>{proposal.description}</h5>
                <div>
                  {proposal.votes.map(({ type, label }) => (
                    <div key={type}>
                      <input
                        type="radio"
                        id={proposal.proposalId + "-" + type}
                        name={proposal.proposalId}
                        value={type}
                        //default the "abstain" vote to checked
                        defaultChecked={type === 2}
                      />
                      <label htmlFor={proposal.proposalId + "-" + type}>
                        {label}
                      </label>
                    </div>
                  ))}
                </div>
              </div>
            ))}
            <button disabled={isVoting || hasVoted} type="submit">
              {isVoting
                ? "Voting..."
                : hasVoted
                  ? "You Already Voted"
                  : "Submit Votes"}
            </button>
            {!hasVoted && (
              <small>
                This will trigger multiple transactions that you will need to
                sign.
              </small>
            )}
          </form>
        </div>
      </div>
    </div>
    )
  }
}

export default App;
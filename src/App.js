import "./styles/App.css";
import twitterLogo from "./assets/twitter-logo.svg";
import React, { useEffect, useState } from "react";
import { ethers } from "ethers";
import myEpicNFT from "./utils/MyEpicNFT.json";
import convertToNFT from "./utils/ConvertToNFT.json";

// Constants
const TWITTER_HANDLE = "_buildspace";
const TWITTER_LINK = `https://twitter.com/${TWITTER_HANDLE}`;
const OPENSEA_LINK = "";
const TOTAL_MINT_COUNT = 50;

const App = () => {
  const [currentAccount, setCurrentAccount] = useState();
  const [wallet, setWallet] = useState(true);
  const [accountConnected, setAccountConnected] = useState(false);
  const [nftUrls, setNftUrls] = useState([]);
  const [mintNft, setMintNft] = useState(false);

  const checkIfWalletIsConnected = async () => {
    const { ethereum } = window;

    if (!ethereum) {
      console.log("Make sure you have metamask!");
      setWallet(false);
      return;
    } else {
      console.log("We have the ethereum object", ethereum);
      setAccountConnected(ethereum._state.isConnected);
    }

    // Check if we are authorised to access the user wallet

    const accounts = await ethereum.request({ method: "eth_accounts" });

    if (accounts.length !== 0) {
      const account = accounts[0];
      console.log("Found an authorized account:", account);
      setCurrentAccount(account);
    } else {
      console.log("No authorized account found");
    }
  };

  /*
   * Implement your connectWallet method here
   */

  const connectWallet = async () => {
    try {
      const { ethereum } = window;

      if (!ethereum) {
        console.alert("Get Metamask!");
        window.open("https://metamask.io/download/", "_blank").focus();
        return;
      }

      let chainId = await ethereum.request({ method: "eth_chainId" });
      console.log("Connected to chain " + chainId);

      // String, hex code of the chainId of the Rinkebey test network
      const rinkebyChainId = "0x4";
      if (chainId !== rinkebyChainId) {
        alert("You are not connected to the Rinkeby Test Network!");
      }

      // Check if we are authorised to access the user wallet

      const accounts = await ethereum.request({
        method: "eth_requestAccounts"
      });

      /*
       * Boom! This should print out public address once we authorize Metamask.
       */
      console.log("Connected", accounts[0], ethereum._state);
      setAccountConnected(ethereum._state.isConnected);
      setCurrentAccount(accounts[0]);
    } catch (error) {
      console.log(error);
    }
  };

  const askContractToMintNft = async () => {
    const CONTRACT_ADDRESS = "0x2CD75a9E8f1cCc096cE24F08bdAe0DeAE443134c";

    try {
      const { ethereum } = window;

      if (ethereum) {
        const provider = new ethers.providers.Web3Provider(ethereum);
        const signer = provider.getSigner();
        const connectedContract = new ethers.Contract(
          CONTRACT_ADDRESS,
          convertToNFT.abi,
          signer
        );

        console.log("Going to pop wallet now to pay gas");
        let nftTxn = await connectedContract.makeAnEpicNFT(
          "https://cloudflare-ipfs.com/ipfs/Qmbc9V13DR8d58xXnCT2oW2t2eHUk6imr1xk6yQACeWwoM",
          "My Signature",
          "First NFT"
        );

        console.log("Mining...please wait.");
        setMintNft(true);
        await nftTxn.wait();

        console.log(
          `Mined, see transaction: https://rinkeby.etherscan.io/tx/${nftTxn.hash}`
        );

        connectedContract.on("NewEpicNFTMinted", (from, tokenId) => {
          console.log(from, tokenId.toNumber());
          console.log(
            `Hey there! We've minted your NFT. It may be blank right now. It can take a max of 10 min to show up on OpenSea. Here's the link: <https://testnets.opensea.io/assets/${CONTRACT_ADDRESS}/${tokenId.toNumber()}>`
          );
          setNftUrls([
            ...nftUrls,
            `https://testnets.opensea.io/assets/${CONTRACT_ADDRESS}/${tokenId.toNumber()}`
          ]);
        });
      } else {
        console.log("Ethereum object does not exist");
      }
    } catch (error) {}
  };

  useEffect(() => {
    checkIfWalletIsConnected();
  }, []);

  return (
    <div className="App">
      <div className="container">
        <div className="header-container">
          <p className="header gradient-text">My NFT Collection</p>
          <p className="sub-text">
            Each unique. Each beautiful. Discover your NFT today.
          </p>
          {!accountConnected ? (
            wallet ? (
              <button
                className="cta-button connect-wallet-button"
                onClick={() => connectWallet()}
              >
                Connect to Wallet
              </button>
            ) : (
              <button
                className="cta-button connect-wallet-button"
                onClick={() =>
                  window.open("https://metamask.io/download/", "_blank").focus()
                }
              >
                Download Metamask
              </button>
            )
          ) : (
            <button
              className="cta-button connect-wallet-button"
              onClick={() => askContractToMintNft()}
            >
              {mintNft ? "Minting NFTs" : "Mint NFTs"}
            </button>
          )}
          <div>
            {nftUrls.length !== 0
              ? nftUrls.map((url, i) => (
                  <button
                    className="cta-button connect-wallet-button"
                    key={i}
                    onClick={() => window.open(url, "_blank")}
                  >
                    {`NFT ${i + 1}`}
                  </button>
                ))
              : mintNft && (
                  <button className="cta-button connect-wallet-button">
                    Mining NFTs...Please Wait
                  </button>
                )}
          </div>
        </div>
        <div className="footer-container">
          <img alt="Twitter Logo" className="twitter-logo" src={twitterLogo} />
          <a
            className="footer-text"
            href={TWITTER_LINK}
            target="_blank"
            rel="noreferrer"
          >{`built on @${TWITTER_HANDLE}`}</a>
        </div>
      </div>
    </div>
  );
};

export default App;

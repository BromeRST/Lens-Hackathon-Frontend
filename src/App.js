import abi from "./utils/contractABI.json";
import Login from "./components/Login.tsx";
import Notify from "bnc-notify";
import { ethers } from "ethers";
import { useState, useEffect } from "react";
import { useSigner } from "./context/signer.tsx";
import { main } from "./nftStorageAPI";

const contractAddress = "0x9132dc34c978C67E045B6d9B4b1edED9941e5858";

function App() {

  const [mumbaiProvider, setMumbaiProvider] = useState(null);
  const [thisContract, setThisContract] = useState(null);
  const [idForBalance, setIdForBalance] = useState(null);
  const [daysToMint, setDaysToMint] = useState(null);
  const [mintCap, setMintCap] = useState(null);
  const [NFTMinted, setNFTMinted] = useState(null);
  const [notify, setNotify] = useState(null);
  const [nftIdGenerated, setNftIdGenerated] = useState(null);
  const [name, setName] = useState(null);
  const [description, setDescription] = useState(null);
  const [image, setImage] = useState(null);
  const [myURI, setMyURI] = useState(null);
  const [firstTrait, setFirstTrait] = useState(null);
  const [firstTraitValue, setFirstTraitValue] = useState(null);
  const [secondTrait, setSecondTrait] = useState(null);
  const [secondTraitValue, setSecondTraitValue] = useState(null);


  const { signer, provider, signerAddress } = useSigner();

  const generateNFT = async () => {
    if (signerAddress) {
      const uri = await main(name, description, image, firstTrait, firstTraitValue, secondTrait, secondTraitValue);
      console.log(uri, "here")
      const tx = await thisContract.generateNFT(daysToMint * 86400, mintCap, uri);
      notify.hash(tx.hash);
      const rc = await tx.wait();
      const event = rc.events.find(event => event.event === 'IDCreated');
      const [_id] = event.args;
      setNftIdGenerated(parseInt(ethers.utils.formatUnits(_id, 0)));
    }
  }

  const balanceOfSigner = async () => {
    if (signerAddress) {
      const tx = await thisContract.balanceOf(signerAddress, idForBalance);
      notify.hash(tx.hash);
      // await tx.wait();
      console.log(tx);
    }
  }

  const mint = async () => {
    if (signerAddress) {
      const tx = await thisContract.mint(idForBalance);
      notify.hash(tx.hash);
      // await tx.wait();
      console.log(tx);
    }
  }

  // const setUri = async () => {
  //   if (signerAddress) {
  //     const tx = await thisContract.setUri(nftIdGenerated, myURI);
  //     notify.hash(tx.hash);
  //     // await tx.wait();
  //     console.log(tx);
  //   }
  // }

  const nftMinted = async () => {
    if (signerAddress) {
      const tx = await thisContract.getCountForId(idForBalance);
      notify.hash(tx.hash);
      // await tx.wait();
      setNFTMinted(parseInt(ethers.utils.formatUnits(tx, 0)));
    }
  }

  const handleIdInsert = (e) => {
    setIdForBalance(e.target.value);
  }

  const handleDaysToMint = (e) => {
    setDaysToMint(e.target.value);
  }

  const handleMintCap = (e) => {
    setMintCap(e.target.value);
  }

  const handleName = (e) => {
    setName(e.target.value);
  }

  const handleDescription = (e) => {
    setDescription(e.target.value);
  }

  const readFiles = (event) => {
    const [file] = event.target.files;
    setImage(file);
  };

  // const handleURI = () => {
  //   main(name, description, image, firstTrait, firstTraitValue, secondTrait, secondTraitValue);
  // }

  const handleFirstTrait = (e) => {
    setFirstTrait(e.target.value);
  }

  const handleFirstTraitValue = (e) => {
    setFirstTraitValue(e.target.value);
  }

  const handleSecondTrait = (e) => {
    setSecondTrait(e.target.value);
  }

  const handleSecondTraitValue = (e) => {
    setSecondTraitValue(e.target.value);
  }

  // const handleMyURI = (e) => {
  //   setMyURI(e.target.value);
  // }

  useEffect(() => {
    const mProvider = new ethers.providers.JsonRpcProvider(
      "https://polygon-mumbai.g.alchemy.com/v2/SeyWmSZubocxNcqaWaiR--xe00RiT1ig"
    );
    setMumbaiProvider(mProvider);

    const initNotify = Notify({
      dappId: "682e29b1-cc78-4233-bd76-2dc200dda20c", // [String] The API key created by step one above
      networkId: 80001, // [Integer] The Ethereum network ID your Dapp uses.
    });
    setNotify(initNotify);
  }, []);


  useEffect(() => {
    if (signer || provider || mumbaiProvider) {
      setThisContract(
        new ethers.Contract(
          contractAddress,
          abi,
          signer || provider || mumbaiProvider
        )
      );
    }
  }, [provider, signer, mumbaiProvider]);

  return (
    <div>
      <Login />
      <div>
        <input type="number" placeholder="NFT id to check" onChange={handleIdInsert}/>
        <button onClick={balanceOfSigner}>your balance</button>
      </div>
      <div>
        <input type="number" placeholder="NFT id to mint" onChange={handleIdInsert}/>
        <button onClick={mint}>mint an nft</button>
      </div>
      <div>
        <input type="number" placeholder="put an id to check how many nft are minted" onChange={handleIdInsert}/>
        <button onClick={nftMinted}>check nft minted</button>
      </div>
      <p>NFT minted until now: {NFTMinted}</p>
      <p>NFT ID generated : {nftIdGenerated}</p>
      <div>
          <label htmlFor="nameInput">NFT name</label>
          <input
            type="text"
            placeholder="NFT name"
            id="nameInput"
            onChange={handleName}
          />
      </div>
      <div>
          <label htmlFor="description">NFT description</label>
          <input
            type="text"
            placeholder="NFT description"
            id="description"
            onChange={handleDescription}
          />
      </div>
      <p>Attributes:</p>
      <div>
          <label htmlFor="first-trait">First Trait</label>
          <input
            type="text"
            placeholder="name of the first trait"
            id="first-trait"
            onChange={handleFirstTrait}
          />
      </div>
      <div>
          <label htmlFor="first-trait-value">First Trait Value</label>
          <input
            type="text"
            placeholder="trait value"
            id="first-trait-value"
            onChange={handleFirstTraitValue}
          />
      </div>
      <div>
          <label htmlFor="second-trait">Second Trait</label>
          <input
            type="text"
            placeholder="name of the second trait"
            id="second trait-trait"
            onChange={handleSecondTrait}
          />
      </div>
      <div>
          <label htmlFor="second-trait-value">First Trait Value</label>
          <input
            type="text"
            placeholder="trait value"
            id="second-trait-value"
            onChange={handleSecondTraitValue}
          />
      </div>
      <div className="">
        <label htmlFor="fileInput">Image</label>
        <input type="file" onChange={readFiles} />
      </div>
      {/* <button onClick={handleURI}>generate URI</button> */}
      <div>
        <input type="number" placeholder="days for the open mint" onChange={handleDaysToMint}/>
        <input type="number" placeholder="mint cap" onChange={handleMintCap}/>
        <button onClick={generateNFT}>generate a new nft</button>
      </div>
      {/* <div>
        <input type="text" placeholder="put the nft uri here" onChange={handleMyURI}/>
        <button onClick={setUri}>set uri</button>
      </div> */}
    </div>
  )
}

export default App;
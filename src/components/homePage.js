// https://docs.metamask.io/guide/ethereum-provider.html#using-the-provider

import React, { useState, useEffect } from "react";
import { BigNumber, ethers } from "ethers";
import abi from "../contracts/abi.json";
const HomePage = () => {
  // deploy simple storage contract and paste deployed contract address here. This value is local ganache chain
  let contractAddress = "0xa7CCa0bBF8108a3F7ba3cC77f959de24031E4F9D";

  const [errorMessage, setErrorMessage] = useState(null);
  const [defaultAccount, setDefaultAccount] = useState(null);
  const [connButtonText, setConnButtonText] = useState("Connect Wallet");

  const [currentContractVal, setCurrentContractVal] = useState(null);

  const [provider, setProvider] = useState(null);
  const [signer, setSigner] = useState(null);
  const [contract, setContract] = useState(null);

  useEffect(() => {
    // declare the data fetching function
    const fetchData = async () => {
      if (window.ethereum && window.ethereum.isMetaMask) {
        try {
          const result = await window.ethereum.request({
            method: "eth_requestAccounts",
          });
          accountChangedHandler(result[0]);
          // setConnButtonText("Wallet Connected");
        } catch (error) {
          setErrorMessage(error.message);
        }
      } else {
        console.log("Need to install MetaMask");
        setErrorMessage(
          "Please install MetaMask browser extension to interact"
        );
      }
    };

    // call the function
    fetchData()
      // make sure to catch any error
      .catch(console.error);
  }, []);

  // update account, will cause component re-render
  const accountChangedHandler = (newAccount) => {
    setDefaultAccount(newAccount);
    updateEthers();
  };

  const chainChangedHandler = () => {
    // reload the page to avoid any errors with chain change mid use of application
    window.location.reload();
  };
  const updateContract = async () => {
    if(contract){
    // reload the page to avoid any errors with chain change mid use of application
    let count = await contract.getCanCount();
    count = count.toNumber();
    console.log(count);
    let candidate_arr = [];
    for (let i = 1; i <= count; i++) {
      let raw_candidate = await contract.candidates(i);
      let candidate = {
        id: raw_candidate.id.toNumber(),
        name: raw_candidate.name.toString(),
        voteCount: raw_candidate.voteCount.toNumber(),
      };
      candidate_arr.push(candidate)
    }

    console.log(candidate_arr);
  }
  };
  // listen for account changes

  useEffect(() => {
    async function listenAccountChange() {
      window.ethereum.on("accountsChanged", accountChangedHandler);
      window.ethereum.on("chainChanged", chainChangedHandler);

      console.log('update!')
    }
    listenAccountChange();
  });
console.log()
  useEffect(() => {
    if (contract != null) {
      updateContract();
    }
  },[contract]);
  useEffect(() => {
    if (provider) {
      provider.on("block", async(blockNumber) => {
        updateContract()
          })
    }
  });

  const updateEthers = async () => {
    let tempProvider = new ethers.providers.Web3Provider(window.ethereum);
    setProvider(tempProvider);

    let tempSigner = tempProvider.getSigner();
    setSigner(tempSigner);

    let tempContract = new ethers.Contract(contractAddress, abi, tempSigner);
    setContract(tempContract);
  };

  const setHandler = async(event) => {
    event.preventDefault();
    // console.log("sending " + event.target.setText.value + " to the contract");
    // contract.set(event.target.setText.value);
    // alert(event.target.setText.value);
    await contract.addCandidate(event.target.setText.value);
  };

  const getCurrentVal = async () => {
    let val = await contract.get();
    setCurrentContractVal(val);
  };

  return (
    <div>
      {/* <button onClick={connectWalletHandler}>{connButtonText}</button> */}
      <div>
        <h3>Address: {defaultAccount}</h3>
      </div>
      <form onSubmit={setHandler}>
        <input id="setText" type="text" />
        <button type={"submit"}> Update Contract </button>
      </form>
      {currentContractVal}
      {errorMessage}
    </div>
  );
};

export default HomePage;

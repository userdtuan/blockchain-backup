// import './App.css';
import Candidate from "./components/Candidate";
import Pie_Chart from "./components/PieChart";
import TableLeft from "./components/TableLeft";
import Transaction from "./components/Transaction";
import React, { useState, useEffect } from "react";
import { BigNumber, ethers } from "ethers";
import abi from "./contracts/abi.json";
import moment from "moment";

const App = () => {
  // deploy simple storage contract and paste deployed contract address here. This value is local ganache chain
  let contractAddress = "0xEc986f826009831DDD6D152F38d11D1fccB516Fb";

  const [errorMessage, setErrorMessage] = useState(null);
  const [defaultAccount, setDefaultAccount] = useState(null);
  const [currentContractVal, setCurrentContractVal] = useState(null);
  const [provider, setProvider] = useState(null);
  const [signer, setSigner] = useState(null);
  const [contract, setContract] = useState(null);
  const [balance, setBalance] = useState(null);
  const [blockNumber, setBlockNumber] = useState(null);
  const [listTransaction, setListTransaction] = useState(null);

  const [electArr, setElectArr] = useState(null);
  const [electID, setElectID] = useState(null);
  const [currentElect, setCurrentElect] = useState({});
  const [formedArr, setFormedArr] = useState([]);
  const [canName, setCanName] = useState({});
  const [canDes, setCanDes] = useState({});
  const [modal, setModal] = useState("");
  const [tempCanArr, setTempCanArr] = useState([1, 2]);
  const [chartVal, setChartVal] = useState(1048);
  const [none, setNone] = useState(false);
  const [styleBtn, setStyleBtn] = useState("btn-warning");
  const [voted, setVoted] = useState("false");
  const [expired, setExpired] = useState(null);
  const [canVotedID, setCanVotedID] = useState(null);
  const [visibleBtn, setVisibleBtn] = useState("invisible");
  const [visibleBtnExpired, setVisibleBtnExpired] = useState("invisible");
  useEffect(() => {
    const connectWalletHandler = async () => {
      if (window.ethereum && window.ethereum.isMetaMask) {
        try {
          const result = await window.ethereum.request({
            method: "eth_requestAccounts",
          });
          accountChangedHandler(result[0]);
        } catch (error) {
          setErrorMessage(error.message);
        }
      } else {
        alert("Need to install MetaMask");
        setErrorMessage(
          "Please install MetaMask browser extension to interact"
        );
      }
    };
    connectWalletHandler();
  }, []);

  // update account, will cause component re-render
  const accountChangedHandler = async (newAccount) => {
    setDefaultAccount(newAccount);
    updateEthers();
    // if (provider && ethers) {
    //   const balance = await provider.getBalance(newAccount.toString());
    //   setBalance(ethers.utils.formatEther(balance));
    // }
  };

  // listen for account changes
  useEffect(() => {
    async function listenAccountChange() {
      window.ethereum.on("accountsChanged", accountChangedHandler);
    }
    listenAccountChange();
  }, []);
  // useEffect(() => {
  //   if (contract != null) {
  //     console.log("contract update");
  //   }
  // }, [contract]);

  // useEffect(() => {
  //   updateBalance();
  // }, [defaultAccount]);
  useEffect(() => {
    if (provider && contract && defaultAccount) {
      provider.on("block", async (blockNumber) => {
        console.log("block update " + blockNumber);
        setBlockNumber(blockNumber);
        updateListElect();
        // updateBalance();
      });
    }
  }, [provider, contract, defaultAccount]);

  useEffect(() => {
    if (electID && contract) {
      updateListCan();
      updateButtonState();
    }
  }, [electID, contract, currentElect, electArr]);

  // const updateBalance = async () => {
  //   console.log("Outside");
  //   if (provider && defaultAccount != null && ethers) {
  //     console.log("Inside");
  //     const balance = await provider.getBalance(defaultAccount);
  //     console.log(balance);
  //     setBalance(ethers.utils.formatEther(balance));
  //   }
  // };

  const updateEthers = async () => {
    let tempProvider = new ethers.providers.Web3Provider(window.ethereum);
    setProvider(tempProvider);

    let tempSigner = tempProvider.getSigner();
    setSigner(tempSigner);

    let tempContract = new ethers.Contract(contractAddress, abi, tempSigner);
    setContract(tempContract);
  };
  const updateButtonState = async () => {
    if(electArr){
      console.log("calllllllled")
      console.log(electArr[electID].voted+"---"+electArr[electID].expired)
      if(electArr[electID].voted===false&&electArr[electID].expired===false){
        setVisibleBtn("visible")
      }
      else setVisibleBtn("invisible")
    }
  };
  /////////////////////////////////////////////////////
  const updateListCan = async () => {
    // console.log(`being call outside contract`);
    // console.log(contract);
    // console.log(currentElect);
    // console.log(electID);
    // console.log(`Thereeeeeeeeeeeeee is`);
    if (contract && currentElect) 
    {
      // reload the page to avoid any errors with chain change mid use of application
      let raw_arr = await contract.get_list_candidate_of_id(electID);
      // setArr(can_arr);
      let temp_arr = [];
      for (let i = 0; i < currentElect.canCount; i++) {
        // alert(can_arr[1][i])
        let tempCanArr = {
          id: raw_arr[0][i].toNumber(),
          value: raw_arr[2][i].toNumber(),
          name: raw_arr[1][i].toString(),
          description: raw_arr[3][i].toString(),
        };
        temp_arr.push(tempCanArr);
        // console.log(tempCanArr);
      }
      setFormedArr(temp_arr);
    }
  };
  const updateListElect = async () => {
    // reload the page to avoid any errors with chain change mid use of application
    let count = await contract.get_list_election_count();
    count = count.toNumber();
    // console.log(count);
    let election_list = [];
    // let list_vote_state = await contract.checkVotedToList();
    // console.log(list_vote_state)
    for (let i = 1; i <= count; i++) {
      let raw_election = await contract.election_info(i);
      let voted_state = await contract.check_vote_status(i);
      let election = {
        id: raw_election.id.toNumber(),
        owner: raw_election.owner.toString(),
        expired: raw_election.expired,
        question: raw_election.question.toString(),
        canCount: raw_election.canCount.toNumber(),
        description: raw_election.description.toString(),
        voted: voted_state,
      };
      election_list.push(election);
    }
    setElectArr(election_list);
    if(electID){
      setCurrentElect(election_list[electID])
    }
  };
  const handleAddMoreCan = () => {
    setTempCanArr((tempCanArr) => [
      ...tempCanArr,
      tempCanArr[tempCanArr.length - 1] + 1,
    ]);
  };
  const handleCanNameChange = (value) => {
    setCanName(value);
  };
  const handleCanDesChange = (value) => {
    setCanDes(value);
  };
  const expiredBtnHandle = async () => {
    await contract.set_expire(electID);
  };
  const VoteCandidatehandle = async () => {
    var closeBtn = document.getElementById("closeVote");
    closeBtn.click();
    if (canVotedID) {
      await contract.vote(canVotedID, currentElect.id);
    } else {
      alert("You must choose a candidate!!!");
    }
  };
  const handleAddSetOfElect = async (event) => {
    event.preventDefault();
    // event.target.setText.value
    setTempCanArr([1, 2]);
    let electName = event.target.electName.value;
    let electDes = event.target.electDes.value;
    const arr_name = Object.values(canName);
    const arr_des = Object.values(canDes);
    console.log(`(${electName}, ${electDes}, [${arr_name}], [${arr_des}])`);
    // handleCloseModal();
    var closeBtn = document.getElementById("hangoutButtonId");
    closeBtn.click();
    await contract.create_new_election(electName, electDes, arr_name, arr_des);
    clearForm();
  };
  function clearForm() {
    document.getElementById("electName").value = "";
    document.getElementById("electDes").value = "";
  }
  useEffect(() => {
    console.log(`electID changed to ${electID}`);
    console.log(`currentElect changed to ${currentElect}`);
  }, [electID, currentElect]);
  const handleElectIDChange = async (value) => {
    if (electArr) {
      setElectID(value);
      setCurrentElect(electArr[value - 1]);
      console.log("yours? " + checkIfYours(electArr[value - 1]));
      // setExpired(electArr[value - 1].expired);
      if (checkIfYours(electArr[value - 1]) && !electArr[value - 1].expired) {
        console.log("Can set Expired");
        setVisibleBtnExpired("");
      } else {
        setVisibleBtnExpired("invisible");
      }
      console.log(electArr[value - 1]);
    }
  };
  const VotedStateBtn = () => {
    // console.log(`show ${voted} and ${electID}`)

    return (
      <button
        type="button"
        className={`btn btn-success btn-sm ${visibleBtn}`}
        data-toggle="modal"
        data-target="#electionModal"
        data-whatever="@mdo"
        style={{ marginLeft: "3px" }}
      >
        Vote
      </button>
    );
  };
  const ExpiredStateBtn = () => {
    // console.log(`show ${voted} and ${electID}`)

    return (
      <button
        type="button"
        className={`btn btn-warning btn-sm ${visibleBtnExpired}`}
        style={{ marginLeft: "3px" }}
        onClick={expiredBtnHandle}
      >
        Set expired
      </button>
    );
  };

  const checkIfYours = (currentElector) => {
    if (currentElector) {
      let a = String(defaultAccount.toString());
      let b = String(currentElector.owner.toString());
      let an = a.charAt(a.length - 1);
      let bn = b.charAt(b.length - 1);
      an += a.charAt(a.length - 2);
      bn += b.charAt(b.length - 2);
      an += a.charAt(a.length - 3);
      bn += b.charAt(b.length - 3);
      an += a.charAt(a.length - 4);
      bn += b.charAt(b.length - 4);
      an = an.toLowerCase();
      bn = bn.toLowerCase();
      // console.log(an.localeCompare(bn))
      // console.log(an)
      // console.log(bn)
      if (an.localeCompare(bn) === 0) {
        return true;
        console.log(" Getiiiiiiin");
      } else return false;
    }
  };
  const updateListTransaction = async () => {
    if(ethers&&provider&&contract)
    {
    // let block = await provider.getBlock(blockNumber);
    // alert("block " + blockNumber);
    let temp_list_transaction = [];
    for (let i = blockNumber - 15; i <= blockNumber; i++) {
      let block = await provider.getBlock(i);

      //using time
      var parsed = moment.unix(block.timestamp);
      // console.log(parsed.toString()+"\n")
      // console.log(block.transactions[0]);
      let tx_hash = block.transactions[0];
      const inter = new ethers.utils.Interface(abi);
      // console.log(tx)
      let tx = await provider.getTransaction(tx_hash);
      try {
        // console.log(tx.data);
        const decodedInput = inter.parseTransaction({
          data: tx.data,
          value: tx.value,
        });
        console.log({
          function_name: decodedInput.name,
          // to: decodedInput.args[0],
          // erc20Value: Number(decodedInput.args[1]),
          data: decodedInput.args["_candidateId"]
        });
        temp_list_transaction.push({
          function_name: decodedInput.name,
          from: tx.from,
          // to: decodedInput.args[0],
          // erc20Value: Number(decodedInput.args[1]),
          data: decodedInput.args,
          tx_hash: block.hash,
          block_number: block.number,
          gas_used: String(block.gasUsed.toString()),
          date_create: parsed.toString(),
        });
        // console.log(decodedInput.args);
        // console.log(i)
      } catch (error) {
        // const decodedInput = inter.parseTransaction({
        //   data: tx
        // });
        // console.log(decodedInput)
      }
    }
    setListTransaction(temp_list_transaction);
  }};

  return (
    <div>
      <div
        className="jumbotron text-center"
        style={{ height: "150px", paddingTop: "30px" }}
      >
        <h1>Address: {defaultAccount}</h1>
        <h4>Your Balance: {balance} ETH</h4>
      </div>
      <nav>
        <div
          className="nav nav-tabs"
          id="nav-tab"
          role="tablist"
          style={{ paddingLeft: "10px" }}
        >
          <a
            className="nav-link active"
            id="nav-home-tab"
            data-toggle="tab"
            href="#nav-home"
            role="tab"
            aria-controls="nav-home"
            aria-selected="true"
          >
            Home
          </a>
          <a
            className="nav-link"
            id="nav-profile-tab"
            data-toggle="tab"
            href="#nav-profile"
            role="tab"
            aria-controls="nav-profile"
            aria-selected="false"
            onClick={updateListTransaction}
          >
            Transaction History
          </a>
        </div>
      </nav>
      <div
        className="tab-content"
        id="nav-tabContent"
        style={{ margin: "30px" }}
      >
        <div
          className="tab-pane fade show active"
          id="nav-home"
          role="tabpanel"
          aria-labelledby="nav-home-tab"
        >
          <div className="container-fluid">
            <div className="row">
              <div
                className="col-sm-6"
                style={{
                  height: "500px",
                }}
              >
                <div
                  className="row"
                  style={{
                    marginBottom: "15px",
                    marginLeft: "8px",
                    marginRight: "3px",
                  }}
                >
                  <h4>List of Elections</h4>
                  <button
                    type="button"
                    className="btn btn-primary btn-sm"
                    data-toggle="modal"
                    data-target="#exampleModal"
                    data-whatever="@mdo"
                    style={{ marginLeft: "3px" }}
                  >
                    add
                  </button>
                  <button
                    type="button"
                    className={`btn ${styleBtn} btn-sm`}
                    style={{ marginLeft: "3px" }}
                    onClick={() => {
                      setNone(!none);
                      styleBtn == "btn-warning"
                        ? setStyleBtn("btn-outline-warning")
                        : setStyleBtn("btn-warning");
                    }}
                  >
                    expired
                  </button>
                  <button
                    type="button"
                    className={`btn ${styleBtn} btn-sm`}
                    style={{ marginLeft: "3px" }}
                    onClick={async() => {
                      await contract.create_new_election("testName", "electDes", ["arr_name1","arr_name2"], ["arr_des1","arr_des2"]);
                    }}
                  >
                    quickly add
                  </button>
                  <button
                    type="button"
                    className={`btn ${styleBtn} btn-sm`}
                    style={{ marginLeft: "3px" }}
                    onClick={() => {
                      alert(`electID is ${electID}`)
                    }}
                  >
                    quickly add
                  </button>
                </div>
                <div className="mh-100 overflow-auto">
                  <TableLeft
                    electArr={electArr}
                    electID={electID}
                    handleElectIDChange={handleElectIDChange}
                    none={none}
                    owner={defaultAccount}
                    listCandidate={formedArr}
                  />
                </div>
              </div>
              <div
                className="col-sm-6"
                style={{
                  height: "500px",
                }}
              >
                <div className="mh-100 overflow-auto">
                  <Pie_Chart
                    chartVal={chartVal}
                    currentElect={currentElect}
                    formedArr={formedArr}
                  />
                  <div
                    className="row"
                    style={{
                      marginBottom: "15px",
                      marginLeft: "8px",
                      marginRight: "3px",
                    }}
                  >
                    <VotedStateBtn />
                    <ExpiredStateBtn />
                  </div>
                </div>
              </div>
            </div>
          </div>

          {currentContractVal}
          {errorMessage}
          <div
            className="modal fade"
            id="exampleModal"
            // tabindex="-1"
            role="dialog"
            aria-labelledby="exampleModalLabel"
            aria-hidden="true"
            show="true"
          >
            <div className="modal-dialog" role="document">
              <form onSubmit={handleAddSetOfElect}>
                <div className="modal-content">
                  <div className="modal-header">
                    <h5 className="modal-title" id="exampleModalLabel">
                      Create New Election
                    </h5>
                    <button
                      type="button"
                      className="close"
                      data-dismiss="modal"
                      aria-label="Close"
                    >
                      <span aria-hidden="true">&times;</span>
                    </button>
                  </div>
                  <div style={{ height: "620px" }}>
                    <div className="modal-body mh-100 overflow-auto">
                      <div className="form-group">
                        <label htmlFor="formGroupExampleInput">
                          Election Name
                        </label>
                        <input
                          required
                          type="text"
                          className="form-control"
                          id="electName"
                          placeholder=""
                        />
                      </div>
                      <div className="form-group">
                        <label htmlFor="formGroupExampleInput2">
                          Election Description
                        </label>
                        <input
                          required
                          type="text"
                          className="form-control"
                          id="electDes"
                        />
                      </div>
                      {tempCanArr.map((tempCan) => (
                        <Candidate
                          key={tempCan}
                          index={tempCan}
                          canName={canName}
                          canDes={canDes}
                          handleCanNameChange={handleCanNameChange}
                          handleCanDesChange={handleCanDesChange}
                        />
                      ))}
                      <div className="form-group">
                        <label htmlFor="formGroupExampleInput2">
                          <button
                            type="button"
                            className="btn btn-outline-primary btn-sm"
                            onClick={handleAddMoreCan}
                          >
                            add Candidate
                          </button>
                        </label>
                      </div>
                    </div>
                  </div>
                  <div className="modal-footer">
                    <button
                      id="hangoutButtonId"
                      type="button"
                      className="btn btn-secondary"
                      data-dismiss="modal"
                      onClick={() => {
                        setTempCanArr([1, 2]);
                      }}
                    >
                      Close
                    </button>
                    <button
                      type="submit"
                      className="btn btn-primary"
                      data-dismiss={modal}
                    >
                      Comfirm
                    </button>
                  </div>
                </div>
              </form>
            </div>
          </div>

          <div
            className="modal fade"
            id="electionModal"
            // tabindex="-1"
            role="dialog"
            aria-labelledby="exampleModalLabel"
            aria-hidden="true"
            show="true"
          >
            <div className="modal-dialog" role="document">
              <div className="modal-content">
                <div className="modal-header">
                  <h5 className="modal-title" id="exampleModalLabel">
                    New message
                  </h5>
                  <button
                    type="button"
                    className="close"
                    data-dismiss="modal"
                    aria-label="Close"
                  >
                    <span aria-hidden="true">&times;</span>
                  </button>
                </div>
                <div>
                  <div className="row">
                    <div className="col">
                      <div
                        className="list-group"
                        id="list-tab"
                        role="tablist"
                        style={{ margin: "10px" }}
                      >
                        {formedArr.map((can) => (
                          <a
                            key={can.id}
                            className="list-group-item list-group-item-action"
                            id="list-settings-list"
                            data-toggle="list"
                            href="#list-settings"
                            role="tab"
                            aria-controls="settings"
                            onClick={() => setCanVotedID(can.id)}
                          >
                            {can.name}
                          </a>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
                <div className="modal-footer">
                  <button
                    id="closeVote"
                    type="button"
                    className="btn btn-secondary"
                    data-dismiss="modal"
                  >
                    Close
                  </button>
                  <button
                    type="submit"
                    className="btn btn-primary"
                    data-dismiss={modal}
                    onClick={VoteCandidatehandle}
                  >
                    Vote this One!
                  </button>
                </div>
              </div>
            </div>
          </div>
          {/* <button
            type="submit"
            className="btn btn-info"
            data-dismiss={modal}
            onClick={updateListTransaction}
          >
            Test Function
          </button> */}
        </div>
        <div
          className="tab-pane fade"
          id="nav-profile"
          role="tabpanel"
          aria-labelledby="nav-profile-tab"
        >
          <div id="accordion">
            {listTransaction
              ? listTransaction.map((transaction) => (
                  <Transaction
                    key={Math.random()}
                    transaction={transaction}
                  />
                )).reverse()
              : ""}
          </div>
        </div>
      </div>
    </div>
  );
};

export default App;

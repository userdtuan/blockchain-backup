import React, { useState, useEffect } from "react";

export default function Transaction(props) {
  const [yours, setYours] = useState();
  const [colorText, setColorText] = useState("black");
  const [complete, setComplete] = useState(null);
  const [voteTransVisible, setVoteTransVisible] = useState("invisible");
  const [expiredTransVisible, setExpiredTransVisible] = useState("invisible");
  const [createTransVisible, setCreateTransVisible] = useState("invisible");
  const [colorBtn, setColorBtn] = useState("");
  const [listCandidate, setListCandidate] = useState([]);
  useEffect(() => {
    if (props.transaction) {
      if (props.transaction.function_name == "vote") {
        setColorText("rgb(0,143,48)");
        setColorBtn("badge-success")
        setVoteTransVisible("visible");
        // setPresentForValue(voteTrans)
      } else if (props.transaction.function_name == "set_expire") {
        setColorText("rgb(255,196,0)");
        setColorBtn("badge-warning")
        setExpiredTransVisible("visible");
      } else {
        setColorText("rgb(0,108,255)");
        setColorBtn("badge-primary")
        setCreateTransVisible("visible");
      }
    }
  }, [props.transaction]);

  const VoteTrans = (data) => {
    if (voteTransVisible === "visible") {
      return (
        <div className={voteTransVisible}>
          {/* {console.log(data.data[0])} */}
          {/* {console.log("CanID"+(data.data[0]).toNumber())}
          {console.log("ElectID"+(data.data[1]).toNumber())} */}
          {/* {console.log((data.data[0]))} */}
          {/* {data['_hex']} */}
          <p>
            Election ID:
            <span style={{ fontStyle: "italic", color: "rgb(251,0,138)" }}>
              {data.data[1].toNumber()}
            </span>
          </p>
          <p>
            Candidate ID:
            <span style={{ fontStyle: "italic", color: "rgb(251,0,138)" }}>
              {data.data[0].toNumber()}
            </span>
          </p>
        </div>
      );
    } else return null;
  };
  const CreateTrans = (data) => {
    if (createTransVisible === "visible") {
      return (
        <div className={createTransVisible}>
          {/* {console.log(data.data)} */}
          {/* {console.log("CanID"+(data.data[0]).toNumber())}
          {console.log("ElectID"+(data.data[1]).toNumber())}
          {/* {console.log((data.data[0]))} */}
          {/* {data['_hex']} */}
          <p>
            Election Name :
            <span style={{ fontStyle: "italic", color: "rgb(251,0,138)" }}>
              {data.data[0]}
            </span>
          </p>
          <p>
            Election Description :
            <span style={{ fontStyle: "italic", color: "rgb(251,0,138)" }}>
              {data.data[1]}
            </span>
          </p>
          {data.data[2].map((value, index) => (
            <div style={{ marginLeft: "0px" }} key={Math.random()}>
              <h4>
                <span className="badge badge-info">Candidate {index + 1}</span>
              </h4>
              <p>
                Candidate Name :
                <span style={{ fontStyle: "italic", color: "rgb(251,0,138)" }}>
                  {value}
                </span>
              </p>
              <p>
                Candidate Information :
                <span style={{ fontStyle: "italic", color: "rgb(251,0,138)" }}>
                  {data.data[3][index]}
                </span>
              </p>
            </div>
          ))}
        </div>
      );
    } else return null;
  };
  const ExpiredTrans = (data) => {
    if (expiredTransVisible === "visible") {
      return (
        <div className={expiredTransVisible}>
          {/* {console.log(data.data[0])} */}
          {console.log(data.data[0].toNumber())}
          {/* {console.log("ElectID" + data.data[1].toNumber())} */}
          {/* {console.log((data.data[0]))} */}
          {/* {data['_hex']} */}
          <p>
            Election ID:
            <span style={{ fontStyle: "italic", color: "rgb(251,0,138)" }}>
              {data.data[0].toNumber()}
            </span>
          </p>
        </div>
      );
    } else return null;
  };

  return (
    <div
      className={`card border`}
      style={{ marginBottom: "10px", padding: "0px" }}
    >
      <div
        className="card-header d-flex"
        id="headingOne"
        style={{ padding: "0px" }}
      >
        <h5
          className="mb-0 mr-auto p-2 container-fluid"
          style={{ padding: "0px" }}
        >
          <button
            className="btn btn-link container-fluid"
            data-toggle="collapse"
            data-target={`#collapse` + props.transaction.block_number}
            aria-expanded="true"
            aria-controls={`collapse` + props.transaction.block_number}
            style={{ paddingLeft: "20px", "text-decoration": "none" }}
          >
            <div className="d-flex">
              <div className="p-2">
                <div className="row">
                  <span style={{ color: "black" }}>From:</span>
                  <span>{props.transaction.from}</span>
                </div>
                <div className="row" style={{ marginTop: "10px" }}>
                  <span style={{ color: "black" }}>At Time:</span>
                  <span>{props.transaction.date_create}</span>
                </div>
              </div>
              <div className="ml-auto p-2 row">
                <h5 style={{ color: colorText, fontSize:"25px" }}>
                  [{props.transaction.function_name}]
                </h5>
              </div>
            </div>
          </button>
        </h5>
      </div>
      <div
        id={`collapse` + props.transaction.block_number}
        className={`collapse `}
        aria-labelledby="headingOne"
        data-parent="#accordion"
      >
        <div className="card-body mh-100 overflow-auto">
          <div className="main" style={{ minHeight: "150px", marginBottom:"50px" }}>
            <div>
              <h4>Information</h4>
              <hr />
            </div>
            <div>
              <p>
                Block ID :
                <span style={{ fontStyle: "italic", color: "rgb(0,76,255)" }}>
                  {props.transaction.block_number}
                </span>
              </p>
              <p>
                From :
                <span style={{ fontStyle: "italic", color: "rgb(0,76,255)" }}>
                  {props.transaction.from}
                </span>
              </p>
              <p>
                TX Hash :
                <span style={{ fontStyle: "italic", color: "rgb(0,76,255)" }}>
                  {props.transaction.tx_hash}
                </span>
              </p>
              <p>
                Gas Used :
                <span style={{ fontStyle: "italic", color: "rgb(0,76,255)" }}>
                  {" "}
                  {props.transaction.gas_used}
                </span>
              </p>
              <p>
                Date Time :
                <span style={{ fontStyle: "italic", color: "rgb(0,76,255)" }}>
                  {" "}
                  {props.transaction.date_create}
                </span>
              </p>
              <p>
                Action :
                <span className={`badge ${colorBtn}`} style={{ fontStyle: "italic", fontSize:"15px" }}>
                  {" "}
                  {props.transaction.function_name}
                </span>
              </p>
            </div>
          </div>

          <div className="main">
            <div>
              <h4>Value</h4>
              <hr />
            </div>
            <div>
              {/* {.map((value) => ( */}
              <div style={{ marginLeft: "0px" }} key={Math.random()}>
                {/* <h4>
                    <span className="badge badge-info">{value.toString()}</span>
                  </h4> */}
                <VoteTrans data={props.transaction.data} />
                <CreateTrans data={props.transaction.data} />
                <ExpiredTrans data={props.transaction.data} />
                {/* <VoteTrans data= {props.transaction.data} /> */}
              </div>
              {/* ))} */}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

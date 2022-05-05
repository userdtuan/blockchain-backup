import React, { useState, useEffect } from "react";

export default function Election(props) {
  const [yours, setYours] = useState();
  const [election, setElection] = useState([]);
  const [complete, setComplete] = useState(null);
  const [colorComplete, setColorComplete] = useState(null);
  const [listCandidate, setListCandidate] = useState([]);

  useEffect(() => {
    if (props.listCandidate) {
      setListCandidate(props.listCandidate);
    }
  }, [props.listCandidate]);
  useEffect(() => {
    if (props.complete) {
      setComplete(props.complete);
      setColorComplete(props.colorComplete);
    }
  }, [props.complete]);
  useEffect(() => {
    if (props.election) {
      setElection(props.election);
    }
  }, [props.election]);

  useEffect(() => {
    let a = String(props.owner2.toString());
    // console.log(typeof(a))
    // console.log(a)
    // console.log(typeof(b))
    // console.log(b)
    let b = String(props.owner1.toString());
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
      setYours("Yours");
      // console.log(" Getiiiiiiin")
    } else setYours("");
  }, [props.owner1, props.owner2]);
  return (
    <div
      className={`card border border-` + props.color + ` ${props.none}`}
      style={{ marginBottom: "10px" }}
    >
      <div className="card-header d-flex" id="headingOne">
        <h5 className="mb-0 mr-auto p-2">
          <button
            className="btn btn-link"
            data-toggle="collapse"
            data-target={`#collapse` + props.id}
            aria-expanded="true"
            aria-controls={`collapse` + props.id}
            onClick={() => {
              props.handleOpenState(props.id);
            }}
          >
            <span style={{ color: props.colorText }}>{props.name} </span>
          </button>
        </h5>
        <span
          style={{
            width: "50px",
            height: "28px",
            fontSize: "10px",
            color: "green",
          }}
          onClick={() => {}}
        >
          {/* Yours */}
          {yours}
        </span>
        <span
          style={{
            width: "53px",
            height: "28px",
            fontSize: "10px",
            color: colorComplete,
          }}
          onClick={() => {}}
        >
          {complete}
        </span>
      </div>
      <div
        id={`collapse` + props.id}
        className={`collapse ` + props.show}
        aria-labelledby="headingOne"
        data-parent="#accordion"
      >
        <div className="card-body mh-100 overflow-auto">
          <div className="main"  style={{"minHeight":"150px"}}>
            <div>
              <h4>Description</h4>
              <hr />
            </div>
            <div>
              <p>{election.description}</p>
            </div>
          </div>

          <div className="main">
            <div>
              <h4>Details</h4>
              <hr />
            </div>
            <div>
              <p>
                Election ID :<span style={{"fontStyle":"italic", color:"rgb(0,76,255)"}}> {election.id}</span>
              </p>
              <p>
                Owner Address :<span style={{"fontStyle":"italic", color:"rgb(0,76,255)"}}> "{election.owner}"</span>
              </p>
              <p>
                Expired ? :<span style={{"fontStyle":"italic", color:"rgb(0,76,255)"}}> {election.expired?(election.expired).toString(): "false"}</span>
              </p>
              <p>
                Question :<span style={{"fontStyle":"italic", color:"rgb(0,76,255)"}}> "{election.question}"</span>
              </p>
            </div>
          </div>
          {listCandidate.map((candidate) => (
            <div style={{"marginLeft":"0px"}} key={candidate.id}>
              <h4><span className="badge badge-info">Candidate {candidate.id}</span></h4>
              <div>
                <p>Candidate ID: <span style={{"fontStyle":"italic", color:"rgb(251,0,138)"}}>{candidate.id}</span></p>
                <p>Candidate Name: <span style={{"fontStyle":"italic", color:"rgb(251,0,138)"}}>"{candidate.name}"</span></p>
                <p>Candidate Information: <span style={{"fontStyle":"italic", color:"rgb(251,0,138)"}}>"{candidate.description}"</span></p>
                <p>Vote Count: <span style={{"fontStyle":"italic", color:"rgb(251,0,138)"}}>{candidate.value}</span></p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

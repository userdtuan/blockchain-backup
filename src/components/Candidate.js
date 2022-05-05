import React, { useState, useEffect } from "react";

export default function Candidate(props) {
  const [canName, setCanName] = useState({});
  const [canDes, setCanDes] = useState({});
  const [name, setName] = useState('');
  const [des, setDes] = useState('');
  const handleCanNameChange = (event) => {
    const name = event.target.name;
    const value = event.target.value;
    setCanName(values => ({...values, [name]: value}))
    props.handleCanNameChange(values => ({...values, [name]: value}))
  }
  const handleCanDesChange = (event) => {
    const name = event.target.name;
    const value = event.target.value;
    setCanDes(values => ({...values, [name]: value}))
    props.handleCanDesChange(values => ({...values, [name]: value}))
  }
  useEffect(() => {
    if(props){
      setName(`can${props.index}name`)
      setDes(`can${props.index}des`)
    }
  });
  return (
    <div>
      <fieldset className="scheduler-border">
    <legend className="scheduler-border">Candidate {props.index}</legend>
      <div className="form-group">
        <label htmlFor="formGroupExampleInput">Name</label>
        <input
        required
          type="text"
          className="form-control"
          name={name}
          value={canName[name] || ""}
          onChange={handleCanNameChange}

        />
      </div>
      <div className="form-group" style={{margiBottom:"5px"}}>
        <label htmlFor="formGroupExampleInput2">
          Description
        </label>
        <input
        required
          type="text"
          className="form-control"
          name={des}
          value={canDes[des] || ""}
          onChange={handleCanDesChange}
        />
        {/* <hr className="my-4"/> */}
      </div>
      </fieldset>
    </div>
  );
}

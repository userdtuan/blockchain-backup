import React, { useState, useEffect } from "react";
import Election from "./Election";

export default function TableLeft(props) {
  const [electArr, setElectArr] = useState([])
  const [listCandidate, setListCandidate] = useState([])
  const [none, setNone] = useState()
    useEffect(() => {
    if(props.electArr){
      // console.log("props received")
      // console.log(props.electArr)
      setElectArr(props.electArr)
      setNone(props.none)
    }
  },[props.electArr,props.none])
  useEffect(() => {
    if(props.listCandidate){
      setListCandidate(props.listCandidate)
    }
  },[props.listCandidate])
  // useEffect(() => {
  //   if(props.owner){
  //     // alert(props.owner)
  //   }},[])
      //   console.log(props.owner)
      // console.log(props.electArr.owner)
  const handleOpenState = (value)=>{
    props.handleElectIDChange(value)
  }
  return <div id="accordion">
    {
    electArr.map((election) => (
        <Election
          color={election.expired!==true ? ("primary") : ("warning")}
          id={election.id}
          key={election.id}
          name={election.question}
          show={null}
          colorText={election.expired===true ? "black" : null}
          handleOpenState = {handleOpenState}
          none={election.expired===true && none===true ? ("d-none") : null}
          owner1 = {props.owner}
          owner2 = {election.owner}
          colorComplete = {election.voted?"green":"red"}
          complete = {election.voted?"Completed":"Not Completed"}
          election = {election}
          listCandidate = {listCandidate}
        />
)).reverse()}
  </div>;
}

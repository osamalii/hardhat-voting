import { Component } from "react";
import "./Proposal.css";
import { SessionData,WorkflowStatus } from "../structure/Structure";

const Proposal =(data:any)=>{
    const d:SessionData=data.data;
    console.log(d);
    return (
        <>
            <h1 style={{
                backgroundColor:"red"
            }}>| {WorkflowStatus[d.status]} |</h1>
        </>
    )
   
}
export default Proposal;
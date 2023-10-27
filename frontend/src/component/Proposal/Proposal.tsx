import { Component } from "react";
import "./Proposal.css";
import { SessionData } from "../structure/Structure";

const Proposal =(data:any)=>{
 

    return (
        <>
            <h1 style={{
                backgroundColor:"red"
            }}>{data.status} |||| 23 ans, l'oise ,pas de boite,aller sur toulouse , enfant, mariage</h1>
        </>
    )
   
}
export default Proposal;
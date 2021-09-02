import { useEffect, useState } from "react";
import { useWeb3React } from '@web3-react/core'
import { InjectedConnector } from '@web3-react/injected-connector'
import styled from 'styled-components';
import React,{ Component } from "react";

import {
    Link
} from "react-router-dom";

const injected = new InjectedConnector({ supportedChainIds: [4002, 250] })

const StyledNavBarDiv = styled.div`
background: black;
float: left;
height: 100vh;
width: 180px;
padding: 0px
`

const StyledNavButton = styled.button`
width:100%;
height: 40px;
margin-top: 20px;
background: transparent;
color: white;
border:none;
font-size: 20px;
cursor: pointer;
&:focus { outline: none; }
:hover {
    background: white;
    color: black;
}
`

function NavBar(props) {
    const { connector, library, chainId, account, activate, deactivate, active, error } = useWeb3React()

    return (
        <StyledNavBarDiv>
            <a href="https://fantomdiamond.shop/mint/#/"><p style={{width:"100%", color:"white", paddingTop:"10px", height:"10px"}}><b>FantomDiamond</b></p></a>
            <StyledNavButton onClick={() => { account ? deactivate() : activate(injected) }}>{
                account ? account.slice(0, 6) + "..." : "CONNECT"
            }</StyledNavButton>
            {/* <StyledNavButton><Link to="/collection">Collections</Link></StyledNavButton> */}
            <Link to="/marketplace"><StyledNavButton>MARKET</StyledNavButton></Link>
            <Link to="/order"><StyledNavButton>TRADE</StyledNavButton></Link>
            {/* <StyledNavButton><Link to="/marketplace">my offer</Link></StyledNavButton> */}
        </StyledNavBarDiv>
    )
}

export default NavBar
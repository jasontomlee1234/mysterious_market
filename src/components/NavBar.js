import { useEffect, useState } from "react";
import { useWeb3React } from '@web3-react/core'
import { InjectedConnector } from '@web3-react/injected-connector'
import styled from 'styled-components';

import {
    Link
} from "react-router-dom";

const injected = new InjectedConnector({ supportedChainIds: [4002, 250] })

const StyledNavBarDiv = styled.div`
background: black;
float: left;
height: 100vh;
width: 150px;
padding: 10px
`

const StyledNavButton = styled.button`
width:100%;
height: 30px;
margin-top: 30px;
background: transparent;
color: white;
border-radius: 50px;
font-size: 20px;
&:focus { outline: none; }
`

function NavBar(props) {
    const { connector, library, chainId, account, activate, deactivate, active, error } = useWeb3React()

    return (
        <StyledNavBarDiv>
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
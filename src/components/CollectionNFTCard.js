import styled from 'styled-components';
import { useWeb3React } from '@web3-react/core'
import address from '../address.json'
import { useEffect, useState } from 'react';
import React,{ Component } from "react";

const StyledDiv = styled.div`
border-style: solid;
width: 100px;
height: 100px;
`

const StyleImgDiv = styled.div`
height: 100%;
`

const StyleImg = styled.img`
height: 100%;
`

function approve(contract, library, tokenId) {
    contract = contract.connect(library.getSigner())
    contract.approve(address.fantomDiamond, tokenId)
}

function ask(contract, library, tokenId, price) {
    contract = contract.connect(library.getSigner())
    contract.ask(tokenId, price)
}

async function isApproved(contract, library, tokenId) {
    const approvedAddr = await contract.getApproved(tokenId)
    return approvedAddr.toLowerCase() == address.marketplace.toLowerCase()
}

function CollectionNFTCard({ nftContract, marketplaceContract, tokenId, tokenUri }) {
    const { library, account } = useWeb3React()
    const [approved, setApproved] = useState()

    useEffect(async () => {
        const _isApproved = await isApproved(nftContract, library, tokenId)
        setApproved(_isApproved)
    })
    return (
        <StyledDiv>
            <StyleImgDiv>
                <StyleImg src="https://fantomdiamond.shop/diamondsForShowing/legendary/spooky.jpg" />
            </StyleImgDiv>
            <div>{tokenId}</div>
            <button onClick={() => {
                // bid(contract,library, tokenId, "123123")
            }}>Buy</button>
        </StyledDiv>
    )
}

export default CollectionNFTCard
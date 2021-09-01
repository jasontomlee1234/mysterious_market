import { Contract } from '@ethersproject/contracts'
import fantomDiamondAbi from "../abis/FantomDiamond.json"
import marketplaceAbi from "../abis/Marketplace.json"
import address from '../address.json'
import styled from 'styled-components';
import { parseEther, formatEther } from '@ethersproject/units'

import { useEffect, useState } from 'react'
import { useWeb3React } from '@web3-react/core'
import DialogTitle from '@material-ui/core/DialogTitle';
import Dialog from '@material-ui/core/Dialog';
import React,{ Component } from "react";

const StyledDiv = styled.div`
border-radius: 20px;

width: 600px;
margin: auto;
padding: 10px;
text-align: left;
background-image: linear-gradient(to top, #a8edea 0%, #fed6e3 100%);
border-color: cadetblue;
* {
    margin: 5px;
}
`

const StyledWrapDiv = styled.div`
margin-top: 150px;
`

const StyledRowDiv = styled.div`
margin: 20px;
`

const StyledMarketButton = styled.button`
margin: 20px;
`

function getMarketplaceContract(abi, library) {
    return new Contract(address.marketplace, abi, library)
}

function getFantomDiamondContract(abi, library) {
    return new Contract(address.fantomDiamond, abi, library)
}

function approve(contract, library, tokenId) {
    contract = contract.connect(library.getSigner())
    contract.approve(address.marketplace, tokenId).catch((e) => {
        console.log(e)
        try {
            alert(e.data.message)
        } catch (e) {
            alert("rejected")
        }
    })
}

async function isApproved(contract, library, tokenId) {
    const approvedAddr = await contract.getApproved(tokenId)
    return approvedAddr.toLowerCase() == address.marketplace.toLowerCase()
}

async function getOffer(contract, tokenId) {
    return await contract.ledger(tokenId)
}

// function getOfferP(contract, tokenId) {
//     console.log(contract)
//     return contract.ledger(tokenId)
//     return ""
// }

async function getLedger(contract) {
    let promiseArray = []
    // for (let i = 0; i < 500; i++) {
    //     promiseArray.push(await getOffer(contract, i))
    // }
    console.log(await getOffer(contract, 0))

    console.log(promiseArray)
    return promiseArray
}

function ask(contract, library, tokenId, price) {
    contract = contract.connect(library.getSigner())
    price = parseEther(price).toString()
    console.log(price)

    contract.ask(tokenId, price).catch((e) => {
        console.log(e)
        try {
            alert(e.data.message)
        } catch (e) {
            alert("rejected")
        }
    })
}

async function bid(contract, library, tokenId) {
    contract = contract.connect(library.getSigner())
    const offer = await getOffer(contract, tokenId)
    const price = offer.price.toString()
    console.log("price: ", price)
    contract.bid(tokenId, {
        value: price
    }).catch((e) => {
        console.log(e)
        try {
            alert(e.data.message)
        } catch (e) {
            alert("rejected")
        }
    })
}

function cancelOffer(contract, library, tokenId) {
    contract = contract.connect(library.getSigner())
    contract.cancelOffer(tokenId).catch((e) => {
        console.log(e)
        try {
            alert(e.data.message)
        } catch (e) {
            alert("rejected")
        }
    })
    console.log(contract)
}

function getOnSale(ledger) {
    let onSaleList = []
    ledger.forEach((element, i) => {
        const price = parseFloat(formatEther(element.price))
        if (price > 0) {
            onSaleList.push({
                tokenId: i,
                seller: element.seller,
                price: formatEther(element.price)
            })
        }
    })

    return onSaleList
}

function SimpleMarketPlace(props) {
    const { library, account } = useWeb3React()
    const [nftContract, setNftContract] = useState()
    const [marketplaceContract, setMarketplaceContract] = useState()
    const [listPrice, setListPrice] = useState(0)
    const [sellTokenId, setSellTokenId] = useState(0)
    const [buyTokenId, setBuyTokenId] = useState(0)
    const [cancelTokenId, setCancelTokenId] = useState(0)
    const [approveTokenId, setApproveTokenId] = useState(0)
    const [marketDialogOpen, setMarketDialogOpen] = useState(false);
    const [onSaleList, setOnSaleList] = useState([])



    useEffect(async () => {
        const _nftContract = getFantomDiamondContract(fantomDiamondAbi, library)
        setNftContract(_nftContract)


        const _marketplaceContract = getMarketplaceContract(marketplaceAbi, library)
        setMarketplaceContract(_marketplaceContract)

        // console.log(await getOffer(_marketplaceContract, 1))

        // const _ledger = await getLedger(_marketplaceContract)
        // const onSale = getOnSale(_ledger)

        // setOnSaleList(onSale)

    }, [])
    function handleSellTokenIdChange(event) {
        setSellTokenId(event.target.value)
    }
    function handlBuyTokenIdChange(event) {
        setBuyTokenId(event.target.value)
    }
    function handleCancelTokenIdChange(event) {
        setCancelTokenId(event.target.value)
    }
    function handleListPriceChange(event) {
        setListPrice(event.target.value)
    }
    function handleApproveTokenIdChange(event) {
        setApproveTokenId(event.target.value)
    }

    const handleClickOpen = () => {
        setMarketDialogOpen(true);

    };

    const handleClose = (value) => {
        setMarketDialogOpen(false);
    };

    return (
        <StyledWrapDiv>
            <StyledDiv>
                <StyledRowDiv style={{fontSize:"25px"}}><b>Marketplace</b></StyledRowDiv>
                <StyledRowDiv>
                    <div style={{fontSize:"20px"}}><b>Sell</b></div>
                    <div>1. approve</div>
                    <label>Token id</label>
                    <input onChange={handleApproveTokenIdChange} />
                    <button style={{cursor:"pointer"}} onClick={() => { approve(nftContract, library, approveTokenId) }}>approve</button>
                </StyledRowDiv>
                

                <StyledRowDiv>
                    <div>2. place order</div>
                    <label>Token id</label>
                    <input onChange={handleSellTokenIdChange} />
                    <label>list price</label>
                    <input onChange={handleListPriceChange} />
                    <button style={{cursor:"pointer"}} onClick={() => { ask(marketplaceContract, library, sellTokenId, listPrice) }}>sell</button>
                </StyledRowDiv>
                <hr style={{width:"80%", marginLeft:"10%", backgroundImage:"linear-gradient(to right, rgba(0, 0, 0, 0), rgba(0, 0, 0, 0.75), rgba(0, 0, 0, 0))"}}></hr>
                <StyledRowDiv>
                    <div style={{fontSize:"20px"}} ><b>Purchase</b></div>
                    <label>Token id</label>
                    <input onChange={handlBuyTokenIdChange} />
                    <button style={{cursor:"pointer"}} onClick={() => { bid(marketplaceContract, library, buyTokenId) }}>buy</button>
                </StyledRowDiv>
                <hr style={{width:"80%", marginLeft:"10%"}}></hr>
                <StyledRowDiv>
                    <div style={{fontSize:"20px"}}><b>Cancel order</b></div>
                    <label>Token id</label>
                    <input onChange={handleCancelTokenIdChange} />
                    <button style={{cursor:"pointer"}} onClick={() => { cancelOffer(marketplaceContract, library, cancelTokenId) }}>cancel</button>
                </StyledRowDiv>
                {/* <Dialog onClose={handleClose} aria-labelledby="simple-dialog-title" open={marketDialogOpen}>
                    <DialogTitle id="simple-dialog-title">Market</DialogTitle>
                    {
                        onSaleList.map(onSale => {
                            return <div>{onSale.price.toString()}</div>
                        })
                    }
                </Dialog> */}
            </StyledDiv>
        </StyledWrapDiv>
    )
}

export default SimpleMarketPlace
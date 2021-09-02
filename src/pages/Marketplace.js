import { Contract } from '@ethersproject/contracts'
import { useWeb3React } from '@web3-react/core'
import { formatEther } from '@ethersproject/units'

import address from '../address.json'
import fantomDiamondAbi from "../abis/FantomDiamond.json"
import marketplaceAbi from "../abis/Marketplace.json"
import { useEffect, useState } from 'react'

import NFTCard from '../components/NFTCard'


import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableContainer from '@material-ui/core/TableContainer';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import Paper from '@material-ui/core/Paper';
import { makeStyles } from '@material-ui/core/styles';
import CircularProgress from '@material-ui/core/CircularProgress';
import React,{ Component } from "react";


const useStyles = makeStyles({
    table: {
        minWidth: 650,
    },
});


function getMarketplaceContract(abi, library) {
    return new Contract(address.marketplace, abi, library)
}

function getFantomDiamondContract(abi, library) {
    return new Contract(address.fantomDiamond, abi, library)
}

function getOffer(contract, tokenId) {
    return contract.ledger(tokenId)
}

async function getLedger(contract) {
    let promiseArray = []
    for (let i = 0; i < 500; i++) {
        promiseArray.push(getOffer(contract, i))
    }

    return await Promise.all(promiseArray)
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

function createData(tokenId, seller, price) {
    return { tokenId, seller, price };
}


function Marketplace(props) {
    const { library, account } = useWeb3React()
    const [fantomDiamondContract, setFantomDiamondContract] = useState()
    const [marketplaceContract, setMarketplaceContract] = useState()
    const [ledger, setLedger] = useState()
    const [onSaleList, setOnSaleList] = useState([])
    const [isLoading, setIsLoading] = useState(true)

    const [onSaleTableRow, setOnSaleTableRow] = useState([])

    const classes = useStyles();

    useEffect(async () => {
        const fdc = getFantomDiamondContract(fantomDiamondAbi, library)
        const mp = getMarketplaceContract(marketplaceAbi, library)

        setFantomDiamondContract(fdc)
        setMarketplaceContract(mp)

        const _ledger = await getLedger(mp)
        setLedger(_ledger)

        const onSale = getOnSale(_ledger)
        // console.log(_ledger)
        console.log(onSale)
        setOnSaleList(onSale)

        setOnSaleTableRow(onSale.map(x => {
            return createData(x.tokenId, x.seller, x.price)
        }))

        setIsLoading(false)



    }, [])
    let count = 0
    return (
        <div>
            {
                isLoading ? <CircularProgress /> : 
                onSaleTableRow.length != 0 ?
                <TableContainer component={Paper}>
                    <Table className={classes.table} aria-label="simple table">
                        <TableHead style={{background:"gray"}}>
                            <TableRow>
                                <TableCell align="center">id</TableCell>
                                <TableCell align="center">seller</TableCell>
                                <TableCell align="center">price</TableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>{
                            // onSaleList.map(e=>{
                            //     return <NFTCard contract={marketplaceContract} tokenId={e.tokenId} seller={e.seller} price={e.price}/>
                            // })
                            onSaleTableRow.map((row) => {
                                console.log(row)
                                return <TableRow key={count++}>
                                    <TableCell align="center">{row.tokenId}</TableCell>
                                    <TableCell align="center">{row.seller}</TableCell>
                                    <TableCell align="center">{row.price}</TableCell>
                                </TableRow>
                            })
                        }
                        </TableBody>
                    </Table>
                </TableContainer> :
                <div style={{fontSize:"40px",color:"lightsalmon"}}>No avaliable Diamonds are on sale</div>
            }

        </div>
    )
}

export default Marketplace
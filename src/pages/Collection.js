import fantomDiamondAbi from "../abis/FantomDiamond.json"
import marketplaceAbi from "../abis/Marketplace.json"
import { Contract } from '@ethersproject/contracts'
import { useWeb3React } from '@web3-react/core'
import { useEffect, useState } from "react"
import address from '../address.json'

import CollectionNFTCard from '../components/CollectionNFTCard'

function getContract(address, abi, library) {
    return new Contract(address, abi, library)
}


async function getCollection(contract, addr) {
    let promiseList = []
    const balance = parseInt((await contract.balanceOf(addr)).toString())
    for (let i = 0; i < balance; i++) {
        promiseList.push(contract.tokenOfOwnerByIndex(addr, i))
    }

    const tokenIds = await Promise.all(promiseList)

    let promiseList2 = []
    for (let i = 0; i < tokenIds.length; i++) {
        promiseList2.push(contract.tokenURI(tokenIds[i].toString()))
    }

    const tokenURIs = await Promise.all(promiseList2)
    return tokenURIs
}

function getTokenIdFromURI(uri){
    const regex = /[0-9]/g;
    const found = uri.match(regex);
    return found.join('')
}

function Collection(props) {
    const { library, account } = useWeb3React()
    const [nftContract, setNftContract] = useState()
    const [marketplaceContract, setMarketplaceContract] = useState()
    const [collection, setCollection] = useState([])

    useEffect(async () => {
        const _nftContract = getContract(address.fantomDiamond, fantomDiamondAbi, library)
        setNftContract(_nftContract)

        const _marketplaceContract = getContract(address.marketplace, marketplaceAbi, library)
        setMarketplaceContract(_marketplaceContract)

        const _collection = await getCollection(_nftContract, account)
        console.log(_collection)
        setCollection(_collection)
    }, [])

    return (
        <div>
            {
                collection.map(c=>{
                    return <CollectionNFTCard nftContract={nftContract} marketplaceContract={marketplaceContract} tokenUri={c} tokenId={getTokenIdFromURI(c)}/>
                })
            }
        </div>
    )
}

export default Collection
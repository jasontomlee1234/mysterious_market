
import { useWeb3React } from '@web3-react/core'

function bid(contract,library, tokenId, price){
    contract = contract.connect(library.getSigner())
    contract.bid(tokenId,{
        value: price
    })
    console.log(contract)
}

function NFTCard({contract, tokenId, seller, price}){
    const { library, account } = useWeb3React()
    return (
        <div>
            <div>id: {tokenId}</div>
            <div>seller: {seller}</div>
            <div>price: {price} FTM</div>
            {/* <button onClick={()=>{
                bid(contract,library, tokenId, "123123")
            }}>Buy</button> */}
        </div>
    )
}

export default NFTCard
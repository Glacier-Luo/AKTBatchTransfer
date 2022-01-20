import {assertIsBroadcastTxSuccess, SigningStargateClient} from '@cosmjs/stargate'

export async function sendAKT(rpc, wallet, address, amount, memo, fee, gas){
  let [firstAccount] = await wallet.getAccounts()
  let client = await SigningStargateClient.connectWithSigner(rpc, wallet)
  let amountObj = {
    denom: 'uakt',
    amount: String(amount)
  }
  let feeObj = {
    amount: [
      {
        denom: 'uakt',
        amount: String(fee)
      }
    ],
    gas: String(gas)
  }
  let result = await client.sendTokens(
    firstAccount.address,
    address,
    [amountObj],
    feeObj,
    memo
  )
  assertIsBroadcastTxSuccess(result)
  return result
}

export async function queryTXbyHash(hash, api){
  const response = await fetch(`${api}/cosmos/tx/v1beta1/txs/${hash}`)
  return response.json()
}

export async function isTxSuccess(hash, api) {
  let data = await queryTXbyHash(hash, api)
  try{
    data.tx_response.height
    return true
  }catch (e) {
    return false
  }
}

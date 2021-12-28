const state = () => ({
  address: '',
  serializedWallet: null,
  rpc: 'https://rpc.akash.glacierluo.com',
  api: 'https://api.akash.glacierluo.com',
  balance: 0
})

const getters = {}

const actions = {}

const mutations = {
  setAddress(state, address) {
    state.address = address
  },
  setSerializedWallet(state, serializedWallet) {
    state.serializedWallet = serializedWallet
  },
  setRPC(state, rpc) {
    state.rpc = rpc
  },
  setAPI(state, api) {
    state.api = api
  },
  async flushBalance(state) {
    const response = await fetch(state.api + "/cosmos/bank/v1beta1/balances/" + state.address)
    const data = await response.json()
    const balance = data.balances.length > 0 && data.balances.some((b) => b.denom === "uakt") ? data.balances.find((b) => b.denom === "uakt").amount : 0
    state.balance = balance
  }
}

export default {
  namespaced: true,
  state,
  getters,
  actions,
  mutations
}

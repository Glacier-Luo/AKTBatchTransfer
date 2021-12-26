const state = () => ({
  wallet: null
})

const getters = {}

const actions = {}

const mutations = {
  setWallet(state, wallet) {
    state.wallet = wallet
  }
}

export default {
  namespaced: true,
  state,
  getters,
  actions,
  mutations
}

const state = () => ({
  address: '',
  serializedWallet: null
})

const getters = {}

const actions = {}

const mutations = {
  setAddress(state, address) {
    state.address = address
  },
  setSerializedWallet(state, serializedWallet) {
    state.serializedWallet = serializedWallet
  }
}

export default {
  namespaced: true,
  state,
  getters,
  actions,
  mutations
}

import { createStore } from 'vuex'
import createVuexAlong from 'vuex-along'
import persistent from "@/store/persistent"
import temporary from "@/store/temporary"

export default createStore({
  state: {
  },
  mutations: {
  },
  actions: {
  },
  modules: {
    persistent: persistent,
    temporary: temporary
  },
  plugins: [createVuexAlong({
    name: 'Akash',
    local: {
      list: ["temporary"],
      isFilter: true
    },
    session: {
      list: ["temporary"],
      isFilter: true
    }
  })]
})

export function clear() {
  window.clearVuexAlong(true, true)
  window.location.reload()
}

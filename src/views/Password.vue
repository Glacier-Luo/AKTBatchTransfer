<template>
  <div>
    <NCard title="Enter password" class="content">
      <NSpace vertical>
        <NInput v-model:value="password" type="password" placeholder="Password" @keyup.enter="submit"/>
        <NButton class="btn" @click="submit">Submit</NButton>
      </NSpace>
    </NCard>
  </div>
</template>

<script>
import {defineComponent, onMounted, ref} from "vue"
import {NCard, NInput, NButton, NSpace, useMessage} from 'naive-ui'
import {useStore} from "vuex"
import router from "@/router"
import {
  DirectSecp256k1HdWallet,
  executeKdf,
  extractKdfConfiguration
} from '@cosmjs/proto-signing'

export default defineComponent({
  name: "Password",
  components: {NCard, NInput, NButton, NSpace},
  setup() {
    const message = useMessage()
    const store = useStore()

    const password = ref('')

    async function submit() {
      try {
        let serializedWallet = store.state.persistent.serializedWallet
        const kdfConf = extractKdfConfiguration(serializedWallet)

        const key = await executeKdf(password.value, kdfConf)
        const keyArray = Uint8Array.from(key)

        const wallet = await DirectSecp256k1HdWallet.deserializeWithEncryptionKey(
            serializedWallet,
            keyArray
        )

        message.success('Success!')
        store.commit('temporary/setWallet', wallet)
        await router.push({name: 'Transfer'})
      } catch (e) {
        message.error(e.message)
      }
    }

    onMounted(() => {
      if (!store.state.persistent.serializedWallet) {
        router.push({name: 'ImportMnemonic'})
      }
    })

    return {
      password,
      submit
    }
  }
})
</script>

<style scoped>
.content {
  margin: 40px auto;
  width: 80%;
  justify-content: center;
}

.btn {
  display: block;
  margin: 0 auto;
}
</style>

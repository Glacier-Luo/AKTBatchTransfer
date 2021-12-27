<template>
  <div>
    <NCard title="Enter password" class="content">
      <NSpace vertical>
        <NInput v-model:value="password" type="password" placeholder="Password" @keyup.enter="submit"/>
        <div class="buttons">
          <NSpace>
            <NPopconfirm @positive-click="clear" @negative-click="()=>{}">
              <template #trigger>
                <NButton type="error">Logout</NButton>
              </template>
              Your wallet will be deleted, you sure?
            </NPopconfirm>
            <NButton @click="submit">Submit</NButton>
          </NSpace>
        </div>
      </NSpace>
    </NCard>
  </div>
</template>

<script>
import {defineComponent, onMounted, ref} from "vue"
import {NCard, NInput, NButton, NSpace, useMessage, NPopconfirm} from 'naive-ui'
import {useStore} from "vuex"
import {clear} from '@/store'
import router from "@/router"
import {
  DirectSecp256k1HdWallet,
  executeKdf,
  extractKdfConfiguration
} from '@cosmjs/proto-signing'

export default defineComponent({
  name: "Password",
  components: {NCard, NInput, NButton, NSpace, NPopconfirm},
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
      submit,
      clear
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

.buttons {
  display: flex;
  justify-content: center;
}
</style>

<template>
  <div>
    <NCard title="Import Mnemonic" class="content">
      <NSpace vertical>
        <NInput v-model:value="password" type="password" placeholder="Password"/>
        <NInput v-model:value="password2" type="password" placeholder="Confirm password"/>
        <NInput v-model:value="mnemonic" type="textarea" placeholder="Mnemonic"/>
        <NButton class="btn" @click="submit">Submit</NButton>
      </NSpace>
    </NCard>
  </div>
</template>

<script>
import {defineComponent, ref} from "vue"
import {useStore} from 'vuex'
import {NCard, NInput, NButton, NSpace, useMessage} from "naive-ui"
import {
  DirectSecp256k1HdWallet,
  executeKdf
} from "@cosmjs/proto-signing"
import router from "@/router"

export default defineComponent({
  name: "ImportMnemonic",
  components: {NCard, NInput, NButton, NSpace},
  setup() {
    const message = useMessage()
    const store = useStore()

    const password = ref('')
    const password2 = ref('')
    const mnemonic = ref('')

    async function submit() {
      if (password.value !== password2.value) {
        message.error('Passwords do not match!')
        return
      }
      try {
        let wallet = await DirectSecp256k1HdWallet.fromMnemonic(mnemonic.value, {
          prefix: 'akash'
        })
        const [firstAccount] = await wallet.getAccounts()
        console.log(firstAccount)

        await store.commit('temporary/setWallet', wallet)
        await store.commit('persistent/setAddress', firstAccount.address)

        const basicPasswordHashingOptions = {
          algorithm: 'argon2id',
          params: {
            outputLength: 32,
            opsLimit: 24,
            memLimitKib: 12 * 1024
          }
        }
        const key = await executeKdf(password.value, basicPasswordHashingOptions)
        const keyArray = Uint8Array.of(...Object.values(key))
        const serializedWallet = await wallet.serializeWithEncryptionKey(
            keyArray,
            basicPasswordHashingOptions
        )

        await store.commit('persistent/setSerializedWallet', serializedWallet)

        await router.push({name: 'Transfer'})
      } catch (e) {
        message.error(e.message)
      }
    }

    return {
      password,
      password2,
      mnemonic,
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

<template>
  <div>
    <NSpin :show="show">
      <NCard class="content" :title="$t('NodeSettings')">
        <NSpace vertical>
          <NForm :label-width="80" label-placement="left">
            <NFormItem :label="$t('RPCUrl')">
              <NInput v-model:value="rpc"/>
            </NFormItem>
            <NFormItem :label="$t('APIUrl')">
              <NInput v-model:value="api"/>
            </NFormItem>
            <NButton class="btn" @click="submit">{{ $t('SettingsSubmit') }}</NButton>
          </NForm>
        </NSpace>
      </NCard>
      <template #description>{{ $t('Checking') }}</template>
    </NSpin>
  </div>
</template>

<script>
import {defineComponent, onMounted, ref} from "vue"
import {NCard, NSpace, NInput, NButton, NFormItem, NForm, NSpin, useNotification, useMessage} from 'naive-ui'
import {useStore} from 'vuex'
import {$t} from '@/language'

export default defineComponent({
  name: "Settings",
  components: {NCard, NSpace, NInput, NButton, NFormItem, NForm, NSpin},
  setup() {
    let rpc = ref('')
    let api = ref('')
    let show = ref(false)

    const store = useStore()
    const notification = useNotification()
    const message = useMessage()

    onMounted(() => {
      rpc.value = store.state.persistent.rpc || "https://rpc.akash.glacierluo.com"
      api.value = store.state.persistent.api || "https://api.akash.glacierluo.com"
    })

    async function submit() {
      try {
        show.value = true
        let response = await fetch(api.value + '/node_info')
        if (response.status !== 200) {
          notification.error({
            title: $t('Error'),
            content: $t('APIError'),
            duration: 10000
          })
          show.value = false
          return
        } else {
          store.commit('persistent/setAPI', api.value)
        }

        response = await fetch(rpc.value + '/status')
        if (response.status !== 200) {
          notification.error({
            title: $t('Error'),
            content: $t('RPCError'),
            duration: 10000
          })
          show.value = false
          return
        } else {
          store.commit('persistent/setRPC', rpc.value)
        }

        message.success($t('SetSuccess'))

        show.value = false
      } catch (e) {
        notification.error({
          title: $t('Error'),
          content: $t('NetworkError') + e.message,
          duration: 10000
        })
        show.value = false
      }
    }

    return {
      rpc,
      api,
      submit,
      show
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

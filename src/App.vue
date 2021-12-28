<template>
  <NMessageProvider>
    <NNotificationProvider>
      <router-view/>
    </NNotificationProvider>
  </NMessageProvider>
</template>

<script>
import {NMessageProvider, NNotificationProvider} from "naive-ui"
import {defineComponent} from "vue"

export default defineComponent({
  components: {NMessageProvider, NNotificationProvider},
  setup() {
  }
})
</script>
<style>

</style>

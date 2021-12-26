<template>
  <NMessageProvider>
    <router-view/>
  </NMessageProvider>
</template>

<script>
import {NMessageProvider} from "naive-ui"
import {defineComponent} from "vue"

export default defineComponent({
  components: {NMessageProvider},
  setup() {
  }
})
</script>
<style>

</style>

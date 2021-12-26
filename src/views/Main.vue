<template>
  <div>
    <NMenu mode="horizontal" default-value="Transfer" :options="menuOptions"/>
    <router-view/>
  </div>
</template>

<script>
import {defineComponent, h, onMounted} from "vue"
import {$t, changeLanguage} from '@/language'
import {NMenu, NIcon, NDropdown, NButton} from "naive-ui"
import {RouterLink} from "vue-router"
import {
  RocketOutline as TransferIcon,
  TelescopeOutline as ExplorerIcon
} from "@vicons/ionicons5"
import router from "@/router"
import {useStore} from 'vuex'

function renderIcon(icon) {
  return () => h(NIcon, null, {default: () => h(icon)})
}

const menuOptions = [
  {
    label: () => h(
        RouterLink, {
          to: {
            name: 'Transfer',
          }
        }, {default: () => $t('Transfer')}
    ),
    key: 'Transfer',
    icon: renderIcon(TransferIcon)
  },
  {
    label: () => h(
        RouterLink, {
          to: {
            name: 'Explorer',
          }
        }, {default: () => $t('Explorer')}
    ),
    key: 'Explorer',
    icon: renderIcon(ExplorerIcon)
  },
  {
    label: () => h(
        NDropdown, {
          trigger: 'hover',
          options: [
            {
              label: '中文',
              key: 'zh-CN'
            },
            {
              label: 'English',
              key: 'en-US'
            }
          ],
          'on-select': changeLanguage
        },
        () => <NButton>Language</NButton>
    ),
    key: 'Language'
  }
]

export default defineComponent({
  name: 'Main',
  components: {NMenu},
  setup() {
    const store = useStore()
    onMounted(() => {
      if (store.state.persistent.serializedWallet) {
        if (store.state.temporary.wallet) {
          return
        } else {
          router.push({name: 'Password'})
        }
      } else {
        router.push({name: 'ImportMnemonic'})
      }
    })
    return {
      menuOptions
    }
  }
})
</script>

<style scoped>

</style>

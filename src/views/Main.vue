<template>
  <div>
    <NMenu mode="horizontal" default-value="Transfer" :options="menuOptions"
           style="display: flex; justify-content: space-between;" :on-update:value="keyOnUpdate"/>
    <router-view/>
  </div>
</template>

<script>
import {computed, defineComponent, h, onMounted} from "vue"
import {$t, changeLanguage} from '@/language'
import {NMenu, NIcon, NDropdown, NButton, NPopover} from "naive-ui"
import {RouterLink} from "vue-router"
import {
  RocketOutline as TransferIcon,
  TelescopeOutline as ExplorerIcon,
  LanguageOutline as LanguageIcon,
  CogOutline as SettingsIcon,
  RefreshOutline as RefreshIcon,
  CopyOutline
} from "@vicons/ionicons5"
import router from "@/router"
import {useStore} from 'vuex'
import {uakt2akt, copy} from "@/utils"

function renderIcon(icon) {
  return () => h(NIcon, null, {default: () => h(icon)})
}

const balance = computed(() => useStore().state.persistent.balance)

const menuOptions = [
  {
    label: () => (<div>
      <NPopover trigger="hover">
        {{
          default() {
            return <div>
              <p onClick={copy(useStore().state.persistent.address)}>
                <span>{$t('Address')}: </span>{useStore().state.persistent.address}
                <NIcon style="vertical-align: middle;"><CopyOutline /></NIcon>
              </p>
            </div>
          },
          trigger() {
            return <div onClick={useStore().commit('persistent/flushBalance')}>
              {$t('Balance')}: {uakt2akt(balance.value)} AKT
              <NIcon style="vertical-align: middle;"><RefreshIcon/></NIcon>
            </div>
          }
        }}
      </NPopover>
    </div>),
    key: 'Information'
  },
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
        RouterLink, {
          to: {
            name: 'Settings',
          }
        }, {default: () => $t('Settings')}
    ),
    key: 'Settings',
    icon: renderIcon(SettingsIcon)
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
        () => <NButton><NIcon><LanguageIcon/></NIcon>Language</NButton>
    ),
    key: 'Language'
  }
]

export default defineComponent({
  name: 'Main',
  components: {NMenu},
  setup() {
    const store = useStore()

    function keyOnUpdate(key) {
      if(key === 'Information')
        store.commit('persistent/flushBalance')
    }

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

      store.commit('persistent/flushBalance')
    })
    return {
      menuOptions,
      keyOnUpdate
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

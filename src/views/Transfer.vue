<template>
  <div>
    <NCard class="content" :title="$t('Transfer')">
      <NSpace vertical>
        <div style="display: flex; justify-content: center;flex-direction: column;align-items: center;">
          <span>{{ $t('TransferReminder') }}</span>
          <span>{{ $t('ProcessReminder') }}</span>
        </div>
        <NSpace style="display: flex; justify-content: center;">
          <NUpload :custom-request="importData" :show-file-list="false">
            <NButton>{{ $t('Import') }}</NButton>
          </NUpload>
          <NButton @click="exportData">{{ $t('Export') }}</NButton>
          <NButton @click="sendAll">{{ $t('SendAll') }}</NButton>
        </NSpace>
        <NDivider/>
        <NSpace vertical>
          <!--          <NInput v-model:value="memo" placeholder="All memo will be set to this." type="textarea" autosize/>-->
          <NSpace style="display: flex; justify-content: center;">
            <NButton type="warning" @click="clearAll">{{ $t('ClearAll') }}</NButton>
          </NSpace>
        </NSpace>
        <NDataTable
            :columns="columns"
            :data="data"
            :summary="summary"
            :row-key="rowKey"
        />
      </NSpace>
    </NCard>
  </div>
</template>

<script>
import {defineComponent, onMounted, reactive, ref, watch} from "vue"
import {NCard, NDataTable, NInput, NTag, NButton, NSpace, NDivider, NUpload, useNotification, useMessage, NPopconfirm} from "naive-ui"
import {$t} from '@/language'
import {sendAKT} from "@/utils/tx"
import {akt2uakt} from "@/utils"
import {useStore} from "vuex"

const xlsx = require('xlsx')
const fileSaver = require('file-saver')

export default defineComponent({
  name: "Transfer",
  components: {NCard, NDataTable, NSpace, NButton, NDivider, NUpload},
  setup() {
    const notification = useNotification()
    const store = useStore()
    const message = useMessage()

    const columns = [
      {
        title: 'Name',
        key: 'name',
        render(row) {
          return <NInput v-model:value={row.name}/>
        }
      },
      {
        title: 'Address',
        key: 'address',
        render(row) {
          return <NInput v-model:value={row.address} type="textarea" autosize/>
        }
      },
      {
        title: 'Amount(AKT)',
        key: 'amount',
        render(row) {
          return <NInput v-model:value={row.amount} class="akt">
            {{
              suffix() {
                return 'AKT'
              }
            }}
          </NInput>
        }
      },
      {
        title: 'Memo',
        key: 'memo',
        render(row) {
          return <NInput v-model:value={row.memo} type="textarea" autosize/>
        }
      },
      {
        title: 'tx Hash',
        key: 'hash'
      },
      {
        title: 'Status',
        key: 'status',
        render(row) {
          let type = ''
          if (row.status === 'None') {
            type = ''
          } else if (row.status === 'Pending') {
            type = 'warning'
          } else if (row.status === 'Success') {
            type = 'success'
          } else if (row.status === 'Failed') {
            type = 'error'
          }
          return <NTag type={type}>{row.status}</NTag>
        },
        filterOptions: [
          {
            label: 'None',
            value: 'None'
          },
          {
            label: 'Pending',
            value: 'Pending'
          },
          {
            label: 'Success',
            value: 'Success'
          },
          {
            label: 'Failed',
            value: 'Failed'
          }
        ],
        filter(value, row) {
          return value === row.status
        }
      },
      {
        title: 'Control',
        key: 'control',
        render(row) {
          return <NSpace>
            <NButton type="primary" onClick={() => checkTXStatus(row)}>{$t('Checktx')}</NButton>
            <NPopconfirm on-positive-click={() => resend(row)}>
              {{
                default(){
                  return $t('ConfirmResend')
                },
                trigger(){
                  return <NButton type="warning">{$t('Resend')}</NButton>
                }
              }}
            </NPopconfirm>
            <NButton type="warning" onClick={() => remove(row)}>{$t('Remove')}</NButton>
          </NSpace>
        }
      }
    ]
    let data = reactive([
      {
        name: '',
        address: '',
        amount: '',
        memo: '',
        hash: '',
        status: 'None'
      },
    ])

    const memo = ref('')

    function checkData() {
      while (data.find(e => e.status === 'Deleting')) {
        data.splice(data.findIndex(e => e.status === 'Deleting'), 1)
      }

      if (JSON.stringify(data[data.length - 1]) === '{"name":"","address":"","amount":"","memo":"","hash":"","status":"None"}'
          && JSON.stringify(data[data.length - 2]) === '{"name":"","address":"","amount":"","memo":"","hash":"","status":"None"}') {
        data.pop()
      }

      if (JSON.stringify(data[data.length - 1]) !== '{"name":"","address":"","amount":"","memo":"","hash":"","status":"None"}') {
        data.push({
          name: '',
          address: '',
          amount: '',
          memo: '',
          hash: '',
          status: 'None'
        })
      }
    }

    function checkTXStatus(row) {
      window.open(`https://www.mintscan.io/akash/txs/${row.hash}`, '_blank')
    }

    async function resend(row) {
      message.loading($t('Resending...'))
      if (JSON.stringify(row) === '{"name":"","address":"","amount":"","memo":"","hash":"","status":"None"}') return
      if (row.address === '' || row.amount === '') {
        notification.error({
          title: $t('Error'),
          content: $t('IncompleteData'),
          duration: 2000
        })
        row.status = 'Failed'
        return
      }
      if(row.status === 'Success' || row.status === 'Pending') {
        message.error($t('ResendStop'))
        return
      }
      if(row.memo.length > 255) {
        notification.error({
          title: $t('Error'),
          content: $t('Memo is too long'),
          duration: 2000
        })
        row.status = 'Failed'
        return
      }
      try{
        row.status = 'Pending'
        let result = await sendAKT(store.state.persistent.rpc, store.state.temporary.wallet, row.address, akt2uakt(row.amount), row.memo, '200', '80000')
        row.hash = result.transactionHash
        row.status = 'Success'
      }catch (e) {
        row.status = 'Failed'
        notification.error({
          title: $t('Error'),
          content: e.message,
          duration: 2000
        })
      }

      store.commit('persistent/refreshBalance')
    }

    function remove(row) {
      row.status = 'Deleting'
    }

    onMounted(() => {
      checkData()
    })

    watch(data, () => {
      checkData()
    }, {deep: true})

    watch(memo, (newVal, oldVal) => {
      if (newVal.length > 256) {
        console.log("Too long.")
        memo.value = oldVal
      }
      data.forEach(e => {
        e.memo = memo.value
      })
    })

    return {
      columns,
      data,
      summary: (pageData) => {
        return {
          name: {
            value: pageData.reduce((prevValue, row) => {
              if (JSON.stringify(row) !== '{"name":"","address":"","amount":"","memo":"","hash":"","status":"None"}') {
                return prevValue += 1
              } else {
                return prevValue
              }
            }, 0)
          },
          amount: {
            value: pageData.reduce((prevValue, row) => {
              if (JSON.stringify(row) !== '{"name":"","address":"","amount":"","memo":"","hash":"","status":"None"}') {
                if (parseFloat(row.amount).toString() !== "NaN") {
                  return prevValue += parseFloat(row.amount)
                } else {
                  return prevValue
                }
              } else {
                return prevValue
              }
            }, 0)
          },
          address: {value: null},
          hash: {value: null},
          memo: {value: null},
          status: {value: null},
          control: {value: null}
        }
      },
      rowKey: function () {
        return Math.random().toString(36).slice(-8)
      },
      memo,
      clearAll: function () {
        console.log(data)
        data.length = 0
        data.push({
          name: '',
          address: '',
          amount: '',
          memo: '',
          hash: '',
          status: 'None'
        })
      },
      exportData: function () {
        let sheet = xlsx.utils.json_to_sheet(data)
        let csv = xlsx.utils.sheet_to_csv(sheet)
        let blob = new Blob([csv], {type: "text/csv;charset=utf-8"})
        fileSaver.saveAs(blob, "export.csv")
      },
      importData: function (input) {
        let fileReader = new FileReader()
        fileReader.onload = function (e) {
          let sheet = xlsx.read(e.target.result, {type: 'string'})
          let readData = xlsx.utils.sheet_to_json(sheet.Sheets[sheet.SheetNames[0]], {defval: ''})
          data.length = 0
          for (let i of readData) {
            data.push(i)
          }
        }
        fileReader.readAsText(input.file.file)
      },
      sendAll: async function () {
        for (let i of data) {
          if (JSON.stringify(i) === '{"name":"","address":"","amount":"","memo":"","hash":"","status":"None"}') continue
          if (i.address === '' || i.amount === '') {
            notification.error({
              title: $t('Error'),
              content: $t('IncompleteData'),
              duration: 2000
            })
            i.status = 'Failed'
            continue
          }
          if(i.status === 'Success' || i.status === 'Pending') {
            continue
          }
          if(i.memo.length > 255) {
            notification.error({
              title: $t('Error'),
              content: $t('Memo is too long'),
              duration: 2000
            })
            i.status = 'Failed'
            continue
          }
          try{
            i.status = 'Pending'
            let result = await sendAKT(store.state.persistent.rpc, store.state.temporary.wallet, i.address, akt2uakt(i.amount), i.memo, '200', '80000')
            i.hash = result.transactionHash
            i.status = 'Success'
          }catch (e) {
            i.status = 'Failed'
            notification.error({
              title: $t('Error'),
              content: e.message,
              duration: 2000
            })
          }
        }

        store.commit('persistent/refreshBalance')
      }
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
</style>

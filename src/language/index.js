import { createI18n } from 'vue-i18n'
import zh from './zh-CN.json'
import en from './en-US.json'

//注册i8n实例并引入语言文件
const i18n = createI18n({
  globalInjection: true,
  legacy: false,
  locale: 'zh-CN',
  messages: {
    'zh-CN': zh,
    'en-US': en
  }
})

export default i18n; //将i18n暴露出去，在main.js中引入挂载

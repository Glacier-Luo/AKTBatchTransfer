import { createI18n } from 'vue-i18n'
import zh from './zh-CN.json'
import en from './en-US.json'

let locale = localStorage.getItem('locale') || 'en-US'

//注册i8n实例并引入语言文件
const i18n = createI18n({
  globalInjection: true,
  legacy: false,
  locale: locale,
  messages: {
    'zh-CN': zh,
    'en-US': en
  }
})

export function $t(args) {
  return i18n.global.t(args)
}

export function changeLanguage(arg) {
  i18n.global.locale = arg
  localStorage.setItem('locale', arg)
  window.location.reload()
}

export default i18n; //将i18n暴露出去，在main.js中引入挂载

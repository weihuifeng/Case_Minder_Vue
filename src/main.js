import Vue from 'vue'
import App from './App'
import router from './router'
import store from './store'
import 'element-ui/lib/theme-chalk/index.css'
import ElementUI from 'element-ui'
import $ from 'jquery'
// 引入拖拽组件
import './script/tool/mouseDrag.js'
// import dialogDrag from '@script/tool/mouseDrag'

require('../node_modules/codemirror/lib/codemirror.js')
require('../node_modules/codemirror/mode/xml/xml.js')
require('../node_modules/codemirror/mode/javascript/javascript.js')
require('../node_modules/codemirror/mode/css/css.js')
require('../node_modules/codemirror/mode/htmlmixed/htmlmixed.js')
// require('../node_modules/codemirror/mode/markdown/markdown.js')
require('../node_modules/codemirror/addon/mode/overlay.js')
require('../node_modules/codemirror/mode/gfm/gfm.js')
require('../node_modules/marked/lib/marked.js')

require('../node_modules/kity/dist/kity.js')

// require('../node_modules/hotbox/hotbox.js')
// require('../hotbox/hotbox.js')
require('../dist/lib/hotbox')
// require('../node_modules/kityminder-core/dist/kityminder.core.js')
// require('../kityminder-core/dist/kityminder.core.js')
require('../dist/lib/kityminder.core.js')

require('./script/expose-editor.js')

Vue.config.productionTip = true
Vue.use(ElementUI)

new Vue({
  el: '#app',
  router,
  store,
  template: '<App/>',
  components: {
    App
  }
})

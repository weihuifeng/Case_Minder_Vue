import CaseMinderVue from './App.vue'

CaseMinderVue.install = function(Vue){
    Vue.component(CaseMinderVue.name, CaseMinderVue);
}

export default CaseMinderVue
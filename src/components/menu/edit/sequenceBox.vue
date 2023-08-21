<template lang="">
<div class="sequence-group" >
  <ul :disabled="commandDisabled">
    <li
      v-for="(item, index) in items"
      class="menu-btn"
      :class="classArray(index)"
      @click="execCommand(index)"
      :title="title(index)" />
  </ul>
</div>
</template>

<script>

import eventNotify from '../../../script/runtime/eventNotify'

import {
  mapGetters,
  mapActions
} from 'vuex'
export default {
  name: 'sequenceBox',
  data() {
    return {
      items: [
        { id: '0' },
        { id: '1' },
        { id: '2' },
        { id: '3' },
        { id: '4' },
        { id: '5' },
        // { id: '6' },
        // { id: '7' },
        // { id: '8' },
        // { id: '9' }
      ],
    }
  },
  computed: {
    ...mapGetters({
      'minder': 'getMinder'
    }),
    commandDisabled() {
      var minder = this.minder
      minder.on && minder.on('interactchange', function () {
        this.commandValue = minder.queryCommandValue('priority');
      });
      // console.info("priority minder:",minder)
      // console.log("minder.queryCMDStat:",minder.queryCommandState)
      //CMD: 0可执行，-1不可执行，1可执行

      return minder.queryCommandState && minder.queryCommandState('priority') === -1;
    },
  },
  // mounted() {
  //   eventNotify.$on('syncMsg', data => {
  //     // console.log('syncMsg', data)
  //     this.execCommand(data)
  //   })
  // },
  methods: {
    execCommand(index) {
      this.commandDisabled || this.dealPriority(index);
    },
    dealPriority(index) {
      // 判断是否是最后一个节点,且无条件可以删除用例等级
      // console.log("子节点", minder.getSelectedNode().children)
      // update：不管是不是用例节点，都可以定义优先级
      // if (index < 5 && this.minder.getSelectedNode().children.length != 0) {
      //   return;
      // }

      index >= 5 ? this.minder.execCommand('priority', 0) : this.minder.execCommand('priority', index + 1)

    },
    classArray(index) {
      var isActive = this.minder.queryCommandValue && this.minder.queryCommandValue('priority') == index;
      var sequence = 'sequence-' + index;

      // 用数组返回多个class
      var arr = [{
        'active': isActive
      }, sequence]
      return arr
    },
    /*    //鼠标移上去显示
        title(index) {
          switch (index) {
            case 0:
              return '移除用例级别';
            default:
              return '用例级别' + index;
          }
        }*/

    //鼠标移上去显示
    title(index) {
      if (index >= 5) {
        return '移除用例级别';
      } else {
        return '用例级别P' + index;
      }
    },

  },

}
</script>

<style scoped>
/* 增加用例等级div长度 */
.mind-tab-panel .progress-group,
.mind-tab-panel .sequence-group {
  width: 100px;
}

.mind-tab-panel .progress-group ul,
.mind-tab-panel .sequence-group ul {
  width: 80px;
}

/* .sequence-group{
  background-color: red;
  width: 100px;
} */
</style>

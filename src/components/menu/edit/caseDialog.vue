<template>
    <div class="caseDialogDiv">
        <!-- Form -->
        <!-- :key="+newDate()" 每次生成新对象不生效 -->
        <!-- v-dialogDrag：实现拖拽 -->
        <el-dialog title="用例描述" v-if="caseDialogFormVisible" :visible.sync="caseDialogFormVisible" :modal="false"
            :close-on-click-modal="false" :destroy-on-close="true" v-dialogDrag @close="cancle">

            <!-- 去掉了 ref="caseTitle" -->
            <el-form :model="sizeForm" label-width="80px" size="mini">
                <el-form-item label="用例标题">
                    <el-input v-model="sizeForm.name" placeholder="用例标题" ref="firstInput"></el-input>
                </el-form-item>

                <el-form-item label="用例等级">
                    <el-select v-model="sizeForm.caseLevel" placeholder="请选择用例等级">
                        <el-option v-for="(item, index) in caseLevelArr" :label="item.level" :value="index"
                            :key="index">
                        </el-option>
                        <!-- <el-option value="P0 (最高优先：基本功能用例/冒烟用例/单元测试用例)"></el-option>
                        <el-option value="P1 (高优先：接口自动化用例)"></el-option>
                        <el-option value="P2 (高优先：手工测试用例)"></el-option>
                        <el-option value="P3 (中优先)"></el-option>
                        <el-option value="P4 (最低优先)"></el-option> -->
                    </el-select>
                </el-form-item>

                <el-form-item label="用例标签">
                    <el-select v-model="sizeForm.region2" placeholder="请选择用例标签">
                        <el-option label="用例标签1" value="tag-0"></el-option>
                        <el-option label="敬请期待" value="tag-1"></el-option>
                    </el-select>
                </el-form-item>

                <el-form-item label="前置步骤">
                    <!-- <p>前置步骤</p> -->
                    <el-input type="textarea" :rows="6" placeholder="前置步骤" v-model="textarea1" resize="none">
                    </el-input>
                </el-form-item>

                <el-form-item label="用例步骤">
                    <!-- <p>用例步骤</p> -->
                    <el-input type="textarea" :rows="6" placeholder="用例步骤" v-model="textarea2" resize="none">
                    </el-input>
                </el-form-item>

                <el-form-item label="预期结果">
                    <!-- <p>预期结果</p> -->
                    <el-input type="textarea" :rows="6" placeholder="预期结果" v-model="textarea3" resize="none">
                    </el-input>
                </el-form-item>

                <!-- <el-form-item size="large">
                    <el-button type="primary" @click="onSubmit">确定</el-button>
                    <el-button @click="cancle">取消</el-button>
                </el-form-item> -->
            </el-form>

            <div slot="footer" class="dialog-footer">
                <el-button @click="cancle">取 消</el-button>
                <el-button type="primary" @click="onSubmit">确 定</el-button>
            </div>

        </el-dialog>
    </div>
</template>

<script>

// 父子关系：editor-> mainEditor -> caseDialog---已调整为下面的父子关系
//        editor-> headerMenu(header) ->  editMenu -> sequenceBox
//                                                 ->  caseDialog

import eventNotify from '../../../script/runtime/eventNotify'

import {
    mapGetters,
    mapActions
} from 'vuex'
export default {
    computed: {
        ...mapGetters({
            'minder': 'getMinder'
        }),
    },

    // 将showDialog方法挂载到windows对象,提供给外部
    mounted() {
        window.showCaseDialog = this.showCaseDialogVue;
    },

    data() {
        return {
            caseDialogFormVisible: false,

            beforeTitle: null,
            beforeLevel: null,

            // caseTitle: {
            //     name: '',
            //     region: '',
            //     date1: '',
            //     date2: '',
            //     delivery: false,
            //     type: [],
            //     resource: '',
            //     desc: ''
            // },
            formLabelWidth: '120px',

            // elUI data
            sizeForm: {
                name: '',
                caseLevel: '',
                region2: '',
                date1: '',
                date2: '',
                delivery: false,
                type: [],
                resource: '',
                desc: ''
            },
            textarea1: '',
            textarea2: '',
            textarea3: '',

            diaglogFSM: {},
            timer: '',

            //caseLevel
            caseLevelArr: [
                { level: "P0(最高优先)" },
                { level: "P1(高优先)" },
                { level: "P2(中优先)" },
                { level: "P3(低优先)" },
                { level: "P4(暂时不执行)" },
            ]
        };
    },
    methods: {
        showCaseDialogVue(fsm) {
            this.caseDialogFormVisible = true;
            //弹窗状态
            // console.log("caseDialog fsm  -> ", fsm)
            this.diaglogFSM = fsm;

            // 初始化数据
            this.sizeForm.name = this.beforeTitle = minder.queryCommandValue('text') == '分支主题' ? null : minder.queryCommandValue('text')

            this.sizeForm.caseLevel = this.beforeLevel = minder.queryCommandValue('priority') == null ? null : minder.queryCommandValue('priority') - 1;
            // console.log("用例等级：", this.sizeForm.caseLevel)
            // console.log(this.minder)

            //自动聚焦到第一个输入框
            this.$nextTick(() => {
                this.$refs.firstInput.focus();
            });
        },
        cancle() {
            this.caseDialogFormVisible = false;
            // console.log("now fsm -> ", this.diaglogFSM)
            this.diaglogFSM.jump('normal', 'dialogCancle');
            this.cleanDate();
        },
        onSubmit() {
            // console.log('this-minder===',this.minder)
            console.log("提交用例")

            //内容发生变更，更新
            if (this.beforeTitle != this.sizeForm.name) {
                minder.execCommand('text', this.sizeForm.name);
            }

            if (this.beforeLevel != this.sizeForm.caseLevel) {
                this.syncMsg2SequenctBox();
            }

            this.caseDialogFormVisible = false;
            this.diaglogFSM.jump('normal', 'dialogCommit');
            this.cleanDate();
        },

        cleanDate() {
            // this.caseTitle = {
            //     name: '',
            //     region: '',
            //     date1: '',
            //     date2: '',
            //     delivery: false,
            //     type: [],
            //     resource: '',
            //     desc: ''
            // };
            this.sizeForm = {
                name: '',
                caseLevel: '',
                region2: '',
                date1: '',
                date2: '',
                delivery: false,
                type: [],
                resource: '',
                desc: ''
            };
            this.textarea1 = '';
            this.textarea2 = '';
            this.textarea3 = '';
        },

        // 将用例等级变更消息同步给sequenceBox
        syncMsg2SequenctBox() {
            eventNotify.$emit('syncMsg', this.sizeForm.caseLevel)
        }
    }

}
</script>

<style scoped>
.caseDialogDiv ::v-deep .el-input--mini .el-input__inner {
    font-size: larger;
}

.caseDialogDiv ::v-deep .el-textarea__inner {
    font-size: larger;
}

.caseDialogDiv ::v-deep .el-dialog {
    width: 680px;
}

.caseDialogDiv ::v-deep .el-select .el-input .el-select__caret {
    line-height: 20px;
}
</style>>

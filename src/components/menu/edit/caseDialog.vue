<template>
    <div class="caseDialogDiv">
        <!-- Form -->
        <!-- :key="+newDate()" 每次生成新对象不生效 -->
        <!-- v-dialogDrag：实现拖拽 -->
        <el-dialog title="用例描述" v-if="caseDialogFormVisible" :visible.sync="caseDialogFormVisible" :modal="false"
            :close-on-click-modal="false" :destroy-on-close="true" v-dialogDrag @close="cancle">

            <!-- 去掉了 ref="caseTitle" -->
            <el-form :model="caseForm" label-width="80px" size="mini">
                <el-form-item label="用例标题">
                    <el-input v-model="caseForm.caseTitle" placeholder="用例标题" ref="firstInput"></el-input>
                </el-form-item>

                <el-form-item label="用例等级">
                    <el-select v-model="caseForm.caseLevel" placeholder="请选择用例等级">
                        <el-option v-for="(item, index) in caseLevelArr" :label="item.level" :value="index"
                            :key="index">
                        </el-option>
                    </el-select>
                </el-form-item>

                <el-form-item label="用例标签">
                    <el-select v-model="caseForm.caseTagInfo" placeholder="请选择用例标签">
                        <el-option label="用例标签1" value="tag-0"></el-option>
                        <el-option label="暂不可用，敬请期待" value="tag-1"></el-option>
                    </el-select>
                </el-form-item>

                <el-form-item label="前置步骤">
                    <!-- <p>前置步骤</p> -->
                    <el-input type="textarea" :rows="6" placeholder="前置步骤" v-model="caseDetails.preStep" resize="none">
                    </el-input>
                </el-form-item>

                <el-form-item label="用例步骤">
                    <!-- <p>用例步骤</p> -->
                    <el-input type="textarea" :rows="6" placeholder="用例步骤" v-model="caseDetails.caseStep" resize="none">
                    </el-input>
                </el-form-item>

                <el-form-item label="预期结果">
                    <!-- <p>预期结果</p> -->
                    <el-input type="textarea" :rows="6" placeholder="预期结果" v-model="caseDetails.postStep" resize="none">
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

            originalTitle: null,
            originalLevel: null,
            originalTag:null,

            // form data
            caseForm: {
                caseTitle: '',
                caseLevel: '',
                caseTagInfo: '',
            },
            caseDetails:{
                preStep: '',
                caseStep: '',
                postStep: '',
            },

            //对话框状态
            diaglogFSM: {},

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

                    //初始化值
            this.caseForm.caseTitle = this.originalTitle = this.minder.queryCommandValue('text') == '分支主题' ? "" : minder.queryCommandValue('text');
            this.caseForm.caseLevel = this.originalLevel = this.minder.queryCommandValue('priority') == null ? "" : minder.queryCommandValue('priority') - 1;
            this.caseForm.caseTagInfo = this.originalTag = this.minder.queryCommandValue('resource') == null ? "" : minder.queryCommandValue('resource');
            if (typeof(this.minder.queryCommandValue('case')) != "undefined"){
                this.caseDetails = this.minder.queryCommandValue('case')
            }

            //自动聚焦到第一个输入框
            this.$nextTick(() => {
                this.$refs.firstInput.focus();
            });
        },

        //取消，清空数据，不做任何处理
        cancle() {
            this.caseDialogFormVisible = false;
            // console.log("now fsm -> ", this.diaglogFSM)
            this.diaglogFSM.jump('normal', 'dialogCancle');
            this.cleanDate();
        },

        onSubmit() {
            // 将用例信息保存到脑图对应节点
            // console.log(JSON.stringify(this.caseDetails));
            this.minder.execCommand('case', this.caseDetails);

            // console.log("提交用例")
            // console.log(minder.queryCommandValue('case'));

            // 同步节点数据
            if(this.caseForm.caseTitle !== this.originalTitle && this.caseForm.caseTitle !== ""){
                this.minder.execCommand('text', this.caseForm.caseTitle);
            }
            if(this.caseForm.caseLevel !== this.originalLevel && this.caseForm.caseLevel !== ""){
                this.minder.execCommand('priority', this.caseForm.caseLevel + 1);
            }
            // if(this.caseForm.caseTagInfo !== this.originalTag && this.caseForm.caseTagInfo !== ""){
            //     this.minder.execCommand('resource', this.caseForm.caseTagInfo);
            // }

            this.caseDialogFormVisible = false;
            this.diaglogFSM.jump('normal', 'dialogCommit');
            this.cleanDate();
        },

        cleanDate() {
            this.caseForm = {
                caseTitle: '',
                caseLevel: '',
                caseTagInfo: '',
            };
            this.caseDetails={
                preStep: '',
                caseStep: '',
                postStep: '',
            }

        },

        // 将用例等级变更消息同步给sequenceBox
        // syncMsg2SequenctBox() {
        //     eventNotify.$emit('syncMsg', this.caseForm.caseLevel)
        // }
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
</style>

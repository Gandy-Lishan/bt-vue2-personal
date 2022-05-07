<template>
   <el-tabs v-model="editableTabsValue" type="card"  @tab-click="clickTab" @tab-remove="removeTab" :before-leave="beforeLeave"
                     class="my-tab-pane">
                <el-tab-pane v-for="item in editableTabs"
                             :key="item.name"
                             :label="item.title"
                             :name="item.name">
                              </el-tab-pane>
                <el-tab-pane key="add" name="add"> //这是增加的按钮
					<span slot="label" style="padding: 8px;font-size:20px;font-weight:bold;">+</span>
                </el-tab-pane>
            </el-tabs>
</template>
<script>
export default {
  data() {
            return {
            	editableTabsValue: '1',
            	currentIndex:1,
                addIndex:1,
                tabIndex: 1, 
                editableTabs: [{
                    title: 'tab1',
                    name: '1',
                    }]
            }
        },
        methods: {
          /* 函数定义 */
/* 活动标签切换时触发 */
            beforeLeave(currentName,oldName) { //通过tab标签的切换事件触发增加的函数
                console.log(currentName)
                //如果name是add，则调用增加tab的函数
                if(currentName=="add"){
                    this.addTab()
                    return false
                }else{
                    this.currentIndex=currentName;
                }
                console.log(this.currentIndex)
            },
             addTab() {
                let newTabIndex = ++this.tabIndex + '';
                this.editableTabs.push({
                    title: 'tab'+ ++this.addIndex,
                    name: newTabIndex
                });
                this.editableTabsValue = newTabIndex;
                this.currentIndex=newTabIndex;
            },
            removeTab(targetName) {
                if(this.editableTabs.length <= 1){
                    return false;
                }
                var self=this;
                let tabs = self.editableTabs;
                let activeName = self.editableTabsValue;
                if (activeName === targetName) {
                    tabs.forEach((tab, index) => {
                        if (tab.name === targetName) {
                            let nextTab = tabs[index + 1] || tabs[index - 1];
                            if (nextTab) {
                                activeName = nextTab.name;
                            }
                        }
                    });
                }
                self.editableTabsValue = activeName;
                self.editableTabs = tabs.filter(tab => tab.name !== targetName);
                self.editableTabs.map((tab,index)=>{
                    tab.title="tab"+(index+1);
                    self.addIndex=(index+1);
                })
                self.currentIndex = self.editableTabsValue;
                self.editableTabs.map((tab,index)=>{
                    console.log(tab,index,self.currentIndex)
                    if(self.currentIndex === tab.name){
                        self.currentFlag = index;
                    }
                })
                self.$message({
                    type: 'success',
                    message: '删除成功!'
                });
            }
        }
}
</script>
<template>
<div class='row' style="margin-left:10px; margin-right:10px;">
        <div class="panel" style="border: 1px solid #67809F;">
                <div class="panel-heading  bg-blue-hoki bg-font-blue-hoki">
                    <h3 class="panel-title">Chart Summary</h3>
                </div>
                <div class="panel-body"> 
                        <p>These thumbnail charts are summary charts for those indicators we believe are indicative of overall market health.
                            The chart titles are hyperlinks...click to be taken to the main chart page.



                        </p>
                        <div class="table-loading">
                                <span>Retrieving Chart Data</span>
                                <i class="fa fa-cog fa-spin"></i>
                        </div>
                        <div class='col-md-12'>
                            <div class='row'>

                                <div class='col-md-6'>
                                    <div id='model_score_int' class='watermark' style="width:100%; min-width:400px; max-width:500px; margin: 0 auto"></div>
                                </div>
                                <div class='col-md-6'>
                                    <div id='model_score_bonds' class='watermark' style="width:100%; min-width:400px; max-width:500px; margin: 0 auto"></div>
                                </div>
                            
                            </div>
                            <div class='row'>
                                    <div class='col-md-6'>
                                            <div id='po_gold' class='watermark' style="width:100%; min-width:400px; max-width:500px; margin: 0 auto"></div>
                                        </div>
                                        <div class='col-md-6'>
                                            <div id='po_crude' class='watermark' style="width:100%; min-width:400px; max-width:500px; margin: 0 auto"></div>
                                        </div>
                            </div>
                        </div>
                      
                 
            </div>

                
        </div>
</div>
</template>
<script>
export default {
  name: 'Charts',
  data() {
    return {
    };
  },
};
</script>
<style lang="less" scoped>
@import "./index.less";
</style>
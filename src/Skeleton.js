// skeleton.js
import Vue from 'vue'
import homeSkeleton from './skeleton/homeSkeleton'

export default new Vue({
    components: {
        homeSkeleton
    },
    template: `
    <div>
      <homeSkeleton id="homeSkeleton" style="display:none;" />
    </div>
  `
})
 

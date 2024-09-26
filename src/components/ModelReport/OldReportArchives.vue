<template>
 <div class="page-content-wrapper">
   <div class="page-content">
     <div class="page-head">
       <div class="container">
         <!-- BEGIN PAGE TITLE -->
         <div class="page-title">
           <h1>{{ title }}</h1>
         </div>
         <!-- END PAGE TITLE -->
       </div>
     </div>
     <div class="container">
       <!-- <div class="row">
          <div class="col-md-12">
            <div v-if="Array.isArray(messages) && messages.length" class="flashed-messages">
              <div class="row">
                <div class="col-md-12">
                  <div v-for="(message, index) in messages" :key="index" :class="`alert alert-${message.category}`">
                    <a class="close" title="Close" href="#" @click.prevent="dismissAlert(index)">&times;</a>
                    {{ message.message }}
                  </div>
                </div>
              </div>
            </div>
          </div>
       </div> -->
       <div class="row">
         <div class="col-md-12">
           <!-- <ul class="page-breadcrumb breadcrumb">
             <li class="active">
               {{ title }}
             </li>
           </ul> -->
           <div class="portlet light">
             <div class="row">
               <div class="col-md-12">
                 <div class="col-md-9">
                   <div v-for="item in dailyReportBlogs" :key="item.id" class="row">
                     <div class="col-md-3 thumbnail">
                       <a :href="downloadLink(item.filename)">
                         <img class="thumbnail img_pad" :src="imageLink(item.image)" height="149" width="202" />
                       </a>
                     </div>
                     <div class="col-md-9">
                       <a :href="downloadLink(item.filename)" class="item-name primary-link">{{ item.title }}</a>
                       <br /><br />
                       <p><i>{{ formatDate(item.date) }}</i></p>
                       <p>{{ item.abstract }}</p>
                       <hr />
                       <div v-if="Array.isArray(item.forecasts) && item.forecasts.length">
                         <p><em>Forecast(s) associated with this report:</em></p>
                         <table class="table table-light table-condensed">
                           <thead>
                             <tr>
                               <th style="padding-right: 3px;">Forecast</th>
                               <th>Market</th>
                               <th>Timeframe</th>
                             </tr>
                           </thead>
                           <tbody>
                            <template v-for="forecast in item.forecasts">
                              <tr v-if="forecast.forecast !== 'None' && forecast.forecast !== ''" :key="forecast.id">
                               <td style="padding-right: 3px;">
                                 <i :class="forecastIconClass(forecast.forecast)" aria-hidden="true"></i>
                               </td>
                               <td>{{ forecast.market }}</td>
                               <td>{{ forecast.timeframe || 'None' }}</td>
                             </tr>
                            </template>
                           </tbody>
                         </table>
                         <hr />
                       </div>
                       <div v-if="item.DBtags">
                         <p>Tags:
                           <a v-for="tag in item.DBtags" :key="tag.tag" class="btn btn-primary btn-xs" role="button" :href="archiveLink(tag.tag)">{{ tag.tag }}</a>
                         </p>
                       </div>
                       <div v-else-if="item.tags">
                         <p>Tags:
                           <a v-for="tag in item.tags" :key="tag" class="btn btn-primary btn-xs" role="button" :href="archiveLink(tag.tag)">{{ tag.tag }}</a>
                         </p>
                       </div>

                     </div>
                     <div style="clear: both;"></div>
                     <hr />
                   </div>
                   <PreviousNextPage :previousPage="previousPage" :currentPage="currentPage" :nextPage="nextPage" :total="total" :serviceType="serviceType" />
                 </div>

               <!-- Archives Sidebar -->
               <div class="col-md-3 well">
                 <div style="text-align: center;">
                   <h3>Archives by Year</h3>
                 </div>

                 <a
                   v-for="year in archiveYears"
                   :key="year"
                   :href="`/MR/${year <= 2019 ? 'old_' : ''}archived_reports/${year}`"
                   class="btn blue btn-block"
                 >
                   {{ year }} Archives
                 </a>
               </div>
               </div>
             </div>
           </div>
         </div>
       </div>
     </div>
   </div>
 </div>
</template>

<script>
import { getOldArchivedReports } from "@/service/service";
import PreviousNextPage from './component/PreviousNextPage';

export default {
 data() {
   return {
     title: 'Your Title', // Replace with dynamic title
     dailyReportBlogs: [], // Your reports data
     archiveYears: [2024, 2023, 2022, 2021, 2020, 2019, 2018, 2017, 2016, 2015],
     year: '',
     previousPage: null,
     currentPage: 1, // 当前页码
     nextPage: 2,
     total: 0,
     serviceType: 'old_archived_reports',
   };
 },
 components: {
  PreviousNextPage
 },
 beforeRouteEnter(to, from, next) {
  console.log('to', to)
  console.log('from', from)
  debugger
  if (to.path.includes('/MR/old_archived_reports')) {
    next(async _this => {
      const page = to.params.page || ''
      const year = to.params.year || (new Date()).getFullYear()
      _this.year = year
      _this.serviceType = `old_archived_reports/${year}`
      _this.title = `Archived Reports for ${year}${(page && page != 1) ?  ` - Page ${page}`: ''}`
      const {data: {results, count, previous, next}} = await getOldArchivedReports({
        year,
        page: !page ? _this.currentPage : page
      })
      console.log('res', results)
      const getPageValue = (url) => {
        if(url === null) return url
        const regex = /[?&]page=(\d+)/
        const match = url.match(regex)
        return match ? match[1] : null
      }
      _this.total = Math.ceil(Number(count) / 10);
      _this.previousPage = getPageValue(previous)
      _this.nextPage = getPageValue(next)
      if(_this.nextPage) _this.currentPage = (Number(_this.nextPage) - 1)
      if(page) _this.currentPage = Number(page)
      _this.dailyReportBlogs = results
    })
    } else {
      next()
    }
  },
 methods: {
   downloadLink(filename) {
    //  return `/user/download_file/${filename}`;
     return `https://users.sentimentrader.com/users/report/${filename}`
   },
   imageLink(image) {
     return `https://dnpgic06wp5lx.cloudfront.net/${image}`;
   },
   formatDate(dateStr) {
     let formattedDate = ''
    if (dateStr) {
      const dateObj = new Date(dateStr);

      if (!isNaN(dateObj)) {
          const options = { year: 'numeric', month: 'long', day: '2-digit' };
          formattedDate = new Intl.DateTimeFormat('en-US', options).format(dateObj);
      } else {
          console.log("Invalid date format");
      }
    } else {
        console.log("Date is null or undefined");
    }
    return formattedDate
   },
   forecastIconClass(forecast) {
     if (forecast === 'Up') return 'font-green-jungle font-lg fa fa-arrow-up';
     if (forecast === 'Down') return 'font-red-thunderbird font-lg fa fa-arrow-down';
     return 'font-lg fa fa-minus';
   },
   archiveLink(tag) {
     return `https://users.sentimentrader.com/users/report_archives/${tag}`;
   },
   archiveYearLink(year) {
     return `/user/archived_reports_${year}`;
   }
 }
};
</script>
<style lang="less" scoped>
/* 自定义样式 */
.well {
 background-color: #eee;
 border: 0;
 box-shadow: none;
}
.well {
 min-height: 20px;
 padding: 19px;
 margin-bottom: 20px;
 border-radius: 4px;
}
.well a {
 margin: 4px 0;
}
.blue.btn {
 color: #fff;
 background-color: #4b8df8;
}
.btn-block {
 display: block;
 width: 100%;
 padding-left: 0;
 padding-right: 0;
}
.btn {
 border-width: 0;
 padding: 7px 14px;
 font-size: 14px;
 outline: 0;
 background-image: none;
 filter: none;
 box-shadow: none;
 text-shadow: none;
}
.page-head {
  padding-top: 0px;
}
.primary-link {
  font-weight: 600;
}
.btn-primary {
  color: #fff;
  background-color: #428bca;
  border-color: #357ebd;
  margin-right: 5px;
}
.btn-xs {
  padding: 1px 5px;
}
table {
  border-spacing: 0;
  border-collapse: collapse;
}

table {
  background-color: transparent;
}

.table {
  width: 100%;
  max-width: 100%;
  margin-bottom: 20px;
}

.table.table-light {
  border: 0 !important;
}
.table>caption+thead>tr:first-child>th, .table>colgroup+thead>tr:first-child>th, .table>thead:first-child>tr:first-child>th, .table>caption+thead>tr:first-child>td, .table>colgroup+thead>tr:first-child>td, .table>thead:first-child>tr:first-child>td {
  border-top: 0;
}

.table.table-light>thead>tr>th {
  font-weight: 600;
  font-size: 13px;
  color: #93a2a9;
  font-family: "Open Sans", sans-serif;
  border: 0;
  border-bottom: 1px solid #f2f5f8;
}
.table thead tr th {
  font-size: 14px;
  font-weight: 600;
}
.table>thead>tr>th {
  vertical-align: bottom;
  border-bottom: 2px solid #ddd;
}
th {
  text-align: left;
}
.table.table-light>tbody>tr:last-child>td {
    border: 0;
}
.table.table-light>tbody>tr>td {
  border: 0;
  border-bottom: 1px solid #f2f5f8;
  color: #8896a0;
  vertical-align: middle;
}
.table-condensed>thead>tr>th, .table-condensed>tbody>tr>th, .table-condensed>tfoot>tr>th, .table-condensed>thead>tr>td, .table-condensed>tbody>tr>td, .table-condensed>tfoot>tr>td {
    padding: 5px;
}
.table>thead>tr>th, .table>tbody>tr>th, .table>tfoot>tr>th, .table>thead>tr>td, .table>tbody>tr>td, .table>tfoot>tr>td {
  padding: 8px;
  line-height: 1.42857143;
  vertical-align: top;
  border-top: 1px solid #ddd;
}
</style>
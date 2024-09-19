<template>
  <div class="main">
    <div class="container">
      <div class="row">
        <div class="col-md-12">
          <div class="page-head">
            <h1 v-html="title" class="page-title"></h1>
          </div>
          <hr />
          <p>
            This page lists studies that were provided in a Daily Report. At the time
            of the report, the study forecasted a market direction (up, down, or flat)
            and usually highlighted its most effective time frame, which has now
            passed. Now that the study is "completed", it is graded from 1 star to 5
            stars. A rating of 1 means the forecast was not accurate and a rating of 5
            means the forecast was very accurate.
          </p>
          <p>
            Forecast Legend:
            <i class="font-green-jungle font-lg fa fa-arrow-up" aria-hidden="true"></i>
            (Up),
            <i class="font-red-thunderbird font-lg fa fa-arrow-down" aria-hidden="true"></i>
            (Down),
            <i class="font-lg fa fa-minus" aria-hidden="true"></i> (Flat).
          </p>

          <table
            id="example"
            class="display compact_archived_studies table-active-toolbar"
            cellspacing="0"
            width="100%"
          >
            <thead>
              <tr>
                <th>Date</th>
                <th>Report Title</th>
                <th>Market</th>
                <th>Forecast</th>
                <th>Outcome</th>
                <th>Rating</th>
                <th>Timeframe</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="(forecast, index) in forecasts" :key="index" v-if="forecast.market && forecast.market !== 'None' && forecast.market !== 'Null'">
                <td>
                  <center>{{ forecast.date }}</center>
                </td>

                <td>
                  <a
                    v-if="index.endsWith('-blog')"
                    :href="`/public/blog_post/${forecast.filename}`"
                    target="_blank"
                    class="item-name primary-link"
                  >
                    {{ forecast.title }}
                  </a>
                  <a
                    v-else
                    :href="`/user/download_file/${forecast.filename}`"
                    target="_blank"
                    class="item-name primary-link"
                  >
                    {{ forecast.title }}
                  </a>
                </td>

                <td>
                  <center>{{ forecast.market }}</center>
                </td>

                <td>
                  <center>
                    <i
                      v-if="forecast.forecast === 'Up'"
                      class="font-green-jungle font-lg fa fa-arrow-up"
                      aria-hidden="true"
                    ></i>
                    <i
                      v-else-if="forecast.forecast === 'Down'"
                      class="font-red-thunderbird font-lg fa fa-arrow-down"
                      aria-hidden="true"
                    ></i>
                    <i
                      v-else-if="forecast.forecast === 'Flat'"
                      class="font-lg fa fa-minus"
                      aria-hidden="true"
                    ></i>
                  </center>
                </td>

                <td>
                  <center>
                    <i
                      v-if="forecast.outcome === 'Up'"
                      class="font-green-jungle font-lg fa fa-arrow-up"
                    ></i>
                    <i
                      v-else-if="forecast.outcome === 'Down'"
                      class="font-red-thunderbird font-lg fa fa-arrow-down"
                    ></i>
                    <i
                      v-else-if="forecast.outcome === 'Flat'"
                      class="font-lg fa fa-minus"
                    ></i>
                  </center>
                </td>

                <td>
                  <center>
                    <template v-if="forecast.rating">
                      <i v-for="n in forecast.rating" :key="n" class="fa fa-star"></i>
                      <i
                        v-for="n in 5 - forecast.rating"
                        :key="'empty-' + n"
                        class="fa fa-star-o"
                      ></i>
                    </template>
                    <template v-else>
                      <i class="fa fa-star-o"></i>
                      <i class="fa fa-star-o"></i>
                      <i class="fa fa-star-o"></i>
                      <i class="fa fa-star-o"></i>
                      <i class="fa fa-star-o"></i>
                    </template>
                  </center>
                </td>

                <td>
                  <center>{{ forecast.timeframe }}</center>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'ArchivedStudies',
  props: {
    title: String
  },
 data() {
   return {
     forecasts: [] // 从后端获取数据并填充
   };
 }
};
</script>

<style scoped>
/* Add your styles here */
</style>
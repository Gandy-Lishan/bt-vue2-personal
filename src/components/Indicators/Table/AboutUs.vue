<template>
 <div class="page-footer">
    <div class="pre-footer">
      <div class="container">
        <div class="row">
          <!-- BEGIN BOTTOM ABOUT BLOCK -->
          <div class="col-md-8 col-sm-6 pre-footer-col">
            <h2>About us</h2>
            <p>
              Sundial Capital Research is an independent investment research firm dedicated to the application of mass
              psychology to the financial markets. Sundial publishes the SentimenTrader.com website.
            </p>
            <p>
              Our focus is not market timing per se, but rather risk management. That may be a distinction without a
              difference, but it's how we approach the markets. We study signs that suggest it is time to raise or lower
              market exposure as a function of risk relative to probable reward. It is all about risk-adjusted
              expectations given existing evidence.
            </p>
          </div>
          <!-- END BOTTOM ABOUT BLOCK -->
          <!-- BEGIN BOTTOM CONTACTS -->
          <div class="col-md-4 col-sm-6 pre-footer-col">
            <h2>Contact Information</h2>
            <address class="margin-bottom-40">
              <p>Sundial Capital Research</p>
              <p>12527 Central Avenue NE, Suite 165</p>
              <p>Blaine, MN 55434</p>
              <p>Email:
                <a target="_blank" href="mailto:admin@sentimentrader.com">admin@sentimentrader.com</a>
              </p>
              <p>
              Twitter:
              <a target="_blank" href="http://twitter.com/sentimentrader">@sentimentrader</a>
              </p>
            </address>
          </div>
          <!-- END BOTTOM CONTACTS -->
        </div>
        
        <div class="indi-footer">
          <div class="container">
            <div class="row">
              <!-- BEGIN COPYRIGHT -->
              <div class="col-md-8 col-sm-8 padding-top-10">
                © 2001 - <span>{{ currentYear }}</span>, Sundial Capital Research, Inc. All rights reserved.
                <a target="_blank" href="https://sentimentrader.com/privacy_policy/">Privacy Policy</a> |
                <a target="_blank" href="https://btv2.sentimentrader.com/doc/disclaimer">Disclaimer</a> |
                <a target="_blank" href="https://status.sentimentrader.com/">Status Page</a>
              </div>
              <!-- END COPYRIGHT -->
              <!-- BEGIN PAYMENTS -->
              <div class="col-md-4 col-sm-4">
                <ul class="social-footer list-unstyled list-inline">
                  <iframe
                    id="twitter-widget-0"
                    scrolling="no"
                    frameborder="0"
                    allowtransparency="true"
                    allowfullscreen="true"
                    class="twitter-follow-button twitter-follow-button-rendered"
                    title="Twitter Follow Button"
                    :src="twitterIframeSrc"
                    style="position: static; visibility: visible; width: 188px; height: 28px;"
                  ></iframe>
                </ul>
              </div>
              <!-- END PAYMENTS -->
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'AboutUs',
  data() {
    return {
      currentYear: new Date().getFullYear(),
      twitterIframeSrc:
        "https://platform.twitter.com/widgets/follow_button.2f70fb173b9000da126c79afe2098f02.en.html#dnt=false&id=twitter-widget-0&lang=en&screen_name=sentimentrader&show_count=false&show_screen_name=true&size=l&time=" +
      new Date().getTime()
    }
  }
}
</script>

<style lang="less" scoped>
.page-footer {
  width: 100%;
  margin-top: 80px;
  background-color: #2e2e2e; /* 深色背景 */
  color: #b0b0b0; /* 字体颜色 */
  padding: 20px 0;
  font-family: "Open Sans",sans-serif;
  .pre-footer {
    padding: 20px 40px;

    h2 {
      margin-top: 20px;
      margin-bottom: 10px;
      font-weight: 300;
      font-size: 27px;
    }

    p, address {
      line-height: 1.6;
      margin: 0 0 10px;
      font-size: 1rem;
      font-weight: 300;
      font-style: normal;
      p {
        margin: 0 0 8px 0;
      }
    }
  }
    border-top: 1px solid #444; /* 分隔线颜色 */
    padding: 20px 0;

    .container {
      padding-right: 15px;
      padding-left: 15px;
      margin-left: auto;
      margin-right: auto;
      .row {
        display: flex;
        justify-content: space-between;
        align-items: flex-start;
      }
      .col-md-8 {
        width: 66.66%;
      }
      .col-md-4 {
        width: 33.33%;
      }
      .col-md-8, .col-sm-8 {
        font-size: 14px;

        a {
          color: #4aa3df; /* 链接颜色 */
          text-decoration: none;

          &:hover {
            text-decoration: underline;
          }
        }
      }

      .col-md-4, .col-sm-4 {
        text-align: left;

        .social-footer {
          margin: 0;
          padding: 0;
          list-style: none;

          .twitter-follow-button {
            background-color: #000;
            border-radius: 50px;
            display: inline-block;
            padding: 1px 12px 1px 12px;
            font-size: 16px;
            border: none;
            cursor: pointer;

            &:hover {
              background-color: #4aa3df;
            }
          }
        }
      }
    }
}
@media (max-width: 1200px) {
.page-footer .container .row {
  display: block;
}
}
</style>
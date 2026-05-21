<template>
 <div class="contact-container">
  <div class="contact-form-wrapper">
    <h1 class="contact-title">My Stuff Concierge Setup Service</h1>
      <!-- 标签页导航 -->
      <!-- <div class="tab-navigation">
          <button 
              v-for="(tab, index) in tabs" 
              :key="index"
              :class="['tab-button', { active: activeTab === index }]"
              @click="switchTab(index)"
          >
              {{ tab.title }}
          </button>
      </div> -->

      <!-- 表单内容 -->
      <div class="contact-form-content">
          <!-- <h2 class="form-title">{{ tabs[activeTab].title }}</h2> -->
          <div class="form-description">
            <p>Making Personalized Market Tools Easier to Build</p>
            <p>One of the most common hurdles we hear from clients is:</p>
            <p>I know what I want to monitor or customize, but setting it up inside My Stuff Tools feels complicated.</p>
            <p>That’s exactly why we built the My Stuff Concierge Setup Service — so your custom signals, indicators, screens, and watchlists can be created without the technical setup getting in the way.            </p>
            <ul>
             <b>What we can help you create:</b>
                <li><b>My Signal</b>: Automated rules for monitoring specific market conditions and sending daily alerts.</li>
                <li><b>My Indicator</b>: Custom indicators based on your idea, which can be used for monitoring, alerts, and backtesting. </li>
                <li><b>My Screen</b>: Custom screens to help filter stocks or ETFs based on the conditions you care about. </li>
                <li><b>My Watchlist</b>: Personalized ticker lists with the indicators or data columns you want to follow.</li>
            </ul>
            <ul>
             <b>How it works:</b>
                <li>You describe what you want to monitor, measure, screen, or track in plain English. </li>
                <li>Our team translates your idea into a custom setup inside My Stuff.</li>
                <li>The finished setup appears in your portal, ready for you to review, use, and refine.</li>
            </ul>
            <p>Email your request to <a target="_blank" href="mailto:admin@sentimentrader.com">admin@sentimentrader.com</a> - Every idea is welcome.</p>
            <p><b>Here are a few examples of ideas you can send us:</b></p>
            <ul>
             <li><b>My Signal:</b> I want to know when Nasdaq sentiment becomes extremely bearish, so I can watch for potential signs of stress or capitulation.</li>
             <li><b>My Indicator:</b> Compare the VIX with its recent average to show when volatility is unusually elevated or starting to normalize.</li>
             <li><b>My Screen:</b> Find S&P 500 stocks that are still in an uptrend but have pessimistic sentiment, so I can review potential candidates.</li>
             <li><b>My Watchlist:</b> Monitor the stocks, core ETFs, and major indexes I actively follow in one place, with key trend, sentiment, and recent price behavior data side by side.</li>
            </ul>
        </div>

          <form @submit.prevent="submitForm" class="contact-form">
              <div class="form-group">
                  <label for="name">Name</label>
                  <input 
                      type="text" 
                      id="name" 
                      v-model="formData.name"
                      placeholder="Your name"
                      required
                  >
              </div>

              <div class="form-group">
                  <label for="email">Email</label>
                  <input 
                      type="email" 
                      id="email" 
                      v-model="formData.email"
                      placeholder="you@company.com"
                      required
                  >
              </div>

              <div class="form-group">
                  <label for="message">Message</label>
                  <textarea 
                      id="message" 
                      v-model="formData.message"
                      placeholder="Type your message..."
                      rows="6"
                      required
                  ></textarea>
              </div>

              <button 
                  type="submit" 
                  :class="['submit-button', { loading: isSubmitting }]"
                  :disabled="isSubmitting"
              >
                  {{ submitButtonText }}
              </button>
          </form>
      </div>
  </div>
 </div>
</template>

<script>
import { sendContactTicketFront } from '@/service/service.js';

export default {
name: 'StuffContact',
 data() {
  return {
    activeTab: 0,
    tabs: [
        {
            title: 'General Inquiries',
            description: 'We value your interest and are committed to supporting you every step of the way. Contact us today — we\'re eager to hear from you and help you take advantage of the powerful opportunities our ML technology offers.'
        },
        // {
        //     title: 'Media Inquiries',
        //     description: 'For media-related questions, press inquiries, and interview requests, please use this form to get in touch with our media relations team.'
        // },
        // {
        //     title: 'Financial Professionals Inquiries',
        //     description: 'Connect with our financial professionals team for investment opportunities, partnership discussions, and financial services inquiries.'
        // }
    ],
    formData: {
        name: '',
        email: '',
        message: ''
    },
    isSubmitting: false
 }
 },
 computed: {
  submitButtonText() {
      return this.isSubmitting ? 'Submitting...' : 'Submit';
  }
 },
 methods: {
  async submitForm() {
   if (this.isSubmitting) return;
   
   // 基本验证
   if (!this.formData.name.trim()) {
       this.popUpMsgBox('Please enter your name');
       return;
   }
   if (!this.formData.email.trim()) {
       this.popUpMsgBox('Please enter your email');
       return;
   }
   
   if (!this.formData.message.trim()) {
       this.popUpMsgBox('Please enter your message');
       return;
   }
   // 邮箱格式验证
   const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
   if (!emailRegex.test(this.formData.email)) {
       this.popUpMsgBox('Please enter a valid email address');
       return;
   }
   const cyrillicPattern = /^[\u0400-\u04FF]+$/;
    if (cyrillicPattern.test(this.formData.message)) {
      this.popUpMsgBox('Message contains unsupported characters.');
      return;
    }
   this.isSubmitting = true;
   try {
    await sendContactTicketFront({
    data: this.formData, isInquiry: false, isEnterprise: false, subject: 'My Stuff Concierge Setup Service'
   })
   this.popUpMsgBox('Thanks! Your message has been received. Our team will reach out soon.', 'success');

   } catch (error) {
    console.log('error', error);
    this.popUpMsgBox('Something went wrong. Please try again later.');
   } finally {
    this.isSubmitting = false;
   }
  },
  switchTab(index) {
   this.activeTab = index;
  }
},
}
</script>

<style scoped lang="less">
* {
    margin: 0;
    padding: 0;
    box-sizing: border-box;
}
.contact-container {
    /* min-height: 100vh; */
    display: flex;
    align-items: center;
    justify-content: center;
    padding: 20px;
    font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, Cantarell, sans-serif;
    color: #000000;
    line-height: 1.6;
    margin-top: 20px;
}
.contact-title {
    font-size: 24px;
    font-weight: 600;
    margin: 20px 0 0px 0px;
    background-color: transparent;
    border: none;
    outline: none;
    text-align: center;
}
.contact-form-wrapper {
    border-radius: 16px;
    box-shadow: 0 10px 40px rgba(0, 0, 0, 0.1);
    overflow: hidden;
    width: 100%;
    max-width: 1000px;
}

/* 标签页导航样式 */
.tab-navigation {
    display: flex;
    background-color: #e8f2ff;
    padding: 8px;
    gap: 4px;
}

.tab-button {
    flex: 1;
    padding: 12px 16px;
    border: none;
    background: transparent;
    color: #6b7280;
    font-size: 14px;
    font-weight: 500;
    border-radius: 8px;
    cursor: pointer;
    transition: all 0.3s ease;
    text-align: center;
}

.tab-button:hover {
    background-color: rgba(59, 130, 246, 0.1);
    color: #3b82f6;
}

.tab-button.active {
    background-color: #3b82f6;
    color: white;
    box-shadow: 0 2px 8px rgba(59, 130, 246, 0.3);
}

/* 表单内容样式 */
.contact-form-content {
    padding: 20px;
}

.form-title {
    font-size: 24px;
    font-weight: 600;
    color: #3b82f6;
    margin-bottom: 16px;
}

.form-description {
    color: #485467;
    font-size: 16px;
    line-height: 1.6;
    margin-bottom: 32px;
    font-weight: 500;
    p{
        margin-bottom: 10px;
    }
    ul {
        margin-bottom: 10px;
        // list-style-type: disc;
    }
    li {
        padding-left: 10px;
        position: relative;
        // &::before {
        //     content: '•';
        //     position: absolute;
        //     left: 0;
        //     color: #000000;
        // }
    }
}

/* 表单样式 */
.contact-form {
    display: flex;
    flex-direction: column;
    gap: 24px;
}

.form-group {
    display: flex;
    flex-direction: column;
    gap: 8px;
}

.form-group label {
    font-size: 14px;
    font-weight: 500;
    color: #374151;
}

.form-group input,
.form-group textarea {
    padding: 12px 16px;
    border: 2px solid #e5e7eb;
    border-radius: 8px;
    font-size: 16px;
    transition: all 0.3s ease;
    background-color: #fafafa;
}

.form-group input:focus,
.form-group textarea:focus {
    outline: none;
    border-color: #3b82f6;
    background-color: white;
    box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.1);
}

.form-group input::placeholder,
.form-group textarea::placeholder {
    color: #9ca3af;
}

.form-group textarea {
    resize: vertical;
    min-height: 120px;
    font-family: inherit;
}

/* 提交按钮样式 */
.submit-button {
    background-color: #6b7280;
    color: white;
    border: none;
    padding: 16px 24px;
    border-radius: 8px;
    font-size: 16px;
    font-weight: 600;
    cursor: pointer;
    transition: all 0.3s ease;
    margin-top: 8px;
}

.submit-button:hover {
    background-color: #4b5563;
    transform: translateY(-1px);
    box-shadow: 0 4px 12px rgba(107, 114, 128, 0.3);
}

.submit-button:active {
    transform: translateY(0);
}

.submit-button:disabled {
    background-color: #9ca3af;
    cursor: not-allowed;
    transform: none;
    box-shadow: none;
}

/* 响应式设计 */
@media (max-width: 768px) {
    .contact-container {
        padding: 16px;
    }
    
    .contact-form-content {
        padding: 24px;
    }
    
    .form-title {
        font-size: 20px;
    }
    
    .form-description {
        font-size: 14px;
    }
    
    .tab-button {
        padding: 10px 12px;
        font-size: 13px;
    }
    
    .contact-form {
        gap: 20px;
    }
}

@media (max-width: 480px) {
    .tab-navigation {
        flex-direction: column;
        gap: 8px;
    }
    
    .tab-button {
        text-align: center;
    }
    
    .contact-form-content {
        padding: 20px;
    }
}

/* 动画效果 */
.contact-form-wrapper {
    animation: fadeInUp 0.6s ease-out;
}

@keyframes fadeInUp {
    from {
        opacity: 0;
        transform: translateY(30px);
    }
    to {
        opacity: 1;
        transform: translateY(0);
    }
}

/* 表单验证状态 */
.form-group input.error,
.form-group textarea.error {
    border-color: #ef4444;
    background-color: #fef2f2;
}

.form-group input.error:focus,
.form-group textarea.error:focus {
    box-shadow: 0 0 0 3px rgba(239, 68, 68, 0.1);
}

/* 加载状态 */
.submit-button.loading {
    position: relative;
    color: transparent;
}

.submit-button.loading::after {
    content: '';
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    width: 20px;
    height: 20px;
    border: 2px solid transparent;
    border-top: 2px solid white;
    border-radius: 50%;
    animation: spin 1s linear infinite;
}

@keyframes spin {
    0% { transform: translate(-50%, -50%) rotate(0deg); }
    100% { transform: translate(-50%, -50%) rotate(360deg); }
}

</style>
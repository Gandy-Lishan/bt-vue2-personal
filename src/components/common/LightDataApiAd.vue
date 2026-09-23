<template>
  <section v-if="visible" class="light-data-ad" aria-label="Light Data API promotion">
    <div class="light-data-ad__icon" aria-hidden="true">
      <i class="fa fa-database"></i>
    </div>
    <span class="light-data-ad__badge">NEW</span>
    <div class="light-data-ad__copy">
      <strong class="light-data-ad__title">Use SentimenTrader data in your own system with Light Data API</strong>
      <span class="light-data-ad__divider" aria-hidden="true"></span>
      <span class="light-data-ad__description">Access full historical data and ongoing updates for your selected indicators.</span>
    </div>
    <div class="light-data-ad__meta">Starts at $300/year <span aria-hidden="true">·</span> 10 indicators</div>
    <a
      class="light-data-ad__cta"
      href="https://sentimentrader.com/light-indicator-api"
      target="_blank"
      rel="noopener noreferrer"
    >
      <span>Explore Light Data API</span>
      <i class="fa fa-arrow-right" aria-hidden="true"></i>
    </a>
    <button class="light-data-ad__close" type="button" @click="visible = false">
      <i class="fa fa-times" aria-hidden="true"></i>
      <span class="light-data-ad__sr-only">Close Light Data API promotion</span>
    </button>
  </section>
</template>

<script>
export default {
  name: 'LightDataApiAd',
  data() {
    return {
      visible: true
    }
  }
}
</script>

<style lang="less" scoped>
.light-data-ad {
  display: flex;
  align-items: center;
  gap: 14px;
  min-height: 54px;
  margin: 10px 16px 8px;
  padding: 10px 16px;
  box-sizing: border-box;
  border: 1px solid #cfe0ff;
  border-radius: 8px;
  background: linear-gradient(180deg, #ffffff 0%, #f8fbff 100%);
  box-shadow: 0 4px 18px rgba(31, 103, 215, 0.08);
  color: #0c155f;
  font-family: "Open Sans", sans-serif;
}

.light-data-ad__icon {
  flex: 0 0 auto;
  width: 30px;
  height: 30px;
  display: flex;
  align-items: center;
  justify-content: center;
  color: #0066ff;
  font-size: 26px;
}

.light-data-ad__badge {
  flex: 0 0 auto;
  min-width: 58px;
  height: 24px;
  padding: 0 12px;
  box-sizing: border-box;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  border-radius: 999px;
  background: #0066ff;
  color: #ffffff;
  font-size: 12px;
  line-height: 1;
  font-weight: 700;
}

.light-data-ad__copy {
  flex: 1 1 auto;
  min-width: 220px;
  display: flex;
  align-items: center;
  gap: 14px;
}

.light-data-ad__title {
  min-width: 0;
  color: #0b155f;
  font-size: 16px;
  line-height: 1.25;
  font-weight: 700;
}

.light-data-ad__divider {
  flex: 0 0 auto;
  width: 1px;
  height: 28px;
  border-radius: 2px;
  background: #d4e4ff;
}

.light-data-ad__description {
  min-width: 210px;
  color: #354a92;
  font-size: 14px;
  line-height: 1.35;
  font-weight: 500;
}

.light-data-ad__meta {
  flex: 0 0 auto;
  color: #1f2c66;
  font-size: 13px;
  line-height: 1.2;
  font-weight: 700;
  white-space: nowrap;
}

.light-data-ad__cta {
  flex: 0 0 auto;
  min-height: 34px;
  padding: 0 14px;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  border-radius: 6px;
  background: #0066ff;
  color: #ffffff;
  font-size: 14px;
  line-height: 1;
  font-weight: 700;
  text-decoration: none;
  box-shadow: 0 8px 14px rgba(0, 102, 255, 0.16);
  transition: background-color 0.2s ease, box-shadow 0.2s ease;
  white-space: nowrap;
}

.light-data-ad__cta:hover,
.light-data-ad__cta:focus {
  background: #0059df;
  color: #ffffff;
  box-shadow: 0 10px 18px rgba(0, 102, 255, 0.22);
}

.light-data-ad__close {
  flex: 0 0 auto;
  width: 26px;
  height: 26px;
  padding: 0;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  border: 0;
  background: transparent;
  color: #0c155f;
  font-size: 18px;
  line-height: 1;
  cursor: pointer;
}

.light-data-ad__close:hover,
.light-data-ad__close:focus {
  color: #0066ff;
}

.light-data-ad__sr-only {
  position: absolute;
  width: 1px;
  height: 1px;
  padding: 0;
  overflow: hidden;
  clip: rect(0, 0, 0, 0);
  white-space: nowrap;
  border: 0;
}

@media (max-width: 1480px) {
  .light-data-ad {
    gap: 12px;
    padding: 9px 14px;
  }

  .light-data-ad__copy {
    gap: 12px;
  }

  .light-data-ad__title {
    font-size: 15px;
  }

  .light-data-ad__description,
  .light-data-ad__cta {
    font-size: 13px;
  }
}

@media (max-width: 1180px) {
  .light-data-ad {
    flex-wrap: wrap;
  }

  .light-data-ad__copy {
    flex: 1 1 calc(100% - 170px);
  }

  .light-data-ad__meta {
    margin-left: 44px;
  }

  .light-data-ad__close {
    margin-left: auto;
  }
}

@media (max-width: 768px) {
  .light-data-ad {
    align-items: flex-start;
    gap: 10px;
    margin: 8px 10px 8px;
    padding: 10px;
  }

  .light-data-ad__icon {
    width: 26px;
    height: 26px;
    font-size: 22px;
  }

  .light-data-ad__badge {
    min-width: 50px;
    height: 22px;
    padding: 0 10px;
    font-size: 11px;
  }

  .light-data-ad__copy {
    flex: 1 1 100%;
    order: 2;
    display: block;
    min-width: 0;
  }

  .light-data-ad__title {
    display: block;
    font-size: 15px;
  }

  .light-data-ad__divider {
    display: none;
  }

  .light-data-ad__description {
    display: block;
    min-width: 0;
    margin-top: 4px;
    font-size: 13px;
  }

  .light-data-ad__meta {
    order: 3;
    width: 100%;
    margin-left: 0;
    font-size: 12px;
  }

  .light-data-ad__cta {
    order: 4;
    min-height: 32px;
    padding: 0 12px;
    font-size: 13px;
  }

  .light-data-ad__close {
    margin-left: auto;
  }
}
</style>

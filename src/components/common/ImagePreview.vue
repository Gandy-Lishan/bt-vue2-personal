<template>
  <!-- renders nothing; overlay is manually appended to body -->
</template>

<script>
let overlayId = 0

export default {
  name: 'ImagePreview',
  props: {
    visible: { type: Boolean, default: false },
    src: { type: String, default: '' },
  },
  data() {
    return {
      _container: null,
      _id: `image-preview-${++overlayId}`,
    }
  },
  watch: {
    visible(val) {
      if (val) this._mount()
      else this._unmount()
    },
    src() {
      if (this.visible) this._mount()
    },
  },
  methods: {
    _mount() {
      if (!this._container) {
        this._container = document.createElement('div')
        this._container.id = this._id
        document.body.appendChild(this._container)
      }
      this._container.innerHTML = `
        <div class="image-preview-overlay" data-preview-id="${this._id}">
          <button class="preview-close" title="Close">×</button>
          <img src="${this.src}" alt="Preview" class="preview-image" />
        </div>
      `
      this._container.querySelector('.image-preview-overlay').addEventListener('click', (e) => {
        if (e.target === e.currentTarget) this.$emit('close')
      })
      this._container.querySelector('.preview-close').addEventListener('click', () => {
        this.$emit('close')
      })
      document.addEventListener('keydown', this._handleKeydown)
      document.body.style.overflow = 'hidden'
    },
    _unmount() {
      if (this._container && this._container.parentNode) {
        this._container.parentNode.removeChild(this._container)
      }
      this._container = null
      document.removeEventListener('keydown', this._handleKeydown)
      document.body.style.overflow = ''
    },
    _handleKeydown(e) {
      if (e.key === 'Escape') this.$emit('close')
    },
  },
  beforeDestroy() {
    this._unmount()
  },
}
</script>

<style>
.image-preview-overlay {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: rgba(0, 0, 0, 0.85);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 99999;
  animation: preview-fade-in 0.15s ease;
}

.preview-image {
  max-width: 90%;
  max-height: 90%;
  object-fit: contain;
  cursor: default;
}

.preview-close {
  position: absolute;
  top: 16px;
  right: 20px;
  width: 36px;
  height: 36px;
  background: transparent;
  border: none;
  color: #fff;
  font-size: 28px;
  line-height: 1;
  cursor: pointer;
  opacity: 0.7;
  transition: opacity 0.15s;
}

.preview-close:hover {
  opacity: 1;
}

@keyframes preview-fade-in {
  from { opacity: 0; }
  to { opacity: 1; }
}
</style>

<template>
  <div class="input-area">
    <div class="input-container">
      <!-- Status slot (e.g. retrieve status) — rendered inside the input border -->
      <slot name="status"></slot>

      <!-- Image previews above textarea -->
      <div v-if="attachedImages.length" class="image-previews">
        <div v-for="img in attachedImages" :key="img.id" class="image-preview">
          <img :src="img.base64" :alt="img.name" />
          <div v-if="img.uploading" class="upload-overlay">
            <div class="upload-spinner" />
          </div>
          <button class="remove-image" @click="removeImage(img.id)" title="Remove">
            ×
          </button>
        </div>
      </div>

      <!-- Textarea -->
      <textarea
        ref="textareaRef"
        v-model="inputContent"
        :placeholder="placeholder"
        :disabled="disabled"
        rows="1"
        @keydown="handleKeydown"
        @input="autoResize"
        @paste="handlePaste"
      />

      <!-- Bottom toolbar: tool buttons left, send button right -->
      <div class="input-toolbar">
        <div class="toolbar-left">
          <button class="toolbar-btn" title="Coming soon" :disabled="true" @click="triggerFileInput">
            <i class="fa fa-folder-open" aria-hidden="true"></i>
          </button>
          <button v-if="showScreenshot" class="toolbar-btn" title="Screenshot" @click="handleScreenshot">
            <i class="fa fa-scissors" aria-hidden="true"></i>
          </button>
        </div>
        <div class="toolbar-right">
          <button
            v-if="isLoading"
            class="action-btn stop"
            @click="$emit('cancel')"
            title="Stop"
          >
            ■
          </button>
          <button
            v-else
            class="action-btn send"
            :disabled="!canSend"
            @click="send"
            title="Send"
          >
            ➤
          </button>
        </div>
      </div>
    </div>

    <input
      ref="fileInput"
      type="file"
      accept="image/*"
      multiple
      style="display: none"
      @change="handleFileChange"
    />
  </div>
</template>

<script>
export default {
  name: 'CopilotInput',
  props: {
    isLoading: { type: Boolean, default: false },
    disabled: { type: Boolean, default: false },
    placeholder: { type: String, default: 'Ask AI Copilot...' },
    hint: { type: String, default: 'Enter to send, Shift+Enter for new line · Drag image here' },
    uploadImage: { type: Function, default: null },
    deleteImage: { type: Function, default: null },
    showScreenshot: { type: Boolean, default: true },
  },
  data() {
    return {
      inputContent: '',
      attachedImages: []
    }
  },
  computed: {
    canSend() {
      const hasText = this.inputContent.trim().length > 0
      const hasImages = this.attachedImages.length > 0
      return (hasText || hasImages) && !this.disabled
    }
  },
  methods: {
    send() {
      if (!this.canSend) return
      const text = this.inputContent.trim()
      if (this.attachedImages.length > 0) {
        const content = []
        if (text) content.push({ type: 'text', text })
        for (const img of this.attachedImages) {
          const url = img.url || img.base64
          content.push({ type: 'image_url', image_url: { url } })
        }
        this.$emit('send', content)
      } else {
        this.$emit('send', text)
      }
      this.inputContent = ''
      this.attachedImages = []
      this.$nextTick(() => this.autoResize())
    },
    handleKeydown(e) {
      if (e.key === 'Enter' && !e.shiftKey) {
        e.preventDefault()
        this.send()
      }
    },
    triggerFileInput() {
      this.$refs.fileInput?.click()
    },
    async handleFileChange(e) {
      const files = Array.from(e.target.files || [])
      if (files.length) {
        await this.handleFiles(files)
      }
      // Reset input so the same file can be selected again
      e.target.value = ''
    },
    async handleFiles(files) {
      const imageFiles = files.filter(f => f.type.startsWith('image/'))
      if (imageFiles.length === 0) {
        this.$emit('error', 'Only image files are supported.')
        return
      }
      for (const file of imageFiles) {
        await this.processImageFile(file)
      }
    },
    async handlePaste(e) {
      // TODO: enable when model supports images
      // const items = e.clipboardData?.items
      // if (!items) return
      // const imageFiles = []
      // for (const item of items) {
      //   if (item.type.startsWith('image/')) {
      //     const file = item.getAsFile()
      //     if (file) imageFiles.push(file)
      //   }
      // }
      // if (imageFiles.length > 0) {
      //   e.preventDefault()
      //   await this.handleFiles(imageFiles)
      // }
    },
    async processImageFile(file) {
      if (file.size > 5 * 1024 * 1024) {
        this.$emit('error', `Image too large (${(file.size / 1024 / 1024).toFixed(1)}MB). Max 5MB.`)
        return
      }
      try {
        const base64 = await this.compressImage(file)
        const imgId = 'img_' + Math.random().toString(36).slice(2, 9) + '_' + Date.now()
        this.attachedImages.push({
          id: imgId,
          name: file.name || 'image',
          base64,
          url: null,
          uploading: true,
        })
        this.$nextTick(() => this.autoResize())
        if (this.uploadImage) {
          try {
            const result = await this.uploadImage(base64, file.name || 'image.jpg')
            const idx = this.attachedImages.findIndex(i => i.id === imgId)
            if (idx !== -1) {
              // uploadImage returns { url, path }; path is needed for deletion
              this.$set(this.attachedImages[idx], 'url', result?.url || result)
              this.$set(this.attachedImages[idx], 'path', result?.path || null)
              this.$set(this.attachedImages[idx], 'uploading', false)
            }
          } catch (uploadErr) {
            console.error('[CopilotInput] upload failed:', uploadErr)
            const idx = this.attachedImages.findIndex(i => i.id === imgId)
            if (idx !== -1) {
              this.$set(this.attachedImages[idx], 'uploading', false)
            }
            this.$emit('error', 'Image upload failed: ' + uploadErr.message)
          }
        }
      } catch (err) {
        console.error('[CopilotInput] image processing failed:', err)
      }
    },
    async removeImage(id) {
      const img = this.attachedImages.find(i => i.id === id)
      if (img && img.path && this.deleteImage) {
        await this.deleteImage(img.path)
      }
      this.attachedImages = this.attachedImages.filter(img => img.id !== id)
      this.$nextTick(() => this.autoResize())
    },
    compressImage(file, maxDim = 1024, quality = 0.85) {
      return new Promise((resolve, reject) => {
        const img = new Image()
        const url = URL.createObjectURL(file)
        img.onload = () => {
          URL.revokeObjectURL(url)
          let { width, height } = img
          if (width > maxDim || height > maxDim) {
            const ratio = maxDim / Math.max(width, height)
            width = Math.round(width * ratio)
            height = Math.round(height * ratio)
          }
          const canvas = document.createElement('canvas')
          canvas.width = width
          canvas.height = height
          const ctx = canvas.getContext('2d')
          ctx.fillStyle = '#ffffff'
          ctx.fillRect(0, 0, width, height)
          ctx.drawImage(img, 0, 0, width, height)
          const dataUrl = canvas.toDataURL('image/jpeg', quality)
          resolve(dataUrl)
        }
        img.onerror = () => {
          URL.revokeObjectURL(url)
          reject(new Error('Failed to load image'))
        }
        img.src = url
      })
    },
    autoResize() {
      const ta = this.$refs.textareaRef
      if (!ta) return
      ta.style.height = 'auto'
      // 容器 max-height 220, 减去 gap(8) + padding(20) + toolbar(~36) + previews(如有) ≈ 140
      ta.style.height = Math.min(ta.scrollHeight, 140) + 'px'
    },
    focus() {
      this.$refs.textareaRef?.focus()
    },
    handleScreenshot() {
      this.$emit('start-screenshot-mode')
    },
    addImageFromBase64(base64, filename = 'screenshot.png') {
      const byteString = atob(base64.split(',')[1])
      const mimeString = base64.split(',')[0].split(':')[1].split(';')[0]
      const ab = new ArrayBuffer(byteString.length)
      const ia = new Uint8Array(ab)
      for (let i = 0; i < byteString.length; i++) {
        ia[i] = byteString.charCodeAt(i)
      }
      const blob = new Blob([ab], { type: mimeString })
      const file = new File([blob], filename, { type: mimeString })
      this.processImageFile(file)
    }
  }
}
</script>

<style scoped>
.input-area {
  padding: 0 16px 8px;
  background: white;
  min-width: 0;
  position: relative;
}

.input-area::before {
  content: '';
    position: absolute;
    top: -28px;
    bottom: 0;
    left: 0;
    right: 0;
    height: 28px;
    pointer-events: none;
    z-index: 1;
    background: linear-gradient(to top, rgba(255, 255, 255, 1) 0%, rgba(255, 255, 255, 0.85) 25%, rgba(255, 255, 255, 0.5) 50%, rgba(255, 255, 255, 0.15) 75%, rgba(255, 255, 255, 0) 100%);
}

.input-container {
  display: flex;
  flex-direction: column;
  gap: 8px;
  min-height: 60px;
  max-height: 220px;
  overflow: hidden;
  background: #fff;
  border: 1px solid #e5e7eb;
  border-radius: 24px;
  padding: 10px 14px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.06), 0 0 0 1px rgba(0, 0, 0, 0.02);
  transition: border-color 0.2s, box-shadow 0.2s;
  min-width: 0;
}

.input-container:focus-within {
  border-color: #a5b4fc;
}

/* Image previews — horizontal single-row scroll */
.image-previews {
  display: flex;
  flex-wrap: nowrap;
  overflow-x: auto;
  gap: 8px;
  padding-bottom: 4px;
  scrollbar-width: thin;
}

.image-previews::-webkit-scrollbar {
  height: 4px;
}

.image-previews::-webkit-scrollbar-thumb {
  background: #d1d5db;
  border-radius: 2px;
}

.image-preview {
  position: relative;
  width: 48px;
  height: 48px;
  border-radius: 8px;
  overflow: hidden;
  border: 1px solid #e5e7eb;
  background: #fff;
  flex-shrink: 0;
}

.image-preview img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.remove-image {
  position: absolute;
  top: 2px;
  right: 2px;
  width: 18px;
  height: 18px;
  border-radius: 50%;
  border: none;
  background: rgba(0, 0, 0, 0.5);
  color: #fff;
  font-size: 12px;
  line-height: 18px;
  text-align: center;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 0;
}

.upload-overlay {
  position: absolute;
  inset: 0;
  display: flex;
  align-items: center;
  justify-content: center;
  background: rgba(255,255,255,0.6);
}

.upload-spinner {
  width: 20px;
  height: 20px;
  border: 2px solid #e5e7eb;
  border-top-color: #2563eb;
  border-radius: 50%;
  animation: spin 0.8s linear infinite;
}

@keyframes spin {
  to { transform: rotate(360deg); }
}

.remove-image:hover {
  background: rgba(0, 0, 0, 0.7);
}

/* Textarea fills available space */
.input-container textarea {
  width: 100%;
  border: none;
  background: transparent;
  font-size: 14px;
  resize: none;
  outline: none;
  min-height: 28px;
  max-height: 360px;
  overflow-y: auto;
  color: #374151;
  font-family: inherit;
  line-height: 1.5;
  box-sizing: border-box;
}

.input-container textarea::placeholder {
  color: #9ca3af;
}

.input-container textarea:disabled {
  opacity: 0.5;
}

/* Bottom toolbar */
.input-toolbar {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 8px;
  flex-shrink: 0;
}

.toolbar-left {
  display: flex;
  align-items: center;
  gap: 4px;
}

.toolbar-right {
  display: flex;
  align-items: center;
}

.toolbar-btn {
  width: 28px;
  height: 28px;
  border-radius: 6px;
  border: none;
  background: transparent;
  color: #6b7280;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 13px;
  transition: all 0.15s;
}

.toolbar-btn:hover {
  background: #f3f4f6;
  color: #2563eb;
}

.toolbar-btn:disabled {
  cursor: not-allowed;
  opacity: 0.4;
}
.toolbar-btn:disabled:hover {
  background: transparent;
  color: #6b7280;
}

.action-btn {
  width: 32px;
  height: 32px;
  border-radius: 8px;
  border: none;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 14px;
  transition: all 0.2s;
  flex-shrink: 0;
}

.action-btn.send {
  background: linear-gradient(135deg, #60a5fa 0%, #2563eb 52%, #1d4ed8 100%);
  color: white;
}

.action-btn.send:hover:not(:disabled) {
  transform: scale(1.05);
  box-shadow: 0 4px 12px rgba(37, 99, 235, 0.22);
}

.action-btn.send:disabled {
  opacity: 0.4;
  cursor: not-allowed;
}

.action-btn.stop {
  background: #ef4444;
  color: white;
}

.action-btn.stop:hover {
  background: #dc2626;
  transform: scale(1.05);
}
</style>

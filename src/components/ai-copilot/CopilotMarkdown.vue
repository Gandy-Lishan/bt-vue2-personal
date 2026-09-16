<template>
  <div class="markdown-body">
    <!-- 流式光标：streaming 且空内容 -->
    <div v-if="isStreaming && !hasContent" class="streaming-cursor">
      <span class="cursor-text">Thinking</span>
      <span class="cursor-bar" />
    </div>

    <!-- 纯文本内容 -->
    <div v-else-if="!html" class="plain-text">{{ content }}</div>

    <!-- Markdown 渲染内容 -->
    <div v-else v-html="html" />

    <!-- 错误状态 -->
    <div v-if="status === 'error' && error" class="error-text">
      Error: {{ error }}
    </div>
  </div>
</template>

<script>
/**
 * 简化版 Markdown 渲染器
 * 不依赖外部库，纯正则处理常见格式
 * 安全：只输出白名单标签
 */

const ALLOWED_TAGS = ['p', 'br', 'strong', 'em', 'code', 'pre', 'blockquote',
  'ul', 'ol', 'li', 'a', 'h1', 'h2', 'h3', 'h4', 'h5', 'h6',
  'table', 'thead', 'tbody', 'tr', 'th', 'td', 'hr', 'div', 'span', 'sup']

function escapeHtml(text) {
  return text
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
}

const LANG_MAP = {
  javascript: 'js', js: 'js', typescript: 'js', ts: 'js', vue: 'js',
  python: 'py', py: 'py',
  json: 'json',
  sql: 'sql',
  css: 'css', scss: 'css', less: 'css',
  html: 'html', xml: 'html',
}

function simpleHighlight(code, lang) {
  const normalized = LANG_MAP[lang?.toLowerCase()]
  if (!normalized) return code

  const tokens = []
  function protect(match, cls) {
    tokens.push({ match, cls })
    return `__T${tokens.length - 1}__`
  }
  function restore(str) {
    return str.replace(/__T(\d+)__/g, (_, i) => {
      const t = tokens[+i]
      return `<span class="token-${t.cls}">${t.match}</span>`
    })
  }

  let text = code

  // 注释（JSON 除外）
  if (normalized !== 'json') {
    const commentRe = normalized === 'py'
      ? /(#.*$)/gm
      : normalized === 'css'
      ? /(\/\*[\s\S]*?\*\/)/g
      : /(\/\/.*$|\/\*[\s\S]*?\*\/)/gm
    text = text.replace(commentRe, m => protect(m, 'comment'))
  }

  // 字符串
  const stringRe = normalized === 'py'
    ? /("""[\s\S]*?"""|'''[\s\S]*?'''|"(?:\\"|[^"])*"|'(?:\\'|[^'])*')/g
    : /(`(?:\\`|[^`])*`|'(?:\\'|[^'])*'|"(?:\\"|[^"])*")/g
  text = text.replace(stringRe, m => protect(m, 'string'))

  if (normalized === 'js') {
    text = text.replace(/\b(const|let|var|function|return|if|else|for|while|class|import|export|from|async|await|new|this|typeof|instanceof|try|catch|throw|default|switch|case|break|continue|delete|in|of|yield|void)\b/g, m => protect(m, 'keyword'))
    text = text.replace(/\b(\d+\.?\d*)\b/g, m => protect(m, 'number'))
    text = text.replace(/\b([a-zA-Z_$][\w$]*)(?=\s*\()/g, m => protect(m, 'function'))
  }

  if (normalized === 'py') {
    text = text.replace(/\b(def|class|if|else|elif|for|while|return|import|from|as|try|except|raise|with|lambda|and|or|not|in|is|None|True|False|pass|break|continue)\b/g, m => protect(m, 'keyword'))
    text = text.replace(/\b(\d+\.?\d*)\b/g, m => protect(m, 'number'))
    text = text.replace(/\b([a-zA-Z_][\w]*)(?=\s*\()/g, m => protect(m, 'function'))
  }

  if (normalized === 'json') {
    text = text.replace(/\b(\d+\.?\d*)\b/g, m => protect(m, 'number'))
    text = text.replace(/\b(true|false|null)\b/g, m => protect(m, 'keyword'))
  }

  if (normalized === 'sql') {
    text = text.replace(/\b(SELECT|FROM|WHERE|INSERT|UPDATE|DELETE|JOIN|LEFT|RIGHT|INNER|OUTER|ON|GROUP|BY|ORDER|LIMIT|HAVING|AND|OR|NOT|IN|LIKE|CREATE|TABLE|ALTER|DROP|INDEX|VALUES|AS|DISTINCT|COUNT|SUM|AVG|MIN|MAX|UNION|ALL|BETWEEN|CASE|WHEN|THEN|ELSE|END|IF|EXISTS)\b/gi, m => protect(m, 'keyword'))
    text = text.replace(/\b(\d+\.?\d*)\b/g, m => protect(m, 'number'))
  }

  if (normalized === 'css') {
    text = text.replace(/\b(!important)\b/g, m => protect(m, 'keyword'))
    text = text.replace(/([a-z-]+)(?=\s*:)/g, m => protect(m, 'property'))
    text = text.replace(/([.#][a-zA-Z_-][\w-]*)/g, m => protect(m, 'selector'))
    text = text.replace(/(\d+\.?\d*(?:px|em|rem|%|vh|vw|s|ms|deg|rad|turn)?)\b/g, m => protect(m, 'number'))
  }

  if (normalized === 'html') {
    text = text.replace(/(&lt;\/?[a-zA-Z][\w-]*)/g, m => protect(m, 'tag'))
    text = text.replace(/\b([a-zA-Z-]+)(?==)/g, m => protect(m, 'attr'))
  }

  return restore(text)
}

function simpleMarkdown(md) {
  if (!md) return ''

  let html = md

  // 代码块
  html = html.replace(/```(\w+)?\n([\s\S]*?)```/g, (match, lang, code) => {
    const langAttr = lang ? ` class="language-${lang}"` : ''
    const highlighted = lang ? simpleHighlight(escapeHtml(code), lang) : escapeHtml(code)
    return `<pre><code${langAttr}>${highlighted}</code></pre>`
  })

  // 行内代码
  html = html.replace(/`([^`]+)`/g, '<code>$1</code>')

  // 标题
  html = html.replace(/^###### (.*$)/gim, '<h6>$1</h6>')
  html = html.replace(/^##### (.*$)/gim, '<h5>$1</h5>')
  html = html.replace(/^#### (.*$)/gim, '<h4>$1</h4>')
  html = html.replace(/^### (.*$)/gim, '<h3>$1</h3>')
  html = html.replace(/^## (.*$)/gim, '<h2>$1</h2>')
  html = html.replace(/^# (.*$)/gim, '<h1>$1</h1>')

  // 粗体
  html = html.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
  html = html.replace(/__(.*?)__/g, '<strong>$1</strong>')

  // 斜体
  html = html.replace(/\*(.*?)\*/g, '<em>$1</em>')
  html = html.replace(/_(.*?)_/g, '<em>$1</em>')

  // 链接
  html = html.replace(/\[([^\]]+)\]\(([^)]+)\)/g, '<a href="$2" target="_blank" rel="noopener">$1</a>')

  // 引用
  html = html.replace(/^\> (.*$)/gim, '<blockquote>$1</blockquote>')

  // 表格（标准 Markdown 管道表格）
  html = html.replace(/(\|.*\|[\s\S]*?)(?=\n\n|$)/g, (match) => {
    const lines = match.split('\n').filter(l => l.trim().startsWith('|'))
    if (lines.length < 2) return match

    // 检查第二行是否是分隔符（只包含 | - : 空格）
    const sepLine = lines[1].trim()
    const isSep = /^\|[\s\-:|]+\|$/.test(sepLine)
    if (!isSep) return match

    const headerCells = lines[0].split('|').map(c => c.trim()).filter(c => c)
    const bodyLines = lines.slice(2)

    let tableHtml = '<div class="table-wrapper" style="position:relative;margin:16px 0">' +
      '<table style="overflow-x:auto;-webkit-overflow-scrolling:touch;display:block;border-collapse:separate;border-spacing:0;font-size:13px;line-height:1.5;white-space:nowrap">'
    // thead
    tableHtml += '<thead><tr>'
    headerCells.forEach(cell => {
      tableHtml += `<th style="white-space:nowrap">${cell}</th>`
    })
    tableHtml += '</tr></thead>'

    // tbody
    if (bodyLines.length > 0) {
      tableHtml += '<tbody>'
      bodyLines.forEach(line => {
        const cells = line.split('|').map(c => c.trim()).filter(c => c)
        if (cells.length > 0) {
          tableHtml += '<tr>'
          cells.forEach(cell => {
            tableHtml += `<td style="white-space:nowrap">${cell}</td>`
          })
          tableHtml += '</tr>'
        }
      })
      tableHtml += '</tbody>'
    }

    tableHtml += '</table></div>'
    return tableHtml
  })

  // 水平线
  html = html.replace(/^---+/gim, '<hr />')

  // 无序列表
  html = html.replace(/^(\s*)[-*] (.*$)/gim, '$1<li>$2</li>')

  // 有序列表
  html = html.replace(/^(\s*)\d+\. (.*$)/gim, '$1<li>$2</li>')

  // 包裹列表项到 ul/ol（简化处理：连续 li 用 ul 包裹）
  html = html.replace(/(<li>[\s\S]*?<\/li>\n?)+/g, match => `<ul>${match}</ul>`)

  // 段落：按双换行分割
  const blocks = html.split(/\n\n+/)
  html = blocks.map(block => {
    const trimmed = block.trim()
    if (!trimmed) return ''
    if (trimmed.startsWith('<h') || trimmed.startsWith('<ul') ||
        trimmed.startsWith('<pre') || trimmed.startsWith('<blockquote') ||
        trimmed.startsWith('<hr') || trimmed.startsWith('<table')) {
      return trimmed
    }
    // 处理单行换行
    const withBr = trimmed.replace(/\n/g, '<br />')
    return `<p>${withBr}</p>`
  }).join('\n')

  return html
}

function sanitizeHtml(html) {
  // 简单白名单过滤：只允许 ALLOWED_TAGS 中的标签
  const tagRegex = /<\/?([a-z0-9]+)(\s[^>]*)?>/gi
  return html.replace(tagRegex, (match, tagName, attrs) => {
    const lowerTag = tagName.toLowerCase()
    if (!ALLOWED_TAGS.includes(lowerTag)) return ''

    // 清理属性：只允许白名单属性
    if (attrs) {
      const allowedAttrs = ['href', 'target', 'rel', 'class', 'style']
      const attrMatches = attrs.match(/([-\w]+)="[^"]*"/g) || []
      const cleanAttrs = attrMatches.filter(attr => {
        const name = attr.split('=')[0].trim().toLowerCase()
        return allowedAttrs.includes(name)
      })
      if (cleanAttrs.length > 0) {
        return match.replace(attrs, ' ' + cleanAttrs.join(' '))
      }
      return `<${match.startsWith('</') ? '/' : ''}${lowerTag}>`
    }

    return match
  })
}

export default {
  name: 'CopilotMarkdown',
  props: {
    content: { type: String, default: '' },
    status: { type: String, default: '' },
    error: { type: String, default: '' },
    hasActivity: { type: Boolean, default: false },
  },
  computed: {
    isStreaming() {
      return (this.status === 'streaming' || this.status === 'pending') && !this.hasActivity
    },
    hasContent() {
      return this.content && this.content.trim().length > 0
    },
    html() {
      // streaming 且内容很短时直接显示纯文本（避免 Markdown 解析打断打字效果）
      if (this.isStreaming && this.content.length < 50) {
        return null
      }
      if (!this.content) return null
      let raw = simpleMarkdown(this.content)
      raw = sanitizeHtml(raw)
      return raw
    }
  },
  mounted() {
    this._observers = []
    this.$nextTick(() => {
      this._updateAllWrappers()
    })
  },
  updated() {
    this.$nextTick(() => {
      this._updateAllWrappers()
    })
  },
  beforeDestroy() {
    this._observers.forEach(({ el, fn }) => el.removeEventListener('scroll', fn))
    this._observers = []
  },
  methods: {
    _createFadeEdges(wrapper) {
      if (wrapper.querySelector('.fade-edge')) return
      const left = document.createElement('div')
      left.className = 'fade-edge left'
      left.style.cssText = 'position:absolute;top:0;left:0;width:20px;height:100%;z-index:2;pointer-events:none;opacity:0;background:linear-gradient(to right,#fff,transparent);transition:opacity 0.2s'
      const right = document.createElement('div')
      right.className = 'fade-edge right'
      right.style.cssText = 'position:absolute;top:0;right:0;width:20px;height:100%;z-index:2;pointer-events:none;opacity:0;background:linear-gradient(to left,#fff,transparent);transition:opacity 0.2s'
      wrapper.appendChild(left)
      wrapper.appendChild(right)
    },
    _updateAllWrappers() {
      const wrappers = this.$el.querySelectorAll('.table-wrapper')
      wrappers.forEach(wrapper => {
        if (wrapper._scrollHandler) return
        this._createFadeEdges(wrapper)
        const table = wrapper.querySelector('table')
        if (!table) return
        const fn = () => this._onScroll(wrapper, table)
        table.addEventListener('scroll', fn)
        table._scrollHandler = fn
        this._observers.push({ el: table, fn })
        this._onScroll(wrapper, table)
      })
    },
    _onScroll(wrapper, scrollEl) {
      const leftFade = wrapper.querySelector('.fade-edge.left')
      const rightFade = wrapper.querySelector('.fade-edge.right')
      if (!leftFade || !rightFade) return

      const { scrollLeft, scrollWidth, clientWidth } = scrollEl
      const canScroll = scrollWidth > clientWidth + 1

      leftFade.style.opacity = canScroll && scrollLeft > 2 ? '1' : '0'
      rightFade.style.opacity = canScroll && scrollLeft < scrollWidth - clientWidth - 2 ? '1' : '0'
    },

  }
}
</script>

<style scoped>
.markdown-body {
  font-size: 14px;
  line-height: 1.6;
  color: inherit;
  padding: 4px;
  max-width: 100%;
  min-width: 0;
  overflow-wrap: anywhere;
  word-break: break-word;
}

.markdown-body > div {
  max-width: 100%;
  min-width: 0;
}

.markdown-body :deep(p) {
  margin: 0 0 12px 0;
}

.markdown-body :deep(p:last-child) {
  margin-bottom: 0;
}

.markdown-body :deep(h1),
.markdown-body :deep(h2),
.markdown-body :deep(h3),
.markdown-body :deep(h4) {
  margin: 16px 0 10px 0;
  font-weight: 600;
}

.markdown-body :deep(h1) { font-size: 18px; }
.markdown-body :deep(h2) { font-size: 16px; }
.markdown-body :deep(h3) { font-size: 15px; }
.markdown-body :deep(h4) { font-size: 14px; }

.markdown-body :deep(pre) {
  background: #f3f4f6;
  padding: 14px 16px;
  border-radius: 10px;
  overflow-x: hidden;
  margin: 12px 0;
  max-width: 100%;
  white-space: pre-wrap;
}

.markdown-body :deep(code) {
  font-family: 'Monaco', 'Menlo', 'Consolas', monospace;
  font-size: 13px;
  white-space: pre-wrap;
  overflow-wrap: anywhere;
}

.markdown-body :deep(pre code) {
  background: transparent;
  padding: 0;
}

/* 语法高亮 token 配色（Atom One Dark 风格） */
.markdown-body :deep(.token-keyword) { color: #c678dd; font-weight: 600; }
.markdown-body :deep(.token-string)  { color: #98c379; }
.markdown-body :deep(.token-number)  { color: #d19a66; }
.markdown-body :deep(.token-comment) { color: #5c6370; font-style: italic; }
.markdown-body :deep(.token-function) { color: #61afef; }
.markdown-body :deep(.token-property) { color: #e06c75; }
.markdown-body :deep(.token-selector) { color: #e5c07b; }
.markdown-body :deep(.token-tag)      { color: #e06c75; }
.markdown-body :deep(.token-attr)     { color: #d19a66; }

.markdown-body :deep(:not(pre) > code) {
  background: rgba(0, 0, 0, 0.05);
  padding: 2px 5px;
  border-radius: 4px;
}

.markdown-body :deep(ul),
.markdown-body :deep(ol) {
  margin: 12px 0;
  padding-left: 24px;
}

.markdown-body :deep(li) {
  margin: 6px 0;
}

.markdown-body :deep(blockquote) {
  border-left: 3px solid #d1d5db;
  padding-left: 12px;
  margin: 8px 0;
  color: #6b7280;
}

.markdown-body :deep(a) {
  color: #3b82f6;
  text-decoration: none;
}

.markdown-body :deep(a:hover) {
  text-decoration: underline;
}

.markdown-body :deep(hr) {
  border: none;
  border-top: 1px solid #e5e7eb;
  margin: 12px 0;
}

/* 表格样式（布局属性已通过 mounted 注入全局样式） */
.markdown-body :deep(thead) {
  background: #f8fafc;
}

.markdown-body :deep(th) {
  padding: 10px 14px;
  text-align: left;
  font-weight: 600;
  color: #374151;
  border-top: 1px solid #e2e8f0;
  border-bottom: 1px solid #e2e8f0;
  border-left: 1px solid #e2e8f0;
}

.markdown-body :deep(td) {
  padding: 8px 14px;
  color: #4b5563;
  border-bottom: 1px solid #f1f5f9;
  border-left: 1px solid #f1f5f9;
  vertical-align: top;
}

/* 最右侧单元格补右边框 */
.markdown-body :deep(th:last-child),
.markdown-body :deep(td:last-child) {
  border-right: 1px solid #e2e8f0;
}

.markdown-body :deep(td:last-child) {
  border-right-color: #f1f5f9;
}

/* 首行表头圆角 */
.markdown-body :deep(tr:first-child th:first-child) {
  border-radius: 10px 0 0 0;
}

.markdown-body :deep(tr:first-child th:last-child) {
  border-radius: 0 10px 0 0;
}

/* 末行数据圆角 */
.markdown-body :deep(tr:last-child td:first-child) {
  border-radius: 0 0 0 10px;
  border-bottom: 1px solid #e2e8f0;
}

.markdown-body :deep(tr:last-child td:last-child) {
  border-radius: 0 0 10px 0;
  border-bottom: 1px solid #e2e8f0;
}

/* 中间行底部也保持统一细线 */
.markdown-body :deep(tr:not(:last-child) td) {
  border-bottom: 1px solid #f1f5f9;
}

/* 斑马纹 */
.markdown-body :deep(tbody tr:nth-child(even)) {
  background: #fafbfc;
}

.markdown-body :deep(tbody tr:hover) {
  background: #f0f9ff;
}

.plain-text {
  white-space: pre-wrap;
  word-break: break-word;
}

.streaming-cursor {
  display: inline-flex;
  align-items: center;
  gap: 4px;
  color: #6b7280;
}

.cursor-text {
  font-size: 14px;
}

.cursor-bar {
  display: inline-block;
  width: 2px;
  height: 18px;
  background: currentColor;
  animation: blink 0.5s infinite;
}

@keyframes blink {
  0%, 100% { opacity: 1; }
  50% { opacity: 0; }
}

.error-text {
  margin-top: 8px;
  font-size: 13px;
  color: #ef4444;
}

</style>

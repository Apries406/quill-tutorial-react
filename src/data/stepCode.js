export const stepCode = {
  init: `// ============================================
// 文件 1: index.html
// 编辑器的 HTML 结构
// ============================================

<!DOCTYPE html>
<html>
<head>
  <title>Mini Quill</title>
  <link rel="stylesheet" href="style.css">
</head>
<body>
  <div id="app">
    <div id="toolbar"></div>
    <div id="editor" contenteditable="true"></div>
    <pre id="output"></pre>
  </div>
  <script src="delta.js"></script>
  <script src="editor.js"></script>
</body>
</html>


// ============================================
// 文件 2: style.css
// 编辑器的样式
// ============================================

body {
  font-family: -apple-system, BlinkMacSystemFont, sans-serif;
  max-width: 800px;
  margin: 40px auto;
  padding: 0 20px;
}

#editor {
  min-height: 300px;
  padding: 20px;
  border: 1px solid #e0e0e0;
  border-radius: 8px;
  outline: none;
  font-size: 15px;
  line-height: 1.7;
}

#editor:focus {
  border-color: #2962ff;
  box-shadow: 0 0 0 3px rgba(41, 98, 255, 0.1);
}

#output {
  margin-top: 16px;
  padding: 16px;
  background: #1e1e2e;
  color: #cdd6f4;
  border-radius: 8px;
  font-size: 13px;
  overflow: auto;
}


// ============================================
// 文件 3: editor.js
// 编辑器的 JavaScript 代码
// ============================================

class MiniQuill {
  constructor(container) {
    this.container = container;
    this.setupListeners();
    console.log('MiniQuill 初始化完成！');
  }

  setupListeners() {
    this.container.addEventListener('input', () => {
      console.log('用户输入:', this.container.innerHTML);
    });
  }
}

const editor = new MiniQuill(document.getElementById('editor'));`,

  delta: `// ============================================
// Step 2: Delta - 文档数据格式
// ============================================

class Delta {
  constructor(ops = []) {
    this.ops = [...ops];
  }

  insert(text, attrs = null) {
    const op = { insert: text };
    if (attrs && Object.keys(attrs).length > 0) {
      op.attributes = { ...attrs };
    }
    this.ops.push(op);
    return this;
  }

  delete(length) {
    if (length > 0) {
      this.ops.push({ delete: length });
    }
    return this;
  }

  retain(length, attrs = null) {
    if (length <= 0) return this;
    const op = { retain: length };
    if (attrs && Object.keys(attrs).length > 0) {
      op.attributes = { ...attrs };
    }
    this.ops.push(op);
    return this;
  }

  length() {
    return this.ops.reduce((len, op) => {
      if (op.insert) {
        return len + (typeof op.insert === 'string' ? op.insert.length : 1);
      }
      if (op.retain) return len + op.retain;
      if (op.delete) return len + op.delete;
      return len;
    }, 0);
  }

  toJSON() {
    return { ops: this.ops };
  }

  static fromJSON(json) {
    return new Delta(json.ops || json);
  }
}

// 使用示例
const doc = new Delta()
  .insert('Hello', { bold: true })
  .insert(' World\\n');

console.log('文档:', doc.toJSON());`,

  parchment: `// ============================================
// Step 3: Blot 系统 - 文档模型
// ============================================

class TextBlot {
  static create(text) {
    return document.createTextNode(text);
  }
  static value(node) {
    return node.textContent;
  }
}

class InlineBlot {
  static create(tag, text, attrs = {}) {
    const el = document.createElement(tag);
    el.textContent = text;
    if (attrs.color) el.style.color = attrs.color;
    if (attrs.background) el.style.backgroundColor = attrs.background;
    return el;
  }
  static value(node) {
    return {
      text: node.textContent,
      tag: node.tagName.toLowerCase(),
    };
  }
}

class BlockBlot {
  static create(tag = 'div') {
    const el = document.createElement(tag);
    el.className = 'editor-line';
    return el;
  }
}

class Registry {
  constructor() {
    this.blots = new Map();
    this.register('text', TextBlot);
    this.register('bold', { tag: 'strong', type: 'inline' });
    this.register('italic', { tag: 'em', type: 'inline' });
    this.register('underline', { tag: 'u', type: 'inline' });
  }
  register(name, config) {
    this.blots.set(name, config);
  }
  get(name) {
    return this.blots.get(name);
  }
}`,

  renderer: `// ============================================
// Step 4: Renderer - 将 Delta 渲染为 DOM
// ============================================

class Renderer {
  constructor(container, registry) {
    this.container = container;
    this.registry = registry;
  }

  render(delta) {
    this.container.innerHTML = '';
    let currentBlock = BlockBlot.create();
    this.container.appendChild(currentBlock);

    for (const op of delta.ops) {
      if (typeof op.insert === 'string') {
        const lines = op.insert.split('\\n');
        lines.forEach((line, i) => {
          if (i > 0) {
            currentBlock = BlockBlot.create();
            this.container.appendChild(currentBlock);
          }
          if (line) {
            const node = this.createNode(line, op.attributes);
            currentBlock.appendChild(node);
          }
        });
      }
    }
  }

  createNode(text, attributes = {}) {
    if (!attributes || Object.keys(attributes).length === 0) {
      return TextBlot.create(text);
    }

    let wrapper = document.createElement('span');
    wrapper.textContent = text;

    if (attributes.bold) {
      const strong = document.createElement('strong');
      strong.appendChild(wrapper);
      wrapper = strong;
    }
    if (attributes.italic) {
      const em = document.createElement('em');
      em.appendChild(wrapper);
      wrapper = em;
    }
    if (attributes.color) {
      wrapper.style.color = attributes.color;
    }
    return wrapper;
  }
}`,

  selection: `// ============================================
// Step 5: Selection - 选区管理
// ============================================

class SelectionManager {
  constructor(editor) {
    this.editor = editor;
    this.container = editor.container;
    this.index = 0;
    this.length = 0;
  }

  getRange() {
    return { index: this.index, length: this.length };
  }

  syncFromDOM() {
    const selection = window.getSelection();
    if (!selection.rangeCount) return;
    const range = selection.getRangeAt(0);
    if (!this.container.contains(range.startContainer)) return;

    this.index = this.getIndexFromNode(range.startContainer, range.startOffset);
    this.length = 0;
    if (!range.collapsed) {
      const endIndex = this.getIndexFromNode(range.endContainer, range.endOffset);
      this.length = endIndex - this.index;
    }
  }

  getIndexFromNode(node, offset) {
    let index = 0;
    const walker = document.createTreeWalker(
      this.container,
      NodeFilter.SHOW_TEXT
    );
    while (walker.nextNode()) {
      if (walker.currentNode === node) {
        return index + offset;
      }
      index += walker.currentNode.textContent.length;
    }
    return index;
  }

  getSelectedText() {
    return window.getSelection().toString();
  }
}`,

  formatter: `// ============================================
// Step 6: Formatter - 格式化引擎
// ============================================

class Formatter {
  constructor(editor) {
    this.editor = editor;
  }

  format(index, length, attributes) {
    const delta = this.editor.delta;
    const newOps = [];
    let currentIndex = 0;

    for (const op of delta.ops) {
      const opLength = this.getOpLength(op);
      if (currentIndex + opLength <= index || currentIndex >= index + length) {
        newOps.push({ ...op });
      } else {
        if (typeof op.insert === 'string') {
          const start = Math.max(0, index - currentIndex);
          const end = Math.min(op.insert.length, index + length - currentIndex);

          if (start > 0) {
            newOps.push({
              insert: op.insert.slice(0, start),
              ...(op.attributes && { attributes: { ...op.attributes } })
            });
          }

          const merged = this.mergeAttributes(op.attributes, attributes);
          newOps.push({
            insert: op.insert.slice(start, end),
            attributes: merged
          });

          if (end < op.insert.length) {
            newOps.push({
              insert: op.insert.slice(end),
              ...(op.attributes && { attributes: { ...op.attributes } })
            });
          }
        }
      }
      currentIndex += opLength;
    }
    this.editor.delta = new Delta(newOps);
  }

  mergeAttributes(existing, newAttrs) {
    const merged = existing ? { ...existing } : {};
    Object.keys(newAttrs).forEach(key => {
      if (newAttrs[key] === null) {
        delete merged[key];
      } else {
        merged[key] = newAttrs[key];
      }
    });
    return merged;
  }

  getOpLength(op) {
    if (op.insert) return typeof op.insert === 'string' ? op.insert.length : 1;
    if (op.retain) return op.retain;
    if (op.delete) return op.delete;
    return 0;
  }

  toggleFormat(name, value = true) {
    const { index, length } = this.editor.selection.getRange();
    if (length === 0) return;
    const formats = this.editor.getFormats();
    if (formats[name] === value) {
      this.format(index, length, { [name]: null });
    } else {
      this.format(index, length, { [name]: value });
    }
  }
}`,

  editor: `// ============================================
// Step 7: Mini Quill - 完整实现
// ============================================

class MiniQuill {
  constructor(container) {
    this.container = container;
    this.delta = new Delta([{ insert: '\\n' }]);
    this.registry = new Registry();
    this.renderer = new Renderer(container, this.registry);
    this.selection = new SelectionManager(this);
    this.formatter = new Formatter(this);
    this.undoStack = [];
    this.redoStack = [];
    this.setupListeners();
    this.render();
  }

  setupListeners() {
    this.container.addEventListener('input', () => {
      this.syncFromDOM();
    });
    this.container.addEventListener('mouseup', () => {
      this.selection.syncFromDOM();
    });
    this.container.addEventListener('keydown', (e) => {
      if (e.ctrlKey || e.metaKey) {
        switch (e.key) {
          case 'b':
            e.preventDefault();
            this.formatter.toggleFormat('bold');
            this.render();
            break;
          case 'i':
            e.preventDefault();
            this.formatter.toggleFormat('italic');
            this.render();
            break;
        }
      }
    });
  }

  syncFromDOM() {
    const oldDelta = this.delta;
    this.delta = this.domToDelta();
    this.undoStack.push(oldDelta);
    this.redoStack = [];
    this.emit('text-change');
  }

  domToDelta() {
    const delta = new Delta();
    const processNode = (node, attrs = {}) => {
      if (node.nodeType === Node.TEXT_NODE) {
        if (node.textContent) {
          delta.insert(node.textContent, Object.keys(attrs).length > 0 ? attrs : undefined);
        }
        return;
      }
      if (node.nodeType !== Node.ELEMENT_NODE) return;
      const newAttrs = { ...attrs };
      const tag = node.tagName.toLowerCase();
      if (tag === 'strong' || tag === 'b') newAttrs.bold = true;
      if (tag === 'em' || tag === 'i') newAttrs.italic = true;
      Array.from(node.childNodes).forEach(child => processNode(child, newAttrs));
      if (['div', 'p'].includes(tag)) delta.insert('\\n');
    };
    Array.from(this.container.childNodes).forEach(child => processNode(child));
    return delta;
  }

  getFormats() {
    const { index } = this.selection.getRange();
    const formats = {};
    let currentIndex = 0;
    for (const op of this.delta.ops) {
      if (typeof op.insert === 'string') {
        if (currentIndex + op.insert.length > index) {
          if (op.attributes) Object.assign(formats, op.attributes);
          break;
        }
        currentIndex += op.insert.length;
      }
    }
    return formats;
  }

  render() {
    this.renderer.render(this.delta);
  }

  undo() {
    if (this.undoStack.length === 0) return;
    this.redoStack.push(this.delta);
    this.delta = this.undoStack.pop();
    this.render();
  }

  emit(event) {
    this.container.dispatchEvent(new CustomEvent(event));
  }
}

const editor = new MiniQuill(document.getElementById('editor'));`,

  'delta-compose': `// ============================================
// 进阶：Delta compose - 合并变更
// ============================================

Delta.prototype.compose = function(other) {
  const thisIter = new OpIterator(this.ops);
  const otherIter = new OpIterator(other.ops);
  const ops = [];

  while (thisIter.hasNext() || otherIter.hasNext()) {
    if (otherIter.peekType() === 'insert') {
      ops.push(otherIter.next());
    } else if (thisIter.peekType() === 'delete') {
      ops.push(thisIter.next());
    } else {
      const thisOp = thisIter.peek();
      const otherOp = otherIter.peek();
      if (!thisOp || !otherOp) break;

      const length = Math.min(
        thisOp.retain || thisOp.insert?.length || 0,
        otherOp.retain || 0
      );

      if (thisOp.retain && otherOp.retain) {
        const attrs = mergeAttributes(thisOp.attributes, otherOp.attributes);
        ops.push({ retain: length, ...(Object.keys(attrs).length > 0 && { attributes: attrs }) });
      }

      thisIter.next(length);
      otherIter.next(length);
    }
  }
  return new Delta(ops);
};

function mergeAttributes(existing, attrs) {
  if (!existing && !attrs) return {};
  if (!existing) return { ...attrs };
  if (!attrs) return { ...existing };
  const merged = { ...existing };
  Object.keys(attrs).forEach(key => {
    if (attrs[key] === null) delete merged[key];
    else merged[key] = attrs[key];
  });
  return merged;
}

// 使用示例
const a = new Delta().retain(5).insert(' World');
const b = new Delta().retain(11).insert('!');
const composed = a.compose(b);
console.log(composed.ops);`,

  'delta-transform': `// ============================================
// 进阶：Delta transform - 协作编辑核心
// ============================================

Delta.transform = function(a, b, priority = false) {
  const aIter = new OpIterator(a.ops);
  const bIter = new OpIterator(b.ops);
  const ops = [];

  while (aIter.hasNext() || bIter.hasNext()) {
    if (aIter.peekType() === 'insert' && (bIter.peekType() !== 'insert' || !priority)) {
      const aOp = aIter.next();
      ops.push({ retain: typeof aOp.insert === 'string' ? aOp.insert.length : 1 });
      continue;
    }
    if (bIter.peekType() === 'insert') {
      ops.push(bIter.next());
      continue;
    }

    const aOp = aIter.peek();
    const bOp = bIter.peek();
    if (!aOp || !bOp) break;

    const aLen = aOp.retain || aOp.delete || 0;
    const bLen = bOp.retain || bOp.delete || 0;
    const length = Math.min(aLen, bLen);

    if (aOp.delete) {
      aIter.next(length);
      continue;
    }
    if (bOp.delete) {
      ops.push({ delete: length });
      bIter.next(length);
      aIter.next(length);
      continue;
    }
    ops.push({ retain: length });
    aIter.next(length);
    bIter.next(length);
  }
  return new Delta(ops);
};

// 使用示例
const original = new Delta().insert('Hello');
const changeA = new Delta().retain(5).insert(' World');
const changeB = new Delta().retain(5).insert('!');
const transformedB = Delta.transform(changeA, changeB, false);
console.log(transformedB.ops);`,
}

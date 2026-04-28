export const stepSections = {
  init: [
    {
      title: 'HTML 结构',
      desc: '编辑器的 HTML 骨架',
      code: `<!DOCTYPE html>
<html>
<head>
  <title>Mini Quill</title>
  <link rel="stylesheet" href="style.css">
</head>
<body>
  <div id="app">
    <!-- 工具栏 -->
    <div id="toolbar"></div>

    <!-- 核心：contenteditable 使 div 变为可编辑 -->
    <div id="editor" contenteditable="true"></div>

    <!-- 输出区域 -->
    <pre id="output"></pre>
  </div>

  <script src="delta.js"></script>
  <script src="editor.js"></script>
</body>
</html>`,
    },
    {
      title: 'CSS 样式',
      desc: '编辑器和输出区域的样式',
      code: `body {
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
}`,
    },
    {
      title: 'JavaScript 初始化',
      desc: '最基础的编辑器类',
      code: `class MiniQuill {
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

      isComplete: true,
    },
    {
      title: '完整代码',
      desc: 'Step 1 的完整代码，一次性查看',
      code: `<!-- index.html -->
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

/* style.css */
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

/* editor.js */
class MiniQuill {
  constructor(container) {
    this.container = container;
    this.setupListeners();
  }
  setupListeners() {
    this.container.addEventListener('input', () => {
      console.log('用户输入:', this.container.innerHTML);
    });
  }
}
const editor = new MiniQuill(document.getElementById('editor'));`,
    },
  ],

  delta: [
    {
      title: 'Delta 类定义',
      desc: '实现 insert、delete、retain 三种操作',
      code: `class Delta {
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
}`,
    },
    {
      title: 'Delta 使用示例',
      desc: '三种操作的实际用法',
      code: `const doc = new Delta()
  .insert('Hello', { bold: true })
  .insert(' World\\n');

console.log('文档:', doc.toJSON());

const change = new Delta()
  .retain(5)
  .insert(' Beautiful');

console.log('变更:', change.toJSON());`,

      isComplete: true,
    },
    {
      title: '完整代码',
      desc: 'Step 2 的完整代码',
      code: `class Delta {
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
}

// 使用示例
const doc = new Delta()
  .insert('Hello', { bold: true })
  .insert(' World\\n');

const change = new Delta()
  .retain(5)
  .insert(' Beautiful');`,
    },
  ],

  parchment: [
    {
      title: 'TextBlot',
      desc: '纯文本节点，对应 DOM Text',
      code: `class TextBlot {
  static create(text) {
    return document.createTextNode(text);
  }

  static value(node) {
    return node.textContent;
  }
}`,
    },
    {
      title: 'InlineBlot',
      desc: '行内格式节点（加粗、斜体等）',
      code: `class InlineBlot {
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
}`,
    },
    {
      title: 'BlockBlot',
      desc: '块级节点（段落、标题）',
      code: `class BlockBlot {
  static create(tag = 'div') {
    const el = document.createElement(tag);
    el.className = 'editor-line';
    return el;
  }

  static value(node) {
    return node.textContent;
  }
}`,
    },
    {
      title: 'Registry 注册表',
      desc: '管理所有 Blot 类型',
      code: `class Registry {
  constructor() {
    this.blots = new Map();

    this.register('text', TextBlot);
    this.register('bold', { tag: 'strong', type: 'inline' });
    this.register('italic', { tag: 'em', type: 'inline' });
    this.register('underline', { tag: 'u', type: 'inline' });
    this.register('strike', { tag: 's', type: 'inline' });
    this.register('link', { tag: 'a', type: 'inline' });
    this.register('block', { tag: 'div', type: 'block' });
  }

  register(name, config) {
    this.blots.set(name, config);
  }

  get(name) {
    return this.blots.get(name);
  }
}`,
    },
  ],

  renderer: [
    {
      title: 'render() 主流程',
      desc: '遍历 Delta ops，转换为 DOM 节点',
      code: `class Renderer {
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
    }
  }
}`,
    },
    {
      title: '完整代码',
      desc: 'Step 4 的完整代码',
      code: `class Renderer {
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

    if (attributes.underline) {
      const u = document.createElement('u');
      u.appendChild(wrapper);
      wrapper = u;
    }

    return wrapper;
  }
}`,
    },
  ],

  selection: [
    {
      title: 'SelectionManager',
      desc: '管理选区状态',
      code: `class SelectionManager {
  constructor(editor) {
    this.editor = editor;
    this.container = editor.container;
    this.index = 0;
    this.length = 0;
  }

  getRange() {
    return { index: this.index, length: this.length };
  }`,
    },
    {
      title: 'syncFromDOM()',
      desc: '将浏览器选区转换为字符索引',
      code: `  syncFromDOM() {
    const selection = window.getSelection();
    if (!selection.rangeCount) return;

    const range = selection.getRangeAt(0);

    if (!this.container.contains(range.startContainer)) return;

    this.index = this.getIndexFromNode(
      range.startContainer,
      range.startOffset
    );

    this.length = 0;

    if (!range.collapsed) {
      const endIndex = this.getIndexFromNode(
        range.endContainer,
        range.endOffset
      );
      this.length = endIndex - this.index;
    }
  }`,
    },
    {
      title: 'getIndexFromNode()',
      desc: '遍历文本节点计算字符索引',
      code: `  getIndexFromNode(node, offset) {
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
      isComplete: true,
    },
    {
      title: '完整代码',
      desc: 'Step 5 的完整代码',
      code: `class SelectionManager {
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
    this.length = this.getIndexFromNode(range.endContainer, range.endOffset) - this.index;
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
    },
  ],

formatter: [
    {
      title: 'format() 核心',
      desc: '对指定范围应用格式',
      code: `class Formatter {
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
  }`,
    },
    {
      title: 'toggleFormat()',
      desc: '切换格式开关',
      code: `  toggleFormat(name, value = true) {
    const { index, length } = this.editor.selection.getRange();
    if (length === 0) return;

    const formats = this.editor.getFormats();
    if (formats[name] === value) {
      this.format(index, length, { [name]: null });
    } else {
      this.format(index, length, { [name]: value });
    }
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
}`,
      isComplete: true,
    },
    {
      title: '完整代码',
      desc: 'Step 6 的完整代码',
      code: `class Formatter {
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
}`,
    },
  ],

  editor: [
    {
      title: 'MiniQuill 构造函数',
      desc: '初始化所有组件',
      code: `class MiniQuill {
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
  }`,
    },
    {
      title: 'setupListeners()',
      desc: '监听输入和键盘事件',
      code: `  setupListeners() {
    this.container.addEventListener('input', () => {
      this.syncFromDOM();
    });

    this.container.addEventListener('mouseup', () => {
      this.selection.syncFromDOM();
    });

    this.container.addEventListener('keyup', () => {
      this.selection.syncFromDOM();
    });
  }`,
    },
    {
      title: 'syncFromDOM() & domToDelta()',
      desc: '同步 DOM 变化到 Delta',
      code: `  syncFromDOM() {
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
          delta.insert(
            node.textContent,
            Object.keys(attrs).length > 0 ? attrs : undefined
          );
        }
        return;
      }

      if (node.nodeType !== Node.ELEMENT_NODE) return;

      const newAttrs = { ...attrs };
      const tag = node.tagName.toLowerCase();

      if (tag === 'strong' || tag === 'b') newAttrs.bold = true;
      if (tag === 'em' || tag === 'i') newAttrs.italic = true;
      if (tag === 'u') newAttrs.underline = true;
      if (tag === 's') newAttrs.strike = true;
      if (tag === 'a') newAttrs.link = node.getAttribute('href');
      if (node.style.color) newAttrs.color = node.style.color;

      Array.from(node.childNodes).forEach(child => {
        processNode(child, newAttrs);
      });

      if (['div', 'p'].includes(tag)) {
        delta.insert('\\n');
      }
    };

    Array.from(this.container.childNodes).forEach(child => {
      processNode(child);
    });

    return delta;
  }`,
    },
    {
      title: '撤销与事件',
      desc: 'undo/redo 和事件触发',
      code: `  undo() {
    if (this.undoStack.length === 0) return;
    this.redoStack.push(this.delta);
    this.delta = this.undoStack.pop();
    this.render();
  }

  redo() {
    if (this.redoStack.length === 0) return;
    this.undoStack.push(this.delta);
    this.delta = this.redoStack.pop();
    this.render();
  }

  emit(event) {
    this.container.dispatchEvent(new CustomEvent(event));
  }
}

const editor = new MiniQuill(document.getElementById('editor'));`,
      isComplete: true,
    },
    {
      title: '完整代码',
      desc: 'Step 7 的完整代码',
      code: `class MiniQuill {
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

    this.container.addEventListener('keyup', () => {
      this.selection.syncFromDOM();
    });
  }

  render() {
    this.renderer.render(this.delta);
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
          delta.insert(
            node.textContent,
            Object.keys(attrs).length > 0 ? attrs : undefined
          );
        }
        return;
      }

      if (node.nodeType !== Node.ELEMENT_NODE) return;

      const newAttrs = { ...attrs };
      const tag = node.tagName.toLowerCase();

      if (tag === 'strong' || tag === 'b') newAttrs.bold = true;
      if (tag === 'em' || tag === 'i') newAttrs.italic = true;
      if (tag === 'u') newAttrs.underline = true;
      if (tag === 's') newAttrs.strike = true;
      if (tag === 'a') newAttrs.link = node.getAttribute('href');
      if (node.style.color) newAttrs.color = node.style.color;

      Array.from(node.childNodes).forEach(child => {
        processNode(child, newAttrs);
      });

      if (['div', 'p'].includes(tag)) {
        delta.insert('\\n');
      }
    };

    Array.from(this.container.childNodes).forEach(child => {
      processNode(child);
    });

    return delta;
  }

  undo() {
    if (this.undoStack.length === 0) return;
    this.redoStack.push(this.delta);
    this.delta = this.undoStack.pop();
    this.render();
  }

  redo() {
    if (this.redoStack.length === 0) return;
    this.undoStack.push(this.delta);
    this.delta = this.redoStack.pop();
    this.render();
  }

  emit(event) {
    this.container.dispatchEvent(new CustomEvent(event));
  }
}

const editor = new MiniQuill(document.getElementById('editor'));`,
    },
  ],

  'delta-compose': [
    {
      title: 'compose 原理',
      desc: '合并两个连续的变更',
      code: `Delta.prototype.compose = function(other) {
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
        ops.push({
          retain: length,
          ...(Object.keys(attrs).length > 0 && { attributes: attrs })
        });
      }

      thisIter.next(length);
      otherIter.next(length);
    }
  }

  return new Delta(ops);
};`,
    },
    {
      title: 'mergeAttributes 辅助函数',
      desc: '合并属性对象',
      code: `function mergeAttributes(existing, attrs) {
  if (!existing && !attrs) return {};
  if (!existing) return { ...attrs };
  if (!attrs) return { ...existing };

  const merged = { ...existing };
  Object.keys(attrs).forEach(key => {
    if (attrs[key] === null) {
      delete merged[key];
    } else {
      merged[key] = attrs[key];
    }
  });
  return merged;
}`,
    },
    {
      title: '使用示例',
      desc: '实际场景演示',
      code: `const a = new Delta().retain(5).insert(' World');
const b = new Delta().retain(11).insert('!');

const composed = a.compose(b);
console.log(composed.ops);
// [{ retain: 5 }, { insert: ' World!' }]`,
    },
  ],

  'delta-transform': [
    {
      title: 'transform 原理',
      desc: '解决并发编辑冲突',
      code: `Delta.transform = function(a, b, priority = false) {
  const aIter = new OpIterator(a.ops);
  const bIter = new OpIterator(b.ops);
  const ops = [];

  while (aIter.hasNext() || bIter.hasNext()) {
    if (aIter.peekType() === 'insert' &&
        (bIter.peekType() !== 'insert' || !priority)) {
      const aOp = aIter.next();
      ops.push({
        retain: typeof aOp.insert === 'string' ? aOp.insert.length : 1
      });
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
};`,
    },
    {
      title: '使用示例',
      desc: '协作编辑场景',
      code: `const original = new Delta().insert('Hello');

const changeA = new Delta().retain(5).insert(' World');
const changeB = new Delta().retain(5).insert('!');

const transformedB = Delta.transform(changeA, changeB, false);
console.log(transformedB.ops);
// [{ retain: 11 }, { insert: '!' }]`,

      isComplete: true,
    },
    {
      title: '完整代码',
      desc: 'Delta.transform 完整实现',
      code: `Delta.transform = function(a, b, priority = false) {
  const aIter = new OpIterator(a.ops);
  const bIter = new OpIterator(b.ops);
  const ops = [];

  while (aIter.hasNext() || bIter.hasNext()) {
    if (aIter.peekType() === 'insert' &&
        (bIter.peekType() !== 'insert' || !priority)) {
      const aOp = aIter.next();
      ops.push({
        retain: typeof aOp.insert === 'string' ? aOp.insert.length : 1
      });
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
};`,
    },
  ],
}

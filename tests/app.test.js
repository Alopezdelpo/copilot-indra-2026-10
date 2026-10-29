const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const test = require('node:test');
const vm = require('node:vm');

const appSource = fs.readFileSync(path.join(__dirname, '..', 'app.js'), 'utf8');

class FakeElement {
  constructor() {
    this.listeners = {};
    this.attributes = {};
    this.children = [];
    this.style = {};
    this.hidden = false;
    this.textContent = '';
    this.value = '';
  }

  addEventListener(type, callback) {
    this.listeners[type] = callback;
  }

  setAttribute(name, value) {
    this.attributes[name] = value;
  }

  replaceChildren(...children) {
    this.children = children;
  }

  append(...children) {
    this.children.push(...children);
  }

  focus() {
    this.focused = true;
  }

  reset() {
    this.value = '';
  }

  submit() {
    this.listeners.submit({ preventDefault() {} });
  }

  click() {
    this.listeners.click();
  }
}

function createApp(savedValue = null) {
  const selectors = [
    '#task-form',
    '#task-input',
    '#task-list',
    '#task-count',
    '#empty-state',
    '#clock-face',
    '#clock-hour',
    '#clock-minute',
    '#clock-second',
  ];
  const elements = Object.fromEntries(selectors.map((selector) => [selector, new FakeElement()]));
  elements['#task-form'].reset = () => {
    elements['#task-input'].value = '';
  };
  const storage = new Map();
  if (savedValue !== null) storage.set('mis-tareas-v1', savedValue);
  const intervals = [];

  const document = {
    querySelector(selector) {
      return elements[selector];
    },
    createElement() {
      return new FakeElement();
    },
  };
  const localStorage = {
    getItem(key) {
      return storage.has(key) ? storage.get(key) : null;
    },
    setItem(key, value) {
      storage.set(key, value);
    },
  };
  class FixedDate extends Date {
    getHours() { return 3; }
    getMinutes() { return 15; }
    getSeconds() { return 30; }
    toLocaleTimeString() { return '03:15:30'; }
  }
  const window = {
    setInterval(callback, delay) {
      intervals.push({ callback, delay });
    },
  };

  vm.runInNewContext(appSource, { document, localStorage, window, Date: FixedDate, Math });
  return { elements, storage, intervals };
}

function renderedTasks(app) {
  return app.elements['#task-list'].children;
}

test('starts with an empty list and initializes the clock', () => {
  const app = createApp();

  assert.equal(app.elements['#task-count'].textContent, '0 tareas pendientes');
  assert.equal(app.elements['#empty-state'].hidden, false);
  assert.deepEqual(app.intervals.map(({ delay }) => delay), [1000]);
  assert.equal(app.elements['#clock-hour'].style.transform, 'translateX(-50%) rotate(97.5deg)');
  assert.equal(app.elements['#clock-minute'].style.transform, 'translateX(-50%) rotate(93deg)');
  assert.equal(app.elements['#clock-second'].style.transform, 'translateX(-50%) rotate(180deg)');
  assert.equal(app.elements['#clock-face'].attributes['aria-label'], 'Hora actual: 03:15:30');
});

test('adds trimmed tasks, updates the pending count and persists the list', () => {
  const app = createApp();
  const form = app.elements['#task-form'];
  const input = app.elements['#task-input'];

  input.value = '  Preparar informe  ';
  form.submit();

  assert.equal(renderedTasks(app).length, 1);
  assert.equal(renderedTasks(app)[0].children[1].textContent, 'Preparar informe');
  assert.equal(app.elements['#task-count'].textContent, '1 tarea pendiente');
  assert.equal(app.elements['#empty-state'].hidden, true);
  assert.equal(input.value, '');
  assert.equal(input.focused, true);
  assert.equal(JSON.parse(app.storage.get('mis-tareas-v1'))[0].text, 'Preparar informe');
});

test('does not add whitespace-only submissions', () => {
  const app = createApp();
  const input = app.elements['#task-input'];
  input.value = '   ';
  app.elements['#task-form'].submit();

  assert.equal(renderedTasks(app).length, 0);
  assert.equal(app.elements['#task-count'].textContent, '0 tareas pendientes');
  assert.equal(app.storage.has('mis-tareas-v1'), false);
});

test('toggles completion and removes a task while keeping counts and storage in sync', () => {
  const app = createApp();
  const input = app.elements['#task-input'];
  input.value = 'Llamar';
  app.elements['#task-form'].submit();

  let [item] = renderedTasks(app);
  item.children[0].click();
  [item] = renderedTasks(app);
  assert.equal(item.className, 'task-item is-complete');
  assert.equal(item.children[0].attributes['aria-pressed'], 'true');
  assert.equal(item.children[0].attributes['aria-label'], 'Marcar Llamar como pendiente');
  assert.equal(app.elements['#task-count'].textContent, '0 tareas pendientes');
  assert.equal(JSON.parse(app.storage.get('mis-tareas-v1'))[0].completed, true);

  item.children[2].click();
  assert.equal(renderedTasks(app).length, 0);
  assert.equal(app.elements['#empty-state'].hidden, false);
  assert.equal(JSON.parse(app.storage.get('mis-tareas-v1')).length, 0);
});

test('loads saved tasks and safely falls back for malformed or non-list storage', () => {
  const saved = createApp(JSON.stringify([
    { id: 'one', text: 'Pendiente', completed: false },
    { id: 'two', text: 'Hecha', completed: true },
  ]));
  assert.equal(renderedTasks(saved).length, 2);
  assert.equal(saved.elements['#task-count'].textContent, '1 tarea pendiente');

  for (const invalidValue of ['{no es JSON', JSON.stringify({ text: 'No es una lista' })]) {
    const app = createApp(invalidValue);
    assert.equal(renderedTasks(app).length, 0);
    assert.equal(app.elements['#task-count'].textContent, '0 tareas pendientes');
  }
});

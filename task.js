import { dialog } from "./dialog.js";
import { edit, remove as removeSvg } from "./svgs.js";

export class Task {

  constructor(valueTask, isNotInit) {
    if (!isNotInit) {
      this.initTask(valueTask);
    };
  }

  static createTask(id, isChecked, value) {
    const task = new Task(value, true);
    task.value = value;
    task.id = id;
    task.isChecked = isChecked;
    task.el.classList.add('task');
    task.el.innerHTML = `
      <input type="checkbox" class="checkbox">
      <div class="task-text">${value}</div>
      <div class="remove-task edit">${edit}</div>
      <div class="remove-task remove">${removeSvg}</div>
      <div class="cover"><div>
    `;
    const htmlTaskList = document.getElementById('tasks-list');
    htmlTaskList.appendChild(task.el);
    const htmlCheckbox = task.el.querySelector('.checkbox');
    htmlCheckbox.checked = task.isChecked;
    const onChange = (e) => {
      if (e.target.checked) {
        task.isChecked = true;
        task.el.classList.add('done');
      } else {
        task.isChecked = false;
        task.el.classList.remove('done');
      }
      task._updateFunc.forEach(u => u());
    };
    htmlCheckbox.addEventListener('change', (e) => {
      onChange(e);
    });
    const htmlCover = task.el.querySelector('.cover');
    htmlCover.addEventListener('click', (e) => {
      e.stopPropagation();
      htmlCheckbox.click();
    });
    const editHtml = task.el.querySelector('.edit');
    editHtml.addEventListener('click', () => {
      dialog(task.value).afterClose(value => {
        task.value = value;
        task.el.querySelector('.task-text').innerText = value;
        task._updateFunc.forEach(u => u());
      })
    });
    const removeHtml = task.el.querySelector('.remove');
    removeHtml.addEventListener('click', () => {
      task._removeFunc.forEach(r => r());
      task._updateFunc.forEach(u => u());
      task.el.remove();
    });
    if (task.isChecked) {
      task.el.classList.add('done');
    };
    return task;
  }

  el = document.createElement('div');
  id = `id${Math.random()}`;
  value = '';
  isChecked = false;

  _removeFunc = [];
  onRemove(func) {
    this._removeFunc.push(() => func(this.id));
    return this;
  };

  _updateFunc = [];
  onUpdate(func) {
    this._updateFunc.push(() => func(this.id));
  } 

  initTask(value) {
    this.value = value;
    this.el.classList.add('task');
    this.el.innerHTML = `
      <input type="checkbox" class="checkbox">
      <div class="task-text">${value}</div>
      <div class="remove-task edit">${edit}</div>
      <div class="remove-task remove">${removeSvg}</div>
      <div class="cover"><div>
    `;
    const htmlTaskList = document.getElementById('tasks-list');
    htmlTaskList.appendChild(this.el);
    const htmlCheckbox = this.el.querySelector('.checkbox');
    const onChange = (e) => {
      if (e.target.checked) {
        this.isChecked = true;
        this.el.classList.add('done');
      } else {
        this.isChecked = false;
        this.el.classList.remove('done');
      }
      this._updateFunc.forEach(u => u());
    };
    htmlCheckbox.addEventListener('change', (e) => {
      onChange(e);
    });
    const htmlCover = this.el.querySelector('.cover');
    htmlCover.addEventListener('click', (e) => {
      e.stopPropagation();
      htmlCheckbox.click();
    });
    const editHtml = this.el.querySelector('.edit');
    editHtml.addEventListener('click', () => {
      dialog(this.value).afterClose(value => {
        this.value = value;
        this.el.querySelector('.task-text').innerText = value;
        this._updateFunc.forEach(u => u());
      })
    });
    const removeHtml = this.el.querySelector('.remove');
    removeHtml.addEventListener('click', () => {
      this._removeFunc.forEach(r => r());
      this._updateFunc.forEach(u => u());
      this.el.remove();
    });
  }

  updateCheckbox() {
    if (this.isChecked) {
      const htmlCheckbox = this.el.querySelector('.checkbox');
      htmlCheckbox.checked = true;
      this.el.classList.add('done');
    }
  }
}
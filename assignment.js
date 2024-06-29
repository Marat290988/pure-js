import { dialog } from "./dialog.js";
import { remove as removeSvg } from "./svgs.js";
import { Task } from "./task.js";

export class Assigment {

  constructor(value) {
    this._initAssigment(value);
  }

  el = document.createElement('div');
  id = `id${Math.random()}`;
  taskData = [];
  taskDataLocaleStorage = [];
  value = '';
  taskForFirstLaunch = [];

  _initAssigment(value) {
    this.value = value;
    this.el.classList.add('button');
    this.el.classList.add('assigment');
    this.el.innerHTML = `<div>${value}</div> <div class="remove">${removeSvg}</div>`;
    this.el.addEventListener('click', () => this.active());
    const htmlListContainer = document.getElementById('assig-list');
    htmlListContainer.appendChild(this.el);
    const remove = this.el.querySelector('.remove');
    const htmlTask = document.getElementById('task');
    remove.addEventListener('click', (e) => {
      e.stopPropagation();
      this._removeFunc.forEach(r => r());
      this.el.remove();
      htmlTask.innerHTML = '';
    });
    this.createTask();
  }

  _removeFunc = [];
  _activeFunc = [];
  _updateFunc = [];

  onUpdate(func) {
    this._updateFunc.push(() => func(this.taskDataLocaleStorage, this.id));
  }

  createTask() {
    const htmlTask = document.getElementById('task');
    htmlTask.innerHTML = `
    <div class="tasks-info" id="tasks-info"></div>
    <div class="tasks-list" id="tasks-list">
    
    </div>
    <div class="new-task" id="new-task">Новая задача</div>
    `;
    const createTask = (value, isChecked) => {
      const task = new Task(value, isChecked ? isChecked : false);
      task.onRemove(id => {
        const findIndex = this.taskData.findIndex(t => t.id === id);
        if (findIndex > -1) {
          this.taskData.splice(findIndex, 1);
          this.saveToLocaleStorage(id, true);
        }
      }).onUpdate(id => {
        this.updateTaskInfo();
        this.saveToLocaleStorage(id, false);
      });
      this.taskData.push(task);
      this.updateTaskInfo();
      if (this.taskForFirstLaunch.length === 0) {
        this.saveToLocaleStorage(task.id, false);
      }
      return task;
    }
    const addTask = () => {
      dialog().afterClose(value => {
        createTask(value);
      });
    }
    const htmlNewTask = document.getElementById('new-task');
    htmlNewTask.addEventListener('click', () => addTask());
    if (this.taskData.length > 0) {
      this.taskData.forEach(t => {
        const htmlTaskList = document.getElementById('tasks-list');
        htmlTaskList.appendChild(t.el);
      })
    }
    if (this.taskForFirstLaunch.length > 0) {
      this.taskForFirstLaunch.forEach(t => {
        const task = Task.createTask(t.id, t.isChecked, t.value);
        task.onRemove(id => {
          const findIndex = this.taskData.findIndex(t => t.id === id);
          if (findIndex > -1) {
            this.taskData.splice(findIndex, 1);
            this.saveToLocaleStorage(id, true);
          }
        }).onUpdate(id => {
          this.updateTaskInfo();
          this.saveToLocaleStorage(id, false);
        });
        this.updateTaskInfo();
        this.taskData.push(task);
        this.taskDataLocaleStorage.push({
          id: task.id,
          isChecked: task.isChecked,
          value: task.value
        });
      });
    }
    this.taskForFirstLaunch = [];
    this.updateTaskInfo();
  }

  onRemove(func) {
    this._removeFunc.push(() => func(this.id));
    return this;
  }

  onActive(func) {
    this._activeFunc.push(() => { func(this.id) });
  }

  active() {
    this.el.classList.add('active');
    this._activeFunc.forEach(f => f());
    this.createTask();
  }

  deactive() {
    this.el.classList.remove('active');
  }

  updateTaskInfo() {
    const htmlInfo = document.getElementById('tasks-info');
    htmlInfo.innerHTML = `${this.taskData.filter(t => t.isChecked).length} / ${this.taskData.length}`;
  }

  saveToLocaleStorage(id, isDelete) {
    const findIndex = this.taskData.findIndex(t => t.id === id);
    if (findIndex > -1) {
      const localeIndex = this.taskDataLocaleStorage.findIndex(t => t.id === id);
      if (localeIndex === -1) {
        this.taskDataLocaleStorage.push({
          id: this.taskData[findIndex].id,
          isChecked: this.taskData[findIndex].isChecked,
          value: this.taskData[findIndex].value
        });
      } else {
        this.taskDataLocaleStorage[localeIndex] = {
          id: this.taskData[findIndex].id,
          isChecked: this.taskData[findIndex].isChecked,
          value: this.taskData[findIndex].value
        };
      }
    };
    if (isDelete) {
      const findIndex = this.taskDataLocaleStorage.findIndex(t => t.id === id);
      if (findIndex > -1) {
        this.taskDataLocaleStorage.splice(findIndex, 1);
      }
    };
    this._updateFunc.forEach(u => u());
  }
}
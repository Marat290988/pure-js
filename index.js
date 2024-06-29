import { Assigment } from "./assignment.js";
import { dialog } from "./dialog.js";
import { plus } from "./svgs.js";


function globalInit() {
  const globalAssigmnets = [];
  const globalLocaleStorageAssigmnets = localStorage.getItem('assigment') ? JSON.parse(localStorage.getItem('assigment')) : [];
  const bodyWrapper = document.createElement('div');
  bodyWrapper.classList.add('body-wrapper');
  bodyWrapper.innerHTML = `
    <div class="tasks-block">
      <div class="assig-list" id="assig-list"></div>
      <buton id="button-task" class="button">Создать ${plus}<buton>
    </div>
    <div class="tasks-block" id="task">
      
    </div>
  `;
  document.body.appendChild(bodyWrapper);
  const button = document.getElementById('button-task');
  const saveToLocaleStorage = (tasks, idAssignment, isDelete) => {
    const findIndex = globalAssigmnets.findIndex(a => a.id === idAssignment);
    if (findIndex > -1) {
      const storageIndex = globalLocaleStorageAssigmnets.findIndex(a => a.id === idAssignment);
      if (storageIndex === -1) {
        globalLocaleStorageAssigmnets.push({
          id: idAssignment,
          value: globalAssigmnets[findIndex].value,
          tasks: tasks,
        });
      } else {
        globalLocaleStorageAssigmnets[storageIndex] = {
          id: idAssignment,
          value: globalAssigmnets[findIndex].value,
          tasks: tasks,
        }
      }
    }
    if (isDelete) {
      const findIndex = globalLocaleStorageAssigmnets.findIndex(a => a.id === idAssignment);
      if (findIndex > -1) {
        globalLocaleStorageAssigmnets.splice(findIndex, 1);
      }
    }
    localStorage.setItem('assigment', JSON.stringify(globalLocaleStorageAssigmnets));
  }
  function newaAssigment(value, isNotSave) {
    const assigment = new Assigment(value);
    assigment.onRemove(id => {
      const findIndex = globalAssigmnets.findIndex(a => a.id === id);
      if (findIndex > -1) {
        globalAssigmnets.splice(findIndex, 1);
      }
      saveToLocaleStorage([], id, true);
    }).onActive(id => {
      globalAssigmnets.forEach(a => {
        if (a.id !== id) {
          a.deactive();
        }
      });
    });
    assigment.active();
    globalAssigmnets.push(assigment);
    if (!isNotSave) {
      saveToLocaleStorage([], assigment.id, false);
    }
    assigment.onUpdate((localStorage, idAssignment) => {
      saveToLocaleStorage(localStorage, idAssignment, false);
    });
    return assigment;
  };
  button.addEventListener('click', () => {
    dialog().afterClose((value) => {
      newaAssigment(value, false);
    })
  });
  if (globalLocaleStorageAssigmnets.length > 0) {
    globalLocaleStorageAssigmnets.forEach(a => {
      const ast = newaAssigment(a.value, true);
      ast.id = a.id;
      ast.taskForFirstLaunch = a.tasks;
      ast.createTask();
      globalAssigmnets.push(ast);
    });
  }
}

globalInit();
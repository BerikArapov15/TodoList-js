//  находим элементы на странице
const form = document.querySelector("#form");
const taskInput = document.querySelector("#taskInput");
const tasksList = document.querySelector("#tasksList");
const emptyList = document.querySelector("emptyList");

let tasks = [];

if (localStorage.getItem("tasks")) {
  tasks = JSON.parse(localStorage.getItem("tasks"));
  tasks.forEach((task) => renderTask(task));
}



checkEmptyList();


//Добавление задачи
form.addEventListener("submit", addTask);
//Удаление задачи
tasksList.addEventListener("click", deleteTask);
// Отмечаем задачу завершнной
tasksList.addEventListener("click", doneTask);

//Функци
function addTask(event) {
  // На этом этапе мы отменяем формы отправку
  event.preventDefault();
  // Достаем текст задачи из поля ввода
  const taskText = taskInput.value;

  // Описываем задачу в виде обьекта
  const newTask = {
    id: Date.now(),
    text: taskText,
    done: false,
  };

  // Добавляем задачу в массив с задачи
  tasks.push(newTask);

  // Сохраняем список задач в хранилише браузера LocalStorage
  saveToLocalStorage();

  //Рендерим задачу на странице
  renderTask(newTask);

  // Очищаем поле ввода и возвращаем на него фокус
  taskInput.value = "";
  taskInput.focus();

  checkEmptyList();
}

function deleteTask(event) {
  // Проверяем если клик был не по кнопке удалить задачу
  if (event.target.dataset.action !== "delete") return;
  const parenNode = event.target.closest(".list-group-item");
  //  Определяем Id задачи
  const id = Number(parenNode.id);
  //  Находим индекс задачи в массиве
  const index = tasks.findIndex((task) => task.id === id);

  // Удаляем задачу из массива с задачами
  tasks.splice(index, 1);

  // Сохраняем список задач в хранилише браузера LocalStorage
  saveToLocalStorage();
  //  удаляем задачу из разметки
  parenNode.remove();
  checkEmptyList();
}

function doneTask(event) {
  // Проверяем что клик был не кнопке задача выполнена
  if (event.target.dataset.action !== "done") return;

  // Проверям что  клик был по кнопке задача выполнена
  const parentNode = event.target.closest(".list-group-item");
  //  Определяем Id задачи
  const id = Number(parentNode.id);

  const task = tasks.find((task) => task.id === id);

  task.done = !task.done;

  // Сохраняем список задач в хранилише браузера LocalStorage
  saveToLocalStorage();

  console.log(task);

  const taskTitle = parentNode.querySelector(".task-title");
  taskTitle.classList.toggle("task-title--done");
}

function checkEmptyList() {
  if (tasks.length === 0) {
    const emptyListHTML = `
  <li id="emptyList" class="list-group-item empty-list">
    <img src="./img/leaf.svg" alt="Empty" width="48" class="mt-3" />
    <div class="empty-list__title">Список дел пуст</div>
  </li> `;
    tasksList.insertAdjacentHTML("afterbegin", emptyListHTML);
  }
  if (tasks.length > 0) {
    const emptyListEl = document.querySelector("#emptyList");
    emptyListEl ? emptyListEl.remove() : null;
  }
}

function saveToLocalStorage() {
  localStorage.setItem("tasks", JSON.stringify(tasks));
}

function renderTask(task) {
  // Формируем  css класс
  const cssClass = task.done ? "task-title task-title--done" : "task-title";
  //Формируем разметку для новой задачи
  const taskHTML = ` <li id="${task.id}" class="list-group-item d-flex justify-content-between task-item">
   <span class="${cssClass}">${task.text}</span>
     <div class="task-item__buttons">
      <button type="button" data-action="done" class="btn-action">
          <img src="./img/tick.svg" alt="Done" width="18" height="18" />
           </button>
           <button type="button" data-action="delete" class="btn-action">
          <img src="./img/cross.svg" alt="Done" width="18" height="18" />
       </button>
      </div>
  </li>`;
  //  Добавляем  хадачу на страницу
  tasksList.insertAdjacentHTML("beforeend", taskHTML);
}

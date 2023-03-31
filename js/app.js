const tasks = [
  {
    id: "task-42528647",
    completed: true,
    text: "Occaecat non ea quis occaecat ad culpa amet deserunt incididunt elit fugiat pariatur. Exercitation commodo culpa in veniam proident laboris in. Excepteur cupidatat eiusmod dolor consectetur exercitation nulla aliqua veniam fugiat irure mollit.",
    title: "Eu ea incididunt sunt consectetur",
  },
  {
    id: "task-63583488",
    completed: true,
    text: "Occaecat non ea quis occaecat ad culpa amet deserunt incididunt elit fugiat pariatur. Exercitation commodo culpa in veniam proident laboris in.",
    title: "Eu ea incididunt sunt consectetur fugiat non",
  },
  {
    id: "task-45299838",
    completed: false,
    text: "Aliquip cupidatat ex adipisicing veniam do tempor. Lorem nulla adipisicing et esse cupidatat qui deserunt in fugiat duis est qui. Est adipisicing ipsum qui cupidatat exercitation. Cupidatat aliqua deserunt id deserunt excepteur nostrud culpa eu voluptate excepteur. Cillum officia proident anim aliquip. Dolore veniam qui reprehenderit voluptate non id anim.",
    title: "Deserunt laborum id consectetur pariatur veniam occaecat",
  },
  {
    id: "task-41603808",
    completed: false,
    text: "Aliquip cupidatat ex adipisicing veniam do tempor. Lorem nulla adipisicing et esse cupidatat qui deserunt in fugiat duis est qui. Est adipisicing ipsum qui cupidatat exercitation. Cupidatat aliqua deserunt id deserunt excepteur nostrud culpa eu voluptate excepteur. Cillum officia proident anim aliquip.",
    title: "Deserunt laborum id consectetur",
  },
];

(function () {
  const objOfTasks = tasks.reduce((acc, task) => {
    acc[task.id] = task;
    return acc;
  }, {});

  if (!localStorage.getItem("tasks")) {
    addAllTasksToLS(objOfTasks);
  }

  const themes = {
    dark: {
      "--primary": "#181818",
      "--secondary": "#fafafa",
    },
    light: {
      "--primary": "#fafafa",
      "--secondary": "#181818",
    },
  };

  // DOM Elements
  const taskForm = document.querySelector(".add-task");
  const inputTitle = taskForm.elements.taskTitle;
  const inputText = taskForm.elements.taskText;
  const tasksWrapper = document.querySelector(".tasks-wrapper");
  const modal = document.querySelector(".modal");
  const overlay = document.querySelector(".overlay");
  const error = document.querySelector(".input-error");
  const selectTheme = document.querySelector(".header__select-theme");
  const htmlRoot = document.querySelector(":root");

  // Variables
  const themeFromLS = localStorage.getItem("theme");
  const tasksFromLS = JSON.parse(localStorage.getItem("tasks"));

  // Events

  setTheme(themeFromLS);
  renderAllTasks(tasksFromLS);

  taskForm.addEventListener("submit", onFormSubmitHandler);
  tasksWrapper.addEventListener("click", onDeleteHandler);
  selectTheme.addEventListener("change", onThemeSelectHandler);

  selectTheme.value = themeFromLS || "dark";

  // Functions

  function createTaskTemplate({ id, title, text }) {
    return `
      <div class="task" data-id="${id}">
        <h3>${title}</h3>
        <p class="task__text">${text}</p>
        <button type="button" class="btn btn--delete">Delete Task</button>
      </div>
    `;
  }

  function renderAllTasks(tasksList) {
    let fragment = Object.values(tasksList).reduce(
      (acc, task) => (acc += createTaskTemplate(task)),
      ""
    );
    tasksWrapper.insertAdjacentHTML("afterbegin", fragment);
  }

  function onFormSubmitHandler(e) {
    e.preventDefault();
    const titleValue = inputTitle.value;
    const textValue = inputText.value;

    if (!titleValue.trim()) {
      const errorMessage = inputTitle.dataset.message;
      error.textContent = errorMessage;
      inputTitle.style.border = "1px solid red";
      return;
    } else {
      error.textContent = "";
      inputTitle.style.border = "1px solid #181818";
    }

    const task = createNewTask(titleValue, textValue);
    updateTasksInLS();
    tasksWrapper.insertAdjacentHTML("afterbegin", createTaskTemplate(task));

    taskForm.reset();
  }

  function createNewTask(title, text) {
    const newTask = {
      completed: false,
      text,
      title,
      id: `task-${Math.ceil(Math.random() * 100000000)}`,
    };
    tasksFromLS[newTask.id] = newTask;
    return newTask;
  }

  function addAllTasksToLS(tasks) {
    localStorage.setItem("tasks", JSON.stringify(tasks));
  }

  function updateTasksInLS() {
    localStorage.setItem("tasks", JSON.stringify(tasksFromLS));
  }

  function onDeleteHandler(e) {
    if (e.target.classList.contains("btn--delete")) {
      const taskItem = e.target.closest(".task");
      const taskId = taskItem.dataset.id;
      showModal();
      modal.addEventListener("click", function (e) {
        if (e.target.classList.contains("btn--delete")) {
          deleteTaskFromLayout(taskItem);
          deleteTaskFromObj(taskId);
          updateTasksInLS();
          hideModal();
        } else if (e.target.classList.contains("btn--cancel")) {
          hideModal();
        }
      });
    }
  }

  function deleteTaskFromObj(taskId) {
    delete tasksFromLS[taskId];
  }

  function deleteTaskFromLayout(element) {
    element.remove();
  }

  function onThemeSelectHandler() {
    const selectedTheme = selectTheme.value;
    localStorage.setItem("theme", selectedTheme);
    setTheme(selectedTheme);
  }

  function setTheme(themeName) {
    const selectedTheme = themes[themeName];
    for (let key in selectedTheme) {
      htmlRoot.style.setProperty(key, selectedTheme[key]);
    }
  }

  function showModal() {
    modal.classList.add("active");
    overlay.classList.add("active");
  }

  function hideModal() {
    modal.classList.remove("active");
    overlay.classList.remove("active");
  }
})();

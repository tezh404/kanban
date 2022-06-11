// Add Task

const form = document.querySelector("form");
const newTaskInput = document.querySelector("#New-Task");

function categories() {
  let optionSelect = document.querySelector("#optionSelect");
  var value = optionSelect.options[optionSelect.selectedIndex].value;
  if (value === "toDo") {
    return document.querySelector("#toDo");
  } else if (value === "inProgress") {
    return document.querySelector("#inProgress");
  } else if (value === "done") {
    return document.querySelector("#done");
  }
};

let items;

loadItems();
eventListeners();

function eventListeners() {
  form.addEventListener("submit", addTask);

  // delete an item
  toDo.addEventListener("click", deleteItem);
}

function addTask(e) {
  if (newTaskInput.value === "") {
    alert("Please add a task");
  } else {
    const li = document.createElement("li");
    li.className =
      "draggable list-group-item list-group-item-action d-flex justify-content-between";
    li.setAttribute("draggable", "true");
    li.innerHTML = newTaskInput.value;
    reo = '<i class="fa-solid fa-xmark"></i>';
    li.innerHTML += reo;
    let categorie = categories();
    categorie.appendChild(li);
    setItemToLS(newTaskInput.value);
    newTaskInput.value = "";
    e.preventDefault();
  }
}

function loadItems() {
  items = getItemsFromLS();
  items.forEach(function (item) {
    createItem(item);
  });
}

// get items from Local Storage
function getItemsFromLS() {
  if (localStorage.getItem("items") === null) {
    items = [];
  } else {
    items = JSON.parse(localStorage.getItem("items"));
  }
  return items;
}

// set item to Local Storage
function setItemToLS(text) {
  items = getItemsFromLS();
  items.push(text);
  localStorage.setItem("items", JSON.stringify(items));
}

// delete item from LS
function deleteItemFromLS(text) {
  items = getItemsFromLS();
  items.forEach(function (item, index) {
    if (item === text) {
      items.splice(index, 1);
    }
  });
  localStorage.setItem("items", JSON.stringify(items));
}

function createItem(text) {
  // create li
  const li = document.createElement("li");
  li.className =
    "draggable list-group-item list-group-item-action d-flex justify-content-between";
  li.setAttribute("draggable", "true");
  li.innerHTML = newTaskInput.value;
  li.appendChild(document.createTextNode(text));
  reo = '<i class="fa-solid fa-xmark"></i>';
  li.innerHTML += reo; // add categories
  toDo.appendChild(li);
}

function deleteItem(e) {
  if (e.target.className === "fa-solid fa-xmark") {
    e.target.parentElement.remove();

    // delete item from LS
    deleteItemFromLS(e.target.parentElement.textContent);
  }
  e.preventDefault();
}

let draggables = document.querySelectorAll(".draggable");
let containers = document.querySelectorAll(".dropzone");

draggables.forEach((draggable) => {
  draggable.addEventListener("dragstart", () => {
    draggable.classList.add("dragging");
  });

  draggable.addEventListener("dragend", () => {
    draggable.classList.remove("dragging");
  });
});

containers.forEach((container) => {
  container.addEventListener("dragover", (e) => {
    e.preventDefault();
    const afterElement = getDragAfterElement(container, e.clientY);
    const draggable = document.querySelector(".dragging");
    if (afterElement == null) {
      container.appendChild(draggable);
    } else {
      container.insertBefore(draggable, afterElement);
    }
  });
});

function getDragAfterElement(container, y) {
  const draggableElements = [
    ...container.querySelectorAll(".draggable:not(.dragging)"),
  ];

  return draggableElements.reduce(
    (closest, child) => {
      const box = child.getBoundingClientRect();
      const offset = y - box.top - box.height / 2;
      if (offset < 0 && offset > closest.offset) {
        return { offset: offset, element: child };
      } else {
        return closest;
      }
    },
    { offset: Number.NEGATIVE_INFINITY }
  ).element;
}

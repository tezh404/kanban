// Add Task

const form = document.querySelector("form");
const newTaskInput = document.querySelector("#New-Task");
const delteToDo = document.querySelector("#toDo");
const delteinProgress = document.querySelector("#inProgress");
const delteDone = document.querySelector("#done");

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
}

loadItems();
eventListeners();

function eventListeners() {
  form.addEventListener("submit", addTask);

  // delete an item
  delteToDo.addEventListener("click", deleteItem);
  delteinProgress.addEventListener("click", deleteItem);
  delteDone.addEventListener("click", deleteItem);
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
    categ = optionSelect.options[optionSelect.selectedIndex].value;
    setItemToLS(categ, newTaskInput.value);
    newTaskInput.value = "";
    e.preventDefault();
  }
}

function loadItems() {
  toDo = getItemsFromLStoDo();
  inProgress = getItemsFromLSinProgress();
  done = getItemsFromLSdone();

  toDo.forEach(function (item) {
    createItem(item, "toDo");
  });

  inProgress.forEach(function (item) {
    createItem(item, "inProgress");
  });

  done.forEach(function (item) {
    createItem(item, "done");
  });
}

// get items from Local Storage
function getItemsFromLStoDo() {
  if (localStorage.getItem("toDo") === null) {
    toDo = [];
  } else {
    toDo = JSON.parse(localStorage.getItem("toDo"));
  }
  return toDo;
}
function getItemsFromLSinProgress() {
  if (localStorage.getItem("inProgress") === null) {
    inProgress = [];
  } else {
    inProgress = JSON.parse(localStorage.getItem("inProgress"));
  }
  return inProgress;
}
function getItemsFromLSdone() {
  if (localStorage.getItem("done") === null) {
    done = [];
  } else {
    done = JSON.parse(localStorage.getItem("done"));
  }
  return done;
}

// set item to Local Storage
function setItemToLS(categ, text) {
  if (categ === "toDo") {
    toDo = getItemsFromLStoDo();
    toDo.push(text);
    localStorage.setItem("toDo", JSON.stringify(toDo));
  } else if (categ === "inProgress") {
    inProgress = getItemsFromLSinProgress();
    inProgress.push(text);
    localStorage.setItem("inProgress", JSON.stringify(inProgress));
  } else if (categ === "done") {
    done = getItemsFromLSdone();
    done.push(text);
    localStorage.setItem("done", JSON.stringify(done));
  }
}

// delete item from LS
function deleteItemFromLS(text, cater) {
  if (cater === "toDo") {
    toDo = getItemsFromLStoDo();
    toDo.forEach(function (item, index) {
      if (item === text) {
        toDo.splice(index, 1);
      }
    });
    localStorage.setItem("toDo", JSON.stringify(toDo));
  } else if (cater === "inProgress") {
    inProgress = getItemsFromLSinProgress();
    inProgress.forEach(function (item, index) {
      if (item === text) {
        inProgress.splice(index, 1);
      }
    });
    localStorage.setItem("inProgress", JSON.stringify(inProgress));
  } else if (cater === "done") {
    done = getItemsFromLSdone();
    done.forEach(function (item, index) {
      if (item === text) {
        done.splice(index, 1);
      }
    });
    localStorage.setItem("done", JSON.stringify(done));
  }
}

function createItem(text, catesy) {
  // create li
  const li = document.createElement("li");
  li.className =
    "draggable list-group-item list-group-item-action d-flex justify-content-between";
  li.setAttribute("draggable", "true");
  li.innerHTML = newTaskInput.value;
  li.appendChild(document.createTextNode(text));
  reo = '<i class="fa-solid fa-xmark"></i>';
  li.innerHTML += reo;
  document.getElementById(catesy).appendChild(li);
}

function deleteItem(e) {
  if (e.target.className === "fa-solid fa-xmark") {
    let cater = e.target.parentNode;
    cater = cater.parentElement.id;
    console.log(cater);

    e.target.parentElement.remove();

    // delete item from LS

    // cater = cater.parentElement;

    let textCont = e.target.parentElement.textContent;

    deleteItemFromLS(textCont, cater);
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

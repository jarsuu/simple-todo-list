document.addEventListener("DOMContentLoaded", function () {
  // Task input
  const taskInput = document.getElementById("task-description");
  const addButton = document.getElementById("add-task-btn");
  
  function handleFormSubmit() {
    const taskDescription = taskInput.value.trim();
    if (taskDescription !== "") {
      addItem(taskDescription);
      taskInput.value = "";
    } else {
      alert("enter task");
    }
  }

  taskInput.addEventListener("keydown", e => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleFormSubmit();
    }
  });

  addButton.addEventListener("click", handleFormSubmit);

  // Add item
  function addItem(taskDescription) {
    const newTask = document.createElement("div");
    newTask.classList.add("task");
    newTask.draggable = true;

    // add description
    const description = document.createElement("p");
    description.textContent = taskDescription;
    description.classList.add("description");
    newTask.appendChild(description);

    // add delete button
    const deleteButton = document.createElement("button");
    deleteButton.textContent = "Delete";
    deleteButton.classList.add("delete");
    deleteButton.onclick = deleteItem;
    newTask.appendChild(deleteButton);

    // add edit button
    const editButton = document.createElement("button");
    editButton.textContent = "Edit";
    editButton.classList.add("edit");
    editButton.onclick = editItem;
    newTask.appendChild(editButton);

    // add to not done task container
    document.getElementById("not-done").getElementsByClassName("task-container")[0].appendChild(newTask);

    enableDrag(newTask);
  }

  // Enable drag functionality for tasks
  function enableDrag(element) {
    element.addEventListener("dragstart", () => {
      element.classList.add("dragging");
    });

    element.addEventListener("dragend", () => {
      element.classList.remove("dragging");
    });
  }

  // Delete item
  function deleteItem(event) {
    const taskToRemove = event.target.parentNode;
    taskToRemove.remove();
  }

  // Edit item
  function editItem(event) {
    const descriptionToEdit = event.target.parentNode.getElementsByClassName("description")[0];
    const currentDescription = descriptionToEdit.textContent.trim();

    const editInput = document.createElement("input");
    editInput.type = "text";
    editInput.value = currentDescription;

    descriptionToEdit.textContent = "";
    descriptionToEdit.appendChild(editInput);

    // Disable edit button during focus
    event.target.disabled = true;
    editInput.focus();

    // Save input
    function saveEditedInput() {
      const editedText = editInput.value.trim();
      if (editedText === "") {
        descriptionToEdit.textContent = currentDescription;
      } else {
        descriptionToEdit.textContent = editedText;
      }
      editInput.removeEventListener("keydown", handleKeyDown);

      event.target.disabled = false;
    }

    function handleKeyDown(e) {
      if (e.key == "Enter" && !e.shiftKey) {
        saveEditedInput();
      }
    }

    function handleBlur() {
      descriptionToEdit.textContent = currentDescription;
      editInput.removeEventListener("blur", handleBlur);

      event.target.disabled = false;
    }

    editInput.addEventListener("keydown", handleKeyDown);
    editInput.addEventListener("blur", handleBlur);
  }

  // Draggable
  const containers = document.querySelectorAll(".task-container");

  containers.forEach(container => {
    container.addEventListener("dragover", e => {
      e.preventDefault();
      const afterElement = getDragAfterElement(container, e.clientY);
      const draggable = document.querySelector(".dragging");
      
      if (afterElement == null) {
          container.appendChild(draggable);
        } else {
          container.insertBefore(draggable, afterElement);
        }
    })

    function getDragAfterElement(container, y) {
      const draggableElements = [...container.querySelectorAll(".task:not(.dragging)")];

      return draggableElements.reduce((closest, child) => {
        const box = child.getBoundingClientRect();
        const offset = y - box.top - box.height / 2;

        if (offset < 0 && offset > closest.offset) {
          return { offset: offset, element: child }
        } else {
          return closest
        }
      }, { offset: Number.NEGATIVE_INFINITY }).element;
    }
  })
}); 
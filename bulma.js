//this will trigger the modal
const modalEl = document.querySelector(".modal-element");

document.addEventListener("click", function (event) {
  const target = event.target;
  // if the modal button is clicked, then open the modal
  if (target.classList.contains("modal-button")) {
    
    openModal();
  }
  // if the submit or close buttons are clicked, then close the modal
  else if (
    target.classList.contains("submit-button") ||
    target.classList.contains("modal-close")
  ) {
    let zipcodeEl = $('.zipcode')
    getHardinessfromzip(zipcodeEl.val());
    closeModal();
  }
  // if a user clicks outside of the modal, then close the modal
  if (target.classList.contains("modal-background")) {
    closeModal();
  }
});

function openModal() {
  const modalContainer = document.querySelector(".modal");
  modalContainer.classList.add("is-active");
}
function closeModal() {
  modalEl.classList.remove("is-active");
}

// this will trigger the dropdowns
document.addEventListener("DOMContentLoaded", function () {
  const options = document.querySelectorAll(".dropdown");
  if (options.length > 0) {
    options.forEach(function (dropdown) {
      const dropdownTrigger = dropdown.querySelector(
        ".dropdown-trigger button"
      );
      const dropdownItems = dropdown.querySelectorAll(
        ".dropdown-content .dropdown-item"
      );

      dropdownTrigger.addEventListener("click", function (event) {
        event.stopPropagation();
        closeAllDropdowns();

        const isActive = dropdown.classList.contains("is-active");
        if (!isActive) {
          dropdown.classList.add("is-active");
        }
      });

      dropdownItems.forEach(function (item) {
        item.addEventListener("click", function (event) {
          event.stopPropagation();
          const selectedValue = item.textContent.trim();
          dropdownTrigger.textContent = selectedValue;
          dropdown.classList.remove("is-active");

          handleSelection(selectedValue);
        });
      });
    });

    document.addEventListener("click", function (event) {
      closeAllDropdowns();
    });
  }
});

function closeAllDropdowns() {
  const activeDropdowns = document.querySelectorAll(".dropdown.is-active");
  activeDropdowns.forEach(function (dropdown) {
    dropdown.classList.remove("is-active");
  });
}

function handleSelection(selectedValue) {
  console.log("Selected: " + selectedValue);
}

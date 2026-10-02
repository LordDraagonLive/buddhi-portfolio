const year = document.querySelector("#year");
if (year) {
  year.textContent = new Date().getFullYear();
}

const filterButtons = document.querySelectorAll(".filter");
const projectCards = document.querySelectorAll(".project-card");

filterButtons.forEach((button) => {
  button.addEventListener("click", () => {
    const selected = button.dataset.filter;

    filterButtons.forEach((item) => item.classList.remove("active"));
    button.classList.add("active");

    projectCards.forEach((card) => {
      const tags = card.dataset.tags.split(" ");
      const visible = selected === "all" || tags.includes(selected);
      card.classList.toggle("hidden", !visible);
    });
  });
});

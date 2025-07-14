const burger = document.getElementById("burger");
const menu = document.querySelector(".menu");

burger.addEventListener("click", () => {
    menu.classList.toggle("open");
});

document.getElementById("year").textContent = new Date().getFullYear();
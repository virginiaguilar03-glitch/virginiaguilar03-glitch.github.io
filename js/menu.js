// ===============================
// MENU MOBILE
// ===============================

const menuMobile = document.getElementById("menu-mobile");
const menu = document.querySelector("nav");

menuMobile.addEventListener("click", () => {
    menu.classList.toggle("active");
});

// Fecha o menu ao clicar em um link

const links = document.querySelectorAll("nav a");

links.forEach(link => {
    link.addEventListener("click", () => {
        menu.classList.remove("active");
    });
});

// Fecha o menu ao redimensionar a tela

window.addEventListener("resize", () => {
    if (window.innerWidth > 900) {
        menu.classList.remove("active");
    }
});

// ===============================
// MENU MOBILE - VAIDTÁXI
// ===============================

const menuMobile = document.getElementById("menu-mobile");
const menu = document.querySelector("nav");


// Verifica se o menu mobile existe
if (menuMobile && menu) {

    // Abrir / fechar menu
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


    // Fecha o menu ao redimensionar
    window.addEventListener("resize", () => {

        if (window.innerWidth > 900) {

            menu.classList.remove("active");

        }

    });

}

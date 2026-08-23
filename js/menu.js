// ==========================================
// MENU MOBILE - VAIDTÁXI
// ==========================================

document.addEventListener("DOMContentLoaded", () => {

    const menuMobile = document.getElementById("menu-mobile");
    const menu = document.querySelector("nav");

    // Verifica se os elementos existem
    if (!menuMobile || !menu) {
        return;
    }


    // ==========================================
    // ABRIR / FECHAR MENU
    // ==========================================

    menuMobile.addEventListener("click", () => {

        menu.classList.toggle("active");

    });


    // ==========================================
    // FECHAR MENU AO CLICAR EM UM LINK
    // ==========================================

    const links = document.querySelectorAll("nav a");

    links.forEach(link => {

        link.addEventListener("click", () => {

            menu.classList.remove("active");

        });

    });


    // ==========================================
    // FECHAR MENU AO REDIMENSIONAR
    // ==========================================

    window.addEventListener("resize", () => {

        if (window.innerWidth > 900) {

            menu.classList.remove("active");

        }

    });

});

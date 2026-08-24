// ==========================================
// MENU MOBILE - VAIDTÁXI
// ==========================================

document.addEventListener("DOMContentLoaded", () => {

    const menuMobile =
        document.getElementById("menu-mobile");

    const menu =
        document.querySelector("nav");

    const headerButtons =
        document.querySelector(".header-buttons");


    // ==========================================
    // VERIFICAR ELEMENTOS
    // ==========================================

    if (!menuMobile || !menu) {

        return;

    }


    // ==========================================
    // ABRIR / FECHAR MENU
    // ==========================================

    menuMobile.addEventListener("click", () => {

        menu.classList.toggle("active");


        // --------------------------------------
        // BOTÕES DE LOGIN / CADASTRO
        // --------------------------------------

        if (headerButtons) {

            headerButtons.classList.toggle(
                "active"
            );

        }

    });


    // ==========================================
    // FECHAR MENU AO CLICAR EM UM LINK
    // ==========================================

    const links =
        document.querySelectorAll("nav a");


    links.forEach(link => {

        link.addEventListener(
            "click",
            () => {

                menu.classList.remove(
                    "active"
                );


                if (headerButtons) {

                    headerButtons.classList.remove(
                        "active"
                    );

                }

            }
        );

    });


    // ==========================================
    // FECHAR MENU AO REDIMENSIONAR
    // ==========================================

    window.addEventListener(
        "resize",
        () => {

            if (window.innerWidth > 900) {

                menu.classList.remove(
                    "active"
                );


                if (headerButtons) {

                    headerButtons.classList.remove(
                        "active"
                    );

                }

            }

        }
    );

});

// ======================================
// VAIDTÁXI
// app.js
// ======================================


// ==============================
// ANIMAÇÃO AO APARECER NA TELA
// ==============================

const elementos = document.querySelectorAll(".animate");

if (elementos.length > 0) {

    const observer = new IntersectionObserver((entries) => {

        entries.forEach((entry) => {

            if (entry.isIntersecting) {

                entry.target.classList.add("show");

            }

        });

    }, {
        threshold: 0.2
    });

    elementos.forEach((elemento) => {

        observer.observe(elemento);

    });

}


// ==============================
// HEADER AO ROLAR A PÁGINA
// ==============================

const header = document.querySelector("header");

if (header) {

    window.addEventListener("scroll", () => {

        if (window.scrollY > 50) {

            header.classList.add("header-scroll");

        } else {

            header.classList.remove("header-scroll");

        }

    });

}


// ==============================
// ANO AUTOMÁTICO NO RODAPÉ
// ==============================

const ano = document.getElementById("ano");

if (ano) {

    ano.textContent = new Date().getFullYear();

}


// ==============================
// AUTENTICAÇÃO - SUPABASE
// ==============================

async function atualizarHeaderUsuario() {

    try {

        // Verifica se o cliente Supabase existe
        if (!window.supabaseClient) {

            console.error("Cliente Supabase não encontrado.");

            return;

        }

        const {
            data: { session },
            error
        } = await window.supabaseClient.auth.getSession();


        if (error) {

            console.error(
                "Erro ao verificar sessão:",
                error
            );

            return;

        }


        const headerButtons =
            document.querySelector(".header-buttons");


        if (!headerButtons) {

            return;

        }


        // ==============================
        // USUÁRIO LOGADO
        // ==============================

        if (session && session.user) {

            const user = session.user;


            // Tenta pegar o nome salvo nos metadados
            let nome =
                user.user_metadata?.nome ||
                user.user_metadata?.name ||
                user.email?.split("@")[0] ||
                "Usuário";


            // Primeira letra maiúscula
            nome =
                nome.charAt(0).toUpperCase() +
                nome.slice(1);


            headerButtons.innerHTML = `

                <span class="usuario-logado">
                    Olá, ${nome}
                </span>

                <button
                    type="button"
                    class="btn-outline"
                    id="btn-sair">
                    Sair
                </button>

            `;


            // ==============================
            // BOTÃO SAIR
            // ==============================

            const btnSair =
                document.getElementById("btn-sair");


            if (btnSair) {

                btnSair.addEventListener("click", async () => {

                    btnSair.disabled = true;

                    const {
                        error
                    } =
                    await window.supabaseClient.auth.signOut();


                    if (error) {

                        console.error(
                            "Erro ao sair:",
                            error
                        );

                        btnSair.disabled = false;

                        return;

                    }


                    // Volta para a página inicial
                    window.location.href = "index.html";

                });

            }


        } else {

            // ==============================
            // USUÁRIO DESLOGADO
            // ==============================

            headerButtons.innerHTML = `

                <a
                    href="login.html"
                    class="btn-outline">
                    Entrar
                </a>

                <a
                    href="cadastro.html"
                    class="btn">
                    Cadastre-se
                </a>

            `;

        }


    } catch (erro) {

        console.error(
            "Erro ao atualizar header:",
            erro
        );

    }

}


// ==============================
// INICIALIZAÇÃO DA SESSÃO
// ==============================

document.addEventListener(
    "DOMContentLoaded",
    () => {

        atualizarHeaderUsuario();

    }
);


// ==============================
// ATUALIZAÇÃO AUTOMÁTICA DA SESSÃO
// ==============================

if (window.supabaseClient) {

    window.supabaseClient.auth.onAuthStateChange(
        (event, session) => {

            atualizarHeaderUsuario();

        }
    );

}

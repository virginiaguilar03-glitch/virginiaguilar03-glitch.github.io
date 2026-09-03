// ============================================================
// AUTENTICAÇÃO GLOBAL - VAIDTÁXI
// ============================================================

document.addEventListener("DOMContentLoaded", async function () {

    console.log("Auth global iniciado.");

    // ========================================================
    // ELEMENTOS DO CABEÇALHO
    // ========================================================

    const headerButtons =
        document.querySelector(".header-buttons");


    // Se a página não tiver o cabeçalho, não faz nada
    if (!headerButtons) {
        console.log("Área de usuário não encontrada.");
        return;
    }


    // ========================================================
    // VERIFICAR SUPABASE
    // ========================================================

    if (typeof supabase === "undefined") {

        console.error(
            "Supabase não foi carregado antes do auth.js."
        );

        return;
    }


    // ========================================================
    // BUSCAR SESSÃO
    // ========================================================

    let session = null;

    try {

        const {
            data,
            error
        } = await supabase.auth.getSession();


        if (error) {

            console.error(
                "Erro ao recuperar sessão:",
                error
            );

            mostrarDeslogado();

            return;
        }


        session = data.session;


    } catch (erro) {

        console.error(
            "Erro inesperado ao recuperar sessão:",
            erro
        );

        mostrarDeslogado();

        return;
    }


    // ========================================================
    // ATUALIZAR CABEÇALHO
    // ========================================================

    if (session) {

        console.log(
            "Usuário autenticado:",
            session.user.email
        );

        mostrarLogado(session.user);

    } else {

        console.log(
            "Nenhum usuário autenticado."
        );

        mostrarDeslogado();
    }


    // ========================================================
    // ESCUTAR ALTERAÇÕES DE LOGIN/LOGOUT
    // ========================================================

    supabase.auth.onAuthStateChange(
        function (event, sessionAtual) {

            console.log(
                "Alteração de autenticação:",
                event
            );


            if (sessionAtual) {

                mostrarLogado(
                    sessionAtual.user
                );

            } else {

                mostrarDeslogado();

            }

        }
    );


    // ========================================================
    // USUÁRIO LOGADO
    // ========================================================

    function mostrarLogado(usuario) {

        const nome =
            usuario.user_metadata?.nome ||
            usuario.user_metadata?.name ||
            usuario.email?.split("@")[0] ||
            "Cliente";


        headerButtons.innerHTML = `

            <span class="usuario-header">
                Olá, ${nome}
            </span>

            <button
                type="button"
                id="btnSair"
                class="btn-outline"
            >
                Sair
            </button>

        `;


        // ====================================================
        // BOTÃO SAIR
        // ====================================================

        const btnSair =
            document.getElementById("btnSair");


        if (btnSair) {

            btnSair.addEventListener(
                "click",
                async function () {

                    btnSair.disabled = true;

                    btnSair.textContent =
                        "Saindo...";


                    const {
                        error
                    } =
                        await supabase.auth.signOut();


                    if (error) {

                        console.error(
                            "Erro ao sair:",
                            error
                        );

                        btnSair.disabled =
                            false;

                        btnSair.textContent =
                            "Sair";

                        alert(
                            "Não foi possível sair."
                        );

                        return;
                    }


                    // Volta para a página inicial
                    window.location.href =
                        "index.html";

                }
            );

        }

    }


    // ========================================================
    // USUÁRIO NÃO LOGADO
    // ========================================================

    function mostrarDeslogado() {

        headerButtons.innerHTML = `

            <a
                href="login.html"
                class="btn-outline"
            >
                Entrar
            </a>

            <a
                href="cadastro.html"
                class="btn"
            >
                Cadastre-se
            </a>

        `;

    }

});

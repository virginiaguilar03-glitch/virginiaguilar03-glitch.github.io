// ============================================================
// AUTENTICAÇÃO GLOBAL - VAIDTÁXI
// ============================================================

document.addEventListener(
    "DOMContentLoaded",
    async function () {

        console.log(
            "Auth global iniciado."
        );


        // ====================================================
        // ELEMENTOS
        // ====================================================

        const headerButtons =
            document.querySelector(
                ".header-buttons"
            );


        if (!headerButtons) {

            console.log(
                "Área de usuário não encontrada."
            );

            return;

        }


        // ====================================================
        // VERIFICAR CLIENTE SUPABASE
        // ====================================================

        if (
            typeof supabaseClient ===
            "undefined"
        ) {

            console.error(
                "supabaseClient não encontrado."
            );

            return;

        }


        // ====================================================
        // BUSCAR SESSÃO
        // ====================================================

        try {

            const {
                data,
                error
            } =
                await supabaseClient.auth.getSession();


            if (error) {

                console.error(
                    "Erro ao verificar sessão:",
                    error
                );

                mostrarDeslogado();

                return;

            }


            const session =
                data.session;


            // =================================================
            // USUÁRIO LOGADO
            // =================================================

            if (session) {

                console.log(
                    "Usuário logado:",
                    session.user.email
                );

                mostrarLogado(
                    session.user
                );

            }

            // =================================================
            // USUÁRIO NÃO LOGADO
            // =================================================

            else {

                console.log(
                    "Nenhum usuário logado."
                );

                mostrarDeslogado();

            }


        } catch (erro) {

            console.error(
                "Erro inesperado:",
                erro
            );

            mostrarDeslogado();

        }


        // ====================================================
        // ESCUTAR LOGIN / LOGOUT
        // ====================================================

        supabaseClient.auth.onAuthStateChange(
            function (
                event,
                session
            ) {

                console.log(
                    "Estado da autenticação:",
                    event
                );


                if (session) {

                    mostrarLogado(
                        session.user
                    );

                } else {

                    mostrarDeslogado();

                }

            }
        );


        // ====================================================
        // MOSTRAR USUÁRIO LOGADO
        // ====================================================

        function mostrarLogado(
            usuario
        ) {

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


            const btnSair =
                document.getElementById(
                    "btnSair"
                );


            if (btnSair) {

                btnSair.addEventListener(
                    "click",
                    async function () {

                        btnSair.disabled =
                            true;

                        btnSair.textContent =
                            "Saindo...";


                        const {
                            error
                        } =
                            await supabaseClient.auth.signOut();


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


                        window.location.href =
                            "index.html";

                    }
                );

            }

        }


        // ====================================================
        // MOSTRAR USUÁRIO DESLOGADO
        // ====================================================

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

    }
);

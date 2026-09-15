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
        // ELEMENTOS DO CABEÇALHO
        // ====================================================

        const headerButtons =
            document.querySelector(
                ".header-buttons"
            );

        const menuPrincipal =
            document.querySelector(
                "header nav"
            );


        // ====================================================
        // VERIFICAR SUPABASE
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
        // USUÁRIO LOGADO
        // ====================================================

        function mostrarLogado(
            usuario
        ) {

            const tipo =
                usuario.user_metadata?.tipo ||
                "";


            console.log(
                "Tipo de usuário:",
                tipo
            );


            // =================================================
            // SOMENTE CLIENTE
            // =================================================

            if (
                tipo === "cliente"
            ) {

                montarMenuCliente();

            }


            // =================================================
            // BOTÃO SAIR DO CLIENTE
            // =================================================

            if (
                tipo === "cliente" &&
                headerButtons
            ) {

                headerButtons.innerHTML = `

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


                            console.log(
                                "Sessão encerrada."
                            );


                            window.location.href =
                                "index.html";

                        }
                    );

                }

            }

        }


        // ====================================================
        // MONTAR CABEÇALHO DO CLIENTE
        // ====================================================

        function montarMenuCliente() {

            if (!menuPrincipal) {

                console.log(
                    "Menu principal não encontrado."
                );

                return;

            }


            const paginaAtual =
                window.location.pathname
                    .split("/")
                    .pop()
                    .toLowerCase();


            menuPrincipal.innerHTML = `

                <a
                    href="index.html"
                    class="${paginaAtual === "index.html" ? "active" : ""}"
                >
                    <i class="fa-solid fa-house"></i>
                    Início
                </a>

                <a
                    href="cliente.html"
                    class="${paginaAtual === "cliente.html" ? "active" : ""}"
                >
                    <i class="fa-solid fa-user"></i>
                    Área do Cliente
                </a>

                <a
                    href="motoristas.html"
                    class="${paginaAtual === "motoristas.html" ? "active" : ""}"
                >
                    <i class="fa-solid fa-users"></i>
                    Motoristas
                </a>

                <a
                    href="corrida.html"
                    class="${paginaAtual === "corrida.html" ? "active" : ""}"
                >
                    <i class="fa-solid fa-taxi"></i>
                    Solicitar Corrida
                </a>

                <a
                    href="pagamentos.html"
                    class="${paginaAtual === "pagamentos.html" ? "active" : ""}"
                >
                    <i class="fa-solid fa-wallet"></i>
                    Pagamentos
                </a>

                <a
                    href="contato.html"
                    class="${paginaAtual === "contato.html" ? "active" : ""}"
                >
                    <i class="fa-solid fa-headset"></i>
                    Suporte
                </a>

            `;

        }


        // ====================================================
        // USUÁRIO DESLOGADO
        // ====================================================

        function mostrarDeslogado() {

            if (!headerButtons) {

                return;

            }


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

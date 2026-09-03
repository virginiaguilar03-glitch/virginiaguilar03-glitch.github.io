// ============================================================
// AUTH.JS - VAIDTÁXI
// Controle global de autenticação e navegação
// ============================================================

document.addEventListener("DOMContentLoaded", async () => {

    console.log("Auth global iniciado.");

    // ------------------------------------------------------------
    // VERIFICA SUPABASE
    // ------------------------------------------------------------

    if (typeof supabaseClient === "undefined") {
        console.error("supabaseClient não encontrado.");
        return;
    }

    // ------------------------------------------------------------
    // ELEMENTOS
    // ------------------------------------------------------------

    const headerButtons =
        document.querySelector(".header-buttons");

    if (!headerButtons) {
        console.log("Nenhum .header-buttons encontrado.");
        return;
    }

    // ------------------------------------------------------------
    // VERIFICA SESSÃO
    // ------------------------------------------------------------

    const {
        data: { session },
        error
    } = await supabaseClient.auth.getSession();

    if (error) {
        console.error(
            "Erro ao verificar sessão:",
            error
        );

        mostrarDeslogado();
        return;
    }

    if (session && session.user) {

        console.log(
            "Usuário logado:",
            session.user.email
        );

        mostrarLogado(session.user);

    } else {

        console.log("Nenhum usuário logado.");

        mostrarDeslogado();
    }

    // ------------------------------------------------------------
    // ACOMPANHA ALTERAÇÕES DE LOGIN
    // ------------------------------------------------------------

    supabaseClient.auth.onAuthStateChange(
        (event, sessionAtual) => {

            console.log(
                "Estado da autenticação:",
                event
            );

            if (
                sessionAtual &&
                sessionAtual.user
            ) {

                mostrarLogado(
                    sessionAtual.user
                );

            } else {

                mostrarDeslogado();
            }
        }
    );

    // ============================================================
    // MOSTRAR USUÁRIO LOGADO
    // ============================================================

    function mostrarLogado(usuario) {

        const tipo =
            localStorage.getItem("tipoAcesso");

        let nome =
            usuario.user_metadata?.nome ||
            usuario.user_metadata?.name ||
            usuario.email?.split("@")[0] ||
            "Usuário";

        // --------------------------------------------------------
        // CABEÇALHO
        // --------------------------------------------------------

        headerButtons.innerHTML = `
            <span
                class="usuario-logado"
                id="usuarioLogado"
            >
                Olá, ${nome}
            </span>

            <button
                type="button"
                class="btn-outline"
                id="btnSairAuth"
            >
                Sair
            </button>
        `;

        // --------------------------------------------------------
        // BOTÃO SAIR
        // --------------------------------------------------------

        const btnSair =
            document.getElementById("btnSairAuth");

        if (btnSair) {

            btnSair.addEventListener(
                "click",
                async () => {

                    btnSair.disabled = true;

                    const {
                        error
                    } =
                        await supabaseClient.auth.signOut();

                    if (error) {

                        console.error(
                            "Erro ao sair:",
                            error
                        );

                        alert(
                            "Não foi possível sair. Tente novamente."
                        );

                        btnSair.disabled = false;

                        return;
                    }

                    // Limpa informações locais
                    localStorage.removeItem(
                        "usuarioId"
                    );

                    localStorage.removeItem(
                        "tipoAcesso"
                    );

                    // Volta para login
                    window.location.href =
                        "login.html";
                }
            );
        }

        // --------------------------------------------------------
        // ATUALIZA NAVEGAÇÃO
        // --------------------------------------------------------

        atualizarNavegacao(tipo);
    }

    // ============================================================
    // USUÁRIO DESLOGADO
    // ============================================================

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
                class="btn-primary"
            >
                Cadastre-se
            </a>
        `;

        atualizarNavegacao(null);
    }

    // ============================================================
    // NAVEGAÇÃO
    // ============================================================

    function atualizarNavegacao(tipo) {

        const nav =
            document.querySelector("nav");

        if (!nav) {
            return;
        }

        // --------------------------------------------------------
        // USUÁRIO LOGADO COMO CLIENTE
        // --------------------------------------------------------

        if (tipo === "cliente") {

            nav.innerHTML = `

                <a href="cliente.html">
                    Área do Cliente
                </a>

                <a href="motoristas.html">
                    Motoristas
                </a>

                <a href="corrida.html">
                    Solicitar Corrida
                </a>

                <a href="pagamentos.html">
                    Pagamentos
                </a>

                <a href="contato.html">
                    Suporte
                </a>

            `;

            return;
        }

        // --------------------------------------------------------
        // USUÁRIO LOGADO COMO PARCEIRO
        // --------------------------------------------------------

        if (tipo === "parceiro") {

            nav.innerHTML = `

                <a href="parceiro.html">
                    Área do Parceiro
                </a>

                <a href="motoristas.html">
                    Motoristas
                </a>

                <a href="contato.html">
                    Suporte
                </a>

            `;

            return;
        }

        // --------------------------------------------------------
        // USUÁRIO LOGADO COMO ADMINISTRADOR
        // --------------------------------------------------------

        if (tipo === "admin") {

            nav.innerHTML = `

                <a href="admin.html">
                    Administração
                </a>

                <a href="contato.html">
                    Suporte
                </a>

            `;

            return;
        }

        // --------------------------------------------------------
        // USUÁRIO NÃO LOGADO
        // --------------------------------------------------------

        nav.innerHTML = `

            <a href="index.html">
                Início
            </a>

            <a href="motoristas.html">
                Motoristas
            </a>

            <a href="corrida.html">
                Corridas
            </a>

            <a href="pagamentos.html">
                Pagamentos
            </a>

            <a href="contato.html">
                Contato
            </a>

        `;
    }

});

// ============================================================
// AUTENTICAÇÃO / PROTEÇÃO DE PÁGINAS - VAIDTÁXI
// ============================================================

(async function () {

    console.log("🔐 Verificando sessão...");

    try {

        // Recupera a sessão atual do Supabase
        const { data, error } =
            await supabaseClient.auth.getSession();

        if (error) {
            console.error("❌ Erro ao recuperar sessão:", error);
            window.location.href = "entrar.html";
            return;
        }

        const session = data?.session;

        // --------------------------------------------------------
        // NÃO ESTÁ LOGADO
        // --------------------------------------------------------

        if (!session) {

            console.warn("⚠️ Nenhuma sessão encontrada.");

            window.location.href = "entrar.html";

            return;
        }

        // --------------------------------------------------------
        // ESTÁ LOGADO
        // --------------------------------------------------------

        const usuario = session.user;

        console.log("✅ Sessão encontrada:", usuario.email);

        // Disponibiliza o usuário para os outros scripts
        window.usuarioLogado = usuario;

        // --------------------------------------------------------
        // MOSTRAR NOME DO USUÁRIO
        // --------------------------------------------------------

        const nome =
            usuario.user_metadata?.nome ||
            usuario.user_metadata?.name ||
            usuario.email;

        document.querySelectorAll(
            "#nomeUsuario, .nomeUsuario, [data-user-name]"
        ).forEach(elemento => {

            elemento.textContent = nome;

        });

        // --------------------------------------------------------
        // BOTÃO SAIR
        // --------------------------------------------------------

        document.querySelectorAll(
            "#btnSair, .btnSair, [data-logout]"
        ).forEach(botao => {

            botao.addEventListener("click", async function (event) {

                event.preventDefault();

                console.log("🚪 Saindo...");

                const { error } =
                    await supabaseClient.auth.signOut();

                if (error) {

                    console.error(
                        "❌ Erro ao sair:",
                        error
                    );

                    return;
                }

                window.location.href = "entrar.html";

            });

        });

    } catch (erro) {

        console.error(
            "❌ Erro inesperado na autenticação:",
            erro
        );

        window.location.href = "entrar.html";

    }

})();

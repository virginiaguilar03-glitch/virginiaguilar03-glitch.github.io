// ============================================================
// AUTH - VAIDTÁXI
// ============================================================

(async function () {

    console.log("🔐 Iniciando verificação de autenticação...");

    try {

        // --------------------------------------------------------
        // RECUPERA A SESSÃO
        // --------------------------------------------------------

        const { data, error } =
            await supabaseClient.auth.getSession();

        if (error) {
            console.error("Erro ao recuperar sessão:", error);
            return;
        }

        const session = data?.session;

        console.log(
            session
                ? "✅ Usuário está logado"
                : "⚠️ Usuário não está logado"
        );

        // --------------------------------------------------------
        // ELEMENTOS DO CABEÇALHO
        // --------------------------------------------------------

        const links = document.querySelectorAll("header a");

        let linkEntrar = null;
        let linkCadastro = null;

        links.forEach(link => {

            const texto = link.textContent.trim().toLowerCase();

            if (texto === "entrar") {
                linkEntrar = link;
            }

            if (
                texto === "cadastre-se" ||
                texto === "cadastre se" ||
                texto === "cadastrar-se"
            ) {
                linkCadastro = link;
            }

        });

        // --------------------------------------------------------
        // USUÁRIO LOGADO
        // --------------------------------------------------------

        if (session) {

            const usuario = session.user;

            window.usuarioLogado = usuario;

            const nome =
                usuario.user_metadata?.nome ||
                usuario.user_metadata?.name ||
                usuario.email?.split("@")[0] ||
                "Usuário";

            console.log("👤 Usuário:", nome);

            // --------------------------------------------
            // TROCA "ENTRAR" PELO NOME
            // --------------------------------------------

            if (linkEntrar) {

                linkEntrar.textContent = `Olá, ${nome}`;

                linkEntrar.removeAttribute("href");

                linkEntrar.style.cursor = "default";

                linkEntrar.classList.add("usuario-logado");

            }

            // --------------------------------------------
            // TROCA "CADASTRE-SE" POR "SAIR"
            // --------------------------------------------

            if (linkCadastro) {

                linkCadastro.textContent = "Sair";

                linkCadastro.href = "#";

                linkCadastro.classList.add("btn-sair");

                linkCadastro.addEventListener(
                    "click",
                    async function (event) {

                        event.preventDefault();

                        console.log("🚪 Fazendo logout...");

                        const { error } =
                            await supabaseClient.auth.signOut();

                        if (error) {

                            console.error(
                                "Erro ao sair:",
                                error
                            );

                            return;
                        }

                        window.location.href = "entrar.html";

                    }
                );

            }

        }

        // --------------------------------------------------------
        // USUÁRIO NÃO LOGADO
        // --------------------------------------------------------

        else {

            console.log("👤 Nenhum usuário autenticado.");

        }

    } catch (erro) {

        console.error(
            "❌ Erro no sistema de autenticação:",
            erro
        );

    }

})();

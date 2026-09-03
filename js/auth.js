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
    // CORRIGIR DUPLICAÇÃO DA ÁREA DO CLIENTE
    // ========================================================

    limparAreaClienteDuplicada();


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

        mostrarLogado(
            session.user
        );

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


// ============================================================
// REMOVER "ÁREA DO CLIENTE" DUPLICADA
// ============================================================

function limparAreaClienteDuplicada() {

    const menu =
        document.querySelector("nav");


    // Se não existir menu, não faz nada
    if (!menu) {

        return;

    }


    // ========================================================
    // PROCURA OS LINKS DA ÁREA DO CLIENTE
    // ========================================================

    const linksCliente =
        Array.from(
            menu.querySelectorAll(
                'a[href="cliente.html"]'
            )
        );


    // Se existe apenas um, está tudo certo
    if (linksCliente.length <= 1) {

        return;

    }


    console.warn(
        "Links duplicados da Área do Cliente encontrados. Corrigindo..."
    );


    // ========================================================
    // ESCOLHE QUAL LINK DEVE PERMANECER
    // ========================================================

    let linkParaManter =
        linksCliente.find(
            link =>
                link.classList.contains("active")
        );


    // Se nenhum estiver ativo, mantém o primeiro
    if (!linkParaManter) {

        linkParaManter =
            linksCliente[0];

    }


    // ========================================================
    // REMOVE OS OUTROS
    // ========================================================

    linksCliente.forEach(link => {

        if (link !== linkParaManter) {

            link.remove();

        }

    });


    console.log(
        "Duplicação da Área do Cliente corrigida."
    );

}

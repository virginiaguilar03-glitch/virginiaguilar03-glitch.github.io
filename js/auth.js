// ============================================================
// AUTH.JS - VAIDTÁXI
// Autenticação global do sistema
// ============================================================


// ============================================================
// INICIALIZAÇÃO
// ============================================================

document.addEventListener("DOMContentLoaded", async () => {

    console.log("Auth global iniciado.");


    // ========================================================
    // VERIFICA SE O SUPABASE EXISTE
    // ========================================================

    if (typeof supabaseClient === "undefined") {

        console.error(
            "supabaseClient não foi encontrado."
        );

        return;
    }


    // ========================================================
    // PROCURA O CABEÇALHO
    // ========================================================

    const headerButtons =
        document.querySelector(".header-buttons");


    if (!headerButtons) {

        console.log(
            "Nenhum .header-buttons encontrado nesta página."
        );

    }


    // ========================================================
    // VERIFICA A SESSÃO
    // ========================================================

    const {
        data,
        error
    } = await supabaseClient.auth.getSession();


    if (error) {

        console.error(
            "Erro ao verificar sessão:",
            error
        );

        return;
    }


    const session =
        data?.session;


    // ========================================================
    // USUÁRIO LOGADO
    // ========================================================

    if (session && session.user) {

        console.log(
            "Usuário logado:",
            session.user.email
        );


        mostrarLogado(
            session.user
        );

    }

    // ========================================================
    // NENHUM USUÁRIO LOGADO
    // ========================================================

    else {

        console.log(
            "Nenhum usuário logado."
        );


        mostrarDeslogado();

    }


    // ========================================================
    // OBSERVA ALTERAÇÕES DE AUTENTICAÇÃO
    // ========================================================

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

            }

            else {

                mostrarDeslogado();

            }

        }
    );

});



// ============================================================
// MOSTRAR USUÁRIO LOGADO
// ============================================================

function mostrarLogado(usuario) {

    const areaBotoes =
        document.querySelector(".header-buttons");


    // --------------------------------------------------------
    // SE A PÁGINA NÃO POSSUI BOTÕES
    // --------------------------------------------------------

    if (!areaBotoes) {

        return;
    }


    // ========================================================
    // DEFINE O NOME
    // ========================================================

    let nome =
        "Cliente";


    if (
        usuario.user_metadata &&
        usuario.user_metadata.nome
    ) {

        nome =
            usuario.user_metadata.nome;

    }

    else if (
        usuario.user_metadata &&
        usuario.user_metadata.name
    ) {

        nome =
            usuario.user_metadata.name;

    }

    else if (
        usuario.email
    ) {

        nome =
            usuario.email.split("@")[0];

    }


    // ========================================================
    // FORMATA O NOME
    // ========================================================

    nome =
        nome.charAt(0).toUpperCase() +
        nome.slice(1);


    // ========================================================
    // MOSTRA USUÁRIO + SAIR
    // ========================================================

    areaBotoes.innerHTML = `

        <span class="usuario-logado">
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


    // ========================================================
    // BOTÃO SAIR
    // ========================================================

    const btnSair =
        document.getElementById(
            "btnSairAuth"
        );


    if (btnSair) {

        btnSair.addEventListener(
            "click",
            async () => {

                await sairDaConta();

            }
        );

    }

}



// ============================================================
// MOSTRAR USUÁRIO DESLOGADO
// ============================================================

function mostrarDeslogado() {

    const areaBotoes =
        document.querySelector(".header-buttons");


    if (!areaBotoes) {

        return;
    }


    // ========================================================
    // BOTÕES PARA USUÁRIO NÃO LOGADO
    // ========================================================

    areaBotoes.innerHTML = `

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



// ============================================================
// SAIR DA CONTA
// ============================================================

async function sairDaConta() {

    try {

        console.log(
            "Encerrando sessão..."
        );


        // ====================================================
        // FAZ LOGOUT NO SUPABASE
        // ====================================================

        const {
            error
        } = await supabaseClient.auth.signOut();


        if (error) {

            console.error(
                "Erro ao sair:",
                error
            );


            alert(
                "Não foi possível encerrar a sessão. Tente novamente."
            );

            return;
        }


        // ====================================================
        // LIMPA DADOS LOCAIS
        // ====================================================

        localStorage.removeItem(
            "usuarioId"
        );

        localStorage.removeItem(
            "tipoAcesso"
        );


        // ====================================================
        // REDIRECIONA PARA O INÍCIO
        // ====================================================

        window.location.href =
            "index.html";


    } catch (erro) {

        console.error(
            "Erro inesperado ao sair:",
            erro
        );


        alert(
            "Ocorreu um erro ao encerrar a sessão."
        );

    }

}

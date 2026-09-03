// ============================================================
// AUTH.JS - VAIDTÁXI
// Autenticação global
// ============================================================

document.addEventListener("DOMContentLoaded", async () => {

    console.log("Auth global iniciado.");


    // ========================================================
    // VERIFICA SUPABASE
    // ========================================================

    if (typeof supabaseClient === "undefined") {

        console.error(
            "supabaseClient não encontrado."
        );

        return;
    }


    // ========================================================
    // VERIFICA SESSÃO
    // ========================================================

    const {
        data,
        error
    } = await supabaseClient.auth.getSession();


    if (error) {

        console.error(
            "Erro ao verificar autenticação:",
            error
        );

        return;
    }


    const session = data?.session;


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

        adicionarAreaCliente();

    }

    // ========================================================
    // USUÁRIO NÃO LOGADO
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
        (event, novaSessao) => {

            console.log(
                "Estado da autenticação:",
                event
            );


            if (
                novaSessao &&
                novaSessao.user
            ) {

                mostrarLogado(
                    novaSessao.user
                );

                adicionarAreaCliente();

            }

            else {

                mostrarDeslogado();

                removerAreaCliente();

            }

        }
    );

});


// ============================================================
// MOSTRAR USUÁRIO LOGADO
// ============================================================

function mostrarLogado(usuario) {

    const areaBotoes =
        document.querySelector(
            ".header-buttons"
        );


    if (!areaBotoes) {

        return;
    }


    // ========================================================
    // DEFINE NOME
    // ========================================================

    let nome = "Cliente";


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

    else if (usuario.email) {

        nome =
            usuario.email.split("@")[0];

    }


    // ========================================================
    // PRIMEIRA LETRA MAIÚSCULA
    // ========================================================

    nome =
        nome.charAt(0).toUpperCase() +
        nome.slice(1);


    // ========================================================
    // NÃO MEXE NO MENU
    // SOMENTE NOS BOTÕES DO USUÁRIO
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
            sairDaConta
        );

    }

}


// ============================================================
// MOSTRAR USUÁRIO DESLOGADO
// ============================================================

function mostrarDeslogado() {

    const areaBotoes =
        document.querySelector(
            ".header-buttons"
        );


    if (!areaBotoes) {

        return;
    }


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
// ADICIONAR "ÁREA DO CLIENTE"
// ============================================================

function adicionarAreaCliente() {

    const tipoAcesso =
        localStorage.getItem(
            "tipoAcesso"
        );


    // --------------------------------------------------------
    // SÓ ADICIONA PARA CLIENTE
    // --------------------------------------------------------

    if (tipoAcesso !== "cliente") {

        return;
    }


    const menu =
        document.getElementById(
            "menuPrincipal"
        );


    if (!menu) {

        return;
    }


    // --------------------------------------------------------
    // EVITA DUPLICAR O BOTÃO
    // --------------------------------------------------------

    if (
        menu.querySelector(
            'a[href="cliente.html"]'
        )
    ) {

        return;
    }


    // --------------------------------------------------------
    // CRIA SOMENTE O NOVO LINK
    // --------------------------------------------------------

    const link =
        document.createElement("a");


    link.href =
        "cliente.html";


    link.innerHTML = `
        <i class="fa-solid fa-user"></i>
        Área do Cliente
    `;


    // --------------------------------------------------------
    // COLOCA DEPOIS DO "INÍCIO"
    // --------------------------------------------------------

    const inicio =
        menu.querySelector(
            'a[href="index.html"]'
        );


    if (inicio) {

        inicio.insertAdjacentElement(
            "afterend",
            link
        );

    }

    else {

        menu.prepend(link);

    }

}


// ============================================================
// REMOVER "ÁREA DO CLIENTE"
// ============================================================

function removerAreaCliente() {

    const menu =
        document.getElementById(
            "menuPrincipal"
        );


    if (!menu) {

        return;
    }


    const areaCliente =
        menu.querySelector(
            'a[href="cliente.html"]'
        );


    if (areaCliente) {

        areaCliente.remove();

    }

}


// ============================================================
// SAIR DA CONTA
// ============================================================

async function sairDaConta() {

    try {

        const {
            error
        } =
            await supabaseClient.auth.signOut();


        if (error) {

            console.error(
                "Erro ao sair da conta:",
                error
            );

            alert(
                "Não foi possível sair da conta."
            );

            return;
        }


        // ====================================================
        // LIMPA DADOS DO USUÁRIO
        // ====================================================

        localStorage.removeItem(
            "usuarioId"
        );

        localStorage.removeItem(
            "tipoAcesso"
        );


        // ====================================================
        // VOLTA PARA O INÍCIO
        // ====================================================

        window.location.href =
            "index.html";

    }

    catch (erro) {

        console.error(
            "Erro inesperado ao sair:",
            erro
        );

        alert(
            "Ocorreu um erro ao sair da conta."
        );

    }

}

// ============================================================
// AUTH.JS - VAIDTÁXI
// AUTENTICAÇÃO GLOBAL
//
// IMPORTANTE:
// Este arquivo NÃO recria o menu.
// Ele apenas:
// 1. Mostra o usuário logado no cabeçalho
// 2. Adiciona "Área do Cliente" quando necessário
// ============================================================


document.addEventListener(
    "DOMContentLoaded",
    async function () {

        console.log("Auth global iniciado.");


        // ====================================================
        // VERIFICAR SUPABASE
        // ====================================================

        if (
            typeof supabaseClient === "undefined"
        ) {

            console.error(
                "supabaseClient não encontrado."
            );

            return;
        }


        // ====================================================
        // VERIFICAR SESSÃO
        // ====================================================

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

            return;
        }


        const session =
            data?.session;


        // ====================================================
        // USUÁRIO LOGADO
        // ====================================================

        if (
            session &&
            session.user
        ) {

            console.log(
                "Usuário logado:",
                session.user.email
            );


            // ------------------------------------------------
            // RECUPERAR TIPO DE ACESSO
            // ------------------------------------------------

            let tipoAcesso =
                localStorage.getItem(
                    "tipoAcesso"
                );


            // ------------------------------------------------
            // SE NÃO ENCONTRAR NO LOCALSTORAGE,
            // TENTA PEGAR DO METADATA DO SUPABASE
            // ------------------------------------------------

            if (
                !tipoAcesso &&
                session.user.user_metadata
            ) {

                tipoAcesso =
                    session.user.user_metadata.tipo;

            }


            console.log(
                "Tipo de acesso identificado:",
                tipoAcesso
            );


            // ------------------------------------------------
            // GARANTE QUE O TIPO FIQUE SALVO
            // ------------------------------------------------

            if (tipoAcesso) {

                localStorage.setItem(
                    "tipoAcesso",
                    tipoAcesso
                );

            }


            // ------------------------------------------------
            // MOSTRA USUÁRIO
            // ------------------------------------------------

            mostrarLogado(
                session.user
            );


            // ------------------------------------------------
            // SE FOR CLIENTE,
            // ADICIONA APENAS O BOTÃO
            // ------------------------------------------------

            if (
                tipoAcesso === "cliente"
            ) {

                adicionarBotaoAreaCliente();

            }

        }

        else {

            console.log(
                "Nenhum usuário logado."
            );

            mostrarDeslogado();

            removerBotaoAreaCliente();

        }


        // ====================================================
        // OBSERVAR ALTERAÇÕES DE AUTENTICAÇÃO
        // ====================================================

        supabaseClient.auth.onAuthStateChange(
            function (
                event,
                novaSessao
            ) {

                console.log(
                    "Estado da autenticação:",
                    event
                );


                if (
                    novaSessao &&
                    novaSessao.user
                ) {

                    let tipoAcesso =
                        localStorage.getItem(
                            "tipoAcesso"
                        );


                    if (
                        !tipoAcesso &&
                        novaSessao.user.user_metadata
                    ) {

                        tipoAcesso =
                            novaSessao
                                .user
                                .user_metadata
                                .tipo;

                    }


                    if (tipoAcesso) {

                        localStorage.setItem(
                            "tipoAcesso",
                            tipoAcesso
                        );

                    }


                    mostrarLogado(
                        novaSessao.user
                    );


                    if (
                        tipoAcesso === "cliente"
                    ) {

                        adicionarBotaoAreaCliente();

                    }

                }

                else {

                    mostrarDeslogado();

                    removerBotaoAreaCliente();

                }

            }
        );

    }
);


// ============================================================
// MOSTRAR USUÁRIO LOGADO
// ============================================================

function mostrarLogado(
    usuario
) {

    const areaBotoes =
        document.querySelector(
            ".header-buttons"
        );


    if (!areaBotoes) {

        return;

    }


    // ========================================================
    // NOME DO USUÁRIO
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
    // PRIMEIRA LETRA MAIÚSCULA
    // ========================================================

    nome =
        nome.charAt(0).toUpperCase() +
        nome.slice(1);


    // ========================================================
    // SOMENTE A ÁREA DOS BOTÕES
    //
    // NÃO MEXEMOS NO <nav>
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
// USUÁRIO DESLOGADO
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
// ADICIONAR BOTÃO "ÁREA DO CLIENTE"
// ============================================================
//
// ATENÇÃO:
//
// Não substituímos o menu.
// Não usamos menu.innerHTML.
// Criamos SOMENTE um novo <a>.
// ============================================================

function adicionarBotaoAreaCliente() {

    const menu =
        document.querySelector(
            "nav"
        );


    if (!menu) {

        console.log(
            "Menu não encontrado."
        );

        return;

    }


    // ========================================================
    // VERIFICA SE JÁ EXISTE
    // ========================================================

    const jaExiste =
        menu.querySelector(
            'a[data-area-cliente="true"]'
        );


    if (jaExiste) {

        return;

    }


    // ========================================================
    // CRIAR NOVO LINK
    // ========================================================

    const link =
        document.createElement(
            "a"
        );


    link.href =
        "cliente.html";


    link.setAttribute(
        "data-area-cliente",
        "true"
    );


    link.innerHTML = `

        <i class="fa-solid fa-user"></i>
        Área do Cliente

    `;


    // ========================================================
    // LOCALIZAR "INÍCIO"
    // ========================================================

    const inicio =
        menu.querySelector(
            'a[href="index.html"]'
        );


    // ========================================================
    // COLOCAR LOGO DEPOIS DE "INÍCIO"
    // ========================================================

    if (inicio) {

        inicio.insertAdjacentElement(
            "afterend",
            link
        );

    }

    else {

        menu.prepend(
            link
        );

    }


    console.log(
        "Botão Área do Cliente adicionado."
    );

}


// ============================================================
// REMOVER BOTÃO ÁREA DO CLIENTE
// ============================================================

function removerBotaoAreaCliente() {

    const link =
        document.querySelector(
            'a[data-area-cliente="true"]'
        );


    if (link) {

        link.remove();

    }

}


// ============================================================
// SAIR
// ============================================================

async function sairDaConta() {

    try {

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
                "Não foi possível sair da conta."
            );

            return;

        }


        // ====================================================
        // LIMPAR DADOS
        // ====================================================

        localStorage.removeItem(
            "usuarioId"
        );

        localStorage.removeItem(
            "tipoAcesso"
        );


        // ====================================================
        // IR PARA INÍCIO
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

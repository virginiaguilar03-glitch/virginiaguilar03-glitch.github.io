// ============================================================
// AUTH.JS - AUTENTICAÇÃO GLOBAL | VAIDTÁXI
// Controle de usuário e navegação por tipo de acesso
// ============================================================


document.addEventListener("DOMContentLoaded", async () => {

    console.log("Auth global iniciado.");


    // ========================================================
    // VERIFICA SUPABASE
    // ========================================================

    if (typeof supabaseClient === "undefined") {

        console.error(
            "supabaseClient não foi encontrado."
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


        const tipoAcesso =
            localStorage.getItem("tipoAcesso");


        console.log(
            "Tipo de acesso:",
            tipoAcesso
        );


        // ----------------------------------------------------
        // ATUALIZA CABEÇALHO
        // ----------------------------------------------------

        mostrarLogado(
            session.user
        );


        // ----------------------------------------------------
        // ATUALIZA MENU
        // ----------------------------------------------------

        atualizarNavegacao(
            tipoAcesso
        );

    }

    else {

        console.log(
            "Nenhum usuário logado."
        );


        mostrarDeslogado();


        atualizarNavegacao(
            null
        );

    }


    // ========================================================
    // OBSERVA ALTERAÇÕES DE AUTENTICAÇÃO
    // ========================================================

    supabaseClient.auth.onAuthStateChange(
        async (event, sessionAtual) => {

            console.log(
                "Estado da autenticação:",
                event
            );


            if (
                sessionAtual &&
                sessionAtual.user
            ) {

                const tipoAcesso =
                    localStorage.getItem(
                        "tipoAcesso"
                    );


                mostrarLogado(
                    sessionAtual.user
                );


                atualizarNavegacao(
                    tipoAcesso
                );

            }

            else {

                mostrarDeslogado();


                atualizarNavegacao(
                    null
                );

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


    // --------------------------------------------------------
    // ALGUMAS PÁGINAS PODEM NÃO TER BOTÕES
    // --------------------------------------------------------

    if (!areaBotoes) {

        console.log(
            "Página sem .header-buttons."
        );

        return;
    }


    // --------------------------------------------------------
    // DEFINE NOME
    // --------------------------------------------------------

    let nome =
        "Usuário";


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


    // --------------------------------------------------------
    // PRIMEIRA LETRA MAIÚSCULA
    // --------------------------------------------------------

    nome =
        nome.charAt(0).toUpperCase() +
        nome.slice(1);


    // --------------------------------------------------------
    // CRIA CABEÇALHO DO USUÁRIO
    // --------------------------------------------------------

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


    // --------------------------------------------------------
    // BOTÃO SAIR
    // --------------------------------------------------------

    const btnSair =
        document.getElementById(
            "btnSairAuth"
        );


    if (btnSair) {

        btnSair.addEventListener(
            "click",
            async () => {

                await sair();

            }
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
// ATUALIZAR NAVEGAÇÃO
// ============================================================

function atualizarNavegacao(tipoAcesso) {

    const menu =
        document.getElementById(
            "menuPrincipal"
        );


    // --------------------------------------------------------
    // SE NÃO EXISTIR MENU NA PÁGINA
    // --------------------------------------------------------

    if (!menu) {

        console.log(
            "Menu principal não encontrado nesta página."
        );

        return;
    }


    // ========================================================
    // CLIENTE
    // ========================================================

    if (tipoAcesso === "cliente") {

        menu.innerHTML = `

            <a href="index.html">
                <i class="fa-solid fa-house"></i>
                Início
            </a>

            <a
                href="cliente.html"
                class="active"
            >
                <i class="fa-solid fa-user"></i>
                Área do Cliente
            </a>

            <a href="motoristas.html">
                <i class="fa-solid fa-users"></i>
                Motoristas
            </a>

            <a href="corrida.html">
                <i class="fa-solid fa-taxi"></i>
                Solicitar Corrida
            </a>

            <a href="pagamentos.html">
                <i class="fa-solid fa-wallet"></i>
                Pagamentos
            </a>

            <a href="contato.html">
                <i class="fa-solid fa-headset"></i>
                Suporte
            </a>

        `;

        return;
    }



    // ========================================================
    // PARCEIRO / TAXISTA
    // ========================================================

    if (tipoAcesso === "parceiro") {

        menu.innerHTML = `

            <a href="index.html">
                <i class="fa-solid fa-house"></i>
                Início
            </a>

            <a
                href="parceiro.html"
                class="active"
            >
                <i class="fa-solid fa-car"></i>
                Área do Parceiro
            </a>

            <a href="corridas-parceiro.html">
                <i class="fa-solid fa-taxi"></i>
                Corridas
            </a>

            <a href="motoristas.html">
                <i class="fa-solid fa-users"></i>
                Motoristas
            </a>

            <a href="contato.html">
                <i class="fa-solid fa-headset"></i>
                Suporte
            </a>

        `;

        return;
    }



    // ========================================================
    // ADMINISTRADOR
    // ========================================================

    if (tipoAcesso === "admin") {

        menu.innerHTML = `

            <a href="index.html">
                <i class="fa-solid fa-house"></i>
                Início
            </a>

            <a
                href="admin.html"
                class="active"
            >
                <i class="fa-solid fa-shield-halved"></i>
                Administração
            </a>

            <a href="motoristas.html">
                <i class="fa-solid fa-users"></i>
                Motoristas
            </a>

            <a href="contato.html">
                <i class="fa-solid fa-headset"></i>
                Suporte
            </a>

        `;

        return;
    }



    // ========================================================
    // USUÁRIO NÃO LOGADO
    // ========================================================

    menu.innerHTML = `

        <a href="index.html">
            <i class="fa-solid fa-house"></i>
            Início
        </a>

        <a href="motoristas.html">
            <i class="fa-solid fa-users"></i>
            Motoristas
        </a>

        <a href="corrida.html">
            <i class="fa-solid fa-taxi"></i>
            Corridas
        </a>

        <a href="pagamentos.html">
            <i class="fa-solid fa-wallet"></i>
            Pagamentos
        </a>

        <a href="contato.html">
            <i class="fa-solid fa-headset"></i>
            Contato
        </a>

    `;

}



// ============================================================
// SAIR DA CONTA
// ============================================================

async function sair() {

    try {

        console.log(
            "Saindo da conta..."
        );


        const {
            error
        } = await supabaseClient.auth.signOut();


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


        // ----------------------------------------------------
        // LIMPA DADOS DO LOGIN
        // ----------------------------------------------------

        localStorage.removeItem(
            "usuarioId"
        );

        localStorage.removeItem(
            "tipoAcesso"
        );


        sessionStorage.clear();


        console.log(
            "Usuário saiu com sucesso."
        );


        // ----------------------------------------------------
        // VOLTA PARA O INÍCIO
        // ----------------------------------------------------

        window.location.href =
            "index.html";


    } catch (erro) {

        console.error(
            "Erro inesperado ao sair:",
            erro
        );

    }

}

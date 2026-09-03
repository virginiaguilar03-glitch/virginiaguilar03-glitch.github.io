// ============================================================
// AUTH.JS - VAIDTÁXI
// Controle global de autenticação e navegação
// ============================================================

document.addEventListener("DOMContentLoaded", async () => {

    console.log("Auth global iniciado.");

    // --------------------------------------------------------
    // VERIFICA SE O SUPABASE ESTÁ DISPONÍVEL
    // --------------------------------------------------------

    if (typeof supabaseClient === "undefined") {

        console.error(
            "supabaseClient não foi encontrado."
        );

        return;
    }


    // --------------------------------------------------------
    // OBTÉM A SESSÃO ATUAL
    // --------------------------------------------------------

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


    const session = data?.session;


    // --------------------------------------------------------
    // USUÁRIO LOGADO
    // --------------------------------------------------------

    if (session && session.user) {

        console.log(
            "Usuário logado:",
            session.user.email
        );

        atualizarAreaUsuario(session.user);

    }

    // --------------------------------------------------------
    // NENHUM USUÁRIO LOGADO
    // --------------------------------------------------------

    else {

        console.log(
            "Nenhum usuário logado."
        );

        mostrarUsuarioDeslogado();
    }


    // --------------------------------------------------------
    // OBSERVA ALTERAÇÕES DE LOGIN / LOGOUT
    // --------------------------------------------------------

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

                atualizarAreaUsuario(
                    novaSessao.user
                );

            }

            else {

                mostrarUsuarioDeslogado();

            }

        }
    );

});


// ============================================================
// ATUALIZA A ÁREA DO USUÁRIO
// ============================================================

function atualizarAreaUsuario(usuario) {

    // --------------------------------------------------------
    // RECUPERA O TIPO DE ACESSO
    // --------------------------------------------------------

    const tipoAcesso =
        localStorage.getItem("tipoAcesso");


    console.log(
        "Tipo de acesso:",
        tipoAcesso
    );


    // --------------------------------------------------------
    // ATUALIZA CABEÇALHO
    // --------------------------------------------------------

    atualizarCabecalho(
        usuario,
        tipoAcesso
    );


    // --------------------------------------------------------
    // ATUALIZA MENU
    // --------------------------------------------------------

    atualizarMenu(
        tipoAcesso
    );

}


// ============================================================
// ATUALIZA O CABEÇALHO
// ============================================================

function atualizarCabecalho(
    usuario,
    tipoAcesso
) {

    const headerButtons =
        document.querySelector(
            ".header-buttons"
        );


    if (!headerButtons) {

        console.log(
            "Área de botões do cabeçalho não encontrada."
        );

        return;
    }


    // --------------------------------------------------------
    // DEFINE NOME
    // --------------------------------------------------------

    let nome = "Usuário";


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


    // --------------------------------------------------------
    // CAPITALIZA PRIMEIRA LETRA
    // --------------------------------------------------------

    nome =
        nome.charAt(0).toUpperCase() +
        nome.slice(1);


    // --------------------------------------------------------
    // CABEÇALHO DO USUÁRIO LOGADO
    // --------------------------------------------------------

    headerButtons.innerHTML = `

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
            sairDaConta
        );

    }

}


// ============================================================
// MENU DO USUÁRIO
// ============================================================

function atualizarMenu(tipoAcesso) {

    const menu =
        document.getElementById(
            "menuPrincipal"
        );


    if (!menu) {

        console.log(
            "Menu principal não encontrado."
        );

        return;
    }


    // --------------------------------------------------------
    // CLIENTE
    // --------------------------------------------------------

    if (tipoAcesso === "cliente") {

        menu.innerHTML = `

            <a href="index.html">
                <i class="fa-solid fa-house"></i>
                Início
            </a>

            <a href="cliente.html">
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


    // --------------------------------------------------------
    // PARCEIRO / TAXISTA
    // --------------------------------------------------------

    if (tipoAcesso === "parceiro") {

        menu.innerHTML = `

            <a href="index.html">
                <i class="fa-solid fa-house"></i>
                Início
            </a>

            <a href="parceiro.html">
                <i class="fa-solid fa-id-card"></i>
                Área do Parceiro
            </a>

            <a href="corrida.html">
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


    // --------------------------------------------------------
    // ADMINISTRADOR
    // --------------------------------------------------------

    if (tipoAcesso === "admin") {

        menu.innerHTML = `

            <a href="index.html">
                <i class="fa-solid fa-house"></i>
                Início
            </a>

            <a href="admin.html">
                <i class="fa-solid fa-shield-halved"></i>
                Administração
            </a>

            <a href="corrida.html">
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


    // --------------------------------------------------------
    // SEM TIPO DE ACESSO
    // --------------------------------------------------------

    console.log(
        "Nenhum tipo de acesso definido. Mantendo menu da página."
    );

}


// ============================================================
// USUÁRIO DESLOGADO
// ============================================================

function mostrarUsuarioDeslogado() {

    const headerButtons =
        document.querySelector(
            ".header-buttons"
        );


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
                "Erro ao sair:",
                error
            );

            alert(
                "Não foi possível sair da conta."
            );

            return;
        }


        // ----------------------------------------------------
        // LIMPA DADOS LOCAIS
        // ----------------------------------------------------

        localStorage.removeItem(
            "usuarioId"
        );

        localStorage.removeItem(
            "tipoAcesso"
        );


        sessionStorage.clear();


        // ----------------------------------------------------
        // VOLTA PARA O INÍCIO
        // ----------------------------------------------------

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

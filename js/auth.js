// ============================================================
// AUTH.JS - VAIDTÁXI
// Controle de sessão e autenticação
// ============================================================


// ============================================================
// VERIFICAR SE O SUPABASE ESTÁ DISPONÍVEL
// ============================================================

function verificarSupabase() {

    if (
        typeof supabaseClient === "undefined" ||
        !supabaseClient
    ) {

        console.error(
            "supabaseClient não foi encontrado."
        );

        return false;
    }

    return true;
}


// ============================================================
// OBTER USUÁRIO LOGADO
// ============================================================

async function obterUsuarioLogado() {

    if (!verificarSupabase()) {
        return null;
    }


    try {

        const {
            data,
            error
        } = await supabaseClient.auth.getUser();


        if (error) {

            console.error(
                "Erro ao obter usuário:",
                error
            );

            return null;
        }


        return data?.user || null;

    }

    catch (erro) {

        console.error(
            "Erro inesperado ao obter usuário:",
            erro
        );

        return null;
    }
}


// ============================================================
// OBTER SESSÃO
// ============================================================

async function obterSessao() {

    if (!verificarSupabase()) {
        return null;
    }


    try {

        const {
            data,
            error
        } = await supabaseClient.auth.getSession();


        if (error) {

            console.error(
                "Erro ao obter sessão:",
                error
            );

            return null;
        }


        return data?.session || null;

    }

    catch (erro) {

        console.error(
            "Erro inesperado ao obter sessão:",
            erro
        );

        return null;
    }
}


// ============================================================
// VERIFICAR LOGIN
// ============================================================

async function verificarLogin() {

    const sessao =
        await obterSessao();


    return !!sessao;
}


// ============================================================
// EXIGIR LOGIN
// ============================================================
//
// Use nas páginas que precisam obrigatoriamente
// de um usuário autenticado.
//
// Exemplo:
//
// <script src="js/auth.js"></script>
// <script>
//     exigirLogin("login.html");
// </script>
//
// ============================================================

async function exigirLogin(
    paginaLogin = "login.html"
) {

    const sessao =
        await obterSessao();


    if (!sessao) {

        console.warn(
            "Usuário não autenticado. Redirecionando..."
        );


        window.location.href =
            paginaLogin;


        return false;
    }


    return true;
}


// ============================================================
// OBTER TIPO DE ACESSO
// ============================================================

async function obterTipoUsuario() {

    const usuario =
        await obterUsuarioLogado();


    if (!usuario) {
        return "";
    }


    /*
     * Primeiro tenta obter o tipo
     * dos metadados do usuário.
     */

    const tipo =
        usuario.user_metadata?.tipo;


    if (
        tipo === "cliente" ||
        tipo === "parceiro" ||
        tipo === "admin"
    ) {

        return tipo;
    }


    /*
     * Caso não exista tipo nos metadados,
     * tenta usar o localStorage antigo.
     *
     * Isso mantém compatibilidade com
     * a estrutura que você já possui.
     */

    const tipoLocal =
        localStorage.getItem(
            "tipoAcesso"
        );


    if (
        tipoLocal === "cliente" ||
        tipoLocal === "parceiro" ||
        tipoLocal === "admin"
    ) {

        return tipoLocal;
    }


    return "";
}


// ============================================================
// EXIGIR TIPO DE ACESSO
// ============================================================
//
// Exemplo:
//
// exigirTipoAcesso("cliente");
//
// ============================================================

async function exigirTipoAcesso(
    tipoPermitido,
    paginaLogin = "login.html"
) {

    const sessao =
        await obterSessao();


    if (!sessao) {

        window.location.href =
            paginaLogin;

        return false;
    }


    const tipo =
        await obterTipoUsuario();


    if (tipo !== tipoPermitido) {

        console.warn(
            "Tipo de acesso não permitido:",
            tipo
        );


        window.location.href =
            "index.html";


        return false;
    }


    return true;
}


// ============================================================
// ENCERRAR SESSÃO
// ============================================================

async function sairDaConta() {

    if (!verificarSupabase()) {
        return;
    }


    try {

        const {
            error
        } = await supabaseClient.auth.signOut();


        if (error) {

            console.error(
                "Erro ao sair:",
                error
            );

            return;
        }


        /*
         * Remove apenas os dados auxiliares
         * antigos do projeto.
         *
         * A sessão verdadeira é controlada
         * pelo Supabase.
         */

        localStorage.removeItem(
            "usuarioId"
        );

        localStorage.removeItem(
            "tipoAcesso"
        );


        window.location.href =
            "login.html";

    }

    catch (erro) {

        console.error(
            "Erro inesperado ao sair:",
            erro
        );

    }

}


// ============================================================
// ESCUTAR ALTERAÇÕES DA SESSÃO
// ============================================================

if (
    typeof supabaseClient !== "undefined" &&
    supabaseClient
) {

    supabaseClient.auth.onAuthStateChange(
        function (
            evento,
            sessao
        ) {

            console.log(
                "Alteração de autenticação:",
                evento
            );


            if (sessao) {

                console.log(
                    "Usuário autenticado:",
                    sessao.user.email
                );

            }

            else {

                console.log(
                    "Nenhum usuário autenticado."
                );

            }

        }
    );

}

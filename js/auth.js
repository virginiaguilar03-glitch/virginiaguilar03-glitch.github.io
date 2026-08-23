// ==========================================
// AUTENTICAÇÃO DO VAIDTÁXI
// ==========================================

// Verifica se existe um usuário autenticado
async function verificarLogin() {

    try {

        const {
            data,
            error
        } = await supabaseClient.auth.getSession();

        if (error) {

            console.error("Erro ao verificar login:", error);

            return null;
        }

        return data.session;

    } catch (erro) {

        console.error("Erro inesperado ao verificar sessão:", erro);

        return null;
    }
}


// ==========================================
// PROTEGER PÁGINAS EXCLUSIVAS
// ==========================================

async function protegerPagina() {

    const session = await verificarLogin();

    if (!session) {

        alert(
            "Você precisa estar cadastrado e logado para acessar esta área."
        );

        window.location.href = "login.html";

        return false;
    }

    return true;
}


// ==========================================
// VERIFICAR SE O USUÁRIO ESTÁ LOGADO
// ==========================================

async function usuarioEstaLogado() {

    const session = await verificarLogin();

    return !!session;
}


// ==========================================
// FAZER LOGOUT
// ==========================================

async function sairDaConta() {

    const confirmar = confirm(
        "Deseja realmente sair da sua conta?"
    );

    if (!confirmar) {
        return;
    }

    try {

        const { error } = await supabaseClient.auth.signOut();

        if (error) {

            console.error("Erro ao sair:", error);

            alert("Não foi possível sair da conta.");

            return;
        }

        // Após sair, volta para a página inicial
        window.location.href = "index.html";

    } catch (erro) {

        console.error("Erro inesperado ao sair:", erro);

        alert("Ocorreu um erro ao sair da conta.");
    }
}

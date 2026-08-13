// ==========================================
// AUTENTICAÇÃO DO VAIDTÁXI
// ==========================================

// Verifica se existe um usuário autenticado
async function verificarLogin() {

    const { data, error } = await supabaseClient.auth.getSession();

    if (error) {
        console.error("Erro ao verificar login:", error);
        return null;
    }

    return data.session;
}


// Protege páginas exclusivas do cliente
async function protegerPagina() {

    const session = await verificarLogin();

    if (!session) {

        alert("Você precisa estar cadastrado e logado para acessar esta área.");

        window.location.href = "login.html";

        return false;
    }

    return true;
}


// Faz logout
async function sairDaConta() {

    const confirmar = confirm(
        "Deseja realmente sair da sua conta?"
    );

    if (!confirmar) {
        return;
    }

    const { error } = await supabaseClient.auth.signOut();

    if (error) {

        console.error("Erro ao sair:", error);

        alert("Não foi possível sair da conta.");

        return;
    }

    window.location.href = "index.html";
}

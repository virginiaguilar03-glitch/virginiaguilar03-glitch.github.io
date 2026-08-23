// ============================================================
// AUTENTICAÇÃO CENTRAL - VAIDTÁXI
// ============================================================

(async function () {

    // Espera o Supabase restaurar a sessão
    const { data, error } = await supabaseClient.auth.getSession();

    if (error) {
        console.error("Erro ao recuperar sessão:", error);
        window.location.href = "entrar.html";
        return;
    }

    const session = data.session;

    // Se não existe sessão, usuário realmente está deslogado
    if (!session) {
        window.location.href = "entrar.html";
        return;
    }

    // Usuário autenticado
    const user = session.user;

    console.log("Usuário autenticado:", user.email);

    // Disponibiliza globalmente
    window.usuarioLogado = user;

    // Nome do usuário
    const elementosNome = document.querySelectorAll(
        "#nomeUsuario, .nomeUsuario, [data-user-name]"
    );

    elementosNome.forEach(elemento => {
        elemento.textContent =
            user.user_metadata?.nome ||
            user.user_metadata?.name ||
            user.email;
    });

})();

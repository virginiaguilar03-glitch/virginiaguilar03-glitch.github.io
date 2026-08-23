// ==========================================
// SOLICITAR CORRIDA - VAIDTÁXI
// ==========================================

async function solicitarCorrida() {

    try {

        // Verifica a sessão atual
        const {
            data,
            error
        } = await supabaseClient.auth.getSession();


        // Erro ao verificar sessão
        if (error) {

            console.error(
                "Erro ao verificar sessão:",
                error
            );

            alert(
                "Não foi possível verificar seu login."
            );

            return;
        }


        // Usuário não está logado
        if (!data.session) {

            alert(
                "Você precisa fazer login para solicitar uma corrida."
            );

            window.location.href = "login.html";

            return;
        }


        // Usuário está logado
        console.log(
            "Usuário logado:",
            data.session.user.email
        );

        alert("Usuário logado!");


    } catch (erro) {

        console.error(
            "Erro inesperado:",
            erro
        );

        alert(
            "Ocorreu um erro ao verificar seu login."
        );
    }
}

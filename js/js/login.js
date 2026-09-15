// ============================================================
// LOGIN - VAIDTÁXI
// ============================================================

async function login() {

    const campoEmail =
        document.getElementById("email");

    const campoSenha =
        document.getElementById("senha");


    if (!campoEmail || !campoSenha) {

        console.error(
            "Campos de login não encontrados."
        );

        alert(
            "Erro: campos de login não encontrados."
        );

        return;
    }


    const email =
        campoEmail.value.trim();

    const senha =
        campoSenha.value;


    // ========================================================
    // VALIDAR CAMPOS
    // ========================================================

    if (!email || !senha) {

        alert(
            "Preencha todos os campos."
        );

        return;
    }


    // ========================================================
    // VERIFICAR SUPABASE
    // ========================================================

    if (
        typeof supabaseClient === "undefined"
    ) {

        console.error(
            "supabaseClient não foi encontrado."
        );

        alert(
            "Erro de conexão com o sistema."
        );

        return;
    }


    // ========================================================
    // DESABILITAR BOTÃO
    // ========================================================

    const botao =
        document.querySelector(
            ".form-login .btn"
        );


    if (botao) {

        botao.disabled = true;

        botao.textContent =
            "Entrando...";

    }


    try {

        // ====================================================
        // LOGIN NO SUPABASE
        // ====================================================

        const {
            data,
            error
        } =
            await supabaseClient.auth
                .signInWithPassword({

                    email: email,

                    password: senha

                });


        // ====================================================
        // ERRO
        // ====================================================

        if (error) {

            console.error(
                "Erro no login:",
                error
            );

            alert(
                "E-mail ou senha incorretos."
            );


            if (botao) {

                botao.disabled = false;

                botao.textContent =
                    "Entrar";

            }

            return;
        }


        // ====================================================
        // VERIFICAR USUÁRIO
        // ====================================================

        if (
            !data ||
            !data.user
        ) {

            console.error(
                "Usuário não retornado pelo Supabase."
            );

            alert(
                "Não foi possível identificar o usuário."
            );


            if (botao) {

                botao.disabled = false;

                botao.textContent =
                    "Entrar";

            }

            return;
        }


        const usuario =
            data.user;


        // ====================================================
        // IDENTIFICAR TIPO
        // ====================================================

        const tipo =
            usuario.user_metadata?.tipo || "";


        console.log(
            "Login realizado:",
            usuario
        );

        console.log(
            "Tipo do usuário:",
            tipo
        );


        // ====================================================
        // LOGIN REALIZADO
        // ====================================================

        alert(
            "Login realizado com sucesso!"
        );


        // ====================================================
        // REDIRECIONAMENTO
        // ====================================================

        if (
            tipo === "admin"
        ) {

            window.location.href =
                "admin.html";

            return;
        }


        // ====================================================
        // OUTROS USUÁRIOS
        // ====================================================

        window.location.href =
            "index.html";

    }


    catch (erro) {

        console.error(
            "Erro inesperado no login:",
            erro
        );

        alert(
            "Erro ao conectar com o sistema."
        );


        if (botao) {

            botao.disabled = false;

            botao.textContent =
                "Entrar";

        }

    }

}

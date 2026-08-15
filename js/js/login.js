// ============================================================
// LOGIN - VAIDTÁXI
// ============================================================

async function login() {

    const campoEmail = document.getElementById("email");
    const campoSenha = document.getElementById("senha");

    if (!campoEmail || !campoSenha) {

        console.error("Campos de login não encontrados.");
        alert("Erro: campos de login não encontrados.");

        return;
    }


    const email = campoEmail.value.trim();
    const senha = campoSenha.value;


    // ========================================================
    // VALIDAR CAMPOS
    // ========================================================

    if (!email || !senha) {

        alert("Preencha todos os campos.");

        return;
    }


    // ========================================================
    // VERIFICAR SUPABASE
    // ========================================================

    if (typeof supabaseClient === "undefined") {

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
        document.querySelector(".form-login .btn");

    if (botao) {

        botao.disabled = true;
        botao.textContent = "Entrando...";

    }


    try {

        // ====================================================
        // LOGIN NO SUPABASE
        // ====================================================

        const { data, error } =
            await supabaseClient.auth.signInWithPassword({

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
                botao.textContent = "Entrar";

            }

            return;
        }


        // ====================================================
        // LOGIN REALIZADO
        // ====================================================

        console.log(
            "Login realizado:",
            data.user
        );


        alert(
            "Login realizado com sucesso!"
        );


        // ====================================================
        // REDIRECIONAR
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
            botao.textContent = "Entrar";

        }

    }

}

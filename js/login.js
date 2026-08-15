// ============================================================
// LOGIN - VAIDTÁXI
// ============================================================

const formLogin = document.getElementById("formLogin");
const mensagemLogin = document.getElementById("mensagemLogin");
const btnLogin = document.getElementById("btnLogin");


// ============================================================
// LOGIN
// ============================================================

if (formLogin) {

    formLogin.addEventListener("submit", async function(event) {

        // Impede a página de recarregar
        event.preventDefault();


        // ====================================================
        // PEGAR DADOS
        // ====================================================

        const email =
            document.getElementById("email").value.trim();

        const senha =
            document.getElementById("senha").value;


        // ====================================================
        // VALIDAR
        // ====================================================

        if (!email || !senha) {

            mostrarMensagem(
                "Preencha todos os campos.",
                "erro"
            );

            return;
        }


        // ====================================================
        // VERIFICAR SUPABASE
        // ====================================================

        if (typeof supabaseClient === "undefined") {

            console.error(
                "supabaseClient não encontrado."
            );

            mostrarMensagem(
                "Erro de conexão com o sistema.",
                "erro"
            );

            return;
        }


        // ====================================================
        // DESABILITAR BOTÃO
        // ====================================================

        btnLogin.disabled = true;
        btnLogin.textContent = "Entrando...";


        try {

            // =================================================
            // LOGIN NO SUPABASE
            // =================================================

            const { data, error } =
                await supabaseClient.auth.signInWithPassword({

                    email: email,

                    password: senha

                });


            // =================================================
            // VERIFICAR ERRO
            // =================================================

            if (error) {

                console.error(
                    "Erro no login:",
                    error
                );

                mostrarMensagem(
                    "E-mail ou senha incorretos.",
                    "erro"
                );

                btnLogin.disabled = false;
                btnLogin.textContent = "Entrar";

                return;
            }


            // =================================================
            // LOGIN REALIZADO
            // =================================================

            console.log(
                "Usuário conectado:",
                data.user
            );


            mostrarMensagem(
                "Login realizado com sucesso!",
                "sucesso"
            );


            btnLogin.textContent = "Entrando...";


            // =================================================
            // REDIRECIONAR
            // =================================================

            setTimeout(function() {

                window.location.href = "index.html";

            }, 500);

        }


        // ====================================================
        // ERRO INESPERADO
        // ====================================================

        catch (erro) {

            console.error(
                "Erro inesperado:",
                erro
            );

            mostrarMensagem(
                "Erro ao conectar com o sistema.",
                "erro"
            );

            btnLogin.disabled = false;
            btnLogin.textContent = "Entrar";

        }

    });

}


// ============================================================
// MOSTRAR MENSAGEM
// ============================================================

function mostrarMensagem(texto, tipo) {

    if (!mensagemLogin) {
        return;
    }

    mensagemLogin.textContent = texto;

    if (tipo === "sucesso") {

        mensagemLogin.style.color = "#00cc66";

    } else {

        mensagemLogin.style.color = "#ff4444";

    }

}

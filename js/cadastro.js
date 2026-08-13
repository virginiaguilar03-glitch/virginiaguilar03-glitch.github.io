// ============================================================
// CADASTRO DO CLIENTE - VAIDTÁXI
// ============================================================


// ANO DO RODAPÉ

const elementoAno = document.getElementById("ano");

if (elementoAno) {
    elementoAno.textContent = new Date().getFullYear();
}


// FORMULÁRIO

const formCadastro = document.getElementById("formCadastro");

const mensagemCadastro = document.getElementById("mensagemCadastro");

const botaoCadastrar = document.getElementById("btnCadastrar");


// ============================================================
// CADASTRAR CLIENTE
// ============================================================

formCadastro.addEventListener("submit", async function(event) {

    event.preventDefault();


    // PEGAR VALORES

    const nome =
        document.getElementById("nome").value.trim();

    const cpf =
        document.getElementById("cpf").value.trim();

    const telefone =
        document.getElementById("telefone").value.trim();

    const email =
        document.getElementById("email").value.trim();

    const senha =
        document.getElementById("senha").value;

    const confirmarSenha =
        document.getElementById("confirmarSenha").value;


    // LIMPAR MENSAGEM

    mensagemCadastro.textContent = "";

    mensagemCadastro.style.color = "";


    // ========================================================
    // VALIDAÇÃO
    // ========================================================

    if (
        !nome ||
        !cpf ||
        !telefone ||
        !email ||
        !senha ||
        !confirmarSenha
    ) {

        mostrarMensagem(
            "Preencha todos os campos.",
            "erro"
        );

        return;
    }


    // ========================================================
    // CONFIRMAR SENHA
    // ========================================================

    if (senha !== confirmarSenha) {

        mostrarMensagem(
            "As senhas não são iguais.",
            "erro"
        );

        return;
    }


    // ========================================================
    // TAMANHO DA SENHA
    // ========================================================

    if (senha.length < 6) {

        mostrarMensagem(
            "A senha deve possuir pelo menos 6 caracteres.",
            "erro"
        );

        return;
    }


    // ========================================================
    // DESABILITAR BOTÃO
    // ========================================================

    botaoCadastrar.disabled = true;

    botaoCadastrar.textContent = "Criando conta...";


    try {

        // ====================================================
        // CRIAR USUÁRIO NO SUPABASE AUTH
        // ====================================================

        const { data, error } =
            await supabaseClient.auth.signUp({

                email: email,

                password: senha,

                options: {

                    data: {

                        nome: nome,

                        cpf: cpf,

                        telefone: telefone

                    }

                }

            });


        // ====================================================
        // TRATAR ERRO
        // ====================================================

        if (error) {

            console.error(
                "Erro Supabase:",
                error
            );

            mostrarMensagem(
                traduzirErro(error),
                "erro"
            );

            botaoCadastrar.disabled = false;

            botaoCadastrar.textContent =
                "Criar Conta";

            return;
        }


        // ====================================================
        // CADASTRO REALIZADO
        // ====================================================

        console.log(
            "Usuário criado:",
            data.user
        );


        mostrarMensagem(
            "Conta criada com sucesso!",
            "sucesso"
        );


        botaoCadastrar.textContent =
            "Conta criada";


        // ====================================================
        // IR PARA LOGIN
        // ====================================================

        setTimeout(function() {

            window.location.href =
                "login.html";

        }, 2000);


    } catch (erro) {

        console.error(
            "Erro inesperado:",
            erro
        );


        mostrarMensagem(
            "Ocorreu um erro inesperado. Tente novamente.",
            "erro"
        );


        botaoCadastrar.disabled = false;

        botaoCadastrar.textContent =
            "Criar Conta";

    }

});


// ============================================================
// MOSTRAR MENSAGEM
// ============================================================

function mostrarMensagem(texto, tipo) {

    mensagemCadastro.textContent = texto;


    if (tipo === "sucesso") {

        mensagemCadastro.style.color =
            "#00cc66";

    } else {

        mensagemCadastro.style.color =
            "#ff4444";

    }

}


// ============================================================
// TRADUZIR ERROS DO SUPABASE
// ============================================================

function traduzirErro(error) {

    const mensagem =
        error.message.toLowerCase();


    if (
        mensagem.includes("user already registered") ||
        mensagem.includes("already registered")
    ) {

        return "Este e-mail já possui uma conta.";

    }


    if (
        mensagem.includes("password")
    ) {

        return "A senha informada não atende aos requisitos.";

    }


    if (
        mensagem.includes("email")
    ) {

        return "Verifique o e-mail informado.";

    }


    return "Não foi possível criar a conta. Tente novamente.";

}


// ============================================================
// MÁSCARA CPF
// ============================================================

document
    .getElementById("cpf")
    .addEventListener("input", function() {

        let valor =
            this.value.replace(/\D/g, "");


        valor =
            valor.substring(0, 11);


        if (valor.length > 9) {

            valor = valor.replace(
                /(\d{3})(\d{3})(\d{3})(\d{2})/,
                "$1.$2.$3-$4"
            );

        } else if (valor.length > 6) {

            valor = valor.replace(
                /(\d{3})(\d{3})(\d{1,3})/,
                "$1.$2.$3"
            );

        } else if (valor.length > 3) {

            valor = valor.replace(
                /(\d{3})(\d{1,3})/,
                "$1.$2"
            );

        }


        this.value = valor;

    });


// ============================================================
// MÁSCARA TELEFONE
// ============================================================

document
    .getElementById("telefone")
    .addEventListener("input", function() {

        let valor =
            this.value.replace(/\D/g, "");


        valor =
            valor.substring(0, 11);


        if (valor.length > 10) {

            valor = valor.replace(
                /(\d{2})(\d{5})(\d{4})/,
                "($1) $2-$3"
            );

        } else if (valor.length > 6) {

            valor = valor.replace(
                /(\d{2})(\d{4})(\d{1,4})/,
                "($1) $2-$3"
            );

        } else if (valor.length > 2) {

            valor = valor.replace(
                /(\d{2})(\d{1,5})/,
                "($1) $2"
            );

        }


        this.value = valor;

    });

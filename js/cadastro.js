// ============================================================
// CADASTRO DO CLIENTE - VAIDTÁXI
// ============================================================


// ============================================================
// ELEMENTOS
// ============================================================

const formCadastro = document.getElementById("formCadastro");
const mensagemCadastro = document.getElementById("mensagemCadastro");
const botaoCadastrar = document.getElementById("btnCadastrar");

const elementoAno = document.getElementById("ano");


// ============================================================
// ANO DO RODAPÉ
// ============================================================

if (elementoAno) {

    elementoAno.textContent = new Date().getFullYear();

}


// ============================================================
// FUNÇÃO PARA MOSTRAR MENSAGEM
// ============================================================

function mostrarMensagem(texto, tipo) {

    mensagemCadastro.textContent = texto;

    if (tipo === "sucesso") {

        mensagemCadastro.style.color = "#00cc66";

    } else {

        mensagemCadastro.style.color = "#ff4444";

    }

}


// ============================================================
// CADASTRO
// ============================================================

formCadastro.addEventListener("submit", async function(event) {

    event.preventDefault();


    // ========================================================
    // PEGAR DADOS
    // ========================================================

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


    // ========================================================
    // LIMPAR MENSAGEM
    // ========================================================

    mostrarMensagem("", "sucesso");


    // ========================================================
    // VALIDAR CAMPOS
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
    // VALIDAR SENHAS
    // ========================================================

    if (senha !== confirmarSenha) {

        mostrarMensagem(
            "As senhas não são iguais.",
            "erro"
        );

        return;
    }


    // ========================================================
    // VALIDAR TAMANHO DA SENHA
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
        // VERIFICAR CONEXÃO COM SUPABASE
        // ====================================================

        if (typeof supabaseClient === "undefined") {

            throw new Error(
                "A conexão com o Supabase não foi encontrada."
            );

        }


        // ====================================================
        // CRIAR CONTA NO SUPABASE AUTH
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
        // VERIFICAR ERRO
        // ====================================================

        if (error) {

            console.error(
                "Erro retornado pelo Supabase:",
                error
            );


            // E-mail já cadastrado

            if (
                error.message
                    .toLowerCase()
                    .includes("already registered")
            ) {

                mostrarMensagem(
                    "Este e-mail já possui uma conta.",
                    "erro"
                );

            }


            // Senha inválida

            else if (
                error.message
                    .toLowerCase()
                    .includes("password")
            ) {

                mostrarMensagem(
                    "A senha não atende aos requisitos.",
                    "erro"
                );

            }


            // E-mail inválido

            else if (
                error.message
                    .toLowerCase()
                    .includes("email")
            ) {

                mostrarMensagem(
                    "Verifique o e-mail informado.",
                    "erro"
                );

            }


            // Outros erros

            else {

                mostrarMensagem(
                    "Não foi possível criar a conta. Tente novamente.",
                    "erro"
                );

            }


            botaoCadastrar.disabled = false;

            botaoCadastrar.textContent = "Criar Conta";

            return;
        }


        // ====================================================
        // CADASTRO REALIZADO
        // ====================================================

        console.log(
            "Usuário criado:",
            data.user
        );


        // ====================================================
        // MENSAGEM DE SUCESSO
        // ====================================================

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

            window.location.href = "login.html";

        }, 2000);


    } catch (erro) {


        // ====================================================
        // ERRO INESPERADO
        // ====================================================

        console.error(
            "Erro no cadastro:",
            erro
        );


        mostrarMensagem(
            "Erro ao conectar com o sistema. Verifique sua conexão.",
            "erro"
        );


        botaoCadastrar.disabled = false;

        botaoCadastrar.textContent =
            "Criar Conta";

    }

});


// ============================================================
// MÁSCARA CPF
// ============================================================

const campoCPF = document.getElementById("cpf");

if (campoCPF) {

    campoCPF.addEventListener("input", function() {

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

}


// ============================================================
// MÁSCARA TELEFONE
// ============================================================

const campoTelefone =
    document.getElementById("telefone");

if (campoTelefone) {

    campoTelefone.addEventListener("input", function() {

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

}

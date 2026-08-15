// ============================================================
// CADASTRO DO CLIENTE - VAIDTÁXI
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
// MENSAGEM
// ============================================================

function mostrarMensagem(texto, tipo) {

    if (!mensagemCadastro) return;

    mensagemCadastro.textContent = texto;

    mensagemCadastro.style.color =
        tipo === "sucesso"
            ? "#00cc66"
            : "#ff4444";
}


// ============================================================
// CADASTRO
// ============================================================

if (formCadastro) {

    formCadastro.addEventListener("submit", async function(event) {

        event.preventDefault();


        // ====================================================
        // PEGAR DADOS
        // ====================================================

        const nome = document.getElementById("nome").value.trim();
        const cpf = document.getElementById("cpf").value.trim();
        const telefone = document.getElementById("telefone").value.trim();
        const email = document.getElementById("email").value.trim();
        const senha = document.getElementById("senha").value;
        const confirmarSenha =
            document.getElementById("confirmarSenha").value;


        // ====================================================
        // VALIDAR
        // ====================================================

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


        if (senha !== confirmarSenha) {

            mostrarMensagem(
                "As senhas não são iguais.",
                "erro"
            );

            return;
        }


        if (senha.length < 6) {

            mostrarMensagem(
                "A senha deve possuir pelo menos 6 caracteres.",
                "erro"
            );

            return;
        }


        // ====================================================
        // DESABILITAR BOTÃO
        // ====================================================

        botaoCadastrar.disabled = true;
        botaoCadastrar.textContent = "Criando conta...";


        try {

            // =================================================
            // VERIFICAR SUPABASE
            // =================================================

            if (typeof supabaseClient === "undefined") {

                throw new Error(
                    "supabaseClient não foi encontrado."
                );

            }


            // =================================================
            // 1. CRIAR USUÁRIO NO AUTH
            // =================================================

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


            // =================================================
            // ERRO NO AUTH
            // =================================================

            if (error) {

                console.error(
                    "Erro no Supabase Auth:",
                    error
                );

                const erro = error.message.toLowerCase();


                if (
                    erro.includes("already registered") ||
                    erro.includes("already exists")
                ) {

                    mostrarMensagem(
                        "Este e-mail já possui uma conta.",
                        "erro"
                    );

                }

                else if (erro.includes("password")) {

                    mostrarMensagem(
                        "A senha não atende aos requisitos.",
                        "erro"
                    );

                }

                else if (erro.includes("email")) {

                    mostrarMensagem(
                        "Verifique o e-mail informado.",
                        "erro"
                    );

                }

                else {

                    mostrarMensagem(
                        "Não foi possível criar a conta: " +
                        error.message,
                        "erro"
                    );

                }


                botaoCadastrar.disabled = false;
                botaoCadastrar.textContent = "Criar Conta";

                return;
            }


            // =================================================
            // VERIFICAR USUÁRIO
            // =================================================

            if (!data || !data.user) {

                throw new Error(
                    "O Supabase não retornou o usuário criado."
                );

            }


            const usuario = data.user;


            console.log(
                "Usuário criado no Auth:",
                usuario
            );


            // =================================================
            // 2. INSERIR NA TABELA CLIENTES
            // =================================================

            const { error: erroCliente } =
                await supabaseClient
                    .from("clientes")
                    .insert({

                        id: usuario.id,

                        nome: nome,

                        cpf: cpf,

                        telefone: telefone,

                        email: email

                    });


            // =================================================
            // ERRO AO INSERIR CLIENTE
            // =================================================

            if (erroCliente) {

                console.error(
                    "Erro ao inserir cliente:",
                    erroCliente
                );


                mostrarMensagem(
                    "A conta foi criada, mas não foi possível salvar os dados do cliente.",
                    "erro"
                );


                botaoCadastrar.disabled = false;
                botaoCadastrar.textContent = "Criar Conta";

                return;
            }


            // =================================================
            // SUCESSO
            // =================================================

            console.log(
                "Cliente salvo com sucesso na tabela clientes."
            );


            mostrarMensagem(
                "Conta criada com sucesso!",
                "sucesso"
            );


            botaoCadastrar.textContent =
                "Conta criada";


            // =================================================
            // IR PARA LOGIN
            // =================================================

            setTimeout(function() {

                window.location.href = "login.html";

            }, 2000);

        }


        // ====================================================
        // ERRO GERAL
        // ====================================================

        catch (erro) {

            console.error(
                "Erro no cadastro:",
                erro
            );


            mostrarMensagem(
                erro.message ||
                "Erro ao conectar com o sistema.",
                "erro"
            );


            botaoCadastrar.disabled = false;
            botaoCadastrar.textContent = "Criar Conta";

        }

    });

}


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

        }

        else if (valor.length > 6) {

            valor = valor.replace(
                /(\d{3})(\d{3})(\d{1,3})/,
                "$1.$2.$3"
            );

        }

        else if (valor.length > 3) {

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

        }

        else if (valor.length > 6) {

            valor = valor.replace(
                /(\d{2})(\d{4})(\d{1,4})/,
                "($1) $2-$3"
            );

        }

        else if (valor.length > 2) {

            valor = valor.replace(
                /(\d{2})(\d{1,5})/,
                "($1) $2"
            );

        }


        this.value = valor;

    });

}

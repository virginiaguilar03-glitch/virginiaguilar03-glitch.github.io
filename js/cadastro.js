// ============================================================
// CADASTRO - VAIDTÁXI
// ============================================================


// ============================================================
// ELEMENTOS
// ============================================================

const formCadastro =
    document.getElementById("formCadastro");

const mensagemCadastro =
    document.getElementById("mensagemCadastro");

const botaoCadastrar =
    document.getElementById("btnCadastrar");

const elementoAno =
    document.getElementById("ano");


// ============================================================
// ANO DO RODAPÉ
// ============================================================

if (elementoAno) {

    elementoAno.textContent =
        new Date().getFullYear();

}


// ============================================================
// MOSTRAR MENSAGEM
// ============================================================

function mostrarMensagem(texto, tipo) {

    if (!mensagemCadastro) {
        return;
    }

    mensagemCadastro.textContent =
        texto;


    if (tipo === "sucesso") {

        mensagemCadastro.style.color =
            "#00cc66";

    } else {

        mensagemCadastro.style.color =
            "#ff4444";

    }

}


// ============================================================
// VERIFICAR TIPO DE CADASTRO
// ============================================================

function obterTipoCadastro() {

    /*
     * O cadastro.html define:
     *
     * window.tipoCadastro = "cliente"
     *
     * ou
     *
     * window.tipoCadastro = "parceiro"
     */

    return window.tipoCadastro || "";

}


// ============================================================
// CADASTRO
// ============================================================

if (formCadastro) {

    formCadastro.addEventListener(
        "submit",
        async function (event) {

            event.preventDefault();


            // =================================================
            // TIPO
            // =================================================

            const tipoCadastro =
                obterTipoCadastro();


            // =================================================
            // VERIFICAR TIPO
            // =================================================

            if (
                tipoCadastro !== "cliente" &&
                tipoCadastro !== "parceiro"
            ) {

                mostrarMensagem(
                    "Selecione primeiro o tipo de cadastro.",
                    "erro"
                );

                return;
            }


            // =================================================
            // PEGAR DADOS PESSOAIS
            // =================================================

            const nome =
                document
                    .getElementById("nome")
                    .value
                    .trim();


            const cpf =
                document
                    .getElementById("cpf")
                    .value
                    .trim();


            const telefone =
                document
                    .getElementById("telefone")
                    .value
                    .trim();


            const email =
                document
                    .getElementById("email")
                    .value
                    .trim();


            const senha =
                document
                    .getElementById("senha")
                    .value;


            const confirmarSenha =
                document
                    .getElementById("confirmarSenha")
                    .value;


            // =================================================
            // PEGAR DADOS DO VEÍCULO
            // =================================================

            const marca =
                document
                    .getElementById("marca")
                    ?.value
                    .trim() || "";


            const modelo =
                document
                    .getElementById("modelo")
                    ?.value
                    .trim() || "";


            const cor =
                document
                    .getElementById("cor")
                    ?.value
                    .trim() || "";


            const anoVeiculo =
                document
                    .getElementById("anoVeiculo")
                    ?.value
                    .trim() || "";


            const placa =
                document
                    .getElementById("placa")
                    ?.value
                    .trim() || "";


            const assentos =
                document
                    .getElementById("assentos")
                    ?.value
                    .trim() || "";


            // =================================================
            // LIMPAR MENSAGEM
            // =================================================

            mostrarMensagem("", "sucesso");


            // =================================================
            // VALIDAR DADOS PESSOAIS
            // =================================================

            if (
                !nome ||
                !cpf ||
                !telefone ||
                !email ||
                !senha ||
                !confirmarSenha
            ) {

                mostrarMensagem(
                    "Preencha todos os campos obrigatórios.",
                    "erro"
                );

                return;
            }


            // =================================================
            // VALIDAR SENHAS
            // =================================================

            if (senha !== confirmarSenha) {

                mostrarMensagem(
                    "As senhas não são iguais.",
                    "erro"
                );

                return;
            }


            // =================================================
            // VALIDAR TAMANHO DA SENHA
            // =================================================

            if (senha.length < 6) {

                mostrarMensagem(
                    "A senha deve possuir pelo menos 6 caracteres.",
                    "erro"
                );

                return;
            }


            // =================================================
            // VALIDAR PARCEIRO
            // =================================================

            if (tipoCadastro === "parceiro") {

                if (
                    !marca ||
                    !modelo ||
                    !cor ||
                    !anoVeiculo ||
                    !placa ||
                    !assentos
                ) {

                    mostrarMensagem(
                        "Preencha todos os dados do veículo.",
                        "erro"
                    );

                    return;
                }

            }


            // =================================================
            // VERIFICAR SUPABASE
            // =================================================

            if (
                typeof supabaseClient ===
                "undefined"
            ) {

                console.error(
                    "supabaseClient não está disponível."
                );


                mostrarMensagem(
                    "Erro: conexão com o sistema não encontrada.",
                    "erro"
                );

                return;
            }


            // =================================================
            // DESABILITAR BOTÃO
            // =================================================

            botaoCadastrar.disabled =
                true;


            if (tipoCadastro === "parceiro") {

                botaoCadastrar.textContent =
                    "Enviando cadastro...";

            } else {

                botaoCadastrar.textContent =
                    "Criando conta...";

            }


            try {


                // =================================================
                // DADOS DO USUÁRIO
                // =================================================

                const dadosUsuario = {

                    nome: nome,

                    cpf: cpf,

                    telefone: telefone,

                    tipo: tipoCadastro

                };


                // =================================================
                // DADOS DO PARCEIRO
                // =================================================

                if (tipoCadastro === "parceiro") {

                    dadosUsuario.veiculo = {

                        marca: marca,

                        modelo: modelo,

                        cor: cor,

                        ano: anoVeiculo,

                        placa: placa,

                        assentos: assentos

                    };

                }


                // =================================================
                // CRIAR CONTA NO SUPABASE AUTH
                // =================================================

                const { data, error } =
                    await supabaseClient.auth.signUp({

                        email: email,

                        password: senha,

                        options: {

                            data: dadosUsuario

                        }

                    });


                // =================================================
                // ERRO
                // =================================================

                if (error) {

                    console.error(
                        "ERRO DO SUPABASE AUTH:",
                        error
                    );


                    const mensagemErro =
                        error.message.toLowerCase();


                    // ---------------------------------------------
                    // E-MAIL JÁ EXISTENTE
                    // ---------------------------------------------

                    if (
                        mensagemErro.includes(
                            "already registered"
                        ) ||
                        mensagemErro.includes(
                            "already exists"
                        )
                    ) {

                        mostrarMensagem(
                            "Este e-mail já possui uma conta.",
                            "erro"
                        );

                    }


                    // ---------------------------------------------
                    // SENHA
                    // ---------------------------------------------

                    else if (
                        mensagemErro.includes(
                            "password"
                        )
                    ) {

                        mostrarMensagem(
                            "A senha não atende aos requisitos.",
                            "erro"
                        );

                    }


                    // ---------------------------------------------
                    // E-MAIL
                    // ---------------------------------------------

                    else if (
                        mensagemErro.includes(
                            "email"
                        )
                    ) {

                        mostrarMensagem(
                            "Verifique o e-mail informado.",
                            "erro"
                        );

                    }


                    // ---------------------------------------------
                    // ERRO GENÉRICO
                    // ---------------------------------------------

                    else {

                        mostrarMensagem(
                            "Não foi possível criar a conta: " +
                            error.message,
                            "erro"
                        );

                    }


                    // Restaurar botão

                    botaoCadastrar.disabled =
                        false;


                    if (
                        tipoCadastro ===
                        "parceiro"
                    ) {

                        botaoCadastrar.textContent =
                            "Enviar Cadastro para Aprovação";

                    } else {

                        botaoCadastrar.textContent =
                            "Criar Conta";

                    }


                    return;
                }


                // =================================================
                // VERIFICAR USUÁRIO
                // =================================================

                if (
                    !data ||
                    !data.user
                ) {

                    console.error(
                        "O Supabase não retornou um usuário:",
                        data
                    );


                    mostrarMensagem(
                        "Não foi possível concluir o cadastro.",
                        "erro"
                    );


                    botaoCadastrar.disabled =
                        false;


                    botaoCadastrar.textContent =
                        tipoCadastro === "parceiro"
                            ? "Enviar Cadastro para Aprovação"
                            : "Criar Conta";


                    return;
                }


                // =================================================
                // USUÁRIO CRIADO
                // =================================================

                console.log(
                    "USUÁRIO CRIADO:"
                );


                console.log(
                    "ID:",
                    data.user.id
                );


                console.log(
                    "TIPO:",
                    tipoCadastro
                );


                console.log(
                    "DADOS:",
                    dadosUsuario
                );


                // =================================================
                // CLIENTE
                // =================================================

                if (tipoCadastro === "cliente") {

                    mostrarMensagem(
                        "Conta criada com sucesso!",
                        "sucesso"
                    );


                    botaoCadastrar.textContent =
                        "Conta criada";

                }


                // =================================================
                // PARCEIRO
                // =================================================

                else if (
                    tipoCadastro ===
                    "parceiro"
                ) {

                    mostrarMensagem(
                        "Cadastro enviado com sucesso! Aguarde a aprovação do administrador.",
                        "sucesso"
                    );


                    botaoCadastrar.textContent =
                        "Cadastro enviado";

                }


                // =================================================
                // REDIRECIONAR
                // =================================================

                setTimeout(
                    function () {

                        window.location.href =
                            "login.html";

                    },
                    2500
                );

            }


            // ====================================================
            // ERRO INESPERADO
            // ====================================================

            catch (erro) {

                console.error(
                    "ERRO INESPERADO NO CADASTRO:",
                    erro
                );


                mostrarMensagem(
                    erro.message ||
                    "Erro ao conectar com o sistema.",
                    "erro"
                );


                botaoCadastrar.disabled =
                    false;


                if (
                    tipoCadastro ===
                    "parceiro"
                ) {

                    botaoCadastrar.textContent =
                        "Enviar Cadastro para Aprovação";

                } else {

                    botaoCadastrar.textContent =
                        "Criar Conta";

                }

            }

        }
    );

}


// ============================================================
// MÁSCARA CPF
// ============================================================

const campoCPF =
    document.getElementById("cpf");


if (campoCPF) {

    campoCPF.addEventListener(
        "input",
        function () {

            let valor =
                this.value.replace(
                    /\D/g,
                    ""
                );


            valor =
                valor.substring(
                    0,
                    11
                );


            if (
                valor.length > 9
            ) {

                valor =
                    valor.replace(
                        /(\d{3})(\d{3})(\d{3})(\d{2})/,
                        "$1.$2.$3-$4"
                    );

            }

            else if (
                valor.length > 6
            ) {

                valor =
                    valor.replace(
                        /(\d{3})(\d{3})(\d{1,3})/,
                        "$1.$2.$3"
                    );

            }

            else if (
                valor.length > 3
            ) {

                valor =
                    valor.replace(
                        /(\d{3})(\d{1,3})/,
                        "$1.$2"
                    );

            }


            this.value =
                valor;

        }
    );

}


// ============================================================
// MÁSCARA TELEFONE
// ============================================================

const campoTelefone =
    document.getElementById("telefone");


if (campoTelefone) {

    campoTelefone.addEventListener(
        "input",
        function () {

            let valor =
                this.value.replace(
                    /\D/g,
                    ""
                );


            valor =
                valor.substring(
                    0,
                    11
                );


            if (
                valor.length > 10
            ) {

                valor =
                    valor.replace(
                        /(\d{2})(\d{5})(\d{4})/,
                        "($1) $2-$3"
                    );

            }

            else if (
                valor.length > 6
            ) {

                valor =
                    valor.replace(
                        /(\d{2})(\d{4})(\d{1,4})/,
                        "($1) $2-$3"
                    );

            }

            else if (
                valor.length > 2
            ) {

                valor =
                    valor.replace(
                        /(\d{2})(\d{1,5})/,
                        "($1) $2"
                    );

            }


            this.value =
                valor;

        }
    );

}


// ============================================================
// MÁSCARA PLACA
// ============================================================

const campoPlaca =
    document.getElementById("placa");


if (campoPlaca) {

    campoPlaca.addEventListener(
        "input",
        function () {

            let valor =
                this.value
                    .toUpperCase()
                    .replace(
                        /[^A-Z0-9]/g,
                        ""
                    );


            valor =
                valor.substring(
                    0,
                    7
                );


            /*
             * Formato antigo:
             * ABC-1234
             *
             * Também aceita:
             * ABC1D23
             */

            if (
                valor.length > 3
            ) {

                valor =
                    valor.substring(
                        0,
                        3
                    ) +
                    "-" +
                    valor.substring(
                        3
                    );

            }


            this.value =
                valor;

        }
    );

}

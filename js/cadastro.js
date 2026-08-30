// ============================================================
// CADASTRO.JS - VAIDTÁXI
// Supabase Auth + Cliente + Motorista
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

    mensagemCadastro.style.color =
        tipo === "sucesso"
            ? "#00cc66"
            : "#ff4444";

}


// ============================================================
// TIPO DE CADASTRO
// ============================================================

function obterTipoCadastro() {

    return window.tipoCadastro || "";

}


// ============================================================
// RESTAURAR BOTÃO
// ============================================================

function restaurarBotao(tipoCadastro) {

    if (!botaoCadastrar) {
        return;
    }

    botaoCadastrar.disabled = false;

    botaoCadastrar.textContent =
        tipoCadastro === "parceiro"
            ? "Enviar Cadastro para Aprovação"
            : "Criar Conta";

}


// ============================================================
// VERIFICAR SUPABASE
// ============================================================

function supabaseDisponivel() {

    return (
        typeof supabaseClient !== "undefined" &&
        supabaseClient
    );

}


// ============================================================
// CADASTRO
// ============================================================

if (formCadastro) {

    formCadastro.addEventListener(
        "submit",
        async function (event) {

            event.preventDefault();


            console.log(
                "======================================"
            );

            console.log(
                "Iniciando processo de cadastro..."
            );


            // =================================================
            // TIPO
            // =================================================

            const tipoCadastro =
                obterTipoCadastro();


            console.log(
                "Tipo de cadastro:",
                tipoCadastro
            );


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
            // CAMPOS PESSOAIS
            // =================================================

            const campoNome =
                document.getElementById("nome");

            const campoCPF =
                document.getElementById("cpf");

            const campoTelefone =
                document.getElementById("telefone");

            const campoEmail =
                document.getElementById("email");

            const campoSenha =
                document.getElementById("senha");

            const campoConfirmarSenha =
                document.getElementById("confirmarSenha");


            const nome =
                campoNome?.value.trim() || "";

            const cpf =
                campoCPF?.value.trim() || "";

            const telefone =
                campoTelefone?.value.trim() || "";

            const email =
                campoEmail?.value.trim() || "";

            const senha =
                campoSenha?.value || "";

            const confirmarSenha =
                campoConfirmarSenha?.value || "";


            // =================================================
            // CAMPOS DO VEÍCULO
            // =================================================

            const campoMarca =
                document.getElementById("marca");

            const campoModelo =
                document.getElementById("modelo");

            const campoCor =
                document.getElementById("cor");

            const campoAno =
                document.getElementById("anoVeiculo");

            const campoPlaca =
                document.getElementById("placa");

            const campoAssentos =
                document.getElementById("assentos");


            const marca =
                campoMarca?.value.trim() || "";

            const modelo =
                campoModelo?.value.trim() || "";

            const cor =
                campoCor?.value.trim() || "";

            const anoVeiculo =
                campoAno?.value.trim() || "";

            const placa =
                campoPlaca?.value.trim() || "";

            const assentos =
                campoAssentos?.value.trim() || "";


            // =================================================
            // LIMPAR MENSAGEM
            // =================================================

            mostrarMensagem(
                "",
                "sucesso"
            );


            // =================================================
            // VALIDAR CAMPOS PESSOAIS
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
            // VALIDAR CPF
            // =================================================

            const cpfNumeros =
                cpf.replace(/\D/g, "");


            if (
                cpfNumeros.length !== 11
            ) {

                mostrarMensagem(
                    "Digite um CPF válido.",
                    "erro"
                );

                return;

            }


            // =================================================
            // VALIDAR SENHA
            // =================================================

            if (
                senha !== confirmarSenha
            ) {

                mostrarMensagem(
                    "As senhas não são iguais.",
                    "erro"
                );

                return;

            }


            if (
                senha.length < 6
            ) {

                mostrarMensagem(
                    "A senha deve possuir pelo menos 6 caracteres.",
                    "erro"
                );

                return;

            }


            // =================================================
            // VALIDAR PARCEIRO
            // =================================================

            if (
                tipoCadastro === "parceiro"
            ) {

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


                // =============================================
                // VALIDAR ANO
                // =============================================

                const anoNumero =
                    Number(anoVeiculo);


                if (
                    !Number.isInteger(anoNumero) ||
                    anoNumero < 1900 ||
                    anoNumero > 2100
                ) {

                    mostrarMensagem(
                        "Informe um ano de veículo válido.",
                        "erro"
                    );

                    return;

                }


                // =============================================
                // VALIDAR ASSENTOS
                // =============================================

                const assentosNumero =
                    Number(assentos);


                if (
                    !Number.isInteger(assentosNumero) ||
                    assentosNumero < 1 ||
                    assentosNumero > 20
                ) {

                    mostrarMensagem(
                        "Informe uma quantidade de passageiros válida.",
                        "erro"
                    );

                    return;

                }


                // =============================================
                // VALIDAR PLACA
                // =============================================

                const placaNumeros =
                    placa.replace(
                        /[^A-Z0-9]/gi,
                        ""
                    );


                if (
                    placaNumeros.length !== 7
                ) {

                    mostrarMensagem(
                        "Informe uma placa válida.",
                        "erro"
                    );

                    return;

                }

            }


            // =================================================
            // VERIFICAR SUPABASE
            // =================================================

            if (
                !supabaseDisponivel()
            ) {

                console.error(
                    "supabaseClient não está disponível."
                );

                mostrarMensagem(
                    "Erro de conexão com o sistema.",
                    "erro"
                );

                return;

            }


            // =================================================
            // DESABILITAR BOTÃO
            // =================================================

            if (botaoCadastrar) {

                botaoCadastrar.disabled =
                    true;

                botaoCadastrar.textContent =
                    tipoCadastro === "parceiro"
                        ? "Enviando cadastro..."
                        : "Criando conta...";

            }


            try {

                // =================================================
                // DADOS DO AUTH
                // =================================================

                const dadosUsuario = {

                    nome:
                        nome,

                    cpf:
                        cpfNumeros,

                    telefone:
                        telefone,

                    tipo:
                        tipoCadastro

                };


                console.log(
                    "Dados do usuário:",
                    dadosUsuario
                );


                // =================================================
                // CRIAR CONTA NO SUPABASE AUTH
                // =================================================

                console.log(
                    "Criando usuário no Auth..."
                );


                const {
                    data,
                    error
                } =
                    await supabaseClient.auth.signUp({

                        email:
                            email,

                        password:
                            senha,

                        options: {

                            data:
                                dadosUsuario

                        }

                    });


                // =================================================
                // ERRO AUTH
                // =================================================

                if (error) {

                    console.error(
                        "Erro do Supabase Auth:",
                        error
                    );


                    const mensagemErro =
                        (
                            error.message ||
                            ""
                        ).toLowerCase();


                    if (
                        mensagemErro.includes(
                            "already registered"
                        ) ||
                        mensagemErro.includes(
                            "already exists"
                        ) ||
                        mensagemErro.includes(
                            "user already registered"
                        )
                    ) {

                        mostrarMensagem(
                            "Este e-mail já possui uma conta.",
                            "erro"
                        );

                    }

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

                    else {

                        mostrarMensagem(
                            "Não foi possível criar a conta: " +
                            error.message,
                            "erro"
                        );

                    }


                    restaurarBotao(
                        tipoCadastro
                    );

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
                        "Supabase não retornou o usuário:",
                        data
                    );

                    mostrarMensagem(
                        "Não foi possível concluir o cadastro.",
                        "erro"
                    );

                    restaurarBotao(
                        tipoCadastro
                    );

                    return;

                }


                // =================================================
                // USUÁRIO CRIADO
                // =================================================

                const usuarioCriado =
                    data.user;


                const usuarioId =
                    usuarioCriado.id;


                console.log(
                    "Usuário criado no Auth:",
                    usuarioId
                );


                console.log(
                    "Tipo de cadastro:",
                    tipoCadastro
                );


                // =================================================
                // CLIENTE
                // =================================================

                if (
                    tipoCadastro === "cliente"
                ) {

                    console.log(
                        "Criando registro do cliente..."
                    );


                    const dadosCliente = {

                        id:
                            usuarioId,

                        nome:
                            nome,

                        cpf:
                            cpfNumeros,

                        telefone:
                            telefone,

                        email:
                            email,

                        ativo:
                            true

                    };


                    console.log(
                        "Dados enviados para clientes:",
                        dadosCliente
                    );


                    const {
                        data: clienteCriado,
                        error: erroCliente
                    } =
                        await supabaseClient
                            .from("clientes")
                            .insert(
                                dadosCliente
                            )
                            .select()
                            .single();


                    if (
                        erroCliente
                    ) {

                        console.error(
                            "Erro ao criar cliente:",
                            erroCliente
                        );

                        console.error(
                            "Código:",
                            erroCliente.code
                        );

                        console.error(
                            "Mensagem:",
                            erroCliente.message
                        );

                        console.error(
                            "Detalhes:",
                            erroCliente.details
                        );


                        mostrarMensagem(
                            "A conta foi criada, mas não foi possível cadastrar os dados do cliente. Verifique as permissões da tabela clientes.",
                            "erro"
                        );


                        restaurarBotao(
                            tipoCadastro
                        );

                        return;

                    }


                    console.log(
                        "Cliente cadastrado com sucesso:",
                        clienteCriado
                    );


                    mostrarMensagem(
                        "Conta criada com sucesso!",
                        "sucesso"
                    );

                }


                // =================================================
                // PARCEIRO / MOTORISTA
                // =================================================

                if (
                    tipoCadastro === "parceiro"
                ) {

                    console.log(
                        "Criando registro do motorista..."
                    );


                    const placaFinal =
                        placa
                            .replace(
                                /[^A-Z0-9]/gi,
                                ""
                            )
                            .toUpperCase();


                    const dadosMotorista = {

                        id:
                            usuarioId,

                        nome:
                            nome,

                        cpf:
                            cpfNumeros,

                        telefone:
                            telefone,

                        email:
                            email,

                        marca:
                            marca,

                        modelo:
                            modelo,

                        cor:
                            cor,

                        ano:
                            Number(anoVeiculo),

                        placa:
                            placaFinal,

                        assentos:
                            Number(assentos),

                        status:
                            "pendente"

                    };


                    console.log(
                        "Dados enviados para motoristas:",
                        dadosMotorista
                    );


                    const {
                        data: motoristaCriado,
                        error: erroMotorista
                    } =
                        await supabaseClient
                            .from("motoristas")
                            .insert(
                                dadosMotorista
                            )
                            .select()
                            .single();


                    // =================================================
                    // ERRO MOTORISTA
                    // =================================================

                    if (
                        erroMotorista
                    ) {

                        console.error(
                            "Erro ao criar motorista:",
                            erroMotorista
                        );

                        console.error(
                            "Código:",
                            erroMotorista.code
                        );

                        console.error(
                            "Mensagem:",
                            erroMotorista.message
                        );

                        console.error(
                            "Detalhes:",
                            erroMotorista.details
                        );


                        mostrarMensagem(
                            "A conta foi criada, mas não foi possível cadastrar o motorista. Verifique as permissões da tabela motoristas.",
                            "erro"
                        );


                        restaurarBotao(
                            tipoCadastro
                        );

                        return;

                    }


                    console.log(
                        "Motorista cadastrado com sucesso:",
                        motoristaCriado
                    );


                    mostrarMensagem(
                        "Cadastro enviado com sucesso! Aguarde a aprovação do administrador.",
                        "sucesso"
                    );

                }


                // =================================================
                // BOTÃO
                // =================================================

                if (botaoCadastrar) {

                    botaoCadastrar.textContent =
                        tipoCadastro === "parceiro"
                            ? "Cadastro enviado"
                            : "Conta criada";

                }


                // =================================================
                // SALVAR TIPO DE ACESSO
                // =================================================

                localStorage.setItem(
                    "tipoAcesso",
                    tipoCadastro
                );


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

            catch (erro) {

                console.error(
                    "Erro inesperado no cadastro:",
                    erro
                );


                mostrarMensagem(
                    erro?.message ||
                    "Erro ao conectar com o sistema.",
                    "erro"
                );


                restaurarBotao(
                    tipoCadastro
                );

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


// ============================================================
// FINAL
// ============================================================

console.log(
    "Cadastro VaidTáxi carregado."
);

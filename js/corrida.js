// ============================================================
// CORRIDA - VAIDTÁXI
// Cliente solicita corrida
// Supabase + Motoristas + Pagamento
// ============================================================


// ============================================================
// ELEMENTOS
// ============================================================

const paginaCorrida =
    document.getElementById("formCorrida");

const mensagemCorrida =
    document.getElementById("mensagemCorrida");

const btnSolicitar =
    document.getElementById("btnSolicitarCorrida");


// ============================================================
// MOTORISTA SELECIONADO
// ============================================================

let motoristaSelecionado = null;


// ============================================================
// CANAL DA CORRIDA
// ============================================================

let canalCorrida = null;


// ============================================================
// VERIFICAR USUÁRIO LOGADO
// ============================================================

async function verificarUsuario() {

    if (
        typeof supabaseClient === "undefined" ||
        !supabaseClient
    ) {

        console.error(
            "supabaseClient não encontrado."
        );

        return null;
    }


    try {

        const {
            data,
            error
        } =
            await supabaseClient.auth.getUser();


        if (error) {

            console.error(
                "Erro ao verificar usuário:",
                error
            );

            return null;
        }


        if (
            !data ||
            !data.user
        ) {

            return null;

        }


        return data.user;

    }

    catch (erro) {

        console.error(
            "Erro inesperado ao verificar usuário:",
            erro
        );

        return null;

    }

}


// ============================================================
// MENSAGEM
// ============================================================

function mostrarMensagemCorrida(
    texto,
    tipo = "erro"
) {

    if (!mensagemCorrida) {
        return;
    }


    mensagemCorrida.textContent =
        texto;


    if (tipo === "sucesso") {

        mensagemCorrida.style.color =
            "#00cc66";

    }

    else {

        mensagemCorrida.style.color =
            "#ff4444";

    }

}


// ============================================================
// CARREGAR MOTORISTAS
// ============================================================

async function carregarMotoristas() {

    const listaMotoristas =
        document.getElementById(
            "listaMotoristas"
        );


    if (!listaMotoristas) {
        return;
    }


    if (
        typeof supabaseClient === "undefined" ||
        !supabaseClient
    ) {

        console.error(
            "Supabase não encontrado."
        );

        listaMotoristas.innerHTML =
            "<p>Erro de conexão com o sistema.</p>";

        return;

    }


    listaMotoristas.innerHTML =
        "<p>Carregando motoristas...</p>";


    try {

        const {
            data,
            error
        } =
            await supabaseClient
                .from("motoristas")
                .select("*")
                .eq("ativo", true);


        if (error) {

            console.error(
                "Erro ao carregar motoristas:",
                error
            );


            listaMotoristas.innerHTML =
                "<p>Não foi possível carregar os motoristas.</p>";

            return;

        }


        if (
            !data ||
            data.length === 0
        ) {

            listaMotoristas.innerHTML =
                "<p>Nenhum motorista disponível no momento.</p>";

            return;

        }


        listaMotoristas.innerHTML = "";


        data.forEach(
            function(motorista) {

                criarCardMotorista(
                    motorista,
                    listaMotoristas
                );

            }
        );

    }

    catch (erro) {

        console.error(
            "Erro inesperado:",
            erro
        );


        listaMotoristas.innerHTML =
            "<p>Erro ao carregar motoristas.</p>";

    }

}


// ============================================================
// CRIAR CARD DO MOTORISTA
// ============================================================

function criarCardMotorista(
    motorista,
    container
) {

    const card =
        document.createElement("div");


    card.className =
        "motorista-corrida-card";


    card.dataset.motoristaId =
        motorista.id;


    const nome =
        motorista.nome ||
        "Motorista";


    const modelo =
        motorista.modelo ||
        motorista.carro_modelo ||
        "Veículo não informado";


    const marca =
        motorista.marca ||
        motorista.carro_marca ||
        "";


    const cor =
        motorista.cor ||
        "";


    const placa =
        motorista.placa ||
        "Placa não informada";


    const telefone =
        motorista.telefone ||
        "";


    card.innerHTML = `

        <div class="motorista-corrida-conteudo">

            <div class="motorista-corrida-icone">

                <i class="fa-solid fa-taxi"></i>

            </div>


            <div class="motorista-corrida-info">

                <h3>
                    ${escaparHTML(nome)}
                </h3>

                <p>
                    ${escaparHTML(
                        (marca + " " + modelo).trim()
                    )}
                </p>

                <p>
                    Cor:
                    ${escaparHTML(
                        cor || "Não informada"
                    )}
                </p>

                <p>
                    Placa:
                    ${escaparHTML(placa)}
                </p>

            </div>

        </div>


        <button
            type="button"
            class="btn-selecionar-motorista"
        >
            Escolher motorista
        </button>

    `;


    const botao =
        card.querySelector(
            ".btn-selecionar-motorista"
        );


    if (botao) {

        botao.addEventListener(
            "click",
            function() {

                selecionarMotorista(
                    motorista
                );

            }
        );

    }


    container.appendChild(card);

}


// ============================================================
// ESCOLHER MOTORISTA
// ============================================================

function selecionarMotorista(
    motorista
) {

    if (!motorista || !motorista.id) {

        mostrarMensagemCorrida(
            "Não foi possível selecionar este motorista.",
            "erro"
        );

        return;

    }


    motoristaSelecionado =
        motorista;


    // --------------------------------------------------------
    // Remover seleção anterior
    // --------------------------------------------------------

    document
        .querySelectorAll(
            ".motorista-corrida-card"
        )
        .forEach(
            function(card) {

                card.classList.remove(
                    "motorista-selecionado"
                );

            }
        );


    // --------------------------------------------------------
    // Marcar motorista escolhido
    // --------------------------------------------------------

    const cardSelecionado =
        document.querySelector(
            `[data-motorista-id="${motorista.id}"]`
        );


    if (cardSelecionado) {

        cardSelecionado.classList.add(
            "motorista-selecionado"
        );

    }


    // --------------------------------------------------------
    // Guardar somente o ID
    // --------------------------------------------------------

    localStorage.setItem(
        "motoristaSelecionado",
        motorista.id
    );


    mostrarMensagemCorrida(
        "Motorista selecionado. Agora informe os dados da corrida.",
        "sucesso"
    );


    // --------------------------------------------------------
    // Mostrar área da solicitação
    // --------------------------------------------------------

    const areaSolicitacao =
        document.getElementById(
            "areaSolicitacao"
        );


    if (areaSolicitacao) {

        areaSolicitacao.style.display =
            "block";

    }

}


// ============================================================
// RECUPERAR MOTORISTA SALVO
// ============================================================

function recuperarMotoristaSelecionado() {

    const motoristaId =
        localStorage.getItem(
            "motoristaSelecionado"
        );


    if (!motoristaId) {
        return;
    }


    const card =
        document.querySelector(
            `[data-motorista-id="${motoristaId}"]`
        );


    if (card) {

        card.classList.add(
            "motorista-selecionado"
        );

    }

}


// ============================================================
// SOLICITAR CORRIDA
// ============================================================

if (paginaCorrida) {

    paginaCorrida.addEventListener(
        "submit",
        async function(event) {

            event.preventDefault();


            // =================================================
            // VERIFICAR MOTORISTA
            // =================================================

            if (!motoristaSelecionado) {

                const motoristaIdSalvo =
                    localStorage.getItem(
                        "motoristaSelecionado"
                    );


                if (!motoristaIdSalvo) {

                    mostrarMensagemCorrida(
                        "Escolha um motorista antes de solicitar a corrida.",
                        "erro"
                    );

                    return;

                }

            }


            // =================================================
            // VERIFICAR USUÁRIO
            // =================================================

            const usuario =
                await verificarUsuario();


            if (!usuario) {

                mostrarMensagemCorrida(
                    "Você precisa estar logado para solicitar uma corrida.",
                    "erro"
                );


                setTimeout(
                    function() {

                        window.location.href =
                            "login.html";

                    },
                    1500
                );


                return;

            }


            // =================================================
            // VERIFICAR TIPO DE ACESSO
            // =================================================

            const tipoAcesso =
                localStorage.getItem(
                    "tipoAcesso"
                );


            if (
                tipoAcesso &&
                tipoAcesso !== "cliente"
            ) {

                mostrarMensagemCorrida(
                    "Somente clientes podem solicitar corridas.",
                    "erro"
                );

                return;

            }


            // =================================================
            // CAMPOS
            // =================================================

            const origem =
                obterValorCampo(
                    "origem"
                );


            const destino =
                obterValorCampo(
                    "destino"
                );


            const formaPagamento =
                obterValorCampo(
                    "formaPagamento"
                );


            const valorCampo =
                obterValorCampo(
                    "valor"
                );


            // =================================================
            // VALIDAR ORIGEM
            // =================================================

            if (!origem) {

                mostrarMensagemCorrida(
                    "Informe o local de origem.",
                    "erro"
                );

                return;

            }


            // =================================================
            // VALIDAR DESTINO
            // =================================================

            if (!destino) {

                mostrarMensagemCorrida(
                    "Informe o destino.",
                    "erro"
                );

                return;

            }


            // =================================================
            // VALIDAR PAGAMENTO
            // =================================================

            if (!formaPagamento) {

                mostrarMensagemCorrida(
                    "Escolha uma forma de pagamento.",
                    "erro"
                );

                return;

            }


            // =================================================
            // VALIDAR VALOR
            // =================================================

            let valor = null;


            if (valorCampo) {

                valor =
                    parseFloat(
                        valorCampo
                            .replace("R$", "")
                            .replace(/\./g, "")
                            .replace(",", ".")
                            .trim()
                    );


                if (
                    isNaN(valor) ||
                    valor < 0
                ) {

                    mostrarMensagemCorrida(
                        "Informe um valor válido para a corrida.",
                        "erro"
                    );

                    return;

                }

            }


            // =================================================
            // BOTÃO
            // =================================================

            if (btnSolicitar) {

                btnSolicitar.disabled =
                    true;

                btnSolicitar.textContent =
                    "Solicitando...";

            }


            try {

                // =================================================
                // VERIFICAR MOTORISTA NO BANCO
                // =================================================

                let motoristaId =
                    motoristaSelecionado
                        ? motoristaSelecionado.id
                        : localStorage.getItem(
                            "motoristaSelecionado"
                        );


                const {
                    data: motorista,
                    error: erroMotorista
                } =
                    await supabaseClient
                        .from("motoristas")
                        .select("id, ativo")
                        .eq("id", motoristaId)
                        .maybeSingle();


                if (erroMotorista) {

                    console.error(
                        "Erro ao verificar motorista:",
                        erroMotorista
                    );


                    mostrarMensagemCorrida(
                        "Não foi possível verificar o motorista.",
                        "erro"
                    );


                    restaurarBotaoCorrida();

                    return;

                }


                if (!motorista) {

                    mostrarMensagemCorrida(
                        "O motorista selecionado não foi encontrado.",
                        "erro"
                    );


                    restaurarBotaoCorrida();

                    return;

                }


                if (!motorista.ativo) {

                    mostrarMensagemCorrida(
                        "Este motorista não está disponível no momento.",
                        "erro"
                    );


                    restaurarBotaoCorrida();

                    return;

                }


                // =================================================
                // DADOS DA CORRIDA
                // =================================================

                const dadosCorrida = {

                    cliente_id:
                        usuario.id,

                    motorista_id:
                        motoristaId,

                    origem:
                        origem,

                    destino:
                        destino,

                    forma_pagamento:
                        formaPagamento,

                    status:
                        "aguardando"

                };


                // -------------------------------------------------
                // ADICIONAR VALOR
                // -------------------------------------------------

                if (valor !== null) {

                    dadosCorrida.valor =
                        valor;

                }


                // =================================================
                // INSERIR CORRIDA
                // =================================================

                const {
                    data,
                    error
                } =
                    await supabaseClient
                        .from("corridas")
                        .insert(
                            dadosCorrida
                        )
                        .select()
                        .single();


                // =================================================
                // ERRO
                // =================================================

                if (error) {

                    console.error(
                        "Erro ao criar corrida:",
                        error
                    );


                    mostrarMensagemCorrida(
                        "Não foi possível solicitar a corrida.",
                        "erro"
                    );


                    restaurarBotaoCorrida();

                    return;

                }


                // =================================================
                // SUCESSO
                // =================================================

                console.log(
                    "Corrida criada:",
                    data
                );


                localStorage.setItem(
                    "corridaAtual",
                    data.id
                );


                mostrarMensagemCorrida(
                    "Corrida solicitada com sucesso! Aguardando o motorista.",
                    "sucesso"
                );


                if (btnSolicitar) {

                    btnSolicitar.textContent =
                        "Corrida solicitada";

                }


                // =================================================
                // ACOMPANHAR EM TEMPO REAL
                // =================================================

                iniciarAcompanhamentoCorrida(
                    data.id
                );

            }

            catch (erro) {

                console.error(
                    "Erro inesperado:",
                    erro
                );


                mostrarMensagemCorrida(
                    "Erro ao conectar com o sistema.",
                    "erro"
                );


                restaurarBotaoCorrida();

            }

        }
    );

}


// ============================================================
// ACOMPANHAR CORRIDA
// ============================================================

async function iniciarAcompanhamentoCorrida(
    corridaId
) {

    if (
        !corridaId ||
        typeof supabaseClient === "undefined" ||
        !supabaseClient
    ) {

        return;

    }


    // --------------------------------------------------------
    // Remover canal anterior
    // --------------------------------------------------------

    if (canalCorrida) {

        await supabaseClient.removeChannel(
            canalCorrida
        );

    }


    // --------------------------------------------------------
    // Criar canal
    // --------------------------------------------------------

    canalCorrida =
        supabaseClient
            .channel(
                "corrida-" + corridaId
            )
            .on(
                "postgres_changes",
                {
                    event: "UPDATE",
                    schema: "public",
                    table: "corridas",
                    filter:
                        "id=eq." + corridaId
                },
                function(payload) {

                    console.log(
                        "Atualização da corrida:",
                        payload.new
                    );


                    atualizarStatusCorrida(
                        payload.new
                    );

                }
            )
            .subscribe(
                function(status) {

                    console.log(
                        "Canal da corrida:",
                        status
                    );

                }
            );

}


// ============================================================
// ATUALIZAR STATUS
// ============================================================

function atualizarStatusCorrida(
    corrida
) {

    if (!corrida) {
        return;
    }


    const elementoStatus =
        document.getElementById(
            "statusCorrida"
        );


    const status =
        corrida.status;


    const mensagens = {

        aguardando:
            "Aguardando o motorista aceitar a corrida.",

        aceita:
            "Motorista aceitou sua corrida.",

        motorista_a_caminho:
            "O motorista está a caminho.",

        chegou:
            "O motorista chegou ao local.",

        em_andamento:
            "Corrida em andamento.",

        aguardando_pagamento:
            "Corrida finalizada. Aguardando pagamento.",

        concluida:
            "Corrida concluída com sucesso.",

        cancelada:
            "Corrida cancelada."

    };


    if (elementoStatus) {

        elementoStatus.textContent =
            mensagens[status] ||
            "Status: " + status;

    }


    // =========================================================
    // PAGAMENTO
    // =========================================================

    if (
        status ===
        "aguardando_pagamento"
    ) {

        const areaPagamento =
            document.getElementById(
                "areaPagamento"
            );


        if (areaPagamento) {

            areaPagamento.style.display =
                "block";

        }

    }


    // =========================================================
    // CONCLUÍDA
    // =========================================================

    if (
        status ===
        "concluida"
    ) {

        mostrarMensagemCorrida(
            "Corrida concluída!",
            "sucesso"
        );

    }


    // =========================================================
    // CANCELADA
    // =========================================================

    if (
        status ===
        "cancelada"
    ) {

        mostrarMensagemCorrida(
            "A corrida foi cancelada.",
            "erro"
        );


        restaurarBotaoCorrida();

    }

}


// ============================================================
// RESTAURAR BOTÃO
// ============================================================

function restaurarBotaoCorrida() {

    if (!btnSolicitar) {
        return;
    }


    btnSolicitar.disabled =
        false;


    btnSolicitar.textContent =
        "Solicitar Corrida";

}


// ============================================================
// OBTER VALOR DE CAMPO
// ============================================================

function obterValorCampo(
    id
) {

    const campo =
        document.getElementById(id);


    if (!campo) {
        return "";
    }


    return campo.value.trim();

}


// ============================================================
// SEGURANÇA HTML
// ============================================================

function escaparHTML(
    texto
) {

    if (
        texto === null ||
        texto === undefined
    ) {

        return "";

    }


    return String(texto)
        .replace(
            /&/g,
            "&amp;"
        )
        .replace(
            /</g,
            "&lt;"
        )
        .replace(
            />/g,
            "&gt;"
        )
        .replace(
            /"/g,
            "&quot;"
        )
        .replace(
            /'/g,
            "&#039;"
        );

}


// ============================================================
// CARREGAR CORRIDA ATUAL
// ============================================================

async function carregarCorridaAtual() {

    const corridaAtual =
        localStorage.getItem(
            "corridaAtual"
        );


    if (!corridaAtual) {

        return;

    }


    if (
        typeof supabaseClient === "undefined"
    ) {

        return;

    }


    try {

        const {
            data,
            error
        } =
            await supabaseClient
                .from("corridas")
                .select("*")
                .eq("id", corridaAtual)
                .maybeSingle();


        if (error) {

            console.error(
                "Erro ao carregar corrida atual:",
                error
            );

            return;

        }


        if (!data) {

            localStorage.removeItem(
                "corridaAtual"
            );

            return;

        }


        atualizarStatusCorrida(
            data
        );


        iniciarAcompanhamentoCorrida(
            data.id
        );

    }

    catch (erro) {

        console.error(
            "Erro ao recuperar corrida:",
            erro
        );

    }

}


// ============================================================
// LIMPAR CORRIDA ATUAL
// ============================================================

function limparCorridaAtual() {

    localStorage.removeItem(
        "corridaAtual"
    );

    localStorage.removeItem(
        "motoristaSelecionado"
    );


    motoristaSelecionado =
        null;


    if (canalCorrida) {

        supabaseClient
            .removeChannel(
                canalCorrida
            );

        canalCorrida =
            null;

    }

}


// ============================================================
// INICIALIZAÇÃO
// ============================================================

document.addEventListener(
    "DOMContentLoaded",
    async function() {

        await carregarMotoristas();


        recuperarMotoristaSelecionado();


        await carregarCorridaAtual();

    }
);

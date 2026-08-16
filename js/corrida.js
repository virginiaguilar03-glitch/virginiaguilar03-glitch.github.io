// ============================================================
// SISTEMA DE CORRIDAS - VAIDTÁXI
// ============================================================


// ============================================================
// ELEMENTOS
// ============================================================

const formCorrida =
    document.getElementById("formCorrida");

const origem =
    document.getElementById("origem");

const destino =
    document.getElementById("destino");

const observacao =
    document.getElementById("observacao");

const tipoServico =
    document.getElementById("tipoServico");

const formaPagamento =
    document.getElementById("formaPagamento");

const mensagemCorrida =
    document.getElementById("mensagemCorrida");

const btnSolicitarCorrida =
    document.getElementById("btnSolicitarCorrida");

const btnConfirmarCorrida =
    document.getElementById("btnConfirmarCorrida");


// ============================================================
// RESUMO
// ============================================================

const resumoOrigem =
    document.getElementById("resumoOrigem");

const resumoDestino =
    document.getElementById("resumoDestino");

const resumoServico =
    document.getElementById("resumoServico");

const resumoPagamento =
    document.getElementById("resumoPagamento");

const resumoMotorista =
    document.getElementById("resumoMotorista");


// ============================================================
// STATUS
// ============================================================

const statusCorrida =
    document.getElementById("statusCorrida");

const descricaoStatus =
    document.getElementById("descricaoStatus");


// ============================================================
// DADOS DA CORRIDA
// ============================================================

let corridaAtual = {

    origem: "",

    destino: "",

    observacao: "",

    tipoServico: "",

    formaPagamento: "",

    motorista: "",

    status: "aguardando"

};


// ============================================================
// MENSAGEM
// ============================================================

function mostrarMensagem(texto, tipo) {

    if (!mensagemCorrida) {
        return;
    }

    mensagemCorrida.textContent =
        texto;


    if (tipo === "sucesso") {

        mensagemCorrida.style.color =
            "#00cc66";

    } else {

        mensagemCorrida.style.color =
            "#ff4444";

    }

}


// ============================================================
// ATUALIZAR RESUMO
// ============================================================

function atualizarResumo() {


    // --------------------------------------------------------
    // ORIGEM
    // --------------------------------------------------------

    if (resumoOrigem) {

        resumoOrigem.textContent =
            origem.value.trim() ||
            "Não informada";

    }


    // --------------------------------------------------------
    // DESTINO
    // --------------------------------------------------------

    if (resumoDestino) {

        resumoDestino.textContent =
            destino.value.trim() ||
            "Não informado";

    }


    // --------------------------------------------------------
    // SERVIÇO
    // --------------------------------------------------------

    if (resumoServico) {

        if (tipoServico.value) {

            resumoServico.textContent =
                tipoServico.options[
                    tipoServico.selectedIndex
                ].text;

        } else {

            resumoServico.textContent =
                "Não selecionado";

        }

    }


    // --------------------------------------------------------
    // PAGAMENTO
    // --------------------------------------------------------

    if (resumoPagamento) {

        if (formaPagamento.value) {

            resumoPagamento.textContent =
                formaPagamento.options[
                    formaPagamento.selectedIndex
                ].text;

        } else {

            resumoPagamento.textContent =
                "Não selecionado";

        }

    }


    // --------------------------------------------------------
    // MOTORISTA
    // --------------------------------------------------------

    if (resumoMotorista) {

        resumoMotorista.textContent =
            corridaAtual.motorista ||
            "Aguardando seleção";

    }

}


// ============================================================
// ATUALIZAR DADOS
// ============================================================

function atualizarDadosCorrida() {

    corridaAtual.origem =
        origem.value.trim();


    corridaAtual.destino =
        destino.value.trim();


    corridaAtual.observacao =
        observacao.value.trim();


    corridaAtual.tipoServico =
        tipoServico.value;


    corridaAtual.formaPagamento =
        formaPagamento.value;


    atualizarResumo();

}


// ============================================================
// EVENTOS DOS CAMPOS
// ============================================================

if (origem) {

    origem.addEventListener(
        "input",
        atualizarDadosCorrida
    );

}


if (destino) {

    destino.addEventListener(
        "input",
        atualizarDadosCorrida
    );

}


if (observacao) {

    observacao.addEventListener(
        "input",
        atualizarDadosCorrida
    );

}


if (tipoServico) {

    tipoServico.addEventListener(
        "change",
        atualizarDadosCorrida
    );

}


if (formaPagamento) {

    formaPagamento.addEventListener(
        "change",
        atualizarDadosCorrida
    );

}


// ============================================================
// VALIDAR CORRIDA
// ============================================================

function validarCorrida() {


    if (!corridaAtual.origem) {

        mostrarMensagem(
            "Informe o local de origem.",
            "erro"
        );

        origem.focus();

        return false;

    }


    if (!corridaAtual.destino) {

        mostrarMensagem(
            "Informe o destino.",
            "erro"
        );

        destino.focus();

        return false;

    }


    if (!corridaAtual.tipoServico) {

        mostrarMensagem(
            "Selecione o tipo de serviço.",
            "erro"
        );

        tipoServico.focus();

        return false;

    }


    if (!corridaAtual.formaPagamento) {

        mostrarMensagem(
            "Selecione a forma de pagamento.",
            "erro"
        );

        formaPagamento.focus();

        return false;

    }


    return true;

}


// ============================================================
// SOLICITAR CORRIDA
// ============================================================

if (formCorrida) {

    formCorrida.addEventListener(
        "submit",
        function (event) {

            event.preventDefault();


            atualizarDadosCorrida();


            // -----------------------------------------------
            // VALIDAR
            // -----------------------------------------------

            if (!validarCorrida()) {

                return;

            }


            // -----------------------------------------------
            // STATUS
            // -----------------------------------------------

            corridaAtual.status =
                "solicitada";


            // -----------------------------------------------
            // SALVAR TEMPORARIAMENTE
            // -----------------------------------------------

            localStorage.setItem(
                "corridaAtual",
                JSON.stringify(corridaAtual)
            );


            // -----------------------------------------------
            // MENSAGEM
            // -----------------------------------------------

            mostrarMensagem(
                "Corrida solicitada com sucesso!",
                "sucesso"
            );


            // -----------------------------------------------
            // ATUALIZAR STATUS
            // -----------------------------------------------

            atualizarStatus(
                "Corrida solicitada",
                "Sua solicitação foi registrada. Agora estamos procurando um motorista disponível."
            );


            // -----------------------------------------------
            // BOTÃO
            // -----------------------------------------------

            if (btnSolicitarCorrida) {

                btnSolicitarCorrida.disabled =
                    true;

                btnSolicitarCorrida.innerHTML =
                    '<i class="fa-solid fa-check"></i> Corrida Solicitada';

            }


            // -----------------------------------------------
            // PREPARAR RESUMO
            // -----------------------------------------------

            atualizarResumo();

        }
    );

}


// ============================================================
// CONFIRMAR CORRIDA
// ============================================================

if (btnConfirmarCorrida) {

    btnConfirmarCorrida.addEventListener(
        "click",
        function () {


            if (!corridaAtual.origem ||
                !corridaAtual.destino) {

                mostrarMensagem(
                    "Primeiro informe origem e destino.",
                    "erro"
                );

                return;

            }


            if (!corridaAtual.tipoServico ||
                !corridaAtual.formaPagamento) {

                mostrarMensagem(
                    "Preencha todos os dados da corrida.",
                    "erro"
                );

                return;

            }


            /*
             * Por enquanto não existe motorista
             * conectado ao sistema.
             *
             * Essa parte será ligada ao módulo
             * de parceiros posteriormente.
             */

            mostrarMensagem(
                "A corrida está pronta. O próximo passo será selecionar um motorista.",
                "sucesso"
            );


            atualizarStatus(
                "Aguardando motorista",
                "A solicitação está pronta para ser enviada aos motoristas disponíveis."
            );

        }
    );

}


// ============================================================
// ATUALIZAR STATUS
// ============================================================

function atualizarStatus(
    titulo,
    descricao
) {

    if (statusCorrida) {

        statusCorrida.textContent =
            titulo;

    }


    if (descricaoStatus) {

        descricaoStatus.textContent =
            descricao;

    }

}


// ============================================================
// CARREGAR CORRIDA SALVA
// ============================================================

function carregarCorridaSalva() {

    const corridaSalva =
        localStorage.getItem(
            "corridaAtual"
        );


    if (!corridaSalva) {

        atualizarResumo();

        return;

    }


    try {

        const dados =
            JSON.parse(corridaSalva);


        corridaAtual =
            dados;


        // ----------------------------------------------------
        // PREENCHER FORMULÁRIO
        // ----------------------------------------------------

        if (origem) {

            origem.value =
                dados.origem || "";

        }


        if (destino) {

            destino.value =
                dados.destino || "";

        }


        if (observacao) {

            observacao.value =
                dados.observacao || "";

        }


        if (tipoServico) {

            tipoServico.value =
                dados.tipoServico || "";

        }


        if (formaPagamento) {

            formaPagamento.value =
                dados.formaPagamento || "";

        }


        // ----------------------------------------------------
        // ATUALIZAR TELA
        // ----------------------------------------------------

        atualizarResumo();


        if (dados.status === "solicitada") {

            atualizarStatus(
                "Corrida solicitada",
                "Sua solicitação foi registrada e está aguardando um motorista."
            );

        }


    }

    catch (erro) {

        console.error(
            "Erro ao carregar corrida:",
            erro
        );

        localStorage.removeItem(
            "corridaAtual"
        );

    }

}


// ============================================================
// INICIALIZAÇÃO
// ============================================================

document.addEventListener(
    "DOMContentLoaded",
    function () {

        carregarCorridaSalva();

        atualizarResumo();

    }
);

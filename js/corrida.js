// ============================================================
// CORRIDA - VAIDTÁXI
// Cliente solicita corrida
// Supabase + Motoristas + Pagamento
// ============================================================


// ============================================================
// CONFIGURAÇÃO
// ============================================================

const paginaCorrida = document.getElementById("formCorrida");


// ============================================================
// ELEMENTOS
// ============================================================

const mensagemCorrida =
    document.getElementById("mensagemCorrida");

const btnSolicitar =
    document.getElementById("btnSolicitarCorrida");


// ============================================================
// VERIFICAR LOGIN
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


    const {
        data,
        error
    } = await supabaseClient.auth.getUser();


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

    } else {

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
        typeof supabaseClient === "undefined"
    ) {

        console.error(
            "Supabase não encontrado."
        );

        return;
    }


    listaMotoristas.innerHTML =
        "<p>Carregando motoristas...</p>";


    try {

        const {
            data,
            error
        } = await supabaseClient
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


        data.forEach(function(motorista) {

            criarCardMotorista(
                motorista,
                listaMotoristas
            );

        });

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
                        marca + " " + modelo
                    )}
                </p>

                <p>
                    Cor:
                    ${escaparHTML(cor || "Não informada")}
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

let motoristaSelecionado = null;


function selecionarMotorista(
    motorista
) {

    motoristaSelecionado =
        motorista;


    /*
     * Remove seleção anterior
     */

    document
        .querySelectorAll(
            ".motorista-corrida-card"
        )
        .forEach(function(card) {

            card.classList.remove(
                "motorista-selecionado"
            );

        });


    /*
     * Marca o motorista escolhido
     */

    const cardSelecionado =
        document.querySelector(
            `[data-motorista-id="${motorista.id}"]`
        );


    if (cardSelecionado) {

        cardSelecionado.classList.add(
            "motorista-selecionado"
        );

    }


    /*
     * Salva somente o ID.
     */

    localStorage.setItem(
        "motoristaSelecionado",
        motorista.id
    );


    mostrarMensagemCorrida(
        "Motorista selecionado. Agora informe os dados da corrida.",
        "sucesso"
    );


    /*
     * Mostra a área da solicitação,
     * caso exista.
     */

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
// SOLICITAR CORRIDA
// ============================================================

if (paginaCorrida) {

    paginaCorrida.addEventListener(
        "submit",
        async function(event) {

            event.preventDefault();


            // ================================================
            // VERIFICAR MOTORISTA
            // ================================================

            if (!motoristaSelecionado) {

                mostrarMensagemCorrida(
                    "Escolha um motorista antes de solicitar a corrida.",
                    "erro"
                );

                return;
            }


            // ================================================
            // VERIFICAR USUÁRIO
            // ================================================

            const usuario =
                await verificarUsuario();


            if (!usuario) {

                mostrarMensagemCorrida(
                    "Você precisa estar logado para solicitar uma corrida.",
                    "erro"
                );


                setTimeout(function() {

                    window.location.href =
                        "login.html";

                }, 1500);


                return;
            }


            // ================================================
            // CAMPOS
            // ================================================

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


            // ================================================
            // VALIDAR ORIGEM
            // ================================================

            if (!origem) {

                mostrarMensagemCorrida(
                    "Informe o local de origem.",
                    "erro"
                );

                return;
            }


            // ================================================
            // VALIDAR DESTINO
            // ================================================

            if (!destino) {

                mostrarMensagemCorrida(
                    "Informe o destino.",
                    "erro"
                );

                return;
            }


            // ================================================
            // VALIDAR PAGAMENTO
            // ================================================

            if (!formaPagamento) {

                mostrarMensagemCorrida(
                    "Escolha uma forma de pagamento.",
                    "erro"
                );

                return;
            }


            // ================================================
            // BOTÃO
            // ================================================

            if (btnSolicitar) {

                btnSolicitar.disabled =
                    true;

                btnSolicitar.textContent =
                    "Solicitando...";

            }


            try {

                // ============================================
                // PREPARAR DADOS
                // ============================================

                const dadosCorrida = {

                    cliente_id:
                        usuario.id,

                    motorista_id:
                        motoristaSelecionado.id,

                    origem:
                        origem,

                    destino:
                        destino,

                    forma_pagamento:
                        formaPagamento,

                    status:
                        "aguardando"

                };


                /*
                 * Só adiciona valor se o campo existir
                 * e estiver preenchido.
                 */

                if (valorCampo) {

                    const valor =
                        parseFloat(
                            valorCampo
                                .replace(",", ".")
                        );


                    if (
                        !isNaN(valor)
                    ) {

                        dadosCorrida.valor =
                            valor;

                    }

                }


                // ============================================
                // INSERIR CORRIDA
                // ============================================

                const {
                    data,
                    error
                } = await supabaseClient
                    .from("corridas")
                    .insert(
                        dadosCorrida
                    )
                    .select()
                    .single();


                // ============================================
                // ERRO
                // ============================================

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


                // ============================================
                // SUCESSO
                // ============================================

                console.log(
                    "Corrida criada:",
                    data
                );


                /*
                 * Guarda a corrida atual
                 */

                localStorage.setItem(
                    "corridaAtual",
                    data.id
                );


                mostrarMensagemCorrida(
                    "Corrida solicitada com sucesso! Aguardando o motorista.",
                    "sucesso"
                );


                /*
                 * Atualiza interface
                 */

                if (btnSolicitar) {

                    btnSolicitar.textContent =
                        "Corrida solicitada";

                }


                /*
                 * Não redirecionamos imediatamente.
                 *
                 * Assim podemos mostrar o status
                 * da corrida na própria página.
                 */

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

let canalCorrida = null;


async function iniciarAcompanhamentoCorrida(
    corridaId
) {

    if (
        !corridaId ||
        typeof supabaseClient === "undefined"
    ) {

        return;
    }


    /*
     * Cancela canal anterior.
     */

    if (canalCorrida) {

        await supabaseClient.removeChannel(
            canalCorrida
        );

    }


    /*
     * Canal em tempo real.
     */

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
            .subscribe();

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


    if (!elementoStatus) {
        return;
    }


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


    elementoStatus.textContent =
        mensagens[status] ||
        "Status: " + status;


    /*
     * Quando chegar em pagamento,
     * mostramos a área de pagamento.
     */

    if (
        status ===
        "aguardando_pagamento"
    ) {

        const pagamento =
            document.getElementById(
                "areaPagamento"
            );


        if (pagamento) {

            pagamento.style.display =
                "block";

        }

    }


    /*
     * Corrida concluída.
     */

    if (
        status ===
        "concluida"
    ) {

        mostrarMensagemCorrida(
            "Corrida concluída!",
            "sucesso"
        );

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
// PEGAR VALOR DE CAMPO
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

    if (texto === null ||
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
// CARREGAR AO ABRIR A PÁGINA
// ============================================================

document.addEventListener(
    "DOMContentLoaded",
    function() {

        carregarMotoristas();


        /*
         * Verifica se existe uma corrida
         * anteriormente criada.
         */

        const corridaAtual =
            localStorage.getItem(
                "corridaAtual"
            );


        if (corridaAtual) {

            iniciarAcompanhamentoCorrida(
                corridaAtual
            );

        }

    }
);

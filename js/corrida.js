// ============================================================
// CORRIDA - VAIDTÁXI
// Solicitação de corrida
// Supabase + Leaflet + Autenticação + Motoristas
// ============================================================


// ============================================================
// VARIÁVEIS
// ============================================================

let mapaCorrida = null;

let marcadorUsuario = null;

let canalCorrida = null;

let motoristaSelecionado = null;


// ============================================================
// ELEMENTOS
// ============================================================

let formCorrida = null;

let nomeCliente = null;

let mensagemCorrida = null;

let btnSolicitar = null;

let btnLocalizacao = null;

let campoOrigem = null;

let campoDestino = null;

let campoObservacao = null;

let listaMotoristas = null;

let campoMotoristaSelecionado = null;


// ============================================================
// INICIALIZAÇÃO
// ============================================================

document.addEventListener(
    "DOMContentLoaded",
    async function () {

        console.log(
            "Corrida VaidTáxi iniciada."
        );


        // --------------------------------------------------------
        // ELEMENTOS
        // --------------------------------------------------------

        formCorrida =
            document.getElementById(
                "formCorrida"
            );

        nomeCliente =
            document.getElementById(
                "nomeCliente"
            );

        mensagemCorrida =
            document.getElementById(
                "mensagemCorrida"
            );

        btnSolicitar =
            document.getElementById(
                "btnSolicitar"
            );

        btnLocalizacao =
            document.getElementById(
                "btnLocalizacao"
            );

        campoOrigem =
            document.getElementById(
                "origem"
            );

        campoDestino =
            document.getElementById(
                "destino"
            );

        campoObservacao =
            document.getElementById(
                "observacao"
            );

        listaMotoristas =
            document.getElementById(
                "listaMotoristas"
            );

        campoMotoristaSelecionado =
            document.getElementById(
                "motoristaSelecionado"
            );


        // --------------------------------------------------------
        // VERIFICAR FORMULÁRIO
        // --------------------------------------------------------

        if (!formCorrida) {

            console.error(
                "Formulário de corrida não encontrado."
            );

            return;

        }


        // --------------------------------------------------------
        // INICIAR MAPA
        // --------------------------------------------------------

        iniciarMapa();


        // --------------------------------------------------------
        // VERIFICAR USUÁRIO
        // --------------------------------------------------------

        await carregarUsuario();


        // --------------------------------------------------------
        // CARREGAR MOTORISTAS
        // --------------------------------------------------------

        await carregarMotoristas();


        // --------------------------------------------------------
        // LOCALIZAÇÃO
        // --------------------------------------------------------

        if (btnLocalizacao) {

            btnLocalizacao.addEventListener(
                "click",
                obterLocalizacao
            );

        }


        // --------------------------------------------------------
        // FORMULÁRIO
        // --------------------------------------------------------

        formCorrida.addEventListener(
            "submit",
            solicitarCorrida
        );


        // --------------------------------------------------------
        // RECUPERAR CORRIDA
        // --------------------------------------------------------

        await carregarCorridaAtual();

    }
);


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
// OBTER USUÁRIO
// ============================================================

async function obterUsuario() {

    if (!supabaseDisponivel()) {

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
                "Erro ao buscar usuário:",
                error
            );

            return null;

        }


        return data?.user || null;

    }

    catch (erro) {

        console.error(
            "Erro inesperado ao buscar usuário:",
            erro
        );

        return null;

    }

}


// ============================================================
// CARREGAR USUÁRIO
// ============================================================

async function carregarUsuario() {

    const usuario =
        await obterUsuario();


    if (!usuario) {

        if (nomeCliente) {

            nomeCliente.textContent =
                "Visitante";

        }

        return;

    }


    const nome =
        usuario.user_metadata?.nome ||
        usuario.user_metadata?.name ||
        usuario.email?.split("@")[0] ||
        "Cliente";


    if (nomeCliente) {

        nomeCliente.textContent =
            nome;

    }


    console.log(
        "Cliente identificado:",
        usuario.id
    );

}


// ============================================================
// CARREGAR MOTORISTAS
// ============================================================

async function carregarMotoristas() {

    if (!listaMotoristas) {

        console.error(
            "Lista de motoristas não encontrada."
        );

        return;

    }


    if (!supabaseDisponivel()) {

        listaMotoristas.innerHTML = `
            <p class="sem-motoristas">
                Erro de conexão com o sistema.
            </p>
        `;

        return;

    }


    try {

        console.log(
            "Buscando motoristas..."
        );


        const {
            data,
            error
        } =
            await supabaseClient
                .from("motoristas")
                .select(
                    "id, nome, telefone, email"
                );


        if (error) {

            console.error(
                "Erro ao buscar motoristas:",
                error
            );


            listaMotoristas.innerHTML = `
                <p class="sem-motoristas">
                    Não foi possível carregar os motoristas.
                </p>
            `;

            return;

        }


        console.log(
            "Motoristas encontrados:",
            data
        );


        if (!data || data.length === 0) {

            listaMotoristas.innerHTML = `
                <p class="sem-motoristas">
                    Nenhum motorista disponível no momento.
                </p>
            `;

            return;

        }


        listaMotoristas.innerHTML = "";


        data.forEach(
            function (motorista) {

                const card =
                    document.createElement(
                        "div"
                    );


                card.className =
                    "card-motorista";


                card.dataset.id =
                    motorista.id;


                card.innerHTML = `

                    <h3>

                        <i class="fa-solid fa-user"></i>

                        ${motorista.nome || "Motorista"}

                    </h3>


                    <p>

                        <i class="fa-solid fa-phone"></i>

                        ${motorista.telefone || "Telefone não informado"}

                    </p>


                    <p>

                        <i class="fa-solid fa-envelope"></i>

                        ${motorista.email || "E-mail não informado"}

                    </p>


                    <button
                        type="button"
                        class="btn-escolher-motorista"
                    >

                        Escolher motorista

                    </button>

                `;


                const botao =
                    card.querySelector(
                        ".btn-escolher-motorista"
                    );


                botao.addEventListener(
                    "click",
                    function () {

                        selecionarMotorista(
                            motorista,
                            card
                        );

                    }
                );


                listaMotoristas.appendChild(
                    card
                );

            }
        );

    }

    catch (erro) {

        console.error(
            "Erro inesperado ao carregar motoristas:",
            erro
        );


        listaMotoristas.innerHTML = `
            <p class="sem-motoristas">
                Ocorreu um erro ao carregar os motoristas.
            </p>
        `;

    }

}


// ============================================================
// SELECIONAR MOTORISTA
// ============================================================

function selecionarMotorista(
    motorista,
    card
) {

    if (!motorista) {

        return;

    }


    motoristaSelecionado =
        motorista.id;


    if (campoMotoristaSelecionado) {

        campoMotoristaSelecionado.value =
            motorista.id;

    }


    document
        .querySelectorAll(
            ".card-motorista"
        )
        .forEach(
            function (item) {

                item.classList.remove(
                    "selecionado"
                );

            }
        );


    card.classList.add(
        "selecionado"
    );


    mostrarMensagem(
        "Motorista " +
        motorista.nome +
        " selecionado!",
        "sucesso"
    );


    console.log(
        "Motorista selecionado:",
        motorista
    );

}


// ============================================================
// MAPA
// ============================================================

function iniciarMapa() {

    // --------------------------------------------------------
    // Verificar Leaflet
    // --------------------------------------------------------

    if (typeof L === "undefined") {

        console.error(
            "Leaflet não foi carregado."
        );

        return;

    }


    // --------------------------------------------------------
    // Elemento do mapa
    // --------------------------------------------------------

    const elementoMapa =
        document.getElementById(
            "mapaCorrida"
        );


    if (!elementoMapa) {

        console.error(
            "Elemento mapaCorrida não encontrado."
        );

        return;

    }


    // --------------------------------------------------------
    // Coordenadas iniciais
    // Jacinto - MG
    // --------------------------------------------------------

    const latitudeInicial =
        -16.1425;

    const longitudeInicial =
        -40.2931;


    // --------------------------------------------------------
    // Criar mapa
    // --------------------------------------------------------

    mapaCorrida =
        L.map(
            "mapaCorrida",
            {
                zoomControl: true
            }
        ).setView(
            [
                latitudeInicial,
                longitudeInicial
            ],
            14
        );


    // --------------------------------------------------------
    // MAPA CLARO
    // OPENSTREETMAP
    // SEM API KEY
    // --------------------------------------------------------

    L.tileLayer(
        "https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png",
        {

            maxZoom: 19,

            minZoom: 5,

            attribution:
                '&copy; <a href="https://www.openstreetmap.org/copyright" target="_blank">OpenStreetMap</a>'

        }
    ).addTo(
        mapaCorrida
    );


    // --------------------------------------------------------
    // MARCADOR INICIAL
    // --------------------------------------------------------

    marcadorUsuario =
        L.marker(
            [
                latitudeInicial,
                longitudeInicial
            ]
        )
        .addTo(
            mapaCorrida
        )
        .bindPopup(
            "<strong>VaidTáxi</strong><br>" +
            "Localização inicial"
        );


    // --------------------------------------------------------
    // POSIÇÃO DO CONTROLE DE ZOOM
    // --------------------------------------------------------

    mapaCorrida.zoomControl.setPosition(
        "bottomright"
    );


    // --------------------------------------------------------
    // CORRIGIR TAMANHO
    // --------------------------------------------------------

    setTimeout(
        function () {

            if (mapaCorrida) {

                mapaCorrida.invalidateSize();

            }

        },
        300
    );


    console.log(
        "Mapa claro da corrida iniciado."
    );

}


// ============================================================
// LOCALIZAÇÃO
// ============================================================

function obterLocalizacao() {

    if (!navigator.geolocation) {

        mostrarMensagem(
            "Seu navegador não suporta localização.",
            "erro"
        );

        return;

    }


    if (!mapaCorrida) {

        mostrarMensagem(
            "O mapa ainda não foi carregado.",
            "erro"
        );

        return;

    }


    // --------------------------------------------------------
    // Alterar botão
    // --------------------------------------------------------

    if (btnLocalizacao) {

        btnLocalizacao.disabled =
            true;

        btnLocalizacao.innerHTML =
            '<i class="fa-solid fa-spinner fa-spin"></i> Localizando...';

    }


    // --------------------------------------------------------
    // Obter localização
    // --------------------------------------------------------

    navigator.geolocation.getCurrentPosition(

        function (posicao) {

            const latitude =
                posicao.coords.latitude;

            const longitude =
                posicao.coords.longitude;


            // ------------------------------------------------
            // Centralizar mapa
            // ------------------------------------------------

            mapaCorrida.setView(
                [
                    latitude,
                    longitude
                ],
                17
            );


            // ------------------------------------------------
            // Remover marcador anterior
            // ------------------------------------------------

            if (marcadorUsuario) {

                mapaCorrida.removeLayer(
                    marcadorUsuario
                );

            }


            // ------------------------------------------------
            // Criar marcador
            // ------------------------------------------------

            marcadorUsuario =
                L.marker(
                    [
                        latitude,
                        longitude
                    ]
                )
                .addTo(
                    mapaCorrida
                )
                .bindPopup(
                    "<strong>Você está aqui!</strong><br>" +
                    "Local de partida"
                )
                .openPopup();


            // ------------------------------------------------
            // Preencher origem
            // ------------------------------------------------

            if (campoOrigem) {

                campoOrigem.value =
                    latitude.toFixed(6) +
                    ", " +
                    longitude.toFixed(6);

            }


            // ------------------------------------------------
            // Botão
            // ------------------------------------------------

            if (btnLocalizacao) {

                btnLocalizacao.disabled =
                    false;

                btnLocalizacao.innerHTML =
                    '<i class="fa-solid fa-location-crosshairs"></i> Localização encontrada';

            }


            // ------------------------------------------------
            // Mensagem
            // ------------------------------------------------

            mostrarMensagem(
                "Sua localização foi encontrada.",
                "sucesso"
            );

        },


        // ----------------------------------------------------
        // ERRO
        // ----------------------------------------------------

        function (erro) {

            console.error(
                "Erro de localização:",
                erro
            );


            let texto =
                "Não foi possível obter sua localização.";


            if (erro.code === 1) {

                texto =
                    "Permita o acesso à localização no navegador.";

            }

            else if (erro.code === 2) {

                texto =
                    "Sua localização não está disponível.";

            }

            else if (erro.code === 3) {

                texto =
                    "A localização demorou demais para responder.";

            }


            mostrarMensagem(
                texto,
                "erro"
            );


            // ------------------------------------------------
            // Restaurar botão
            // ------------------------------------------------

            if (btnLocalizacao) {

                btnLocalizacao.disabled =
                    false;

                btnLocalizacao.innerHTML =
                    '<i class="fa-solid fa-location-crosshairs"></i> Usar minha localização';

            }

        },


        // ----------------------------------------------------
        // CONFIGURAÇÕES
        // ----------------------------------------------------

        {

            enableHighAccuracy: true,

            timeout: 10000,

            maximumAge: 0

        }

    );

}


// ============================================================
// SOLICITAR CORRIDA
// ============================================================

async function solicitarCorrida(
    evento
) {

    evento.preventDefault();


    console.log(
        "Solicitação de corrida iniciada."
    );


    // --------------------------------------------------------
    // Verificar Supabase
    // --------------------------------------------------------

    if (!supabaseDisponivel()) {

        mostrarMensagem(
            "Erro de conexão com o sistema.",
            "erro"
        );

        return;

    }


    // --------------------------------------------------------
    // Verificar usuário
    // --------------------------------------------------------

    const usuario =
        await obterUsuario();


    if (!usuario) {

        mostrarMensagem(
            "Você precisa estar logado para solicitar uma corrida.",
            "erro"
        );


        setTimeout(
            function () {

                window.location.href =
                    "login.html";

            },
            1500
        );


        return;

    }


    // --------------------------------------------------------
    // Verificar tipo de acesso
    // --------------------------------------------------------

    const tipoAcesso =
        localStorage.getItem(
            "tipoAcesso"
        );


    if (
        tipoAcesso &&
        tipoAcesso !== "cliente"
    ) {

        mostrarMensagem(
            "Somente clientes podem solicitar corridas.",
            "erro"
        );

        return;

    }


    // --------------------------------------------------------
    // Verificar motorista
    // --------------------------------------------------------

    if (!motoristaSelecionado) {

        mostrarMensagem(
            "Escolha um motorista antes de solicitar a corrida.",
            "erro"
        );

        return;

    }


    // --------------------------------------------------------
    // Campos
    // --------------------------------------------------------

    const origem =
        campoOrigem?.value.trim() ||
        "";


    const destino =
        campoDestino?.value.trim() ||
        "";


    const observacao =
        campoObservacao?.value.trim() ||
        "";


    // --------------------------------------------------------
    // Validar origem
    // --------------------------------------------------------

    if (!origem) {

        mostrarMensagem(
            "Informe o local de partida.",
            "erro"
        );

        campoOrigem?.focus();

        return;

    }


    // --------------------------------------------------------
    // Validar destino
    // --------------------------------------------------------

    if (!destino) {

        mostrarMensagem(
            "Informe o destino.",
            "erro"
        );

        campoDestino?.focus();

        return;

    }


    // --------------------------------------------------------
    // Botão
    // --------------------------------------------------------

    if (btnSolicitar) {

        btnSolicitar.disabled =
            true;

        btnSolicitar.innerHTML =
            '<i class="fa-solid fa-spinner fa-spin"></i> Solicitando...';

    }


    try {

        // ====================================================
        // DADOS DA CORRIDA
        // ====================================================

        const dadosCorrida = {

            cliente_id:
                usuario.id,

            motorista_id:
                motoristaSelecionado,

            origem:
                origem,

            destino:
                destino,

            observacao:
                observacao || null,

            status:
                "aguardando"

        };


        console.log(
            "Dados enviados para corrida:",
            dadosCorrida
        );


        // ====================================================
        // INSERIR NO SUPABASE
        // ====================================================

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


        // ====================================================
        // TRATAR ERRO
        // ====================================================

        if (error) {

            console.error(
                "Erro ao criar corrida:",
                error
            );


            console.error(
                "Código:",
                error.code
            );


            console.error(
                "Mensagem:",
                error.message
            );


            console.error(
                "Detalhes:",
                error.details
            );


            mostrarMensagem(
                "Não foi possível solicitar a corrida. Verifique o console para mais detalhes.",
                "erro"
            );


            restaurarBotao();

            return;

        }


        // ====================================================
        // SUCESSO
        // ====================================================

        console.log(
            "Corrida criada com sucesso:",
            data
        );


        // ----------------------------------------------------
        // Salvar corrida atual
        // ----------------------------------------------------

        if (data?.id) {

            localStorage.setItem(
                "corridaAtual",
                data.id
            );

        }


        // ----------------------------------------------------
        // Mensagem
        // ----------------------------------------------------

        mostrarMensagem(
            "Corrida solicitada com sucesso! Aguardando atendimento.",
            "sucesso"
        );


        // ----------------------------------------------------
        // Botão
        // ----------------------------------------------------

        if (btnSolicitar) {

            btnSolicitar.disabled =
                true;

            btnSolicitar.innerHTML =
                '<i class="fa-solid fa-check"></i> Corrida solicitada';

        }


        // ----------------------------------------------------
        // Acompanhar
        // ----------------------------------------------------

        if (data?.id) {

            iniciarAcompanhamentoCorrida(
                data.id
            );

        }

    }

    catch (erro) {

        console.error(
            "Erro inesperado ao solicitar corrida:",
            erro
        );


        mostrarMensagem(
            "Ocorreu um erro ao conectar com o sistema.",
            "erro"
        );


        restaurarBotao();

    }

}


// ============================================================
// MENSAGEM
// ============================================================

function mostrarMensagem(
    texto,
    tipo = "erro"
) {

    if (!mensagemCorrida) {

        return;

    }


    mensagemCorrida.textContent =
        texto;


    mensagemCorrida.style.display =
        "block";


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
// RESTAURAR BOTÃO
// ============================================================

function restaurarBotao() {

    if (!btnSolicitar) {

        return;

    }


    btnSolicitar.disabled =
        false;

    btnSolicitar.innerHTML =
        "Solicitar Corrida";

}


// ============================================================
// ACOMPANHAR CORRIDA
// ============================================================

async function iniciarAcompanhamentoCorrida(
    corridaId
) {

    if (
        !corridaId ||
        !supabaseDisponivel()
    ) {

        return;

    }


    // --------------------------------------------------------
    // Remover canal anterior
    // --------------------------------------------------------

    if (canalCorrida) {

        await supabaseClient
            .removeChannel(
                canalCorrida
            );

        canalCorrida =
            null;

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

                    event:
                        "UPDATE",

                    schema:
                        "public",

                    table:
                        "corridas",

                    filter:
                        "id=eq." +
                        corridaId

                },

                function (payload) {

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
                function (status) {

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


    const mensagens = {

        aguardando:
            "Aguardando atendimento.",

        aceita:
            "Sua corrida foi aceita.",

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
            "A corrida foi cancelada."

    };


    const mensagem =
        mensagens[corrida.status] ||
        "Status: " +
        (
            corrida.status ||
            "aguardando"
        );


    mostrarMensagem(
        mensagem,
        corrida.status === "cancelada"
            ? "erro"
            : "sucesso"
    );


    console.log(
        "Status atual da corrida:",
        corrida.status
    );

}


// ============================================================
// CARREGAR CORRIDA ATUAL
// ============================================================

async function carregarCorridaAtual() {

    const corridaId =
        localStorage.getItem(
            "corridaAtual"
        );


    if (!corridaId) {

        return;

    }


    if (!supabaseDisponivel()) {

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
                .eq(
                    "id",
                    corridaId
                )
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


        console.log(
            "Corrida atual:",
            data
        );


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
// LIMPAR CORRIDA
// ============================================================

async function limparCorridaAtual() {

    localStorage.removeItem(
        "corridaAtual"
    );


    if (canalCorrida) {

        await supabaseClient
            .removeChannel(
                canalCorrida
            );

        canalCorrida =
            null;

    }


    console.log(
        "Corrida atual removida."
    );

}

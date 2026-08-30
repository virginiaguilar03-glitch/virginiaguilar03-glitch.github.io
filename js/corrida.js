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

    if (
        typeof L === "undefined"
    ) {

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
    // EVITAR DUPLICAÇÃO
    // --------------------------------------------------------

    if (mapaCorrida) {

        mapaCorrida.remove();

        mapaCorrida =
            null;

    }


    // ========================================================
    // ESTILO DO MAPA
    // ========================================================

    elementoMapa.style.width =
        "100%";

    elementoMapa.style.height =
        "380px";

    elementoMapa.style.minHeight =
        "380px";

    elementoMapa.style.border =
        "2px solid #FFD000";

    elementoMapa.style.borderRadius =
        "18px";

    elementoMapa.style.overflow =
        "hidden";

    elementoMapa.style.background =
        "#f4f4f4";

    elementoMapa.style.boxShadow =
        "0 8px 25px rgba(0,0,0,.20)";


    // ========================================================
    // COORDENADAS INICIAIS
    // Jacinto - MG
    // ========================================================

    const latitudeInicial =
        -16.1425;

    const longitudeInicial =
        -40.2931;


    // ========================================================
    // CRIAR MAPA
    // ========================================================

    mapaCorrida =
        L.map(
            "mapaCorrida",
            {
                zoomControl: false
            }
        )
        .setView(
            [
                latitudeInicial,
                longitudeInicial
            ],
            14
        );


    // ========================================================
    // CONTROLE DE ZOOM
    // ========================================================

    L.control.zoom(
        {
            position: "topleft"
        }
    ).addTo(
        mapaCorrida
    );


    // ========================================================
    // OPENSTREETMAP
    // SEM API KEY
    // ========================================================

    L.tileLayer(
        "https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png",
        {

            maxZoom: 19,

            minZoom: 3,

            attribution:
                '&copy; <a href="https://www.openstreetmap.org/copyright" target="_blank">OpenStreetMap</a> contributors'

        }
    ).addTo(
        mapaCorrida
    );


    // ========================================================
    // ÍCONE AMARELO DO VAIDTÁXI
    // ========================================================

    const iconeUsuario =
        L.divIcon(
            {

                className:
                    "marcador-vaidtaxi",

                html: `
                    <div class="marcador-vaidtaxi-pin">

                        <i class="fa-solid fa-location-dot"></i>

                    </div>
                `,

                iconSize:
                    [42, 42],

                iconAnchor:
                    [21, 42],

                popupAnchor:
                    [0, -42]

            }
        );


    // ========================================================
    // MARCADOR INICIAL
    // ========================================================

    marcadorUsuario =
        L.marker(
            [
                latitudeInicial,
                longitudeInicial
            ],
            {
                icon:
                    iconeUsuario
            }
        )
        .addTo(
            mapaCorrida
        )
        .bindPopup(
            "<strong>VaidTáxi</strong><br>Jacinto - MG"
        );


    // ========================================================
    // CSS DO MARCADOR
    // ========================================================

    adicionarEstiloMapa();


    // ========================================================
    // CORRIGIR TAMANHO
    // ========================================================

    setTimeout(
        function () {

            if (mapaCorrida) {

                mapaCorrida.invalidateSize();

            }

        },
        300
    );


    console.log(
        "Mapa claro do VaidTáxi iniciado sem API Key."
    );

}


// ============================================================
// ESTILO EXTRA DO MAPA
// ============================================================

function adicionarEstiloMapa() {

    // --------------------------------------------------------
    // Evitar duplicação
    // --------------------------------------------------------

    if (
        document.getElementById(
            "estiloMapaVaidTaxi"
        )
    ) {

        return;

    }


    const estilo =
        document.createElement(
            "style"
        );


    estilo.id =
        "estiloMapaVaidTaxi";


    estilo.textContent = `

        /* ==========================================
           MAPA VAIDTÁXI
        ========================================== */

        #mapaCorrida {

            position: relative;

            z-index: 1;

        }


        /* ==========================================
           CONTROLE DE ZOOM
        ========================================== */

        #mapaCorrida
        .leaflet-control-zoom {

            border: none !important;

            box-shadow:
                0 4px 15px rgba(0,0,0,.20);

        }


        #mapaCorrida
        .leaflet-control-zoom a {

            width: 42px !important;

            height: 42px !important;

            line-height: 42px !important;

            background: #ffffff !important;

            color: #222222 !important;

            border: none !important;

            font-size: 22px !important;

            font-weight: 600;

            transition: .2s;

        }


        #mapaCorrida
        .leaflet-control-zoom a:hover {

            background: #FFD000 !important;

            color: #111111 !important;

        }


        #mapaCorrida
        .leaflet-control-zoom
        a:first-child {

            border-radius:
                10px 10px 0 0 !important;

        }


        #mapaCorrida
        .leaflet-control-zoom
        a:last-child {

            border-radius:
                0 0 10px 10px !important;

        }


        /* ==========================================
           ATRIBUIÇÃO
        ========================================== */

        #mapaCorrida
        .leaflet-control-attribution {

            background:
                rgba(255,255,255,.92) !important;

            color:
                #555 !important;

            border-radius:
                8px 0 0 0;

            font-size:
                11px;

        }


        #mapaCorrida
        .leaflet-control-attribution a {

            color:
                #555 !important;

        }


        /* ==========================================
           MARCADOR
        ========================================== */

        .marcador-vaidtaxi {

            background:
                transparent !important;

            border:
                none !important;

        }


        .marcador-vaidtaxi-pin {

            width:
                42px;

            height:
                42px;

            display:
                flex;

            align-items:
                center;

            justify-content:
                center;

            background:
                #FFD000;

            color:
                #111111;

            border:
                3px solid #ffffff;

            border-radius:
                50% 50% 50% 0;

            transform:
                rotate(-45deg);

            box-shadow:
                0 5px 15px rgba(0,0,0,.35);

        }


        .marcador-vaidtaxi-pin i {

            transform:
                rotate(45deg);

            font-size:
                21px;

        }


        /* ==========================================
           POPUP
        ========================================== */

        #mapaCorrida
        .leaflet-popup-content-wrapper {

            border-radius:
                12px;

            box-shadow:
                0 8px 25px rgba(0,0,0,.25);

        }


        #mapaCorrida
        .leaflet-popup-content {

            font-family:
                'Poppins',
                sans-serif;

            font-size:
                14px;

            line-height:
                1.5;

        }


        /* ==========================================
           MOBILE
        ========================================== */

        @media (max-width:600px) {

            #mapaCorrida {

                height:
                    300px !important;

                min-height:
                    300px !important;

                border-radius:
                    15px;

            }

            #mapaCorrida
            .leaflet-control-zoom a {

                width:
                    38px !important;

                height:
                    38px !important;

                line-height:
                    38px !important;

            }

        }

    `;


    document.head.appendChild(
        estilo
    );

}


// ============================================================
// LOCALIZAÇÃO
// ============================================================

function obterLocalizacao() {

    if (
        !navigator.geolocation
    ) {

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


    if (btnLocalizacao) {

        btnLocalizacao.disabled =
            true;

        btnLocalizacao.innerHTML =
            '<i class="fa-solid fa-spinner fa-spin"></i> Localizando...';

    }


    navigator.geolocation.getCurrentPosition(

        function (posicao) {

            const latitude =
                posicao.coords.latitude;

            const longitude =
                posicao.coords.longitude;


            // ------------------------------------------------
            // CENTRALIZAR MAPA
            // ------------------------------------------------

            mapaCorrida.setView(
                [
                    latitude,
                    longitude
                ],
                17,
                {
                    animate:
                        true
                }
            );


            // ------------------------------------------------
            // REMOVER MARCADOR ANTERIOR
            // ------------------------------------------------

            if (marcadorUsuario) {

                mapaCorrida.removeLayer(
                    marcadorUsuario
                );

            }


            // ------------------------------------------------
            // ÍCONE
            // ------------------------------------------------

            const iconeUsuario =
                L.divIcon(
                    {

                        className:
                            "marcador-vaidtaxi",

                        html: `
                            <div class="marcador-vaidtaxi-pin">

                                <i class="fa-solid fa-location-dot"></i>

                            </div>
                        `,

                        iconSize:
                            [42, 42],

                        iconAnchor:
                            [21, 42],

                        popupAnchor:
                            [0, -42]

                    }
                );


            // ------------------------------------------------
            // NOVO MARCADOR
            // ------------------------------------------------

            marcadorUsuario =
                L.marker(
                    [
                        latitude,
                        longitude
                    ],
                    {
                        icon:
                            iconeUsuario
                    }
                )
                .addTo(
                    mapaCorrida
                )
                .bindPopup(
                    "<strong>Você está aqui!</strong>"
                )
                .openPopup();


            // ------------------------------------------------
            // PREENCHER ORIGEM
            // ------------------------------------------------

            if (campoOrigem) {

                campoOrigem.value =
                    latitude.toFixed(6) +
                    ", " +
                    longitude.toFixed(6);

            }


            // ------------------------------------------------
            // BOTÃO
            // ------------------------------------------------

            if (btnLocalizacao) {

                btnLocalizacao.disabled =
                    false;

                btnLocalizacao.innerHTML =
                    '<i class="fa-solid fa-location-crosshairs"></i> Localização encontrada';

            }


            mostrarMensagem(
                "Sua localização foi encontrada.",
                "sucesso"
            );

        },


        function (erro) {

            console.error(
                "Erro de localização:",
                erro
            );


            let texto =
                "Não foi possível obter sua localização.";


            if (
                erro.code === 1
            ) {

                texto =
                    "Permita o acesso à localização no navegador.";

            }

            else if (
                erro.code === 2
            ) {

                texto =
                    "Sua localização não está disponível.";

            }

            else if (
                erro.code === 3
            ) {

                texto =
                    "A localização demorou demais para responder.";

            }


            mostrarMensagem(
                texto,
                "erro"
            );


            if (btnLocalizacao) {

                btnLocalizacao.disabled =
                    false;

                btnLocalizacao.innerHTML =
                    '<i class="fa-solid fa-location-crosshairs"></i> Usar minha localização';

            }

        },


        {

            enableHighAccuracy:
                true,

            timeout:
                10000,

            maximumAge:
                0

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
    // SUPABASE
    // --------------------------------------------------------

    if (!supabaseDisponivel()) {

        mostrarMensagem(
            "Erro de conexão com o sistema.",
            "erro"
        );

        return;

    }


    // --------------------------------------------------------
    // USUÁRIO
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
    // TIPO DE ACESSO
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
    // MOTORISTA
    // --------------------------------------------------------

    if (!motoristaSelecionado) {

        mostrarMensagem(
            "Escolha um motorista antes de solicitar a corrida.",
            "erro"
        );

        return;

    }


    // --------------------------------------------------------
    // CAMPOS
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
    // VALIDAR ORIGEM
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
    // VALIDAR DESTINO
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
    // BOTÃO
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
        // ERRO
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
        // SALVAR CORRIDA ATUAL
        // ----------------------------------------------------

        if (data?.id) {

            localStorage.setItem(
                "corridaAtual",
                data.id
            );

        }


        // ----------------------------------------------------
        // MENSAGEM
        // ----------------------------------------------------

        mostrarMensagem(
            "Corrida solicitada com sucesso! Aguardando atendimento.",
            "sucesso"
        );


        // ----------------------------------------------------
        // BOTÃO
        // ----------------------------------------------------

        if (btnSolicitar) {

            btnSolicitar.disabled =
                true;

            btnSolicitar.innerHTML =
                '<i class="fa-solid fa-check"></i> Corrida solicitada';

        }


        // ----------------------------------------------------
        // ACOMPANHAR
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


    if (
        tipo === "sucesso"
    ) {

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
    // REMOVER CANAL ANTERIOR
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
    // CRIAR CANAL
    // --------------------------------------------------------

    canalCorrida =
        supabaseClient
            .channel(
                "corrida-" +
                corridaId
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

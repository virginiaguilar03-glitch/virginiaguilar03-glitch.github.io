// ============================================================
// PAINEL DO PARCEIRO / TAXISTA - VAIDTÁXI
// Supabase
// ============================================================


// ============================================================
// ELEMENTOS DO PARCEIRO
// ============================================================

const nomeParceiro =
    document.getElementById("nomeParceiro");

const perfilNome =
    document.getElementById("perfilNome");

const perfilEmail =
    document.getElementById("perfilEmail");

const perfilTelefone =
    document.getElementById("perfilTelefone");

const corridasHoje =
    document.getElementById("corridasHoje");

const corridasMes =
    document.getElementById("corridasMes");

const ganhosHoje =
    document.getElementById("ganhosHoje");

const ganhosMes =
    document.getElementById("ganhosMes");

const notaMotorista =
    document.getElementById("notaMotorista");


// ============================================================
// DADOS DO PARCEIRO
// ============================================================

let parceiro = {

    id: "",

    nome: "Carregando...",

    email: "Carregando...",

    telefone: "Carregando...",

    corridasHoje: 0,

    corridasMes: 0,

    ganhosHoje: 0,

    ganhosMes: 0,

    avaliacao: 0,

    // --------------------------------------------------------
    // VEÍCULO
    // --------------------------------------------------------

    marca: "Não informado",

    modelo: "Não informado",

    cor: "Não informado",

    ano: "Não informado",

    placa: "Não informado",

    passageiros: "Não informado"

};


// ============================================================
// FORMATAR MOEDA
// ============================================================

function formatarMoeda(valor) {

    return Number(valor || 0).toLocaleString(
        "pt-BR",
        {
            style: "currency",
            currency: "BRL"
        }
    );

}


// ============================================================
// FUNÇÃO PARA PREENCHER ELEMENTO
// ============================================================

function preencherElemento(id, valor) {

    const elemento =
        document.getElementById(id);

    if (elemento) {

        elemento.textContent =
            valor || "Não informado";

    }

}


// ============================================================
// MOSTRAR DADOS DO PARCEIRO
// ============================================================

function carregarDadosParceiro() {


    // ========================================================
    // DADOS PESSOAIS
    // ========================================================

    preencherElemento(
        "nomeParceiro",
        parceiro.nome
    );


    preencherElemento(
        "perfilNome",
        parceiro.nome
    );


    preencherElemento(
        "perfilEmail",
        parceiro.email
    );


    preencherElemento(
        "perfilTelefone",
        parceiro.telefone
    );


    // ========================================================
    // CORRIDAS
    // ========================================================

    preencherElemento(
        "corridasHoje",
        parceiro.corridasHoje
    );


    preencherElemento(
        "corridasMes",
        parceiro.corridasMes
    );


    // ========================================================
    // GANHOS
    // ========================================================

    preencherElemento(
        "ganhosHoje",
        formatarMoeda(
            parceiro.ganhosHoje
        )
    );


    preencherElemento(
        "ganhosMes",
        formatarMoeda(
            parceiro.ganhosMes
        )
    );


    // ========================================================
    // AVALIAÇÃO
    // ========================================================

    preencherElemento(
        "notaMotorista",
        Number(
            parceiro.avaliacao || 0
        ).toFixed(1)
    );


    // ========================================================
    // DADOS DO VEÍCULO
    // ========================================================

    preencherElemento(
        "veiculoMarca",
        parceiro.marca
    );


    preencherElemento(
        "veiculoModelo",
        parceiro.modelo
    );


    preencherElemento(
        "veiculoCor",
        parceiro.cor
    );


    preencherElemento(
        "veiculoAno",
        parceiro.ano
    );


    preencherElemento(
        "veiculoPlaca",
        parceiro.placa
    );


    preencherElemento(
        "veiculoPassageiros",
        parceiro.passageiros
    );


    // ========================================================
    // CONSOLE
    // ========================================================

    console.log(
        "Dados completos do parceiro:",
        parceiro
    );

}


// ============================================================
// BUSCAR DADOS DO MOTORISTA NO SUPABASE
// ============================================================

async function carregarDadosMotorista(usuarioId) {

    try {

        console.log(
            "Buscando motorista no Supabase:",
            usuarioId
        );


        // ----------------------------------------------------
        // BUSCAR MOTORISTA
        // ----------------------------------------------------

        const {
            data: motorista,
            error
        } =
            await supabaseClient
                .from("motoristas")
                .select("*")
                .eq("id", usuarioId)
                .maybeSingle();


        // ----------------------------------------------------
        // VERIFICAR ERRO
        // ----------------------------------------------------

        if (error) {

            console.error(
                "Erro ao buscar dados do motorista:",
                error
            );

            return;

        }


        // ----------------------------------------------------
        // MOTORISTA NÃO ENCONTRADO
        // ----------------------------------------------------

        if (!motorista) {

            console.warn(
                "Nenhum registro encontrado na tabela motoristas para este usuário."
            );

            return;

        }


        // ----------------------------------------------------
        // MOSTRAR MOTORISTA NO CONSOLE
        // ----------------------------------------------------

        
    console.log(
        "Motorista encontrado:",
        motorista
    );
    
    // Atualizar o botão com o estado salvo no banco
    atualizarVisualStatus(
        motorista.disponivel === true
    );



        // ====================================================
        // DADOS DO VEÍCULO
        // ====================================================

        parceiro.marca =
            motorista.marca ||
            "Não informado";


        parceiro.modelo =
            motorista.modelo ||
            "Não informado";


        parceiro.cor =
            motorista.cor ||
            "Não informado";


        parceiro.ano =
            motorista.ano ||
            "Não informado";


        parceiro.placa =
            motorista.placa ||
            "Não informado";


        // ====================================================
        // QUANTIDADE DE PASSAGEIROS
        // ====================================================

        parceiro.passageiros =
            motorista.quantidade_assentos ||
            "Não informado";


        // ====================================================
        // ATUALIZAR PAINEL
        // ====================================================

        carregarDadosParceiro();


    }

    catch (erro) {

        console.error(
            "Erro inesperado ao carregar motorista:",
            erro
        );

    }

}


// ============================================================
// CARREGAR CORRIDAS DO MOTORISTA
// ============================================================


    async function carregarCorridasDoMotorista(motoristaId) {
        const lista = document.getElementById("listaCorridas");
    
        if (!lista) {
            console.error("Elemento #listaCorridas não encontrado.");
            return;
        }
    
        const { data: corridas, error } = await supabaseClient
            .from("corridas")
            .select("*")
            .eq("motorista_id", motoristaId)
            .eq("status", "aguardando")
            .order("created_at", { ascending: false });
    
        if (error) {
            console.error("Erro ao buscar corridas:", error);
            lista.innerHTML = "<p>Não foi possível carregar as corridas.</p>";
            return;
        }
    
        if (!corridas || corridas.length === 0) {
            lista.innerHTML = `
                <div class="sem-corridas">
                    <p>Nenhuma corrida disponível.</p>
                </div>
            `;
            return;
        }

        
    for (const corrida of corridas) {
        const { data: nomeCliente, error: erroNome } =
            await supabaseClient.rpc(
                "nome_cliente_da_corrida",
                { p_corrida_id: corrida.id }
            );
    
        corrida.nome_cliente = erroNome
            ? "Cliente"
            : (nomeCliente || "Cliente");
    }

        lista.innerHTML = "";
    
        corridas.forEach(corrida => {
            const card = document.createElement("div");
            card.className = "corrida-item";
    
            const titulo = document.createElement("h3");
            titulo.textContent = "Nova solicitação de corrida";
    
            const origem = document.createElement("p");
            origem.textContent = "Origem: " + (corrida.origem || "Não informada");
    
            const destino = document.createElement("p");
            destino.textContent = "Destino: " + (corrida.destino || "Não informado");
    
            card.append(titulo, origem, destino);
    
            if (corrida.observacao) {
                const observacao = document.createElement("p");
                observacao.textContent = "Observação: " + corrida.observacao;
                card.appendChild(observacao);
                }
          
            const cliente = document.createElement("p");
            cliente.textContent = "Cliente: " + corrida.nome_cliente;
            card.appendChild(cliente);

    
            const botoes = document.createElement("div");
            botoes.className = "acoes-corrida";
    
            const aceitar = document.createElement("button");
            aceitar.type = "button";
            aceitar.textContent = "Aceitar corrida";
            aceitar.onclick = () => aceitarCorrida(corrida.id);
    
            const recusar = document.createElement("button");
            recusar.type = "button";
            recusar.textContent = "Recusar corrida";
            recusar.onclick = () => recusarCorrida(corrida.id);
    
            botoes.append(aceitar, recusar);
            card.appendChild(botoes);
            lista.appendChild(card);
        });
    }

function ouvirNovasCorridas(motoristaId) {

    console.log("Iniciando escuta de novas corridas para:", motoristaId);

    const canal = supabaseClient
        .channel(`corridas-motorista-${motoristaId}`)
        .on(
            "postgres_changes",
            {
                event: "INSERT",
                schema: "public",
                table: "corridas",
                filter: `motorista_id=eq.${motoristaId}`
            },
            (payload) => {

                console.log("NOVA CORRIDA RECEBIDA:", payload);

                carregarCorridasDoMotorista(motoristaId);
            }
        )
        .subscribe((status) => {

            console.log(
                "Status do canal de corridas:",
                status
            );

        });

    return canal;
}

// ============================================================
// VERIFICAR SESSÃO
// ============================================================

async function verificarSessaoParceiro() {


    // ========================================================
    // VERIFICAR SUPABASE
    // ========================================================

    if (
        typeof supabaseClient === "undefined" ||
        !supabaseClient
    ) {

        console.error(
            "supabaseClient não encontrado."
        );

        return;

    }


    try {


        // ====================================================
        // PEGAR SESSÃO
        // ====================================================

        const {
            data,
            error
        } =
            await supabaseClient.auth.getSession();


        if (error) {

            console.error(
                "Erro ao verificar sessão:",
                error
            );

            return;

        }


        const sessao =
            data.session;


        // ====================================================
        // SEM LOGIN
        // ====================================================

        if (!sessao) {

            console.warn(
                "Nenhum parceiro está logado."
            );

            window.location.href =
                "login.html";

            return;

        }


        // ====================================================
        // USUÁRIO LOGADO
        // ====================================================

        const usuario =
            sessao.user;


        parceiro.id =
            usuario.id;


        console.log(
            "ID do usuário logado:",
            usuario.id
        );


        // ====================================================
        // METADADOS DO AUTH
        // ====================================================

        const metadata =
            usuario.user_metadata || {};


        parceiro.nome =
            metadata.nome ||
            "Parceiro VaidTáxi";


        parceiro.telefone =
            metadata.telefone ||
            "Telefone não informado";


        parceiro.email =
            usuario.email ||
            "E-mail não informado";


        // ====================================================
        // VERIFICAR TIPO DE ACESSO
        // ====================================================

        const tipoAcesso =
            localStorage.getItem(
                "tipoAcesso"
            );


        if (
            tipoAcesso &&
            tipoAcesso !== "parceiro"
        ) {

            console.warn(
                "Usuário logado não é parceiro."
            );

            window.location.href =
                "login.html";

            return;

        }


        // ====================================================
        // MOSTRAR DADOS BÁSICOS
        // ====================================================

        carregarDadosParceiro();


        // ====================================================
        // BUSCAR DADOS DO VEÍCULO
        // ====================================================

        await carregarDadosMotorista(
            usuario.id
        );


        // ====================================================
        // BUSCAR CORRIDAS DO MOTORISTA
        // ====================================================

        await carregarCorridasDoMotorista(
            usuario.id
        );
        // Iniciar painel de controle da corrida ativa
        await carregarPainelCorridaAtiva(usuario.id);
        
        // Escutar alterações de status e confirmações
        ouvirAtualizacoesCorridaMotorista(usuario.id);

    // ====================================================
    // OUVIR NOVAS CORRIDAS
    // ====================================================
    
    ouvirNovasCorridas(
        usuario.id
    );


        console.log(
            "Parceiro carregado completamente:",
            parceiro
        );


    }

    catch (erro) {

        console.error(
            "Erro inesperado:",
            erro
        );

    }

}

// ============================================================
// LOGOUT
// ============================================================

async function sairParceiro() {

    console.log(
        "Iniciando logout do parceiro..."
    );


    // ========================================================
    // LIMPAR DADOS LOCAIS PRIMEIRO
    // ========================================================

    localStorage.removeItem(
        "usuarioId"
    );

    localStorage.removeItem(
        "tipoAcesso"
    );


    // ========================================================
    // FAZER LOGOUT NO SUPABASE
    // ========================================================

    if (
        typeof supabaseClient !== "undefined" &&
        supabaseClient
    ) {

        try {

            const {
                error
            } =
                await supabaseClient.auth.signOut();


            if (error) {

                console.error(
                    "Erro ao sair do Supabase:",
                    error
                );

            }

        }

        catch (erro) {

            console.error(
                "Erro inesperado durante logout:",
                erro
            );

        }

    }


    // ========================================================
    // REDIRECIONAR PARA LOGIN
    // ========================================================

    console.log(
        "Logout concluído. Redirecionando para login..."
    );

    window.location.replace(
        "login.html"
    );

}


    async function atualizarStatusCorrida(corridaId, novoStatus) {
        const { data: usuarioData, error: erroUsuario } =
            await supabaseClient.auth.getUser();
    
        const usuario = usuarioData?.user;
    
        if (erroUsuario || !usuario) {
            alert("Sua sessão expirou. Entre novamente.");
            return;
        }
    
        const { data, error } = await supabaseClient
            .from("corridas")
            .update({ status: novoStatus })
            .eq("id", corridaId)
            .eq("motorista_id", usuario.id)
            .eq("status", "aguardando")
            .select("id");
    
        if (error) {
            console.error("Erro ao atualizar corrida:", error);
            alert("Não foi possível atualizar a corrida. Verifique as permissões.");
            return;
        }
    
        if (!data || data.length === 0) {
            alert("A corrida não está mais disponível ou você não tem permissão.");
            await carregarCorridasDoMotorista(usuario.id);
            return;
        }
    
        alert(novoStatus === "aceita"
            ? "Corrida aceita com sucesso!"
            : "Corrida recusada.");
    
        await carregarCorridasDoMotorista(usuario.id);
    }
    
    async function aceitarCorrida(corridaId) {
        await atualizarStatusCorrida(corridaId, "aceita");
    }
    
    async function recusarCorrida(corridaId) {
        await atualizarStatusCorrida(corridaId, "recusada");
    }


// ============================================================
// INICIAR PAINEL
// ============================================================

document.addEventListener(
    "DOMContentLoaded",
    function () {

        verificarSessaoParceiro();

    }
);

/* =========================================================
   CONFIGURAÇÕES DO PARCEIRO
========================================================= */

const btnAbrirConfiguracoes =
    document.getElementById("btnAbrirConfiguracoes");

const secaoConfiguracoes =
    document.getElementById("secaoConfiguracoes");

const formConfiguracoesParceiro =
    document.getElementById("formConfiguracoesParceiro");

const btnCancelarConfiguracoes =
    document.getElementById("btnCancelarConfiguracoes");

const mensagemConfiguracoes =
    document.getElementById("mensagemConfiguracoes");


// Abrir configurações
if (btnAbrirConfiguracoes && secaoConfiguracoes) {
    btnAbrirConfiguracoes.addEventListener("click", function () {
        secaoConfiguracoes.hidden = false;

        document.getElementById("configNome").value =
            parceiro.nome === "Parceiro VaidTáxi" ? "" : parceiro.nome;

        document.getElementById("configTelefone").value =
            parceiro.telefone === "Telefone não informado"
                ? ""
                : parceiro.telefone;

        document.getElementById("configEmail").value =
            parceiro.email === "E-mail não informado" ? "" : parceiro.email;

        document.getElementById("configMarca").value =
            parceiro.marca === "Não informado" ? "" : parceiro.marca;

        document.getElementById("configModelo").value =
            parceiro.modelo === "Não informado" ? "" : parceiro.modelo;

        document.getElementById("configCor").value =
            parceiro.cor === "Não informado" ? "" : parceiro.cor;

        document.getElementById("configAno").value =
            parceiro.ano === "Não informado" ? "" : parceiro.ano;

        document.getElementById("configPlaca").value =
            parceiro.placa === "Não informado" ? "" : parceiro.placa;

        document.getElementById("configPassageiros").value =
            parceiro.passageiros === "Não informado"
                ? ""
                : parceiro.passageiros;

        mensagemConfiguracoes.textContent = "";

        secaoConfiguracoes.scrollIntoView({
            behavior: "smooth",
            block: "start"
        });
    });
}


// Cancelar edição
if (btnCancelarConfiguracoes && secaoConfiguracoes) {
    btnCancelarConfiguracoes.addEventListener("click", function () {
        secaoConfiguracoes.hidden = true;
        mensagemConfiguracoes.textContent = "";
    });
}


// Salvar configurações
if (formConfiguracoesParceiro) {
    formConfiguracoesParceiro.addEventListener("submit", async function (event) {
        event.preventDefault();

        if (!parceiro.id) {
            mensagemConfiguracoes.textContent =
                "Não foi possível identificar sua conta. Entre novamente.";
            return;
        }

        const nome = document.getElementById("configNome").value.trim();
        const telefone = document.getElementById("configTelefone").value.trim();
        const marca = document.getElementById("configMarca").value.trim();
        const modelo = document.getElementById("configModelo").value.trim();
        const cor = document.getElementById("configCor").value.trim();
        const ano = Number(document.getElementById("configAno").value);
        const placa = document.getElementById("configPlaca").value.trim().toUpperCase();
        const passageiros = Number(
            document.getElementById("configPassageiros").value
        );

        const btnSalvar =
            document.getElementById("btnSalvarConfiguracoes");

        btnSalvar.disabled = true;
        btnSalvar.textContent = "Salvando...";
        mensagemConfiguracoes.textContent = "";

        try {
            // Atualizar os dados do veículo
            const { data: motoristaAtualizado, error: erroVeiculo } =
                await supabaseClient
                    .from("motoristas")
                    .update({
                        marca: marca,
                        modelo: modelo,
                        cor: cor,
                        ano: ano,
                        placa: placa,
                        quantidade_assentos: passageiros
                    })
                    .eq("id", parceiro.id)
                    .select("id")
                    .maybeSingle();

            if (erroVeiculo) {
                throw erroVeiculo;
            }

            if (!motoristaAtualizado) {
                throw new Error(
                    "O veículo não foi atualizado. Verifique as permissões da tabela motoristas."
                );
            }

            // Atualizar nome e telefone na conta autenticada
            const { data: usuarioAtualizado, error: erroPerfil } =
                await supabaseClient.auth.updateUser({
                    data: {
                        nome: nome,
                        telefone: telefone
                    }
                });

            if (erroPerfil) {
                throw erroPerfil;
            }

            // Atualizar os dados exibidos no painel
            parceiro.nome = nome;
            parceiro.telefone = telefone;
            parceiro.marca = marca;
            parceiro.modelo = modelo;
            parceiro.cor = cor;
            parceiro.ano = ano;
            parceiro.placa = placa;
            parceiro.passageiros = passageiros;

            carregarDadosParceiro();

            mensagemConfiguracoes.textContent =
                "Alterações salvas com sucesso!";

            console.log(
                "Configurações atualizadas:",
                usuarioAtualizado.user
            );

        } catch (erro) {
            console.error("Erro ao salvar configurações:", erro);

            mensagemConfiguracoes.textContent =
                "Não foi possível salvar tudo. Verifique o console e as permissões do Supabase.";
        } finally {
            btnSalvar.disabled = false;
            btnSalvar.textContent = "Salvar alterações";
        }
    });
}

/* ============================================================
   VAIDTÁXI — CONTROLE DA CORRIDA ATIVA DO MOTORISTA
   ============================================================ */

let canalAtualizacoesCorridaMotorista = null;

const statusAtivosMotorista = [
    "aceita",
    "motorista_a_caminho",
    "chegou",
    "em_andamento",
    "aguardando_pagamento"
];

function obterPainelCorridaMotorista() {
    let painel = document.getElementById(
        "painelCorridaAtivaMotorista"
    );

    if (painel) return painel;

    const lista = document.getElementById("listaCorridas");

    if (!lista || !lista.parentNode) {
        console.error(
            "Não foi possível localizar #listaCorridas."
        );
        return null;
    }

    painel = document.createElement("section");
    painel.id = "painelCorridaAtivaMotorista";

    Object.assign(painel.style, {
        display: "none",
        background: "#111",
        color: "#fff",
        border: "1px solid #FFD400",
        borderRadius: "12px",
        padding: "18px",
        marginBottom: "20px"
    });

    lista.parentNode.insertBefore(painel, lista);

    console.log("Painel da corrida ativa criado.");

    return painel;
}

function escaparTextoCorridaMotorista(valor) {
    return String(valor ?? "").replace(/[&<>"']/g, caractere => ({
        "&": "&amp;",
        "<": "&lt;",
        ">": "&gt;",
        '"': "&quot;",
        "'": "&#039;"
    })[caractere]);
}

async function carregarPainelCorridaAtiva(motoristaId) {
    const painel = obterPainelCorridaMotorista();

    if (!painel || !motoristaId) return;

    try {
        const { data: corrida, error } = await supabaseClient
            .from("corridas")
            .select("*")
            .eq("motorista_id", motoristaId)
            .in("status", statusAtivosMotorista)
            .order("created_at", { ascending: false })
            .limit(1)
            .maybeSingle();

        if (error) throw error;

        if (!corrida) {
            painel.style.display = "none";
            painel.innerHTML = "";
            console.log("Nenhuma corrida ativa para controlar.");
            return;
        }

        painel.style.display = "block";

        const origem = escaparTextoCorridaMotorista(
            corrida.origem || "Não informada"
        );

        const destino = escaparTextoCorridaMotorista(
            corrida.destino || "Não informado"
        );

        const clienteConfirmou =
            corrida.cliente_confirmou_finalizacao === true;

        const motoristaConfirmou =
            corrida.motorista_confirmou_finalizacao === true;

        let botaoAcao = "";

        if (corrida.status === "aceita") {
            botaoAcao = `
                <button type="button" id="btnAvancarCorridaMotorista">
                    Iniciar deslocamento até o cliente
                </button>
            `;
        } else if (corrida.status === "motorista_a_caminho") {
            botaoAcao = `
                <button type="button" id="btnAvancarCorridaMotorista">
                    Cheguei ao local
                </button>
            `;
        } else if (corrida.status === "chegou") {
            botaoAcao = `
                <button type="button" id="btnAvancarCorridaMotorista">
                    Iniciar corrida
                </button>
            `;
        } else if (corrida.status === "em_andamento") {
            botaoAcao = `
                <label for="valorFinalCorridaMotorista">
                    Valor final da corrida (R$)
                </label>

                <input
                    type="number"
                    id="valorFinalCorridaMotorista"
                    min="0.01"
                    step="0.01"
                    required
                    placeholder="Ex.: 25,00"
                    style="display:block;width:100%;max-width:260px;padding:10px;margin:8px 0 14px;box-sizing:border-box;"
                >

                <button type="button" id="btnFinalizarCorridaMotorista">
                    Finalizar corrida e confirmar
                </button>
            `;
        } else if (corrida.status === "aguardando_pagamento") {
            botaoAcao = `
                <p>
                    ${motoristaConfirmou
                        ? "✅ Você já confirmou a finalização."
                        : "Aguardando sua confirmação de finalização."}
                </p>
                <p>
                    ${clienteConfirmou
                        ? "✅ O cliente já confirmou a finalização."
                        : "⏳ Aguardando confirmação do cliente."}
                </p>
            `;
        }

        painel.innerHTML = `
            <h3 style="color:#FFD400;margin-top:0;">
                <i class="fa-solid fa-route"></i>
                Corrida em andamento
            </h3>

            <p><strong>Status:</strong>
                ${escaparTextoCorridaMotorista(corrida.status)}
            </p>

            <p><strong>Origem:</strong> ${origem}</p>
            <p><strong>Destino:</strong> ${destino}</p>

            ${corrida.valor_final !== null &&
              corrida.valor_final !== undefined
                ? `<p><strong>Valor final:</strong>
                    ${Number(corrida.valor_final).toLocaleString(
                        "pt-BR",
                        { style: "currency", currency: "BRL" }
                    )}
                   </p>`
                : ""}

            <div style="display:flex;flex-direction:column;align-items:flex-start;gap:10px;">
                ${botaoAcao}
            </div>

            <p id="mensagemCorridaAtivaMotorista"
               role="status"
               style="color:#FFD400;"></p>
        `;

        const botaoAvancar = document.getElementById(
            "btnAvancarCorridaMotorista"
        );

        if (botaoAvancar) {
            botaoAvancar.addEventListener("click", async () => {
                const proximosStatus = {
                    aceita: "motorista_a_caminho",
                    motorista_a_caminho: "chegou",
                    chegou: "em_andamento"
                };

                const novoStatus = proximosStatus[corrida.status];

                if (novoStatus) {
                    await atualizarEtapaCorridaMotorista(
                        corrida,
                        novoStatus,
                        motoristaId
                    );
                }
            });
        }

        const botaoFinalizar = document.getElementById(
            "btnFinalizarCorridaMotorista"
        );

        if (botaoFinalizar) {
            botaoFinalizar.addEventListener("click", async () => {
                const campo = document.getElementById(
                    "valorFinalCorridaMotorista"
                );

                const valor = Number(campo?.value);

                if (!Number.isFinite(valor) || valor <= 0) {
                    alert("Informe um valor final maior que zero.");
                    campo?.focus();
                    return;
                }

                botaoFinalizar.disabled = true;
                botaoFinalizar.textContent = "Confirmando...";

                try {
                    const { data: atualizada, error } =
                        await supabaseClient
                            .from("corridas")
                            .update({
                                valor_final: valor,
                                motorista_confirmou_finalizacao: true,
                                status: clienteConfirmou
                                    ? "concluida"
                                    : "aguardando_pagamento"
                            })
                            .eq("id", corrida.id)
                            .eq("motorista_id", motoristaId)
                            .eq("status", "em_andamento")
                            .select("id,status");

                    if (error) throw error;

                    if (!atualizada || atualizada.length === 0) {
                        throw new Error(
                            "A corrida mudou de status ou não foi possível atualizá-la."
                        );
                    }

                    console.log(
                        "Motorista confirmou a finalização:",
                        atualizada[0]
                    );

                    alert(
                        clienteConfirmou
                            ? "Corrida concluída! Os dois confirmaram."
                            : "Sua confirmação foi registrada. Agora o cliente precisa confirmar."
                    );

                    await carregarPainelCorridaAtiva(motoristaId);
                    await carregarCorridasDoMotorista(motoristaId);

                } catch (erro) {
                    console.error(
                        "Erro ao finalizar corrida:",
                        erro
                    );

                    alert(
                        erro.message ||
                        "Não foi possível finalizar a corrida."
                    );

                    await carregarPainelCorridaAtiva(motoristaId);
                }
            });
        }

        console.log(
            "Painel da corrida ativa atualizado:",
            corrida.id,
            corrida.status
        );

    } catch (erro) {
        console.error(
            "Erro ao carregar painel da corrida ativa:",
            erro
        );
    }
}

async function atualizarEtapaCorridaMotorista(
    corrida,
    novoStatus,
    motoristaId
) {
    const painel = obterPainelCorridaMotorista();

    const mensagem = document.getElementById(
        "mensagemCorridaAtivaMotorista"
    );

    try {
        const { data, error } = await supabaseClient
            .from("corridas")
            .update({ status: novoStatus })
            .eq("id", corrida.id)
            .eq("motorista_id", motoristaId)
            .eq("status", corrida.status)
            .select("id,status");

        if (error) throw error;

        if (!data || data.length === 0) {
            throw new Error(
                "A etapa não foi atualizada. Confira o status atual da corrida."
            );
        }

        console.log(
            "Etapa da corrida atualizada:",
            data[0]
        );

        await carregarPainelCorridaAtiva(motoristaId);

        if (mensagem && painel) {
            mensagem.textContent = "Etapa atualizada com sucesso!";
        }

        await carregarCorridasDoMotorista(motoristaId);

    } catch (erro) {
        console.error("Erro ao avançar a corrida:", erro);

        alert(
            erro.message ||
            "Não foi possível atualizar a etapa da corrida."
        );
    }
}

function ouvirAtualizacoesCorridaMotorista(motoristaId) {
    if (canalAtualizacoesCorridaMotorista) {
        supabaseClient.removeChannel(
            canalAtualizacoesCorridaMotorista
        );
    }

    canalAtualizacoesCorridaMotorista = supabaseClient
        .channel("atualizacoes-corrida-motorista-" + motoristaId)
        .on(
            "postgres_changes",
            {
                event: "UPDATE",
                schema: "public",
                table: "corridas",
                filter: "motorista_id=eq." + motoristaId
            },
            async payload => {
                console.log(
                    "Atualização da corrida recebida pelo motorista:",
                    payload.new
                );

                await carregarPainelCorridaAtiva(motoristaId);
                await carregarCorridasDoMotorista(motoristaId);
            }
        )
        .subscribe(status => {
            console.log(
                "Canal de atualizações do motorista:",
                status
            );
        });
}

/* ============================================================
   VAIDTÁXI — HISTÓRICO COMPLETO DE CORRIDAS DO MOTORISTA
   ============================================================ */

let canalHistoricoMotorista = null;

const nomesStatusHistorico = {
    aguardando: "Pendente",
    aceita: "Aceita",
    motorista_a_caminho: "Motorista a caminho",
    chegou: "Motorista chegou",
    em_andamento: "Em andamento",
    aguardando_pagamento: "Aguardando confirmação do cliente",
    concluida: "Concluída",
    cancelada: "Cancelada",
    recusada: "Recusada"
};

function escaparHistoricoMotorista(valor) {
    return String(valor ?? "").replace(/[&<>"']/g, caractere => ({
        "&": "&amp;",
        "<": "&lt;",
        ">": "&gt;",
        '"': "&quot;",
        "'": "&#039;"
    })[caractere]);
}

function obterAreaHistoricoMotorista() {
    const lista = document.getElementById("listaCorridas");

    if (!lista || !lista.parentElement) {
        console.error("Não encontrei #listaCorridas para montar o histórico.");
        return null;
    }

    let area = document.getElementById("historicoCorridasMotorista");

    if (!area) {
        area = document.createElement("section");
        area.id = "historicoCorridasMotorista";

        Object.assign(area.style, {
            marginTop: "24px",
            padding: "18px",
            background: "#111",
            color: "#fff",
            border: "1px solid #333",
            borderRadius: "12px"
        });

        lista.insertAdjacentElement("afterend", area);
    }

    return area;
}

async function carregarHistoricoCorridasMotorista(motoristaId) {
    const area = obterAreaHistoricoMotorista();

    if (!area || !motoristaId) return;

    area.innerHTML = `
        <h3 style="color:#FFD400;margin-top:0;">
            <i class="fa-solid fa-clock-rotate-left"></i>
            Histórico de corridas
        </h3>
        <p>Carregando corridas...</p>
    `;

    try {
        const { data: corridas, error } = await supabaseClient
            .from("corridas")
            .select("*")
            .eq("motorista_id", motoristaId)
            .order("created_at", { ascending: false });

        if (error) throw error;

        const registros = corridas || [];

        area.innerHTML = `
            <h3 style="color:#FFD400;margin-top:0;">
                <i class="fa-solid fa-clock-rotate-left"></i>
                Histórico de corridas
            </h3>

            <label for="filtroHistoricoMotorista">
                Filtrar por situação:
            </label>

            <select
                id="filtroHistoricoMotorista"
                style="display:block;width:100%;max-width:360px;padding:10px;margin:8px 0 18px;border-radius:8px;"
            >
                <option value="todas">Todas as corridas</option>
                <option value="aguardando">Pendentes</option>
                <option value="ativa">Em andamento</option>
                <option value="aguardando_pagamento">
                    Aguardando confirmação do cliente
                </option>
                <option value="concluida">Concluídas</option>
                <option value="cancelada">Canceladas</option>
                <option value="recusada">Recusadas</option>
            </select>

            <p id="totalHistoricoMotorista">
                ${registros.length} corrida(s) registrada(s)
            </p>

            <div id="itensHistoricoMotorista"></div>
        `;

        const filtro = document.getElementById(
            "filtroHistoricoMotorista"
        );

        const listaHistorico = document.getElementById(
            "itensHistoricoMotorista"
        );

        function renderizarHistorico() {
            const valorFiltro = filtro.value;

            const filtradas = registros.filter(corrida => {
                if (valorFiltro === "todas") return true;

                if (valorFiltro === "ativa") {
                    return [
                        "aceita",
                        "motorista_a_caminho",
                        "chegou",
                        "em_andamento"
                    ].includes(corrida.status);
                }

                return corrida.status === valorFiltro;
            });

            document.getElementById(
                "totalHistoricoMotorista"
            ).textContent =
                `${filtradas.length} corrida(s) nesta categoria`;

            if (filtradas.length === 0) {
                listaHistorico.innerHTML = `
                    <p style="color:#bbb;">
                        Nenhuma corrida encontrada nesta categoria.
                    </p>
                `;
                return;
            }

            listaHistorico.innerHTML = filtradas.map(corrida => {
                const status = escaparHistoricoMotorista(
                    nomesStatusHistorico[corrida.status] ||
                    corrida.status ||
                    "Status desconhecido"
                );

                const origem = escaparHistoricoMotorista(
                    corrida.origem || "Não informada"
                );

                const destino = escaparHistoricoMotorista(
                    corrida.destino || "Não informado"
                );

                const data = corrida.created_at
                    ? new Date(corrida.created_at).toLocaleString("pt-BR")
                    : "Data não informada";

                const valor = corrida.valor_final !== null &&
                    corrida.valor_final !== undefined
                    ? Number(corrida.valor_final).toLocaleString(
                        "pt-BR",
                        { style: "currency", currency: "BRL" }
                    )
                    : "Ainda não informado";

                const confirmacaoMotorista =
                    corrida.motorista_confirmou_finalizacao === true
                        ? "Sim"
                        : "Não";

                const confirmacaoCliente =
                    corrida.cliente_confirmou_finalizacao === true
                        ? "Sim"
                        : "Não";

                return `
                    <article style="
                        border:1px solid #333;
                        border-radius:10px;
                        padding:14px;
                        margin-bottom:12px;
                        background:#1b1b1b;
                    ">
                        <strong style="color:#FFD400;">
                            ${status}
                        </strong>

                        <p><strong>Origem:</strong> ${origem}</p>
                        <p><strong>Destino:</strong> ${destino}</p>
                        <p><strong>Data da solicitação:</strong> ${data}</p>
                        <p><strong>Valor final:</strong> ${valor}</p>
                        <p>
                            <strong>Confirmação do motorista:</strong>
                            ${confirmacaoMotorista}
                        </p>
                        <p>
                            <strong>Confirmação do cliente:</strong>
                            ${confirmacaoCliente}
                        </p>
                    </article>
                `;
            }).join("");
        }

        filtro.addEventListener("change", renderizarHistorico);
        renderizarHistorico();

        console.log(
            "Histórico do motorista carregado:",
            registros.length,
            "corridas"
        );

    } catch (erro) {
        console.error("Erro ao carregar histórico:", erro);

        area.innerHTML = `
            <h3 style="color:#FFD400;">Histórico de corridas</h3>
            <p>Não foi possível carregar o histórico.</p>
            <p style="color:#bbb;">
                Confira o console e as permissões de leitura no Supabase.
            </p>
        `;
    }
}

function ouvirAtualizacoesHistoricoMotorista(motoristaId) {
    if (canalHistoricoMotorista) {
        supabaseClient.removeChannel(canalHistoricoMotorista);
    }

    canalHistoricoMotorista = supabaseClient
        .channel("historico-motorista-" + motoristaId)
        .on(
            "postgres_changes",
            {
                event: "*",
                schema: "public",
                table: "corridas",
                filter: "motorista_id=eq." + motoristaId
            },
            async payload => {
                console.log(
                    "Alteração recebida no histórico:",
                    payload
                );

                await carregarHistoricoCorridasMotorista(motoristaId);
                await atualizarIndicadoresMotorista(motoristaId);
            }
        )
        .subscribe(status => {
            console.log("Canal do histórico:", status);
        });
}

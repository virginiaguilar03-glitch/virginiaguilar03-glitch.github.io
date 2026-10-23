
 // ============================================================
 // ÁREA DO CLIENTE - VAIDTÁXI
 // Integração com Supabase e acompanhamento de corridas
 // ============================================================

// ELEMENTOS
const nomeCliente = document.getElementById("nomeCliente");
const totalCorridas = document.getElementById("totalCorridas");
const totalAvaliacoes = document.getElementById("totalAvaliacoes");
const motoristasFavoritos = document.getElementById("motoristasFavoritos");
const btnSairTopo = document.getElementById("btnSairTopo");
const btnHistorico = document.getElementById("btnHistorico");
const btnAvaliacoes = document.getElementById("btnAvaliacoes");

const tituloCorridaAtual = document.getElementById("tituloCorridaAtual");
const textoCorridaAtual = document.getElementById("textoCorridaAtual");

// DADOS
const cliente = {
    nome: "Cliente",
    corridas: 0,
    avaliacoes: 0,
    favoritos: 0
};

let usuarioClienteId = null;
let canalCorridasCliente = null;
let corridaAtualClienteId = null;
let intervaloCancelamento = null;

// STATUS E MENSAGENS
const statusCorridas = {
    aguardando: {
        titulo: "Aguardando motorista",
        texto: "Sua solicitação foi enviada. Estamos aguardando o atendimento."
    },
    aceita: {
        titulo: "Corrida aceita!",
        texto: "O motorista aceitou sua corrida."
    },
    motorista_a_caminho: {
        titulo: "Motorista a caminho",
        texto: "O motorista está indo até o local de partida."
    },
    chegou: {
        titulo: "Motorista chegou",
        texto: "O motorista chegou ao local de partida."
    },
    em_andamento: {
        titulo: "Corrida em andamento",
        texto: "Você está a caminho do destino."
    },
    aguardando_pagamento: {
        titulo: "Corrida finalizada",
        texto: "Sua corrida foi finalizada. Aguardando pagamento."
    },
    concluida: {
        titulo: "Corrida concluída!",
        texto: "Sua corrida foi concluída com sucesso."
    },
    cancelada: {
        titulo: "Corrida cancelada",
        texto: "Esta corrida foi cancelada."
    },
    recusada: {
        titulo: "Solicitação recusada",
        texto: "O motorista recusou esta solicitação. Você pode solicitar outra corrida."
    }
};

// CARREGAR INFORMAÇÕES BÁSICAS
function carregarCliente() {
    if (nomeCliente) nomeCliente.textContent = cliente.nome;
    if (totalCorridas) totalCorridas.textContent = cliente.corridas;
    if (totalAvaliacoes) totalAvaliacoes.textContent = cliente.avaliacoes;
    if (motoristasFavoritos) motoristasFavoritos.textContent = cliente.favoritos;
}

// ATUALIZAR A SEÇÃO "CORRIDA ATUAL"
function atualizarPainelCorrida(corrida) {
    if (!corrida) return;

    const info = statusCorridas[corrida.status] || {
        titulo: "Status da corrida",
        texto: "Situação atual: " + (corrida.status || "não informado") + "."
    };

    if (tituloCorridaAtual) {
        tituloCorridaAtual.textContent = info.titulo;
    }

    if (textoCorridaAtual) {
        const detalhes = [];

        if (corrida.origem) detalhes.push("Origem: " + corrida.origem);
        if (corrida.destino) detalhes.push("Destino: " + corrida.destino);

        if (corrida.valor_final !== null && corrida.valor_final !== undefined) {
            detalhes.push(
                "Valor final: R$ " +
                Number(corrida.valor_final).toLocaleString("pt-BR", {
                    minimumFractionDigits: 2,
                    maximumFractionDigits: 2
                })
            );
        }

        textoCorridaAtual.textContent =
            info.texto +
            (detalhes.length ? " " + detalhes.join(" | ") : "");
    }

    console.log(
        "Painel da corrida atualizado:",
        corrida.status,
        corrida.id
    );

    renderizarCancelamentoCorrida(corrida);
    atualizarEtapasVisuaisCorrida(corrida);
}

// PARAR A ESCUTA ANTERIOR
async function pararEscutaCorridas() {
    if (canalCorridasCliente && typeof supabaseClient !== "undefined") {
        await supabaseClient.removeChannel(canalCorridasCliente);
        canalCorridasCliente = null;
    }
}

// ACOMPANHAR ALTERAÇÕES DE UMA CORRIDA
async function acompanharCorrida(corridaId) {
    if (!corridaId || typeof supabaseClient === "undefined") return;

    await pararEscutaCorridas();
    corridaAtualClienteId = corridaId;

    canalCorridasCliente = supabaseClient
        .channel("cliente-corrida-" + corridaId)
        .on(
            "postgres_changes",
            {
                event: "UPDATE",
                schema: "public",
                table: "corridas",
                filter: "id=eq." + corridaId
            },
            (payload) => {
                console.log("Atualização recebida para a corrida:", payload.new);
                atualizarPainelCorrida(payload.new);
            }
        )
        .subscribe((status) => {
            console.log("Realtime da corrida do cliente:", status);
        });
}

// BUSCAR A CORRIDA MAIS RECENTE DO CLIENTE
async function carregarCorridaAtualCliente() {
    if (!usuarioClienteId || typeof supabaseClient === "undefined") return;

    try {
        const { data, error } = await supabaseClient
            .from("corridas")
            .select("*")
            .eq("cliente_id", usuarioClienteId)
            .order("created_at", { ascending: false })
            .limit(1)
            .maybeSingle();

        if (error) {
            console.error("Erro ao buscar corrida do cliente:", error);
            return;
        }

        if (!data) {
            if (tituloCorridaAtual) {
                tituloCorridaAtual.textContent = "Nenhuma corrida solicitada";
            }

            if (textoCorridaAtual) {
                textoCorridaAtual.textContent =
                    "Quando você solicitar uma corrida, o acompanhamento aparecerá nesta área.";
            }

            return;
        }

        console.log("Corrida mais recente do cliente:", data);
        atualizarPainelCorrida(data);
        await acompanharCorrida(data.id);

    } catch (erro) {
        console.error("Erro ao carregar acompanhamento:", erro);
    }
}

// VERIFICAR USUÁRIO E INICIAR INTEGRAÇÃO
async function verificarCliente() {
    if (typeof supabaseClient === "undefined") {
        console.warn("Supabase não encontrado.");
        carregarCliente();
        return;
    }

    try {
        const { data, error } = await supabaseClient.auth.getSession();

        if (error) {
            console.error("Erro ao verificar sessão:", error);
            carregarCliente();
            return;
        }

        const sessao = data.session;

        if (!sessao) {
            console.warn("Nenhum usuário conectado.");
            carregarCliente();
            return;
        }

        const usuario = sessao.user;
        usuarioClienteId = usuario.id;

        const dadosUsuario = usuario.user_metadata || {};

        cliente.nome =
            dadosUsuario.nome ||
            dadosUsuario.name ||
            usuario.email?.split("@")[0] ||
            "Cliente";

        console.log("Cliente conectado:", usuario.id);
        carregarCliente();

        await carregarCorridaAtualCliente();

        // DETECTAR NOVAS CORRIDAS DO CLIENTE
        canalCorridasCliente = supabaseClient
            .channel("cliente-novas-corridas-" + usuario.id)
            .on(
                "postgres_changes",
                {
                    event: "INSERT",
                    schema: "public",
                    table: "corridas",
                    filter: "cliente_id=eq." + usuario.id
                },
                (payload) => {
                    console.log("Nova corrida detectada:", payload.new);
                    atualizarPainelCorrida(payload.new);
                    acompanharCorrida(payload.new.id);
                }
            )
            .subscribe((status) => {
                console.log("Escuta de novas corridas:", status);
            });

    } catch (erro) {
        console.error("Erro inesperado ao verificar cliente:", erro);
        carregarCliente();
    }
}

// BOTÃO SAIR
if (btnSairTopo) {
    btnSairTopo.addEventListener("click", async function (event) {
        event.preventDefault();

        if (typeof supabaseClient === "undefined") {
            localStorage.removeItem("tipoAcesso");
            localStorage.removeItem("usuarioId");
            localStorage.removeItem("corridaAtual");
            window.location.href = "index.html";
            return;
        }

        try {
            const { error } = await supabaseClient.auth.signOut();

            if (error) console.error("Erro ao sair:", error);

            localStorage.removeItem("tipoAcesso");
            localStorage.removeItem("usuarioId");
            localStorage.removeItem("corridaAtual");

            window.location.href = "index.html";

        } catch (erro) {
            console.error("Erro ao sair:", erro);
            window.location.href = "index.html";
        }
    });
}

// ============================================================
// HISTÓRICO DE CORRIDAS
// ============================================================

let modalHistoricoCorridas = null;

// PROTEGER O HTML DOS DADOS EXIBIDOS
function escaparHtmlHistorico(valor) {
    return String(valor ?? "")
        .replace(/&/g, "&amp;")
        .replace(/</g, "&lt;")
        .replace(/>/g, "&gt;")
        .replace(/"/g, "&quot;")
        .replace(/'/g, "&#039;");
}

// FORMATAR DATA
function formatarDataHistorico(data) {
    if (!data) return "Data não informada";

    const dataObj = new Date(data);

    if (Number.isNaN(dataObj.getTime())) {
        return "Data não informada";
    }

    return dataObj.toLocaleString("pt-BR", {
        day: "2-digit",
        month: "2-digit",
        year: "numeric",
        hour: "2-digit",
        minute: "2-digit"
    });
}

// FORMATAR VALOR
function formatarValorHistorico(valor) {
    if (valor === null || valor === undefined || valor === "") {
        return "Valor não informado";
    }

    const numero = Number(valor);

    if (!Number.isFinite(numero)) {
        return "Valor não informado";
    }

    return numero.toLocaleString("pt-BR", {
        style: "currency",
        currency: "BRL"
    });
}

// TRADUZIR STATUS
function nomeStatusHistorico(status) {
    const nomes = {
        aguardando: "Aguardando motorista",
        aceita: "Aceita",
        motorista_a_caminho: "Motorista a caminho",
        chegou: "Motorista chegou",
        em_andamento: "Em andamento",
        aguardando_pagamento: "Aguardando pagamento",
        concluida: "Concluída",
        cancelada: "Cancelada",
        recusada: "Recusada"
    };

    return nomes[status] || status || "Não informado";
}

// CRIAR JANELA DO HISTÓRICO
function criarModalHistorico() {
    if (modalHistoricoCorridas) return modalHistoricoCorridas;

    modalHistoricoCorridas = document.createElement("div");
    modalHistoricoCorridas.id = "modalHistoricoCorridas";
    modalHistoricoCorridas.setAttribute("role", "dialog");
    modalHistoricoCorridas.setAttribute("aria-modal", "true");
    modalHistoricoCorridas.setAttribute("aria-labelledby", "tituloModalHistorico");

    Object.assign(modalHistoricoCorridas.style, {
        position: "fixed",
        inset: "0",
        zIndex: "99999",
        background: "rgba(0,0,0,0.78)",
        display: "none",
        alignItems: "center",
        justifyContent: "center",
        padding: "20px",
        boxSizing: "border-box"
    });

    modalHistoricoCorridas.innerHTML = `
        <div style="width:100%;max-width:760px;max-height:85vh;overflow:auto;background:#111;color:#fff;border:1px solid #333;border-radius:14px;padding:22px;box-sizing:border-box;font-family:Poppins,sans-serif;">
            <div style="display:flex;align-items:center;justify-content:space-between;gap:12px;margin-bottom:18px;">
                <h2 id="tituloModalHistorico" style="margin:0;font-size:22px;">Histórico de Corridas</h2>
                <button type="button" id="fecharModalHistorico" aria-label="Fechar histórico" style="border:0;background:transparent;color:#FFD400;font-size:28px;cursor:pointer;">&times;</button>
            </div>
            <div id="conteudoHistoricoCorridas">
                <p style="color:#ccc;">Carregando suas corridas...</p>
            </div>
        </div>
    `;

    document.body.appendChild(modalHistoricoCorridas);

    // FECHAR CLICANDO FORA DA JANELA
    modalHistoricoCorridas.addEventListener("click", function (event) {
        if (event.target === modalHistoricoCorridas) {
            modalHistoricoCorridas.style.display = "none";
        }
    });

    // BOTÃO FECHAR
    modalHistoricoCorridas
        .querySelector("#fecharModalHistorico")
        .addEventListener("click", function () {
            modalHistoricoCorridas.style.display = "none";
        });

    // FECHAR COM ESC
    document.addEventListener("keydown", function (event) {
        if (
            event.key === "Escape" &&
            modalHistoricoCorridas
        ) {
            modalHistoricoCorridas.style.display = "none";
        }
    });

    return modalHistoricoCorridas;
}

// MOSTRAR AS CORRIDAS NA JANELA
function renderizarHistoricoCorridas(corridas) {
    const conteudo = document.getElementById("conteudoHistoricoCorridas");

    if (!conteudo) return;

    if (!corridas || corridas.length === 0) {
        conteudo.innerHTML = `
            <div style="padding:22px 12px;text-align:center;color:#ccc;">
                <p style="font-size:18px;margin:0 0 8px;">
                    Você ainda não tem corridas no histórico.
                </p>
                <p style="margin:0;">
                    As corridas que você solicitar aparecerão aqui.
                </p>
            </div>
        `;
        return;
    }

    conteudo.innerHTML = corridas.map(function (corrida) {
        const origem = escaparHtmlHistorico(
            corrida.origem || "Não informada"
        );

        const destino = escaparHtmlHistorico(
            corrida.destino || "Não informado"
        );

        const status = escaparHtmlHistorico(
            nomeStatusHistorico(corrida.status)
        );

        const data = escaparHtmlHistorico(
            formatarDataHistorico(corrida.created_at)
        );

        const valor = escaparHtmlHistorico(
            formatarValorHistorico(corrida.valor_final)
        );

        return `
            <article style="background:#1b1b1b;border:1px solid #333;border-radius:10px;padding:16px;margin-bottom:12px;">
                <div style="display:flex;justify-content:space-between;align-items:flex-start;gap:12px;flex-wrap:wrap;margin-bottom:10px;">
                    <strong style="color:#FFD400;">${data}</strong>
                    <span style="background:#292929;border-radius:20px;padding:5px 10px;font-size:13px;">
                        ${status}
                    </span>
                </div>

                <p style="margin:7px 0;overflow-wrap:anywhere;">
                    <strong>Origem:</strong> ${origem}
                </p>

                <p style="margin:7px 0;overflow-wrap:anywhere;">
                    <strong>Destino:</strong> ${destino}
                </p>

                <p style="margin:10px 0 0;color:#FFD400;font-weight:600;">
                    <strong>Valor:</strong> ${valor}
                </p>
            </article>
        `;
    }).join("");
}

// BUSCAR HISTÓRICO NO SUPABASE
async function carregarHistoricoCorridas() {
    const modal = criarModalHistorico();
    modal.style.display = "flex";

    const conteudo = document.getElementById("conteudoHistoricoCorridas");

    conteudo.innerHTML =
        '<p style="color:#ccc;">Carregando suas corridas...</p>';

    if (typeof supabaseClient === "undefined") {
        conteudo.innerHTML = `
            <p style="color:#ffb3b3;">
                Não foi possível conectar ao banco de dados.
                Recarregue a página e tente novamente.
            </p>
        `;

        console.error("Histórico: supabaseClient não encontrado.");
        return;
    }

    try {
        // GARANTIR QUE O CLIENTE ESTÁ IDENTIFICADO
        if (!usuarioClienteId) {
            const { data: sessaoData, error: sessaoErro } =
                await supabaseClient.auth.getSession();

            if (sessaoErro) throw sessaoErro;

            usuarioClienteId = sessaoData.session?.user?.id || null;
        }

        if (!usuarioClienteId) {
            conteudo.innerHTML = `
                <p style="color:#ffb3b3;">
                    Entre na sua conta para consultar o histórico de corridas.
                </p>
            `;
            return;
        }

        // BUSCAR SOMENTE AS CORRIDAS DO CLIENTE CONECTADO
        const { data, error } = await supabaseClient
            .from("corridas")
            .select("*")
            .eq("cliente_id", usuarioClienteId)
            .order("created_at", { ascending: false });

        if (error) throw error;

        console.log("Histórico de corridas carregado:", data);

        renderizarHistoricoCorridas(data || []);

        if (totalCorridas) {
            totalCorridas.textContent = String((data || []).length);
        }

    } catch (erro) {
        console.error("Erro ao carregar histórico de corridas:", erro);

        conteudo.innerHTML = `
            <div style="color:#ffb3b3;">
                <p>Não foi possível carregar seu histórico.</p>
                <p style="font-size:13px;overflow-wrap:anywhere;">
                    ${escaparHtmlHistorico(
                        erro.message ||
                        "Verifique a conexão e as permissões do Supabase."
                    )}
                </p>
            </div>
        `;
    }
}

// BOTÃO HISTÓRICO
if (btnHistorico) {
    btnHistorico.addEventListener("click", function (event) {
        event.preventDefault();
        carregarHistoricoCorridas();
    });
}

// BOTÃO AVALIAÇÕES
if (btnAvaliacoes) {
    btnAvaliacoes.addEventListener("click", function () {
        alert("Suas avaliações serão disponibilizadas aqui.");
    });
}

// INICIALIZAÇÃO
document.addEventListener("DOMContentLoaded", function () {
    carregarCliente();
    verificarCliente();
});

// LIMPAR CANAIS AO SAIR DA PÁGINA
window.addEventListener("beforeunload", function () {
    if (canalCorridasCliente && typeof supabaseClient !== "undefined") {
        supabaseClient.removeChannel(canalCorridasCliente);
    }
});

// ============================================================
// CANCELAMENTO DA CORRIDA
// ============================================================

function renderizarCancelamentoCorrida(corrida) {
    const area = document.getElementById("areaCancelarCorrida");

    if (!area) return;

    if (intervaloCancelamento) {
        clearInterval(intervaloCancelamento);
        intervaloCancelamento = null;
    }

    area.innerHTML = "";

    if (
        !corrida ||
        corrida.status !== "aguardando" ||
        !corrida.created_at
    ) {
        return;
    }

    const prazoFinal =
        new Date(corrida.created_at).getTime() + 3 * 60 * 1000;

    function atualizarContagem() {
        const restante = prazoFinal - Date.now();

        if (restante <= 0) {
            clearInterval(intervaloCancelamento);
            intervaloCancelamento = null;
            area.innerHTML = "";
            return;
        }

        const minutos = Math.floor(restante / 60000);
        const segundos = Math.floor((restante % 60000) / 1000);

        const tempo = document.getElementById("tempoCancelarCorrida");

        if (tempo) {
            tempo.textContent =
                String(minutos).padStart(2, "0") + ":" +
                String(segundos).padStart(2, "0");
        }
    }

    area.innerHTML = `
        <div class="cancelamento-corrida">
            <p>
                <i class="fa-solid fa-clock"></i>
                Tempo para cancelar:
                <strong id="tempoCancelarCorrida">03:00</strong>
            </p>

            <button
                type="button"
                class="btn btn-cancelar-corrida"
                id="btnCancelarCorrida"
            >
                <i class="fa-solid fa-xmark"></i>
                Cancelar corrida
            </button>
        </div>
    `;

    atualizarContagem();

    intervaloCancelamento = setInterval(atualizarContagem, 1000);

    document.getElementById("btnCancelarCorrida")
        .addEventListener("click", async function () {
            const confirmar = confirm(
                "Tem certeza de que deseja cancelar esta corrida?"
            );

            if (!confirmar) return;

            const botao = this;
            botao.disabled = true;
            botao.textContent = "Cancelando...";

            try {
                const { data, error } = await supabaseClient.rpc(
                    "cancelar_corrida_cliente",
                    { p_corrida_id: corrida.id }
                );

                if (error) throw error;

                console.log("Cancelamento confirmado:", data);

                atualizarPainelCorrida({
                    ...corrida,
                    status: "cancelada"
                });

            } catch (erro) {
                console.error("Erro ao cancelar corrida:", erro);

                alert(
                    erro.message ||
                    "Não foi possível cancelar. O prazo pode ter terminado ou o motorista já ter aceitado."
                );

                botao.disabled = false;

                botao.innerHTML =
                    '<i class="fa-solid fa-xmark"></i> Cancelar corrida';

                await carregarCorridaAtualCliente();
            }
        });
}

// ============================================================
// ATUALIZAR ETAPAS VISUAIS DA CORRIDA
// ============================================================

function atualizarEtapasVisuaisCorrida(corrida) {
    if (!corrida) return;

    const etapas = Array.from(
        document.querySelectorAll(".etapa-corrida")
    );

    const linhas = Array.from(
        document.querySelectorAll(".linha-etapa")
    );

    const statusTexto = document.getElementById(
        "statusVisualCorrida"
    );

    const carrinho = document.getElementById(
        "carrinhoRota"
    );

    const status = corrida.status;

    const ordemStatus = {
        aguardando: 0,
        aceita: 1,
        motorista_a_caminho: 2,
        chegou: 3,
        em_andamento: 3,
        aguardando_pagamento: 4,
        concluida: 4
    };

    const textosStatus = {
        aguardando: "Aguardando motorista",
        aceita: "Motorista confirmou a corrida",
        motorista_a_caminho: "Motorista a caminho",
        chegou: "Motorista chegou à origem",
        em_andamento: "Corrida em andamento",
        aguardando_pagamento: "Aguardando pagamento",
        concluida: "Corrida concluída",
        cancelada: "Corrida cancelada",
        recusada: "Solicitação recusada"
    };

    const indiceAtual = ordemStatus[status];

    etapas.forEach(function (etapa, indice) {
        etapa.classList.remove("atual", "concluida");

        if (indiceAtual === undefined) return;

        if (indice < indiceAtual) {
            etapa.classList.add("concluida");
        } else if (indice === indiceAtual) {
            etapa.classList.add("atual");
        }
    });

    linhas.forEach(function (linha, indice) {
        linha.classList.toggle(
            "concluida",
            indiceAtual !== undefined && indice < indiceAtual
        );
    });

    if (statusTexto) {
        statusTexto.textContent =
            textosStatus[status] || "Acompanhando corrida";
    }

    if (carrinho) {
        const posicoes = {
            aguardando: { left: "15%", top: "53%" },
            aceita: { left: "27%", top: "48%" },
            motorista_a_caminho: { left: "40%", top: "43%" },
            chegou: { left: "48%", top: "42%" },
            em_andamento: { left: "65%", top: "35%" },
            aguardando_pagamento: { left: "78%", top: "28%" },
            concluida: { left: "82%", top: "25%" }
        };

        const posicao = posicoes[status];

        if (posicao) {
            carrinho.style.left = posicao.left;
            carrinho.style.top = posicao.top;
        }
    }

    const painel = document.getElementById(
        "progressoCorrida"
    );

    if (painel) {
        painel.style.display =
            status === "cancelada" || status === "recusada"
                ? "none"
                : "flex";
    }

    console.log(
        "Etapas visuais atualizadas:",
        status
    );
}

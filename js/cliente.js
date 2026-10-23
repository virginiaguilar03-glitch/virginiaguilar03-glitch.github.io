
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

         // Detectar novas corridas do próprio cliente.
         // A inscrição UPDATE da corrida será refeita após nova solicitação.
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

 // BOTÃO HISTÓRICO
 if (btnHistorico) {
     btnHistorico.addEventListener("click", function () {
         alert("O histórico de corridas será disponibilizado aqui.");
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


function renderizarCancelamentoCorrida(corrida) {
    const area = document.getElementById("areaCancelarCorrida");

    if (!area) return;

    if (intervaloCancelamento) {
        clearInterval(intervaloCancelamento);
        intervaloCancelamento = null;
    }

    area.innerHTML = "";

    if (!corrida || corrida.status !== "aguardando" || !corrida.created_at) {
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

            <button type="button" class="btn btn-cancelar-corrida"
                    id="btnCancelarCorrida">
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

                // Consultar o estado real antes de permitir nova tentativa.
                await carregarCorridaAtualCliente();
            }
        });
}

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

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
    const elemento = document.getElementById(id);

    if (elemento) {
        elemento.textContent =
            valor || "Não informado";
    }
}


// ============================================================
// MOSTRAR DADOS DO PARCEIRO
// ============================================================

function carregarDadosParceiro() {
    preencherElemento("nomeParceiro", parceiro.nome);
    preencherElemento("perfilNome", parceiro.nome);
    preencherElemento("perfilEmail", parceiro.email);
    preencherElemento("perfilTelefone", parceiro.telefone);

    preencherElemento("corridasHoje", parceiro.corridasHoje);
    preencherElemento("corridasMes", parceiro.corridasMes);

    preencherElemento(
        "ganhosHoje",
        formatarMoeda(parceiro.ganhosHoje)
    );

    preencherElemento(
        "ganhosMes",
        formatarMoeda(parceiro.ganhosMes)
    );

    preencherElemento(
        "notaMotorista",
        Number(parceiro.avaliacao || 0).toFixed(1)
    );

    preencherElemento("veiculoMarca", parceiro.marca);
    preencherElemento("veiculoModelo", parceiro.modelo);
    preencherElemento("veiculoCor", parceiro.cor);
    preencherElemento("veiculoAno", parceiro.ano);
    preencherElemento("veiculoPlaca", parceiro.placa);
    preencherElemento("veiculoPassageiros", parceiro.passageiros);

    console.log("Dados completos do parceiro:", parceiro);
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

        const {
            data: motorista,
            error
        } = await supabaseClient
            .from("motoristas")
            .select("*")
            .eq("id", usuarioId)
            .maybeSingle();

        if (error) {
            console.error(
                "Erro ao buscar dados do motorista:",
                error
            );
            return;
        }

        if (!motorista) {
            console.warn(
                "Nenhum registro encontrado na tabela motoristas para este usuário."
            );
            return;
        }

        console.log("Motorista encontrado:", motorista);

        if (typeof atualizarVisualStatus === "function") {
            atualizarVisualStatus(
                motorista.disponivel === true
            );
        }

        parceiro.marca =
            motorista.marca || "Não informado";

        parceiro.modelo =
            motorista.modelo || "Não informado";

        parceiro.cor =
            motorista.cor || "Não informado";

        parceiro.ano =
            motorista.ano || "Não informado";

        parceiro.placa =
            motorista.placa || "Não informado";

        parceiro.passageiros =
            motorista.quantidade_assentos || "Não informado";

        carregarDadosParceiro();

    } catch (erro) {
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
        lista.innerHTML =
            "<p>Não foi possível carregar as corridas.</p>";
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
        const {
            data: nomeCliente,
            error: erroNome
        } = await supabaseClient.rpc(
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
        origem.textContent =
            "Origem: " + (corrida.origem || "Não informada");

        const destino = document.createElement("p");
        destino.textContent =
            "Destino: " + (corrida.destino || "Não informado");

        card.append(titulo, origem, destino);

        if (corrida.observacao) {
            const observacao = document.createElement("p");
            observacao.textContent =
                "Observação: " + corrida.observacao;
            card.appendChild(observacao);
        }

        const cliente = document.createElement("p");
        cliente.textContent =
            "Cliente: " + corrida.nome_cliente;
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


// ============================================================
// OUVIR NOVAS CORRIDAS
// ============================================================

function ouvirNovasCorridas(motoristaId) {
    console.log(
        "Iniciando escuta de novas corridas para:",
        motoristaId
    );

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
            payload => {
                console.log("NOVA CORRIDA RECEBIDA:", payload);
                carregarCorridasDoMotorista(motoristaId);
            }
        )
        .subscribe(status => {
            console.log("Status do canal de corridas:", status);
        });

    return canal;
}


// ============================================================
// VERIFICAR SESSÃO
// ============================================================

async function verificarSessaoParceiro() {
    if (
        typeof supabaseClient === "undefined" ||
        !supabaseClient
    ) {
        console.error("supabaseClient não encontrado.");
        return;
    }

    try {
        const {
            data,
            error
        } = await supabaseClient.auth.getSession();

        if (error) {
            console.error("Erro ao verificar sessão:", error);
            return;
        }

        const sessao = data.session;

        if (!sessao) {
            console.warn("Nenhum parceiro está logado.");
            window.location.href = "login.html";
            return;
        }

        const usuario = sessao.user;

        parceiro.id = usuario.id;

        console.log("ID do usuário logado:", usuario.id);

        const metadata = usuario.user_metadata || {};

        parceiro.nome =
            metadata.nome || "Parceiro VaidTáxi";

        parceiro.telefone =
            metadata.telefone || "Telefone não informado";

        parceiro.email =
            usuario.email || "E-mail não informado";

        const tipoAcesso = localStorage.getItem("tipoAcesso");

        if (tipoAcesso && tipoAcesso !== "parceiro") {
            console.warn("Usuário logado não é parceiro.");
            window.location.href = "login.html";
            return;
        }

        carregarDadosParceiro();

        await carregarDadosMotorista(usuario.id);
        await carregarCorridasDoMotorista(usuario.id);

        ouvirNovasCorridas(usuario.id);

        // Iniciar o painel de andamento da corrida.
        await carregarPainelCorridaAtiva(usuario.id);
        ouvirAtualizacoesCorridaMotorista(usuario.id);

        console.log(
            "Parceiro carregado completamente:",
            parceiro
        );

    } catch (erro) {
        console.error("Erro inesperado:", erro);
    }
}


// ============================================================
// LOGOUT
// ============================================================

async function sairParceiro() {
    console.log("Iniciando logout do parceiro...");

    localStorage.removeItem("usuarioId");
    localStorage.removeItem("tipoAcesso");

    if (
        typeof supabaseClient !== "undefined" &&
        supabaseClient
    ) {
        try {
            const { error } = await supabaseClient.auth.signOut();

            if (error) {
                console.error("Erro ao sair do Supabase:", error);
            }
        } catch (erro) {
            console.error(
                "Erro inesperado durante logout:",
                erro
            );
        }
    }

    console.log("Logout concluído. Redirecionando para login...");

    window.location.replace("login.html");
}


// ============================================================
// ATUALIZAR STATUS DA CORRIDA
// ============================================================

async function atualizarStatusCorrida(corridaId, novoStatus) {
    const {
        data: usuarioData,
        error: erroUsuario
    } = await supabaseClient.auth.getUser();

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
        alert(
            "Não foi possível atualizar a corrida. Verifique as permissões."
        );
        return;
    }

    if (!data || data.length === 0) {
        alert(
            "A corrida não está mais disponível ou você não tem permissão."
        );
        await carregarCorridasDoMotorista(usuario.id);
        return;
    }

    alert(
        novoStatus === "aceita"
            ? "Corrida aceita com sucesso!"
            : "Corrida recusada."
    );

    await carregarCorridasDoMotorista(usuario.id);
    await carregarPainelCorridaAtiva(usuario.id);
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

document.addEventListener("DOMContentLoaded", function () {
    verificarSessaoParceiro();
});


// ============================================================
// CONFIGURAÇÕES DO PARCEIRO
// ============================================================

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
            parceiro.email === "E-mail não informado"
                ? ""
                : parceiro.email;

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

        if (mensagemConfiguracoes) {
            mensagemConfiguracoes.textContent = "";
        }

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

        if (mensagemConfiguracoes) {
            mensagemConfiguracoes.textContent = "";
        }
    });
}


// Salvar configurações
if (formConfiguracoesParceiro) {
    formConfiguracoesParceiro.addEventListener(
        "submit",
        async function (event) {
            event.preventDefault();

            if (!parceiro.id) {
                mensagemConfiguracoes.textContent =
                    "Não foi possível identificar sua conta. Entre novamente.";
                return;
            }

            const nome =
                document.getElementById("configNome").value.trim();

            const telefone =
                document.getElementById("configTelefone").value.trim();

            const marca =
                document.getElementById("configMarca").value.trim();

            const modelo =
                document.getElementById("configModelo").value.trim();

            const cor =
                document.getElementById("configCor").value.trim();

            const ano =
                Number(document.getElementById("configAno").value);

            const placa =
                document.getElementById("configPlaca").value
                    .trim()
                    .toUpperCase();

            const passageiros =
                Number(
                    document.getElementById("configPassageiros").value
                );

            const btnSalvar =
                document.getElementById("btnSalvarConfiguracoes");

            btnSalvar.disabled = true;
            btnSalvar.textContent = "Salvando...";
            mensagemConfiguracoes.textContent = "";

            try {
                const {
                    data: motoristaAtualizado,
                    error: erroVeiculo
                } = await supabaseClient
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

                const {
                    data: usuarioAtualizado,
                    error: erroPerfil
                } = await supabaseClient.auth.updateUser({
                    data: {
                        nome: nome,
                        telefone: telefone
                    }
                });

                if (erroPerfil) {
                    throw erroPerfil;
                }

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
        }
    );
}


// ============================================================
// PAINEL DE ANDAMENTO E FINALIZAÇÃO DA CORRIDA
// ============================================================

let canalAtualizacoesCorridaParceiro = null;


async function carregarPainelCorridaAtiva(motoristaId) {
    const lista = document.getElementById("listaCorridas");

    if (!lista) {
        console.error("Elemento #listaCorridas não encontrado.");
        return;
    }

    let painel = document.getElementById("painelCorridaAtiva");

    if (!painel) {
        painel = document.createElement("section");
        painel.id = "painelCorridaAtiva";
        painel.className = "painel-bloco";
        lista.parentElement.insertBefore(painel, lista);
    }

    const { data: corrida, error } = await supabaseClient
        .from("corridas")
        .select(`
            id,
            origem,
            destino,
            status,
            valor_final,
            cliente_id,
            motorista_id,
            motorista_confirmou_finalizacao,
            cliente_confirmou_finalizacao,
            created_at
        `)
        .eq("motorista_id", motoristaId)
        .in("status", [
            "aceita",
            "motorista_a_caminho",
            "chegou",
            "em_andamento",
            "aguardando_pagamento"
        ])
        .order("created_at", { ascending: false })
        .limit(1)
        .maybeSingle();

    if (error) {
        console.error("Erro ao carregar corrida ativa:", error);

        painel.innerHTML = `
            <h3>Corrida em andamento</h3>
            <p>Não foi possível carregar os dados da corrida.</p>
        `;
        return;
    }

    if (!corrida) {
        painel.innerHTML = `
            <h3>Controle da corrida</h3>
            <p>Nenhuma corrida ativa no momento.</p>
        `;
        return;
    }

    const etapas = {
        aceita: {
            texto: "Corrida aceita",
            proximo: "motorista_a_caminho",
            botao: "Iniciar deslocamento"
        },
        motorista_a_caminho: {
            texto: "A caminho do cliente",
            proximo: "chegou",
            botao: "Cheguei ao local"
        },
        chegou: {
            texto: "Motorista chegou",
            proximo: "em_andamento",
            botao: "Iniciar corrida"
        },
        em_andamento: {
            texto: "Corrida em andamento"
        },
        aguardando_pagamento: {
            texto: "Aguardando confirmação do cliente"
        }
    };

    const etapa =
        etapas[corrida.status] || { texto: corrida.status };

    const origem =
        escaparTextoParceiro(corrida.origem || "Não informada");

    const destino =
        escaparTextoParceiro(corrida.destino || "Não informado");

    let controles = "";

    if (corrida.status === "em_andamento") {
        controles = `
            <label for="valorFinalCorridaMotorista">
                Valor final da corrida (R$)
            </label>

            <input
                id="valorFinalCorridaMotorista"
                type="number"
                min="0.01"
                step="0.01"
                value="${Number(corrida.valor_final || 0) || ""}"
                placeholder="Ex.: 25,00"
                style="max-width:220px"
            >

            <button
                type="button"
                id="btnFinalizarCorridaMotorista"
            >
                Finalizar corrida e confirmar
            </button>
        `;
    } else if (corrida.status === "aguardando_pagamento") {
        controles = `
            <p>
                Confirmação do motorista:
                <strong>
                    ${corrida.motorista_confirmou_finalizacao
                        ? "Confirmada"
                        : "Pendente"}
                </strong>
            </p>

            <p>
                Confirmação do cliente:
                <strong>
                    ${corrida.cliente_confirmou_finalizacao
                        ? "Confirmada"
                        : "Aguardando"}
                </strong>
            </p>

            <p>
                ${corrida.cliente_confirmou_finalizacao
                    ? "As duas confirmações foram registradas."
                    : "Sua confirmação foi registrada. A corrida será concluída quando o cliente confirmar."}
            </p>
        `;
    } else if (etapa.proximo) {
        controles = `
            <button
                type="button"
                id="btnAvancarEtapaCorrida"
            >
                ${etapa.botao}
            </button>
        `;
    }

    painel.innerHTML = `
        <h3>Controle da corrida</h3>

        <p>
            <strong>Status:</strong>
            ${etapa.texto}
        </p>

        <p>
            <strong>Origem:</strong>
            ${origem}
        </p>

        <p>
            <strong>Destino:</strong>
            ${destino}
        </p>

        ${corrida.valor_final != null
            ? `<p><strong>Valor final:</strong> ${formatarMoeda(corrida.valor_final)}</p>`
            : ""}

        <div class="acoes-corrida">
            ${controles}
        </div>
    `;


    // --------------------------------------------------------
    // AVANÇAR ETAPA DA CORRIDA
    // --------------------------------------------------------

    const botaoAvancar =
        document.getElementById("btnAvancarEtapaCorrida");

    if (botaoAvancar) {
        botaoAvancar.addEventListener("click", async () => {
            botaoAvancar.disabled = true;

            try {
                const {
                    data,
                    error: erroAtualizacao
                } = await supabaseClient
                    .from("corridas")
                    .update({
                        status: etapa.proximo
                    })
                    .eq("id", corrida.id)
                    .eq("motorista_id", motoristaId)
                    .eq("status", corrida.status)
                    .select("id, status");

                if (erroAtualizacao) {
                    throw erroAtualizacao;
                }

                if (!data || data.length === 0) {
                    throw new Error(
                        "A corrida foi atualizada em outra tela. Atualize o painel."
                    );
                }

                console.log(
                    "Etapa da corrida atualizada:",
                    data[0]
                );

                await carregarPainelCorridaAtiva(motoristaId);
                await carregarCorridasDoMotorista(motoristaId);

            } catch (erro) {
                console.error(
                    "Erro ao avançar etapa da corrida:",
                    erro
                );

                alert(
                    erro.message ||
                    "Não foi possível atualizar a etapa da corrida."
                );

                await carregarPainelCorridaAtiva(motoristaId);
            }
        });
    }


    // --------------------------------------------------------
    // CONFIRMAR FINALIZAÇÃO PELO MOTORISTA
    // --------------------------------------------------------

    const botaoFinalizar =
        document.getElementById("btnFinalizarCorridaMotorista");

    if (botaoFinalizar) {
        botaoFinalizar.addEventListener("click", async () => {
            const campo =
                document.getElementById("valorFinalCorridaMotorista");

            const valor = Number(campo?.value);

            if (!Number.isFinite(valor) || valor <= 0) {
                alert("Informe um valor final maior que zero.");
                campo?.focus();
                return;
            }

            botaoFinalizar.disabled = true;
            botaoFinalizar.textContent = "Confirmando...";

            try {
                // Buscar novamente o estado atual no Supabase.
                const {
                    data: corridaAtual,
                    error: erroConsulta
                } = await supabaseClient
                    .from("corridas")
                    .select(`
                        id,
                        status,
                        motorista_id,
                        motorista_confirmou_finalizacao,
                        cliente_confirmou_finalizacao
                    `)
                    .eq("id", corrida.id)
                    .eq("motorista_id", motoristaId)
                    .maybeSingle();

                if (erroConsulta) {
                    throw erroConsulta;
                }

                if (!corridaAtual) {
                    throw new Error(
                        "Não foi possível localizar esta corrida."
                    );
                }

                if (corridaAtual.status !== "em_andamento") {
                    throw new Error(
                        "Esta corrida não está mais em andamento."
                    );
                }

                // A corrida só conclui quando os dois confirmam.
                const ambosConfirmaram =
                    corridaAtual.cliente_confirmou_finalizacao === true;

                const {
                    data: atualizada,
                    error: erroAtualizacao
                } = await supabaseClient
                    .from("corridas")
                    .update({
                        valor_final: valor,
                        motorista_confirmou_finalizacao: true,
                        status: ambosConfirmaram
                            ? "concluida"
                            : "aguardando_pagamento"
                    })
                    .eq("id", corrida.id)
                    .eq("motorista_id", motoristaId)
                    .eq("status", "em_andamento")
                    .select(`
                        id,
                        status,
                        valor_final,
                        motorista_confirmou_finalizacao,
                        cliente_confirmou_finalizacao
                    `);

                if (erroAtualizacao) {
                    throw erroAtualizacao;
                }

                if (!atualizada || atualizada.length === 0) {
                    throw new Error(
                        "A corrida mudou durante a atualização. Atualize o painel e tente novamente."
                    );
                }

                console.log(
                    "Confirmação de finalização registrada:",
                    atualizada[0]
                );

                alert(
                    atualizada[0].status === "concluida"
                        ? "Corrida concluída! Motorista e cliente confirmaram."
                        : "Sua confirmação foi registrada. A corrida será concluída quando o cliente confirmar."
                );

                await carregarPainelCorridaAtiva(motoristaId);
                await carregarCorridasDoMotorista(motoristaId);

                if (
                    typeof carregarHistoricoCorridasMotorista ===
                    "function"
                ) {
                    await carregarHistoricoCorridasMotorista(
                        motoristaId
                    );
                }

                if (
                    typeof atualizarIndicadoresMotorista ===
                    "function"
                ) {
                    await atualizarIndicadoresMotorista(
                        motoristaId
                    );
                }

            } catch (erro) {
                console.error(
                    "Erro ao confirmar finalização da corrida:",
                    erro
                );

                alert(
                    erro.message ||
                    "Não foi possível confirmar a finalização."
                );

                await carregarPainelCorridaAtiva(motoristaId);
            }
        });
    }
}


// ============================================================
// ESCAPAR TEXTO PARA EXIBIÇÃO NO PAINEL
// ============================================================

function escaparTextoParceiro(valor) {
    return String(valor).replace(/[&<>"']/g, caractere => ({
        "&": "&amp;",
        "<": "&lt;",
        ">": "&gt;",
        '"': "&quot;",
        "'": "&#39;"
    }[caractere]));
}


// ============================================================
// OUVIR ATUALIZAÇÕES DA CORRIDA EM TEMPO REAL
// ============================================================

function ouvirAtualizacoesCorridaMotorista(motoristaId) {
    if (canalAtualizacoesCorridaParceiro) {
        supabaseClient.removeChannel(
            canalAtualizacoesCorridaParceiro
        );
    }

    canalAtualizacoesCorridaParceiro = supabaseClient
        .channel(`atualizacoes-corrida-parceiro-${motoristaId}`)
        .on(
            "postgres_changes",
            {
                event: "UPDATE",
                schema: "public",
                table: "corridas",
                filter: `motorista_id=eq.${motoristaId}`
            },
            async payload => {
                console.log(
                    "Atualização da corrida recebida em tempo real:",
                    payload.new
                );

                await carregarPainelCorridaAtiva(motoristaId);
                await carregarCorridasDoMotorista(motoristaId);
            }
        )
        .subscribe(status => {
            console.log(
                "Canal de atualização da corrida:",
                status
            );
        });
}


// ============================================================
// INICIAR PAINEL DE ANDAMENTO
// ============================================================

document.addEventListener("DOMContentLoaded", async () => {
    try {
        const {
            data,
            error
        } = await supabaseClient.auth.getUser();

        if (error) {
            throw error;
        }

        if (!data?.user) {
            return;
        }

        await carregarPainelCorridaAtiva(data.user.id);
        ouvirAtualizacoesCorridaMotorista(data.user.id);

    } catch (erro) {
        console.error(
            "Erro ao iniciar painel de andamento da corrida:",
            erro
        );
    }
});

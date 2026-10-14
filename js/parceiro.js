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

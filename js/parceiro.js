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

    preencherElemento(
        "corridasHoje",
        parceiro.corridasHoje
    );

    preencherElemento(
        "corridasMes",
        parceiro.corridasMes
    );

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

        console.log(
            "Motorista encontrado:",
            motorista
        );

        atualizarVisualStatus(
            motorista.disponivel === true
        );

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
// Mostra solicitações aguardando e corridas aceitas.
// ============================================================

async function carregarCorridasDoMotorista(motoristaId) {

    const lista = document.getElementById("listaCorridas");

    if (!lista) {
        console.error(
            "Elemento #listaCorridas não encontrado."
        );

        return;
    }

    const {
        data: corridas,
        error
    } = await supabaseClient
        .from("corridas")
        .select("*")
        .eq("motorista_id", motoristaId)
        .in("status", ["aguardando", "aceita"])
        .order("created_at", { ascending: false });

    if (error) {
        console.error(
            "Erro ao buscar corridas:",
            error
        );

        lista.innerHTML =
            "<p>Não foi possível carregar as corridas.</p>";

        return;
    }

    if (!corridas || corridas.length === 0) {

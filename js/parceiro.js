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
// FUNÇÃO PARA COLOCAR TEXTO EM UM ELEMENTO
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
    // VEÍCULO
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
        // BUSCAR REGISTRO NA TABELA MOTORISTAS
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
        // ERRO
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
        // MOSTRAR NO CONSOLE
        // ----------------------------------------------------

        console.log(
            "Motorista encontrado:",
            motorista
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


        // ----------------------------------------------------
        // PASSAGEIROS
        //
        // Como ainda não vimos o nome exato dessa coluna,
        // verificamos algumas possibilidades.
        // ----------------------------------------------------

        parceiro.passageiros =
            motorista.passageiros ||
            motorista.num_passageiros ||
            motorista.numero_passageiros ||
            motorista.capacidade ||
            motorista.lugares ||
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


    if (
        typeof supabaseClient === "undefined"
    ) {

        localStorage.removeItem(
            "usuarioId"
        );

        localStorage.removeItem(
            "tipoAcesso"
        );

        window.location.href =
            "login.html";

        return;

    }


    try {


        const {
            error
        } =
            await supabaseClient.auth.signOut();


        if (error) {

            console.error(
                "Erro ao sair:",
                error
            );

            return;

        }


        // ----------------------------------------------------
        // LIMPAR DADOS LOCAIS
        // ----------------------------------------------------

        localStorage.removeItem(
            "usuarioId"
        );

        localStorage.removeItem(
            "tipoAcesso"
        );


        // ----------------------------------------------------
        // VOLTAR PARA LOGIN
        // ----------------------------------------------------

        window.location.href =
            "login.html";


    }

    catch (erro) {

        console.error(
            "Erro ao fazer logout:",
            erro
        );

    }

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

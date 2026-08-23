// ============================================================
// PAINEL DO PARCEIRO / TAXISTA - VAIDTÁXI
// Supabase
// ============================================================


// ============================================================
// ELEMENTOS
// ============================================================

const nomeParceiro = document.getElementById("nomeParceiro");

const perfilNome = document.getElementById("perfilNome");
const perfilEmail = document.getElementById("perfilEmail");
const perfilTelefone = document.getElementById("perfilTelefone");

const corridasHoje = document.getElementById("corridasHoje");
const corridasMes = document.getElementById("corridasMes");

const ganhosHoje = document.getElementById("ganhosHoje");
const ganhosMes = document.getElementById("ganhosMes");

const notaMotorista = document.getElementById("notaMotorista");


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

    avaliacao: 0

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
// MOSTRAR DADOS NO PAINEL
// ============================================================

function carregarDadosParceiro() {

    if (nomeParceiro) {

        nomeParceiro.textContent =
            parceiro.nome;

    }


    if (perfilNome) {

        perfilNome.textContent =
            parceiro.nome;

    }


    if (perfilEmail) {

        perfilEmail.textContent =
            parceiro.email;

    }


    if (perfilTelefone) {

        perfilTelefone.textContent =
            parceiro.telefone;

    }


    if (corridasHoje) {

        corridasHoje.textContent =
            parceiro.corridasHoje;

    }


    if (corridasMes) {

        corridasMes.textContent =
            parceiro.corridasMes;

    }


    if (ganhosHoje) {

        ganhosHoje.textContent =
            formatarMoeda(
                parceiro.ganhosHoje
            );

    }


    if (ganhosMes) {

        ganhosMes.textContent =
            formatarMoeda(
                parceiro.ganhosMes
            );

    }


    if (notaMotorista) {

        notaMotorista.textContent =
            Number(parceiro.avaliacao || 0).toFixed(1);

    }

}


// ============================================================
// VERIFICAR SESSÃO
// ============================================================

async function verificarSessaoParceiro() {

    // --------------------------------------------------------
    // Verificar Supabase
    // --------------------------------------------------------

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

        // ----------------------------------------------------
        // PEGAR USUÁRIO LOGADO
        // ----------------------------------------------------

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


        // ----------------------------------------------------
        // SEM LOGIN
        // ----------------------------------------------------

        if (!sessao) {

            console.warn(
                "Nenhum parceiro está logado."
            );

            window.location.href =
                "login.html";

            return;

        }


        // ----------------------------------------------------
        // USUÁRIO
        // ----------------------------------------------------

        const usuario =
            sessao.user;


        parceiro.id =
            usuario.id;


        // ----------------------------------------------------
        // METADADOS DO AUTH
        // ----------------------------------------------------

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


        // ----------------------------------------------------
        // VERIFICAR TIPO DE ACESSO
        // ----------------------------------------------------

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


        // ----------------------------------------------------
        // MOSTRAR DADOS
        // ----------------------------------------------------

        carregarDadosParceiro();


        console.log(
            "Parceiro carregado:",
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

        localStorage.removeItem("usuarioId");
        localStorage.removeItem("tipoAcesso");

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

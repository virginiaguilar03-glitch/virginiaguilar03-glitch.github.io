// ============================================================
// PAINEL DO PARCEIRO / TAXISTA - VAIDTÁXI
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
// DADOS TEMPORÁRIOS
// ============================================================
//
// Por enquanto não vamos buscar esses dados no banco.
// Quando voltarmos ao Supabase, substituiremos esta parte
// pelos dados reais do parceiro.
//
// ============================================================

const parceiro = {

    nome: "Parceiro VaidTáxi",

    email: "E-mail não informado",

    telefone: "Telefone não informado",

    corridasHoje: 0,

    corridasMes: 0,

    ganhosHoje: 0,

    ganhosMes: 0,

    avaliacao: 0.0

};


// ============================================================
// PREENCHER PAINEL
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
            parceiro.avaliacao.toFixed(1);

    }

}


// ============================================================
// FORMATAR VALORES EM REAIS
// ============================================================

function formatarMoeda(valor) {

    return Number(valor).toLocaleString(
        "pt-BR",
        {
            style: "currency",
            currency: "BRL"
        }
    );

}


// ============================================================
// VERIFICAR LOGIN
// ============================================================
//
// IMPORTANTE:
// Por enquanto esta função apenas verifica se existe
// uma sessão do Supabase.
//
// Quando fizermos a separação definitiva entre
// CLIENTE / PARCEIRO / ADMINISTRADOR, vamos acrescentar
// a validação da função do usuário.
//
// ============================================================

async function verificarSessaoParceiro() {

    if (
        typeof supabaseClient ===
        "undefined"
    ) {

        console.warn(
            "Supabase não encontrado. Modo de desenvolvimento ativado."
        );

        carregarDadosParceiro();

        return;

    }


    try {

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


        if (!sessao) {

            console.warn(
                "Nenhuma sessão encontrada."
            );

            /*
             * Durante o desenvolvimento vamos deixar
             * o painel abrir normalmente.
             *
             * Depois vamos ativar:
             *
             * window.location.href = "login.html";
             */

            carregarDadosParceiro();

            return;

        }


        console.log(
            "Parceiro conectado:",
            sessao.user
        );


        // ==============================================
        // DADOS DO USUÁRIO
        // ==============================================

        const dadosUsuario =
            sessao.user.user_metadata || {};


        if (dadosUsuario.nome) {

            parceiro.nome =
                dadosUsuario.nome;

        }


        if (dadosUsuario.telefone) {

            parceiro.telefone =
                dadosUsuario.telefone;

        }


        parceiro.email =
            sessao.user.email ||
            "E-mail não informado";


        carregarDadosParceiro();

    }

    catch (erro) {

        console.error(
            "Erro inesperado:",
            erro
        );

        carregarDadosParceiro();

    }

}


// ============================================================
// INICIAR PAINEL
// ============================================================

document.addEventListener(
    "DOMContentLoaded",
    function () {

        carregarDadosParceiro();

        verificarSessaoParceiro();

    }
);

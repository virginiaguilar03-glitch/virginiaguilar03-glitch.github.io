// ============================================================
// ÁREA DO CLIENTE - VAIDTÁXI
// ============================================================


// ============================================================
// ELEMENTOS
// ============================================================

const nomeCliente =
    document.getElementById("nomeCliente");

const totalCorridas =
    document.getElementById("totalCorridas");

const totalAvaliacoes =
    document.getElementById("totalAvaliacoes");

const motoristasFavoritos =
    document.getElementById("motoristasFavoritos");

const btnSairTopo =
    document.getElementById("btnSairTopo");

const btnHistorico =
    document.getElementById("btnHistorico");

const btnAvaliacoes =
    document.getElementById("btnAvaliacoes");


// ============================================================
// DADOS TEMPORÁRIOS
// ============================================================
//
// Por enquanto, como combinamos de deixar o banco para depois,
// os dados abaixo são apenas valores iniciais.
//
// Depois vamos substituir pelos dados reais do Supabase.
//
// ============================================================

const cliente = {

    nome: "Cliente",

    corridas: 0,

    avaliacoes: 0,

    favoritos: 0

};


// ============================================================
// CARREGAR DADOS DO CLIENTE
// ============================================================

function carregarCliente() {

    if (nomeCliente) {

        nomeCliente.textContent =
            cliente.nome;

    }


    if (totalCorridas) {

        totalCorridas.textContent =
            cliente.corridas;

    }


    if (totalAvaliacoes) {

        totalAvaliacoes.textContent =
            cliente.avaliacoes;

    }


    if (motoristasFavoritos) {

        motoristasFavoritos.textContent =
            cliente.favoritos;

    }

}


// ============================================================
// VERIFICAR USUÁRIO LOGADO
// ============================================================

async function verificarCliente() {

    // --------------------------------------------------------
    // Verificar se o Supabase está disponível
    // --------------------------------------------------------

    if (
        typeof supabaseClient ===
        "undefined"
    ) {

        console.warn(
            "Supabase não encontrado. Modo de desenvolvimento."
        );

        carregarCliente();

        return;

    }


    try {

        const {
            data,
            error
        } =
            await supabaseClient.auth.getSession();


        // ----------------------------------------------------
        // ERRO
        // ----------------------------------------------------

        if (error) {

            console.error(
                "Erro ao verificar sessão:",
                error
            );

            carregarCliente();

            return;

        }


        // ----------------------------------------------------
        // SESSÃO
        // ----------------------------------------------------

        const sessao =
            data.session;


        // ----------------------------------------------------
        // NENHUM USUÁRIO LOGADO
        // ----------------------------------------------------

        if (!sessao) {

            console.warn(
                "Nenhum usuário conectado."
            );

            /*
             * Por enquanto não vamos expulsar
             * o usuário da página.
             *
             * Depois vamos ativar a proteção
             * definitiva das áreas.
             */

            carregarCliente();

            return;

        }


        // ----------------------------------------------------
        // USUÁRIO LOGADO
        // ----------------------------------------------------

        console.log(
            "Cliente conectado:",
            sessao.user
        );


        // ----------------------------------------------------
        // DADOS DO USUÁRIO
        // ----------------------------------------------------

        const dadosUsuario =
            sessao.user.user_metadata || {};


        if (dadosUsuario.nome) {

            cliente.nome =
                dadosUsuario.nome;

        }


        // ----------------------------------------------------
        // E-MAIL
        // ----------------------------------------------------

        console.log(
            "E-mail do cliente:",
            sessao.user.email
        );


        // ----------------------------------------------------
        // ATUALIZAR TELA
        // ----------------------------------------------------

        carregarCliente();

    }


    catch (erro) {

        console.error(
            "Erro inesperado:",
            erro
        );

        carregarCliente();

    }

}


// ============================================================
// BOTÃO SAIR
// ============================================================

if (btnSairTopo) {

    btnSairTopo.addEventListener(
        "click",
        async function (event) {

            event.preventDefault();


            // ------------------------------------------------
            // Verificar Supabase
            // ------------------------------------------------

            if (
                typeof supabaseClient ===
                "undefined"
            ) {

                localStorage.removeItem(
                    "tipoAcesso"
                );

                localStorage.removeItem(
                    "usuarioId"
                );

                window.location.href =
                    "index.html";

                return;

            }


            try {

                // --------------------------------------------
                // Encerrar sessão
                // --------------------------------------------

                const {
                    error
                } =
                    await supabaseClient.auth.signOut();


                if (error) {

                    console.error(
                        "Erro ao sair:",
                        error
                    );

                }


                // --------------------------------------------
                // Limpar dados locais
                // --------------------------------------------

                localStorage.removeItem(
                    "tipoAcesso"
                );

                localStorage.removeItem(
                    "usuarioId"
                );


                // --------------------------------------------
                // Voltar para o início
                // --------------------------------------------

                window.location.href =
                    "index.html";

            }


            catch (erro) {

                console.error(
                    "Erro ao sair:",
                    erro
                );


                window.location.href =
                    "index.html";

            }

        }
    );

}


// ============================================================
// BOTÃO HISTÓRICO
// ============================================================

if (btnHistorico) {

    btnHistorico.addEventListener(
        "click",
        function () {

            alert(
                "O histórico de corridas será disponibilizado aqui."
            );

        }
    );

}


// ============================================================
// BOTÃO AVALIAÇÕES
// ============================================================

if (btnAvaliacoes) {

    btnAvaliacoes.addEventListener(
        "click",
        function () {

            alert(
                "Suas avaliações serão disponibilizadas aqui."
            );

        }
    );

}


// ============================================================
// INICIAR ÁREA DO CLIENTE
// ============================================================

document.addEventListener(
    "DOMContentLoaded",
    function () {

        carregarCliente();

        verificarCliente();

    }
);

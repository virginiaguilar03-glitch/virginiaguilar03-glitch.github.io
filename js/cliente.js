// ============================================================
// CLIENTE.JS - ÁREA DO CLIENTE | VAIDTÁXI
// Controle da área exclusiva do cliente
// Supabase + Autenticação
// ============================================================


// ============================================================
// INICIALIZAÇÃO
// ============================================================

document.addEventListener("DOMContentLoaded", async () => {

    console.log("Área do Cliente iniciada.");

    // --------------------------------------------------------
    // VERIFICA SE O SUPABASE FOI CARREGADO
    // --------------------------------------------------------

    if (typeof supabaseClient === "undefined") {

        console.error(
            "supabaseClient não foi encontrado."
        );

        return;
    }


    // --------------------------------------------------------
    // OBTÉM A SESSÃO ATUAL
    // --------------------------------------------------------

    const {
        data: sessionData,
        error: sessionError
    } = await supabaseClient.auth.getSession();


    if (sessionError) {

        console.error(
            "Erro ao verificar sessão:",
            sessionError
        );

        window.location.href = "login.html";

        return;
    }


    const session =
        sessionData?.session;


    // --------------------------------------------------------
    // VERIFICA SE EXISTE USUÁRIO LOGADO
    // --------------------------------------------------------

    if (!session || !session.user) {

        console.warn(
            "Nenhum cliente está logado."
        );

        window.location.href = "login.html";

        return;
    }


    // --------------------------------------------------------
    // USUÁRIO AUTENTICADO
    // --------------------------------------------------------

    const usuario =
        session.user;

    const usuarioId =
        usuario.id;


    console.log(
        "Usuário autenticado:",
        usuarioId
    );


    // --------------------------------------------------------
    // VERIFICA O TIPO DE ACESSO
    // --------------------------------------------------------

    const tipoAcesso =
        localStorage.getItem("tipoAcesso");


    if (tipoAcesso !== "cliente") {

        console.warn(
            "Usuário não possui acesso de cliente."
        );


        // ----------------------------------------------------
        // PARCEIRO
        // ----------------------------------------------------

        if (tipoAcesso === "parceiro") {

            window.location.href =
                "parceiro.html";

            return;
        }


        // ----------------------------------------------------
        // ADMINISTRADOR
        // ----------------------------------------------------

        if (tipoAcesso === "admin") {

            window.location.href =
                "admin.html";

            return;
        }


        // ----------------------------------------------------
        // TIPO DESCONHECIDO
        // ----------------------------------------------------

        window.location.href =
            "login.html";

        return;
    }


    // --------------------------------------------------------
    // SALVA O ID DO USUÁRIO
    // --------------------------------------------------------

    localStorage.setItem(
        "usuarioId",
        usuarioId
    );


    localStorage.setItem(
        "tipoAcesso",
        "cliente"
    );


    // --------------------------------------------------------
    // CARREGA OS DADOS DO CLIENTE
    // --------------------------------------------------------

    await carregarDadosCliente(
        usuario
    );


    // --------------------------------------------------------
    // CONFIGURA OS BOTÕES
    // --------------------------------------------------------

    configurarBotoesCliente();


});



// ============================================================
// CARREGAR DADOS DO CLIENTE
// ============================================================

async function carregarDadosCliente(usuario) {

    try {

        console.log(
            "Buscando dados do cliente..."
        );


        // ----------------------------------------------------
        // BUSCA O CLIENTE NO SUPABASE
        // ----------------------------------------------------

        const {
            data: cliente,
            error
        } = await supabaseClient
            .from("clientes")
            .select("*")
            .eq("id", usuario.id)
            .maybeSingle();


        // ----------------------------------------------------
        // SE HOUVER ERRO
        // ----------------------------------------------------

        if (error) {

            console.error(
                "Erro ao buscar cliente:",
                error
            );

        }


        // ----------------------------------------------------
        // NOME DO CLIENTE
        // ----------------------------------------------------

        let nomeCliente = "";


        // Primeiro tenta o nome da tabela clientes

        if (
            cliente &&
            cliente.nome &&
            cliente.nome.trim() !== ""
        ) {

            nomeCliente =
                cliente.nome.trim();

        }


        // Depois tenta o metadata do usuário

        if (
            !nomeCliente &&
            usuario.user_metadata
        ) {

            nomeCliente =
                usuario.user_metadata.nome ||
                usuario.user_metadata.name ||
                "";

        }


        // Depois usa o e-mail

        if (
            !nomeCliente &&
            usuario.email
        ) {

            nomeCliente =
                usuario.email
                    .split("@")[0];

        }


        // Último recurso

        if (!nomeCliente) {

            nomeCliente =
                "Cliente";

        }


        console.log(
            "Nome do cliente:",
            nomeCliente
        );


        // ----------------------------------------------------
        // MOSTRA O NOME NA PÁGINA
        // ----------------------------------------------------

        const elementoNome =
            document.getElementById(
                "nomeCliente"
            );


        if (elementoNome) {

            elementoNome.textContent =
                nomeCliente;

        }


        // ----------------------------------------------------
        // ATUALIZA TÍTULO DA PÁGINA
        // ----------------------------------------------------

        document.title =
            `Área do Cliente | VaidTáxi`;


        // ----------------------------------------------------
        // CARREGA INFORMAÇÕES BÁSICAS
        // ----------------------------------------------------

        carregarInformacoesBasicas(
            cliente
        );


    } catch (erro) {

        console.error(
            "Erro inesperado ao carregar cliente:",
            erro
        );

    }

}



// ============================================================
// INFORMAÇÕES BÁSICAS
// ============================================================

function carregarInformacoesBasicas(cliente) {

    // --------------------------------------------------------
    // IMPORTANTE:
    // Não fazemos consultas inventadas para corridas,
    // avaliações ou favoritos neste momento.
    //
    // Esses números continuarão em 0 até confirmarmos
    // exatamente a estrutura dessas tabelas no Supabase.
    // --------------------------------------------------------

    const totalCorridas =
        document.getElementById(
            "totalCorridas"
        );


    const totalAvaliacoes =
        document.getElementById(
            "totalAvaliacoes"
        );


    const motoristasFavoritos =
        document.getElementById(
            "motoristasFavoritos"
        );


    if (totalCorridas) {

        totalCorridas.textContent =
            "0";

    }


    if (totalAvaliacoes) {

        totalAvaliacoes.textContent =
            "0";

    }


    if (motoristasFavoritos) {

        motoristasFavoritos.textContent =
            "0";

    }

}



// ============================================================
// CONFIGURAÇÃO DOS BOTÕES
// ============================================================

function configurarBotoesCliente() {

    // --------------------------------------------------------
    // BOTÃO DE SAIR DO TOPO
    // --------------------------------------------------------

    const btnSairTopo =
        document.getElementById(
            "btnSairTopo"
        );


    if (btnSairTopo) {

        btnSairTopo.addEventListener(
            "click",
            async (event) => {

                event.preventDefault();

                await sairDaConta();

            }
        );

    }



    // --------------------------------------------------------
    // HISTÓRICO
    // --------------------------------------------------------

    const btnHistorico =
        document.getElementById(
            "btnHistorico"
        );


    if (btnHistorico) {

        btnHistorico.addEventListener(
            "click",
            () => {

                alert(
                    "O histórico de corridas será disponibilizado nesta área."
                );

            }
        );

    }



    // --------------------------------------------------------
    // AVALIAÇÕES
    // --------------------------------------------------------

    const btnAvaliacoes =
        document.getElementById(
            "btnAvaliacoes"
        );


    if (btnAvaliacoes) {

        btnAvaliacoes.addEventListener(
            "click",
            () => {

                alert(
                    "Suas avaliações serão disponibilizadas nesta área."
                );

            }
        );

    }

}



// ============================================================
// SAIR DA CONTA
// ============================================================

async function sairDaConta() {

    try {

        console.log(
            "Encerrando sessão..."
        );


        const {
            error
        } = await supabaseClient
            .auth
            .signOut();


        if (error) {

            console.error(
                "Erro ao sair:",
                error
            );


            alert(
                "Não foi possível encerrar a sessão. Tente novamente."
            );

            return;
        }


        // ----------------------------------------------------
        // LIMPA DADOS LOCAIS
        // ----------------------------------------------------

        localStorage.removeItem(
            "usuarioId"
        );


        localStorage.removeItem(
            "tipoAcesso"
        );


        sessionStorage.removeItem(
            "corridaOrigem"
        );


        sessionStorage.removeItem(
            "corridaDestino"
        );


        sessionStorage.removeItem(
            "corridaObservacao"
        );


        console.log(
            "Sessão encerrada com sucesso."
        );


        // ----------------------------------------------------
        // VOLTA PARA O LOGIN
        // ----------------------------------------------------

        window.location.href =
            "login.html";


    } catch (erro) {

        console.error(
            "Erro inesperado ao sair:",
            erro
        );


        alert(
            "Ocorreu um erro ao sair da conta."
        );

    }

}

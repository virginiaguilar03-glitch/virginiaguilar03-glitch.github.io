// ============================================================
// MOTORISTAS - VAIDTÁXI
// Lista e pesquisa dos motoristas cadastrados no Supabase
// ============================================================

let motoristas = [];


// ============================================================
// ELEMENTOS
// ============================================================

const listaMotoristas =
    document.getElementById("listaMotoristas");

const pesquisaMotorista =
    document.getElementById("pesquisaMotorista");

const mensagemMotoristas =
    document.getElementById("mensagemMotoristas");


// ============================================================
// INICIAR
// ============================================================

document.addEventListener("DOMContentLoaded", function () {

    carregarMotoristas();

});


// ============================================================
// CARREGAR MOTORISTAS
// ============================================================

async function carregarMotoristas() {

    try {

        console.log("Iniciando carregamento dos motoristas...");


        if (
            typeof supabaseClient === "undefined" ||
            !supabaseClient
        ) {

            console.error(
                "supabaseClient não encontrado."
            );

            mostrarMensagem(
                "Erro na conexão com o banco de dados."
            );

            return;

        }


        // ====================================================
        // BUSCAR TODOS OS CAMPOS EXISTENTES NA TABELA
        // ====================================================

        const { data, error } =
            await supabaseClient
                .from("motoristas")
                .select("*");


        // ====================================================
        // VERIFICAR ERRO
        // ====================================================

        if (error) {

            console.error(
                "Erro ao carregar motoristas:",
                error
            );

            mostrarMensagem(
                "Não foi possível carregar os motoristas."
            );

            return;

        }


        // ====================================================
        // GUARDAR RESULTADOS
        // ====================================================

        motoristas = data || [];


        console.log(
            "Motoristas encontrados:",
            motoristas
        );


        console.log(
            "Quantidade de motoristas:",
            motoristas.length
        );


        // ====================================================
        // MOSTRAR NA TELA
        // ====================================================

        renderizarMotoristas(
            motoristas
        );

    }

    catch (erro) {

        console.error(
            "Erro inesperado ao carregar motoristas:",
            erro
        );

        mostrarMensagem(
            "Ocorreu um erro ao carregar os motoristas."
        );

    }

}


// ============================================================
// RENDERIZAR MOTORISTAS
// ============================================================

function renderizarMotoristas(lista) {

    if (!listaMotoristas) {

        console.error(
            "Elemento listaMotoristas não encontrado."
        );

        return;

    }


    listaMotoristas.innerHTML = "";


    // ========================================================
    // NENHUM MOTORISTA
    // ========================================================

    if (!lista || lista.length === 0) {

        mostrarMensagem(
            "Nenhum motorista cadastrado foi encontrado."
        );

        return;

    }


    esconderMensagem();


    // ========================================================
    // CRIAR CARDS
    // ========================================================

    lista.forEach(function (motorista) {

        const card =
            document.createElement("article");


        card.className =
            "card-motorista";


        // ====================================================
        // DADOS
        // ====================================================

        const nome =
            motorista.nome ||
            "Motorista VaidTáxi";


        const marca =
            motorista.marca ||
            "Não informado";


        const modelo =
            motorista.modelo ||
            "Não informado";


        const cor =
            motorista.cor ||
            "Não informada";


        const ano =
            motorista.ano ||
            "Não informado";


        const placa =
            motorista.placa ||
            "Não informada";


        const assentos =
            motorista.assentos ||
            "Não informado";


        const status =
            motorista.status ||
            "pendente";


        // ====================================================
        // STATUS
        // ====================================================

        const statusNormalizado =
            String(status)
                .toLowerCase()
                .trim();


        let textoStatus =
            "Pendente";


        if (
            statusNormalizado === "aprovado" ||
            statusNormalizado === "ativo" ||
            statusNormalizado === "disponivel"
        ) {

            textoStatus =
                "Disponível";

        }

        else if (
            statusNormalizado === "online"
        ) {

            textoStatus =
                "Online";

        }

        else if (
            statusNormalizado === "reprovado" ||
            statusNormalizado === "recusado"
        ) {

            textoStatus =
                "Indisponível";

        }

        else if (
            statusNormalizado === "inativo"
        ) {

            textoStatus =
                "Inativo";

        }

        else {

            textoStatus =
                status;

        }


        const classeStatus =
            obterClasseStatus(
                statusNormalizado
            );


        // ====================================================
        // HTML DO CARD
        // ====================================================

        card.innerHTML = `

            <div class="motorista-topo">

                <div class="motorista-foto">

                    <i class="fa-solid fa-user"></i>

                </div>


                <div class="motorista-nome">

                    <h3>
                        ${escaparHTML(nome)}
                    </h3>

                    <span
                        class="status-motorista ${classeStatus}"
                    >
                        ${escaparHTML(textoStatus)}
                    </span>

                </div>

            </div>


            <div class="veiculo-motorista">


                <div class="veiculo-dado">

                    <small>
                        Veículo
                    </small>

                    <strong>
                        ${escaparHTML(marca)}
                        ${escaparHTML(modelo)}
                    </strong>

                </div>


                <div class="veiculo-dado">

                    <small>
                        Cor
                    </small>

                    <strong>
                        ${escaparHTML(cor)}
                    </strong>

                </div>


                <div class="veiculo-dado">

                    <small>
                        Ano
                    </small>

                    <strong>
                        ${escaparHTML(ano)}
                    </strong>

                </div>


                <div class="veiculo-dado">

                    <small>
                        Placa
                    </small>

                    <strong>
                        ${escaparHTML(placa)}
                    </strong>

                </div>


                <div class="veiculo-dado">

                    <small>
                        Passageiros
                    </small>

                    <strong>
                        ${escaparHTML(assentos)}
                    </strong>

                </div>


            </div>

        `;


        listaMotoristas.appendChild(
            card
        );

    });

}


// ============================================================
// PESQUISA
// ============================================================

if (pesquisaMotorista) {

    pesquisaMotorista.addEventListener(
        "input",
        function () {

            const termo =
                pesquisaMotorista.value
                    .toLowerCase()
                    .trim();


            // =================================================
            // CAMPO VAZIO
            // =================================================

            if (!termo) {

                renderizarMotoristas(
                    motoristas
                );

                return;

            }


            // =================================================
            // FILTRAR
            // =================================================

            const resultado =
                motoristas.filter(
                    function (motorista) {

                        const texto =
                            [

                                motorista.nome,
                                motorista.marca,
                                motorista.modelo,
                                motorista.placa,
                                motorista.cor,
                                motorista.status

                            ]
                            .filter(Boolean)
                            .join(" ")
                            .toLowerCase();


                        return texto.includes(
                            termo
                        );

                    }
                );


            // =================================================
            // NENHUM RESULTADO
            // =================================================

            if (
                resultado.length === 0
            ) {

                listaMotoristas.innerHTML = "";


                mostrarMensagem(
                    "Nenhum motorista encontrado."
                );


                return;

            }


            // =================================================
            // MOSTRAR RESULTADOS
            // =================================================

            renderizarMotoristas(
                resultado
            );

        }
    );

}


// ============================================================
// STATUS
// ============================================================

function obterClasseStatus(status) {

    if (

        status === "aprovado" ||
        status === "ativo" ||
        status === "disponivel" ||
        status === "online"

    ) {

        return "status-ok";

    }


    if (

        status === "reprovado" ||
        status === "recusado" ||
        status === "inativo"

    ) {

        return "status-off";

    }


    return "status-pendente";

}


// ============================================================
// MENSAGEM
// ============================================================

function mostrarMensagem(texto) {

    if (!mensagemMotoristas) {

        return;

    }


    mensagemMotoristas.textContent =
        texto;


    mensagemMotoristas.style.display =
        "block";

}


function esconderMensagem() {

    if (!mensagemMotoristas) {

        return;

    }


    mensagemMotoristas.style.display =
        "none";

}


// ============================================================
// PROTEÇÃO DO TEXTO
// ============================================================

function escaparHTML(valor) {

    return String(valor)

        .replace(/&/g, "&amp;")

        .replace(/</g, "&lt;")

        .replace(/>/g, "&gt;")

        .replace(/"/g, "&quot;")

        .replace(/'/g, "&#039;");

}

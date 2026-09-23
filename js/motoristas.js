
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
// CARREGAR MOTORISTAS DO SUPABASE
// ============================================================

async function carregarMotoristas() {

    try {

        if (
            typeof supabaseClient === "undefined" ||
            !supabaseClient
        ) {

            console.error(
                "supabaseClient não encontrado."
            );

            mostrarMensagem(
                "Não foi possível conectar ao sistema."
            );

            return;

        }


        const { data, error } =
            await supabaseClient
                .from("motoristas")
                .select(`
                    id,
                    nome,
                    marca,
                    modelo,
                    cor,
                    ano,
                    placa,
                    assentos,
                    telefone,
                    email,
                    status,
                    created_at
                `)
                .order("created_at", {
                    ascending: false
                });


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


        motoristas = data || [];


        console.log(
            "Motoristas carregados:",
            motoristas
        );


        renderizarMotoristas(motoristas);

    }

    catch (erro) {

        console.error(
            "Erro inesperado:",
            erro
        );

        mostrarMensagem(
            "Ocorreu um erro ao carregar os motoristas."
        );

    }

}


// ============================================================
// MOSTRAR MOTORISTAS NA TELA
// ============================================================

function renderizarMotoristas(lista) {

    if (!listaMotoristas) {

        return;

    }


    listaMotoristas.innerHTML = "";


    if (!lista || lista.length === 0) {

        mostrarMensagem(
            "Nenhum motorista cadastrado foi encontrado."
        );

        return;

    }


    esconderMensagem();


    lista.forEach(function (motorista) {


        const card =
            document.createElement("article");

        card.className =
            "card-motorista";


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
            obterClasseStatus(statusNormalizado);



        card.innerHTML = `

            <div class="motorista-topo">

                <div class="motorista-foto">

                    <i class="fa-solid fa-user"></i>

                </div>


                <div class="motorista-nome">

                    <h3>
                        ${escaparHTML(nome)}
                    </h3>

                    <span class="status-motorista ${classeStatus}">
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


        listaMotoristas.appendChild(card);


    });

}


// ============================================================
// PESQUISA DOS MOTORISTAS
// ============================================================

if (pesquisaMotorista) {


    pesquisaMotorista.addEventListener(
        "input",
        function () {


            const termo =
                pesquisaMotorista.value
                    .toLowerCase()
                    .trim();


            if (!termo) {

                renderizarMotoristas(
                    motoristas
                );

                return;

            }



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



            if (resultado.length === 0) {


                if (listaMotoristas) {

                    listaMotoristas.innerHTML = "";

                }


                mostrarMensagem(
                    "Nenhum motorista encontrado para essa pesquisa."
                );

                return;

            }



            renderizarMotoristas(
                resultado
            );


        }
    );

}


// ============================================================
// CLASSE DO STATUS
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
// MENSAGENS
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
// PROTEÇÃO CONTRA HTML INDESEJADO
// ============================================================

function escaparHTML(valor) {


    return String(valor)

        .replace(/&/g, "&amp;")

        .replace(/</g, "&lt;")

        .replace(/>/g, "&gt;")

        .replace(/"/g, "&quot;")

        .replace(/'/g, "&#039;");


}

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
                .select("*")
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


        motoristas =
            data || [];


        console.log(
            "Motoristas carregados:",
            motoristas
        );


        console.log(
            "Quantidade de motoristas:",
            motoristas.length
        );


        renderizarMotoristas(
            motoristas
        );

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


    if (
        !lista ||
        lista.length === 0
    ) {

        mostrarMensagem(
            "Nenhum motorista cadastrado foi encontrado."
        );

        return;
    }


    esconderMensagem();


    lista.forEach(function (motorista) {


        // ====================================================
        // DADOS
        // ====================================================

        const nome =
            motorista.nome ||
            "Motorista VaidTáxi";


        const marca =
            motorista.marca ||
            "";


        const modelo =
            motorista.modelo ||
            "";


        const cor =
            motorista.cor ||
            "";


        const ano =
            motorista.ano ||
            "";


        const placa =
            motorista.placa ||
            "";


        const assentos =
            motorista.assentos ||
            "";


        const status =
            motorista.status ||
            "pendente";


        // ====================================================
        // FOTO
        // ====================================================

        const foto =
            motorista.foto_url ||
            motorista.foto ||
            "";


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
            statusNormalizado === "disponivel" ||
            statusNormalizado === "online"
        ) {

            textoStatus =
                "Disponível";

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
        // VEÍCULO
        // ====================================================

        const veiculo =
            [marca, modelo]
                .filter(Boolean)
                .join(" ");


        // ====================================================
        // CRIAR CARD
        // ====================================================

        const card =
            document.createElement("article");


        card.className =
            "card-motorista";


        // ====================================================
        // CARD
        // ====================================================

        card.innerHTML = `

            <!-- FOTO -->

            <div class="motorista-foto">

                ${
                    foto
                    ?
                    `
                        <img
                            src="${escaparHTML(foto)}"
                            alt="Foto de ${escaparHTML(nome)}"
                            onerror="this.style.display='none'; this.parentElement.classList.add('sem-foto');"
                        >
                    `
                    :
                    ""
                }

                <div class="foto-placeholder">

                    <i class="fa-solid fa-user"></i>

                </div>

            </div>


            <!-- CONTEÚDO -->

            <div class="motorista-conteudo">


                <!-- NOME + STATUS -->

                <div class="motorista-linha-topo">

                    <h3>
                        ${escaparHTML(nome)}
                    </h3>

                    <span
                        class="status-motorista ${classeStatus}"
                    >

                        <span class="status-ponto"></span>

                        ${escaparHTML(textoStatus)}

                    </span>

                </div>


                <!-- INFORMAÇÕES -->

                <div class="motorista-detalhes">


                    ${
                        veiculo
                        ?
                        `
                            <div class="detalhe">

                                <i class="fa-solid fa-car"></i>

                                <span>
                                    ${escaparHTML(veiculo)}
                                </span>

                            </div>
                        `
                        :
                        ""
                    }


                    ${
                        cor
                        ?
                        `
                            <div class="detalhe">

                                <i class="fa-solid fa-palette"></i>

                                <span>
                                    ${escaparHTML(cor)}
                                </span>

                            </div>
                        `
                        :
                        ""
                    }


                    ${
                        placa
                        ?
                        `
                            <div class="detalhe">

                                <i class="fa-solid fa-id-card"></i>

                                <span>
                                    ${escaparHTML(placa)}
                                </span>

                            </div>
                        `
                        :
                        ""
                    }


                    ${
                        assentos
                        ?
                        `
                            <div class="detalhe">

                                <i class="fa-solid fa-users"></i>

                                <span>
                                    ${escaparHTML(assentos)} lugares
                                </span>

                            </div>
                        `
                        :
                        ""
                    }


                    ${
                        ano
                        ?
                        `
                            <div class="detalhe">

                                <i class="fa-regular fa-calendar"></i>

                                <span>
                                    ${escaparHTML(ano)}
                                </span>

                            </div>
                        `
                        :
                        ""
                    }

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


            if (
                resultado.length === 0
            ) {

                if (listaMotoristas) {

                    listaMotoristas.innerHTML =
                        "";

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
// SEGURANÇA
// ============================================================

function escaparHTML(valor) {

    return String(valor)

        .replace(
            /&/g,
            "&amp;"
        )

        .replace(
            /</g,
            "&lt;"
        )

        .replace(
            />/g,
            "&gt;"
        )

        .replace(
            /"/g,
            "&quot;"
        )

        .replace(
            /'/g,
            "&#039;"
        );

}

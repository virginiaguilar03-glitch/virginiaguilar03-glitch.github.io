// ============================================================
// MOTORISTAS - VAIDTÁXI
// Lista e pesquisa dos motoristas cadastrados no Supabase
// ============================================================


let motoristas = [];


// ============================================================
// INICIAR
// ============================================================

document.addEventListener("DOMContentLoaded", function () {

    // ========================================================
    // ELEMENTOS DA PÁGINA
    // ========================================================

    const listaMotoristas =
        document.getElementById("listaMotoristas");

    const pesquisaMotorista =
        document.getElementById("pesquisaMotorista");

    const mensagemMotoristas =
        document.getElementById("mensagemMotoristas");


    // ========================================================
    // VERIFICAR ELEMENTOS
    // ========================================================

    console.log(
        "Campo de pesquisa:",
        pesquisaMotorista
    );

    console.log(
        "Lista de motoristas:",
        listaMotoristas
    );


    // ========================================================
    // CARREGAR MOTORISTAS
    // ========================================================

    carregarMotoristas();


    // ========================================================
    // PESQUISA
    // ========================================================

    if (pesquisaMotorista) {

        pesquisaMotorista.addEventListener(
            "input",
            function () {

                const termo =
                    normalizarTexto(
                        pesquisaMotorista.value
                    );


                console.log(
                    "Pesquisando por:",
                    termo
                );


                // =================================================
                // CAMPO VAZIO
                // =================================================

                if (!termo) {

                    renderizarMotoristas(
                        motoristas,
                        listaMotoristas,
                        mensagemMotoristas
                    );

                    return;

                }


                // =================================================
                // FILTRAR MOTORISTAS
                // =================================================

                const resultado =
                    motoristas.filter(
                        function (motorista) {

                            const nome =
                                normalizarTexto(
                                    motorista.nome
                                );

                            const marca =
                                normalizarTexto(
                                    motorista.marca
                                );

                            const modelo =
                                normalizarTexto(
                                    motorista.modelo
                                );

                            const placa =
                                normalizarTexto(
                                    motorista.placa
                                );

                            const cor =
                                normalizarTexto(
                                    motorista.cor
                                );

                            const status =
                                normalizarTexto(
                                    motorista.status
                                );


                            const textoBusca =
                                [
                                    nome,
                                    marca,
                                    modelo,
                                    placa,
                                    cor,
                                    status
                                ]
                                .filter(Boolean)
                                .join(" ");


                            return textoBusca.includes(
                                termo
                            );

                        }
                    );


                console.log(
                    "Motoristas encontrados na pesquisa:",
                    resultado
                );


                // =================================================
                // NENHUM RESULTADO
                // =================================================

                if (
                    resultado.length === 0
                ) {

                    if (listaMotoristas) {

                        listaMotoristas.innerHTML =
                            "";

                    }


                    mostrarMensagem(
                        "Nenhum motorista encontrado para essa pesquisa.",
                        mensagemMotoristas
                    );


                    return;

                }


                // =================================================
                // MOSTRAR RESULTADO
                // =================================================

                renderizarMotoristas(
                    resultado,
                    listaMotoristas,
                    mensagemMotoristas
                );

            }
        );

    }

    else {

        console.error(
            "ERRO: o campo #pesquisaMotorista não foi encontrado."
        );

    }

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


        const listaMotoristas =
            document.getElementById(
                "listaMotoristas"
            );


        const mensagemMotoristas =
            document.getElementById(
                "mensagemMotoristas"
            );


        renderizarMotoristas(
            motoristas,
            listaMotoristas,
            mensagemMotoristas
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
// RENDERIZAR MOTORISTAS
// ============================================================

function renderizarMotoristas(
    lista,
    listaMotoristas,
    mensagemMotoristas
) {

    if (!listaMotoristas) {

        console.error(
            "Elemento #listaMotoristas não encontrado."
        );

        return;

    }


    listaMotoristas.innerHTML =
        "";


    // ========================================================
    // NENHUM MOTORISTA
    // ========================================================

    if (
        !lista ||
        lista.length === 0
    ) {

        mostrarMensagem(
            "Nenhum motorista cadastrado foi encontrado.",
            mensagemMotoristas
        );

        return;

    }


    esconderMensagem(
        mensagemMotoristas
    );


    // ========================================================
    // CRIAR CARDS
    // ========================================================

    lista.forEach(
        function (motorista) {


            // ==================================================
            // DADOS
            // ==================================================

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


            // ==================================================
            // FOTO
            // ==================================================

            const foto =
                motorista.foto_url ||
                motorista.foto ||
                "";


            // ==================================================
            // STATUS
            // ==================================================

            const statusNormalizado =
                normalizarTexto(
                    status
                );


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


            // ==================================================
            // VEÍCULO
            // ==================================================

            const veiculo =
                [
                    marca,
                    modelo
                ]
                .filter(Boolean)
                .join(" ");


            // ==================================================
            // CARD
            // ==================================================

            const card =
                document.createElement(
                    "article"
                );


            card.className =
                "card-motorista";


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
                                onerror="this.style.display='none';"
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


                    <!-- DETALHES -->

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
                                        ${escaparHTML(assentos)}
                                        lugares
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

        }
    );

}


// ============================================================
// NORMALIZAR TEXTO
// Remove acentos para facilitar a pesquisa
// ============================================================

function normalizarTexto(valor) {

    if (
        valor === null ||
        valor === undefined
    ) {

        return "";

    }


    return String(valor)
        .toLowerCase()
        .normalize("NFD")
        .replace(
            /[\u0300-\u036f]/g,
            ""
        )
        .trim();

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

function mostrarMensagem(
    texto,
    mensagemMotoristas
) {

    if (!mensagemMotoristas) {

        return;

    }


    mensagemMotoristas.textContent =
        texto;


    mensagemMotoristas.style.display =
        "block";

}


function esconderMensagem(
    mensagemMotoristas
) {

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

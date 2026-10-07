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
// FUNÇÃO PARA PREENCHER ELEMENTO
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
    // DADOS DO VEÍCULO
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
        // BUSCAR MOTORISTA
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
        // VERIFICAR ERRO
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
        // MOSTRAR MOTORISTA NO CONSOLE
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


        // ====================================================
        // QUANTIDADE DE PASSAGEIROS
        // ====================================================

        parceiro.passageiros =
            motorista.quantidade_assentos ||
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
// CARREGAR CORRIDAS DO MOTORISTA
// ============================================================

async function carregarCorridasDoMotorista(
    motoristaId
) {

    const lista =
        document.getElementById(
            "listaCorridas"
        );

    if (!lista) {

        console.error(
            "Elemento #listaCorridas não encontrado."
        );

        return;
    }


    try {

        console.log(
            "Buscando corridas para o motorista:",
            motoristaId
        );


        const {
            data: corridas,
            error
        } =
            await supabaseClient
                .from("corridas")
                .select(`
                    id,
                    cliente_id,
                    motorista_id,
                    origem,
                    destino,
                    observacao,
                    status,
                    created_at
                `)
                .eq(
                    "motorista_id",
                    motoristaId
                )
                .eq(
                    "status",
                    "aguardando"
                )
                .order(
                    "created_at",
                    {
                        ascending: false
                    }
                );


        if (error) {

            console.error(
                "Erro ao buscar corridas:",
                error
            );

            lista.innerHTML = `
                <div class="corrida-item">
                    <div class="corrida-cabecalho">
                        <strong>
                            Erro ao carregar solicitações
                        </strong>
                    </div>

                    <div class="corrida-local">
                        Verifique o console.
                    </div>
                </div>
            `;

            return;
        }


        console.log(
            "Corridas encontradas:",
            corridas
        );


        if (
            !corridas ||
            corridas.length === 0
        ) {

            lista.innerHTML = `
                <div class="corrida-item">

                    <div class="corrida-cabecalho">

                        <strong>
                            Nenhuma corrida disponível
                        </strong>

                        <span class="corrida-status">
                            Aguardando
                        </span>

                    </div>


                    <div class="corrida-local">

                        <div>

                            <i class="fa-solid fa-location-dot"></i>

                            Aguardando novas solicitações

                        </div>

                    </div>

                </div>
            `;

            return;
        }


        lista.innerHTML = "";


        corridas.forEach(
            function (corrida) {

                const item =
                    document.createElement(
                        "div"
                    );

                item.className =
                    "corrida-item";


                item.innerHTML = `

                    <div class="corrida-cabecalho">

                        <strong>
                            Nova solicitação
                        </strong>

                        <span class="corrida-status">
                            Aguardando
                        </span>

                    </div>


                    <div class="corrida-local">

                        <div>

                            <i class="fa-solid fa-location-dot"></i>

                            <strong>Origem:</strong>

                            ${corrida.origem || "Não informado"}

                        </div>


                        <div>

                            <i class="fa-solid fa-flag-checkered"></i>

                            <strong>Destino:</strong>

                            ${corrida.destino || "Não informado"}

                        </div>

                    </div>


                    ${
                        corrida.observacao
                        ? `
                            <div class="corrida-local">

                                <div>

                                    <i class="fa-solid fa-comment"></i>

                                    <strong>Observação:</strong>

                                    ${corrida.observacao}

                                </div>

                            </div>
                        `
                        : ""
                    }

                `;


                lista.appendChild(
                    item
                );

            }
        );

    }

    catch (erro) {

        console.error(
            "Erro inesperado ao carregar corridas:",
            erro
        );

    }

}
// ============================================================
// ESCUTAR NOVAS CORRIDAS EM TEMPO REAL
// ============================================================

function escutarNovasCorridas(
    motoristaId
) {

    console.log(
        "Iniciando escuta de novas corridas para:",
        motoristaId
    );


    supabaseClient
        .channel(
            "corridas-motorista-" +
            motoristaId
        )
        .on(
            "postgres_changes",
            {
                event: "INSERT",
                schema: "public",
                table: "corridas",
                filter:
                    "motorista_id=eq." +
                    motoristaId
            },
            function (payload) {

                console.log(
                    "NOVA SOLICITAÇÃO RECEBIDA:",
                    payload.new
                );


                if (
                    payload.new.status ===
                    "aguardando"
                ) {

                    carregarCorridasDoMotorista(
                        motoristaId
                    );

                }

            }
        )
        .subscribe(
            function (status) {

                console.log(
                    "Canal de corridas do motorista:",
                    status
                );

            }
        );

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
        // ====================================================
// CARREGAR SOLICITAÇÕES DE CORRIDA
// ====================================================

await carregarCorridasDoMotorista(usuario.id);

// ====================================================
// ESCUTAR NOVAS SOLICITAÇÕES EM TEMPO REAL
// ====================================================

escutarNovasCorridas(usuario.id);


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

    console.log("Iniciando logout do parceiro...");


    // ========================================================
    // LIMPAR DADOS LOCAIS PRIMEIRO
    // ========================================================

    localStorage.removeItem("usuarioId");
    localStorage.removeItem("tipoAcesso");


    // ========================================================
    // FAZER LOGOUT NO SUPABASE
    // ========================================================

    if (
        typeof supabaseClient !== "undefined" &&
        supabaseClient
    ) {

        try {

            const {
                error
            } = await supabaseClient.auth.signOut();

            if (error) {

                console.error(
                    "Erro ao sair do Supabase:",
                    error
                );

            }

        }

        catch (erro) {

            console.error(
                "Erro inesperado durante logout:",
                erro
            );

        }

    }


    // ========================================================
    // REDIRECIONAR PARA LOGIN
    // ========================================================

    console.log(
        "Logout concluído. Redirecionando para login..."
    );

    window.location.replace("login.html");

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

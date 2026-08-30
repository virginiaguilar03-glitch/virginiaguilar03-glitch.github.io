// ============================================================
// ADMIN.JS - VAIDTÁXI
// Painel administrativo
// Supabase + Clientes + Motoristas + Aprovação
// ============================================================


// ============================================================
// INICIALIZAÇÃO
// ============================================================

console.log("======================================");
console.log("ADMIN VaidTáxi iniciado.");
console.log("======================================");


// ============================================================
// VERIFICAR SUPABASE
// ============================================================

function verificarSupabase() {

    if (
        typeof supabaseClient === "undefined" ||
        !supabaseClient
    ) {

        console.error(
            "supabaseClient não está disponível."
        );

        return false;
    }

    return true;
}


// ============================================================
// ELEMENTOS
// ============================================================

const totalClientes =
    document.getElementById("totalClientes");

const totalParceiros =
    document.getElementById("totalParceiros");

const totalCorridas =
    document.getElementById("totalCorridas");

const totalFaturamento =
    document.getElementById("totalFaturamento");

const badgeValidacao =
    document.getElementById("badgeValidacao");

const listaValidacoes =
    document.getElementById("listaValidacoes");

const listaValidacoesDashboard =
    document.getElementById(
        "listaValidacoesDashboard"
    );

const tabelaClientes =
    document.querySelector(
        "#tabelaClientes tbody"
    );

const tabelaParceiros =
    document.querySelector(
        "#tabelaParceiros tbody"
    );


// ============================================================
// FORMATAR DATA
// ============================================================

function formatarData(data) {

    if (!data) {
        return "-";
    }

    try {

        return new Date(data).toLocaleDateString(
            "pt-BR"
        );

    }

    catch {

        return "-";

    }

}


// ============================================================
// FORMATAR DINHEIRO
// ============================================================

function formatarMoeda(valor) {

    const numero =
        Number(valor) || 0;

    return numero.toLocaleString(
        "pt-BR",
        {
            style: "currency",
            currency: "BRL"
        }
    );

}


// ============================================================
// ESCAPAR HTML
// ============================================================

function escaparHTML(valor) {

    if (valor === null || valor === undefined) {
        return "";
    }

    return String(valor)
        .replace(/&/g, "&amp;")
        .replace(/</g, "&lt;")
        .replace(/>/g, "&gt;")
        .replace(/"/g, "&quot;")
        .replace(/'/g, "&#039;");

}


// ============================================================
// CARREGAR DASHBOARD
// ============================================================

async function carregarDashboard() {

    if (!verificarSupabase()) {
        return;
    }


    console.log(
        "Carregando informações do Dashboard..."
    );


    try {

        // =====================================================
        // CLIENTES
        // =====================================================

        const resultadoClientes =
            await supabaseClient
                .from("clientes")
                .select("id", {
                    count: "exact",
                    head: true
                });


        if (
            resultadoClientes.error
        ) {

            console.error(
                "Erro ao contar clientes:",
                resultadoClientes.error
            );

        }

        else if (totalClientes) {

            totalClientes.textContent =
                resultadoClientes.count || 0;

        }


        // =====================================================
        // MOTORISTAS
        // =====================================================

        const resultadoMotoristas =
            await supabaseClient
                .from("motoristas")
                .select("id", {
                    count: "exact",
                    head: true
                });


        if (
            resultadoMotoristas.error
        ) {

            console.error(
                "Erro ao contar motoristas:",
                resultadoMotoristas.error
            );

        }

        else if (totalParceiros) {

            totalParceiros.textContent =
                resultadoMotoristas.count || 0;

        }


        // =====================================================
        // CORRIDAS
        // =====================================================

        const inicioHoje =
            new Date();

        inicioHoje.setHours(
            0,
            0,
            0,
            0
        );


        const fimHoje =
            new Date();

        fimHoje.setHours(
            23,
            59,
            59,
            999
        );


        const resultadoCorridas =
            await supabaseClient
                .from("corridas")
                .select("id", {
                    count: "exact",
                    head: true
                })
                .gte(
                    "created_at",
                    inicioHoje.toISOString()
                )
                .lte(
                    "created_at",
                    fimHoje.toISOString()
                );


        if (
            resultadoCorridas.error
        ) {

            console.warn(
                "Não foi possível carregar corridas:",
                resultadoCorridas.error
            );

        }

        else if (totalCorridas) {

            totalCorridas.textContent =
                resultadoCorridas.count || 0;

        }


        // =====================================================
        // FATURAMENTO
        // =====================================================

        /*
         * O faturamento depende da estrutura da tabela
         * de pagamentos/corridas.
         *
         * Por segurança, deixamos R$ 0,00 até conectarmos
         * essa parte à estrutura definitiva.
         */

        if (totalFaturamento) {

            totalFaturamento.textContent =
                "R$ 0,00";

        }

    }

    catch (erro) {

        console.error(
            "Erro ao carregar Dashboard:",
            erro
        );

    }

}


// ============================================================
// CARREGAR CLIENTES
// ============================================================

async function carregarClientes() {

    if (!verificarSupabase()) {
        return;
    }


    if (!tabelaClientes) {

        console.warn(
            "Tabela de clientes não encontrada no HTML."
        );

        return;

    }


    console.log(
        "Carregando clientes..."
    );


    try {

        const {
            data,
            error
        } =
            await supabaseClient
                .from("clientes")
                .select(
                    "id,nome,email,telefone,created_at,ativo"
                )
                .order(
                    "created_at",
                    {
                        ascending: false
                    }
                );


        if (error) {

            console.error(
                "Erro ao carregar clientes:",
                error
            );

            tabelaClientes.innerHTML = `
                <tr>
                    <td colspan="6">
                        <div class="admin-tabela-vazia">
                            <i class="fa-solid fa-triangle-exclamation"></i>
                            <p>
                                Não foi possível carregar os clientes.
                            </p>
                        </div>
                    </td>
                </tr>
            `;

            return;

        }


        if (
            !data ||
            data.length === 0
        ) {

            tabelaClientes.innerHTML = `
                <tr>
                    <td colspan="6">
                        <div class="admin-tabela-vazia">
                            <i class="fa-solid fa-users"></i>
                            <p>
                                Nenhum cliente cadastrado para exibir.
                            </p>
                        </div>
                    </td>
                </tr>
            `;

            return;

        }


        tabelaClientes.innerHTML =
            data.map(
                function(cliente) {

                    const status =
                        cliente.ativo === false
                            ? "Inativo"
                            : "Ativo";


                    return `
                        <tr>

                            <td>
                                ${escaparHTML(
                                    cliente.nome || "-"
                                )}
                            </td>

                            <td>
                                ${escaparHTML(
                                    cliente.email || "-"
                                )}
                            </td>

                            <td>
                                ${escaparHTML(
                                    cliente.telefone || "-"
                                )}
                            </td>

                            <td>
                                ${formatarData(
                                    cliente.created_at
                                )}
                            </td>

                            <td>
                                <span class="status-badge">
                                    ${status}
                                </span>
                            </td>

                            <td>
                                <button
                                    type="button"
                                    class="admin-btn-link"
                                    onclick="verCliente('${cliente.id}')"
                                >
                                    Ver
                                </button>
                            </td>

                        </tr>
                    `;

                }
            ).join("");


    }

    catch (erro) {

        console.error(
            "Erro inesperado ao carregar clientes:",
            erro
        );

    }

}


// ============================================================
// CARREGAR PARCEIROS
// ============================================================

async function carregarParceiros() {

    if (!verificarSupabase()) {
        return;
    }


    if (!tabelaParceiros) {

        console.warn(
            "Tabela de parceiros não encontrada no HTML."
        );

        return;

    }


    console.log(
        "Carregando parceiros..."
    );


    try {

        const {
            data,
            error
        } =
            await supabaseClient
                .from("motoristas")
                .select(
                    "id,nome,marca,modelo,cor,ano,placa,assentos,telefone,email,status,created_at"
                )
                .order(
                    "created_at",
                    {
                        ascending: false
                    }
                );


        if (error) {

            console.error(
                "Erro ao carregar parceiros:",
                error
            );

            tabelaParceiros.innerHTML = `
                <tr>
                    <td colspan="6">
                        <div class="admin-tabela-vazia">
                            <i class="fa-solid fa-triangle-exclamation"></i>
                            <p>
                                Não foi possível carregar os parceiros.
                            </p>
                        </div>
                    </td>
                </tr>
            `;

            return;

        }


        if (
            !data ||
            data.length === 0
        ) {

            tabelaParceiros.innerHTML = `
                <tr>
                    <td colspan="6">
                        <div class="admin-tabela-vazia">
                            <i class="fa-solid fa-taxi"></i>
                            <p>
                                Nenhum parceiro cadastrado para exibir.
                            </p>
                        </div>
                    </td>
                </tr>
            `;

            return;

        }


        tabelaParceiros.innerHTML =
            data.map(
                function(motorista) {

                    const status =
                        motorista.status ||
                        "pendente";


                    return `
                        <tr>

                            <td>

                                <strong>
                                    ${escaparHTML(
                                        motorista.nome || "-"
                                    )}
                                </strong>

                                <br>

                                <small>
                                    ${escaparHTML(
                                        motorista.email || ""
                                    )}
                                </small>

                            </td>

                            <td>

                                ${escaparHTML(
                                    motorista.marca || ""
                                )}

                                ${motorista.marca ? " " : ""}

                                ${escaparHTML(
                                    motorista.modelo || "-"
                                )}

                            </td>

                            <td>

                                <strong>
                                    ${escaparHTML(
                                        motorista.placa || "-"
                                    )}
                                </strong>

                            </td>

                            <td>

                                ${escaparHTML(
                                    motorista.telefone || "-"
                                )}

                            </td>

                            <td>

                                ${criarStatusHTML(
                                    status
                                )}

                            </td>

                            <td>

                                <button
                                    type="button"
                                    class="admin-btn-link"
                                    onclick="verMotorista('${motorista.id}')"
                                >
                                    Ver
                                </button>

                            </td>

                        </tr>
                    `;

                }
            ).join("");


    }

    catch (erro) {

        console.error(
            "Erro inesperado ao carregar parceiros:",
            erro
        );

    }

}


// ============================================================
// CRIAR STATUS
// ============================================================

function criarStatusHTML(status) {

    const valor =
        String(status || "")
            .toLowerCase();


    let texto =
        status || "Pendente";


    if (valor === "aprovado") {

        texto =
            "Aprovado";

    }

    else if (
        valor === "reprovado" ||
        valor === "recusado"
    ) {

        texto =
            "Reprovado";

    }

    else if (
        valor === "pendente"
    ) {

        texto =
            "Pendente";

    }


    return `
        <span
            class="status-badge status-${escaparHTML(valor)}"
        >
            ${escaparHTML(texto)}
        </span>
    `;

}


// ============================================================
// CARREGAR VALIDAÇÕES PENDENTES
// ============================================================

async function carregarValidacoes() {

    if (!verificarSupabase()) {
        return;
    }


    console.log(
        "Buscando parceiros pendentes..."
    );


    try {

        const {
            data,
            error
        } =
            await supabaseClient
                .from("motoristas")
                .select(
                    "id,nome,cpf,telefone,email,marca,modelo,cor,ano,placa,assentos,status,created_at"
                )
                .eq(
                    "status",
                    "pendente"
                )
                .order(
                    "created_at",
                    {
                        ascending: false
                    }
                );


        if (error) {

            console.error(
                "Erro ao carregar validações:",
                error
            );

            mostrarErroValidacoes();

            return;

        }


        const quantidade =
            data
                ? data.length
                : 0;


        // =====================================================
        // BADGE
        // =====================================================

        if (badgeValidacao) {

            badgeValidacao.textContent =
                quantidade;

        }


        // =====================================================
        // LISTA PRINCIPAL
        // =====================================================

        if (listaValidacoes) {

            if (quantidade === 0) {

                listaValidacoes.innerHTML = `
                    <i class="fa-solid fa-user-check"></i>

                    <h3>
                        Nenhum cadastro aguardando validação
                    </h3>

                    <p>
                        Quando um parceiro realizar seu cadastro,
                        ele aparecerá nesta área para análise.
                    </p>
                `;

            }

            else {

                listaValidacoes.innerHTML =
                    data.map(
                        criarCardValidacao
                    ).join("");

            }

        }


        // =====================================================
        // DASHBOARD
        // =====================================================

        if (
            listaValidacoesDashboard
        ) {

            if (quantidade === 0) {

                listaValidacoesDashboard.innerHTML = `
                    <i class="fa-solid fa-user-check"></i>

                    <h3>
                        Nenhuma validação pendente
                    </h3>

                    <p>
                        Novos cadastros de parceiros
                        aparecerão aqui.
                    </p>
                `;

            }

            else {

                listaValidacoesDashboard.innerHTML =
                    `
                    <div class="admin-validacoes-resumo">

                        <i class="fa-solid fa-user-clock"></i>

                        <h3>
                            ${quantidade}
                            ${quantidade === 1
                                ? "cadastro aguardando"
                                : "cadastros aguardando"}
                        </h3>

                        <p>
                            Existem parceiros aguardando
                            aprovação administrativa.
                        </p>

                        <button
                            type="button"
                            class="admin-btn-link"
                            onclick="mostrarSecaoPorId('validacao')"
                        >
                            Analisar cadastros
                        </button>

                    </div>
                    `;

            }

        }


    }

    catch (erro) {

        console.error(
            "Erro inesperado nas validações:",
            erro
        );

        mostrarErroValidacoes();

    }

}


// ============================================================
// ERRO NAS VALIDAÇÕES
// ============================================================

function mostrarErroValidacoes() {

    if (badgeValidacao) {

        badgeValidacao.textContent =
            "0";

    }


    const mensagem = `
        <i class="fa-solid fa-triangle-exclamation"></i>

        <h3>
            Não foi possível carregar os cadastros
        </h3>

        <p>
            Verifique as permissões da tabela motoristas.
        </p>
    `;


    if (listaValidacoes) {

        listaValidacoes.innerHTML =
            mensagem;

    }


    if (
        listaValidacoesDashboard
    ) {

        listaValidacoesDashboard.innerHTML =
            mensagem;

    }

}


// ============================================================
// CARD DE VALIDAÇÃO
// ============================================================

function criarCardValidacao(motorista) {

    const id =
        motorista.id;


    return `
        <div class="admin-validacao-card">

            <div class="admin-validacao-cabecalho">

                <div>

                    <span>
                        Novo parceiro
                    </span>

                    <h3>
                        ${escaparHTML(
                            motorista.nome || "-"
                        )}
                    </h3>

                </div>

                ${criarStatusHTML(
                    motorista.status
                )}

            </div>


            <div class="admin-validacao-dados">

                <div>

                    <strong>
                        CPF
                    </strong>

                    <span>
                        ${escaparHTML(
                            motorista.cpf || "-"
                        )}
                    </span>

                </div>


                <div>

                    <strong>
                        Telefone
                    </strong>

                    <span>
                        ${escaparHTML(
                            motorista.telefone || "-"
                        )}
                    </span>

                </div>


                <div>

                    <strong>
                        E-mail
                    </strong>

                    <span>
                        ${escaparHTML(
                            motorista.email || "-"
                        )}
                    </span>

                </div>


                <div>

                    <strong>
                        Veículo
                    </strong>

                    <span>
                        ${escaparHTML(
                            motorista.marca || ""
                        )}
                        ${motorista.marca ? " " : ""}
                        ${escaparHTML(
                            motorista.modelo || "-"
                        )}
                    </span>

                </div>


                <div>

                    <strong>
                        Cor
                    </strong>

                    <span>
                        ${escaparHTML(
                            motorista.cor || "-"
                        )}
                    </span>

                </div>


                <div>

                    <strong>
                        Ano
                    </strong>

                    <span>
                        ${escaparHTML(
                            motorista.ano || "-"
                        )}
                    </span>

                </div>


                <div>

                    <strong>
                        Placa
                    </strong>

                    <span>
                        ${escaparHTML(
                            motorista.placa || "-"
                        )}
                    </span>

                </div>


                <div>

                    <strong>
                        Assentos
                    </strong>

                    <span>
                        ${escaparHTML(
                            motorista.assentos || "-"
                        )}
                    </span>

                </div>


                <div>

                    <strong>
                        Cadastro
                    </strong>

                    <span>
                        ${formatarData(
                            motorista.created_at
                        )}
                    </span>

                </div>

            </div>


            <div class="admin-validacao-acoes">

                <button
                    type="button"
                    class="admin-btn-aprovar"
                    onclick="aprovarMotorista('${id}')"
                >

                    <i class="fa-solid fa-check"></i>

                    Aprovar parceiro

                </button>


                <button
                    type="button"
                    class="admin-btn-reprovar"
                    onclick="reprovarMotorista('${id}')"
                >

                    <i class="fa-solid fa-xmark"></i>

                    Reprovar

                </button>

            </div>

        </div>
    `;

}


// ============================================================
// APROVAR MOTORISTA
// ============================================================

async function aprovarMotorista(id) {

    if (!id) {
        return;
    }


    const confirmar =
        window.confirm(
            "Deseja realmente aprovar este parceiro?"
        );


    if (!confirmar) {
        return;
    }


    if (!verificarSupabase()) {
        return;
    }


    console.log(
        "Aprovando motorista:",
        id
    );


    try {

        const {
            data,
            error
        } =
            await supabaseClient
                .from("motoristas")
                .update({
                    status: "aprovado"
                })
                .eq(
                    "id",
                    id
                )
                .select()
                .single();


        if (error) {

            console.error(
                "Erro ao aprovar motorista:",
                error
            );

            alert(
                "Não foi possível aprovar o parceiro.\n\n" +
                error.message
            );

            return;

        }


        console.log(
            "Motorista aprovado:",
            data
        );


        alert(
            "Parceiro aprovado com sucesso!"
        );


        await atualizarPainel();


    }

    catch (erro) {

        console.error(
            "Erro inesperado ao aprovar motorista:",
            erro
        );

        alert(
            "Ocorreu um erro ao aprovar o parceiro."
        );

    }

}


// ============================================================
// REPROVAR MOTORISTA
// ============================================================

async function reprovarMotorista(id) {

    if (!id) {
        return;
    }


    const confirmar =
        window.confirm(
            "Deseja realmente reprovar este parceiro?"
        );


    if (!confirmar) {
        return;
    }


    if (!verificarSupabase()) {
        return;
    }


    console.log(
        "Reprovando motorista:",
        id
    );


    try {

        const {
            data,
            error
        } =
            await supabaseClient
                .from("motoristas")
                .update({
                    status: "reprovado"
                })
                .eq(
                    "id",
                    id
                )
                .select()
                .single();


        if (error) {

            console.error(
                "Erro ao reprovar motorista:",
                error
            );

            alert(
                "Não foi possível reprovar o parceiro.\n\n" +
                error.message
            );

            return;

        }


        console.log(
            "Motorista reprovado:",
            data
        );


        alert(
            "Parceiro reprovado."
        );


        await atualizarPainel();


    }

    catch (erro) {

        console.error(
            "Erro inesperado ao reprovar motorista:",
            erro
        );

        alert(
            "Ocorreu um erro ao reprovar o parceiro."
        );

    }

}


// ============================================================
// VER MOTORISTA
// ============================================================

function verMotorista(id) {

    console.log(
        "Visualizar motorista:",
        id
    );

    alert(
        "Detalhes do parceiro selecionado.\n\n" +
        "ID: " + id
    );

}


// ============================================================
// VER CLIENTE
// ============================================================

function verCliente(id) {

    console.log(
        "Visualizar cliente:",
        id
    );

    alert(
        "Detalhes do cliente selecionado.\n\n" +
        "ID: " + id
    );

}


// ============================================================
// ATUALIZAR PAINEL
// ============================================================

async function atualizarPainel() {

    console.log(
        "Atualizando painel administrativo..."
    );


    await Promise.all([
        carregarDashboard(),
        carregarClientes(),
        carregarParceiros(),
        carregarValidacoes()
    ]);


    console.log(
        "Painel administrativo atualizado."
    );

}


// ============================================================
// INICIALIZAÇÃO
// ============================================================

async function iniciarAdmin() {

    console.log(
        "Iniciando painel administrativo..."
    );


    if (!verificarSupabase()) {

        console.error(
            "Supabase indisponível."
        );

        return;

    }


    await atualizarPainel();

}


// ============================================================
// AGUARDAR DOM
// ============================================================

if (
    document.readyState === "loading"
) {

    document.addEventListener(
        "DOMContentLoaded",
        iniciarAdmin
    );

}

else {

    iniciarAdmin();

}


// ============================================================
// EXPORTAR FUNÇÕES
// ============================================================

window.aprovarMotorista =
    aprovarMotorista;

window.reprovarMotorista =
    reprovarMotorista;

window.carregarValidacoes =
    carregarValidacoes;

window.carregarParceiros =
    carregarParceiros;

window.carregarClientes =
    carregarClientes;

window.carregarDashboard =
    carregarDashboard;

window.atualizarPainel =
    atualizarPainel;

window.verMotorista =
    verMotorista;

window.verCliente =
    verCliente;


// ============================================================
// FINAL
// ============================================================

console.log(
    "Admin VaidTáxi carregado."
);

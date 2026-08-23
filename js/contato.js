// ============================================================
// CONTATO - VAIDTÁXI
// Formulário de contato + Supabase
// ============================================================


// ============================================================
// ELEMENTOS
// ============================================================

const formContato =
    document.getElementById("formContato");


// ============================================================
// MENSAGEM
// ============================================================

function mostrarMensagemContato(
    texto,
    tipo = "erro"
) {

    let mensagem =
        document.getElementById("mensagemContato");


    // Se ainda não existir no HTML,
    // cria automaticamente.

    if (!mensagem && formContato) {

        mensagem =
            document.createElement("p");

        mensagem.id =
            "mensagemContato";

        mensagem.style.marginTop =
            "15px";

        mensagem.style.textAlign =
            "center";

        mensagem.style.fontSize =
            "14px";

        formContato.appendChild(
            mensagem
        );

    }


    if (!mensagem) {
        return;
    }


    mensagem.textContent =
        texto;


    if (tipo === "sucesso") {

        mensagem.style.color =
            "#00cc66";

    } else {

        mensagem.style.color =
            "#ff4444";

    }

}


// ============================================================
// VERIFICAR SUPABASE
// ============================================================

function verificarSupabaseContato() {

    if (
        typeof supabaseClient ===
        "undefined" ||
        !supabaseClient
    ) {

        console.error(
            "supabaseClient não encontrado."
        );

        mostrarMensagemContato(
            "Erro de conexão com o sistema.",
            "erro"
        );

        return false;
    }


    return true;

}


// ============================================================
// FORMULÁRIO
// ============================================================

if (formContato) {

    formContato.addEventListener(
        "submit",
        async function(event) {

            event.preventDefault();


            // ================================================
            // VERIFICAR SUPABASE
            // ================================================

            if (
                !verificarSupabaseContato()
            ) {

                return;

            }


            // ================================================
            // CAMPOS
            // ================================================

            const campoNome =
                document.getElementById("nome");

            const campoEmail =
                document.getElementById("email");

            const campoTelefone =
                document.getElementById("telefone");

            const campoAssunto =
                document.getElementById("assunto");

            const campoMensagem =
                document.getElementById("mensagem");


            const nome =
                campoNome
                    ? campoNome.value.trim()
                    : "";


            const email =
                campoEmail
                    ? campoEmail.value.trim()
                    : "";


            const telefone =
                campoTelefone
                    ? campoTelefone.value.trim()
                    : "";


            const assunto =
                campoAssunto
                    ? campoAssunto.value.trim()
                    : "";


            const mensagem =
                campoMensagem
                    ? campoMensagem.value.trim()
                    : "";


            // ================================================
            // LIMPAR MENSAGEM
            // ================================================

            mostrarMensagemContato(
                "",
                "sucesso"
            );


            // ================================================
            // VALIDAÇÃO
            // ================================================

            if (
                !nome ||
                !email ||
                !assunto ||
                !mensagem
            ) {

                mostrarMensagemContato(
                    "Preencha todos os campos obrigatórios.",
                    "erro"
                );

                return;

            }


            // ================================================
            // VALIDAR E-MAIL
            // ================================================

            const formatoEmail =
                /^[^\s@]+@[^\s@]+\.[^\s@]+$/;


            if (
                !formatoEmail.test(email)
            ) {

                mostrarMensagemContato(
                    "Informe um e-mail válido.",
                    "erro"
                );

                return;

            }


            // ================================================
            // BOTÃO
            // ================================================

            const botao =
                formContato.querySelector(
                    'button[type="submit"]'
                );


            if (botao) {

                botao.disabled =
                    true;

                botao.textContent =
                    "Enviando...";

            }


            try {

                // ============================================
                // DADOS
                // ============================================

                const dadosContato = {

                    nome: nome,

                    email: email,

                    telefone: telefone || null,

                    assunto: assunto,

                    mensagem: mensagem

                };


                console.log(
                    "Enviando contato:",
                    dadosContato
                );


                // ============================================
                // SALVAR NO SUPABASE
                // ============================================

                const {
                    data,
                    error
                } = await supabaseClient
                    .from("contatos")
                    .insert(
                        dadosContato
                    )
                    .select()
                    .single();


                // ============================================
                // ERRO
                // ============================================

                if (error) {

                    console.error(
                        "Erro ao enviar contato:",
                        error
                    );


                    mostrarMensagemContato(
                        "Não foi possível enviar sua mensagem.",
                        "erro"
                    );


                    restaurarBotaoContato();

                    return;

                }


                // ============================================
                // SUCESSO
                // ============================================

                console.log(
                    "Mensagem enviada:",
                    data
                );


                mostrarMensagemContato(
                    "Mensagem enviada com sucesso! Entraremos em contato em breve.",
                    "sucesso"
                );


                // ============================================
                // LIMPAR FORMULÁRIO
                // ============================================

                formContato.reset();


                if (botao) {

                    botao.textContent =
                        "Mensagem enviada";

                }


                // ============================================
                // RESTAURAR BOTÃO
                // ============================================

                setTimeout(
                    function() {

                        restaurarBotaoContato();

                    },
                    3000
                );

            }


            catch (erro) {

                console.error(
                    "Erro inesperado no contato:",
                    erro
                );


                mostrarMensagemContato(
                    "Erro ao conectar com o sistema.",
                    "erro"
                );


                restaurarBotaoContato();

            }

        }
    );

}


// ============================================================
// RESTAURAR BOTÃO
// ============================================================

function restaurarBotaoContato() {

    if (!formContato) {
        return;
    }


    const botao =
        formContato.querySelector(
            'button[type="submit"]'
        );


    if (!botao) {
        return;
    }


    botao.disabled =
        false;


    botao.textContent =
        "Enviar Mensagem";

}

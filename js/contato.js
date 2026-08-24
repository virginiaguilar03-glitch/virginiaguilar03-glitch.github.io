// ============================================================
// CONTATO - VAIDTÁXI
// Envio de mensagem para o Supabase
// ============================================================


// ============================================================
// INICIAR CONTATO
// ============================================================

document.addEventListener(
    "DOMContentLoaded",
    function () {

        console.log(
            "Contato VaidTáxi iniciado."
        );


        // ========================================================
        // ELEMENTOS
        // ========================================================

        const formContato =
            document.getElementById(
                "formContato"
            );

        const mensagemContato =
            document.getElementById(
                "mensagemContato"
            );

        const btnContato =
            document.getElementById(
                "btnContato"
            );


        // ========================================================
        // VERIFICAR FORMULÁRIO
        // ========================================================

        if (!formContato) {

            console.warn(
                "Formulário de contato não encontrado."
            );

            return;

        }


        // ========================================================
        // MOSTRAR MENSAGEM
        // ========================================================

        function mostrarMensagem(
            texto,
            tipo
        ) {

            if (!mensagemContato) {

                return;

            }


            mensagemContato.textContent =
                texto;


            mensagemContato.className =
                "mensagem-contato " + tipo;


            mensagemContato.style.display =
                "block";

        }


        // ========================================================
        // FORMULÁRIO
        // ========================================================

        formContato.addEventListener(
            "submit",
            async function (event) {

                event.preventDefault();


                console.log(
                    "Formulário de contato enviado."
                );


                // =================================================
                // CAMPOS
                // =================================================

                const nome =
                    document.getElementById(
                        "nome"
                    )?.value.trim();


                const email =
                    document.getElementById(
                        "email"
                    )?.value.trim();


                const telefone =
                    document.getElementById(
                        "telefone"
                    )?.value.trim();


                const mensagem =
                    document.getElementById(
                        "mensagem"
                    )?.value.trim();


                // =================================================
                // VALIDAÇÃO
                // =================================================

                if (
                    !nome ||
                    !email ||
                    !telefone ||
                    !mensagem
                ) {

                    mostrarMensagem(
                        "Preencha todos os campos.",
                        "erro"
                    );

                    return;

                }


                // =================================================
                // VERIFICAR SUPABASE
                // =================================================

                if (
                    typeof supabaseClient ===
                        "undefined" ||
                    !supabaseClient
                ) {

                    console.error(
                        "supabaseClient não encontrado."
                    );


                    mostrarMensagem(
                        "Erro de conexão com o sistema.",
                        "erro"
                    );


                    return;

                }


                // =================================================
                // DESABILITAR BOTÃO
                // =================================================

                if (btnContato) {

                    btnContato.disabled =
                        true;


                    btnContato.textContent =
                        "Enviando...";

                }


                // =================================================
                // DADOS DO CONTATO
                // =================================================

                const dadosContato = {

                    nome: nome,

                    telefone: telefone,

                    email: email,

                    mensagem: mensagem

                };


                // =================================================
                // ENVIAR PARA O SUPABASE
                // =================================================

                try {

                    const {
                        data,
                        error
                    } =
                        await supabaseClient
                            .from("contatos")
                            .insert(
                                dadosContato
                            );


                    // =============================================
                    // ERRO
                    // =============================================

                    if (error) {

                        console.error(
                            "Erro ao enviar contato:",
                            error
                        );


                        mostrarMensagem(
                            "Não foi possível enviar sua mensagem. Tente novamente.",
                            "erro"
                        );


                        return;

                    }


                    // =============================================
                    // SUCESSO
                    // =============================================

                    console.log(
                        "Mensagem enviada com sucesso:",
                        data
                    );


                    mostrarMensagem(
                        "Mensagem enviada com sucesso!",
                        "sucesso"
                    );


                    // =============================================
                    // LIMPAR FORMULÁRIO
                    // =============================================

                    formContato.reset();

                }

                catch (erro) {

                    console.error(
                        "Erro inesperado:",
                        erro
                    );


                    mostrarMensagem(
                        "Ocorreu um erro ao enviar sua mensagem.",
                        "erro"
                    );

                }


                finally {

                    // =============================================
                    // RESTAURAR BOTÃO
                    // =============================================

                    if (btnContato) {

                        btnContato.disabled =
                            false;


                        btnContato.textContent =
                            "Enviar mensagem";

                    }

                }

            }
        );

    }
);

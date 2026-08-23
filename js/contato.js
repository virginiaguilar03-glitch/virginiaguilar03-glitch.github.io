// ============================================================
// CONTATO - VAIDTÁXI
// Envio de mensagem para o Supabase
// ============================================================


// ============================================================
// ELEMENTOS
// ============================================================

const formContato =
    document.getElementById("formContato");

const mensagemContato =
    document.getElementById("mensagemContato");

const btnContato =
    document.getElementById("btnContato");


// ============================================================
// MOSTRAR MENSAGEM
// ============================================================

function mostrarMensagemContato(texto, tipo) {

    if (!mensagemContato) {
        return;
    }

    mensagemContato.textContent = texto;

    if (tipo === "sucesso") {

        mensagemContato.style.color =
            "#00cc66";

    } else {

        mensagemContato.style.color =
            "#ff4444";

    }

}


// ============================================================
// FORMULÁRIO
// ============================================================

if (formContato) {

    formContato.addEventListener(
        "submit",
        async function (event) {

            event.preventDefault();


            // =================================================
            // VERIFICAR SUPABASE
            // =================================================

            if (
                typeof supabaseClient === "undefined" ||
                !supabaseClient
            ) {

                console.error(
                    "supabaseClient não encontrado."
                );

                mostrarMensagemContato(
                    "Erro: conexão com o sistema não encontrada.",
                    "erro"
                );

                return;
            }


            // =================================================
            // PEGAR CAMPOS
            // =================================================

            const nome =
                document
                    .getElementById("nome")
                    ?.value
                    .trim() || "";


            const email =
                document
                    .getElementById("email")
                    ?.value
                    .trim() || "";


            const telefone =
                document
                    .getElementById("telefone")
                    ?.value
                    .trim() || "";


            const assunto =
                document
                    .getElementById("assunto")
                    ?.value
                    .trim() || "";


            const mensagem =
                document
                    .getElementById("mensagem")
                    ?.value
                    .trim() || "";


            // =================================================
            // VALIDAR
            // =================================================

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


            // =================================================
            // DESABILITAR BOTÃO
            // =================================================

            if (btnContato) {

                btnContato.disabled = true;

                btnContato.textContent =
                    "Enviando...";

            }


            mostrarMensagemContato(
                "",
                "sucesso"
            );


            try {

                // =================================================
                // DADOS DO CONTATO
                // =================================================

                const dadosContato = {

                    nome: nome,

                    email: email,

                    telefone: telefone,

                    assunto: assunto,

                    mensagem: mensagem

                };


                // =================================================
                // ENVIAR PARA SUPABASE
                // =================================================

                const {
                    data,
                    error
                } = await supabaseClient
                    .from("contatos")
                    .insert(dadosContato)
                    .select()
                    .single();


                // =================================================
                // ERRO
                // =================================================

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


                // =================================================
                // SUCESSO
                // =================================================

                console.log(
                    "Contato enviado:",
                    data
                );


                mostrarMensagemContato(
                    "Mensagem enviada com sucesso! Entraremos em contato.",
                    "sucesso"
                );


                // Limpar formulário

                formContato.reset();


                // Restaurar botão

                if (btnContato) {

                    btnContato.disabled = false;

                    btnContato.textContent =
                        "Mensagem enviada";

                }


                // Depois de alguns segundos,
                // volta ao texto original

                setTimeout(
                    function () {

                        if (btnContato) {

                            btnContato.textContent =
                                "Enviar Mensagem";

                        }

                    },
                    3000
                );

            }


            // =================================================
            // ERRO INESPERADO
            // =================================================

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

    if (!btnContato) {
        return;
    }

    btnContato.disabled = false;

    btnContato.textContent =
        "Enviar Mensagem";

}

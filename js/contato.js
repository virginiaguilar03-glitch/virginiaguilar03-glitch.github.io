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

function mostrarMensagem(texto, tipo) {

    if (!mensagemContato) {
        return;
    }

    mensagemContato.textContent = texto;

    mensagemContato.className =
        "mensagem-contato " + tipo;

    mensagemContato.style.display = "block";
}


// ============================================================
// FORMULÁRIO DE CONTATO
// ============================================================

if (formContato) {

    formContato.addEventListener(
        "submit",
        async function (event) {

            event.preventDefault();


            // ====================================================
            // CAMPOS
            // ====================================================

            const nome =
                document.getElementById("nome")?.value.trim();

            const email =
                document.getElementById("email")?.value.trim();

            const telefone =
                document.getElementById("telefone")?.value.trim();

            const mensagem =
                document.getElementById("mensagem")?.value.trim();


            // ====================================================
            // VALIDAÇÃO
            // ====================================================

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


            // ====================================================
            // VERIFICAR SUPABASE
            // ====================================================

            if (
                typeof supabaseClient === "undefined"
            ) {

                console.error(
                    "supabaseClient não foi encontrado."
                );

                mostrarMensagem(
                    "Erro de conexão com o sistema.",
                    "erro"
                );

                return;
            }


            // ====================================================
            // DESABILITAR BOTÃO
            // ====================================================

            if (btnContato) {

                btnContato.disabled = true;

                btnContato.textContent =
                    "Enviando...";
            }


            // ====================================================
            // DADOS PARA O SUPABASE
            // ====================================================

            const dadosContato = {

                nome: nome,

                telefone: telefone,

                email: email,

                mensagem: mensagem
            };


            // ====================================================
            // ENVIAR PARA A TABELA CONTATOS
            // ====================================================

            try {

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

                    mostrarMensagem(
                        "Não foi possível enviar sua mensagem. Tente novamente.",
                        "erro"
                    );

                    return;
                }


                // =================================================
                // SUCESSO
                // =================================================

                console.log(
                    "Mensagem enviada com sucesso:",
                    data
                );

                mostrarMensagem(
                    "Mensagem enviada com sucesso!",
                    "sucesso"
                );


                // =================================================
                // LIMPAR FORMULÁRIO
                // =================================================

                formContato.reset();


            } catch (erro) {

                console.error(
                    "Erro inesperado:",
                    erro
                );

                mostrarMensagem(
                    "Ocorreu um erro ao enviar sua mensagem.",
                    "erro"
                );


            } finally {

                // ================================================
                // RESTAURAR BOTÃO
                // ================================================

                if (btnContato) {

                    btnContato.disabled = false;

                    btnContato.textContent =
                        "Enviar mensagem";
                }
            }
        }
    );
}

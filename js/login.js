// ============================================================
// LOGIN - VAIDTÁXI
// ============================================================


// ============================================================
// ELEMENTOS
// ============================================================

const formLogin = document.getElementById("formLogin");
const mensagemLogin = document.getElementById("mensagemLogin");
const btnLogin = document.getElementById("btnLogin");


// ============================================================
// TIPO DE ACESSO
// ============================================================
//
// O login.html deve definir:
//
// window.tipoSelecionado = "cliente"
// window.tipoSelecionado = "parceiro"
// window.tipoSelecionado = "admin"
//
// ============================================================

let tipoSelecionado =
    window.tipoSelecionado || "";


// ============================================================
// LOGIN
// ============================================================

if (formLogin) {

    formLogin.addEventListener(
        "submit",
        async function (event) {

            // Impede o recarregamento da página
            event.preventDefault();


            // =================================================
            // PEGAR DADOS
            // =================================================

            const campoEmail =
                document.getElementById("email");

            const campoSenha =
                document.getElementById("senha");


            const email =
                campoEmail ?
                campoEmail.value.trim() :
                "";


            const senha =
                campoSenha ?
                campoSenha.value :
                "";


            // =================================================
            // ATUALIZAR TIPO SELECIONADO
            // =================================================

            tipoSelecionado =
                window.tipoSelecionado || "";


            // =================================================
            // VALIDAR CAMPOS
            // =================================================

            if (!email || !senha) {

                mostrarMensagem(
                    "Preencha todos os campos.",
                    "erro"
                );

                return;
            }


            // =================================================
            // VALIDAR TIPO DE ACESSO
            // =================================================

            if (!tipoSelecionado) {

                mostrarMensagem(
                    "Selecione como deseja entrar.",
                    "erro"
                );

                return;
            }


            // =================================================
            // VERIFICAR TIPO VÁLIDO
            // =================================================

            const tiposPermitidos = [
                "cliente",
                "parceiro",
                "admin"
            ];


            if (
                !tiposPermitidos.includes(
                    tipoSelecionado
                )
            ) {

                mostrarMensagem(
                    "Tipo de acesso inválido.",
                    "erro"
                );

                return;
            }


            // =================================================
            // VERIFICAR SUPABASE
            // =================================================

            if (
                typeof supabaseClient ===
                "undefined"
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

            if (btnLogin) {

                btnLogin.disabled = true;

                btnLogin.textContent =
                    "Entrando...";

            }


            try {


                // =================================================
                // LOGIN NO SUPABASE
                // =================================================

                const {
                    data,
                    error
                } =
                    await supabaseClient.auth
                        .signInWithPassword({

                            email: email,

                            password: senha

                        });


                // =================================================
                // VERIFICAR ERRO
                // =================================================

                if (error) {

                    console.error(
                        "Erro no login:",
                        error
                    );

                    mostrarMensagem(
                        "E-mail ou senha incorretos.",
                        "erro"
                    );


                    if (btnLogin) {

                        btnLogin.disabled =
                            false;

                        btnLogin.textContent =
                            "Entrar";

                    }

                    return;
                }


                // =================================================
                // VERIFICAR USUÁRIO
                // =================================================

                if (
                    !data ||
                    !data.user
                ) {

                    mostrarMensagem(
                        "Não foi possível identificar sua conta.",
                        "erro"
                    );


                    if (btnLogin) {

                        btnLogin.disabled =
                            false;

                        btnLogin.textContent =
                            "Entrar";

                    }

                    return;
                }


                // =================================================
                // LOGIN REALIZADO
                // =================================================

                console.log(
                    "Usuário conectado:",
                    data.user
                );


                console.log(
                    "Tipo de acesso:",
                    tipoSelecionado
                );


                mostrarMensagem(
                    "Login realizado com sucesso!",
                    "sucesso"
                );


                if (btnLogin) {

                    btnLogin.textContent =
                        "Entrando...";

                }


                // =================================================
                // SALVAR TIPO DE ACESSO
                // =================================================

                localStorage.setItem(
                    "tipoAcesso",
                    tipoSelecionado
                );


                // =================================================
                // SALVAR ID DO USUÁRIO
                // =================================================

                localStorage.setItem(
                    "usuarioId",
                    data.user.id
                );


                // =================================================
                // REDIRECIONAMENTO
                // =================================================

                setTimeout(
                    function () {


                        // =========================================
                        // CLIENTE
                        // =========================================

                        if (
                            tipoSelecionado ===
                            "cliente"
                        ) {

                            window.location.href =
                                "cliente.html";

                            return;
                        }


                        // =========================================
                        // PARCEIRO
                        // =========================================

                        if (
                            tipoSelecionado ===
                            "parceiro"
                        ) {

                            window.location.href =
                                "parceiro.html";

                            return;
                        }


                        // =========================================
                        // ADMINISTRADOR
                        // =========================================

                        if (
                            tipoSelecionado ===
                            "admin"
                        ) {

                            window.location.href =
                                "admin.html";

                            return;
                        }


                        // =========================================
                        // SEGURANÇA
                        // =========================================

                        window.location.href =
                            "index.html";


                    },
                    500
                );

            }


            // ====================================================
            // ERRO INESPERADO
            // ====================================================

            catch (erro) {

                console.error(
                    "Erro inesperado no login:",
                    erro
                );


                mostrarMensagem(
                    "Erro ao conectar com o sistema.",
                    "erro"
                );


                if (btnLogin) {

                    btnLogin.disabled =
                        false;

                    btnLogin.textContent =
                        "Entrar";

                }

            }

        }
    );

}


// ============================================================
// MOSTRAR MENSAGEM
// ============================================================

function mostrarMensagem(
    texto,
    tipo
) {

    if (!mensagemLogin) {

        return;

    }


    mensagemLogin.textContent =
        texto;


    if (
        tipo ===
        "sucesso"
    ) {

        mensagemLogin.style.color =
            "#00cc66";

    }

    else {

        mensagemLogin.style.color =
            "#ff4444";

    }

}

// ============================================================
// LOGIN - VAIDTÁXI
// Supabase Auth + tabela clientes
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

let tipoSelecionado = window.tipoSelecionado || "";


// ============================================================
// LOGIN
// ============================================================

if (formLogin) {

    formLogin.addEventListener("submit", async function (event) {

        // Impede o recarregamento da página
        event.preventDefault();


        // =====================================================
        // PEGAR CAMPOS
        // =====================================================

        const campoEmail = document.getElementById("email");
        const campoSenha = document.getElementById("senha");


        const email = campoEmail
            ? campoEmail.value.trim()
            : "";


        const senha = campoSenha
            ? campoSenha.value
            : "";


        // =====================================================
        // ATUALIZAR TIPO
        // =====================================================

        tipoSelecionado = window.tipoSelecionado || "";


        // =====================================================
        // VALIDAR CAMPOS
        // =====================================================

        if (!email || !senha) {

            mostrarMensagem(
                "Preencha o e-mail e a senha.",
                "erro"
            );

            return;
        }


        // =====================================================
        // VALIDAR TIPO DE ACESSO
        // =====================================================

        if (!tipoSelecionado) {

            mostrarMensagem(
                "Selecione como deseja entrar.",
                "erro"
            );

            return;
        }


        // =====================================================
        // TIPOS PERMITIDOS
        // =====================================================

        const tiposPermitidos = [
            "cliente",
            "parceiro",
            "admin"
        ];


        if (!tiposPermitidos.includes(tipoSelecionado)) {

            mostrarMensagem(
                "Tipo de acesso inválido.",
                "erro"
            );

            return;
        }


        // =====================================================
        // VERIFICAR SUPABASE
        // =====================================================

        if (
            typeof supabaseClient === "undefined" ||
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


        // =====================================================
        // DESABILITAR BOTÃO
        // =====================================================

        if (btnLogin) {

            btnLogin.disabled = true;

            btnLogin.textContent = "Entrando...";

        }


        try {

            // =================================================
            // LOGIN NO SUPABASE AUTH
            // =================================================

            const {
                data,
                error
            } = await supabaseClient.auth.signInWithPassword({

                email: email,

                password: senha

            });


            // =================================================
            // ERRO NO LOGIN
            // =================================================

            if (error) {

                console.error(
                    "Erro no login:",
                    error
                );


                let mensagemErro =
                    "E-mail ou senha incorretos.";


                // E-mail ainda não confirmado
                if (
                    error.message &&
                    error.message.toLowerCase().includes(
                        "email not confirmed"
                    )
                ) {

                    mensagemErro =
                        "Seu e-mail ainda não foi confirmado.";

                }


                // Credenciais inválidas
                else if (
                    error.message &&
                    error.message.toLowerCase().includes(
                        "invalid login credentials"
                    )
                ) {

                    mensagemErro =
                        "E-mail ou senha incorretos.";

                }


                mostrarMensagem(
                    mensagemErro,
                    "erro"
                );


                restaurarBotao();

                return;
            }


            // =================================================
            // VERIFICAR USUÁRIO AUTH
            // =================================================

            if (
                !data ||
                !data.user
            ) {

                mostrarMensagem(
                    "Não foi possível identificar sua conta.",
                    "erro"
                );


                restaurarBotao();

                return;
            }


            // =================================================
            // DADOS DO USUÁRIO
            // =================================================

            const usuario = data.user;

            const usuarioId = usuario.id;


            console.log(
                "Usuário autenticado:",
                usuario
            );


            console.log(
                "ID do usuário:",
                usuarioId
            );


            console.log(
                "Tipo de acesso:",
                tipoSelecionado
            );


            // =================================================
            // CLIENTE
            // =================================================
            //
            // O ID da tabela clientes é o mesmo ID do Auth.
            //
            // Exemplo:
            //
            // Auth:
            // f288166b-dcb5-4567-aba1-ea73217efcb3
            //
            // clientes:
            // f288166b-dcb5-4567-aba1-ea73217efcb3
            //
            // =================================================

            if (tipoSelecionado === "cliente") {

                console.log(
                    "Verificando cliente na tabela clientes..."
                );


                const {
                    data: cliente,
                    error: erroCliente
                } = await supabaseClient
                    .from("clientes")
                    .select("*")
                    .eq("id", usuarioId)
                    .maybeSingle();


                // =============================================
                // ERRO AO CONSULTAR CLIENTE
                // =============================================

                if (erroCliente) {

                    console.error(
                        "Erro ao consultar clientes:",
                        erroCliente
                    );


                    mostrarMensagem(
                        "Não foi possível verificar seu cadastro.",
                        "erro"
                    );


                    restaurarBotao();

                    return;
                }


                // =============================================
                // CLIENTE NÃO ENCONTRADO
                // =============================================

                if (!cliente) {

                    console.error(
                        "Usuário autenticado, mas não encontrado na tabela clientes.",
                        usuarioId
                    );


                    mostrarMensagem(
                        "Sua conta existe, mas o cadastro de cliente não foi encontrado.",
                        "erro"
                    );


                    restaurarBotao();

                    return;
                }


                // =============================================
                // CLIENTE ENCONTRADO
                // =============================================

                console.log(
                    "Cliente encontrado:",
                    cliente
                );


                // Salvar somente identificadores de sessão
                localStorage.setItem(
                    "usuarioId",
                    usuarioId
                );


                localStorage.setItem(
                    "tipoAcesso",
                    "cliente"
                );


                mostrarMensagem(
                    "Login realizado com sucesso!",
                    "sucesso"
                );


                // =============================================
                // REDIRECIONAR
                // =============================================

                setTimeout(function () {

                    window.location.href =
                        "cliente.html";

                }, 500);


                return;
            }


            // =================================================
            // PARCEIRO
            // =================================================

            if (tipoSelecionado === "parceiro") {

                console.log(
                    "Login de parceiro autorizado pelo Auth."
                );


                localStorage.setItem(
                    "usuarioId",
                    usuarioId
                );


                localStorage.setItem(
                    "tipoAcesso",
                    "parceiro"
                );


                mostrarMensagem(
                    "Login realizado com sucesso!",
                    "sucesso"
                );


                setTimeout(function () {

                    window.location.href =
                        "parceiro.html";

                }, 500);


                return;
            }


            // =================================================
            // ADMIN
            // =================================================

            if (tipoSelecionado === "admin") {

                console.log(
                    "Login de administrador autorizado pelo Auth."
                );


                localStorage.setItem(
                    "usuarioId",
                    usuarioId
                );


                localStorage.setItem(
                    "tipoAcesso",
                    "admin"
                );


                mostrarMensagem(
                    "Login realizado com sucesso!",
                    "sucesso"
                );


                setTimeout(function () {

                    window.location.href =
                        "admin.html";

                }, 500);


                return;
            }


            // =================================================
            // SEGURANÇA
            // =================================================

            mostrarMensagem(
                "Tipo de acesso não reconhecido.",
                "erro"
            );


            restaurarBotao();

        }


        // =====================================================
        // ERRO INESPERADO
        // =====================================================

        catch (erro) {

            console.error(
                "Erro inesperado no login:",
                erro
            );


            mostrarMensagem(
                "Erro ao conectar com o sistema.",
                "erro"
            );


            restaurarBotao();

        }

    });

}


// ============================================================
// RESTAURAR BOTÃO
// ============================================================

function restaurarBotao() {

    if (!btnLogin) {
        return;
    }


    btnLogin.disabled = false;

    btnLogin.textContent = "Entrar";

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


    mensagemLogin.textContent = texto;


    if (tipo === "sucesso") {

        mensagemLogin.style.color =
            "#00cc66";

    }

    else {

        mensagemLogin.style.color =
            "#ff4444";

    }

}

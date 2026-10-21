
/* =====================================================
   ASSISTENTE VIRTUAL - VAIDTÁXI
   Conexão com a Edge Function do Supabase
===================================================== */

document.addEventListener("DOMContentLoaded", () => {
    const toggle = document.getElementById("vaid-chat-toggle");
    const janela = document.getElementById("vaid-chat-window");
    const fechar = document.getElementById("vaid-chat-close");
    const formulario = document.getElementById("vaid-chat-form");
    const entrada = document.getElementById("vaid-chat-input");
    const mensagens = document.getElementById("vaid-chat-messages");
    const enviar = document.getElementById("vaid-chat-send");

    if (
        !toggle ||
        !janela ||
        !fechar ||
        !formulario ||
        !entrada ||
        !mensagens ||
        !enviar
    ) {
        console.error(
            "Assistente VaidTáxi: elementos do chat não encontrados."
        );
        return;
    }

    function adicionarMensagem(texto, tipo) {
        const elemento = document.createElement("div");

        elemento.className = `vaid-chat-message ${tipo}`;
        elemento.textContent = texto;

        mensagens.appendChild(elemento);
        mensagens.scrollTop = mensagens.scrollHeight;

        return elemento;
    }

    function abrirChat() {
        janela.hidden = false;
        toggle.setAttribute("aria-expanded", "true");
        entrada.focus();
    }

    function fecharChat() {
        janela.hidden = true;
        toggle.setAttribute("aria-expanded", "false");
        toggle.focus();
    }

    toggle.addEventListener("click", () => {
        if (janela.hidden) {
            abrirChat();
        } else {
            fecharChat();
        }
    });

    fechar.addEventListener("click", fecharChat);

    document.addEventListener("keydown", (evento) => {
        if (evento.key === "Escape" && !janela.hidden) {
            fecharChat();
        }
    });

    adicionarMensagem(
        "Olá! 👋 Sou o assistente virtual do VaidTáxi. Como posso ajudar você hoje?",
        "bot"
    );

    formulario.addEventListener("submit", async (evento) => {
        evento.preventDefault();

        const mensagem = entrada.value.trim();

        if (!mensagem || enviar.disabled) {
            return;
        }

        if (mensagem.length > 2000) {
            adicionarMensagem(
                "Sua mensagem deve ter no máximo 2000 caracteres.",
                "bot"
            );
            return;
        }

        adicionarMensagem(mensagem, "user");

        entrada.value = "";
        enviar.disabled = true;
        entrada.disabled = true;

        const status = adicionarMensagem(
            "Estou preparando sua resposta...",
            "status"
        );

        try {
            console.log(
                "VaidTáxi: verificando conexão com o Supabase..."
            );

            // CORREÇÃO:
            // supabaseClient foi declarado com const em js/supabase.js.
            // Por isso, não devemos procurá-lo em window.supabaseClient.

            if (
                typeof supabaseClient === "undefined" ||
                !supabaseClient ||
                !supabaseClient.functions
            ) {
                throw new Error(
                    "A conexão Supabase não foi encontrada. Confira a ordem dos scripts na página."
                );
            }

            console.log(
                "VaidTáxi: conexão Supabase encontrada."
            );

            const { data, error } =
                await supabaseClient.functions.invoke(
                    "assistente-vaidtaxi",
                    {
                        body: {
                            mensagem: mensagem
                        }
                    }
                );

            if (error) {
                console.error(
                    "Erro ao chamar a função do assistente:",
                    error
                );

                throw new Error(
                    "Não consegui conectar ao assistente. Tente novamente."
                );
            }

            if (!data || !data.resposta) {
                console.error(
                    "Resposta inesperada do assistente:",
                    data
                );

                throw new Error(
                    data?.erro ||
                    "O assistente não retornou uma resposta."
                );
            }

            status.remove();

            adicionarMensagem(
                data.resposta,
                "bot"
            );

            console.log(
                "VaidTáxi: resposta recebida com sucesso."
            );

        } catch (erro) {
            console.error(
                "Erro no assistente VaidTáxi:",
                erro
            );

            status.remove();

            adicionarMensagem(
                erro.message ||
                "Não foi possível responder agora. Tente novamente.",
                "bot"
            );

        } finally {
            enviar.disabled = false;
            entrada.disabled = false;
            entrada.focus();
        }
    });
});

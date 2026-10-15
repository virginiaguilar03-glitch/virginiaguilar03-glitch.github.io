
document.addEventListener("DOMContentLoaded", iniciarConfiguracoes);

let usuarioAtual = null;
let motoristaAtual = null;
let fotoSelecionada = null;

const BUCKET_FOTOS = "fotos-parceiros";

function elemento(id) {
    return document.getElementById(id);
}

function mostrarMensagem(id, texto, tipo = "") {
    const campo = elemento(id);

    if (!campo) return;

    campo.textContent = texto;
    campo.className = "mensagem";

    if (tipo) {
        campo.classList.add(tipo);
    }
}

async function iniciarConfiguracoes() {
    if (typeof supabaseClient === "undefined" || !supabaseClient) {
        mostrarMensagem(
            "mensagemConfiguracoes",
            "Não foi possível conectar ao Supabase. Confira js/supabase.js.",
            "erro"
        );
        return;
    }

    const { data, error } = await supabaseClient.auth.getUser();

    if (error || !data.user) {
        window.location.replace("login.html");
        return;
    }

    usuarioAtual = data.user;

    const tipoAcesso = localStorage.getItem("tipoAcesso");

    if (tipoAcesso && tipoAcesso !== "parceiro") {
        mostrarMensagem(
            "mensagemConfiguracoes",
            "Esta página é exclusiva para parceiros.",
            "erro"
        );
        return;
    }

    configurarSelecaoFoto();
    configurarFormulario();

    await carregarConfiguracoes();
}

async function carregarConfiguracoes() {
    mostrarMensagem("mensagemConfiguracoes", "Carregando seus dados...");

    const metadata = usuarioAtual.user_metadata || {};

    elemento("configNome").value = metadata.nome || "";
    elemento("configTelefone").value = metadata.telefone || "";
    elemento("configEmail").value = usuarioAtual.email || "";

    const fotoUrl = metadata.foto_url || "";

    if (fotoUrl) {
        mostrarPreviaFoto(fotoUrl);
    }

    const { data: motorista, error } = await supabaseClient
        .from("motoristas")
        .select("*")
        .eq("id", usuarioAtual.id)
        .maybeSingle();

    if (error) {
        console.error("Erro ao carregar motorista:", error);

        mostrarMensagem(
            "mensagemConfiguracoes",
            "Não foi possível carregar os dados do veículo. Confira as permissões da tabela motoristas.",
            "erro"
        );
        return;
    }

    motoristaAtual = motorista;

    if (motorista) {
        elemento("configMarca").value = motorista.marca || "";
        elemento("configModelo").value = motorista.modelo || "";
        elemento("configCor").value = motorista.cor || "";
        elemento("configAno").value = motorista.ano || "";
        elemento("configPlaca").value = motorista.placa || "";
        elemento("configPassageiros").value =
            motorista.quantidade_assentos || "";
    } else {
        console.warn(
            "Não existe registro na tabela motoristas para:",
            usuarioAtual.id
        );
    }

    mostrarMensagem(
        "mensagemConfiguracoes",
        motorista
            ? "Dados carregados. Você já pode fazer suas alterações."
            : "Dados pessoais carregados. Não encontramos um cadastro de veículo vinculado a esta conta.",
        motorista ? "sucesso" : "erro"
    );
}

function configurarSelecaoFoto() {
    const campoFoto = elemento("configFoto");

    campoFoto.addEventListener("change", () => {
        const arquivo = campoFoto.files[0];

        fotoSelecionada = null;

        if (!arquivo) {
            elemento("nomeArquivoFoto").textContent =
                "Nenhuma foto selecionada.";
            return;
        }

        const tiposPermitidos = [
            "image/jpeg",
            "image/png",
            "image/webp"
        ];

        if (!tiposPermitidos.includes(arquivo.type)) {
            campoFoto.value = "";

            mostrarMensagem(
                "mensagemFoto",
                "Escolha uma imagem JPG, PNG ou WebP.",
                "erro"
            );
            return;
        }

        if (arquivo.size > 5 * 1024 * 1024) {
            campoFoto.value = "";

            mostrarMensagem(
                "mensagemFoto",
                "A imagem deve ter no máximo 5 MB.",
                "erro"
            );
            return;
        }

        fotoSelecionada = arquivo;

        elemento("nomeArquivoFoto").textContent = arquivo.name;

        const urlTemporaria = URL.createObjectURL(arquivo);
        mostrarPreviaFoto(urlTemporaria);

        mostrarMensagem(
            "mensagemFoto",
            "Foto selecionada. Clique em Salvar alterações para enviá-la.",
            "sucesso"
        );
    });
}

function mostrarPreviaFoto(url) {
    const imagem = elemento("previewFoto");
    const icone = elemento("iconeFoto");

    imagem.src = url;
    imagem.hidden = false;
    icone.hidden = true;
}

async function enviarFoto() {
    if (!fotoSelecionada) {
        return usuarioAtual.user_metadata?.foto_url || null;
    }

    const extensoes = {
        "image/jpeg": "jpg",
        "image/png": "png",
        "image/webp": "webp"
    };

    const extensao = extensoes[fotoSelecionada.type];

    const caminho =
        `${usuarioAtual.id}/${Date.now()}.${extensao}`;

    const { error: erroUpload } = await supabaseClient.storage
        .from(BUCKET_FOTOS)
        .upload(caminho, fotoSelecionada, {
            contentType: fotoSelecionada.type,
            upsert: false
        });

    if (erroUpload) {
        console.error("Erro ao enviar foto:", erroUpload);
        throw new Error(
            "Não foi possível enviar a foto. Confira as políticas do Storage."
        );
    }

    const { data } = supabaseClient.storage
        .from(BUCKET_FOTOS)
        .getPublicUrl(caminho);

    return data.publicUrl;
}

function configurarFormulario() {
    elemento("formConfiguracoesParceiro").addEventListener(
        "submit",
        salvarConfiguracoes
    );
}

async function salvarConfiguracoes(evento) {
    evento.preventDefault();

    const botao = elemento("btnSalvarConfiguracoes");

    botao.disabled = true;
    botao.innerHTML =
        '<i class="fa-solid fa-spinner fa-spin"></i> Salvando...';

    mostrarMensagem("mensagemConfiguracoes", "");

    try {
        const nome = elemento("configNome").value.trim();
        const telefone = elemento("configTelefone").value.trim();

        if (!nome) {
            throw new Error("Informe seu nome completo.");
        }

        let fotoUrl = usuarioAtual.user_metadata?.foto_url || null;

        if (fotoSelecionada) {
            fotoUrl = await enviarFoto();
        }

        const { data: atualizacaoAuth, error: erroAuth } =
            await supabaseClient.auth.updateUser({
                data: {
                    ...usuarioAtual.user_metadata,
                    nome,
                    telefone,
                    foto_url: fotoUrl
                }
            });

        if (erroAuth) {
            throw erroAuth;
        }

        if (atualizacaoAuth.user) {
            usuarioAtual = atualizacaoAuth.user;
        }

        if (!motoristaAtual) {
            mostrarMensagem(
                "mensagemConfiguracoes",
                "Dados pessoais salvos, mas não existe cadastro de veículo vinculado a esta conta. A foto e os dados pessoais foram atualizados.",
                "sucesso"
            );

            fotoSelecionada = null;
            return;
        }

        const anoTexto = elemento("configAno").value.trim();
        const passageirosTexto =
            elemento("configPassageiros").value.trim();

        const ano = anoTexto ? Number(anoTexto) : null;
        const passageiros = passageirosTexto
            ? Number(passageirosTexto)
            : null;

        if (ano !== null && (!Number.isInteger(ano) || ano < 1900 || ano > 2100)) {
            throw new Error("Informe um ano de veículo válido.");
        }

        if (
            passageiros !== null &&
            (!Number.isInteger(passageiros) ||
                passageiros < 1 ||
                passageiros > 20)
        ) {
            throw new Error("A quantidade de passageiros deve estar entre 1 e 20.");
        }

        const dadosVeiculo = {
            marca: elemento("configMarca").value.trim(),
            modelo: elemento("configModelo").value.trim(),
            cor: elemento("configCor").value.trim(),
            ano,
            placa: elemento("configPlaca").value.trim(),
            quantidade_assentos: passageiros
        };

        const { data: motoristaSalvo, error: erroMotorista } =
            await supabaseClient
                .from("motoristas")
                .update(dadosVeiculo)
                .eq("id", usuarioAtual.id)
                .select("id");

        if (erroMotorista) {
            console.error("Erro ao salvar veículo:", erroMotorista);

            throw new Error(
                "Os dados pessoais foram atualizados, mas não foi possível salvar o veículo. Confira as permissões da tabela motoristas."
            );
        }

        if (!motoristaSalvo || motoristaSalvo.length === 0) {
            throw new Error(
                "Os dados pessoais foram atualizados, mas o veículo não foi alterado. Verifique se o registro existe e se as políticas RLS permitem a atualização."
            );
        }

        motoristaAtual = {
            ...motoristaAtual,
            ...dadosVeiculo
        };

        fotoSelecionada = null;

        mostrarMensagem(
            "mensagemFoto",
            "Foto e dados atualizados.",
            "sucesso"
        );

        mostrarMensagem(
            "mensagemConfiguracoes",
            "Configurações salvas com sucesso!",
            "sucesso"
        );
    } catch (erro) {
        console.error("Erro ao salvar configurações:", erro);

        mostrarMensagem(
            "mensagemConfiguracoes",
            erro.message || "Ocorreu um erro ao salvar as configurações.",
            "erro"
        );
    } finally {
        botao.disabled = false;
        botao.innerHTML =
            '<i class="fa-solid fa-floppy-disk"></i> Salvar alterações';
    }
}

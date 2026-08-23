async function solicitarCorrida() {

    const { data: { user } } = await supabase.auth.getUser();

    if (!user) {

        alert("Você precisa fazer login para solicitar uma corrida.");

        window.location.href = "login.html";

        return;

    }

    alert("Usuário logado!");

}

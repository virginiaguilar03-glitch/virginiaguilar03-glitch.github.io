async function login(){

    let email = document.getElementById("email").value;
    let senha = document.getElementById("senha").value;


    if(email === "" || senha === ""){

        alert("Preencha todos os campos.");

        return;

    }


    const { data, error } = await supabaseClient.auth.signInWithPassword({

        email: email,

        password: senha

    });



    if(error){

        alert("E-mail ou senha incorretos.");

        console.log(error);

        return;

    }



    alert("Login realizado com sucesso!");


    window.location.href = "index.html";


}

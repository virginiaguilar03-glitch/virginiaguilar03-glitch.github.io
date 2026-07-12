// ======================================
// Vai dBoa Táxi
// app.js
// ======================================

// Animação ao aparecer na tela

const elementos = document.querySelectorAll(".animate");

const observer = new IntersectionObserver((entries) => {

    entries.forEach((entry) => {

        if(entry.isIntersecting){

            entry.target.classList.add("show");

        }

    });

},{
    threshold:0.2
});

elementos.forEach((elemento)=>{
    observer.observe(elemento);
});


// ==============================
// Header ao rolar a página
// ==============================

const header = document.querySelector("header");

window.addEventListener("scroll",()=>{

    if(window.scrollY > 50){

        header.classList.add("header-scroll");

    }else{

        header.classList.remove("header-scroll");

    }

});


// ==============================
// Ano automático no rodapé
// ==============================

const ano = document.getElementById("ano");

if(ano){

    ano.textContent = new Date().getFullYear();

}

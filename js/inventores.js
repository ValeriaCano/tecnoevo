let cerrar8 = document.querySelectorAll(".close8")[0];
let abrir8 = document.querySelectorAll(".info8")[0];
let modal8 = document.querySelectorAll(".modal-close8")[0];
let modalc8 = document.querySelectorAll(".modal-container8")[0];

abrir8.addEventListener("click", function(e){
    e.preventDefault();
    modalc8.style.opacity = "1";
    modalc8.style.visibility = "visible";
    modal8.classList.toggle("modal-close8");
})
cerrar8.addEventListener("click",function(e){
    e.preventDefault()
    modal8.classList.toggle("modal-close8");
    setTimeout(function(){
    modalc8.style.opacity = "0";
    modalc8.style.visibility = "hidden";

    },900)

});

window.addEventListener("click", function(e){
    if(e.target == modalc){
        modal8.classList.toggle("modal-close8");
        setTimeout(function(){
            modalc8.style.opacity = "0";
            modalc8.style.visibility = "hidden";
        },850)
        
    }
})

function accion(){
    var ancla = document.getElementsByClassName('nav_enlace');
    for(var i = 0; i < ancla.length;i++){
        ancla[i].classList.toggle('desaparecer');
    }
}


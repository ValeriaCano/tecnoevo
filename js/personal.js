const slider = document.querySelector("#slider");
let sliderSection = document.querySelectorAll(".slider_section");
let sliderSectionLast = sliderSection[sliderSection.length -1];

const btnLeft = document.querySelector("#btn-left");
const btnRight = document.querySelector("#btn-right");

slider.insertAdjacentElement('afterbegin', sliderSectionLast);

function Next(){
    let sliderSectionFirst = document.querySelectorAll('.slider_section')[0];
    slider.style.marginLeft = "-200";
    slider.style.transition = "all 0.5s";
    setTimeout(function(){
        slider.style.transition = "none";
        slider.insertAdjacentElement('beforeend', sliderSectionFirst);
        slider.style.marginLeft = "-100%";
    }, 500);
}
btnRight.addEventListener ('click', function(){
    Next();
});

function Prev(){
    let sliderSection = document.querySelectorAll(".slider_section");
let sliderSectionLast = sliderSection[sliderSection.length -1];
    slider.style.marginLeft = "0";
    slider.style.transition = "all 0.5s";
    setTimeout(function(){
        slider.style.transition = "none";
        slider.insertAdjacentElement('afterbegin', sliderSectionLast);
        slider.style.marginLeft = "-100%";
    }, 500);
}
btnRight.addEventListener('click', function(){
    Next();
});
btnLeft.addEventListener('click', function(){
    Prev();
});

/* otro java */

const cardsContainer = document.querySelector(".card-carousel");
const cardsController = document.querySelector(".card-carousel + .card-controller")

class DraggingEvent {
  constructor(target = undefined) {
    this.target = target;
  }
  
  event(callback) {
    let handler;
    
    this.target.addEventListener("mousedown", e => {
      e.preventDefault()
      
      handler = callback(e)
      
      window.addEventListener("mousemove", handler)
      
      document.addEventListener("mouseleave", clearDraggingEvent)
      
      window.addEventListener("mouseup", clearDraggingEvent)
      
      function clearDraggingEvent() {
        window.removeEventListener("mousemove", handler)
        window.removeEventListener("mouseup", clearDraggingEvent)
      
        document.removeEventListener("mouseleave", clearDraggingEvent)
        
        handler(null)
      }
    })
    
    this.target.addEventListener("touchstart", e => {
      handler = callback(e)
      
      window.addEventListener("touchmove", handler)
      
      window.addEventListener("touchend", clearDraggingEvent)
      
      document.body.addEventListener("mouseleave", clearDraggingEvent)
      
      function clearDraggingEvent() {
        window.removeEventListener("touchmove", handler)
        window.removeEventListener("touchend", clearDraggingEvent)
        
        handler(null)
      }
    })
  }
  
  // Get the distance that the user has dragged
  getDistance(callback) {
    function distanceInit(e1) {
      let startingX, startingY;
      
      if ("touches" in e1) {
        startingX = e1.touches[0].clientX
        startingY = e1.touches[0].clientY
      } else {
        startingX = e1.clientX
        startingY = e1.clientY
      }
      

      return function(e2) {
        if (e2 === null) {
          return callback(null)
        } else {
          
          if ("touches" in e2) {
            return callback({
              x: e2.touches[0].clientX - startingX,
              y: e2.touches[0].clientY - startingY
            })
          } else {
            return callback({
              x: e2.clientX - startingX,
              y: e2.clientY - startingY
            })
          }
        }
      }
    }
    
    this.event(distanceInit)
  }
}


class CardCarousel extends DraggingEvent {
  constructor(container, controller = undefined) {
    super(container)
    
    // DOM elements
    this.container = container
    this.controllerElement = controller
    this.cards = container.querySelectorAll(".card")
    
    // Carousel data
    this.centerIndex = (this.cards.length - 1) / 2;
    this.cardWidth = this.cards[0].offsetWidth / this.container.offsetWidth * 100
    this.xScale = {};
    
    // Resizing
    window.addEventListener("resize", this.updateCardWidth.bind(this))
    
    if (this.controllerElement) {
      this.controllerElement.addEventListener("keydown", this.controller.bind(this))      
    }

    
    // Initializers
    this.build()
    
    // Bind dragging event
    super.getDistance(this.moveCards.bind(this))
  }
  
  updateCardWidth() {
    this.cardWidth = this.cards[0].offsetWidth / this.container.offsetWidth * 100
    
    this.build()
  }
  
  build(fix = 0) {
    for (let i = 0; i < this.cards.length; i++) {
      const x = i - this.centerIndex;
      const scale = this.calcScale(x)
      const scale2 = this.calcScale2(x)
      const zIndex = -(Math.abs(i - this.centerIndex))
      
      const leftPos = this.calcPos(x, scale2)
     
      
      this.xScale[x] = this.cards[i]
      
      this.updateCards(this.cards[i], {
        x: x,
        scale: scale,
        leftPos: leftPos,
        zIndex: zIndex
      })
    }
  }
  
  
  controller(e) {
    const temp = {...this.xScale};
      
      if (e.keyCode === 39) {
        // Left arrow
        for (let x in this.xScale) {
          const newX = (parseInt(x) - 1 < -this.centerIndex) ? this.centerIndex : parseInt(x) - 1;

          temp[newX] = this.xScale[x]
        }
      }
      
      if (e.keyCode == 37) {
        // Right arrow
        for (let x in this.xScale) {
          const newX = (parseInt(x) + 1 > this.centerIndex) ? -this.centerIndex : parseInt(x) + 1;

          temp[newX] = this.xScale[x]
        }
      }
      
      this.xScale = temp;
      
      for (let x in temp) {
        const scale = this.calcScale(x),
              scale2 = this.calcScale2(x),
              leftPos = this.calcPos(x, scale2),
              zIndex = -Math.abs(x)

        this.updateCards(this.xScale[x], {
          x: x,
          scale: scale,
          leftPos: leftPos,
          zIndex: zIndex
        })
      }
  }
  
  calcPos(x, scale) {
    let formula;
    
    if (x < 0) {
      formula = (scale * 100 - this.cardWidth) / 2
      
      return formula

    } else if (x > 0) {
      formula = 100 - (scale * 100 + this.cardWidth) / 2
      
      return formula
    } else {
      formula = 100 - (scale * 100 + this.cardWidth) / 2
      
      return formula
    }
  }
  
  updateCards(card, data) {
    if (data.x || data.x == 0) {
      card.setAttribute("data-x", data.x)
    }
    
    if (data.scale || data.scale == 0) {
      card.style.transform = `scale(${data.scale})`

      if (data.scale == 0) {
        card.style.opacity = data.scale
      } else {
        card.style.opacity = 1;
      }
    }
   
    if (data.leftPos) {
      card.style.left = `${data.leftPos}%`        
    }
    
    if (data.zIndex || data.zIndex == 0) {
      if (data.zIndex == 0) {
        card.classList.add("highlight")
      } else {
        card.classList.remove("highlight")
      }
      
      card.style.zIndex = data.zIndex  
    }
  }
  
  calcScale2(x) {
    let formula;
   
    if (x <= 0) {
      formula = 1 - -1 / 5 * x
      
      return formula
    } else if (x > 0) {
      formula = 1 - 1 / 5 * x
      
      return formula
    }
  }
  
  calcScale(x) {
    const formula = 1 - 1 / 5 * Math.pow(x, 2)
    
    if (formula <= 0) {
      return 0 
    } else {
      return formula      
    }
  }
  
  checkOrdering(card, x, xDist) {    
    const original = parseInt(card.dataset.x)
    const rounded = Math.round(xDist)
    let newX = x
    
    if (x !== x + rounded) {
      if (x + rounded > original) {
        if (x + rounded > this.centerIndex) {
          
          newX = ((x + rounded - 1) - this.centerIndex) - rounded + -this.centerIndex
        }
      } else if (x + rounded < original) {
        if (x + rounded < -this.centerIndex) {
          
          newX = ((x + rounded + 1) + this.centerIndex) - rounded + this.centerIndex
        }
      }
      
      this.xScale[newX + rounded] = card;
    }
    
    const temp = -Math.abs(newX + rounded)
    
    this.updateCards(card, {zIndex: temp})

    return newX;
  }
  
  moveCards(data) {
    let xDist;
    
    if (data != null) {
      this.container.classList.remove("smooth-return")
      xDist = data.x / 250;
    } else {

      
      this.container.classList.add("smooth-return")
      xDist = 0;

      for (let x in this.xScale) {
        this.updateCards(this.xScale[x], {
          x: x,
          zIndex: Math.abs(Math.abs(x) - this.centerIndex)
        })
      }
    }

    for (let i = 0; i < this.cards.length; i++) {
      const x = this.checkOrdering(this.cards[i], parseInt(this.cards[i].dataset.x), xDist),
            scale = this.calcScale(x + xDist),
            scale2 = this.calcScale2(x + xDist),
            leftPos = this.calcPos(x + xDist, scale2)
            
    this.updateCards(this.cards[i], {
        scale: scale,
        leftPos: leftPos
    })
    }
}
}

const carousel = new CardCarousel(cardsContainer)





//modal1


let cerrar = document.querySelectorAll(".close")[0];
let abrir = document.querySelectorAll(".info")[0];
let modal = document.querySelectorAll(".modal-close")[0];
let modalc = document.querySelectorAll(".modal-container")[0];

abrir.addEventListener("click", function(e){
    e.preventDefault();
    modalc.style.opacity = "1";
    modalc.style.visibility = "visible";
    modal.classList.toggle("modal-close");
})
cerrar.addEventListener("click",function(e){
    e.preventDefault()
    modal.classList.toggle("modal-close");
    setTimeout(function(){
    modalc.style.opacity = "0";
    modalc.style.visibility = "hidden";

    },900)

});

window.addEventListener("click", function(e){
    if(e.target == modalc){
        modal.classList.toggle("modal-close");
        setTimeout(function(){
            modalc.style.opacity = "0";
            modalc.style.visibility = "hidden";
        },850)
        
    }
})


//modal2

let cerrar2 = document.querySelectorAll(".close2")[0];
let abrir2 = document.querySelectorAll(".info2")[0];
let modal2 = document.querySelectorAll(".modal-close2")[0];
let modalc2 = document.querySelectorAll(".modal-container2")[0];

abrir2.addEventListener("click", function(e){
    e.preventDefault();
    modalc2.style.opacity = "1";
    modalc2.style.visibility = "visible";
    modal2.classList.toggle("modal-close2");
})
cerrar2.addEventListener("click",function(e){
    e.preventDefault()
    modal2.classList.toggle("modal-close2");
    setTimeout(function(){
    modalc2.style.opacity = "0";
    modalc2.style.visibility = "hidden";

    },900)

});

window.addEventListener("click", function(e){
    if(e.target == modalc){
        modal2.classList.toggle("modal-close2");
        setTimeout(function(){
            modalc2.style.opacity = "0";
            modalc2.style.visibility = "hidden";
        },850)
        
    }
})

//modal3

let cerrar3 = document.querySelectorAll(".close3")[0];
let abrir3 = document.querySelectorAll(".info3")[0];
let modal3 = document.querySelectorAll(".modal-close3")[0];
let modalc3 = document.querySelectorAll(".modal-container3")[0];

abrir3.addEventListener("click", function(e){
    e.preventDefault();
    modalc3.style.opacity = "1";
    modalc3.style.visibility = "visible";
    modal3.classList.toggle("modal-close3");
})
cerrar3.addEventListener("click",function(e){
    e.preventDefault()
    modal3.classList.toggle("modal-close3");
    setTimeout(function(){
    modalc3.style.opacity = "0";
    modalc3.style.visibility = "hidden";

    },900)

});

window.addEventListener("click", function(e){
    if(e.target == modalc){
        modal3.classList.toggle("modal-close3");
        setTimeout(function(){
            modalc3.style.opacity = "0";
            modalc3.style.visibility = "hidden";
        },850)
        
    }
})


//modal4

let cerrar4 = document.querySelectorAll(".close4")[0];
let abrir4 = document.querySelectorAll(".info4")[0];
let modal4 = document.querySelectorAll(".modal-close4")[0];
let modalc4 = document.querySelectorAll(".modal-container4")[0];

abrir4.addEventListener("click", function(e){
    e.preventDefault();
    modalc4.style.opacity = "1";
    modalc4.style.visibility = "visible";
    modal4.classList.toggle("modal-close4");
})
cerrar4.addEventListener("click",function(e){
    e.preventDefault()
    modal4.classList.toggle("modal-close4");
    setTimeout(function(){
    modalc4.style.opacity = "0";
    modalc4.style.visibility = "hidden";

    },900)

});

window.addEventListener("click", function(e){
    if(e.target == modalc){
        modal4.classList.toggle("modal-close4");
        setTimeout(function(){
            modalc4.style.opacity = "0";
            modalc4.style.visibility = "hidden";
        },850)
        
    }
})


//modal5

let cerrar5 = document.querySelectorAll(".close5")[0];
let abrir5 = document.querySelectorAll(".info5")[0];
let modal5 = document.querySelectorAll(".modal-close5")[0];
let modalc5 = document.querySelectorAll(".modal-container5")[0];

abrir5.addEventListener("click", function(e){
    e.preventDefault();
    modalc5.style.opacity = "1";
    modalc5.style.visibility = "visible";
    modal5.classList.toggle("modal-close5");
})
cerrar5.addEventListener("click",function(e){
    e.preventDefault()
    modal5.classList.toggle("modal-close5");
    setTimeout(function(){
    modalc5.style.opacity = "0";
    modalc5.style.visibility = "hidden";

    },900)

});

window.addEventListener("click", function(e){
    if(e.target == modalc){
        modal5.classList.toggle("modal-close5");
        setTimeout(function(){
            modalc5.style.opacity = "0";
            modalc5.style.visibility = "hidden";
        },850)
        
    }
})

//modal6

let cerrar6 = document.querySelectorAll(".close6")[0];
let abrir6 = document.querySelectorAll(".info6")[0];
let modal6 = document.querySelectorAll(".modal-close6")[0];
let modalc6 = document.querySelectorAll(".modal-container6")[0];

abrir6.addEventListener("click", function(e){
    e.preventDefault();
    modalc6.style.opacity = "1";
    modalc6.style.visibility = "visible";
    modal6.classList.toggle("modal-close6");
})
cerrar6.addEventListener("click",function(e){
    e.preventDefault()
    modal6.classList.toggle("modal-close6");
    setTimeout(function(){
    modalc6.style.opacity = "0";
    modalc6.style.visibility = "hidden";

    },900)

});

window.addEventListener("click", function(e){
    if(e.target == modalc){
        modal6.classList.toggle("modal-close6");
        setTimeout(function(){
            modalc6.style.opacity = "0";
            modalc6.style.visibility = "hidden";
        },850)
        
    }
})


//modal7

let cerrar7 = document.querySelectorAll(".close7")[0];
let abrir7 = document.querySelectorAll(".info7")[0];
let modal7 = document.querySelectorAll(".modal-close7")[0];
let modalc7 = document.querySelectorAll(".modal-container7")[0];

abrir7.addEventListener("click", function(e){
    e.preventDefault();
    modalc7.style.opacity = "1";
    modalc7.style.visibility = "visible";
    modal7.classList.toggle("modal-close7");
})
cerrar7.addEventListener("click",function(e){
    e.preventDefault()
    modal7.classList.toggle("modal-close7");
    setTimeout(function(){
    modalc7.style.opacity = "0";
    modalc7.style.visibility = "hidden";

    },900)

});

window.addEventListener("click", function(e){
    if(e.target == modalc){
        modal7.classList.toggle("modal-close7");
        setTimeout(function(){
            modalc7.style.opacity = "0";
            modalc7.style.visibility = "hidden";
        },850)
        
    }
})

//modal8

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




















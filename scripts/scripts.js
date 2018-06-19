/**
 * Created by tkasa on 12/06/2018.
 */
var slideImages = document.querySelectorAll('.slide');
var arrowLeft = document.querySelector('#arrow-left');
var arrowRight = document.querySelector('#arrow-right');
var current = 0;

function reset() {
    for(var i=0; i < slideImages.length; i++){
        slideImages[i].style.display = 'none';
    }
}

function startSlide() {
    reset();
    slideImages[0].style.display = 'block';
}

function slideLeft() {
    reset();
    slideImages[current-1].style.display = 'block';
    current--;
}
function slideRight() {
    reset();
    slideImages[current+1].style.display = 'block';
    current++;
}

arrowLeft.addEventListener('click', function () {
    if(current === 0){
        current = slideImages.length;
    }
    slideLeft();
});
arrowRight.addEventListener('click', function () {
    if(current === slideImages.length-1){
        current = -1;
    }
    slideRight()
});

startSlide();

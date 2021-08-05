//좋아요 기능, 찜 기능
const Option_Jjim = document.querySelector('#Option_Jjim')
const Jjim_star = document.querySelector('#star')
const Option_Like = document.querySelector('#Option_Like')
const Like_heart = document.querySelector('#heart')

let Jjim_count =false;
function Jjim_starControl(){
    Jjim_count = !Jjim_count;
}

let Like_count =false;
function Like_heartControl(){
    Like_count = !Like_count;
}

function Jjim(){
    if(Jjim_count){
        Jjim_star.src = "img/yellow-star.png";
    }else{
        Jjim_star.src = 'img/star.png';
    }
}

function Like(){
    if(Like_count){
        Like_heart.src = "img/red-heart.png";
    }else{
        Like_heart.src = "img/heart.png";
    }
}

Option_Jjim.addEventListener('click', Jjim)
Jjim_star.addEventListener('click', Jjim)
Option_Jjim.addEventListener('click', Jjim_starControl)

Option_Like.addEventListener('click', Like)
Like_heart.addEventListener('click',Like)
Option_Like.addEventListener('click', Like_heartControl)

// popup
const popupBtn = document.querySelector(".create-btn");
const popupBg = document.querySelector(".popup-background");
const popupCloseBtn = document.querySelector(".popup-close-btn");
const showPopup = () => {
  popupBg.style.display === "" || popupBg.style.display === "none"
    ? (popupBg.style.display = "block")
    : (popupBg.style.display = "none");
};
const hidePopup = () => {
  popupBg.style.display === "block"
    ? (popupBg.style.display = "none")
    : (popupBg.style.display = "block");
  window.location.reload();
};
popupBtn.addEventListener("click", function () {
  showPopup();
});
popupCloseBtn.addEventListener("click", function () {
  hidePopup();
});
popupBg.addEventListener("click", function () {
  hidePopup();
});

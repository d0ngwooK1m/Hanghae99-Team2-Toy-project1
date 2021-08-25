// const locationHref = window.location.href;
// const findeMypage = locationHref.split("/").reverse()[0];
// // 메인페이지와 마이페이지의 리스트 불러오는 함수 구분처리함.
// window.addEventListener("load", function () {
//   if (findeMypage === "myPage") {
//     myPageList();
//   } else {
//     viewing();
//   }
// });

// if (document.querySelector(".Option_Jjim")) {
//   Option_Jjim.addEventListener("click", Jjim);
//   Jjim_heart.addEventListener("click", Jjim);
//   Option_Jjim.addEventListener("click", Jjim_heartControl);
// }

// if (document.querySelector(".Option_Like") !== null) {
//   Option_Like.addEventListener("click", Like);
//   Like_thumb.addEventListener("click", Like);
//   Option_Like.addEventListener("click", Like_thumbControl);
// }

// // html의 태그들을 변수로 담아두기

// // 찜, 좋아요 기능 임시
// const Option_Jjim = document.querySelector(".Option_Jjim");
// const Jjim_heart = document.querySelector(".heart");
// const Option_Like = document.querySelector(".Option_Like");
// const Like_thumb = document.querySelector(".thumbsUp");
// let Jjim_count = false;

// function Jjim_heartControl() {
//   Jjim_count = !Jjim_count;
// }

// let Like_count = false;

// function Like_thumbControl() {
//   Like_count = !Like_count;
// }

// function Jjim() {
//   if (Jjim_count) {
//     Jjim_heart.src = "../static/img/rheart.svg";
//   } else {
//     Jjim_heart.src = "../static/img/heart.svg";
//   }
// }

// function Like() {
//   if (Like_count) {
//     Like_thumb.src = "../static/img/bthumbsup.svg";
//   } else {
//     Like_thumb.src = "../static/img/thumbsup.svg";
//   }
// }

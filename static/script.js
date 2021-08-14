//좋아요 기능, 찜 기능
// const Option_Jjim = document.querySelector("#Option_Jjim");
// const Jjim_star = document.querySelector("#star");
// const Option_Like = document.querySelector("#Option_Like");
// const Like_heart = document.querySelector("#heart");

// 머지하다가 이 부분 수신 잘못함
// const Option_Jjim = document.querySelector(".Option_Jjim");
// const Jjim_star = document.querySelector(".star");
// const Option_Like = document.querySelector(".Option_Like");
// const Like_heart = document.querySelector(".heart");
// let Jjim_count = false;

// function Jjim_starControl() {
//   Jjim_count = !Jjim_count;
// }

// let Like_count = false;

// function Like_heartControl() {
//   Like_count = !Like_count;
// }

// function Jjim() {
//   if (Jjim_count) {
//     Jjim_star.src = "../static/img/ystar.svg";
//   } else {
//     Jjim_star.src = "../static/img/wstar.svg";
//   }
// }

// function Like() {
//   if (Like_count) {
//     Like_heart.src = "../static/img/rheart.svg";
//   } else {
//     Like_heart.src = "../static/img/wheart.svg";
//   }
// }

// Option_Jjim.addEventListener("click", Jjim);
// Jjim_star.addEventListener("click", Jjim);
// Option_Jjim.addEventListener("click", Jjim_starControl);

// Option_Like.addEventListener("click", Like);
// Like_heart.addEventListener("click", Like);
// Option_Like.addEventListener("click", Like_heartControl);

// // Listmodal
// const openButton = document.querySelector(".preview");
// const modal = document.querySelector(".List_modal");
// const overlay = modal.querySelector(".List_overlay");
// const closeBtn = modal.querySelector("button");
// const openModal = () => {
//   modal.classList.remove("List_hidden");
// };
// const closeModal = () => {
//   modal.classList.add("List_hidden");
// };
// overlay.addEventListener("click", closeModal);
// closeBtn.addEventListener("click", closeModal);
// openButton.addEventListener("click", openModal);

// html의 태그들을 변수로 담아두기
//글작성
const popupBtn = document.querySelector(".create-btn");
const popupBg = document.querySelector(".popup-background");
const popupCloseBtn = document.querySelector(".popup-close-btn");

//회원가입
const signupBtn = document.querySelector(".signup-btn");
const signupBg = document.querySelector(".signup-background");
const signupCloseBtn = document.querySelector(".signup-close-btn");

//로그인
const loginBtn = document.querySelector(".login-btn");
const loginBg = document.querySelector(".login-background");
const loginCloseBtn = document.querySelector(".login-close-btn");

// 아래 url, previewBox 변수는 이미지 미리보기에 사용되며 팝업이 닫힐때 지워져야 합니다.
let url = document.querySelector(".preview-url");
let previewBox = document.querySelector(".preview-image-wrap");
// 팝업 기능을 하는 함수는 하나로 통일하고자 만듬 (팝업의 기능은 같기때문에)
const handlePopup = (e, tag) => {
  // 전체 영역을 덮는 backgorund에 click 이벤트가 발생되어 자식에도 이벤트 전파되는 현상 막기
  if (e.target.className !== e.currentTarget.className) {
    return null;
  }
  // 함수의 매개변수로 받은 tag에 show라는 클래스가 있는지 확인하기
  if (tag.classList.contains("show")) {
    // tag에 show라는 클래스가 있으면 show 클래스를 지워서 팝업 닫기
    tag.classList.remove("show");
    url.value = "";
    previewBox.innerHTML = "";
  } else {
    // tag에 show라는 클래스가 없으면 show 클래스를 추가해서 팝업 보이기
    tag.classList.add("show");
  }
};

// 변수로 담아둔 태그를 클릭했을때 팝업 함수 실행
//글작성
popupBtn.addEventListener("click", (e) => handlePopup(e, popupBg));
popupCloseBtn.addEventListener("click", (e) => handlePopup(e, popupBg));
popupBg.addEventListener("click", (e) => handlePopup(e, popupBg));

//회원가입
signupBtn.addEventListener("click", (e) => handlePopup(e, signupBg));
signupCloseBtn.addEventListener("click", (e) => handlePopup(e, signupBg));
signupBg.addEventListener("click", (e) => handlePopup(e, signupBg));

//로그인
loginBtn.addEventListener("click", (e) => handlePopup(e, loginBg));
loginCloseBtn.addEventListener("click", (e) => handlePopup(e, loginBg));
loginBg.addEventListener("click", (e) => handlePopup(e, loginBg));

//새로고침
$(document).ready(function () {
  viewing();
});
//뷰?
function viewing() {
  $.ajax({
    type: "GET",
    url: "/view",
    data: {},
    success: function (response) {
      let lists = response["all_post"];
      console.log(lists);
      for (let i = 0; i < lists.length; i++) {
        let url = lists[i]["url"];
        let title = lists[i]["title"];
        let desc = lists[i]["desc"];

        let temp_html = `<div class="ListBg">
                            <div class="ListFlex">
                                <img src="../static/img/vatican.jpg" class="classImg">
                                <div class="Option">
                                    <div class="Like Option_Like">
                                                  <div><img src="../static/img/wheart.svg" class="heart"></div>
                                                  <div class="LikeNum">1</div>
                                    </div>
                                    <div class="FixedOption"><a href="${url}" target= '_blank'><img src="../static/img/wlink.svg"></a></div>
                                    <div class="FixedOption Option_Jjim">
                                        <div><img src="../static/img/wstar.svg" class="star"></div>
                                    </div>
                                </div>
                                <div class="high-low">
                                    <hr class="titleLine">
                                    <div class ="title">${title}</div>
                                    <div class ="desc">${desc}</div>
                                </div>
                                <div>
                                    <button class ="preview" href=".List_modal">preview</button>
                                </div>
                            </div>
                        </div>`;
        $(".cardRow").append(temp_html);
      }
    },
  });
}

//등록
function posting() {
  let url = document.getElementById("url").value;
  let title = document.getElementById("title").value;
  let desc = document.getElementById("description").value;

  $.ajax({
    type: "POST",
    url: "/test",
    data: { url_give: url, title_give: title, desc_give: desc },
    success: function (response) {
      alert(response["msg"]);
      window.location.reload();
    },
  });
}

// 카드 등록에서 URL을 입력하면 해당 OG:IMAGE 미리보게 하는 함수
const previewBtn = document.querySelector(".preview-btn");
previewBtn.addEventListener("click", (e) => {
  const urlValue = url.value;
  // input 값 작성안하고 button 클릭 했을 경우
  if (urlValue === "") {
    alert("WEB URL주소를 입력해주세요");
    return null;
  }
  $.ajax({
    type: "POST",
    url: "/create/previewImage",
    data: { url_give: urlValue },
    success: function (response) {
      console.log("response === ", response);
      const url = response;
      if (url !== "") {
        previewBox.innerHTML = `<img src="${url}" alt="썸네일"/>`;
      } else {
        // og:image가 없을 경우 기본 이미지로 대체
        previewBox.innerHTML = `<img src="../static/img/og_base.png" alt="썸네일"/>`;
      }
    },
    error: function (e) {
      if (e.status === 500) {
        alert("error");
        console.log("error === ", e);
      }
    },
  });
});

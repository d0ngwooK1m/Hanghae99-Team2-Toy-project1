const Option_Jjim = document.querySelector(".Option_Jjim");
const Jjim_heart = document.querySelector(".heart");
const Option_Like = document.querySelector(".Option_Like");
const Like_thumb = document.querySelector(".thumbsUp");
let Jjim_count = false;

function Jjim_heartControl() {
  Jjim_count = !Jjim_count;
}

let Like_count = false;

function Like_thumbControl() {
  Like_count = !Like_count;
}

function Jjim() {
  if (Jjim_count) {
    Jjim_heart.src = "../static/img/rheart.svg";
  } else {
    Jjim_heart.src = "../static/img/heart.svg";
  }
}

function Like() {
  if (Like_count) {
    Like_thumb.src = "../static/img/bthumbsup.svg";
  } else {
    Like_thumb.src = "../static/img/thumbsbup.svg";
  }
}

Option_Jjim.addEventListener("click", Jjim);
Jjim_heart.addEventListener("click", Jjim);
Option_Jjim.addEventListener("click", Jjim_heartControl);

Option_Like.addEventListener("click", Like);
Like_thumb.addEventListener("click", Like);
Option_Like.addEventListener("click", Like_thumbControl);

// Listmodal
// const openButton = document.querySelector(".ListBg");
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
let detailUrl = document.querySelector(".modify-preview-url");
let detailPreviewBox = document.querySelector(".detail-image-wrap");

// popup 함수 show, hide로 분리
const showPopup = (tag) => {
  tag.classList.add("show");
};
const hidePopup = (e, tag) => {
  e.preventDefault();
  e.stopPropagation();
  console.log("e = ", e);
  if (e.target.className !== e.currentTarget.className) {
    return null;
  }
  if (tag.className === "popup-detail-background") {
    console.log("popup-detail-background");
  }
  tag.classList.remove("show");
  url.value = "";
  previewBox.innerHTML = "";
  // showDetailForm.classList.remove("show")
};

//글작성
popupBtn.addEventListener("click", () => showPopup(popupBg));
popupCloseBtn.addEventListener("click", (e) => hidePopup(e, popupBg));
popupBg.addEventListener("click", (e) => hidePopup(e, popupBg));

//회원가입
signupBtn.addEventListener("click", () => showPopup(signupBg));
signupCloseBtn.addEventListener("click", (e) => hidePopup(e, signupBg));
signupBg.addEventListener("click", (e) => hidePopup(e, signupBg));

//로그인
loginBtn.addEventListener("click", () => showPopup(loginBg));
loginCloseBtn.addEventListener("click", (e) => hidePopup(e, loginBg));
loginBg.addEventListener("click", (e) => hidePopup(e, loginBg));

// 상세보기
// detailBtn.addEventListener("click", () => showPopup(detailBg));
// detailCloseBtn.addEventListener("click", (e) => hidePopup(e, detailBg));
// detailBg.addEventListener("click", (e) => hidePopup(e, detailBg));

//회원가입
$("form[name=signup_form]").submit(function (e) {
  const form_give = $(this);
  const error_give = form_give.find(".error");
  const data_give = form_give.serialize();

  $.ajax({
    url: "/user/signup",
    type: "POST",
    data: data_give,
    dataType: "json",
    success: function (response) {
      window.location.href = "/";
    },
    error: function (response) {
      console.log(response);
      error_give.text(response.responseJSON.error).removeClass("error--hidden");
    },
  });

  e.preventDefault();
});

//로그인
$("form[name=login_form]").submit(function (e) {
  const form_give = $(this);
  const error_give = form_give.find(".error");
  const data_give = form_give.serialize();

  $.ajax({
    url: "/user/login",
    type: "POST",
    data: data_give,
    dataType: "json",
    success: function (response) {
      window.location.href = "/";
    },
    error: function (response) {
      console.log(response);
      error_give.text(response.responseJSON.error).removeClass("error--hidden");
    },
  });

  e.preventDefault();
});

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
                                <div class="imgHidden-box">
                                    <img src="../static/img/vatican.jpg" class="classImg">
                                    <button class="Jjim Option_Jjim">
                                            <div><img src="../static/img/heart.svg" class="heart"></div>
                                    </button>
                                </div>  
                                <div class ="title">${title}</div>
                                <div class ="numCount">
                                    <div class = "likeNum">
                                        <img src="../static/img/likeUp3.png">
                                        <span>5342</span>
                                    </div>
                                    <div class = "JjimNum">
                                        <img src="../static/img/Rheart.svg">
                                        <span>1783</span>
                                    </div>
                                </div>
                                <hr/>
                                <div class="Option">
                                    <div class="Like Option_Like">
                                        <img src="../static/img/thumbsup.svg" class="thumbsUp">
                                        <span>좋아요</span>
                                    </div>
                                    <a class="Link" href="${url}" target= '_blank'>
                                        <span>바로가기</span>
                                    </a>
                                </div>
                            </div>
                        </div>`;
        $(".cardRow").append(temp_html);
      }
    },
  });
}

//등록
const createBtn = document.querySelector(".create-form-btn");
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
createBtn.addEventListener("click", posting);

// 카드 등록에서 URL을 입력하면 해당 OG:IMAGE 미리보게 하는 함수
const previewBtn = document.querySelector(".preview-btn");
const modifyPreviewBtn = document.querySelector(".modify-preview-btn");
const previewImage = (e, tag) => {
  const urlValue = url.value;
  const modifyUrlValue = detailUrl.value;
  $.ajax({
    type: "POST",
    url: "/create/previewImage",
    data: {
      url_give: tag.className === "preview-btn" ? urlValue : modifyUrlValue,
    },
    success: function (response) {
      const url = response;
      if (tag.className === "preview-btn" && url !== "") {
        previewBox.innerHTML = `<img src="${url}" alt="썸네일"/>`;
      } else if (tag.className === "modify-preview-btn" && url !== "") {
        detailPreviewBox.innerHTML = `<img src="${url}" alt="img" />`;
      }
      // if (url !== "") {
      //   previewBox.innerHTML = `<img src="${url}" alt="썸네일"/>`;
      // } else {
      //   // og:image가 없을 경우 기본 이미지로 대체
      //   previewBox.innerHTML = `<img src="../static/img/og_base.jpg" alt="썸네일"/>`;
      // }
    },
    error: function (e) {
      if (e.status === 500) {
        alert("error");
        console.log("error === ", e);
      }
    },
  });
};
previewBtn.addEventListener("click", (e) => previewImage(e, previewBtn));
modifyPreviewBtn.addEventListener("click", (e) =>
  previewImage(e, modifyPreviewBtn)
);

// 상세보기 팝업
const detailBtn = document.querySelector(".ListBg");
const detailBg = document.querySelector(".popup-detail-background");
const detailCloseBtn = document.querySelector(".popup-detail-close-btn");
// 수정하기 버튼
const modifyBtn = document.querySelector(".detail-modify-btn");
const hideDetailForm = document.querySelector(".detail-form");
const showDetailForm = document.querySelector(".detail-modify-form");

detailBtn.addEventListener("click", () => showDetail(detailBg));
detailCloseBtn.addEventListener("click", (e) => hideDetail(e, detailBg));
detailBg.addEventListener("click", (e) => hideDetail(e, detailBg));
modifyBtn.addEventListener("click", (e) => showDetail(showDetailForm));

const test = document.querySelector(".detail-popup-wrap");
const test2 = document.querySelector(".detail-popup");
const showDetail = (tag) => {
  if (tag.classList.contains("detail-modify-form")) {
    modifyBtn.style.display = "none";
    hideDetailForm.style.display = "none";
  }
  tag.classList.add("show");
};
const hideDetail = (e, tag) => {
  if (e.target.className !== e.currentTarget.className) {
    return null;
  }
  tag.classList.remove("show");
  showDetailForm.classList.remove("show");
  modifyBtn.style.display = "block";
  hideDetailForm.style.display = "block";
  previewBox.innerHTML = "";
  // image 미리보기 버튼 클릭하고, 수정안하고 팝업닫을때
  // detailPreviewBox.innerHTML = ``;
};



window.addEventListener("load", function () {
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
                                    <button class="Option_Jjim">
                                        <img src="../static/img/heart.svg" class="heart">
                                    </button>
                                </div>  
                                <h3 class ="title">${title}</h3>
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
                                        <span>추천하기</span>
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
// 찜, 좋아요 기능 임시
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
    Like_thumb.src = "../static/img/thumbsup.svg";
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

// popup 함수 show, hide로 분리
const showPopup = (e, tag) => {
  if (e.target.className === "Option_Jjim" || e.target.className === "heart") {
    return null;
  }
  tag.classList.add("show");
};
const hidePopup = (e, tag) => {
  if (e.target.className !== e.currentTarget.className) {
    return null;
  }
  tag.classList.remove("show");
};

//글작성
if(document.querySelector('.create-btn') !== null) {
  popupBtn.addEventListener("click", (e) => showPopup(e, popupBg));
  popupCloseBtn.addEventListener("click", (e) => hidePopup(e, popupBg));
  popupBg.addEventListener("click", (e) => hidePopup(e, popupBg));
}


//회원가입
if(document.querySelector('.signup-btn') !== null) {
  signupBtn.addEventListener("click", (e) => showPopup(e, signupBg));
  signupCloseBtn.addEventListener("click", (e) => hidePopup(e, signupBg));
  signupBg.addEventListener("click", (e) => hidePopup(e, signupBg));
}

//로그인
if(document.querySelector('.login-btn') !== null) {
  loginBtn.addEventListener("click", () => showPopup(loginBg));
  loginCloseBtn.addEventListener("click", (e) => hidePopup(e, loginBg));
  loginBg.addEventListener("click", (e) => hidePopup(e, loginBg));
}

//회원가입 API 통신
$("form[name=signup_form]").submit(function(e) {
    const form_give = $(this);
    const error_give = form_give.find(".error");
    const data_give = form_give.serialize();

    $.ajax({
        url: "/user/signup",
        type: "POST",
        data: data_give,
        dataType: "json",
        success: function(response) {
            window.location.href = "/";
            console.log(response);
        },
        error: function(response) {
            console.log(response);
            error_give.text(response.responseJSON.error).removeClass("error--hidden");
        }
    })

    e.preventDefault();
})

//로그인 API 통신
$("form[name=login_form]").submit(function(e) {
    const form_give = $(this);
    const error_give = form_give.find(".error");
    const data_give = form_give.serialize();

    $.ajax({
        url: "/user/login",
        type: "POST",
        data: data_give,
        dataType: "json",
        success: function(response) {
            window.location.href = "/";
            $.cookie('login_token', response['login_token'], { path: '/' });
            // console.log(document.cookie);
        }
        ,
        error: function(response) {
            console.log(response);
            error_give.text(response.responseJSON.error).removeClass("error--hidden");
        }
    })

    e.preventDefault();
})

//로그아웃 API 통신
$('.logout-btn').click(function(e) {
    $.ajax({
        url: "user/logout",
        type: "GET",
        data: {},
        dataType: "json",
        success: function(response) {
            $.removeCookie('login_token', { path: '/' })
            window.location.href = "/";
        }
    })

    e.preventDefault();
})

//등록권한 없음
function postingFail() {
    alert('사용권한이 없습니다');
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

// 상세보기 팝업
const detailBtn = document.querySelector(".ListBg");
const detailBg = document.querySelector(".popup-detail-background");
const detailCloseBtn = document.querySelector(".popup-detail-close-btn");
// 수정하기 버튼
const modifyBtn = document.querySelector(".detail-modify-btn");
const detailForm = document.querySelector(".detail-form");
const modifyForm = document.querySelector(".modify-form");
modifyBtn.addEventListener("click", () => modifyPopup());
// 상세보기
detailBtn.addEventListener("click", (e) => showPopup(e, detailBg));
detailCloseBtn.addEventListener("click", (e) => hideDetailPopup(e, detailBg));
detailBg.addEventListener("click", (e) => hideDetailPopup(e, detailBg));

// 수정 팝업
const modifyPopup = () => {
  modifyBtn.style.display = "none";
  detailForm.style.display = "none";
  modifyForm.innerHTML = `
      <div class="modify-image-wrap">
        <img class="detail-image-wrap" src="/static/img/생활코딩.png"  alt="image"/>
      </div>
      <div class="popup-box-wrap">
          <label for="url">웹 사이트 URL</label>
          <div class="flex-layout">
              <input class="modify-preview-url" type="text" id="url" name="url" placeholder="https://www.inflearn.com"/>
              <button class="modify-preview-btn" onclick="previewImage()">미리보기</button>
          </div>
      </div>
      <div class="popup-box-wrap">
          <label for="title">제목</label>
          <input  type="text" id="title" name="title" placeholder="******"/>
      </div>
      <div class="popup-box-wrap">
          <label for="description">설명</label>
          <textarea type="text" id="description" name="description" rows="6" placeholder="사이트에 대한 간략한 설명을 입력해주세요"></textarea>
      </div>
      <div class="popup-box-wrap">
          <button  class="modify-form-btn">수정하기</button>
      </div>
  `;
};

// 상세보기 닫기 팝업만 따로 분리함
const hideDetailPopup = (e, tag) => {
  if (e.target.className !== e.currentTarget.className) {
    return null;
  }
  if (e.target.className) tag.classList.remove("show");
  modifyBtn.style.display = "block";
  detailForm.style.display = "block";
  modifyForm.innerHTML = ``;
};

let url = document.querySelector(".preview-url");
let previewBox = document.querySelector(".preview-image-wrap");
const previewBtn = document.querySelector(".preview-btn");

previewBtn.addEventListener("click", () => previewImage(previewBtn));

// 미리보기 클릭했을 때 og:image 가져오는 함수.
// 등록 팝업과 상세보기 팝업에서 공통으로 쓰임
const previewImage = (tag) => {
  let value = "";
  let modifyWrap = ``;
  const urlValue = url.value;
  let check = true;
  // 상세보기 팝업을 클릭했을때 동적으로 html이 생성되어
  // 수정 버튼의 미리보기 버튼은 등록 팝업에서는 생성되지 않은 상태이기 때문에
  // undefined 조건값을 추가함
  if (tag === undefined) {
    // 수정 팝업의 미리보기 버튼 클릭시
    const modifyUrlValue = document.querySelector(".modify-preview-url").value;
    const modifyPreviewWrap = document.querySelector(".modify-image-wrap");
    value = modifyUrlValue;
    modifyWrap = modifyPreviewWrap;
    check = false;
  } else {
    value = urlValue;
  }

  $.ajax({
    type: "POST",
    url: "/create/previewImage",
    data: {
      url_give: value,
    },
    success: function (response) {
      const url = response;
      // og:image가 없을 경우 기본 이미지 나오게
      if (url === "" && check) {
        previewBox.innerHTML = `<img src="../static/img/og_base.jpg" alt="썸네일"/>`;
      } else if (url === "" && !check) {
        modifyWrap.innerHTML = `<img class="detail-image-wrap" src="../static/img/og_base.jpg" alt="썸네일"/>`;
      }
      // og:image가 있을 경우
      if (value === urlValue) {
        previewBox.innerHTML = `<img src="${url}" alt="썸네일"/>`;
      } else {
        modifyWrap.innerHTML = `<img class="detail-image-wrap" src="${url}" alt="썸네일"/>`;
      }
    },
    error: function (e) {
      if (e.status === 500) {
        alert("이미지를 가져올 수 없습니다.");
        console.log("error === ", e);
      }
    },
  });
};

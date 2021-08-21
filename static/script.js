window.addEventListener("load", function () {
  viewing();
});
//뷰?
let cardRow = document.querySelector(".cardRow");
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
        let likes = lists[i]["likes"];
        let imgsrc = lists[i]["imgsrc"];
        let id = lists[i]["id"];
        //_id는 안잡힌다, id를 따로 주어야 잡힐 듯?
        console.log(String(id));

        let temp_html = `<div class="ListBg">
                            <div class="ListFlex">
                                <div class="click-wrap" onclick="showDetail('${id}')">
                                    <div class="imgHidden-box">
                                        <img src="${imgsrc}" class="classImg">
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
                                            <span>${likes}</span>
                                        </div>
                                    </div>
                                    <hr/>
                                </div>
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
//회원가입 API 통신
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
      console.log(response);
    },
    error: function (response) {
      console.log(response);
      error_give.text(response.responseJSON.error).removeClass("error--hidden");
    },
  });

  e.preventDefault();
});
//로그인 API 통신
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
      $.cookie("login_token", response["login_token"], { path: "/" });
      // console.log(document.cookie);
    },
    error: function (response) {
      console.log(response);
      error_give.text(response.responseJSON.error).removeClass("error--hidden");
    },
  });

  e.preventDefault();
});

//로그아웃 API 통신
$(".logout-btn").click(function (e) {
  $.ajax({
    url: "user/logout",
    type: "GET",
    data: {},
    dataType: "json",
    success: function (response) {
      $.removeCookie("login_token", { path: "/" });
      window.location.href = "/";
    },
  });

  e.preventDefault();
});

//등록권한 없음
function postingFail() {
  alert("사용권한이 없습니다");
}

function showDetail(id) {
  $.ajax({
    type: "GET",
    url: "/test/detail",
    data: { id_give: id },
    success: function (response) {
      const detail = response["response"][0];
      const title = detail["title"];
      const desc = detail["desc"];
      const id = detail["id"];
      const imgsrc = detail["imgsrc"];
      const detailWrap = document.querySelector(".popup-detail-wrap");
      console.log(detail);

      const html = `<div class="popup-detail-background show">
                            <div class="popup-wrap">
                                <button class="popup-detail-close-btn">닫기</button>
                                <div class="popup-scroll-wrap">
                                    <section class="popup-content">
                                        <h2 class="readable-hidden">상세보기 팝업</h2>
                                        <div class="detail-btn-wrap flex-layout-end">
                                            <button class="detail-modify-btn" onclick="editPopup('${id}')">수정</button>
                                            <button class="detail-delete-btn" onclick="deletePopup('${id}')">삭제</button>
                                        </div>

                                        <div class="popup-form detail-form-wrap">
                                            <div class="detail-form">
                                                <div class="preview-image-wrap">
                                                    <img class="detail-image-wrap" src="${imgsrc}" target="_blank"/>
                                                </div>
                                                <div class="detail-content-wrap">
                                                    <h3>${title}</h3>
                                                    <p>${desc}</p>
                                                </div>
                                            </div>
                                            <div class="modify-form"></div>
                                        </div>
                                    </section>
                                </div>
                            </div>
                        </div>`;
      detailWrap.innerHTML = html;
      const detailBg = document.querySelector(".popup-detail-background");
      const detailCloseBtn = document.querySelector(".popup-detail-close-btn");

      if (document.querySelector(".show") !== null) {
        detailCloseBtn.addEventListener("click", (e) =>
          hideDetailPopup(e, detailBg)
        );
        detailBg.addEventListener("click", (e) => hideDetailPopup(e, detailBg));
      }
    },
  });
}

function editPopup(id) {
  $.ajax({
    type: "GET",
    url: "/test/edit",
    data: { id_give: id },
    success: function (response) {
      const detail = response["response"][0];
      const title = detail["title"];
      const desc = detail["desc"];
      const url = detail["url"];
      const id = detail["id"];
      const imgsrc = detail["imgsrc"];
      // const detailWrap = document.querySelector(".popup-detail-wrap");
      const modifyBtn = document.querySelector(".detail-modify-btn");
      const detailForm = document.querySelector(".detail-form");
      const modifyForm = document.querySelector(".modify-form");

      modifyBtn.style.display = "none";
      detailForm.style.display = "none";
      modifyForm.innerHTML = `
                                    <form action="/test/submitEdit" method="POST" class="edit-form">
                                      <div class="modify-image-wrap">
                                        <img class="detail-image-wrap" src="${imgsrc}"  alt="image"/>
                                      </div>
                                      <div class="popup-box-wrap">
                                          <label for="url">웹 사이트 URL</label>
                                          <div class="flex-layout">
                                              <input class="modify-preview-url" type="text" id="url" name="url" value="${url}"/>
                                              <button class="modify-preview-btn" onclick="previewImage()">미리보기</button>
                                          </div>
                                      </div>
                                      <div class="popup-box-wrap">
                                          <label for="title">제목</label>
                                          <input  type="text" id="title" name="title" value="${title}"/>
                                      </div>
                                      <div class="popup-box-wrap">
                                          <label for="description">설명</label>
                                          <textarea type="text" id="description" name="description" rows="6" value="사이트에 대한 간략한 설명을 입력해주세요" >${desc}</textarea>
                                      </div>
                                      <textarea name="id" id="" cols="0" rows="0" style="display: none">${id}</textarea>
                                      <div class="popup-box-wrap">
                                          <button  class="modify-form-btn">수정하기</button>
                                      </div>
                                    </form>
                                    `;
    },
    error: function (response) {
      alert(response.responseJSON["response"]);
      // console.log(response.responseJSON['response'])
    },
  });
}

function deletePopup(id) {
  $.ajax({
    type: "POST",
    url: "/test/delete",
    data: { id_give: id },
    success: function (response) {
      alert(response["response"]);
      window.location.href = "/";
    },
    error: function (response) {
      alert(response.responseJSON["response"]);
      // console.log(response.responseJSON['response'])
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

if (document.querySelector(".Option_Jjim")) {
  Option_Jjim.addEventListener("click", Jjim);
  Jjim_heart.addEventListener("click", Jjim);
  Option_Jjim.addEventListener("click", Jjim_heartControl);
}

if (document.querySelector(".Option_Like") !== null) {
  Option_Like.addEventListener("click", Like);
  Like_thumb.addEventListener("click", Like);
  Option_Like.addEventListener("click", Like_thumbControl);
}

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
  return tag.classList.add("show");
};

const hidePopup = (e, tag) => {
  if (e.target.className !== e.currentTarget.className) {
    return null;
  }
  tag.classList.remove("show");
};

//글작성
if (document.querySelector(".create-btn") !== null) {
  popupBtn.addEventListener("click", (e) => showPopup(e, popupBg));
  popupCloseBtn.addEventListener("click", (e) => hidePopup(e, popupBg));
  popupBg.addEventListener("click", (e) => hidePopup(e, popupBg));
}

//회원가입
if (document.querySelector(".signup-btn") !== null) {
  signupBtn.addEventListener("click", (e) => showPopup(e, signupBg));
  signupCloseBtn.addEventListener("click", (e) => hidePopup(e, signupBg));
  signupBg.addEventListener("click", (e) => hidePopup(e, signupBg));
}

//로그인
if (document.querySelector(".login-btn") !== null) {
  loginBtn.addEventListener("click", (e) => showPopup(e, loginBg));
  loginCloseBtn.addEventListener("click", (e) => hidePopup(e, loginBg));
  loginBg.addEventListener("click", (e) => hidePopup(e, loginBg));
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
if (createBtn !== null) {
  createBtn.addEventListener("click", posting);
}

// 상세보기 닫기 팝업만 따로 분리함
const hideDetailPopup = (e, tag) => {
  const modifyBtn = document.querySelector(".detail-modify-btn");
  const detailForm = document.querySelector(".detail-form");
  const modifyForm = document.querySelector(".modify-form");

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

if (previewBtn !== null) {
  previewBtn.addEventListener("click", () => previewImage(previewBtn));
}

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

// 최신순 정렬
const newCardBtn = document.querySelector(".new-card-btn");
newCardBtn.addEventListener("click", () => {
  console.log("최신순");
  newCardBtn.classList.add("color-blue");
  fetch("/view", {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
    },
  })
    .then((response) => response.json())
    .then((response) => {
      cardRow.innerHTML = "";
      const list = response["all_post"];
      const newList = list.sort(function (a, b) {
        return b.uploadtime - a.uploadtime;
      });

      for (let i = 0; i < newList.length; i++) {
        const title = newList[i].title;
        const url = newList[i].url;
        const likes = newList[i].likes;
        // const previewImage = newList[i].image
        const id = newList[i].id;
        const newHtml = `<div class="ListBg">
                          <div class="ListFlex">
                              <div class="click-wrap" onclick="showDetail('${id}')">
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
                                          <span>${likes}</span>
                                      </div>
                                  </div>
                                  <hr/>
                              </div>
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
        cardRow.innerHTML += newHtml;
      }
    });
});

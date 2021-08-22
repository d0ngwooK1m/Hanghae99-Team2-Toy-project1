const locationHref = window.location.href;
const findeMypage = locationHref.split("/").reverse()[0];
// 메인페이지와 마이페이지의 리스트 불러오는 함수 구분처리함.
window.addEventListener("load", function () {
  if (findeMypage === "myPage") {
    myPageList();
  } else {
    viewing();
  }
});
// 리스트 뷰
let cardRow = document.querySelector(".cardRow");
function viewing() {
  // cardRow.innerHTML = "";
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
                                            <span>${likes}</span>
                                        </div>
                                        <div class = "JjimNum">
                                            <img src="../static/img/Rheart.svg">
                                            <span>0</span>
                                        </div>
                                    </div>
                                    <hr/>
                                </div>
                                <div class="Option">
                                    <div class="Like Option_Like" onclick="updateLike('${id}')">
                                        <img src="../static/img/thumbsup.svg" class="thumbsUp">
                                        <span class="likes-btn">추천하기</span>
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
      $.cookie("login_token", response["login_token"], { path: "/" });
      return window.location.href = "/";
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
      return window.location.href = "/";
    },
  });

  e.preventDefault();
});

//등록권한 없음
function postingFail() {
  return alert("사용권한이 없습니다");
}

// 카드 상세화면 팝업
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

      const html = `<div class="popup-detail-background">
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
      detailBg.classList.add("show");
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
// 카드 등록
const createBtn = document.querySelector(".create-form-btn");
let imgsrc = "";
function posting() {
  let url = document.getElementById("url").value;
  let title = document.getElementById("title").value;
  let desc = document.getElementById("description").value;
  console.log("imgsrc", imgsrc);
  $.ajax({
    type: "POST",
    url: "/test",
    data: {
      url_give: url,
      title_give: title,
      desc_give: desc,
      imgsrc_give: imgsrc,
    },
    success: function (response) {
      alert(response["msg"]);
      window.location.reload();
    },
  });
}
if (createBtn !== null) {
  createBtn.addEventListener("click", posting);
}
// 수정
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
      const imgsrc = detail["imgsrc"]; // 수정하기 전 받아온 이미지
      // const detailWrap = document.querySelector(".popup-detail-wrap");
      const modifyBtn = document.querySelector(".detail-modify-btn");
      const detailForm = document.querySelector(".detail-form");
      const modifyForm = document.querySelector(".modify-form");

      modifyBtn.style.display = "none";
      detailForm.style.display = "none";
      modifyForm.innerHTML = `

                                      <div class="modify-image-wrap">
                                        <img class="detail-image-wrap" id="imgSource" src="${imgsrc}"  alt="image"/>
                                      </div>
                                      <div class="popup-box-wrap">
                                          <label for="url">웹 사이트 URL</label>
                                          <div class="flex-layout">
                                              <input class="modify-preview-url blur-edit-input" type="text" id="urlNew" name="url" value="${url}"/>
                                              <button class="modify-preview-btn" onclick="previewImage()">미리보기</button>
                                          </div>
                                      </div>
                                      <div class="popup-box-wrap">
                                          <label for="title">제목</label>
                                            <input class="blur-edit-input" type="text" id="titleNew" name="title" value="${title}"/>
                                      </div>
                                      <div class="popup-box-wrap">
                                          <label for="description">설명</label>
                                          <textarea class="blur-edit-input" type="text" id="descriptionNew" name="description" rows="6" value="사이트에 대한 간략한 설명을 입력해주세요" >${desc}</textarea>
                                      </div>
                                      <textarea class="blur-edit-input" name="id" id="" cols="0" rows="0" style="display: none">${id}</textarea>
                                      <div class="popup-box-wrap">
                                      <input type="hidden" value="${id}" name="id" style="display: none">
                                          <button  class="modify-form-btn" onclick="submitEdit('${id}')">수정하기</button>
                                      </div>

                                    `;
    },
    error: function (response) {
      alert(response.responseJSON["response"]);
      // console.log(response.responseJSON['response'])
    },
  });
}

function submitEdit(id) {
  const urlNew = document.getElementById('urlNew').value;
  const titleNew = document.getElementById('titleNew').value;
  const descNew = document.getElementById('descriptionNew').value;
  const imgNew = document.getElementById('imgSource').src;

  // console.log(urlNew, titleNew, descNew);
  $.ajax({
    type:"POST",
    url:"/test/submitEdit",
    data: {
      id_give: id,
      img_give: imgNew,
      url_give: urlNew,
      title_give: titleNew,
      desc_give: descNew
    },
    success: function (response) {
        alert(response["response"]);
        return window.location.href = "/";
    }
  })
}

function deletePopup(id) {
  $.ajax({
    type: "POST",
    url: "/test/delete",
    data: { id_give: id },
    success: function (response) {
      alert(response["response"]);
      return window.location.href = "/";
    },
    error: function (response) {
      alert(response.responseJSON["response"]);
      // console.log(response.responseJSON['response'])
    },
  });
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

// popup 함수 show, hide로 분리
const inputs = document.querySelectorAll(".blur-input");
// querySelectorAll 는 동일한 클래스명을 갖는 모든 태그를 찾습니다.
// querySelector 는 동일한 클래스명을 갖는 태그가 여러개일 경우, 제일 첫번째것만 찾습니다.
const showPopup = (e, tag) => {
  if (e.target.className === "Option_Jjim" || e.target.className === "heart") {
    return null;
  }
  tag.classList.add("show");

  // input 에서 포커스 아웃되었을때 팝업창 닫히는 부분 막기
  const inputs = document.querySelectorAll(".blur-input");
  // blur-input을 갖고 있는 모든 태그를 찾아서 inputs란 변수에 담는다.
  // 모든 태그(inputs)를 forEach로 돌린다.
  return inputs.forEach((input) => {
    // blur-input을 갖는 태그 하나하나마다 blur이벤트를 준다.
    input.addEventListener("blur", () => {
      if (tag.className === "signup-background") {
        // 회원가입 팝업창일때, 회원가입 팝업창 외에 모두 show 클래스 지움
        signupBg.classList.add("show");
        loginBg.classList.remove("show");
        popupBg.classList.remove("show");
      } else if (tag.className === "login-background") {
        // 로그인 팝업창일때, 로그입 팝업창 외에 모두 show 클래스 지움
        signupBg.classList.remove("show");
        loginBg.classList.add("show");
        popupBg.classList.remove("show");
      } else if (tag.className === "popup-background") {
        // 글등록 팝업창일때 글등록 팝업창 외에 모두 show 클래스 지움
        signupBg.classList.remove("show");
        loginBg.classList.remove("show");
        popupBg.classList.add("show");
      }
    });
  });

  // return tag.classList.add("show");
};

const hidePopup = (e, tag) => {
  if (e.target.className !== e.currentTarget.className) {
    return null;
  }
  return tag.classList.remove("show");
};
// 상세보기 닫기 팝업만 따로 분리함
const hideDetailPopup = (e, tag) => {
  const modifyBtn = document.querySelector(".detail-modify-btn");
  const detailForm = document.querySelector(".detail-form");
  const modifyForm = document.querySelector(".modify-form");
  const detailBg = document.querySelector(".popup-detail-background");

  if (e.target.className !== e.currentTarget.className) {
    return null;
  }

  if (e.target.className) tag.classList.remove("show");
  modifyBtn.style.display = "block";
  detailForm.style.display = "block";

  // modifyForm.innerHTML = ``;

  // 수정하는 input에서 포커스 아웃되면 팝업창 닫히지 않게
  const inputs = document.querySelectorAll(".blur-edit-input");
  // 동일한 클래스명을 갖는 태그를 모두 찾아서 forEach로 돌린다.
  inputs.forEach((input) => {
    // 동일한 클래스 명을 갖는 태그 하나하나에 blur이벤트를 준다.
    input.addEventListener("blur", (e) => {
      if (e.target.classList.contains("blur-edit-input")) {
        modifyBtn.style.display = "none";
        detailForm.style.display = "none";
        detailBg.classList.add("show");
      }
    });
  });

  return detailBg.classList.remove("show");
};

let url = document.querySelector(".preview-url"); // input
let previewBox = document.querySelector(".preview-image-wrap");
const previewBtn = document.querySelector(".preview-btn");


previewBtn.addEventListener("click", () => previewImage(previewBtn));


// 미리보기 클릭했을 때 og:image 가져오는 함수.
// 등록 팝업과 상세보기 팝업에서 공통으로 쓰임
const previewImage = (tag) => {
  let value = "";
  let modifyWrap = ``;
  const urlValue = url.value; // 등록 값 등록 input / 수정 input
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
      // 서버랑 크롤링 img
      const url = response;
      imgsrc = url; // imgsrt = '';/
      // og:image가 없을 경우 기본 이미지 나오게
      if (url === "" && check) {
        previewBox.innerHTML = `<img src="../static/img/og_base.jpg" alt="썸네일"/>`;
      } else if ((url === "" && !check) || (!check && url.spl)) {
        modifyWrap.innerHTML = `<img class="detail-image-wrap" src="../static/img/og_base.jpg" alt="썸네일"/>`;
      }
      // og:image가 있을 경우
      if (value === urlValue) {
        previewBox.innerHTML = `<img src="${url}" id="imgSource" alt="썸네일"/>`;
      } else {
        modifyWrap.innerHTML = `<img class="detail-image-wrap" id="imgSource" src="${url}" alt="썸네일"/>`;
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

// 추천하기
function updateLike(id) {
  fetch("update/likes", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ id_give: id }),
  })
    .then((response) => response.json())
    .then((response) => {
      alert(response["msg"]);
      if (findeMypage === "myPage") {
        window.location.href = "/myPage";
      } else {
        window.location.href = "/";
      }
    });
}
// 최신순 정렬
const newCardBtn = document.querySelector(".new-card-btn");
newCardBtn.addEventListener("click", () => {
  newCardBtn.classList.add("color-blue");
  likeBtn.classList.remove("color-blue");
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
        const imgsrc = newList[i].imgsrc;
        // const previewImage = newList[i].image
        const id = newList[i].id;
        const newHtml = `<div class="ListBg">
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
                                          <span>${likes}</span>
                                      </div>
                                      <div class = "JjimNum">
                                          <img src="../static/img/Rheart.svg">
                                          <span>0</span>
                                      </div>
                                  </div>
                                  <hr/>
                              </div>
                              <div class="Option">
                                  <div class="Like Option_Like" onclick="updateLike('${id}')">
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

// 추천순 정렬
const likeBtn = document.querySelector(".likes-card-btn");
likeBtn.addEventListener("click", () => {
  likeBtn.classList.add("color-blue");
  newCardBtn.classList.remove("color-blue");
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
        return b.likes - a.likes;
      });
      for (let i = 0; i < newList.length; i++) {
        const title = newList[i].title;
        const url = newList[i].url;
        const likes = newList[i].likes;
        const imgsrc = newList[i].imgsrc;
        // const previewImage = newList[i].image
        const id = newList[i].id;
        const newHtml = `<div class="ListBg">
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
                                          <span>${likes}</span>
                                      </div>
                                      <div class = "JjimNum">
                                          <img src="../static/img/Rheart.svg">
                                          <span>0</span>
                                      </div>
                                  </div>
                                  <hr/>
                              </div>
                              <div class="Option">
                                  <div class="Like Option_Like" onclick="updateLike('${id}')">
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

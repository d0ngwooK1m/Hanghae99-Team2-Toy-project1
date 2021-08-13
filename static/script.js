const Option_Jjim = document.querySelector(".Option_Jjim");
const Jjim_heart = document.querySelector(".heart");
const Option_Like = document.querySelector(".Option_Like");
const Like_Thumb = document.querySelector(".thumbsUp");
let Jjim_count = false;

function Jjim_heartControl() {
    Jjim_count = !Jjim_count;
}

let Like_count = false;

function Like_ThumbControl() {
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
    Like_Thumb.src = "../static/img/bthumsup.svg";
  } else {
    Like_Thumb.src = "../static/img/thumsbup.svg";
  }
}

Option_Jjim.addEventListener("click", Jjim);
Jjim_heart.addEventListener("click", Jjim);
Option_Jjim.addEventListener("click", Jjim_heartControl);

Option_Like.addEventListener("click", Like);
Like_Thumb.addEventListener("click", Like);
Option_Like.addEventListener("click", Like_ThumbControl);

// Listmodal
const openButton = document.querySelector(".ListBg");
const modal = document.querySelector(".List_modal");
const overlay = modal.querySelector(".List_overlay");
const closeBtn = modal.querySelector("button");
const openModal = () => {
    modal.classList.remove("List_hidden");
};
const closeModal = () => {
    modal.classList.add("List_hidden");
};
overlay.addEventListener("click", closeModal);
closeBtn.addEventListener("click", closeModal);
openButton.addEventListener("click", openModal);

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
let url = document.querySelector('.preview-url')
let previewBox = document.querySelector('.preview-image-wrap');
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
        url.value = ''
        previewBox.innerHTML = ''
    } else {
        // tag에 show라는 클래스가 없으면 show 클래스를 추가해서 팝업 보이기
        tag.classList.add("show");
    }
};

$(".signup-submit-btn").click(function(e) {
    // const form_give = $(this);
    // const error_give = $form.find(".error");
    // const data_give = $form.serialize();
    console.log('test')
    $.ajax({
        url: "/user/signup",
        type: "POST",
        data: "data_give",
        dataType: "json",
        success: function(response) {
            console.log(response);
        },
        error: function(response) {
            console.log(response);
        }
    })

    e.preventDefault();
})

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
      let lists = response['all_post']
      console.log(lists)
      for (let i = 0; i < lists.length; i++) {
        let url = lists[i]['url']
        let title = lists[i]['title']
        let desc = lists[i]['desc']

        let temp_html = `<div class="ListBg">
                            <div class="ListFlex">
                                <div class="imgHidden-box">
                                    <img src="../static/img/vatican.jpg" class="classImg">
                                    <button class="Jjim Option_Jjim">
                                            <div><img src="../static/img/heart.svg" class="star"></div>
                                    </button>
                                </div>  
                                <div class ="title">${title}</div>
                                <div class ="numCount">
                                    <div class = "likeNum">
                                        <img src="../static/img/likeUp3.png">
                                        <span>5342</span>
                                    </div>
                                    <div class = "JjimNum">
                                        <img src="../static/img/rheart.svg">
                                        <span>1783</span>
                                    </div>
                                </div>
                                <hr/>
                                <div class="Option">
                                    <div class="Like Option_Like">
                                        <img src="../static/img/thumsbup.svg" class="thumbsUp">
                                        <span>좋아요</span>
                                    </div>
                                    <a class="Link" href="${url}" target= '_blank'>
                                        <span>바로가기</span>
                                    </a>
                                </div>
                            </div>
                        </div>`
        $('.cardRow').append(temp_html);
      }
    }
  })
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
    }
  })
}

// 카드 등록에서 URL을 입력하면 해당 OG:IMAGE 미리보게 하는 함수
const previewBtn = document.querySelector('.preview-btn');
let previewCount = 0;
previewBtn.addEventListener('click', (e) => {
    const urlValue = url.value;
    // input 값 작성안하고 button 클릭 했을 경우
    if(urlValue === ''){
      alert('WEB URL주소를 입력해주세요')
      return null
    }
    $.ajax({
        type: 'POST',
        url: '/create/previewImage',
        data: {url_give: urlValue},
        success:function(response){
            const url = response;
            // 버튼을 또 클릭했을 경우 이미지가 계속 추가되는 현상 막기
            if (previewCount > 0) {
                previewCount = 0;
                previewBox.innerHTML = ``;
            }
            if (url !== '') {
                previewBox.innerHTML += `<img src="${url}" alt="썸네일"/>`;
                previewCount++;
            } else {
                // og:image가 없을 경우 기본 이미지로 대체
                previewBox.innerHTML += `<img src="../static/img/logo.png" alt="썸네일"/>`;
                previewCount++;
            }
        },
        error:function(e){
            if(e.status === 500){
                alert("error")
                console.log("error === ", e)
            }
        }
    })
});

// 카드 등록
const createBtn = document.querySelector(".create-form-btn");
let imgsrc = "";
function posting() {
  let url = document.getElementById("url").value;
  let title = document.getElementById("title").value;
  let desc = document.getElementById("description").value;
  if (title === "") {
    alert("제목을 입력해주세요");
  } else if (desc === "") {
    alert("내용을 입력해주세요");
  } else {
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
      error: function (e) {
        alert("url 주소를 다시 확인해주세요");
        console.log(e);
      },
    });
  }
}
if (createBtn !== null) {
  createBtn.addEventListener("click", posting);
}

//글작성 팝업
const popupBtn = document.querySelector(".create-btn");
const popupBg = document.querySelector(".popup-background");
const popupCloseBtn = document.querySelector(".popup-close-btn");

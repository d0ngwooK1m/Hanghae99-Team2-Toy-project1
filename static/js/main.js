console.log("main js");
window.addEventListener("load", function () {
  viewing();
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
                                <div class="click-wrap" onclick="showDetail(event,'${id}')">
                                    <div class="imgHidden-box">
                                        <img src="${imgsrc}" class="classImg">
                                        <button class="Option_Jjim" onclick="test('${id}')">
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

function test(id) {
  console.log("test");
  console.log("id = ", id);
}

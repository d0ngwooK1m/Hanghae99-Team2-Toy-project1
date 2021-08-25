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
      for (let i = 0; i < lists.length; i++) {
        let url = lists[i]["url"];
        let title = lists[i]["title"];
        let likes = lists[i]["likes"];
        let jjim = lists[i]["heart"];
        let imgsrc = lists[i]["imgsrc"];
        let id = lists[i]["id"];

        let temp_html = `<div class="ListBg">
                            <div class="ListFlex">
                                <div class="click-wrap" onclick="showDetail(event,'${id}')">
                                    <div class="imgHidden-box">
                                        <img src="${imgsrc}" class="classImg">
                                        <button class="Option_Jjim" onclick="jjim('${id}')">
                                            <img src="${jjim}" id="heartImg">
                                        </button>
                                    </div>  
                                    <h3 class ="title">${title}</h3>
                                    <div class ="numCount">
                                        <div class = "likeNum">
                                            <img src="../static/img/likeUp3.png">
                                            <span>${likes}</span>
                                        </div>
                                        <div class = "JjimNum">
                                            <img src="${jjim}">
                                            <span></span>
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
        const jjim = newList[i].heart;
        const imgsrc = newList[i].imgsrc;
        // const previewImage = newList[i].image
        const id = newList[i].id;
        const newHtml = `<div class="ListBg">
                            <div class="ListFlex">
                                <div class="click-wrap" onclick="showDetail(event,'${id}')">
                                    <div class="imgHidden-box">
                                        <img src="${imgsrc}" class="classImg">
                                        <button class="Option_Jjim" onclick="jjim('${id}')">
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
                                            <span>${jjim}</span>
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
        const jjim = newList[i].heart;
        const imgsrc = newList[i].imgsrc;
        // const previewImage = newList[i].image
        const id = newList[i].id;
        const newHtml = `<div class="ListBg">
                            <div class="ListFlex">
                                <div class="click-wrap" onclick="showDetail(event,'${id}')">
                                    <div class="imgHidden-box">
                                        <img src="${imgsrc}" class="classImg">
                                        <button class="Option_Jjim" onclick="jjim('${id}')">
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
                                            <span>${jjim}</span>
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
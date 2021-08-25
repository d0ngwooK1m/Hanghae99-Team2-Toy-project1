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
                                <div class="click-wrap" onclick="showDetail(event,'${id}')">
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
                                <div class="click-wrap" onclick="showDetail(event,'${id}')">
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

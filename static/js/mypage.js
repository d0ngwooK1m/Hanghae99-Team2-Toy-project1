window.addEventListener("load", function () {
  myPageList();
});
function myPageList() {
  const mypageList = document.querySelector(".mypage_cardList");
  const mypage = document.querySelector(".mypage_cloumn");
  fetch("/myPage/list", {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
    },
  })
    .then((response) => response.json())
    .then((response) => {
      const myList = response["my_list"];
      if (myList.length === 0) {
        const text = `<p class="mypage_text">작성한 카드가 없습니다. 카드를 작성해주세요.</p>`;
        mypage.innerHTML = text;
      } else {
        for (let i = 0; i < myList.length; i++) {
          const url = myList[i]["url"];
          const title = myList[i]["title"];
          const likes = myList[i]["likes"];
          const imgsrc = myList[i]["imgsrc"];
          let Jjim = myList[i]["heart"];
          const id = myList[i]["id"];
          const mypage_html = `
        <div class="ListBg">
                            <div class="ListFlex">
                 
                                <div class="click-wrap" onclick="showDetail(event,'${id}')">
                                    <div class="imgHidden-box">
                                        <img src="${imgsrc}" class="classImg" onerror="this.src='../static/img/linkgather.png';">
                                        <button class="Option_Jjim" onclick="jjim('${id}')">
                                            <img src="${Jjim}" class="heart">
                                        </button>
                                    </div>  
                                    <h3 class ="title">${title}</h3>
                                    <div class ="numCount">
                                        <div class = "likeNum">
                                            <img src="../static/img/likeUp3.png">
                                            <span>${likes}</span>
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
                        </div>
        `;
          mypageList.innerHTML += mypage_html;
        }
      }
    });
}

// 최상단으로
toparrow = document.querySelector(".arrow");
toparrow.addEventListener("click", scrolltop);

function scrolltop() {
  window.scrollTo(0, 0);
}

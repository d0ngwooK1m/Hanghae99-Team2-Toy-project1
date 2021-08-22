function myPageList() {
  fetch("/myPage/list", {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
    },
  })
    .then((response) => response.json())
    .then((response) => {
      const myList = response["my_list"];
      console.log("mypage response ", myList);
      if (myList.length === 0) {
        const text = `<p class="mypage_text">찜한 카드가 없습니다. 마음에 드는 카드를 찜해주세요.</p>`;
        $(".mypage_cloumn").append(text);
      } else {
        for (let i = 0; i < myList.length; i++) {
          const url = myList[i]["url"];
          const title = myList[i]["title"];
          const likes = myList[i]["likes"];
          const imgsrc = myList[i]["imgsrc"];
          const id = myList[i]["id"];
          const mypage_html = `
        <div class="ListBg">
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
                        </div>
        `;
          $(".mypage_cardList").append(mypage_html);
        }
      }
    });
}

// const my_Jjim = document.querySelector('.my_Jjim')
// const my_info = document.querySelector('.my_info')

// function ShowJjim(){
//     document.querySelector('#card_list').style.display = 'block'
//     document.querySelector('#my_information').style.display = 'none'
// }

// function Showinfo(){
//     document.querySelector('#card_list').style.display = 'none'
//     document.querySelector('#my_information').style.display = 'block'
// }

// my_Jjim.addEventListener('click',ShowJjim)
// my_info.addEventListener('click',Showinfo)

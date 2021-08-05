// popup
const popupBtn = document.querySelector(".create-btn");
const popupBg = document.querySelector(".popup-background");
const popupCloseBtn = document.querySelector(".popup-close-btn");
const showPopup = () => {
  popupBg.style.display === "" || popupBg.style.display === "none"
    ? (popupBg.style.display = "block")
    : (popupBg.style.display = "none");
};
const hidePopup = () => {
  popupBg.style.display === "block"
    ? (popupBg.style.display = "none")
    : (popupBg.style.display = "block");
  window.location.reload();
};
popupBtn.addEventListener("click", function () {
  showPopup();
});
popupCloseBtn.addEventListener("click", function () {
  hidePopup();
});
popupBg.addEventListener("click", function () {
  hidePopup();
});

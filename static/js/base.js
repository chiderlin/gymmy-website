let burger_overlay = document.querySelector(".burger-overlay");
let body = document.querySelector("body");
let openbtn = document.getElementById("openbtn");
let closebtn = document.getElementById("closebtn");

// 漢堡按鈕
openbtn.addEventListener("click", ()=> {
    // burger_overlay.style.transform = "translateX(100%)";
    burger_overlay.style.height = "100%";
});

closebtn.addEventListener("click", ()=> {
    // burger_overlay.style.transform = "translateX(200%)";
    burger_overlay.style.height = "0%";
});


const startBtn = document.getElementById("start-btn");
const homeScreen = document.getElementById("home-screen");
const explorerScreen = document.getElementById("explorer-screen");

startBtn.addEventListener("click", () => {
    homeScreen.classList.remove("active-section");
    homeScreen.classList.add("hidden-section");

    explorerScreen.classList.remove("hidden-section");
    explorerScreen.classList.add("active-section");
});
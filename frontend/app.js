console.log("here!")
const $enterButton = document.querySelector(".enter-button")
const $companySideBar = document.querySelector(".company-sidebar")
const $search = document.querySelector("#search")

$enterButton.addEventListener("click", removeSplash)
$search.addEventListener("click", searchBarAppear)

function removeSplash(event) {
    console.log($companySideBar)
    $companySideBar.style.width = "200px"
    $companySideBar.style.transition = "0.5s";
    $enterButton.style.visibility = "hidden"
}

function searchBarAppear(event) {
    console.log("opening search bar")
}
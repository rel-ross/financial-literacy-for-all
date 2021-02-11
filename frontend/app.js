console.log("here!")
const $enterButton = document.querySelector(".enter-button")
const $companySideBar = document.querySelector(".company-sidebar")
const $search = document.querySelector("#search")
const $navBar = document.querySelector("#navbar")
const $uploaderBox = document.querySelector('#uploader-drop-box')
const $loader = document.querySelector('#loader')

$enterButton.addEventListener("click", removeSplash)
$search.addEventListener("click", searchBarAppear)
$uploaderBox.addEventListener("drop", uploadFile)

function removeSplash(event) {
    console.log($companySideBar)
    $companySideBar.style.width = "200px"
    $companySideBar.style.transition = "0.5s";
    $enterButton.style.visibility = "hidden"
}

function searchBarAppear(event) {
    console.log("opening search bar")
    $search.textContent = ""
    const $searchBarForm = document.createElement("form")
    $searchBarForm.setAttribute("id", "search-form")
    $searchBarForm.innerHTML = `
        <input
        class="search-input"
        type="text"
        name="search-text"
        placeholder="🔍 Search..."
        />
    `
    $navBar.append($searchBarForm)
}

function uploadFile(event) {
    console.log(document.getElementById('uploader-drop-box').files[0])
    $uploaderBox.style.visibility="hidden"
    $loader.style.visibility ="visible"
}
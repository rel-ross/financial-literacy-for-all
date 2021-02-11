console.log("here!")
const $enterButton = document.querySelector(".enter-button")
const $companySideBar = document.querySelector(".company-sidebar")
const $search = document.querySelector("#search")
const $navBar = document.querySelector("#navbar")

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
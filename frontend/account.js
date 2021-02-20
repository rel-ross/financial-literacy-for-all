const $signUpLink = document.querySelector('#sign-up-link')
const $PageContent = document.querySelector('#regular-page-content')
const $userLogin = document.querySelector('#login-form')
const $userSignUp = document.querySelector('#signup-form')
const $loginHeader = document.querySelector('#login-header')
const $logInOrAccount = document.querySelector('#login-or-account')
const $accountPageInfo = document.querySelector('.account-page-info')

$signUpLink.addEventListener('click', SignUpUserForm)
$userSignUp.addEventListener("submit", userSignUp)
$userLogin.addEventListener("submit", userLogin)
loggedInIndicator()
AccountPage()

function SignUpUserForm(event) {
    $userLogin.style.display= "none"
    $userSignUp.style.display= "block"
}

function userSignUp(event) {
    event.preventDefault()
    const formData = new FormData(event.target)
    const user = {
        username: formData.get("username"),
        password: formData.get("password")
    }
    fetch("http://localhost:3000/users", {
        method: "POST",
        headers: {
            "Content-type": "application/json"
        },
        body: JSON.stringify({ user: user })
    }).then(response => {
        $userSignUp.style.display= "none"
        $userLogin.style.display= "block"
        $loginHeader.textContent = "Registered! Now you can login"
    })
}

function userLogin(event) {
    event.preventDefault()
    const formData = new FormData(event.target)
    const user = {
        username: formData.get("username"),
        password: formData.get("password")
    }
    fetch("http://localhost:3000/login", {
        method: "POST",
        headers: {
            "Content-type": "application/json"
        },
        body: JSON.stringify(user)
    }).then(response => response.json())
    .then(response => {
        localStorage.setItem("token", response.token)
    })
}

function loggedInIndicator() {
    localStorage.getItem("token")  
    ?$logInOrAccount.innerHTML = `<a href="/account.html">🐥 Account</a>`
    :$logInOrAccount.innerHTML = `<a href="/account.html">🐣 Login</a>`
  }

function AccountPage() {
    if (localStorage.getItem("token")) {
        $userSignUp.style.display= "none"
        $userLogin.style.display= "none"
        $accountPageInfo.textContent = `This is where your account info will go`
    }
}


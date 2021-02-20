const $enterButton = document.querySelector(".enter-button")
const $companySideBar = document.querySelector(".company-sidebar-homepage")
const $search = document.querySelector("#search")
const $navBar = document.querySelector("#navbar")
const $uploaderBox = document.querySelector('#uploader-drop-box')
const $progress = document.querySelector('#progress')
const $uploaderContent = document.querySelector('#uploader-content')
const $uploaderHeader = document.querySelector('#uploader-header')
const $documentDisplay = document.querySelector('#document-display')
const $seeFileButton = document.querySelector('#see-file')
const $logInOrAccount = document.querySelector('#login-or-account')

const pagesURL = "http://localhost:3000/pages/"

const firebaseConfig = {
  apiKey: "AIzaSyCTPLdDb1d8Tpm6I0twvlypTVeRrylbPeY",
  authDomain: "mod-3-project-a1e21.firebaseapp.com",
  projectId: "mod-3-project-a1e21",
  storageBucket: "mod-3-project-a1e21.appspot.com",
  dataBaseURL: "https://mod-3-project-a1e21.firebaseio.com",
  messagingSenderId: "410320690637",
  appId: "1:410320690637:web:cd1c235325f7ee7b837884",
  measurementId: "G-3YGTJNKGYR"
};


firebase.initializeApp(firebaseConfig);
const storage = firebase.storage()
const storageRef = storage.ref();
let files = [];
let uploadedFileID = 0;


let $modal = document.createElement("div")
$modal.setAttribute("class", "modal")

$enterButton.addEventListener("click", removeSplash)
$search.addEventListener("click", searchBarAppear)

loggedInIndicator()
setFiles()
uploadFile()

function removeSplash(event) {
    $companySideBar.style.width = "200px"
    $companySideBar.style.transition = "0.5s";
    $enterButton.style.visibility = "hidden"
}

function searchBarAppear(event) {
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
    $uploaderBox.style.visibility="hidden"
    $loader.style.visibility ="visible"
}

function setFiles(){
  document.getElementById('files')
    .addEventListener('change', (event) => {
      files = event.target.files
    })
}

function uploadFile() {
  document.getElementById("send")
    .addEventListener("click", () => {
        if (files.length != 0) {
          for (let i = 0; i < files.length; i++) {
            let storage = firebase.storage().ref(files[i].name);
            let upload = storage.put(files[i]);

            upload.on(
              "state_changed",
              function progress(snapshot) {
                let percentage =
                  (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
                const $progressBar = document.getElementById("progress")
                $progressBar.classList.remove("hidden")
                $progressBar.value = percentage;
              },

              function error() {
                alert("error uploading file");
              },

              function complete() {
                document.getElementById(
                  "uploading"
                ).innerHTML += `
                  ${files[i].name} uploaded <br />
                  `;
                let filesRef = storageRef.child('files');
                let uploadedFile = filesRef.child(files[i].name)
                getFileUrl(uploadedFile)
              }
            );
          }
        } else {
          alert("No file chosen");
        }
    });
  }

function getFileUrl(file) {
  let storageRef = firebase.storage().ref(file.name);

  storageRef
    .getDownloadURL()
    .then((url) => {
      storeFiletoBackend(url)
    })
    .catch((error) => {
      alert("error encountered");
    });
}

function storeFiletoBackend(URL) {
    fetch(pagesURL,  {
        method: "POST",
        headers: {
            "Content-type": "application/json"
        },
        body: JSON.stringify({
            page: { url: URL }
        })
    })
      .then(response => response.json())
      .then(file => {
        uploadedFileID = file.id
        showParsedPDF()
      })
        
}

function showParsedPDF(event) {
    let fileContent = "";
    $uploaderBox.remove()
    $uploaderHeader.textContent = "Hover over pay items to learn about them"
    $documentDisplay.style.opacity="1"
    fetch(pagesURL + uploadedFileID)
        .then(response => response.json())
        .then(file => {
            fileContent = file.content
            let splitFile = fileContent.split(/\r?\n/)
            splitFile.splice("", '')
            let filteredFileArray = splitFile.filter(word => word != false)
            filteredFileArray.map(arrayItem => {
                $row = document.createElement("tr")
                rowArray = arrayItem.split("           ")
                let noBlanksRowArray = rowArray.filter(element => element.length > 0)
                noBlanksRowArray.map(element => {
                        $cell = document.createElement("td")
                        $cell.textContent = element.trim()
                        if (element === noBlanksRowArray[0]) {
                            $cell.style.fontWeight = "bold"
                            $cell.setAttribute("id", element)
                            $cell.addEventListener('mouseover', stubItemInfo)
                        }
                        return $cell
                }).map($cell => {
                    $row.append($cell)
                    return $row
                }).forEach ($row => {
                    $documentDisplay.append($row)
                })
            })
        })
}

function stubItemInfo(event) {
    let title = event.target.textContent.toLowerCase()
    event.target.prepend($modal)
     $modal.style.display = "block"
    if (title.includes("gross")) {
        $modal.innerHTML = `
           <p> <b>Gross Earnings:</b> the money you would earn without any taxes or deductions. </p>
           <p> <b>Hourly:</b> hours worked * hourly rate </p>
           <p> <b>Salaried (biweekly):</b> yearly salary ÷  26 </p>
           <p> <b>Salaried (semi-monthly):</b> yearly salary ÷ 24 </p>
        `
    } else if (title.includes("pre-tax")){
        $modal.innerHTML = `
            <b>Pre-Tax Deductions</b> are taken out of your pay before taxes are deducted.
            <p><b>Why is this beneficial?</b> When your tax percentages are calculated, they will now be calculated on a lower number
            since the pre-tax deductions lowered your wages (this new, lowered, wage amount is called your <b>subject wage</b>)
        `
    } else if (title.includes("post")) {
        $modal.innerHTML = `
        <b>Post-tax Deductions</b> are taken out of your pay after taxes have been deducted. They have no tax implications.
        `

    } else if (title.includes("net")) {
        $modal.innerHTML = `
        <b>Net Pay</b> is your take home money after all deductions have been removed.
        `

    } else if (title.includes("check")) {
        $modal.innerHTML = `
        <b>What is the difference between check amount and net pay?</b> If you earn cash tips, 
        you may have already taken that money home at the end of the workday. That is 
        part of yur net pay, but you will not be receiving it in this week's check since it
        has already been paid out.
        `

    } else {
        $modal.style.display = "none"
    }
}

function loggedInIndicator() {
  localStorage.getItem("token")  
  ?$logInOrAccount.innerHTML = `<a href="/account.html">🐥 Account</a>`
  :$logInOrAccount.innerHTML = `<a href="/account.html">🐣 Login</a>`
}
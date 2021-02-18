console.log("here!")
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


let $modal = document.createElement("div")
$modal.setAttribute("class", "modal")

$enterButton.addEventListener("click", removeSplash)
$search.addEventListener("click", searchBarAppear)

// $uploaderBox.addEventListener("drop", uploadFile)

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

// upload file to firebase functionality
  // Your web app's Firebase configuration
  // For Firebase JS SDK v7.20.0 and later, measurementId is optional
  var firebaseConfig = {
    apiKey: "AIzaSyCTPLdDb1d8Tpm6I0twvlypTVeRrylbPeY",
    authDomain: "mod-3-project-a1e21.firebaseapp.com",
    projectId: "mod-3-project-a1e21",
    storageBucket: "mod-3-project-a1e21.appspot.com",
    dataBaseURL: "https://mod-3-project-a1e21.firebaseio.com",
    messagingSenderId: "410320690637",
    appId: "1:410320690637:web:cd1c235325f7ee7b837884",
    measurementId: "G-3YGTJNKGYR"
  };

  // Initialize Firebase
firebase.initializeApp(firebaseConfig);
var storage = firebase.storage()
var storageRef = storage.ref();


var files = [];
document.getElementById("files").addEventListener("change", function(e) {
  files = e.target.files;
  for (let i = 0; i < files.length; i++) {
    console.log(files[i]);
  }
});

document.getElementById("send").addEventListener("click", function() {
    //checks if files are selected
    if (files.length != 0) {

    //Loops through all the selected files
    for (let i = 0; i < files.length; i++) {

      //create a storage reference
      var storage = firebase.storage().ref(files[i].name);

      //upload file
      var upload = storage.put(files[i]);

      //update progress bar
      upload.on(
        "state_changed",
        function progress(snapshot) {
          var percentage =
            (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
          document.getElementById("progress").value = percentage;
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

          var filesRef = storageRef.child('files');
          var uploadedFile = filesRef.child(files[i].name)
          console.log(`made it to 103- ${uploadedFile}`)
          getFileUrl(uploadedFile)
        }
      );
    }
    } else {
    alert("No file chosen");
    }
    });


function getFileUrl(file) {
  //create a storage reference
  var storageRef = firebase.storage().ref(file.name);

  //get file url
  storageRef
    .getDownloadURL()
    .then(function(url) {
      storeFiletoBackend(url)
    })
    .catch(function(error) {
      console.log("error encountered");
    });
}

let uploadedFileID = 0;
function storeFiletoBackend(URL) {
    console.log("this is the URL", URL)
    fetch('http://localhost:3000/pages',  {
        method: "POST",
        //this is where we tell the backend what we're sending over
        headers: {
            "Content-type": "application/json"
        },
        body: JSON.stringify({
            page: { url: URL }
        })
    }).then(response => response.json())
        .then(file => {
          uploadedFileID = file.id
          console.log("uploaded file id", `http://localhost:3000/pages/${uploadedFileID}`)
          showParsedPDF()
        })
        
}

function showParsedPDF(event) {
    let fileContent = "";
    $uploaderBox.remove()
    $uploaderHeader.textContent = "Hover over pay items to learn about them"
    $documentDisplay.style.opacity="1"
    fetch(`http://localhost:3000/pages/${uploadedFileID}`)
        .then(response => response.json())
        .then(file => {
            fileContent = file.content
            let splitFile = fileContent.split(/\r?\n/)
            splitFile.splice("", 'Test')
            let filteredFileArray = splitFile.filter(word => word != false)
            filteredFileArray.map(arrayItem => {
                $row = document.createElement("tr")
                rowArray = arrayItem.split("                    ")
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
    //create a modal that will become visible and whose text will be dictated by hover
    event.target.prepend($modal)
     $modal.style.display = "block"
    if (title.includes("gross")) {
        $modal.innerHTML = `
           <p> <b>Gross Earnings-</b> the money you would earn without any taxes or deductions. </p>
           <p> <b>Hourly-</b> hours worked <b>x</b> hourly rate </p>
           <p> <b>Salaried (biweekly)-</b>  yearly salary ÷  26 </p>
           <p> <b>Salaried (semi-monthly)-</b> your yearly salary ÷ 24 </p>
        `
    } else if (title.includes("pre-tax")){
        $modal.innerHTML = `
            <b>Pre-Tax Deductions</b> are taken out of your pay before taxes are deducted.
            <p><b>Why is this beneficial?</b> When your tax percentages are calcualted, they will now be calculated on a lower number
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
        part of yur net pay, but you will not be receiving it in this week's check, as it
        has already been paid out.
        `

    } else {
        $modal.style.display = "none"
    }
}
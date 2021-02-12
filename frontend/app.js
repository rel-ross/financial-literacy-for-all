console.log("here!")
const $enterButton = document.querySelector(".enter-button")
const $companySideBar = document.querySelector(".company-sidebar")
const $search = document.querySelector("#search")
const $navBar = document.querySelector("#navbar")
// const $uploaderBox = document.querySelector('#uploader-drop-box')
const $progress = document.querySelector('#progress')

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
    apiKey: "AIzaSyCVpdp_zJD6hFhb1WkTgOrE4IsShhDRAyQ",
    authDomain: "paystub-literacy.firebaseapp.com",
    projectId: "paystub-literacy",
    databaseURL: "https://paystub-literacy-default-rtdb.firebaseio.com/",
    storageBucket: "paystub-literacy.appspot.com",
    messagingSenderId: "1001559770152",
    appId: "1:1001559770152:web:45e63caad1566ae98fa11d",
    measurementId: "G-PPETCFSEGX"
  };
  // Initialize Firebase
firebase.initializeApp(firebaseConfig);



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
           const $progressBar = document.getElementById("progress")
           $progressBar.style.visibility = "visible"
           $progressBar.value = percentage;
        },

        function error() {
          alert("error uploading file");
        },

        function complete() {
          document.getElementById(
            "uploading"
          ).innerHTML += `${files[i].name} uploaded <br />`;
        }
      );
    }
  } else {
    alert("No file chosen");
  }
});

function getFileUrl(filename) {
  //create a storage reference
  var storage = firebase.storage().ref(filename);

  //get file url
  storage
    .getDownloadURL()
    .then(function(url) {
      console.log(url);
    })
    .catch(function(error) {
      console.log("error encountered");
    });
}

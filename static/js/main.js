// Firebase configuration and initialization code
var firebaseConfig = {
  apiKey: "AIzaSyBN-75_1oDyA1L-7YT05PIc1rBAm_EToAQ",
  authDomain: "team6-5d749.firebaseapp.com",
  databaseURL: "https://team6-5d749-default-rtdb.firebaseio.com",
  projectId: "team6-5d749",
  storageBucket: "team6-5d749.appspot.com",
  messagingSenderId: "867454144316",
  appId: "1:867454144316:web:a5fa28b431b5fbd0625839"
};
// Initialize Firebase
var init = firebase.initializeApp(firebaseConfig);


// Function to update card styles on mouseover and mouseout
function updateCardStyles(cardElement, isMouseOver) {
  cardElement.style.width = isMouseOver ? "30%" : "18%";
  cardElement.style.height = isMouseOver ? "350px" : "320px";
  cardElement.querySelector(".mbti").style.display = isMouseOver ? "block" : "none";
  cardElement.querySelector(".intro").style.display = isMouseOver ? "block" : "none";
  cardElement.querySelector(".blog").style.display = isMouseOver ? "block" : "none";
  cardElement.querySelector(".motto").style.display = isMouseOver ? "block" : "none";
}

// Function to add profile data to Firebase
function addProfileData(name, mbti, blog, motto) {
  const profileData = {
      mbti: mbti,
      blog: blog,
      motto: motto
  };

  // Reference to the Firebase database
  const dbRef = firebase.database().ref();

  // Reference to the "profiles" node where you want to store the data
  const profilesRef = dbRef.child("profiles");

  // Add the data under the team member's name
  profilesRef.child(name).set(profileData)
      .then(function() {
          console.log("Data added to Firebase successfully.");
      })
      .catch(function(error) {
          console.error("Error adding data to Firebase: ", error);
      });
}

// Attach mouseover event listeners to the cards
var cards = document.querySelectorAll(".team_card");

cards.forEach((card) => {

    var name = card.getAttribute("value");

    card.addEventListener("mouseover", (e) => {
      updateCardStyles(e.currentTarget, true);

      // Fetch and display profile data when hovered
      var profileRef = firebase.database().ref("profiles/" + name);

      profileRef.on("value", function (snapshot) {
          var profile = snapshot.val();

          if (profile) {
              // Find the card associated with the name
              var mbtiSpan = card.querySelector(".mbti");
              var blogSpan = card.querySelector(".blog-link");
              var mottoSpan = card.querySelector(".motto");

              // Update card display with fetched profile data
              mbtiSpan.textContent = profile.mbti;
              blogSpan.textContent = profile.blog;
              mottoSpan.textContent = profile.motto;
          }
      });
  });

  card.addEventListener("mouseout", (e) => {
      updateCardStyles(e.currentTarget, false);
  });
});

// Example usage to add data (you can call this when needed)
addProfileData("김지엽", "ENFP", "https://example.com/kim-blog", "Live life to the fullest.");
addProfileData("박조은", "ENFP", "https://example.com/kim-blog", "Live life to the fullest.");
addProfileData("김세웅", "ENFP", "https://example.com/kim-blog", "Live life to the fullest.");
addProfileData("민찬기", "ENFP", "https://example.com/kim-blog", "Live life to the fullest.");


function newComment(name, password, comment) {
    const commentData = {
        name,
        password,
        comment,
    };
  
    // Reference to the Firebase database
    const dbRef = firebase.database().ref();
  
    // Reference to the "profiles" node where you want to store the data
    const profilesRef = dbRef.child("comments");
  
    // Add the data under the team member's name
    return profilesRef.child(name).set(commentData)
        .then(function() {
            console.log("Data added to Firebase successfully.");
            return true;
        })
        .catch(function(error) {
            console.error("Error adding data to Firebase: ", error);
            return false;
        });
}

// {name, comment}[]
function getComments() {
    const database = firebase.database();

    const commentsRef = database.ref("comments");

    commentsRef.once("value", (snapshot) => {
        const commentsData = snapshot.val();

        Object.keys(commentsData).forEach((commentData) => {
            addCommentToScreen(commentData);
        });
    });
}

function isPasswordCorrect(name, password) {
    const database = firebase.database();

    const commentRef = database.ref("comments").child(name);

    commentRef.once("value", (snapshot) => {
        const commentData = snapshot.val();

        if (commentData.password === password) {
            return true;
        } else {
            return false;
        }
    });
}

function updateComment(name, password, newComment) {

}

function deleteComment(name, password) {

}

// { name: "김지엽", password: "1234", content: "하이" }
function addCommentToScreen(commentData) {
const addCommnetToScreen = document.querySelector(".comment_list");
const comment_list = document.createElement("li")

commentList.appendChild(comment_list);
}

const commentSubmitButton = document.querySelector(".comment_submit button");

commentSubmitButton.addEventListener("click", async (e) => {
    const name_ = document.querySelector(".comment_name");
    const password_ = document.querySelector(".comment_password");
    const content_ = document.querySelector(".comment_text");

    const name = name_.value ? name_.value : "익명";
    const password = password_.value ? password_.value : "";
    const content = content_.value;

    if (!content) {
        alert("내용은 필수입니다!");
        return;
    }

    const result = await newComment(name, password, content);

    console.log(result);

    if (result) {
        alert("댓글 등록 완료!");
    } else {
        alert("댓글 등록 실패!(이름과 내용은 필수입니다)");
    }

    name_.value = "";
    password_.value = "";
    content_.value = "";
});

getComments();
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
  var profileData = {
      mbti: mbti,
      blog: blog,
      motto: motto
  };

  // Reference to the Firebase database
  var dbRef = firebase.database().ref();

  // Reference to the "profiles" node where you want to store the data
  var profilesRef = dbRef.child("profiles");

  // Add the data under the team member's name
  profilesRef.child(name).set(profileData)
      .then(function() {
          console.log("Data added to Firebase successfully.");
      })
      .catch(function(error) {
          console.error("Error adding data to Firebase: ", error);
      });
}
// Function to display comments
function displayComments(comments) {
    // Select the ".comments" div where comments will be displayed
    var commentsContainer = document.querySelector(".comments");

    // Clear any existing comments
    commentsContainer.innerHTML = "";

    // Loop through the comments and create HTML elements for each comment
    comments.forEach(function(comment) {
        // Create a comment container div
        var commentDiv = document.createElement("div");
        commentDiv.classList.add("comment");

        // Create elements for comment details: name, content, and timestamp
        var nameElement = document.createElement("strong");
        nameElement.textContent = comment.name;

        var contentElement = document.createElement("p");
        contentElement.textContent = comment.content;

        var timestampElement = document.createElement("small");
        timestampElement.textContent = new Date(comment.timestamp).toLocaleString();

        // Append the comment details to the comment container
        commentDiv.appendChild(nameElement);
        commentDiv.appendChild(contentElement);
        commentDiv.appendChild(timestampElement);

        // Append the comment container to the comments container
        commentsContainer.appendChild(commentDiv);
    });
}

// Example usage of the displayComments function
// Replace this with your actual comments data
var commentsData = [
    {
        name: "User1",
        content: "This is the first comment.",
        timestamp: "2023-10-08T12:00:00Z"
    },
    {
        name: "User2",
        content: "This is the second comment.",
        timestamp: "2023-10-08T12:30:00Z"
    }
];

// Call the displayComments function with your comments data
displayComments(commentsData);

// Attach mouseover event listeners to the cards
var cards = document.querySelectorAll(".team_card");

const commentSubmitButton = document.querySelector(".comment_submit button");

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

    // Authenticate the user
    var user = firebase.auth().currentUser;
    if (!user) {
        alert("로그인이 필요합니다!");
        return;
    }

    // Hash the provided password using bcrypt
    const saltRounds = 10; // You can adjust the number of salt rounds for security
    const hashedPassword = await bcrypt.hash(password, saltRounds);

    // Create a new comment object
    const newComment = {
        name: name,
        password: hashedPassword,
        content: content,
        timestamp: new Date().toISOString(),
    };

    // Add the comment to the database
    var commentsRef = firebase.database().ref("comments");
    var newCommentRef = commentsRef.push();
    newCommentRef.set(newComment)
        .then(function() {
            alert("댓글 등록 완료!");
        })
        .catch(function(error) {
            console.error("댓글 등록 실패: ", error);
        });

    name_.value = "";
    password_.value = "";
    content_.value = "";
});
// Delete button event listener
commentDeleteButton.addEventListener("click", async (e) => {
    const commentId = e.target.getAttribute("data-comment-id");
    const password = prompt("Please enter the password to delete the comment:");

    if (!password) {
        alert("Password is required to delete the comment.");
        return;
    }

    // Authenticate the user
    var user = firebase.auth().currentUser;
    if (!user) {
        alert("로그인이 필요합니다!");
        return;
    }

    // Hash the provided password (use a library like bcrypt)
    const hashedPassword = await hashPassword(password);

    // Check if the password matches the hashed password in the database
    var commentRef = firebase.database().ref("comments/" + commentId);
    commentRef.once("value").then(function(snapshot) {
        var comment = snapshot.val();
        if (comment && comment.name === user.displayName && comment.password === hashedPassword) {
            // Delete the comment
            commentRef.remove()
                .then(function() {
                    alert("댓글 삭제 완료!");
                })
                .catch(function(error) {
                    console.error("댓글 삭제 실패: ", error);
                });
        } else {
            alert("댓글 삭제 실패: 이름 또는 암호가 일치하지 않습니다.");
        }
    });
});
// Edit button event listener
commentEditButton.addEventListener("click", async (e) => {
    const commentId = e.target.getAttribute("data-comment-id");
    const password = prompt("Please enter the password to edit the comment:");

    if (!password) {
        alert("Password is required to edit the comment.");
        return;
    }

    // Authenticate the user
    var user = firebase.auth().currentUser;
    if (!user) {
        alert("로그인이 필요합니다!");
        return;
    }

    // Hash the provided password (use a library like bcrypt)
    const hashedPassword = await hashPassword(password);

    // Check if the password matches the hashed password in the database
    var commentRef = firebase.database().ref("comments/" + commentId);
    commentRef.once("value").then(function(snapshot) {
        var comment = snapshot.val();
        if (comment && comment.name === user.displayName && comment.password === hashedPassword) {
            const updatedContent = prompt("Please enter the updated comment:");
            if (updatedContent) {
                // Update the comment content
                commentRef.update({ content: updatedContent })
                    .then(function() {
                        alert("댓글 수정 완료!");
                    })
                    .catch(function(error) {
                        console.error("댓글 수정 실패: ", error);
                    });
            } else {
                alert("댓글 수정을 취소했습니다.");
            }
        } else {
            alert("댓글 수정 실패: 이름 또는 암호가 일치하지 않습니다.");
        }
    });
});

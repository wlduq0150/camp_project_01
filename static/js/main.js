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


// 사용 예시: const result = await newComment("이름", "비밀번호", "댓글");

// Function to add a new comment
function addNewComment(name, password, content) {
    const commentsRef = firebase.database().ref("comments");

    const newCommentRef = commentsRef.push();
    const newCommentData = {
        name: name,
        password: password,
        content: content,
        timestamp: new Date().toISOString(),
    };

    return newCommentRef.set(newCommentData)
        .then(function() {
            return true;
        })
        .catch(function(error) {
            console.error("Error adding comment: ", error);
            return false;
        });
}

// Function to retrieve and display comments
function getComments() {
    const commentsRef = firebase.database().ref("comments");

    commentsRef.once("value", function(snapshot) {
        const commentsData = snapshot.val();
        const commentsArray = [];

        for (const key in commentsData) {
            if (commentsData.hasOwnProperty(key)) {
                commentsArray.push(commentsData[key]);
            }
        }

        displayComments(commentsArray);
    });
}

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

    // Check if the user is authenticated (you can add Firebase Auth logic here)

    // Add the new comment
    const result = await addNewComment(name, password, content);

    if (result) {
        alert("댓글 등록 완료!");
        getComments(); // Refresh comments
    } else {
        alert("댓글 등록 실패!(이름과 내용은 필수입니다)");
    }

    name_.value = "";
    password_.value = "";
    content_.value = "";
});

function getComments() {
    const database = firebase.database();

    const commentsRef = database.ref("comments");

    commentsRef.once("value", (snapshot) => {
        const commentsData = snapshot.val();

        Object.keys(commentsData).forEach((name) => {
            const commentData = commentsData[name];
            addCommentToScreen(commentData);
        });
    });
}


// 사용 예시(1): const result = await isPasswordCorrect("이름", "비밀번호");

// 사용 예시(2): 
// isPasswordCorrect("이름", "비밀번호")
// .then((result) => {
//     console.log(result);
// })
// .catch((e) => {
//     console.log(e);
// });

async function isPasswordCorrect(name, password) {
    const database = firebase.database();

    const commentRef = database.ref("comments").child(name);

    const snapshot = await commentRef.once("value");

    const commentData = snapshot.val();

    if (commentData.password === password) {
        return true;
    } else {
        return false;
    }
}
  

function updateComment(name, password, newComment) {

}

function deleteComment(name, password) {

}

// { name: "김지엽", password: "1234", content: "하이" }
// Function to add a new comment
function addNewComment(name, password, content) {
    const commentsRef = firebase.database().ref("comments");

    const newCommentRef = commentsRef.push();
    const newCommentData = {
        name: name,
        password: password,
        content: content,
        timestamp: new Date().toISOString(),
    };

    return newCommentRef.set(newCommentData)
        .then(function() {
            return true;
        })
        .catch(function(error) {
            console.error("Error adding comment: ", error);
            return false;
        });
}

// Function to add a comment to the screen
function addCommentToScreen(commentData) {
    // Create a comment container div
    var commentDiv = document.createElement("div");
    commentDiv.classList.add("comment");

    // Create elements for comment details: name, content, and timestamp
    var nameElement = document.createElement("strong");
    nameElement.textContent = commentData.name;

    var contentElement = document.createElement("p");
    contentElement.textContent = commentData.content;

    var timestampElement = document.createElement("small");
    timestampElement.textContent = new Date(commentData.timestamp).toLocaleString();

    // Append the comment details to the comment container
    commentDiv.appendChild(nameElement);
    commentDiv.appendChild(contentElement);
    commentDiv.appendChild(timestampElement);

    // Select the ".comments" div where comments will be displayed
    var commentsContainer = document.querySelector(".comments");

    // Append the comment container to the comments container
    commentsContainer.appendChild(commentDiv);
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

    // Authenticate the user (implement Firebase Auth logic here)

    // Add the new comment
    const result = await addNewComment(name, password, content);

    if (result) {
        // Successfully added the comment, now display it
        addCommentToScreen({
            name: name,
            content: content,
            timestamp: new Date().toISOString(),
        });

        alert("댓글 등록 완료!");
    } else {
        alert("댓글 등록 실패!(이름과 내용은 필수입니다)");
    }

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

getComments();

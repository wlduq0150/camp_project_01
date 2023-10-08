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
addProfileData("김지엽", "ENFJ", "https://example.com/kim-blog", "Live life to the fullest.");
addProfileData("박조은", "ENFP", "https://example.com/kim-blog", "Live life to the fullest.");
addProfileData("김세웅", "ENFP", "https://example.com/kim-blog", "Live life to the fullest.");
addProfileData("민찬기", "ENFP", "https://example.com/kim-blog", "Live life to the fullest.");


async function hashPassword(password) {
  try {
    const encoder = new TextEncoder();
    const data = encoder.encode(password);

    const hashBuffer = await crypto.subtle.digest('SHA-256', data);

    const hashArray = Array.from(new Uint8Array(hashBuffer));
    const hashHex = hashArray.map(byte => byte.toString(16).padStart(2, '0')).join('');

    return hashHex;
  } catch (error) {
    console.error('Error hashing password:', error);
    return null;
  }
}

// 사용 예시: const result = await newComment("이름", "비밀번호", "댓글");
async function newComment(name, password, comment) {
    const hashedPassword = await hashPassword(password);
    const commentData = {
        name,
        password: hashedPassword,
        comment,
    };
  
    // 파이어베이스 참조
    const dbRef = firebase.database().ref();
  
    // comments 참조
    const profilesRef = dbRef.child("comments");
  
    // name 아래에 댓글 추가
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


function getComments() {
    const database = firebase.database();

    const commentsRef = database.ref("comments");

    commentsRef.once("value", (snapshot) => {
        const commentsData = snapshot.val();

        if (commentsData) {
            Object.keys(commentsData).forEach((name) => {
                const commentData = commentsData[name];
                addCommentToScreen(commentData);
            });
        }
    });
}

async function updateComment(name, password, updatedContent) {
    var commentRef = firebase.database().ref("comments/" + name);

    const hashedPassword = await hashPassword(password);

    commentRef.once("value").then(function (snapshot) {
        var comment = snapshot.val();
        if (comment && comment.password === hashedPassword) {
            if (updatedContent) {
                // Update the comment content
                commentRef.update({ comment: updatedContent })
                    .then(function () {
                        alert("댓글 수정 완료!");
                    })
                    .catch(function (error) {
                        console.error("댓글 수정 실패: ", error);
                    });
            } else {
                alert("댓글 수정을 취소했습니다.");
            }
        } else {
            alert("댓글 수정 실패: 이름 또는 암호가 일치하지 않습니다.");
        }
    });
}

async function deleteComment(name, password) {
    // Hash the provided password (use a library like bcrypt)
    const hashedPassword = await hashPassword(password);

    // Check if the password matches the hashed password in the database
    var commentRef = firebase.database().ref("comments/" + name);
    commentRef.once("value").then(function (snapshot) {
        var comment = snapshot.val();
        if (comment && comment.password === hashedpassword) {
            // Delete the comment
            commentRef.remove()
                .then(function () {
                    alert("댓글 삭제 완료!");
                })
                .catch(function (error) {
                    console.error("댓글 삭제 실패: ", error);
                });
        } else {
            alert("댓글 삭제 실패: 이름 또는 암호가 일치하지 않습니다.");
        }
    });
}

// { name: "김지엽", password: "1234", content: "하이" }
function addCommentToScreen(commentData) {
    console.log(commentData);
    const commentList = document.querySelector(".comment_list");

    const commentElement = document.createElement("li");
    
    const name = document.createElement("span");
    name.textContent = commentData.name;
    const content = document.createElement("p");
    content.textContent = commentData.comment;

    commentElement.appendChild(name); // name -> li
    commentElement.appendChild(content); // p -> li

    commentList.appendChild(commentElement); // li -> comment_list
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

getComments();

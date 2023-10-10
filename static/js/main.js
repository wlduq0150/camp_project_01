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

let showCommentCount = 3;
let allCommentCount = 3;
let isLoading = false;

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
async function newComment(name, password, content) {
    // 현재 시간을 id로 설정
    const id = Date.now().toString();
    // password 암호화
    const hashedPassword = await hashPassword(password);
    const commentData = {
        id,
        name,
        password: hashedPassword,
        comment: content,
    };
  
    // 파이어베이스 참조
    const dbRef = firebase.database().ref();
  
    // comments 참조
    const profilesRef = dbRef.child("comments");
  
    // id 아래에 댓글 추가
    try {
        await profilesRef.child(id).set(commentData);
    } catch (e) {
        return false;
    }

    reloadComments();

    return true;
}


async function reloadComments() {
    deleteComments();

    const database = firebase.database();

    const commentsRef = database.ref("comments");

    const commentsData = (await commentsRef.once("value")).val();

    if (commentsData) {
        const commentIds = Object.keys(commentsData).reverse();

        commentIds
            .slice(0, showCommentCount)
            .forEach((id) => {
                const commentData = commentsData[id];
                addCommentToScreen({ id, ...commentData });
            });

        allCommentCount = commentIds.length;
    }
}

function deleteComments() {
    document.querySelectorAll("li").forEach((comment) => {
        comment.remove();
    });
} 

async function updateComment(id) {

    var commentRef = firebase.database().ref("comments/" + id);

    const password = prompt("암호를 입력해주세요.");
    const updateContent = prompt("수정할 내용을 입력해주세요.");

    const hashedPassword = await hashPassword(password);

    commentRef.once("value").then(function (snapshot) {
        var comment = snapshot.val();
        if (comment && comment.password === hashedPassword) {
            if (updateContent) {
                // Update the comment content
                commentRef.update({ comment: updateContent })
                    .then(function () {
                        alert("댓글 수정 완료!");
                        reloadComments();
                    })
                    .catch(function (error) {
                        console.error("댓글 수정 실패: ", error);
                    });
            } else {
                alert("댓글 수정을 취소했습니다.");
            }
        } else {
            alert("댓글 수정 실패: 암호가 일치하지 않습니다.");
        }
    });
}

async function deleteComment(id) {
    const password = prompt("암호를 입력해주세요.");
    // Hash the provided password (use a library like bcrypt)
    const hashedPassword = await hashPassword(password);

    // Check if the password matches the hashed password in the database
    var commentRef = firebase.database().ref("comments/" + id);
    commentRef.once("value").then(function (snapshot) {
        var comment = snapshot.val();
        if (comment && comment.password === hashedPassword) {
            // Delete the comment
            commentRef.remove()
                .then(function () {
                    alert("댓글 삭제 완료!");
                    reloadComments();
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
    const commentList = document.querySelector(".comment_list");

    const commentElement = document.createElement("li");
    commentElement.classList.add("comment");

    const contentBlock = document.createElement("div");
    contentBlock.classList.add("content_block")
    
    const name = document.createElement("span");
    name.textContent = commentData.name;
    const content = document.createElement("p");
    content.textContent = commentData.comment;

    contentBlock.appendChild(name);
    contentBlock.appendChild(content);

    const buttonBlock = document.createElement("div");
    buttonBlock.classList.add("button_block");

    const updateButton = document.createElement("button");
    updateButton.classList.add("update_button");
    updateButton.dataset.id = commentData.id;
    updateButton.textContent = "수정";

    const deleteButton = document.createElement("button");
    deleteButton.classList.add("delete_button");
    deleteButton.dataset.id = commentData.id;
    deleteButton.textContent = "삭제";

    updateButton.addEventListener("click", (e) => {
        updateComment(commentData.id);
    });

    deleteButton.addEventListener("click", (e) => {
        deleteComment(commentData.id);
    });

    buttonBlock.appendChild(updateButton);
    buttonBlock.appendChild(deleteButton);

    commentElement.appendChild(contentBlock);
    commentElement.appendChild(buttonBlock);

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
    
    const result = newComment(name, password, content);

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

reloadComments();

function scrollDelay(func, delay) {
    let timer;
    return function () {
        if (!timer) {
            timer = setTimeout(() => {
                func();
                timer = null;
            }, delay);
        }
    };
}

function scrollHandler() {
    const { scrollTop, clientHeight, scrollHeight } = document.documentElement;
    if (
        !isLoading &&
        allCommentCount > showCommentCount &&
        scrollTop + clientHeight >= scrollHeight - 10
    ) {
        isLoading = true;
        showCommentCount += 5;
        reloadComments()
        .then(() => {
            isLoading = false;
        });
    }
}

window.addEventListener(
    "scroll",
    scrollDelay((e) => {
        scrollHandler();
    }, 1500)
);
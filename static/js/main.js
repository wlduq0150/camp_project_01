const commentSubmitButton = document.querySelector(".comment_submit button");
const commentDeleteButton = document.querySelector(".comment_delete button");
const commentEditButton = document.querySelector(".comment_edit button");

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
    commentRef.once("value").then(function (snapshot) {
        var comment = snapshot.val();
        if (comment && comment.name === user.displayName && comment.password === hashedPassword) {
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
    commentRef.once("value").then(function (snapshot) {
        var comment = snapshot.val();
        if (comment && comment.name === user.displayName && comment.password === hashedPassword) {
            const updatedContent = prompt("Please enter the updated comment:");
            if (updatedContent) {
                // Update the comment content
                commentRef.update({ content: updatedContent })
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
});

getComments();

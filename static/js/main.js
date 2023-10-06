const server = "";
const cards = document.querySelectorAll(".team_card");
const commentSubmitButton = document.querySelector(".comment_submit button");

console.log(commentSubmitButton);

async function getProfile(name) {
    fetch(server + `/profile?name=${name}`, {
        method: "GET"
    })
    .then((response) => {
        return response.json();
    });
}

async function postComment(
    name,
    password,
    content
) {
    if (!name || !content) return false;

    const response = fetch(server + `/writeComment`, {
        method: "POST",
        body: JSON.stringify({
            name,
            password,
            content
        })
    });

    return response.json().result;
}

cards.forEach((card) => {
    card.addEventListener("mouseover", (e) => {
        const cardElement = e.currentTarget;

        // const name = cardElement.querySelector(".name").innerText;

        // const { mbti, intro } = await getProfile(name);

        // cardElement.querySelector(".mbti").innerText = mbti;
        // cardElement.querySelector(".intro").innerText = intro;

        cardElement.style.width = "25%";
        cardElement.style.height = "380px";

        cardElement.querySelector(".mbti").style.display = "block";
        cardElement.querySelector(".intro").style.display = "block";
    });

    card.addEventListener("mouseout", (e) => {
        const cardElement = e.currentTarget;

        cardElement.style.width = "20%";
        cardElement.style.height = "320px";

        cardElement.querySelector(".mbti").style.display = "none";
        cardElement.querySelector(".intro").style.display = "none";
    });
});

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

    // const result = await postComment(name, password, content);
    const result = true;

    if (result) {
        alert("댓글 등록 완료!");
    } else {
        alert("댓글 등록 실패!(이름과 내용은 필수입니다)");
    }

    name_.value = "";
    password_.value = "";
    content_.value = "";
});

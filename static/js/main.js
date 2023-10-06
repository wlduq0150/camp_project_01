var cards = document.querySelectorAll(".team_card");

const server = "";

function getProfile(name) {
    fetch(server + `/profile?name=${name}`, {
        method: "GET"
    })
    .then((response) => {
        return response.json();
    });
}

cards.forEach((card) => {
    card.addEventListener("mouseover", (e) => {
        var cardElement = e.currentTarget;

        // const name = cardElement.querySelector(".name").innerText;

        // const { mbti, intro } = getProfile(name);

        // cardElement.querySelector(".mbti").innerText = mbti;
        // cardElement.querySelector(".intro").innerText = intro;

        cardElement.style.width = "30%";
        cardElement.style.height = "350px";

        cardElement.querySelector(".mbti").style.display = "block";
        cardElement.querySelector(".intro").style.display = "block";
    });

    card.addEventListener("mouseout", (e) => {
        var cardElement = e.currentTarget;

        cardElement.style.width = "20%";
        cardElement.style.height = "280px";

        cardElement.querySelector(".mbti").style.display = "none";
        cardElement.querySelector(".intro").style.display = "none";
    });
});

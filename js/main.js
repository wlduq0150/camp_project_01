var cards = document.querySelectorAll(".team_card");

const server = "";

function getProfile(name) {
    const response = fetch(server + "/profile", {
        method: "GET"
    });
    return response.json();
}

cards.forEach((card) => {
    card.addEventListener("mouseover", (e) => {
        var cardElement = e.currentTarget;

        console.log(cardElement);

        const name = e.target.value;
        console.log(name);

        // const { userName, mbti, intro } = getProfile();

        

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

var cards = document.querySelectorAll(".team_card");

for ( var card of cards ) {
    card.addEventListener("click", (event) => {
        console.log("연결됨");
    });
}
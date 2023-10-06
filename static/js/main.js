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

// Function to update card styles on mouseover and mouseout
function updateCardStyles(cardElement, isMouseOver) {
    cardElement.style.width = isMouseOver ? "30%" : "20%";
    cardElement.style.height = isMouseOver ? "350px" : "280px";
    cardElement.querySelector(".mbti").style.display = isMouseOver ? "block" : "none";
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
                var blogSpan = card.querySelector(".blog");
                var mottoSpan = card.querySelector(".motto");

                // Update card display with fetched profile data
                mbtiSpan.textContent = "MBTI: " + profile.mbti;
                blogSpan.textContent = "Blog: " + profile.blog;
                mottoSpan.textContent = "Motto: " + profile.motto;
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

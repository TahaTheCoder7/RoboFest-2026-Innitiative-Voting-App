document.addEventListener("DOMContentLoaded", function () {

    const cards = document.querySelectorAll(".card");
    const communityGroup = document.getElementById("communityGroup");
    const votingContainer = document.querySelector(".voting-cards");
    const thanksSection = document.querySelector(".thanks");

    const submitButton = document.querySelector(
        '.voting-cards > button[onclick="Submit()"]'
    );

    // Only ONE vote is allowed
    let selectedVote = null;
    let voteSubmitted = false;

    // ==========================================
    // INITIAL SETUP
    // ==========================================
    cards.forEach(function (card) {
        const removeButton = card.querySelector(
            ".voting-cta-btn:nth-of-type(2) button"
        );

        if (removeButton) {
            removeButton.style.display = "none";
        }
    });

    updateSubmitButton();

    // ==========================================
    // CAST VOTE
    // ==========================================
    window.castVote = function (id) {
        if (voteSubmitted) return;

        const card = document.getElementById("card-" + id);
        if (!card) return;

        const voteButton = card.querySelector(
            ".voting-cta-btn:first-of-type button"
        );

        if (selectedVote === id) {
            return;
        }

        // Remove previous selection
        if (selectedVote !== null) {
            const oldCard = document.getElementById("card-" + selectedVote);
            if (oldCard) {
                const oldButton = oldCard.querySelector(
                    ".voting-cta-btn:first-of-type button"
                );
                oldCard.classList.remove("selected");
                if (oldButton) {
                    oldButton.classList.remove("selected-btn");
                    oldButton.innerHTML = "Vote!";
                }
            }
        }

        // Select new vote
        selectedVote = id;
        card.classList.add("selected");

        if (voteButton) {
            voteButton.classList.add("selected-btn");
            voteButton.innerHTML = "✓ Selected";
        }

        updateSubmitButton();
    };

    // ==========================================
    // REMOVE VOTE
    // ==========================================
    window.removeVote = function (id) {
        if (voteSubmitted) return;
        if (selectedVote !== id) return;

        const card = document.getElementById("card-" + id);
        if (!card) return;

        const voteButton = card.querySelector(
            ".voting-cta-btn:first-of-type button"
        );

        selectedVote = null;
        card.classList.remove("selected");

        if (voteButton) {
            voteButton.classList.remove("selected-btn");
            voteButton.innerHTML = "Vote!";
        }

        updateSubmitButton();
    };

    // ==========================================
    // SUBMIT VOTE
    // ==========================================
    window.Submit = function () {
        if (selectedVote === null) {
            Swal.fire({
                title: "No Vote Selected",
                text: "Please select one initiative before submitting.",
                icon: "info",
                confirmButtonText: "OK",
                confirmButtonColor: "#4CAF50"
            });
            return;
        }

        const groupName = communityGroup.options[communityGroup.selectedIndex].text;

        Swal.fire({
            title: "Submit Your Vote?",
            html:
                "You have selected initiative " +
                "<b>ID: " + selectedVote + "</b>" +
                "<br><br>" +
                "<strong>Community Group:</strong><br>" +
                groupName,
            icon: "question",
            showCancelButton: true,
            confirmButtonText: "Yes, Submit Vote",
            cancelButtonText: "Cancel",
            confirmButtonColor: "#4CAF50",
            cancelButtonColor: "#777",
            reverseButtons: true,
            allowOutsideClick: false
        }).then(function (result) {
            if (result.isConfirmed) {
                submitVote();
            }
        });
    };

    function submitVote() {
        voteSubmitted = true;

        cards.forEach(function (card) {
            const buttons = card.querySelectorAll("button");
            buttons.forEach(function (button) {
                button.disabled = true;
            });
        });

        communityGroup.disabled = true;
        submitButton.disabled = true;

        votingContainer.style.display = "none";
        thanksSection.style.display = "block";
    }

    // ==========================================
    // CHANGE YOUR VOTE
    // ==========================================
    window.changeVote = function () {
        Swal.fire({
            title: "Change Your Vote?",
            text: "Do you want to go back and change your selected initiative?",
            icon: "warning",
            showCancelButton: true,
            confirmButtonText: "Yes, Change Vote",
            cancelButtonText: "Keep My Vote",
            confirmButtonColor: "#4CAF50",
            cancelButtonColor: "#777",
            reverseButtons: true,
            allowOutsideClick: false
        }).then(function (result) {
            if (!result.isConfirmed) {
                return;
            }

            voteSubmitted = false;

            // Fix display to grid to maintain layout
            votingContainer.style.display = "grid";
            thanksSection.style.display = "none";
            communityGroup.disabled = false;

            cards.forEach(function (card) {
                const buttons = card.querySelectorAll("button");
                buttons.forEach(function (button) {
                    button.disabled = false;
                });

                const id = card.id.replace("card-", "");
                const voteButton = card.querySelector(
                    ".voting-cta-btn:first-of-type button"
                );

                if (selectedVote === id) {
                    card.classList.add("selected");
                    if (voteButton) {
                        voteButton.classList.add("selected-btn");
                        voteButton.innerHTML = "✓ Selected";
                    }
                } else {
                    card.classList.remove("selected");
                    if (voteButton) {
                        voteButton.classList.remove("selected-btn");
                        voteButton.innerHTML = "Vote!";
                    }
                }
            });

            updateSubmitButton();
        });
    };

    // ==========================================
    // UPDATE SUBMIT BUTTON
    // ==========================================
    function updateSubmitButton() {
        if (!submitButton) return;

        if (selectedVote === null) {
            submitButton.disabled = true;
            submitButton.innerHTML = "Submit Vote";
        } else {
            submitButton.disabled = false;
            submitButton.innerHTML = "Submit Vote (1)";
        }
    }

});
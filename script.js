// ===== MY JUNGLE – Shir Goldstein =====
// This file handles all site functionality:
// click events, keyboard events, background music, and animations.

// -------------------------------------------
// 1. BACKGROUND MUSIC — plays on page load
// -------------------------------------------
const bgMusic = document.getElementById("background-music");

// We play background music after the first user interaction,
// because browsers block autoplay without a user gesture.
document.addEventListener("click", function startMusic() {
    bgMusic.volume = 0.3;
    bgMusic.play();
    // Remove the listener after first click so it runs only once
    document.removeEventListener("click", startMusic);
}, { once: true });

// -------------------------------------------
// MUSIC TOGGLE BUTTON — stop/resume forest background sound
// -------------------------------------------
const musicToggleBtn = document.getElementById("music-toggle");

// Only add the listener if the button exists in the page
if (musicToggleBtn) {
    musicToggleBtn.addEventListener("click", function() {
        if (bgMusic.paused) {
            // Resume music
            bgMusic.play();
            musicToggleBtn.textContent = "🔊 Stop Forest Sounds";
            musicToggleBtn.classList.remove("muted");
        } else {
            // Pause music
            bgMusic.pause();
            musicToggleBtn.textContent = "🔇 Play Forest Sounds";
            musicToggleBtn.classList.add("muted");
        }
    });
}

// -------------------------------------------
// 2. BUILD KEY MAP — map each keyboard key to its animal card
// -------------------------------------------
const keyMap = {};  // object: key letter -> animal card element

const allCards = document.querySelectorAll(".animal-card");

// Loop over all animal cards and register them in the keyMap
allCards.forEach(function(card) {
    const key = card.getAttribute("data-key");  // e.g. "a"
    keyMap[key] = card;
});

// -------------------------------------------
// 3. PLAY SOUND FUNCTION
// -------------------------------------------
function playAnimalSound(card) {
    const soundSrc = card.getAttribute("data-sound");

    // Create a new Audio object each time so overlapping sounds work
    const sound = new Audio(soundSrc);
    sound.play();

    // Add "active" CSS class for visual feedback
    card.classList.add("active");

    // Remove the active class after 600ms (animation ends)
    setTimeout(function() {
        card.classList.remove("active");
    }, 600);
}

// -------------------------------------------
// 4. CLICK EVENT — clicking an animal card plays its sound
// -------------------------------------------
allCards.forEach(function(card) {
    card.addEventListener("click", function() {
        playAnimalSound(card);
    });
});

// -------------------------------------------
// 5. KEYBOARD EVENT — pressing a mapped key plays the animal's sound
// -------------------------------------------
document.addEventListener("keydown", function(event) {
    const pressedKey = event.key.toLowerCase();  // normalize to lowercase

    // Check if this key is mapped to an animal
    if (keyMap[pressedKey]) {
        playAnimalSound(keyMap[pressedKey]);
    }
});

// -------------------------------------------
// 6. EXTRA ELEMENT NOT TAUGHT IN CLASS: Intersection Observer
//    This API watches when each animal card enters the viewport (becomes visible),
//    and adds a fade-in animation class to it automatically.
//    It is useful for lazy animation effects as the user scrolls.
// -------------------------------------------
const observer = new IntersectionObserver(function(entries) {
    entries.forEach(function(entry) {
        if (entry.isIntersecting) {
            // Card is now visible — add the fade-in class
            entry.target.classList.add("visible");
            // Stop observing this card once it's visible
            observer.unobserve(entry.target);
        }
    });
}, {
    threshold: 0.2  // trigger when 20% of the card is visible
});

// Attach the observer to every animal card
allCards.forEach(function(card) {
    observer.observe(card);
});

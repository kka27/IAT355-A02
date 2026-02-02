// Home page image hop animation
document.addEventListener("DOMContentLoaded", () => {
  const img = document.querySelector(".profile-img");
  let hasJumped = false;

  img.addEventListener("mouseenter", () => {
    if (!hasJumped) {
      img.classList.add("jump-once");
      hasJumped = true;

      // Remove the class after animation ends so it can be re-triggered later
      img.addEventListener(
        "animationend",
        () => {
          img.classList.remove("jump-once");
        },
        { once: true },
      );
    }
  });

  img.addEventListener("mouseleave", () => {
    // Reset so the next hover triggers a new jump
    hasJumped = false;
  });
});

// Typewriter effect on tagline: https://stackoverflow.com/questions/22180457/typewriter-effect-for-html-with-javascript
document.addEventListener("DOMContentLoaded", () => {
  const tagline = document.getElementById("tagline");
  const fullText = tagline.textContent;
  tagline.textContent = ""; // remove text
  let i = 0;
  function type() {
    if (i < fullText.length) {
      tagline.textContent += fullText[i];
      i++;
      setTimeout(type, 40); // typing speed
    } else {
      // After typing finishes, trigger the grow + color change
      tagline.classList.add("animated");
    }
  } // Delay effect on page load
  setTimeout(type, 600);
});

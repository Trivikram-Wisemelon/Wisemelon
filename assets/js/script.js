document.addEventListener("DOMContentLoaded", () => {
  let activeSection = "section1";

  // ---------------------------
  // SECTION 1: Card Rotation
  // ---------------------------
  const phoneContainer = document.getElementById("cardContainer");
  const phoneCards = Array.from(phoneContainer.querySelectorAll(".card"));

  let order = [0, 1, 2, 3, 4];
  let forwardRotationCount = 0;
  const maxForwardRotations = 15; // 3 full loops
  let localScrollLocked = true;
  let isRotating = false;

  const positions = [
    { x: -220, y: 40, rotate: -60, z: 1, scale: 0.8 },
    { x: -170, y: 20, rotate: -15, z: 2, scale: 0.85 },
    { x: 0, y: 0, rotate: 0, z: 3, scale: 1 },
    { x: 170, y: 20, rotate: 15, z: 2, scale: 0.85 },
    { x: 220, y: 40, rotate: 60, z: 1, scale: 0.8 },
  ];

  function applyTransforms() {
    order.forEach((cardIdx, posIdx) => {
      const card = phoneCards[cardIdx];
      const pos = positions[posIdx];
      card.style.transform = `translate(${pos.x}px, ${pos.y}px) rotate(${pos.rotate}deg) scale(${pos.scale})`;
      card.style.zIndex = pos.z;
    });
  }

 function rotateForward() {
  if (forwardRotationCount >= maxForwardRotations || isRotating) return;

  isRotating = true;
  order.unshift(order.pop());
  applyTransforms();
  forwardRotationCount++;

  if (forwardRotationCount >= maxForwardRotations) {
    localScrollLocked = false;
    activeSection = null; // allow scrolling to section 2
  }

  setTimeout(() => {
    isRotating = false;
  }, 200); // Match your animation duration
}


 function rotateBackward() {
  if (isRotating) return;

  isRotating = true;
  order.push(order.shift());
  applyTransforms();

  setTimeout(() => {
    isRotating = false;
  }, 200);
}

  applyTransforms();

  // ---------------------------
  // SECTION 2: Stack Cards + Headings
  // ---------------------------
  const container = document.querySelector(".section2-cards-container");
  const headingEl = document.getElementById("dynamicHeading");
  let animating = false;
  let currentIndex = 0;
  let animationSequenceDone = false;

  const headings = [
    { title: "Leading Qualification", subtitle: "Are you facing challenges to timely qualify your leads?" },
    { title: "Instant Matching", subtitle: "Match your leads with top criteria instantly" },
    { title: "Score Like a Pro", subtitle: "Give leads scores based on smart rules" },
    { title: "Boost Conversion", subtitle: "Focus on leads that actually convert" },
  ];

  function updateHeading(cardIndex) {
    const { title, subtitle } = headings[cardIndex];
    headingEl.style.opacity = 0;
    setTimeout(() => {
      headingEl.querySelector("h1").textContent = title;
      headingEl.querySelector("h2").textContent = subtitle;
      headingEl.style.opacity = 1;
    }, 250);
  }

  function updateClasses(cards) {
    cards.forEach((card, i) => {
      card.classList.remove("z1", "z2", "z3", "z4");
      card.classList.add(`z${4 - i}`);
      card.style.top = `${(4 - i - 1) * 20}px`;
    });
    updateHeading(parseInt(cards[0].dataset.index, 10));
  }

  function animateTopCard() {
    if (animating || animationSequenceDone) return;
    animating = true;
    const cards = Array.from(container.querySelectorAll(".section2-card"));
    const topCard = cards[0];
    topCard.style.transition = "top 0.6s ease";
    topCard.style.top = "-20rem";
    setTimeout(() => {
      container.appendChild(topCard);
      const newCards = Array.from(container.querySelectorAll(".section2-card"));
      updateClasses(newCards);
      topCard.style.transition = "none";
      topCard.style.top = "-20rem";
      requestAnimationFrame(() => {
        requestAnimationFrame(() => {
          topCard.style.transition = "top 0.6s ease";
          topCard.style.top = `${(newCards.length - 1) * 20}px`;
        });
      });
      currentIndex++;
      if (currentIndex >= 4) {
        animationSequenceDone = true;
        activeSection = null;
      }
      setTimeout(() => {
        animating = false;
      }, 600);
    }, 600);
  }

 function checkCenterAndLock() {
  if (animationSequenceDone) return;
  const rect = container.getBoundingClientRect();
  if (rect.top < 500 && rect.bottom > 0) {
    activeSection = "section2";
  }
}


  // ---------------------------
  // Scroll, Wheel, Keyboard
  // ---------------------------
  window.addEventListener("scroll", () => {
    checkCenterAndLock();

    if (window.scrollY < 50) {
      order = [0, 1, 2, 3, 4];
      forwardRotationCount = 0;
      localScrollLocked = true;
      activeSection = "section1";
      applyTransforms();
    }
  });

  window.addEventListener(
    "wheel",
    (e) => {
      if (activeSection === "section1" && window.scrollY === 0 && localScrollLocked) {
        e.preventDefault();
        if (e.deltaY > 0) rotateForward();
        else if (e.deltaY < 0) rotateBackward();
      } else if (activeSection === "section2") {
        e.preventDefault();
        if (e.deltaY > 0) animateTopCard();
      }
    },
    { passive: false }
  );

  window.addEventListener("keydown", (e) => {
    if (activeSection === "section1" && window.scrollY === 0 && localScrollLocked) {
      e.preventDefault();
      if (e.key === "ArrowDown") rotateForward();
      else if (e.key === "ArrowUp") rotateBackward();
    } else if (activeSection === "section2") {
      if (e.key === "ArrowDown") {
        e.preventDefault();
        animateTopCard();
      }
    }
  });

  // Initialize Section 2 cards on load
  updateClasses(Array.from(container.querySelectorAll(".section2-card")));
});

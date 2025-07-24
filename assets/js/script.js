document.addEventListener("DOMContentLoaded", () => {
  const isTouchDevice = window.matchMedia("(pointer: coarse)").matches;

  // ---------------------------
  // SECTION 1: Iphone Rotation
  // ---------------------------
  const phoneContainer = document.getElementById("cardContainer");
  const phoneCards = Array.from(phoneContainer.querySelectorAll(".card"));

  let order = [0, 1, 2, 3, 4];
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
    if (isRotating) return;
    isRotating = true;
    order.unshift(order.pop());
    applyTransforms();
    setTimeout(() => (isRotating = false), 200);
  }

  function rotateBackward() {
    if (isRotating) return;
    isRotating = true;
    order.push(order.shift());
    applyTransforms();
    setTimeout(() => (isRotating = false), 200);
  }

  applyTransforms();

  if (!isTouchDevice) {
    let isHovered1 = false;

    phoneContainer.addEventListener("mouseenter", () => (isHovered1 = true));
    phoneContainer.addEventListener("mouseleave", () => (isHovered1 = false));
    phoneContainer.addEventListener("click", () => rotateForward());

    window.addEventListener(
      "wheel",
      (e) => {
        if (isHovered1) {
          e.preventDefault();
          if (e.deltaY > 0) rotateForward();
          else rotateBackward();
        }
      },
      { passive: false }
    );

    window.addEventListener("keydown", (e) => {
      if (isHovered1) {
        if (e.key === "ArrowDown") {
          e.preventDefault();
          rotateForward();
        } else if (e.key === "ArrowUp") {
          e.preventDefault();
          rotateBackward();
        }
      }
    });
  }

  if (isTouchDevice) {
    let touchStartX = 0;
    let touchStartY = 0;

    document.addEventListener("touchstart", (e) => {
      touchStartX = e.touches[0].clientX;
      touchStartY = e.touches[0].clientY;
    });

    document.addEventListener("touchend", (e) => {
      const dx = e.changedTouches[0].clientX - touchStartX;
      const dy = e.changedTouches[0].clientY - touchStartY;
      const absDx = Math.abs(dx);
      const absDy = Math.abs(dy);

      if (absDx > absDy) {
        if (dx < -30) rotateBackward();
        else if (dx > 30) rotateForward();
      }
    });

    phoneContainer.addEventListener("click", () => rotateForward());
  }

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
  topCard.style.top = "-50%";
  setTimeout(() => {
    container.appendChild(topCard);
    const newCards = Array.from(container.querySelectorAll(".section2-card"));
    updateClasses(newCards);
    topCard.style.transition = "none";
    topCard.style.top = "-50%";
    requestAnimationFrame(() => {
      requestAnimationFrame(() => {
        topCard.style.transition = "top 0.6s ease";
        const lastIndex = newCards.length - 1;
const finalTop = (4 - lastIndex - 1) * 20;  // Same formula as updateClasses
topCard.style.top = `${finalTop}px`;
      });
    });
    currentIndex++;
    if (currentIndex >= 4) animationSequenceDone = true;
    setTimeout(() => (animating = false), 600);
  }, 600);
}





  updateClasses(Array.from(container.querySelectorAll(".section2-card")));

  function getTopCard() {
    return container.querySelector(".section2-card");
  }

  if (!isTouchDevice) {
    let isHovered2 = false;

    const observeTopCard = () => {
      const topCard = getTopCard();
      if (!topCard) return;
      topCard.addEventListener("mouseenter", () => (isHovered2 = true));
      topCard.addEventListener("mouseleave", () => (isHovered2 = false));
      topCard.addEventListener("click", () => animateTopCard());
    };

    observeTopCard();
    const observer = new MutationObserver(observeTopCard);
    observer.observe(container, { childList: true });

    window.addEventListener(
      "wheel",
      (e) => {
        if (isHovered2 && e.deltaY > 0) {
          e.preventDefault();
          animateTopCard();
        }
      },
      { passive: false }
    );
  }

  if (isTouchDevice) {
    let touchStartX = 0;
    let touchStartY = 0;

    document.addEventListener("touchstart", (e) => {
      touchStartX = e.touches[0].clientX;
      touchStartY = e.touches[0].clientY;
    });

    document.addEventListener("touchend", (e) => {
      const dx = e.changedTouches[0].clientX - touchStartX;
      const dy = e.changedTouches[0].clientY - touchStartY;
      const absDx = Math.abs(dx);
      const absDy = Math.abs(dy);

      const topCard = getTopCard();
      const cardRect = topCard.getBoundingClientRect();
      const touchX = e.changedTouches[0].clientX;
      const touchY = e.changedTouches[0].clientY;

      const insideCard =
        touchX >= cardRect.left &&
        touchX <= cardRect.right &&
        touchY >= cardRect.top &&
        touchY <= cardRect.bottom;

      if (!insideCard) return;

      if (absDy > absDx && dy < -30) {
        animateTopCard(); // swipe up
      } else if (absDx < 10 && absDy < 10) {
        animateTopCard(); // tap
      }
    });
  }
});

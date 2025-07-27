function updateTime() {
  const now = new Date();
  const hours = now.getHours().toString().padStart(2, "0");
  const minutes = now.getMinutes().toString().padStart(2, "0");
  const timeElements = document.getElementsByClassName("live-time");

  for (let i = 0; i < timeElements.length; i++) {
    timeElements[i].textContent = `${hours}:${minutes}`;
  }
}

updateTime();
setInterval(updateTime, 60000);



  function changeVideo(videoId) {
    const iframe = document.getElementById('videoPlayer');
    // Construct the embed URL properly
    iframe.src = `https://www.youtube.com/embed/${videoId}?&mute=1&controls=0&loop=1&playlist=${videoId}`;
  }


  (() => {
    const carousel = document.getElementById('carousel');
    const prevBtn = document.getElementById('prevBtn');
    const nextBtn = document.getElementById('nextBtn');

    // Calculate card width dynamically (including margin)
    const getCardWidth = () => {
      const card = carousel.querySelector('.snap-start');
      const style = window.getComputedStyle(card);
      return card.offsetWidth + parseInt(style.marginLeft) + parseInt(style.marginRight);
    };

    // Scroll to the next card
    function scrollNext() {
      const cardWidth = getCardWidth();
      carousel.scrollBy({ left: cardWidth, behavior: 'smooth' });
    }

    // Scroll to the previous card
    function scrollPrev() {
      const cardWidth = getCardWidth();
      carousel.scrollBy({ left: -cardWidth, behavior: 'smooth' });
    }

    // Disable arrows if scroll is at start or end
    function updateButtons() {
      const scrollLeft = carousel.scrollLeft;
      const maxScrollLeft = carousel.scrollWidth - carousel.clientWidth;

      prevBtn.disabled = scrollLeft <= 0;
      nextBtn.disabled = scrollLeft >= maxScrollLeft - 1; // -1 to handle rounding errors
    }

    prevBtn.addEventListener('click', () => {
      scrollPrev();
    });
    nextBtn.addEventListener('click', () => {
      scrollNext();
    });

    // Update buttons on scroll
    carousel.addEventListener('scroll', () => {
      updateButtons();
    });

    // Initial button state
    window.addEventListener('load', updateButtons);
    window.addEventListener('resize', updateButtons);

    // Optional: drag support (native scroll already works with mouse/touch)
  })();
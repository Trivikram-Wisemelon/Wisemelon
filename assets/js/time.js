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

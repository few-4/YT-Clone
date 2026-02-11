import { videoData } from "./videosData.js";

// parent container
const heroContainer = document.querySelector(".hero-container");

// select the existing video card (template)
const videoTemplate = document.querySelector(".video-container");
const searchInput = document.querySelector(".search-bar");
const micBtn = document.querySelector(".mic-icon");

const search = document.querySelector(".search-icon-container")


function renderVideos(videos) {
  heroContainer.innerHTML = ""; // clear previous videos

  videos.forEach((video) => {
    const videoClone = videoTemplate.cloneNode(true);

    videoClone.querySelector(".video-img").src = video.thumbnail;
    videoClone.querySelector(".video-description h3").textContent =
      video.title;
    videoClone.querySelector(".video-description h4").textContent =
      video.channel;

    const timeInfo = videoClone.querySelectorAll(".time-info h4");
    timeInfo[0].textContent = video.views;
    timeInfo[1].textContent = video.time;

    videoClone.querySelector(".creator-logo img").src =
      `https://i.pravatar.cc/150?u=${video.channel}`;

    heroContainer.appendChild(videoClone);
  });
}

renderVideos(videoData);

searchInput.addEventListener("input", (e) => {
  const searchText = e.target.value.toLowerCase();

  const filteredVideos = videoData.filter((video) => {
    return (
      video.title.toLowerCase().includes(searchText) ||
      video.channel.toLowerCase().includes(searchText)
    );
  });

  renderVideos(filteredVideos);
});

search.addEventListener("click", ()=>{
  searchInput.focus();
})

//Mic Speech Recognisition
const SpeechRecognition =
  window.SpeechRecognition || window.webkitSpeechRecognition;

const recognition = new SpeechRecognition();

recognition.lang = "en-IN";   // Indian English
recognition.continuous = false;
recognition.interimResults = false;

//Event Listener
micBtn.addEventListener("click", () => {
  recognition.start();
});

// Speech to text

recognition.addEventListener("result", (event) => {
  const transcript = event.results[0][0].transcript;

  searchInput.value = transcript;

  // trigger filtering
  filterVideos(transcript);
});


//Reuse filter

function filterVideos(searchText) {
  searchText = searchText.toLowerCase();

  const filteredVideos = videoData.filter((video) => {
    return (
      video.title.toLowerCase().includes(searchText) ||
      video.channel.toLowerCase().includes(searchText)
    );
  });

  renderVideos(filteredVideos);
}

searchInput.addEventListener("input", (e) => {
  filterVideos(e.target.value);
});

recognition.addEventListener("start", () => {
  micBtn.classList.add("listening");
});

recognition.addEventListener("end", () => {
  micBtn.classList.remove("listening");
});

recognition.addEventListener("error", (e) => {
  alert("Mic error: " + e.error);
});

recognition.addEventListener("result", (event) => {
  let transcript = event.results[0][0].transcript;

  transcript = transcript.replace(/[.?!]+$/, "").trim();

  searchInput.value = transcript;
  filterVideos(transcript);
});

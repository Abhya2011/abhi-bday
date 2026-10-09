const TEST_PASSWORD = "abubulovesabibi";

const passwordScreen = document.getElementById("password-screen");
const passwordInput = document.getElementById("password-input");
const unlockButton = document.getElementById("unlock-button");
const passwordError = document.getElementById("password-error");
const desktop = document.getElementById("desktop");
const notification = document.getElementById("notification");
const hintButton = document.getElementById("hint-button");
const hintPopup = document.getElementById("hint-popup");
const hintClose = document.getElementById("hint-close");
const hintOk = document.getElementById("hint-ok");

/* Small click sound using the browser's built-in Web Audio API.
   No sound file is needed yet. */
let audioContext;

function clickSound() {
  try {
    audioContext ||= new (window.AudioContext || window.webkitAudioContext)();

    const oscillator = audioContext.createOscillator();
    const gain = audioContext.createGain();

    oscillator.type = "sine";
    oscillator.frequency.value = 420;

    gain.gain.setValueAtTime(0.045, audioContext.currentTime);
    gain.gain.exponentialRampToValueAtTime(
      0.001,
      audioContext.currentTime + 0.055
    );

    oscillator.connect(gain);
    gain.connect(audioContext.destination);

    oscillator.start();
    oscillator.stop(audioContext.currentTime + 0.055);
  } catch (error) {
    // Sound is optional. The website still works if audio is unavailable.
  }
}


/* Password hint */
function openHint() {
  clickSound();
  hintPopup.classList.add("open");
  hintPopup.setAttribute("aria-hidden", "false");
}

function closeHint() {
  clickSound();
  hintPopup.classList.remove("open");
  hintPopup.setAttribute("aria-hidden", "true");
}

hintButton.addEventListener("click", openHint);
hintClose.addEventListener("click", closeHint);
hintOk.addEventListener("click", closeHint);

function unlock() {
  const entered = passwordInput.value.trim();

  if (entered === TEST_PASSWORD) {
    clickSound();
    passwordError.textContent = "";

    passwordScreen.classList.remove("active");

    setTimeout(() => {
      desktop.classList.add("unlocked");
    }, 220);

  } else {
    clickSound();
    passwordError.textContent = "That isn't the password. Try again.";
    passwordInput.value = "";
    passwordInput.focus();
  }
}

unlockButton.addEventListener("click", unlock);

passwordInput.addEventListener("keydown", (event) => {
  if (event.key === "Enter") {
    unlock();
  }
});

/* Open folder windows */
document.querySelectorAll(".desktop-icon").forEach((icon) => {
  icon.addEventListener("click", () => {
    clickSound();

    const windowId = icon.dataset.window;
    const targetWindow = document.getElementById(windowId);

    document.querySelectorAll(".window").forEach((win) => {
      win.style.zIndex = 10;
    });

    targetWindow.classList.remove("minimized");
    targetWindow.classList.add("open");
    targetWindow.style.zIndex = 20;

    if (windowId === "window-6") {
      startHoroscope();
    }

    if (windowId === "window-7") {
      startBirthdayMoment();
    }

    if (windowId === "window-2") {
      const newspaper = document.getElementById("newspaper-sheet");
      newspaper.classList.remove("unfolded");
      window.requestAnimationFrame(() => {
        window.requestAnimationFrame(() => newspaper.classList.add("unfolded"));
      });
    }
  });
});

/* Close/minimize buttons */
document.querySelectorAll(".window").forEach((windowElement) => {

  windowElement.querySelector(".close").addEventListener("click", (event) => {
    event.stopPropagation();
    clickSound();
    windowElement.classList.remove("open");
    if (windowElement.id === "window-2") {
      document.getElementById("newspaper-sheet").classList.remove("unfolded");
    }
  });

  windowElement.querySelector(".minimize").addEventListener("click", (event) => {
    event.stopPropagation();
    clickSound();
    windowElement.classList.add("minimized");
  });

  windowElement.addEventListener("mousedown", () => {
    document.querySelectorAll(".window").forEach((win) => {
      win.style.zIndex = 10;
    });
    windowElement.style.zIndex = 20;
  });
});

/* Notification */
notification.querySelector(".notification-close").addEventListener("click", () => {
  clickSound();
  notification.style.display = "none";
});

/* Every button gets a tiny click */
document.querySelectorAll("button").forEach((button) => {
  button.addEventListener("click", () => {
    // Individual controls already call clickSound(), so this is intentionally empty.
  });
});


/* ============================================================
   ABHI'S MUSEUM — EXHIBITS
   ============================================================ */

const museumExhibits = {
  1: {
    title: "Exhibit 1 — Childhood",
    image: "museum/exhibit-1.jpeg",
    caption: "The early chapters — before the world got to know him."
  },
  2: {
    title: "Exhibit 2 — School + Early College",
    image: "museum/exhibit-2.jpeg",
    caption: "School days, first chapters of college, and the person taking shape."
  },
  3: {
    title: "Exhibit 3 — Present Day",
    image: "museum/exhibit-3.jpeg",
    caption: "Abhi, as he is now — college, GDG, projects, people, and everything in between."
  },
  4: {
    title: "Exhibit 4 — The People + Moments",
    image: "museum/exhibit-4.jpeg",
    caption: "A little collection of the people and moments that became part of his story."
  }
};

const exhibitViewer = document.getElementById("exhibit-viewer");
const exhibitTitle = document.getElementById("exhibit-title");
const exhibitImage = document.getElementById("exhibit-image");
const exhibitCaption = document.getElementById("exhibit-caption");
const placeholder = document.getElementById("photo-placeholder");
const placeholderPath = document.getElementById("placeholder-path");
const exhibitClose = document.getElementById("exhibit-close");
const fullscreenPhoto = document.getElementById("fullscreen-photo");
const zoomIn = document.getElementById("zoom-in");
const zoomOut = document.getElementById("zoom-out");
const zoomReset = document.getElementById("zoom-reset");
const lightbox = document.getElementById("photo-lightbox");
const lightboxImage = document.getElementById("lightbox-image");
const lightboxClose = document.getElementById("lightbox-close");
let currentZoom = 1;
let currentExhibit = null;

function resetZoom() {
  currentZoom = 1;
  exhibitImage.style.transform = "scale(1)";
}

function openExhibit(number) {
  clickSound();
  const exhibit = museumExhibits[number];
  currentExhibit = number;
  currentZoom = 1;

  exhibitTitle.textContent = exhibit.title;
  exhibitCaption.textContent = exhibit.caption;
  exhibitImage.alt = exhibit.title + " collage";
  exhibitImage.style.transform = "scale(1)";
  exhibitImage.classList.remove("loaded");
  placeholder.classList.remove("hidden");
  placeholderPath.textContent = "Looking for " + exhibit.image + " ...";

  exhibitImage.onload = () => {
    exhibitImage.classList.add("loaded");
    placeholder.classList.add("hidden");
  };

  exhibitImage.onerror = () => {
    exhibitImage.classList.remove("loaded");
    placeholder.classList.remove("hidden");
    placeholderPath.textContent =
      "Could not find " + exhibit.image +
      " — check the museum folder sits next to index.html and the file name is exactly " +
      exhibit.image.replace("museum/", "") + " (no extra .jpg or .jpeg at the end).";
  };

  // Set src AFTER the handlers above so a fast load is never missed.
  exhibitImage.src = exhibit.image;

  exhibitViewer.classList.add("open");
  exhibitViewer.setAttribute("aria-hidden", "false");
}

document.querySelectorAll(".exhibit-folder").forEach((folder) => {
  folder.addEventListener("click", () => openExhibit(folder.dataset.exhibit));
});

function closeExhibit() {
  clickSound();
  exhibitViewer.classList.remove("open");
  exhibitViewer.setAttribute("aria-hidden", "true");
}

exhibitClose.addEventListener("click", closeExhibit);

exhibitViewer.addEventListener("click", (event) => {
  if (event.target === exhibitViewer) closeExhibit();
});

zoomIn.addEventListener("click", () => {
  clickSound();
  if (!exhibitImage.classList.contains("loaded")) return;
  currentZoom = Math.min(3, currentZoom + 0.25);
  exhibitImage.style.transform = `scale(${currentZoom})`;
});

zoomOut.addEventListener("click", () => {
  clickSound();
  if (!exhibitImage.classList.contains("loaded")) return;
  currentZoom = Math.max(0.5, currentZoom - 0.25);
  exhibitImage.style.transform = `scale(${currentZoom})`;
});

zoomReset.addEventListener("click", () => {
  clickSound();
  resetZoom();
});

exhibitImage.addEventListener("click", () => {
  if (!exhibitImage.classList.contains("loaded")) return;
  clickSound();
  lightboxImage.src = exhibitImage.src;
  lightbox.classList.add("open");
  lightbox.setAttribute("aria-hidden", "false");
});

fullscreenPhoto.addEventListener("click", () => {
  if (!exhibitImage.classList.contains("loaded")) return;
  clickSound();
  lightboxImage.src = exhibitImage.src;
  lightbox.classList.add("open");
  lightbox.setAttribute("aria-hidden", "false");
});

function closeLightbox() {
  clickSound();
  lightbox.classList.remove("open");
  lightbox.setAttribute("aria-hidden", "true");
}

lightboxClose.addEventListener("click", closeLightbox);

lightbox.addEventListener("click", (event) => {
  if (event.target === lightbox) closeLightbox();
});

document.addEventListener("keydown", (event) => {
  if (event.key === "Escape") {
    if (lightbox.classList.contains("open")) {
      closeLightbox();
    } else if (exhibitViewer.classList.contains("open")) {
      closeExhibit();
    }
  }
});


/* ============================================================
   MY SKILL TREE — THUMBPRINT SCAN + RESULTS REVEAL
   ============================================================ */
const skillEnterButton = document.getElementById("skill-enter-button");
const skillRescanButton = document.getElementById("skill-rescan-button");
const skillScanScreen = document.getElementById("skill-scan-screen");
const skillLoadingScreen = document.getElementById("skill-loading-screen");
const skillResultsScreen = document.getElementById("skill-results-screen");
const fingerprintPad = document.getElementById("fingerprint-pad");
const scanStatus = document.getElementById("scan-status");

function resetSkillTree() {
  skillResultsScreen.hidden = true;
  skillLoadingScreen.hidden = true;
  skillScanScreen.hidden = false;
  skillResultsScreen.classList.remove("show-bars");
  fingerprintPad.classList.remove("scanning");
  scanStatus.textContent = "AWAITING THUMBPRINT";
  scanStatus.classList.remove("scanned");
  skillEnterButton.disabled = false;
}

function runSkillScan() {
  if (skillEnterButton.disabled) return;
  clickSound();
  skillEnterButton.disabled = true;
  fingerprintPad.classList.add("scanning");
  scanStatus.textContent = "THUMBPRINT DETECTED · SCANNING";
  scanStatus.classList.add("scanned");
  window.setTimeout(() => {
    skillScanScreen.hidden = true;
    skillLoadingScreen.hidden = false;
    const loadingMessages = [
      "Measuring core abilities",
      "Consulting highly questionable data",
      "Accounting for birthday bias"
    ];
    let messageIndex = 0;
    const messageTimer = window.setInterval(() => {
      messageIndex = (messageIndex + 1) % loadingMessages.length;
      const message = document.getElementById("skill-loading-message");
      if (message) message.textContent = loadingMessages[messageIndex];
    }, 600);
    window.setTimeout(() => {
      window.clearInterval(messageTimer);
      fingerprintPad.classList.remove("scanning");
      skillLoadingScreen.hidden = true;
      skillResultsScreen.hidden = false;
      window.requestAnimationFrame(() => {
        window.requestAnimationFrame(() => skillResultsScreen.classList.add("show-bars"));
      });
      clickSound();
    }, 2000);
  }, 180);
}

skillEnterButton.addEventListener("click", runSkillScan);
skillRescanButton.addEventListener("click", () => {
  clickSound();
  resetSkillTree();
});


/* OPEN WHEN — personal letters in a little stationery-style popup. */
const openWhenLetters = {
  happy: {
    title: "Open when you're happy",
    heading: "Keep that smile, love",
    message: `If you're smiling right now, I hope you know that your smile lights up your whole face. Like genuinely, you have the sort of smile that makes other people smile. And your laugh, I haven't heard nearly enough of it, but it's so goofy and it makes me so happy. I hope you hold on really tightly to whatever it is that's making you happy right now. You deserve moments like these Abhilash. So, so many of them. And there's something about seeing you genuinely happy that makes me soo happy. I hope life gives you a million more reasons to smile like that love. I wish I could see it right now.`
  },
  overthinking: {
    title: "Open when you're overthinking",
    heading: "One thought at a time",
    message: `Hi my love\n\nI know your mind can be really too much sometimes, and I know that telling you to just stop thinking about it isn't going to make all those thoughts disappear. I wish I could be there to hold you while you tell me everything that's going on in that head of yours. even if it takes hours. abhilash, you don't have to make your feelings smaller ever ever. You don't need to tell me that it's a not big deal to make me not worried about you.\n\ntake a little breath for me, yeah? you really don't have to solve every single thing right now. One thought at a time, one thing at a time. Give yourself a little time. I wish I could kiss your forehead and remind you that you're allowed to be a person who has bad days and doesn't always know what to do. I love you through all of it. giving you a hug right now, I hope you can feel it.`
  },
  sleep: {
    title: "Open when you can't sleep",
    heading: "Now close dem eyes",
    message: `love, if I were there right now, id hold you tight and snuggle with you, and you could hide your face in my embrace and just stay there for as long as you wanted to. I would caress your face and play with your hair a little, and kiss your head every now and then. I'd tell you I love you, and then I'd tell you again. and eventually, when you were finally all sleepy, I'd just keep holding you until you fell asleep.\n\ni wish i was there. but I'm not right now. still I want you to know that you're safe and warm and don't have anything you need to do for the next little while. put your phone down after this okay?, close your eyes, and lay there for a bit. Think about something really nice. a song you like, a movie you watched, a conversation that was important to you, anything that makes you feel warm. you don't need to force yourself to fall asleep, just let yourself rest. I hope you sleep really really well tonight love. I wish I could give you a kiss and say goodnight properly. I love you. Now close dem eyes, please. <3`
  },
  anytime: {
    title: "Open anytime",
    heading: "Just because I love you",
    message: `Hi, my love.\n\nI just wanted to say for the millionth time that I love you. I love you so much and I adore you in all these little ways that I don't think I could ever really explain. Sometimes I wish I could just appear wherever you are, sit next to you and tell you all of this to your face. Because a screen just doesn't do justice to how I feel about you.\n\nI want the ordinary things with you. just sitting around doing absolutely nothing, listening to you talk about whatever is on your mind, letting sum random songs play while we js lay down. I want to be there on your good days and the bad ones, on the days when you have a ton of things to tell me and the days when you don't feel like saying much. I just want to be there and hug you. And until I can, I hope you know you're loved. So much. More than this little message can say.`
  }
};

const letterPopup = document.getElementById("letter-popup");
/* The letter must be centred against the viewport, not the transformed Open When folder. */
document.body.appendChild(letterPopup);
const letterPopupTitle = document.getElementById("letter-popup-title");
const letterHeading = document.getElementById("letter-heading");
const letterMessage = document.getElementById("letter-message");
const letterClose = document.getElementById("letter-close");
const letterMinimize = document.getElementById("letter-minimize");
const restoreLetter = document.getElementById("restore-letter");
const openWhenWindow = document.getElementById("window-5");

function closeLetter() {
  clickSound();
  letterPopup.classList.remove("open", "minimized");
  letterPopup.setAttribute("aria-hidden", "true");
  restoreLetter.hidden = true;
}

function minimizeLetter() {
  clickSound();
  letterPopup.classList.remove("open");
  letterPopup.classList.add("minimized");
  letterPopup.setAttribute("aria-hidden", "true");
  restoreLetter.hidden = false;
}

function restoreLetterPopup() {
  clickSound();
  letterPopup.classList.remove("minimized");
  letterPopup.classList.add("open");
  letterPopup.setAttribute("aria-hidden", "false");
  restoreLetter.hidden = true;
}

document.querySelectorAll(".open-when-card").forEach((card) => {
  card.addEventListener("click", () => {
    const letter = openWhenLetters[card.dataset.letter];
    if (!letter) return;
    clickSound();
    letterPopupTitle.textContent = letter.title;
    letterHeading.textContent = letter.heading;
    letterMessage.textContent = letter.message;
    letterPopup.classList.remove("minimized");
    letterPopup.classList.add("open");
    letterPopup.setAttribute("aria-hidden", "false");
    restoreLetter.hidden = true;
  });
});

letterClose.addEventListener("click", closeLetter);
letterMinimize.addEventListener("click", minimizeLetter);
restoreLetter.addEventListener("click", restoreLetterPopup);

/* Keep the letter in sync with its parent folder's close/minimize controls. */
openWhenWindow.querySelector(".close").addEventListener("click", () => {
  letterPopup.classList.remove("open", "minimized");
  letterPopup.setAttribute("aria-hidden", "true");
  restoreLetter.hidden = true;
});
openWhenWindow.querySelector(".minimize").addEventListener("click", () => {
  letterPopup.classList.remove("open", "minimized");
  letterPopup.setAttribute("aria-hidden", "true");
  restoreLetter.hidden = true;
});

/* MUSIC FOR ABLAS — load matching cover artwork when available.
   Playback links remain usable even if an artwork service is unavailable. */
const musicArtwork = [
  { title: "Future Days", artist: "Pearl Jam", query: "Future Days Pearl Jam" },
  { title: "Past Won't Leave My Bed", artist: "Joji", query: "Past Won't Leave My Bed Joji" },
  { title: "Deathmetal (Live)", artist: "Panchiko", query: "Deathmetal Panchiko" },
  { title: "The Outside", artist: "Phoebe Bridgers", query: "The Outside Phoebe Bridgers" },
  { title: "Love Me Not", artist: "Olivia Dean's cover", query: "Love Me Not Olivia Dean cover" },
  { title: "Risk", artist: "Gracie Abrams", query: "Risk Gracie Abrams" },
  { title: "Honeybee", artist: "Olivia Rodrigo", query: "Honeybee Olivia Rodrigo" }
];

async function loadMusicArtwork() {
  const cards = document.querySelectorAll("#music-grid .song-card");
  cards.forEach((card, index) => {
    const track = musicArtwork[index];
    if (!track) return;
    const query = encodeURIComponent(track.query);
    fetch(`https://itunes.apple.com/search?term=${query}&entity=song&limit=8`)
      .then(response => response.ok ? response.json() : Promise.reject(new Error("Artwork unavailable")))
      .then(data => {
        const results = data.results || [];
        const artistNeedle = track.artist.toLowerCase().replace("'s cover", "");
        const titleNeedle = track.title.toLowerCase().replace(" (live)", "");
        const match = results.find(item =>
          (item.trackName || "").toLowerCase().includes(titleNeedle) &&
          (item.artistName || "").toLowerCase().includes(artistNeedle)
        );
        if (!match || !match.artworkUrl100) return;
        const art = card.querySelector(".album-art");
        const image = document.createElement("img");
        image.src = match.artworkUrl100.replace("100x100bb", "400x400bb");
        image.alt = `${track.title} cover artwork`;
        image.loading = "lazy";
        image.onerror = () => image.remove();
        art.replaceChildren(image);
        art.classList.remove("album-fallback");
      })
      .catch(() => { /* The pastel fallback cover remains visible. */ });
  });
}
loadMusicArtwork();

/* Centre all desktop windows consistently whenever they are opened. */
document.querySelectorAll('.desktop-icon').forEach((icon) => {
  icon.addEventListener('click', () => {
    const target = document.getElementById(icon.dataset.window);
    if (target) {
      target.style.left = '50%';
      target.style.top = '50%';
    }
  });
});

/* Museum exhibit viewer: minimize back to the museum, with a restore button. */
const exhibitMinimize = document.getElementById('exhibit-minimize');
const restoreExhibit = document.getElementById('restore-exhibit');
function minimizeExhibit() {
  clickSound();
  exhibitViewer.classList.remove('open');
  exhibitViewer.setAttribute('aria-hidden', 'true');
  restoreExhibit.hidden = false;
}
if (exhibitMinimize) exhibitMinimize.addEventListener('click', minimizeExhibit);
if (restoreExhibit) restoreExhibit.addEventListener('click', () => {
  if (currentExhibit !== null) openExhibit(currentExhibit);
  restoreExhibit.hidden = true;
});
const museumWindow = document.getElementById('window-1');
museumWindow.querySelector('.close').addEventListener('click', () => {
  restoreExhibit.hidden = true;
  closeExhibit();
});
museumWindow.querySelector('.minimize').addEventListener('click', () => {
  closeExhibit();
});

/* HOROSCOPE — a three-second birthday forecast reveal. */
const horoscopeLoading = document.getElementById('horoscope-loading');
const horoscopeTimeline = document.getElementById('horoscope-timeline');
let horoscopeTimer;
function startHoroscope() {
  window.clearTimeout(horoscopeTimer);
  horoscopeLoading.hidden = false;
  horoscopeTimeline.hidden = true;
  horoscopeTimer = window.setTimeout(() => {
    horoscopeLoading.hidden = true;
    horoscopeTimeline.hidden = false;
  }, 3000);
}

/* SWEET TOOTH — the candles go out after a tiny birthday pause. */
const sweetToothWindow = document.getElementById('window-7');
const cakeAction = document.getElementById('cake-action');
const cakePrompt = document.getElementById('cake-prompt');
const cakeSubprompt = document.getElementById('cake-subprompt');
const cakeCandles = document.getElementById('cake-candles');
const cakeFinale = document.getElementById('cake-finale');
const cakeConfetti = document.getElementById('cake-confetti');
let birthdaySongNodes = [];
let birthdayBlowTimer = null;
let birthdayBlown = false;

function stopBirthdaySong() {
  birthdaySongNodes.forEach((node) => { try { node.stop(); } catch (error) {} });
  birthdaySongNodes = [];
}

function playBirthdaySong() {
  stopBirthdaySong();
  try {
    audioContext ||= new (window.AudioContext || window.webkitAudioContext)();
    if (audioContext.state === 'suspended') audioContext.resume();
    const notes = [
      ['G4', .28], ['G4', .28], ['A4', .56], ['G4', .56], ['C5', .56], ['B4', .9],
      ['G4', .28], ['G4', .28], ['A4', .56], ['G4', .56], ['D5', .56], ['C5', .9],
      ['G4', .28], ['G4', .28], ['G5', .56], ['E5', .56], ['C5', .56], ['B4', .56], ['A4', .9],
      ['F5', .28], ['F5', .28], ['E5', .56], ['C5', .56], ['D5', .56], ['C5', 1.05]
    ];
    const frequencies = { C5:523.25, D5:587.33, E5:659.25, F5:698.46, G4:392, A4:440, B4:493.88, G5:783.99 };
    let startAt = audioContext.currentTime + .08;
    notes.forEach(([note, duration]) => {
      const oscillator = audioContext.createOscillator();
      const gain = audioContext.createGain();
      oscillator.type = 'triangle';
      oscillator.frequency.value = frequencies[note];
      gain.gain.setValueAtTime(.0001, startAt);
      gain.gain.exponentialRampToValueAtTime(.075, startAt + .025);
      gain.gain.setValueAtTime(.075, startAt + Math.max(.04, duration - .06));
      gain.gain.exponentialRampToValueAtTime(.0001, startAt + duration);
      oscillator.connect(gain);
      gain.connect(audioContext.destination);
      oscillator.start(startAt);
      oscillator.stop(startAt + duration + .02);
      birthdaySongNodes.push(oscillator);
      startAt += duration + .035;
    });
  } catch (error) {
    // The visual celebration still works if audio is unavailable.
  }
}

function resetBirthdayMoment() {
  if (birthdayBlowTimer) window.clearTimeout(birthdayBlowTimer);
  birthdayBlowTimer = null;
  stopBirthdaySong();
  birthdayBlown = false;
  cakeCandles.classList.remove('candles-blown');
  cakePrompt.textContent = 'Are you ready?';
  cakeSubprompt.textContent = 'Make a little birthday wish, Abhilash.';
  cakeAction.hidden = false;
  cakeAction.innerHTML = 'I\'m ready! <span>♡</span>';
  cakeFinale.hidden = true;
  cakeConfetti.replaceChildren();
}

function finishBirthdayBlow() {
  if (birthdayBlown) return;
  birthdayBlown = true;
  if (birthdayBlowTimer) window.clearTimeout(birthdayBlowTimer);
  birthdayBlowTimer = null;
  cakeCandles.classList.add('candles-blown');
  cakePrompt.textContent = 'Make a wish, Abhilash!';
  cakeSubprompt.textContent = 'May your 20s be full of good things, good people, and really good cake.';
  cakeAction.hidden = true;
  cakeFinale.hidden = false;
  cakeConfetti.replaceChildren();
  const bits = ['✦', '♡', '✧', '✿', '⋆', '♥', '✦', '♡', '✧', '✿', '⋆', '♥'];
  bits.forEach((symbol, index) => {
    const piece = document.createElement('span');
    piece.textContent = symbol;
    piece.style.setProperty('--piece', index);
    cakeConfetti.appendChild(piece);
  });
  clickSound();
}

function startBirthdayMoment() {
  resetBirthdayMoment();
  playBirthdaySong();
}

cakeAction.addEventListener('click', () => {
  clickSound();
  cakePrompt.textContent = 'Blow the candles!';
  cakeSubprompt.textContent = 'Make a wish… here they go!';
  cakeAction.hidden = true;
  birthdayBlowTimer = window.setTimeout(finishBirthdayBlow, 2600);
});
sweetToothWindow.querySelector('.close').addEventListener('click', () => {
  if (birthdayBlowTimer) window.clearTimeout(birthdayBlowTimer);
  birthdayBlowTimer = null;
  stopBirthdaySong();
});
sweetToothWindow.querySelector('.minimize').addEventListener('click', () => {
  if (birthdayBlowTimer) window.clearTimeout(birthdayBlowTimer);
  birthdayBlowTimer = null;
  stopBirthdaySong();
});

/* EMAIL — one unread birthday message in a Gmail-inspired inbox. */
const emailOverlay = document.getElementById('email-overlay');
const emailTaskbar = document.getElementById('email-taskbar');
const emailClose = document.getElementById('email-close');
const emailMinimize = document.getElementById('email-minimize');
const birthdayEmailRow = document.getElementById('birthday-email-row');
const gmailInboxView = document.getElementById('gmail-inbox-view');
const gmailMessageView = document.getElementById('gmail-message-view');
const gmailMessageBody = document.getElementById('gmail-message-body');
const emailBack = document.getElementById('email-back');
const gmailCount = document.getElementById('gmail-count');
const gmailCompose = document.querySelector('.gmail-compose');

const birthdayEmailParagraphs = [
  'Dear Abhilash,',
  'Happy birthday to you. Happy happy 20th to you.',
  'Oh i have soo much to say, i am really not sure about where to begin.',
  'I am so grateful to have met you abhilash. You have been everything for me this past year.',
  'I can\'t not mention the \'I\'m 6\'2, feminist and i dont take dowry\', you do realize how hilarious that is right, it was lwk meant to be from the very first sentence. You are everything i have ever prayed for and you don\'t realize just how big of a blessing you are in the lives of people who know you.',
  'You\'re something abhilash. at this moment, i am typing this completely from the perspective of a person who knows you and as your good friend. You\'ve surprised me everytime i thought you couldnt possibly do that anymore. You\'re the most stable and consistent form of love that one can ever receive. You\'ve been a truly good friend day the beginning of our friendship. For people to go out of their way to keep in touch with a random stranger 2500 kms apart is so unusual, but you kept up for so long. You never let go, and for that im so grateful.',
  'Meeting you in delhi was nothing short of a movie that id pay for imax seats for, every single day. I would do anything to hold your hand and also lol, to see if your hands still shake from just how nervous you get. I wanna feed you cinnabons, go to restaurants with you, sing with you, dance with you, get tipsy with you and do everything with you.',
  'The day you asked me to be your girlfriend was the sweetest gesture. You stuck around even if i had my worst doubts clouding my thoughts. You\'ve just always been there. always.',
  'I wish you could see yourself from my perspective love.',
  'You can hold everything inside of you, all those emotions and thoughts and love and care and questions. You\'re a painting id pay to look at, in a museum for long. You\'d be one of those simple, really beautiful paintings that speak to you, but if you look closer, there\'s always a deeper meaning.',
  'I wish nothing but the best for you always. I hope you truly truly stay happy forever. Now that you\'re entering your 20\'s and youre no longer a teen, i want you to know im so proud of you for everything you are. I hope in your 20s you can find time to fulfill all the little dreams you have always told me about. I hope you choose to live in every moment. I hope youre so full of life love.',
  'always.',
  'I love you',
  'Regards,\nAbhya'
];

gmailMessageBody.replaceChildren();
birthdayEmailParagraphs.forEach((paragraph) => {
  const p = document.createElement('p');
  p.textContent = paragraph;
  gmailMessageBody.appendChild(p);
});
function openEmail() {
  clickSound();
  emailOverlay.classList.add('open');
  emailOverlay.setAttribute('aria-hidden', 'false');
}
function closeEmail() {
  clickSound();
  emailOverlay.classList.remove('open');
  emailOverlay.setAttribute('aria-hidden', 'true');
}
function showBirthdayEmail() {
  clickSound();
  gmailInboxView.hidden = true;
  gmailMessageView.hidden = false;
  emailBack.hidden = false;
  gmailCount.textContent = '1 of 1';
  birthdayEmailRow.classList.remove('unread');
  birthdayEmailRow.querySelector('.gmail-sender').style.fontWeight = 'normal';
  birthdayEmailRow.querySelector('.gmail-row-copy strong').style.fontWeight = 'normal';
  birthdayEmailRow.querySelector('.gmail-row-copy small').style.fontWeight = 'normal';
}
function backToInbox() {
  clickSound();
  gmailMessageView.hidden = true;
  gmailInboxView.hidden = false;
  emailBack.hidden = true;
  gmailCount.textContent = '1–1 of 1';
}
emailTaskbar.addEventListener('click', openEmail);
emailClose.addEventListener('click', closeEmail);
emailMinimize.addEventListener('click', closeEmail);
emailOverlay.addEventListener('click', (event) => { if (event.target === emailOverlay) closeEmail(); });
birthdayEmailRow.addEventListener('click', showBirthdayEmail);
emailBack.addEventListener('click', backToInbox);
gmailCompose.addEventListener('click', () => {
  const existing = document.getElementById('gmail-compose-note');
  if (existing) existing.remove();
  const note = document.createElement('div');
  note.id = 'gmail-compose-note';
  note.className = 'gmail-compose-note';
  note.textContent = 'This inbox has one very important email. No need to compose another. ♡';
  document.querySelector('.gmail-main').appendChild(note);
  window.setTimeout(() => note.remove(), 2600);
});

/* ABHIGPT — preset questions with lovingly prewritten answers. */
const abhigptQuestions = [
  {
    question: 'AbhiGPT, what is something I am really good at?',
    answer: `Hello Abhilash, firstly, happy 20th! Now, you're really good at staying up all night and eating junk. Haha, sorry, got you. Honestly though, you're really good at being human. At being an actually, genuinely good person. According to my calculations, it's really, really rare to find a good-human-type Pokémon, and you are one of them. And I'm not saying this without evidence. Your girlfriend and your ex-really-good-friend have said this themselves. So, happy birthday to one of the rarest Pokémon out there. Please use your powers wisely.`
  },
  {
    question: 'AbhiGPT, what is a quality of mine that I underestimate?',
    answer: `How well you know yourself. People spend years trying to understand themselves, be truthful with themselves, and see right through themselves, but you know yourself really well. Remember, you're far ahead of people who cannot even dare to look in the mirror. And the fact that you can look at yourself honestly, even when it's uncomfortable, is a pretty big deal. Give yourself some credit for that, okay?`
  },
  {
    question: "What's the most beautiful thing on this planet?",
    answer: `Abhi, it's your girlfriend. (Haha, actually just kidding. Your girlfriend asked me to put this in because she thought it'd be hilarious.)

I don't know the answer, honestly. Beauty is subjective. To some it could be mountains, to some it could be glitter, and to some it could be kindness. Beauty comes in all forms. There's beauty in the way people care for each other, in little things people do without expecting anything back, and also, yes, in your cute face. I am an AI, but I have eyes. Allegedly.`
  },
  {
    question: 'How much should I exercise in a day?',
    answer: `According to the extremely questionable scientific department at AbhiGPT, to burn an average daily total of 2,000 calories entirely, you would need to kiss your girlfriend for approximately 12.8 hours in a single day.

If you break this down into individual kisses, it would require 9,231 kisses a day.

Please note: these calculations are not medically reviewed, scientifically sound, or approved by any fitness professional. They are, however, a strong argument for spending more time with your girlfriend. Happy exercising, sir.`
  }
];

const abhigptOverlay = document.getElementById('abhigpt-overlay');
const abhigptTaskbar = document.getElementById('abhigpt-taskbar');
const abhigptClose = document.getElementById('abhigpt-close');
const abhigptMinimize = document.getElementById('abhigpt-minimize');
const abhigptAskNow = document.getElementById('abhigpt-ask-now');
const abhigptLanding = document.getElementById('abhigpt-landing');
const abhigptChat = document.getElementById('abhigpt-chat');
const abhigptInput = document.getElementById('abhigpt-input');
const abhigptSuggestions = document.getElementById('abhigpt-suggestions');
const abhigptForm = document.getElementById('abhigpt-form');
const abhigptMessages = document.getElementById('abhigpt-messages');

function openAbhiGPT() {
  clickSound();
  abhigptOverlay.classList.add('open');
  abhigptOverlay.setAttribute('aria-hidden', 'false');
}
function closeAbhiGPT() {
  clickSound();
  abhigptOverlay.classList.remove('open');
  abhigptOverlay.setAttribute('aria-hidden', 'true');
}
abhigptTaskbar.addEventListener('click', openAbhiGPT);
abhigptClose.addEventListener('click', closeAbhiGPT);
abhigptMinimize.addEventListener('click', closeAbhiGPT);
abhigptOverlay.addEventListener('click', (event) => {
  if (event.target === abhigptOverlay) closeAbhiGPT();
});
abhigptAskNow.addEventListener('click', () => {
  clickSound();
  abhigptLanding.hidden = true;
  abhigptChat.hidden = false;
  abhigptInput.focus();
});

function renderAbhiGPTSuggestions() {
  const needle = abhigptInput.value.trim().toLowerCase();
  const matches = abhigptQuestions.filter(item => !needle || item.question.toLowerCase().includes(needle));
  abhigptSuggestions.replaceChildren();
  matches.forEach((item) => {
    const suggestion = document.createElement('button');
    suggestion.type = 'button';
    suggestion.className = 'abhigpt-suggestion';
    suggestion.textContent = item.question;
    suggestion.addEventListener('click', () => {
      abhigptInput.value = item.question;
      abhigptSuggestions.hidden = true;
      abhigptInput.focus();
    });
    abhigptSuggestions.appendChild(suggestion);
  });
  abhigptSuggestions.hidden = matches.length === 0;
}
abhigptInput.addEventListener('focus', renderAbhiGPTSuggestions);
abhigptInput.addEventListener('input', renderAbhiGPTSuggestions);
document.addEventListener('click', (event) => {
  if (!event.target.closest('.abhigpt-input-wrap')) abhigptSuggestions.hidden = true;
});

function addAbhiGPTMessage(text, className) {
  const message = document.createElement('div');
  message.className = className;
  message.textContent = text;
  abhigptMessages.appendChild(message);
  abhigptMessages.scrollTop = abhigptMessages.scrollHeight;
}
abhigptForm.addEventListener('submit', (event) => {
  event.preventDefault();
  const typed = abhigptInput.value.trim();
  if (!typed) {
    renderAbhiGPTSuggestions();
    return;
  }
  const match = abhigptQuestions.find(item => item.question.toLowerCase() === typed.toLowerCase());
  if (!match) {
    abhigptSuggestions.hidden = false;
    addAbhiGPTMessage('This birthday edition has a very specific knowledge base. Choose one of the questions that appears as you type, and I shall do my best.', 'abhigpt-assistant-message');
    return;
  }
  clickSound();
  abhigptSuggestions.hidden = true;
  addAbhiGPTMessage(match.question, 'abhigpt-user-message');
  abhigptInput.value = '';
  window.setTimeout(() => addAbhiGPTMessage(match.answer, 'abhigpt-assistant-message'), 280);
});

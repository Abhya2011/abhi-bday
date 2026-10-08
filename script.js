const TEST_PASSWORD = "ABHI2026";

const passwordScreen = document.getElementById("password-screen");
const passwordInput = document.getElementById("password-input");
const unlockButton = document.getElementById("unlock-button");
const passwordError = document.getElementById("password-error");
const desktop = document.getElementById("desktop");
const notification = document.getElementById("notification");

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
  });
});

/* Close/minimize buttons */
document.querySelectorAll(".window").forEach((windowElement) => {

  windowElement.querySelector(".close").addEventListener("click", (event) => {
    event.stopPropagation();
    clickSound();
    windowElement.classList.remove("open");
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

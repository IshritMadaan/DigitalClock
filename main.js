document.addEventListener("DOMContentLoaded", () => {
  const state = {
    is24Hour: false,
    showSeconds: true,
    isDark: true,
    lastDateString: "",
  };

  const digitElements = {
    h1: document.querySelector("#hours .digit-container:nth-child(1)"),
    h2: document.querySelector("#hours .digit-container:nth-child(2)"),
    m1: document.querySelector("#minutes .digit-container:nth-child(1)"),
    m2: document.querySelector("#minutes .digit-container:nth-child(2)"),
    s1: document.querySelector("#seconds .digit-container:nth-child(1)"),
    s2: document.querySelector("#seconds .digit-container:nth-child(2)"),
  };

  const ampmEl = document.querySelector("#ampm .ampm-container");
  const dateEl = document.getElementById("date-display");
  let digitHeight = 0;

  function createDigitRollers() {
    const containers = document.querySelectorAll(".digit-container");
    containers.forEach((container) => {
      const roller = document.createElement("div");
      roller.className = "digit-roller";
      for (let i = 0; i < 10; i++) {
        const digit = document.createElement("div");
        digit.className = "digit";
        digit.textContent = i;
        roller.appendChild(digit);
      }
      container.appendChild(roller);
    });
    // Calculate digitHeight after they are in the DOM
    setTimeout(() => {
      const firstDigit = document.querySelector(".digit");
      if (firstDigit) digitHeight = firstDigit.clientHeight;
    }, 0);
  }

  function setDigit(element, value) {
    if (!element || digitHeight === 0) return;
    const roller = element.querySelector(".digit-roller");
    roller.style.transform = `translateY(-${value * digitHeight}px)`;
  }

  function updateClock() {
    const now = new Date();

    let hours = now.getHours();
    const minutes = now.getMinutes();
    const seconds = now.getSeconds();

    const ampm = hours >= 12 ? "PM" : "AM";
    if (!state.is24Hour) {
      hours = hours % 12;
      hours = hours ? hours : 12; // the hour '0' should be '12'
      ampmEl.textContent = ampm;
    }

    setDigit(digitElements.h1, Math.floor(hours / 10));
    setDigit(digitElements.h2, hours % 10);
    setDigit(digitElements.m1, Math.floor(minutes / 10));
    setDigit(digitElements.m2, minutes % 10);

    if (state.showSeconds) {
      setDigit(digitElements.s1, Math.floor(seconds / 10));
      setDigit(digitElements.s2, seconds % 10);
    }

    // Update date only if it has changed
    const currentDateString = now.toDateString();
    if (currentDateString !== state.lastDateString) {
      const options = {
        weekday: "long",
        year: "numeric",
        month: "long",
        day: "numeric",
      };
      dateEl.textContent = now.toLocaleDateString(undefined, options);
      state.lastDateString = currentDateString;
    }
  }

  function toggleUIState() {
    document.getElementById("seconds").style.display = state.showSeconds
      ? "flex"
      : "none";
    document.getElementById("seconds-separator").style.display =
      state.showSeconds ? "flex" : "none";
    document.getElementById("ampm").style.display = state.is24Hour
      ? "none"
      : "flex";
    document.body.classList.toggle("dark", state.isDark);
  }

  // --- Settings Panel ---
  const settingsBtn = document.getElementById("settings-btn");
  const settingsPanel = document.getElementById("settings-panel");
  settingsBtn.addEventListener("click", () => {
    settingsPanel.classList.toggle("active");
  });
  document.addEventListener("click", (e) => {
    if (!settingsPanel.contains(e.target) && !settingsBtn.contains(e.target)) {
      settingsPanel.classList.remove("active");
    }
  });

  // --- Toggles ---
  document.getElementById("theme-toggle").addEventListener("change", (e) => {
    state.isDark = e.target.checked;
    toggleUIState();
  });

  document.getElementById("format-toggle").addEventListener("change", (e) => {
    state.is24Hour = e.target.checked;
    toggleUIState();
    updateClock();
  });

  document.getElementById("seconds-toggle").addEventListener("change", (e) => {
    state.showSeconds = e.target.checked;
    toggleUIState();
  });

  document
    .getElementById("fullscreen-toggle")
    .addEventListener("change", (e) => {
      if (e.target.checked) {
        if (document.documentElement.requestFullscreen) {
          document.documentElement.requestFullscreen();
        } else if (document.documentElement.webkitRequestFullscreen) {
          /* Safari */
          document.documentElement.webkitRequestFullscreen();
        }
      } else {
        if (document.exitFullscreen) {
          document.exitFullscreen();
        } else if (document.webkitExitFullscreen) {
          /* Safari */
          document.webkitExitFullscreen();
        }
      }
    });

  document.addEventListener("fullscreenchange", () => {
    document.getElementById("fullscreen-toggle").checked =
      !!document.fullscreenElement;
  });
  document.addEventListener("webkitfullscreenchange", () => {
    // Safari
    document.getElementById("fullscreen-toggle").checked =
      !!document.webkitFullscreenElement;
  });

  function init() {
    // Set initial theme based on system preference
    if (
      window.matchMedia &&
      window.matchMedia("(prefers-color-scheme: dark)").matches
    ) {
      state.isDark = true;
    } else {
      state.isDark = false;
    }
    document.getElementById("theme-toggle").checked = state.isDark;

    createDigitRollers();
    toggleUIState();
    updateClock();
    setInterval(updateClock, 1000);
  }

  init();
});

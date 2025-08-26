document.addEventListener("DOMContentLoaded", () => {
  const state = {
    is24Hour: false,
    showSeconds: true,
    isDark: true,
    lastDateString: "",
  };

  const digitElements = {
    h: document.querySelectorAll("#hours .digit-container"),
    m: document.querySelectorAll("#minutes .digit-container"),
    s: document.querySelectorAll("#seconds .digit-container"),
  };

  const ampmEl = document.querySelector("#ampm .ampm-container");
  const dateEl = document.getElementById("date-display");
  const docEl = document.documentElement;

  function createDigitRollers() {
    document.querySelectorAll(".digit-container").forEach((container) => {
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
  }

  function setDigit(elements, value) {
    const s = String(value).padStart(2, "0");
    const v1 = s[0];
    const v2 = s[1];
    if (elements[0])
      elements[0].querySelector(
        ".digit-roller"
      ).style.transform = `translateY(-${v1 * 1.1}em)`;
    if (elements[1])
      elements[1].querySelector(
        ".digit-roller"
      ).style.transform = `translateY(-${v2 * 1.1}em)`;
  }

  function updateClock() {
    const now = new Date();
    let hours = now.getHours();
    const minutes = now.getMinutes();
    const seconds = now.getSeconds();

    if (!state.is24Hour) {
      ampmEl.textContent = hours >= 12 ? "PM" : "AM";
      hours = hours % 12 || 12;
    }

    setDigit(digitElements.h, hours);
    setDigit(digitElements.m, minutes);
    if (state.showSeconds) {
      setDigit(digitElements.s, seconds);
    }

    const currentDateString = now.toDateString();
    if (currentDateString !== state.lastDateString) {
      dateEl.textContent = now.toLocaleDateString(undefined, {
        weekday: "long",
        year: "numeric",
        month: "long",
        day: "numeric",
      });
      state.lastDateString = currentDateString;
    }
  }

  function applyUIState() {
    document.getElementById("seconds").style.display = state.showSeconds
      ? "flex"
      : "none";
    document.getElementById("seconds-separator").style.display =
      state.showSeconds ? "flex" : "none";
    document.getElementById("ampm").style.display = state.is24Hour
      ? "none"
      : "flex";
    docEl.classList.toggle("dark", state.isDark);
  }

  // --- Settings Panel ---
  const settingsBtn = document.getElementById("settings-btn");
  const settingsPanel = document.getElementById("settings-panel");
  settingsBtn.addEventListener("click", () =>
    settingsPanel.classList.toggle("active")
  );
  document.addEventListener("click", (e) => {
    if (!settingsPanel.contains(e.target) && !settingsBtn.contains(e.target)) {
      settingsPanel.classList.remove("active");
    }
  });

  // --- Toggles ---
  document.getElementById("theme-toggle").addEventListener("change", (e) => {
    state.isDark = e.target.checked;
    applyUIState();
  });
  document.getElementById("format-toggle").addEventListener("change", (e) => {
    state.is24Hour = e.target.checked;
    applyUIState();
    updateClock();
  });
  document.getElementById("seconds-toggle").addEventListener("change", (e) => {
    state.showSeconds = e.target.checked;
    applyUIState();
  });
  document
    .getElementById("fullscreen-toggle")
    .addEventListener("change", (e) => {
      if (!document.fullscreenElement && !document.webkitFullscreenElement) {
        (docEl.requestFullscreen || docEl.webkitRequestFullscreen).call(docEl);
      } else {
        (document.exitFullscreen || document.webkitExitFullscreen).call(
          document
        );
      }
    });
  ["fullscreenchange", "webkitfullscreenchange"].forEach((evt) =>
    document.addEventListener(evt, () => {
      document.getElementById("fullscreen-toggle").checked = !!(
        document.fullscreenElement || document.webkitFullscreenElement
      );
    })
  );

  function init() {
    state.isDark =
      window.matchMedia?.("(prefers-color-scheme: dark)").matches ?? true;
    document.getElementById("theme-toggle").checked = state.isDark;

    createDigitRollers();
    applyUIState();
    updateClock();
    setInterval(updateClock, 1000);
  }

  init();
});

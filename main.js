document.addEventListener("DOMContentLoaded", () => {
  const state = {
    is24Hour: false,
    showSeconds: true,
    isDark: window.matchMedia?.("(prefers-color-scheme: dark)").matches ?? true,
    lastDateString: "",
  };

  const D = document;
  const docEl = D.documentElement;
  const ELS = {
    h: D.querySelectorAll("#hours .digit-container"),
    m: D.querySelectorAll("#minutes .digit-container"),
    s: D.querySelectorAll("#seconds .digit-container"),
    ampm: D.querySelector("#ampm .ampm-container"),
    date: D.getElementById("date-display"),
    seconds: D.getElementById("seconds"),
    secondsSeparator: D.getElementById("seconds-separator"),
    ampmContainer: D.getElementById("ampm"),
    settingsBtn: D.getElementById("settings-btn"),
    settingsPanel: D.getElementById("settings-panel"),
  };

  function createDigitRollers() {
    D.querySelectorAll(".digit-container").forEach((container) => {
      const roller = D.createElement("div");
      roller.className = "digit-roller";
      roller.innerHTML = Array.from(
        { length: 10 },
        (_, i) => `<div class="digit">${i}</div>`
      ).join("");
      container.appendChild(roller);
    });
  }

  function setDigit(elements, value) {
    const s = String(value).padStart(2, "0");
    elements[0].firstElementChild.style.transform = `translateY(-${
      s[0] * 1.1
    }em)`;
    elements[1].firstElementChild.style.transform = `translateY(-${
      s[1] * 1.1
    }em)`;
  }

  function updateClock() {
    const now = new Date();
    let hours = now.getHours();
    const minutes = now.getMinutes();
    const seconds = now.getSeconds();

    if (!state.is24Hour) {
      ELS.ampm.textContent = hours >= 12 ? "PM" : "AM";
      hours = hours % 12 || 12;
    }

    setDigit(ELS.h, hours);
    setDigit(ELS.m, minutes);
    if (state.showSeconds) {
      setDigit(ELS.s, seconds);
    }

    const currentDateString = now.toDateString();
    if (currentDateString !== state.lastDateString) {
      ELS.date.textContent = now.toLocaleDateString(undefined, {
        weekday: "long",
        year: "numeric",
        month: "long",
        day: "numeric",
      });
      state.lastDateString = currentDateString;
    }
  }

  function applyUIState() {
    ELS.seconds.style.display = state.showSeconds ? "contents" : "none";
    ELS.secondsSeparator.style.display = state.showSeconds ? "block" : "none";
    ELS.ampmContainer.style.display = state.is24Hour ? "none" : "flex";
    docEl.classList.toggle("dark", state.isDark);
  }

  // --- Event Listeners ---
  ELS.settingsBtn.addEventListener("click", () =>
    ELS.settingsPanel.classList.toggle("active")
  );

  D.addEventListener("click", (e) => {
    if (
      !ELS.settingsPanel.contains(e.target) &&
      !ELS.settingsBtn.contains(e.target)
    ) {
      ELS.settingsPanel.classList.remove("active");
    }
  });

  ELS.settingsPanel.addEventListener("change", (e) => {
    if (e.target.type !== "checkbox") return;
    const { id, checked } = e.target;
    switch (id) {
      case "theme-toggle":
        state.isDark = checked;
        break;
      case "format-toggle":
        state.is24Hour = checked;
        updateClock();
        break;
      case "seconds-toggle":
        state.showSeconds = checked;
        break;
      case "fullscreen-toggle":
        if (!D.fullscreenElement) {
          docEl.requestFullscreen().catch(() => (e.target.checked = false));
        } else {
          D.exitFullscreen();
        }
        return; // Avoid applyUIState for fullscreen
    }
    applyUIState();
  });

  ["fullscreenchange", "webkitfullscreenchange"].forEach((evt) =>
    D.addEventListener(
      evt,
      () =>
        (D.getElementById("fullscreen-toggle").checked = !!D.fullscreenElement)
    )
  );

  // --- Init ---
  D.getElementById("theme-toggle").checked = state.isDark;
  createDigitRollers();
  applyUIState();
  updateClock();
  setInterval(updateClock, 1000);
});

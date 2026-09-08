(() => {
  "use strict";

  const consentKey = "olicios-analytics-consent-v2";
  const banner = document.querySelector("#cookie-banner");
  const privacyDialog = document.querySelector("#privacy-dialog");
  const reviewButton = document.querySelector("#review-cookie-consent");
  let analyticsLoaded = false;

  function getConsent() {
    try {
      return localStorage.getItem(consentKey);
    } catch {
      return null;
    }
  }

  function saveConsent(value) {
    try {
      localStorage.setItem(consentKey, value);
    } catch {
      // Se o navegador bloquear o armazenamento local, a escolha vale nesta página.
    }
  }

  function loadAnalytics() {
    const measurementId = window.OLICIOS_ANALYTICS_ID?.trim();

    if (analyticsLoaded || !measurementId || !/^G-[A-Z0-9]+$/i.test(measurementId)) {
      return;
    }

    analyticsLoaded = true;
    window[`ga-disable-${measurementId}`] = false;
    window.dataLayer = window.dataLayer || [];
    window.gtag = function gtag() {
      window.dataLayer.push(arguments);
    };
    window.gtag("consent", "default", {
      ad_storage: "denied",
      ad_user_data: "denied",
      ad_personalization: "denied",
      analytics_storage: "denied",
    });
    window.gtag("consent", "update", {
      analytics_storage: "granted",
    });
    window.gtag("js", new Date());
    window.gtag("config", measurementId, {
      allow_google_signals: false,
      allow_ad_personalization_signals: false,
    });

    const script = document.createElement("script");
    script.async = true;
    script.src = `https://www.googletagmanager.com/gtag/js?id=${encodeURIComponent(measurementId)}`;
    document.head.append(script);
  }

  function disableAnalytics() {
    const measurementId = window.OLICIOS_ANALYTICS_ID?.trim();
    if (!measurementId || !/^G-[A-Z0-9]+$/i.test(measurementId)) return;

    window[`ga-disable-${measurementId}`] = true;
    window.gtag?.("consent", "update", { analytics_storage: "denied" });
  }

  function closeBanner() {
    if (banner) banner.hidden = true;
  }

  function openBanner() {
    if (banner) banner.hidden = false;
  }

  function openPrivacy() {
    if (!privacyDialog) return;
    if (typeof privacyDialog.showModal === "function") {
      privacyDialog.showModal();
    } else {
      privacyDialog.setAttribute("open", "");
    }
  }

  function closePrivacy() {
    if (!privacyDialog) return;
    if (typeof privacyDialog.close === "function") privacyDialog.close();
    else privacyDialog.removeAttribute("open");
  }

  function choose(value) {
    saveConsent(value);
    closeBanner();
    if (value === "accepted") loadAnalytics();
    else disableAnalytics();
  }

  banner
    ?.querySelector("[data-cookie-accept]")
    ?.addEventListener("click", () => choose("accepted"));
  banner
    ?.querySelector("[data-cookie-reject]")
    ?.addEventListener("click", () => choose("rejected"));
  document
    .querySelectorAll("[data-privacy-open]")
    .forEach((button) => button.addEventListener("click", openPrivacy));
  privacyDialog
    ?.querySelector("[data-privacy-close]")
    ?.addEventListener("click", closePrivacy);
  privacyDialog?.addEventListener("click", (event) => {
    if (event.target === privacyDialog) closePrivacy();
  });
  reviewButton?.addEventListener("click", () => {
    closePrivacy();
    openBanner();
  });

  const consent = getConsent();
  if (consent === "accepted") loadAnalytics();
  else if (consent !== "rejected") openBanner();
})();

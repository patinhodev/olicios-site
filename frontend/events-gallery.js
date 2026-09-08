(() => {
  const base = "assets/images/eventos/";
  const galleries = {
    casamento: {
      title: "Casamentos",
      description:
        "Buffet, montagem e equipe para celebrar no Olicio's ou no local escolhido.",
      images: [
        "evento-casamento-tratado.webp",
        ...Array.from(
          { length: 8 },
          (_, index) => `casamento-${String(index + 2).padStart(2, "0")}.webp`,
        ),
      ],
    },
    churrasco: {
      title: "Churrascos",
      description: "A tradição da nossa brasa em eventos internos e externos.",
      images: [
        "evento-churrasco-tratado.webp",
        ...Array.from(
          { length: 9 },
          (_, index) => `churrasco-${String(index + 2).padStart(2, "0")}.webp`,
        ),
      ],
    },
    "coffee-break": {
      title: "Coffee break",
      description:
        "Mesas completas e serviço cuidadoso para encontros sociais e corporativos.",
      images: [
        "evento-coffee-break-tratado.webp",
        ...Array.from(
          { length: 7 },
          (_, index) => `coffee-break-${String(index + 2).padStart(2, "0")}.webp`,
        ),
      ],
    },
    feijoada: {
      title: "Feijoadas",
      description:
        "Buffet de feijoada com acompanhamentos e estrutura para a sua celebração.",
      images: [
        "evento-feijoada-tratado.webp",
        ...Array.from(
          { length: 5 },
          (_, index) => `feijoada-${String(index + 2).padStart(2, "0")}.webp`,
        ),
      ],
    },
    "festa-15-anos": {
      title: "Festas de 15 anos",
      description: "Cenários, buffet e atendimento para uma comemoração inesquecível.",
      images: [
        "evento-festa-15-anos-tratado.webp",
        ...Array.from(
          { length: 4 },
          (_, index) => `festa-15-anos-${String(index + 2).padStart(2, "0")}.webp`,
        ),
      ],
    },
    "festa-infantil": {
      title: "Festas infantis",
      description:
        "Estrutura e buffet para uma festa alegre, acolhedora e feita com cuidado.",
      images: [
        "evento-festa-infantil-tratado.webp",
        ...Array.from(
          { length: 4 },
          (_, index) => `festa-infantil-${String(index + 2).padStart(2, "0")}.webp`,
        ),
      ],
    },
  };

  const dialog = document.querySelector("#event-gallery");
  const title = document.querySelector("#gallery-title");
  const description = document.querySelector("#gallery-description");
  const grid = document.querySelector("#gallery-grid");
  const closeButton = dialog?.querySelector(".gallery-close");
  let trigger = null;
  const supportsNativeDialog =
    typeof HTMLDialogElement !== "undefined" &&
    typeof HTMLDialogElement.prototype.showModal === "function";

  if (!dialog || !title || !description || !grid || !closeButton) return;

  document.querySelectorAll("[data-gallery]").forEach((card) => {
    card.addEventListener("click", () => {
      const gallery = galleries[card.dataset.gallery];
      if (!gallery) return;

      trigger = card;
      title.textContent = gallery.title;
      description.textContent = gallery.description;
      grid.replaceChildren(
        ...gallery.images.map((file, index) => {
          const image = document.createElement("img");
          image.src = base + file;
          image.alt = `${gallery.title} — foto ${index + 1}`;
          image.loading = index < 2 ? "eager" : "lazy";
          image.decoding = "async";
          return image;
        }),
      );
      if (supportsNativeDialog) {
        dialog.showModal();
      } else {
        dialog.setAttribute("open", "");
        dialog.classList.add("gallery-dialog-fallback");
      }
      document.body.classList.add("gallery-open");
    });
  });

  const cleanUpGallery = () => {
    document.body.classList.remove("gallery-open");
    grid.replaceChildren();
    trigger?.focus();
  };

  const closeGallery = () => {
    if (supportsNativeDialog) {
      dialog.close();
    } else {
      dialog.removeAttribute("open");
      dialog.classList.remove("gallery-dialog-fallback");
      cleanUpGallery();
    }
  };

  closeButton.addEventListener("click", closeGallery);
  dialog.addEventListener("click", (event) => {
    if (event.target === dialog) closeGallery();
  });
  dialog.addEventListener("close", cleanUpGallery);

  document.addEventListener("keydown", (event) => {
    if (
      event.key === "Escape" &&
      !supportsNativeDialog &&
      dialog.hasAttribute("open")
    ) {
      closeGallery();
    }
  });
})();

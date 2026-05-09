import "./styles.css";
import lowRamUsageImage from "./assets/low-ram-usage.jpg";
import screenshot01Image from "./assets/screenshot-01.jpg";
import screenshot02Image from "./assets/screenshot-02.jpg";
import textTyperImage from "./assets/text-typer.jpg";
import trayChangeLanguageImage from "./assets/tray-change-language.jpg";

const APP_VERSION_METADATA_URL = "/app-version.json";

const screenshotItems = [
  {
    src: screenshot01Image,
    alt: "Giao dien chinh cua Instant Translate",
    caption: "Giao di&#7879;n ch&#237;nh c&#7911;a app."
  },
  {
    src: screenshot02Image,
    alt: "Huong dan su dung thuc te cua Instant Translate",
    caption: "C&#225;ch s&#7917; d&#7909;ng th&#7921;c t&#7871; c&#7911;a app."
  },
  {
    src: trayChangeLanguageImage,
    alt: "Menu tray de doi ngon ngu dich nhanh",
    caption: "&#272;&#7893;i ng&#244;n ng&#7919; d&#7883;ch ngay t&#7915; system tray."
  },
  {
    src: textTyperImage,
    alt: "Tinh nang text typer trong Instant Translate",
    caption: "T&#237;nh n&#259;ng text typer cho thao t&#225;c nh&#7853;p nhanh."
  },
  {
    src: lowRamUsageImage,
    alt: "Thong ke muc su dung RAM thap cua Instant Translate",
    caption: "App ch&#7841;y n&#7873;n nh&#7865;, RAM s&#7917; d&#7909;ng th&#7845;p."
  }
];

function setupScreenshotsCarousel() {
  const galleryRoot = document.querySelector(".screenshots-grid");

  if (!galleryRoot) {
    return;
  }

  galleryRoot.classList.add("screenshots-shell");
  galleryRoot.innerHTML = `
    <button class="screenshot-nav screenshot-nav-left" type="button" aria-label="Cuon sang trai">
      <span aria-hidden="true">&#8249;</span>
    </button>
    <div class="screenshots-viewport" tabindex="0" aria-label="Bo suu tap anh chup man hinh cua Instant Translate">
      <div class="screenshots-track"></div>
    </div>
    <button class="screenshot-nav screenshot-nav-right" type="button" aria-label="Cuon sang phai">
      <span aria-hidden="true">&#8250;</span>
    </button>
  `;

  const track = galleryRoot.querySelector(".screenshots-track");
  const viewport = galleryRoot.querySelector(".screenshots-viewport");
  const prevButton = galleryRoot.querySelector(".screenshot-nav-left");
  const nextButton = galleryRoot.querySelector(".screenshot-nav-right");

  if (!track || !viewport || !prevButton || !nextButton) {
    return;
  }

  track.innerHTML = screenshotItems
    .map(
      (item, index) => `
        <figure class="screenshot-card reveal" data-delay="${index * 70}">
          <img src="${item.src}" alt="${item.alt}" loading="lazy" />
          <figcaption>${item.caption}</figcaption>
        </figure>
      `
    )
    .join("");

  const getScrollAmount = () => Math.max(viewport.clientWidth * 0.82, 280);

  const updateNavState = () => {
    const maxScrollLeft = viewport.scrollWidth - viewport.clientWidth - 4;
    prevButton.disabled = viewport.scrollLeft <= 4;
    nextButton.disabled = viewport.scrollLeft >= maxScrollLeft;
  };

  const scrollGallery = (direction) => {
    viewport.scrollBy({
      left: getScrollAmount() * direction,
      behavior: "smooth"
    });
  };

  prevButton.addEventListener("click", () => scrollGallery(-1));
  nextButton.addEventListener("click", () => scrollGallery(1));
  viewport.addEventListener("scroll", updateNavState, { passive: true });
  window.addEventListener("resize", updateNavState);

  window.setTimeout(updateNavState, 0);
}

setupScreenshotsCarousel();

const revealItems = Array.from(document.querySelectorAll(".reveal"));

const revealObserver = new IntersectionObserver(
  (entries) => {
    entries.forEach((entry) => {
      if (!entry.isIntersecting) {
        return;
      }

      const delay = Number(entry.target.getAttribute("data-delay") || 0);
      window.setTimeout(() => {
        entry.target.classList.add("is-visible");
      }, delay);

      revealObserver.unobserve(entry.target);
    });
  },
  { threshold: 0.18, rootMargin: "0px 0px -60px 0px" }
);

revealItems.forEach((item) => revealObserver.observe(item));

async function hydrateLatestVersionTag() {
  const versionTags = Array.from(document.querySelectorAll("[data-latest-version-tag]"));
  if (versionTags.length === 0) {
    return;
  }

  try {
    const response = await fetch(APP_VERSION_METADATA_URL, { cache: "no-store" });
    if (!response.ok) {
      return;
    }

    const payload = await response.json();
    const latestVersion = String(payload?.latestVersion ?? "").trim();
    if (!latestVersion) {
      return;
    }

    versionTags.forEach((tag) => {
      tag.textContent = `v${latestVersion}`;
      tag.style.display = "inline-flex";
    });
  } catch {
    // Keep default download labels when metadata is unavailable.
  }
}

hydrateLatestVersionTag();

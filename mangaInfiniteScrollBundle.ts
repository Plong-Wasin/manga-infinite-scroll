interface MangaInitObject {
  [key: string]: () => void;
}
interface NameParameters {
  nextChapterSelector: string;
  containerSelector: string;
  imageBlockSelector?: string;
  callback?: (
    blockElement: HTMLElement,
    imageElement: HTMLImageElement
  ) => void;
}

(() => {
  function ready(fn: () => void): void {
    if (document.readyState != "loading") {
      fn();
    } else {
      document.addEventListener("DOMContentLoaded", fn);
    }
  }
  function sleep(ms: number): Promise<void> {
    return new Promise((resolve) => setTimeout(resolve, ms));
  }
  function changeUrl(url: string): void {
    history.replaceState(null, "", url);
  }
  function loadPage() {
    const images = document.querySelectorAll<HTMLImageElement>(
      "image[loading='lazy']"
    );
    for (let i = 0; i < images.length && i < 3; i++) {
      images[i].loading = "eager";
    }
  }
  function addEventToImg() {
    const els = document.querySelectorAll<HTMLImageElement>(
      'img[loading="lazy"]'
    );
    if (els.length > 0) {
      const el = els[els.length - 1];
      el.loading = "eager";
    }
    els.forEach((el, index) => {
      el.addEventListener("load", () => {
        for (let j = 1; j + index < els.length && j <= 3; j++) {
          const el = els[j + index];
          el.loading = "eager";
        }
      });
      el.addEventListener("error", function () {
        const countError = this.dataset.countError || 1;
        if (+countError < 3) {
          this.dataset.countError = `${+countError + 1}`;
        } else {
          return;
        }
        for (let j = 1; j + index < els.length && j <= 3; j++) {
          const el = els[j + index];
          el.loading = "eager";
        }
        setTimeout(() => {
          const imgSrc = el.src;
          this.src = imgSrc;
        }, 1000);
      });
    });
  }
  function manga({
    nextChapterSelector,
    containerSelector,
    imageBlockSelector = "",
    callback = () => void 0,
  }: NameParameters): void {
    const containerEl: HTMLElement | null =
      document.querySelector(containerSelector);
    let loading = false;
    let nextChapterEl: HTMLAnchorElement | null =
      document.querySelector(nextChapterSelector);
    let nextChapterLink = nextChapterEl?.href;
    window.addEventListener("scroll", () => {
      void (async () => {
        if (containerEl) {
          if (
            !loading &&
            nextChapterLink &&
            window.scrollY + window.innerHeight * 2 >
              containerEl.offsetTop + containerEl.offsetHeight
          ) {
            loading = true;
            const tempImg = document.createElement("img");
            tempImg.style.height = `${window.innerHeight}px`;
            containerEl.appendChild(tempImg);
            const res = await fetch(nextChapterLink);
            const text = await res.text();
            const parser = new DOMParser();
            const doc = parser.parseFromString(text, "text/html");
            const divEls = doc.querySelectorAll<HTMLElement>(
              `${containerSelector} ${imageBlockSelector}`
            );
            for (const divEl of divEls) {
              const img =
                divEl.querySelector<HTMLImageElement>(`img`) ||
                (divEl as HTMLImageElement);
              callback(divEl, img);
              if (img) {
                img.loading = "lazy";
                containerEl.appendChild(divEl);
              }
            }
            containerEl.appendChild(tempImg);
            addEventToImg();
            loadPage();
            const docTitleEl = doc.querySelector("title");
            const titleEl = document.querySelector("title");
            if (docTitleEl && titleEl) {
              titleEl.innerText = docTitleEl.innerText;
            }
            changeUrl(nextChapterLink);
            nextChapterEl = doc.querySelector(nextChapterSelector);
            nextChapterLink = nextChapterEl?.href;
            await sleep(1000);
            tempImg.remove();
            loading = false;
          }
        }
      })();
    });
  }
  function init() {
    return {
      mangakakalot: () => {
        const params: NameParameters = {
          nextChapterSelector: ".btn-navigation-chap .back",
          containerSelector: ".container-chapter-reader",
          imageBlockSelector: "img",
          callback(blockElement, imageElement) {
            const selectElement = document.querySelector<HTMLSelectElement>(
              ".pn-op-sv-cbb-content-margin"
            );
            const selectValue = selectElement?.value;
            if (selectValue) {
              imageElement.style.marginTop = `${selectValue}px`;
            }
          },
        };
        manga(params);
      },
      readmanganato: () => {
        const params: NameParameters = {
          nextChapterSelector: ".navi-change-chapter-btn-next",
          containerSelector: ".container-chapter-reader",
          imageBlockSelector: "img",
          callback(blockElement, imageElement) {
            const selectElement = document.querySelector<HTMLSelectElement>(
              ".server-cbb-content-margin"
            );
            const selectValue = selectElement?.value;
            if (selectValue) {
              imageElement.style.marginTop = `${selectValue}px`;
            }
          },
        };
        manga(params);
      },
      _365manga: () => {
        const params: NameParameters = {
          nextChapterSelector: ".nav-next a",
          containerSelector: ".reading-content",
          imageBlockSelector: ".page-break.no-gaps",
        };
        manga(params);
      },
      mangauptocats: () => {
        const params: NameParameters = {
          nextChapterSelector: ".nav-next a",
          containerSelector: ".reading-content",
          imageBlockSelector: ".page-break",
        };
        manga(params);
      },
      rh2plusmanga: () => {
        const params: NameParameters = {
          nextChapterSelector: ".btn.next_page",
          containerSelector: ".text-left p code",
          imageBlockSelector: "img",
        };
        manga(params);
      },
      manga00: () => {
        const params: NameParameters = {
          nextChapterSelector: ".nvs.rght a",
          containerSelector: "#image_manga",
          imageBlockSelector: "img",
          callback(blockElement, imageElement) {
            imageElement.src = imageElement.dataset.cfsrc ?? imageElement.src;
          },
        };
        manga(params);
      },
      niceoppai: () => {
        const params: NameParameters = {
          nextChapterSelector: ".nav_pag .nxt",
          containerSelector: "#image-container",
          imageBlockSelector: "center",
        };
        manga(params);
      },
      mangaisekaithai: () => {
        const params: NameParameters = {
          nextChapterSelector: "a.btn.next_page",
          containerSelector: ".text-left p",
          imageBlockSelector: "img",
        };
        manga(params);
      },
      mangatitan: () => {
        const params: NameParameters = {
          nextChapterSelector: ".next_page",
          containerSelector: ".reading-content",
          imageBlockSelector: ".page-break.no-gaps",
          callback(blockElement, imageElement) {
            imageElement.src = imageElement.dataset.src ?? imageElement.src;
          },
        };
        manga(params);
      },
      oremanga: () => {
        const params: NameParameters = {
          nextChapterSelector: ".nav-chapter a[rel='next']",
          containerSelector: ".reader-area-main",
          imageBlockSelector: "img",
        };
        manga(params);
      },
      mangadex: () => {
        const params: NameParameters = {
          nextChapterSelector:
            "a.rounded.relative.md-btn.flex.items-center.px-3.justify-center.text-white.bg-primary.hover:bg-primary-darken.active:bg-primary-darken2.px-4.px-6",
          containerSelector: ".md--pages.flex-grow.flex-col>div",
          imageBlockSelector: "img",
        };
        manga(params);
      },
      mangadeemak: () => {
        const params: NameParameters = {
          nextChapterSelector: ".nav-next a",
          containerSelector: ".reading-content",
          imageBlockSelector: ".page-break.no-gaps",
          callback(blockElement, imageElement) {
            imageElement.src = imageElement.dataset.src ?? imageElement.src;
          },
        };
        manga(params);
      },
      kingsmanga: () => {
        const params = {
          nextChapterSelector: "[rel='next']:not(.nextpostslink)",
          containerSelector: ".post-content",
          imageBlockSelector: "img",
        };
        manga(params);
      },
      mangaclash: () => {
        const params = {
          nextChapterSelector: ".btn.next_page",
          containerSelector: ".reading-content",
          imageBlockSelector: ".page-break.no-gaps",
          callback(blockElement: HTMLElement, imageElement: HTMLImageElement) {
            imageElement.src = imageElement.dataset.src ?? imageElement.src;
          },
        };
        manga(params);
      },
      catsTranslator: () => {
        const params = {
          nextChapterSelector: ".btn.next_page",
          containerSelector: ".reading-content",
          imageBlockSelector: ".page-break",
          callback(blockElement: HTMLElement, imageElement: HTMLImageElement) {
            imageElement.src = imageElement.dataset.src ?? imageElement.src;
          },
        };
        manga(params);
      },
      german66: () => {
        const params = {
          nextChapterSelector: ".rightnav>a",
          containerSelector: "div.reader-area > p",
          imageBlockSelector: "img",
        };
        manga(params);
      },
      mangapost: () => {
        const params = {
          nextChapterSelector: ".nav-next > a",
          containerSelector: ".reading-content",
          imageBlockSelector: ".page-break.no-gaps",
        };
        manga(params);
      },
      kaichan: () => {
        const params = {
          nextChapterSelector: "a.btn.btn-xs.rounded-md:last-child",
          containerSelector: ".px-4.py-4.relative",
          imageBlockSelector: ".w-full.h-full.flex.justify-center",
          callback(blockElement: HTMLElement, imageElement: HTMLImageElement) {
            imageElement.src = imageElement.dataset.src ?? imageElement.src;
            imageElement.loading = "eager";
          },
        };
        manga(params);
      },
    };
  }
  ready(() => {
    const url = new URL(location.href);
    const host = url.host;
    const hosts: MangaInitObject = {
      "mangakakalot.com": init().mangakakalot,
      "readmanganato.com": init().readmanganato,
      "365manga.com": init()._365manga,
      "mangauptocats.net": init().mangauptocats,
      "www.rh2plusmanga.com": init().rh2plusmanga,
      "manga00.com": init().manga00,
      "www.niceoppai.net": init().niceoppai,
      "www.mangaisekaithai.com": init().mangaisekaithai,
      "manga-titan.com": init().mangatitan,
      "www.oremanga.net": init().oremanga,
      "mangadex.org": init().mangadex,
      "mangadeemak.com": init().mangadeemak,
      "www.kingsmanga.net": init().kingsmanga,
      "mangaclash.com": init().mangaclash,
      "cats-translator.com": init().catsTranslator,
      "chapmanganato.com": init().readmanganato,
      "chapmanganato.to": init().readmanganato,
      "germa-66.com": init().german66,
      "manga-post.com": init().mangapost,
      "kaichan.co": init().kaichan,
    };
    if (hosts[host]) {
      hosts[host]();
    }
  });
})();

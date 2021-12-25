interface mangaInitObject {
    [key: string]: () => void;
}
interface nameParameters {
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
        history.pushState(null, "", url);
    }
    function addEventToImg() {
        const els = document.querySelectorAll<HTMLImageElement>(
            'img[loading="lazy"]'
        );
        if (els.length > 0) {
            const el = els[els.length - 1];
            el.loading = "auto";
        }
        els.forEach((el, index) => {
            el.addEventListener("load", () => {
                for (let j = 1; j + index < els.length && j <= 3; j++) {
                    const el = els[j + index];
                    el.loading = "auto";
                }
            });
            el.addEventListener("error", function () {
                for (let j = 1; j + index < els.length && j <= 3; j++) {
                    const el = els[j + index];
                    el.loading = "auto";
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
    }: nameParameters): void {
        const containerEl: HTMLElement | null =
            document.querySelector(containerSelector);
        let loading = false;
        let nextChapterEl: HTMLAnchorElement | null = document.querySelector(nextChapterSelector);
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
                                containerEl.appendChild(img);
                            }
                        }
                        const div = document.createElement("div");
                        div.style.height = `${window.innerHeight}px`;
                        containerEl.appendChild(div);
                        addEventToImg();
                        changeUrl(nextChapterLink);
                        nextChapterEl = doc.querySelector(nextChapterSelector);
                        nextChapterLink = nextChapterEl?.href;
                        await sleep(1000);
                        div.remove();
                        loading = false;
                    }
                }
            })();
        });
    }
    function init() {
        return {
            mangakakalot: () => {
                const params: nameParameters = {
                    nextChapterSelector: ".btn-navigation-chap .back",
                    containerSelector: ".container-chapter-reader",
                    imageBlockSelector: "img",
                    callback(blockElement, imageElement) {
                        const selectElement =
                            document.querySelector<HTMLSelectElement>(
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
                const params: nameParameters = {
                    nextChapterSelector: ".navi-change-chapter-btn-next",
                    containerSelector: ".container-chapter-reader",
                    imageBlockSelector: "img",
                    callback(blockElement, imageElement) {
                        const selectElement =
                            document.querySelector<HTMLSelectElement>(
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
                const params: nameParameters = {
                    nextChapterSelector: ".nav-next a",
                    containerSelector: ".reading-content",
                    imageBlockSelector: ".page-break.no-gaps",
                };
                manga(params);
            },
            mangauptocats: () => {
                const params: nameParameters = {
                    nextChapterSelector: ".nav-next a",
                    containerSelector: ".reading-content",
                    imageBlockSelector: ".page-break",
                };
                manga(params);
            },
            rh2plusmanga: () => {
                const params: nameParameters = {
                    nextChapterSelector: ".btn.next_page",
                    containerSelector: ".text-left p code",
                    imageBlockSelector: "img",
                };
                manga(params);
            },
            manga00:()=>{
                const params: nameParameters = {
                    nextChapterSelector: ".nvs.rght a",
                    containerSelector: "#image_manga",
                    imageBlockSelector: "img",
                    callback(blockElement, imageElement) {
                        imageElement.src = imageElement.dataset.cfsrc??imageElement.src;
                    }
                };
                manga(params);
            },
            niceoppai: () => {
                const params: nameParameters = {
                    nextChapterSelector: ".nav_pag .nxt",
                    containerSelector: "#image-container",
                    imageBlockSelector: "center",
                }
                manga(params);
            },
            mangaisekaithai:()=>{
                const params: nameParameters = {
                    nextChapterSelector: "a.btn.next_page",
                    containerSelector: ".text-left p",
                    imageBlockSelector: "img",
                }
                manga(params);
            },
            mangatitan:()=>{
                const params: nameParameters = {
                    nextChapterSelector: ".next_page",
                    containerSelector: ".reading-content",
                    imageBlockSelector: "page-break no-gaps",
                    callback(blockElement, imageElement) {
                        imageElement.src = imageElement.dataset.src??imageElement.src;
                    }
                }
                manga(params);
            },
            oremanga:()=>{
                const params: nameParameters = {
                    nextChapterSelector: ".nav-chapter a[rel='next']",
                    containerSelector: ".reader-area",
                    imageBlockSelector: "img",
                }
                manga(params);
            },
            mangadex:()=>{
                const params: nameParameters = {
                    nextChapterSelector: "a.rounded.relative.md-btn.flex.items-center.px-3.justify-center.text-white.bg-primary.hover:bg-primary-darken.active:bg-primary-darken2.px-4.px-6",
                    containerSelector: ".md--pages.flex-grow.flex-col>div",
                    imageBlockSelector: "img",
                }
                manga(params);
            },
        };
    }
    ready(() => {
        const url = new URL(location.href);
        const host = url.host;
        const hosts: mangaInitObject = {
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
        };
        if (hosts[host]) {
            hosts[host]();
        }
    });
})();
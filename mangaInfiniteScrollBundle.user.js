// ==UserScript==
// @name         mangaInfiniteScrollBundle
// @namespace    https://github.com/plong-wasin
// @version      0.1
// @description  Read manga with infinite scroll
// @author       Plong-Wasin
// @match        https://*/*
// @grant        none
// ==/UserScript==
"use strict";
(() => {
    function ready(fn) {
        if (document.readyState != "loading") {
            fn();
        }
        else {
            document.addEventListener("DOMContentLoaded", fn);
        }
    }
    function sleep(ms) {
        return new Promise((resolve) => setTimeout(resolve, ms));
    }
    function changeUrl(url) {
        history.pushState(null, "", url);
    }
    function addEventToImg() {
        const els = document.querySelectorAll('img[loading="lazy"]');
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
    function manga(nextChapterSelector, containerSelector, imageBlockSelector) {
        const containerEl = document.querySelector(containerSelector);
        let loading = false;
        let nextChapterEl = document.querySelector(nextChapterSelector);
        let nextChapterLink = nextChapterEl?.href;
        window.addEventListener("scroll", () => {
            void (async () => {
                if (containerEl) {
                    if (!loading &&
                        nextChapterLink &&
                        window.scrollY + window.innerHeight * 2 >
                            containerEl.offsetTop + containerEl.offsetHeight) {
                        loading = true;
                        const res = await fetch(nextChapterLink);
                        const text = await res.text();
                        const parser = new DOMParser();
                        const doc = parser.parseFromString(text, "text/html");
                        const divEls = doc.querySelectorAll(`${containerSelector} ${imageBlockSelector}`);
                        for (const divEl of divEls) {
                            const img = divEl.querySelector(`img`) || divEl;
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
                manga(".btn-navigation-chap .back", ".container-chapter-reader", "img");
            },
            readmanganato: () => {
                manga(".navi-change-chapter-btn-next", ".container-chapter-reader", "img");
            },
            _365manga: () => {
                manga(".nav-next a", ".reading-content", ".page-break.no-gaps");
            },
            mangauptocats: () => {
                manga(".nav-next a", ".reading-content", ".page-break");
            },
            rh2plusmanga: () => {
                manga(".btn.next_page", ".text-left p code", "img");
            }
        };
    }
    ready(() => {
        const url = new URL(location.href);
        const host = url.host;
        const hosts = {
            "mangakakalot.com": init().mangakakalot,
            "readmanganato.com": init().readmanganato,
            "365manga.com": init()._365manga,
            "mangauptocats.net": init().mangauptocats,
            "www.rh2plusmanga.com": init().rh2plusmanga
        };
        if (hosts[host]) {
            hosts[host]();
        }
    });
})();

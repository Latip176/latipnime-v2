import { generateData, generateAbout, generateGenres, generateInfo, generateStream, generateGenresM, generateSearch, generateComplete } from './module.js';
import { getData } from './controls.js';

const navItems = document.querySelectorAll(".navbar-bottom .nav-content ul li a");
const loader = document.querySelector(".load");

window.addEventListener("hashchange", () => {
    const url = new URL(window.location.href);
    const dataType = getDataFromHash(url.hash);
    if (["info", "stream"].includes(dataType)) {
        loadContent(dataType, getData(`${dataType === "stream" ? "view" : dataType}/?data=${getParamFromHash(url.hash)}`));
    } else if (dataType === "genres_m") {
        const param = getParamFromHash(url.hash);
        loadContent(dataType, getData(`genres/${param}`), param)
    }
});

function loadContent(dataType, data, x=null) {
    removeChildAll();
    if (["home", "ongoing"].includes(dataType)) {
        generateData(data, dataType);
    } else if (dataType === "about") {
        generateAbout();
    } else if (dataType === "complete") {
        generateComplete();
    } else if (dataType === "genres") {
        generateGenres(data, dataType);
    } else if (dataType === "genres_m") {
        generateGenresM(data, x)
    } else if (dataType === "info") {
        generateInfo(data);
    } else if (dataType === "stream") {
        generateStream(data)
    } else if (dataType === "search") {
        generateSearch(data, x)
    }
    setActiveNavItem(dataType);
}

function removeChildAll() {
    const danime = document.querySelector(".data-anime");
    danime.style.position = "absolute";
    const genres = document.querySelector(".genres");
    genres.style.position = "absolute";
    const genres_m = document.querySelector('.genres_m');
    genres_m.style.position = "absolute";
    const search = document.querySelector('.search');
    search.style.position = "absolute";
    const elements = document.querySelectorAll(".content .slider .title, .content .data-anime .anime, .content .about .text-about, .content .genres div, .content .info div, .content .stream div, .content .genres_m div, .content .genres_m h2, .content .search div, .content .search h2, .content .btn-next, .content .btn-next-genre");
    elements.forEach(element => {
        element.parentNode.removeChild(element);
    });
}

function setActiveNavItem(dataType) {
    navItems.forEach(navItem => {
        navItem.classList.remove("active");
        if (navItem.getAttribute("id") === dataType) {
            navItem.classList.add("active");
        }
    });
}

function getDataFromHash(hash) {
    const regex = hash.match(/(\w+)/i);
    return dataMap[regex !== null ? "#" + regex[0] : ""];
}

function getParamFromHash(hash) {
    const param = hash.match(/\w+\?data=(.*)/i);
    return param[1];
}

function disableAll() {
    navItems.forEach(item => {
        item.style.pointerEvents = "none";
    });
}

function allowAll() {
    navItems.forEach(item => {
        item.style.pointerEvents = "auto";
    });
}

function showLoad() {
    document.body.classList.add("loader-open");
    loader.style.position = "relative";
    loader.style.visibility = "visible";
}

function hideLoad() {
    document.body.classList.remove("loader-open");
    loader.style.position = "fixed";
    loader.style.visibility = "hidden";
}

const dataMap = {
    "#home": "home",
    "#ongoing": "ongoing",
    "#complete": "complete",
    "#genres": "genres",
    "#genres_m": "genres_m",
    "#about": "about",
    "#info": "info",
    "#stream": "stream"
};

navItems.forEach(item => {
    item.addEventListener("click", () => {
        const url = new URL(item.href);
        const dataType = dataMap[url.hash];
        loadContent(dataType, !["about", "complete"].includes(dataType) ? getData(dataType) : "");
    });
});

document.addEventListener("DOMContentLoaded", () => {
    const search = document.querySelector(".fa-search");
    search.addEventListener("click", () => {
        const inp = document.querySelector(".nav-content input");
        search.style.visibility = "hidden";
        search.style.color = "rgba(0,0,0,0.5)";
        inp.classList.add("open");
    });

    if(!window.location.hash) {
        loadContent("home", getData("home"));
    } else {
        removeChildAll();
        const url = new URL(window.location.href);
        const dataType = getDataFromHash(url.hash);
        if (["info", "stream"].includes(dataType)) {
            loadContent(dataType, getData(`${dataType === "stream" ? "view" : dataType}/?data=${getParamFromHash(url.hash)}`))
        } else if (["home", "ongoing", "genres"].includes(dataType)) {
            loadContent(dataType, getData(dataType));
        } else if (dataType === "genres_m") {
            const param = getParamFromHash(url.hash);
            loadContent(dataType, getData(`genres/${param}`), param)
        } else if (dataType == "info") {
            loadContent(dataType, "");
        }
    }
    
    document.querySelector(".search-inp").addEventListener("keypress", (event) => {
        if (event.key === "Enter") {
            const value = document.querySelector(".search-inp").value;
            loadContent("search", getData(`search/?keyword=${value}`), value);
        }
    })
});

export { disableAll, allowAll, hideLoad, showLoad };
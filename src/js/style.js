import { generateData, generateAbout, generateGenres, generateInfo, generateStream, generateGenresM, generateSearch, generateComplete } from './module.js';
import { getData } from './controls.js';

const navItems = document.querySelectorAll(".navbar-bottom .nav-content ul li a");
const loader = document.querySelector(".load");

/* hashchange */
window.addEventListener("hashchange", () => {
    const url = new URL(window.location.href);
    loadHash(url)
});


const loadHash = (url) => {
    const dataType = getDataFromHash(url.hash);
    if (["info", "stream"].includes(dataType)) {
        loadContent(dataType, getData(`${dataType === "stream" ? "view" : dataType}/?data=${getParamFromHash(url.hash)}`));
    } else if (dataType === "genres_m") {
        const param = getParamFromHash(url.hash);
        loadContent(dataType, getData(`genres/${param}`), param)
    } else if(!dataType || ["home", "ongoing"].includes(dataType) || !window.location.hash) {
        const hash = !dataType ? "home" : dataType;
        loadContent(hash, getData(hash))
    } else if (dataType === "complete") {
        loadContent(dataType, getData("complete"))
    }
}

/* load content */
function loadContent(dataType, data, x=null) {
    removeChildAll();
    if (["home", "ongoing"].includes(dataType)) {
        generateData(data, dataType);
    } else if(dataType === "complete") {
        generateComplete(data)
    } else if (dataType === "about") {
        generateAbout();
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

/* remove chill & absolute position */
function removeChildAll() {
    const absoluteItem = document.querySelectorAll(".data-anime, .genres, .genres_m, .search")
    absoluteItem.forEach(abs => {
        abs.style.position = "absolute";
    })
    const elements = document.querySelectorAll(".content .slider .title, .content .data-anime .anime, .content .about .text-about, .content .genres div, .content .info div, .content .stream div, .content .genres_m div, .content .genres_m h2, .content .search div, .content .search h2, .content .btn-next, .content .btn-next-genre");
    elements.forEach(element => {
        element.parentNode.removeChild(element);
    });
}

/* set avtive nav-bottom item */
function setActiveNavItem(dataType) {
    navItems.forEach(navItem => {
        navItem.classList.remove("active");
        if (navItem.getAttribute("id") === dataType) {
            navItem.classList.add("active");
        }
    });
}

/* get hash */
function getDataFromHash(hash) {
    const regex = hash.match(/(\w+)/i);
    return dataMap[regex !== null ? "#" + regex[0] : ""];
}

/* get value from param data */
function getParamFromHash(hash) {
    const param = hash.match(/\w+\?data=(.*)/i);
    return param[1];
}

/* disable nav-bottom item */
function disableAll() {
    navItems.forEach(item => {
        item.style.pointerEvents = "none";
    });
}

/* allow nav-bottom item */
function allowAll() {
    navItems.forEach(item => {
        item.style.pointerEvents = "auto";
    });
}

/* show load animation */
function showLoad() {
    document.body.classList.add("loader-open");
    loader.style.visibility = "visible"
    document.querySelector("footer").style.marginTop = "100vh";
}

/* hidde load animation */
function hideLoad() {
    document.body.classList.remove("loader-open");
    loader.style.visibility = "hidden";
    document.querySelector("footer").style.marginTop = "100px";
}

/* data hash */
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

/* nav-bottom item click */
navItems.forEach(item => {
    item.addEventListener("click", () => {
        const url = new URL(item.href);
        const dataType = dataMap[url.hash];
        loadContent(dataType, !["about", "complete", "ongoing", "home"].includes(dataType) ? getData(dataType) : "");
    });
});

/* ContentLoaded */
document.addEventListener("DOMContentLoaded", () => {
    if(!window.location.hash) {
        loadContent("home", getData("home"));
    } else {
        const url = new URL(window.location.href);
        loadHash(url)
    }
    
    const search = document.querySelector(".fa-search");
    const close = document.querySelector(".fa-times");
    const inp = document.querySelector(".nav-content input");
    
    function toggleSearch(action) {
        const isSearch = action === "search";
        search.classList.toggle("hidden", isSearch);
        close.classList.toggle("visible", isSearch);
        inp.classList.toggle("open", isSearch);

        if (isSearch) {
            inp.style.visibility = "visible";
            close.style.visibility = "visible";
            setTimeout(() => {
                search.style.visibility = "hidden";
            }, 300);
        } else {
            search.style.visibility = "visible";
            setTimeout(() => {
                inp.style.visibility = "hidden";
                close.style.visibility = "hidden";
            }, 300);
        }
    }

    search.addEventListener("click", () => toggleSearch("search"));
    close.addEventListener("click", () => toggleSearch("close"));
    
    document.querySelector(".search-inp").addEventListener("keypress", (event) => {
        if (event.key === "Enter") {
            const value = document.querySelector(".search-inp").value;
            loadContent("search", getData(`search/?keyword=${value}`), value);
        }
    })
});

export { disableAll, allowAll, hideLoad, showLoad };
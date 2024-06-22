import { getData } from './controls.js';


const changeTitle = (newTitle) => {
    document.title = `Nonton Anime - ${newTitle}`;
};

const changeIcon = (href) => {
    const icon = document.querySelector("#kanime-icon");
    icon.href = href;
};

const parentElement = document.querySelector(".content");

const elements = {
  slider: null,
  genres: null,
  genres_m: null,
  content: null,
  about: null,
  information: null,
  stream: null,
  search: null,
  danime: null
};

const createElement = (tag, className, innerHTML) => {
    const element = document.createElement(tag);
    if (className) element.className = className;
    if (innerHTML) element.innerHTML = innerHTML;
    return element;
};

const appendText = (parent, text) => {
    const textNode = document.createTextNode(text);
    parent.appendChild(textNode);
};

const handleNextButton = (button, content, next, location, dataFn) => {
    button.addEventListener("click", () => {
        document.body.classList.add("loader-open");
        content.removeChild(button);
        if (location === "ongoing") dataFn(getData(`ongoing/?next=${next}`), location);
        else if (location === "complete") dataFn(getData(`complete/?next=${next}`));
        else dataFn(getData(`genres/${location}/${next}`), location);
    });
};

const createAndAppendElement = (parent, tag, className, innerHTML) => {
    const element = createElement(tag, className, innerHTML);
    parent.appendChild(element);
    return element;
};

/* generate genres content */
async function generateGenres(data) {
    if (!elements.genres) {
        elements.genres = createAndAppendElement(document.querySelector(".content"), "div", "genres");
    }
    elements.genres.style.position = "relative";
    const d = await data;
    d.data.forEach(dat => {
        const genre = createElement("div", null, `<p><a href="#genres_m?data=${dat.data}">${dat.name}</a></p>`);
        elements.genres.appendChild(genre);
    });
}

/* generate about content */
async function generateAbout() {
    if (!elements.about) {
        elements.about = createAndAppendElement(document.querySelector(".content"), "div", "about");
    }
    const text_about = createElement("p", "text-about");
    appendText(text_about, "KANIME adalah sebuah Web / Aplikasi untuk streaming Anime Gratis dan tanpa Iklan. Di buat oleh Latif Harkat (Latip176).");
    elements.about.appendChild(text_about);
}

/* generate complete anime content (coming soon) */
async function generateComplete(data) {
    if (!elements.danime && !elements.slider) {
        elements.slider = createAndAppendElement(document.querySelector(".content"), "div", "slider");
        elements.danime = createAndAppendElement(document.querySelector(".content"), "div", "data-anime");
    }
    elements.danime.style.position = "relative";
    document.body.classList.remove("loader-open");
    const dd = await data;
    const dataList = dd.data.data_anime;
    dataList.forEach(dat => {
        const slide = createElement("div", "title", `<img src="${dat.cover}" alt="${dat.judul}"><p class="judul"><a href="#info?data=${dat.data}" style="color: white; text-decoration: none;">${dat.judul}</a></p>`);
        elements.slider.appendChild(slide);

        const anime = createElement("div", "anime", `<div class="cover"><img src="${dat.cover}" alt="${dat.judul}"><p id="release">${dat.release}</p><p id="episode">${dat.episode}</p></div><p class="judul"><a href="#info?data=${dat.data}">${dat.judul}</a></p>`);
        elements.danime.appendChild(anime);
    });

    if (dd.data.next !== "None") {
        const button = createElement("div", "btn-next", `<a href="javascript:void(0)" style="color: white; text-decoration: none; font-weight: bold;">Show More <i class="fas fa-arrow-down"></i></a>`);
        elements.danime.appendChild(button);
        handleNextButton(button, elements.danime, dd.data.next, "complete", generateComplete);
    }
}

/* generate home and ongoing anime content */
async function generateData(data, location) {
    if (!elements.danime && !elements.slider) {
        elements.slider = createAndAppendElement(document.querySelector(".content"), "div", "slider");
        elements.danime = createAndAppendElement(document.querySelector(".content"), "div", "data-anime");
    }
    elements.danime.style.position = "relative";
    document.body.classList.remove("loader-open");
    const dd = await data;
    const dataList = !dd.data.data_anime ? dd.data : dd.data.data_anime;
    dataList.forEach(dat => {
        const slide = createElement("div", "title", `<img src="${dat.cover}" alt="${dat.judul}"><p class="judul"><a href="#info?data=${dat.data}" style="color: white; text-decoration: none;">${dat.judul}</a></p>`);
        elements.slider.appendChild(slide);

        const anime = createElement("div", "anime", `<div class="cover"><img src="${dat.cover}" alt="${dat.judul}"><p id="release">${dat.release}</p><p id="episode">${dat.episode}</p></div><p class="judul"><a href="#info?data=${dat.data}">${dat.judul}</a></p>`);
        elements.danime.appendChild(anime);
    });

    if (location === "ongoing" && dd.data.next !== "None") {
        const button = createElement("div", "btn-next", `<a href="javascript:void(0)" style="color: white; text-decoration: none; font-weight: bold;">Show More <i class="fas fa-arrow-down"></i></a>`);
        elements.danime.appendChild(button);
        handleNextButton(button, elements.danime, dd.data.next, "ongoing", generateData);
    }
}

/* generate info anime content */
async function generateInfo(data) {
    if (!elements.information) {
        elements.information = createAndAppendElement(document.querySelector(".content"), "div", "info");
    }
    const d = await data;
    const dat = d.data;
    
    changeTitle(dat.judul);
    changeIcon(dat.cover);

    const cover = createElement("div", "cover", `<img id="cover" src="${dat.cover}" alt="${dat.judul}"><img id="bg" src="${dat.cover}" alt="${dat.judul}">`);
    const info = createElement("div", "info", `
        <h2 class="judul" align="center">${dat.judul}</h2>
        <div class="studio"><span>Judul Jepang</span><span>${dat.japanese}</span></div>
        <div class="studio"><span>Studio</span><span>${dat.studio}</span></div>
        <div class="genre"><span>Genre</span><span>${dat.genre}</span></div>
        <div class="durasi"><span>Durasi</span><span>${dat.durasi}</span></div>
        <div class="tipe"><span>Tipe </span><span>${dat.tipe}</span></div>
        <div class="score"><span>Score </span><span>${dat.skor} / 10 ⭐</span></div>
        <div class="status"><span>Status </span><span>${dat.status}</span></div>
        <div class="release"><span>Tanggal Rilis </span><span>${dat.tanggal_rilis}</span></div>
        <div class="totalepsd"><span>Total Episode </span><span>${dat.total_episode}</span></div>
    `);
    const sinopsis = createElement("div", "sinopsis", `<div class="content"><h3>${dat.sinopsis === "" ? "Information" : "Sinopsis"}</h3><hr><p>${dat.sinopsis !== "" ? dat.sinopsis : `Streaming Anime ${dat.judul} - Subtitle Indonesia Gratis!`}</p></div>`);
    const data_episode = createElement("div", "data-episode", `<h3>List Episode</h3><hr>`);

    const depisode = createElement("div", "content");
    dat.data_episode.forEach(i => {
        const episode = createElement("div", null, `<a href="#stream?data=${i.data}">${i.judul_episode}</a>`);
        depisode.appendChild(episode);
    });
    data_episode.appendChild(depisode);

    elements.information.append(cover, info, sinopsis, data_episode);
}

/* generate stream content */
async function generateStream(data) {
    if (!elements.stream) {
        elements.stream = createAndAppendElement(document.querySelector(".content"), "div", "stream");
    }
    const d = await data;
    const dat = d.data;
    
    changeTitle(dat.judul_episode);

    const iframe = createElement("div", "iframe", `<iframe src="${dat.stream}" frameborder="0" allowfullscreen></iframe>`);
    const content = createElement("div", "content", `<h3>${dat.judul_episode}</h3>`);
    const button = createElement("div", "button", `
        ${dat.prev !== "None" ? `<a href="#stream?data=${dat.prev}"><i class="fas fa-arrow-left"></i> Episode Sebelumnya</a>` : ""}
        ${dat.next !== "None" ? `<a href="#stream?data=${dat.next}">Episode Selanjutnya <i class="fas fa-arrow-right"></i></a>` : ""}
    `);

    elements.stream.append(iframe, content, button);
}

/* generate genres_m content */
async function generateGenresM(data, genre) {
    if (!elements.genres_m) {
        elements.genres_m = createAndAppendElement(document.querySelector(".content"), "div", "genres_m");
    }
    elements.genres_m.style.position = "relative";
    document.body.classList.remove("loader-open");
    const d = await data;
    const dd = d.data;
    const genre_title = createElement("h2", "genre-title");
    appendText(genre_title, `Genre ${genre}`);
    const list_anime = createElement("div", "list-anime");

    dd.data.forEach(dat => {
        const anime = createElement("div", "anime", `
            <div class="cover"><img src="${dat.cover}" alt="${dat.judul}"></div>
            <div class="content"><h3><a href="#info?data=${dat.data}">${dat.judul}</a></h3><p>Studio: <span>${dat.studio}</span></p><p>Genre: <span>${dat.genre}</span></p><p>Total Episode: <span>${dat.total_episode}</span></p></div>
        `);
        list_anime.appendChild(anime);
    });

    elements.genres_m.append(genre_title, list_anime);

    if (dd.next !== "None") {
        const btn = createElement("div", "btn-next-genre", `<a href="javascript:void(0)" style="color: white; text-decoration: none; font-weight: bold;">Show More <i class="fas fa-arrow-down"></i></a>`);
        btn.style.marginTop = "10px";
        elements.genres_m.appendChild(btn);
        handleNextButton(btn, elements.genres_m, dd.next, genre, generateGenresM);
    }
}

/* generate search content */
async function generateSearch(data, searchA) {
    if (!elements.search) {
        elements.search = createAndAppendElement(document.querySelector(".content"), "div", "search");
    }
    elements.search.style.position = "relative";
    const d = await data;
    const search_title = createElement("h2", "search-title");
    appendText(search_title, `Search ${searchA}`);
    const list_anime = createElement("div", "list-anime");

    d.data.data.forEach(dd => {
        const anime = createElement("div", "anime", `
            <div class="cover"><img src="${dd.cover}" alt="${dd.judul}"></div>
            <div class="content"><h3><a href="#info?data=${dd.data}">${dd.judul}</a></h3><p>Genre: <span>${dd.genres}</span></p><p>Rating: <span>${dd.rating !== "" ? dd.rating : "unknown"} / 10 ⭐</span></p><p>Status: <span>${dd.status}</span></p></div>
        `);
        list_anime.appendChild(anime);
    });

    elements.search.append(search_title, list_anime);
}

export {
    generateAbout,
    generateData,
    generateInfo,
    generateGenres,
    generateStream,
    generateGenresM,
    generateSearch,
    generateComplete,
};
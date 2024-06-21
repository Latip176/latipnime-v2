import { getData } from './controls.js';

const changeTitle = (newTitle) => {
    document.title = `Nonton Anime - ${newTitle}`
}
const changeIcon = (href) => {
    const icon = document.querySelector("#kanime-icon")
    icon.href = href
}

const elements = {
  slider: document.querySelector(".slider"),
  content: document.querySelector(".content .data-anime"),
  genres: document.querySelector(".genres"),
  genres_m: document.querySelector(".genres_m"),
  about: document.querySelector(".about"),
  information: document.querySelector(".info"),
  stream: document.querySelector(".stream"),
  search: document.querySelector(".search"),
  danime: document.querySelector(".data-anime")
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
    if(location === "ongoing") dataFn(getData(`ongoing/?next=${next}`), location);
    else dataFn(getData(`genres/${location}/${next}`), location)
  });
};

/* generate genres content */
function generateGenres(data) {
  elements.genres.style.position = "relative";
  data.then(d => {
    d.data.forEach(dat => {
      const genre = createElement("div", null, `<p><a href="#genres_m?data=${dat.data}">${dat.name}</a></p>`);
      elements.genres.appendChild(genre);
    });
  });
}

/* generate about content */
function generateAbout() {
  const text_about = createElement("p", "text-about");
  appendText(text_about, "LatipNime adalah sebuah Web / Aplikasi untuk streaming Anime Gratis dan tanpa Iklan. Di buat oleh Latif Harkat (Latip176). Hubungi 083870396203 (WhatsApp) jika anda menemukan sebuah Bug atau Error");
  elements.about.appendChild(text_about);
}

/* generate complete anime content (coomingsoon) */
function generateComplete() {
  const text_about = createElement("p", "text-about");
  appendText(text_about, "COOMINGSOON");
  elements.about.appendChild(text_about);
}

/* generate home and ongoing anime content */
function generateData(data, location) {
  elements.danime.style.position = "relative";
  document.body.classList.remove("loader-open");
  data.then(dd => {
    const dataList = location === "home" ? dd.data : dd.data.data_anime;
    dataList.forEach(dat => {
      const slide = createElement("div", "title", `<img src="${dat.cover}" alt="${dat.judul}"><p class="judul"><a href="#info?data=${dat.data}" style="color: white; text-decoration: none;">${dat.judul}</a></p>`);
      elements.slider.appendChild(slide);

      const anime = createElement("div", "anime", `<div class="cover"><img src="${dat.cover}" alt="${dat.judul}"><p id="release">${dat.release}</p><p id="episode">${dat.episode}</p></div><p class="judul"><a href="#info?data=${dat.data}">${dat.judul}</a></p>`);
      elements.content.appendChild(anime);
    });

    if (location === "ongoing" && dd.data.next !== "None") {
      const button = createElement("div", "btn-next", `<a href="javascript:void(0)" style="color: white; text-decoration: none; font-weight: bold;">Show Mores <i class="fas fa-arrow-down"></i></a>`);
      elements.content.appendChild(button);
      handleNextButton(button, elements.content, dd.data.next, "ongoing", generateData);
    }
  });
}

/* generate info anime content */
function generateInfo(data) {
  data.then(d => {
    const dat = d.data;
    
    changeTitle(dat.judul)
    changeIcon(dat.cover)

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
      <div class="realese"><span>Tanggal Rilis </span><span>${dat.tanggal_rilis}</span></div>
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
  });
}

/* generate stream content */
function generateStream(data) {
  data.then(d => {
    const dat = d.data;
    
    changeTitle(dat.judul_episode)
    
    const iframe = createElement("div", "iframe", `<iframe src="${dat.stream}" frameborder="0" allowfullscreen></iframe>`);
    const content = createElement("div", "content", `<h3>${dat.judul_episode}</h3>`);
    const button = createElement("div", "button", `
      ${dat.prev !== "None" ? `<a href="#stream?data=${dat.prev}"><i class="fas fa-arrow-left"></i> Episode Sebelumnya</a>` : ""}
      ${dat.next !== "None" ? `<a href="#stream?data=${dat.next}">Episode Selanjutnya <i class="fas fa-arrow-right"></i></a>` : ""}
    `);

    elements.stream.append(iframe, content, button);
  });
}

/* generate genres_m content */
function generateGenresM(data, genre) {
  elements.genres_m.style.position = "relative";
  document.body.classList.remove("loader-open");
  data.then(d => {
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
      const btn = createElement("div", "btn-next-genre", `<a href="javascript:void(0)" style="color: white; text-decoration: none; font-weight: bold;">Show Mores <i class="fas fa-arrow-down"></i></a>`);
      btn.style.marginTop = "10px";
      elements.genres_m.appendChild(btn);
      handleNextButton(btn, elements.genres_m, dd.next, genre, generateGenresM);
    }
  });
}

/* generate search content */
function generateSearch(data, searchA) {
  elements.search.style.position = "relative";
  data.then(d => {
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
  });
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
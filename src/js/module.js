import { getData } from './controls.js';

const slider = document.querySelector(".slider");
const content = document.querySelector(".content .data-anime");
const genres = document.querySelector(".genres");
const genres_m = document.querySelector(".genres_m");
const about = document.querySelector(".about");
const information = document.querySelector(".info");
const stream = document.querySelector(".stream");
const search = document.querySelector(".search");
const danime = document.querySelector(".data-anime");

function generateGenres(data) {
    genres.style.position = "relative";
    data.then(d => {
        d.data.forEach(dat => {
            const genre = document.createElement("div");
            genre.innerHTML = `
            <p><a href="#genres_m?data=${dat.data}">${dat.name}</a></p>
            `;
            genres.appendChild(genre);
        })
    })
}

function generateAbout() {
    const text_about = document.createElement("p")
    text_about.className = "text-about";
    const text = document.createTextNode("LatipNime adalah sebuah Web / Aplikasi untuk streaming Anime Gratis dan tanpa Iklan. Di buat oleh Latif Harkat (Latip176). Hubungi 083870396203 (WhatsApp) jika anda menemukan sebuah Bug atau Error");
    text_about.appendChild(text);
    
    about.appendChild(text_about);
}
function generateComplete() {
    const text_about = document.createElement("p")
    text_about.className = "text-about";
    const text = document.createTextNode("COOMINGSOON");
    text_about.appendChild(text);
    
    about.appendChild(text_about);
}

function generateData(data, location) {
    danime.style.position = "relative";
    document.body.classList.remove(".loader-open");
    data.then((dd) => {
        const dataList = location === "home" ? dd.data : dd.data.data_anime;
        dataList.forEach((dat) => {
            const slide = document.createElement("div");
            slide.className = "title";
            slide.innerHTML = `
                <img src="${dat.cover}" alt="${dat.judul}">
                <p class="judul">${dat.judul}</p>
            `;
            slider.appendChild(slide);
            
            const anime = document.createElement("div");
            anime.className = "anime";
            anime.innerHTML = `
                <div class="cover">
                    <img src="${dat.cover}" alt="${dat.judul}">
                    <p id="release">${dat.release}</p>
                    <p id="episode">${dat.episode}</p>
                </div>
                <p class="judul"><a href="#info?data=${dat.data}">${dat.judul}</a></p>
            `;
            content.appendChild(anime);
        });
        
        if(location === "ongoing" && dd.data.next !== "None") {
            const button = document.createElement("div");
            button.className = "btn-next";
            button.innerHTML = `
                <a href="javascript:void(0)" style="color: white; text-decoration: none; font-weight: bold;">Next <i class="fas fa-arrow-right"></i></a>
            `
            content.appendChild(button);
            button.addEventListener("click", function() {
                document.body.classList.add(".loader-open");
                content.removeChild(button);
                generateData(getData("ongoing/?next=" + dd.data.next), "ongoing")
            })
        }
    });
}

function generateInfo(data) {
    data.then(d => {
        const dat = d['data'];
        
        const cover = document.createElement("div"),
              info = document.createElement("div"),
              sinopsis = document.createElement("div"),
              data_episode = document.createElement("div");
        cover.className = "cover";
        info.className = "info";
        sinopsis.className = "sinopsis";
        data_episode.className = "data-episode";
        
        // cover
        cover.innerHTML = `
            <img id="cover" src="${dat.cover}" alt="${dat.judul}">
            <img id="bg" src="${dat.cover}" alt="${dat.judul}">
        `;
        // info
        info.innerHTML = `
            <h2 class="judul" align="center">${dat.judul}</h2>
            <div class="studio">
                <span>Judul Jepang</span>
                <span>${dat.japanese}</span>
            </div>
            <div class="studio">
                <span>Studio</span>
                <span>${dat.studio}</span>
            </div>
            <div class="genre">
                <span>Genre</span>
                <span>${dat.genre}</span>
            </div>
            <div class="durasi">
                <span>Durasi</span>
                <span>${dat.durasi}</span>
            </div>
            <div class="tipe">
                <span>Tipe </span>
                <span>${dat.tipe}</span>
            </div>
            <div class="score">
                <span>Score </span>
                <span>${dat.skor} / 10 ⭐</span>
            </div>
            <div class="status">
                <span>Status </span>
                <span>${dat['status']}</span>
            </div>
            <div class="realese">
                <span>Tanggal Rilis </span>
                <span>${dat.tanggal_rilis}</span>
            </div>
            <div class="totalepsd">
                <span>Total Episode </span>
                <span>${dat.total_episode}</span>
            </div>
        `
        // sinopsis
        sinopsis.innerHTML = `
            <div class="content">
                <h3>${dat.sinopsis === "" ? "Information" : "Sinopsis"}</h3>
                <hr>
                <p>${dat.sinopsis !== "" ? dat.sinopsis : "Streaming Anime " + dat.judul + " - Subtitle Indonesia Gratis!"}</p>
            </div>
        `;
        // data_episode
        data_episode.innerHTML = `
            <h3>List Episode</h3>
            <hr>
        `;
        const depisode = document.createElement("div")
        depisode.className = "content";
        data_episode.appendChild(depisode);
        dat['data_episode'].forEach((i) => {
            const episode = document.createElement("div");
            episode.innerHTML = `
                <a href="#stream?data=${i.data}">${i.judul_episode}</a>
            `;
            depisode.appendChild(episode);
        })
        
        // append all
        information.appendChild(cover)
        information.appendChild(info)
        information.appendChild(sinopsis)
        information.appendChild(data_episode)
    })
}

function generateStream(data) {
    data.then((d) => {
        const iframe = document.createElement("div"),
              content = document.createElement("div"),
              button = document.createElement("div");
        iframe.className = "iframe"
        content.className = "content"
        button.className = "button"
        const dat = d.data;
        
        iframe.innerHTML = `
            <iframe src="${dat.stream}" frameborder="0" allowfullscreen></iframe>
        `;
        content.innerHTML = `
            <h3>${dat.judul_episode}</h3>
        `;
        button.innerHTML = `
            ${dat.prev !== "None" ? `<a href="#stream?data=${dat.prev}"><i class="fas fa-arrow-left"></i> Episode Sebelumnya</a>` : ""}
            ${dat.next !== "None" ? `<a href="#stream?data=${dat.next}">Episode Selanjutnya <i class="fas fa-arrow-right"></i></a>` : ""}
        `;
        
        // append all
        stream.appendChild(iframe)
        stream.appendChild(content)
        stream.appendChild(button)
    })
}

function generateGenresM(data, genre) {
    genres_m.style.position = "relative";
    document.body.classList.remove(".loader-open");
    data.then(d => {
        const dd = d.data;
        const genre_title = document.createElement("h2"),
              list_anime = document.createElement("div");
        genre_title.className = "genre-title";
        const text = document.createTextNode(`Genre ${genre}`);
        genre_title.appendChild(text);
        list_anime.className = "list-anime";
        dd.data.forEach((dat) => {
            const anime = document.createElement("div");
            anime.className = "anime";
            anime.innerHTML = `
                <div class="cover">
                    <img src="${dat.cover}" alt="${dat.judul}">
                </div>
                <div class="content">
                    <h3><a href="#info?data=${dat.data}">${dat.judul}</a></h3>
                    <p>Studio: <span>${dat.studio}</span></p>
                    <p>Genre: <span>${dat.genre}</span></p>
                    <p>Total Episode: <span>${dat.total_episode}</span></p>
                </div>
            `
            list_anime.appendChild(anime);
        });
        
        
        // append all
        genres_m.appendChild(genre_title)
        genres_m.appendChild(list_anime)
        
        if(dd.next !== "None") {
            const btn = document.createElement("div");
            btn.style.marginTop = "10px";
            btn.className = "btn-next-genre";
            btn.innerHTML = `
                <a href="javascript:void(0)" style="color: white; text-decoration: none; font-weight: bold;">Next <i class="fas fa-arrow-right"></i></a>
            `
            genres_m.appendChild(btn);
            btn.addEventListener("click", function() {
                document.body.classList.add(".loader-open");
                genres_m.removeChild(btn);
                generateGenresM(getData(`genres/${genre}/${dd.next}`), genre)
            })
        }
    })
}

function generateSearch(data, searchA) {
    search.style.position = "relative";
    data.then((d) => {
        const search_title = document.createElement("h2"),
              list_anime = document.createElement("div");
        search_title.className = "search-title";
        const text = document.createTextNode(`Search ${searchA}`);
        search_title.appendChild(text);
        list_anime.className = "list-anime";
        const dat = d.data;
        dat.data.forEach((dd) => {
            const anime = document.createElement("div");
            anime.className = "anime";
            anime.innerHTML = `
                <div class="cover">
                    <img src="${dd.cover}" alt="${dd.judul}">
                </div>
                <div class="content">
                    <h3><a href="#info?data=${dd.data}">${dd.judul}</a></h3>
                    <p>Genre: <span>${dd.genres}</span></p>
                    <p>Rating: <span>${dd.rating !== "" ? dd.rating : "unkown"} / 10 ⭐</span></p>
                    <p>Status: <span>${dd['status']}</span></p>
                </div>
            `
            list_anime.appendChild(anime);
        })
        
        // append all
        search.appendChild(search_title)
        search.appendChild(list_anime)
    })
}

export { generateAbout, generateData, generateInfo, generateGenres, generateStream, generateGenresM, generateSearch, generateComplete };
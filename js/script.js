const api_key = "api_key=79bc46a7ed0601522a9c3955e5f63390";
const language = "&language=en-US"
const page = "&page=";
const page_start = "1";
const url_base = "https://api.themoviedb.org/3/movie/popular?" + api_key + language + page;
const img_url = "https://image.tmdb.org/t/p/w500";
const search_url = "https://api.themoviedb.org/3/search/movie?" + api_key + "&query="
const genre_ids_collection = [
    {"id":28,"name":"Action","color":"tomato"},
    {"id":12,"name":"Adventure","color":"turquoise"},
    {"id":16,"name":"Animation","color":"dodgerblue"},
    {"id":35,"name":"Comedy","color":"palevioletred"},
    {"id":80,"name":"Crime","color":"chocolate"},
    {"id":99,"name":"Documentary","color":"rosybrown"},
    {"id":18,"name":"Drama","color":"cadetblue"},
    {"id":10751,"name":"Family","color":"darkgray "},
    {"id":14,"name":"Fantasy","color":"gold "},
    {"id":36,"name":"History","color":"tan"},
    {"id":27,"name":"Horror","color":"teal"},
    {"id":10402,"name":"Music","color":"violet"},
    {"id":9648,"name":"Mystery","color":"wheat"},
    {"id":10749,"name":"Romance","color":"salmon"},
    {"id":878,"name":"Science Fiction","color":"plum"},
    {"id":10770,"name":"TV Movie","color":"pink"},
    {"id":53,"name":"Thriller","color":"palevioletred"},
    {"id":10752,"name":"War","color":"purple"},
    {"id":37,"name":"Western","color":"sandybrown"}
];


let currentPage = null;
let nextPage = null;
let prePage = null;
let totalPages = null;

const movie_list = document.getElementById("movie-list");
const pagination_curr = document.getElementById("pagination-curr");
const pagination_pre = document.getElementById("pagination-pre");
const pagination_next = document.getElementById("pagination-next");
const movie_detail = document.getElementById("movie-detail");
const search_form = document.getElementById("search-form");
const search_input = document.getElementById("search-input");


pagination_next.addEventListener("click", () => {
    getMovies(url_base + nextPage);
    document.getElementById("header-popular").scrollIntoView();
})

pagination_pre.addEventListener("click", () => {
    getMovies(url_base + prePage);
    document.getElementById("header-popular").scrollIntoView();
})


/* fetch() return a promise that contains
   the entire http response.
   json() returns a promise that parses
   json response into js object
*/
function getMovies(url) {
    fetch(url)
    .then(res => res.json())
    .then(data => {
        // console.log(data);
        totalPages = data.total_pages;
        if (data.results.length !== 0) {
            showMovies(data.results)
            currentPage = data.page;
            pagination(currentPage);
        }
    })
}


function showMovies(results) {
    movie_list.innerHTML = ""; 
    results.forEach(result => {
        const index = results.indexOf(result);
        const {title, poster_path} = result;
        const movie = document.createElement("div");
        movie.classList.add("movie");   
            const movie_img = document.createElement("img");
            movie_img.classList.add("movie-image");
            movie_img.src = img_url + poster_path;
            movie_img.alt = title;
            movie.appendChild(movie_img);

            const movie_title = document.createElement("h3");
            movie_title.classList.add("movie-title");
            movie_title.innerText = title;
            movie.appendChild(movie_title);  

        movie_list.appendChild(movie);

        movie_img.addEventListener("click", () => {
            movieDetails(results[index]);
        })
    })
}

function pagination(currentPage) {
    prePage = currentPage - 1;
    nextPage = currentPage + 1;
    pagination_curr.innerText = currentPage;

    if (currentPage <= 1) {
        pagination_pre.disabled = true;
        pagination_next.disabled = false;
    } else if (currentPage >= totalPages) {
        pagination_pre.disabled = false;
        pagination_next.disabled = true;
    } else {
        pagination_pre.disabled = false;
        pagination_next.disabled = false;
    }
}


function movieDetails (movie) {
    movie_detail.innerHTML = "";
    movie_detail.style.display = "block";

    const {title, poster_path, vote_average, overview, genre_ids} = movie;
    const background_img_url = img_url + poster_path;
        // set backgroud image
        const background_img_div = document.createElement("div");
        background_img_div.classList.add("background-image");
        background_img_div.style.backgroundImage = "url(" + background_img_url + ")"; 
        movie_detail.appendChild(background_img_div);
        // container 'content_div': left-right parts(flex)
        const content_div = document.createElement("div");
        content_div.classList.add("content_div");
            // left part: img
            const movie_detail_img = document.createElement("img");
            movie_detail_img.src = background_img_url;
            movie_detail_img.alt = title;
            content_div.appendChild(movie_detail_img);
            // right part: title(h2), vote-arerage(h3), genre(div), overview(p)
            const movie_detail_content = document.createElement("div");
            movie_detail_content.classList.add("movie-detail-content");
                const movie_detail_title = document.createElement("h2");
                movie_detail_title.innerText = title;
                movie_detail_content.appendChild(movie_detail_title);

                const movie_detail_vote = document.createElement("h3");
                movie_detail_vote.innerText = vote_average;
                movie_detail_content.appendChild(movie_detail_vote);

                const movie_detail_genre_ids = document.createElement("div")
                movie_detail_genre_ids.classList.add("movie-detail-genre-ids");
                const [genre_name, genre_color] = getGenreNames(genre_ids);
                setGenreNames(genre_name, genre_color, movie_detail_genre_ids);
                movie_detail_content.appendChild(movie_detail_genre_ids);

                const movie_detail_overview = document.createElement("p");
                movie_detail_overview.innerText = overview;
                movie_detail_content.appendChild(movie_detail_overview);
            content_div.appendChild(movie_detail_content);
        movie_detail.appendChild(content_div);

        // close button
        const close_btn = document.createElement("button");
        close_btn.classList.add("close-btn");
        close_btn.innerHTML = "<i class='fa-solid fa-x'></i>";
        close_btn.addEventListener("click", () => {
            movie_detail.style.display = "none";
        })
        movie_detail.appendChild(close_btn);
}



function getGenreNames(genre_ids) {
    const genre_name = [];
    const genre_color = [];
    for (let i = 0; i < genre_ids_collection.length; i++) {
        for (let j = 0; j < genre_ids.length; j++) {
            if (genre_ids_collection[i].id === genre_ids[j]) {
                genre_name.push(genre_ids_collection[i].name);
                genre_color.push(genre_ids_collection[i].color);
            }
        }
    }
    return [genre_name, genre_color];
}

function setGenreNames(genre_name, genre_color, genre) {
    for (let i = 0; i < genre_name.length; i++) {
        const tag = document.createElement("span");
        tag.innerText = genre_name[i];
        tag.style.backgroundColor = genre_color[i];
        genre.appendChild(tag);
    }
}


getMovies(url_base + page_start);


search_form.addEventListener("submit", (event) => {
    event.preventDefault();
    if (search_input.value) {
        getMovies(search_url + search_input.value);
        search_input.value = "";
    }
})
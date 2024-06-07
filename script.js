const API_KEY = "d40b8c6eaa7a4db4b7b1f6a1c49c747c";
const url = "https://newsapi.org/v2/";
let currentQuery = "India";
let page = 1;

window.addEventListener("load", () => fetchNews(currentQuery));

function reload() {
    window.location.reload();
}

async function fetchNews(query, isLoadMore = false) {
    const res = await fetch(`${url}everything?q=${query}&apiKey=${API_KEY}&page=${page}`);
    const data = await res.json();
    bindData(data.articles, isLoadMore);
}

async function fetchTopHeadlines() {
    const res = await fetch(`${url}top-headlines?country=in&apiKey=${API_KEY}&page=${page}`);
    const data = await res.json();
    bindData(data.articles);
}

function bindData(articles, isLoadMore = false) {
    const cardsContainer = document.getElementById("cards-container");
    const newsCardTemplate = document.getElementById("template-news-card");

    if (!isLoadMore) {
        cardsContainer.innerHTML = "";
    }

    articles.forEach((article) => {
        if (!article.urlToImage) return;
        const cardClone = newsCardTemplate.content.cloneNode(true);
        fillDataInCard(cardClone, article);
        cardsContainer.appendChild(cardClone);
    });
}

function fillDataInCard(cardClone, article) {
    const newsImg = cardClone.querySelector("#news-img");
    const newsTitle = cardClone.querySelector("#news-title");
    const newsSource = cardClone.querySelector("#news-source");
    const newsDesc = cardClone.querySelector("#news-desc");

    newsImg.src = article.urlToImage;
    newsTitle.innerHTML = article.title;
    newsDesc.innerHTML = article.description;

    const date = new Date(article.publishedAt).toLocaleString("en-US", {
        timeZone: "Asia/Jakarta",
    });

    newsSource.innerHTML = `${article.source.name} · ${date}`;

    cardClone.firstElementChild.addEventListener("click", () => {
        window.open(article.url, "_blank");
    });
}

let curSelectedNav = null;
function onNavItemClick(id) {
    page = 1;
    currentQuery = id === 'top-headlines' ? id : id;
    if (id === 'top-headlines') {
        fetchTopHeadlines();
    } else {
        fetchNews(id);
    }
    const navItem = document.getElementById(id);
    curSelectedNav?.classList.remove("active");
    curSelectedNav = navItem;
    curSelectedNav.classList.add("active");
}

const searchButton = document.getElementById("search-button");
const searchText = document.getElementById("search-text");

searchButton.addEventListener("click", () => {
    const query = searchText.value;
    if (!query) return;
    page = 1;
    currentQuery = query;
    fetchNews(query);
    curSelectedNav?.classList.remove("active");
    curSelectedNav = null;
});

const loadMoreButton = document.getElementById("load-more-button");

loadMoreButton.addEventListener("click", () => {
    page++;
    fetchNews(currentQuery, true);
});

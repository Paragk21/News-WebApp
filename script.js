const API_KEY = "d40b8c6eaa7a4db4b7b1f6a1c49c747c";
const url = "https://newsapi.org/v2/everything?q=";
const topHeadlinesUrl = "https://newsapi.org/v2/top-headlines?country=in&apiKey=" + API_KEY;

let page = 1;
let currentQuery = "India";

window.addEventListener("load", () => fetchTopHeadlines());

function reload() {
    window.location.reload();
}

async function fetchNews(query, append = false) {
    showLoadingSpinner();
    try {
        const res = await fetch(`${url}${query}&page=${page}&apiKey=${API_KEY}`);
        const data = await res.json();
        if (append) {
            appendData(data.articles);
        } else {
            bindData(data.articles);
        }
    } catch (error) {
        showErrorMessage();
    } finally {
        hideLoadingSpinner();
    }
}

async function fetchTopHeadlines() {
    showLoadingSpinner();
    try {
        const res = await fetch(topHeadlinesUrl);
        const data = await res.json();
        bindData(data.articles);
    } catch (error) {
        showErrorMessage();
    } finally {
        hideLoadingSpinner();
    }
}

function bindData(articles) {
    const cardsContainer = document.getElementById("cards-container");
    const newsCardTemplate = document.getElementById("template-news-card");

    cardsContainer.innerHTML = "";

    articles.forEach((article) => {
        if (!article.urlToImage) return;
        const cardClone = newsCardTemplate.content.cloneNode(true);
        fillDataInCard(cardClone, article);
        cardsContainer.appendChild(cardClone);
    });
}

function appendData(articles) {
    const cardsContainer = document.getElementById("cards-container");
    const newsCardTemplate = document.getElementById("template-news-card");

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

    const favoriteButton = cardClone.querySelector(".favorite-button");
    favoriteButton.addEventListener("click", () => {
        addToFavorites(article);
    });

    const shareButton = cardClone.querySelector(".share-button");
    shareButton.addEventListener("click", () => {
        shareArticle(article.url);
    });
}

let curSelectedNav = null;
function onNavItemClick(id) {
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

const darkModeToggle = document.getElementById("dark-mode-toggle");

darkModeToggle.addEventListener("change", () => {
    document.body.classList.toggle("dark-mode");
});

function addToFavorites(article) {
    let favorites = JSON.parse(localStorage.getItem("favorites")) || [];
    favorites.push(article);
    localStorage.setItem("favorites", JSON.stringify(favorites));
    alert("Article added to favorites!");
}

function shareArticle(url) {
    if (navigator.share) {
        navigator.share({
            title: "Check out this article!",
            url: url,
        });
    } else {
        alert("Sharing not supported. Copy this link: " + url);
    }
}

function showLoadingSpinner() {
    document.getElementById("loading-spinner").classList.remove("hidden");
}

function hideLoadingSpinner() {
    document.getElementById("loading-spinner").classList.add("hidden");
}

function showErrorMessage() {
    document.getElementById("error-message").classList.remove("hidden");
}

function hideErrorMessage() {
    document.getElementById("error-message").classList.add("hidden");
}

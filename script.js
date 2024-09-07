const API_KEY = "1c4e3fc882cc454fb4c473e552618c26";
const url = "https://newsapi.org/v2/everything?q=";

window.addEventListener('load', () => fetchNews("India"));

function reload() {
    window.location.reload();
}

async function fetchNews(query) {
    try {
        const res = await fetch(`${url}${query}&apiKey=${API_KEY}`);
        if (!res.ok) {
            throw new Error(`Error: ${res.status}`);
        }
        const data = await res.json();
        bindData(data.articles);
    } catch (error) {
        console.error("Failed to fetch news:", error);
    }
}

function bindData(articles) {
    const cardsContainer = document.getElementById('cards_container');
    const newsCardTemplate = document.getElementById('template_news_card');

    cardsContainer.innerHTML = ''; // Clear existing cards

    articles.forEach(article => {
        if (!article.urlToImage) return; // Skip articles without an image

        const cardsClone = newsCardTemplate.content.cloneNode(true);
        fillDataInCard(cardsClone, article);
        cardsContainer.appendChild(cardsClone);
    });
}

function fillDataInCard(cardsClone, article) {
    const newsImg = cardsClone.querySelector('#news_img');
    const newsTitle = cardsClone.querySelector('#news_title');
    const newsSource = cardsClone.querySelector('#news_source');
    const newsDesc = cardsClone.querySelector('#news_desc');

    newsImg.src = article.urlToImage;
    newsTitle.innerHTML = article.title;
    newsDesc.innerHTML = article.description || 'No description available'; // Fallback text

    const date = new Date(article.publishedAt).toLocaleString("en-US", {
        timeZone: "Asia/Jakarta"
    });

    newsSource.innerHTML = `${article.source.name} - ${date}`;

    cardsClone.firstElementChild.addEventListener("click", () => {
        window.open(article.url, "_blank");
    });
}

let curSelectedNav = null;

function onNavItemClick(id) {
    fetchNews(id);

    const navItem = document.getElementById(id);

    if (curSelectedNav) {
        curSelectedNav.classList.remove('active');
    }

    curSelectedNav = navItem;
    curSelectedNav.classList.add('active');
}

const searchButton = document.getElementById("search-button");
const searchText = document.getElementById("search-text");

searchButton.addEventListener("click", () => {
    const query = searchText.value.trim(); // Trim to remove any extra spaces

    if (!query) return; // If the query is empty, exit the function

    curSelectedNav?.classList.remove("active"); // Remove 'active' class from the current selected nav item
    curSelectedNav = null; // Reset the current selected nav item

    fetchNews(query);
});

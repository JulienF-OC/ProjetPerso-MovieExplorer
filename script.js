const apiKey = "ff0a77c5";
const searchInput = document.getElementById("searchInput");
const searchButton = document.getElementById("searchButton");
const results = document.getElementById("results");

async function searchMovies() {
  const query = searchInput.value.trim();
  if (query === "") {
    results.innerHTML = "<p>Veuillez entrer un titre de film.</p>";
    return;
  }

  try {
    const response = await fetch(
      `https://www.omdbapi.com/?apikey=${apiKey}&s=${query}`
    );
    const data = await response.json();

    if (data.Response === "True") {
      results.innerHTML = "";

      data.Search.forEach((movie) => {
        const card = document.createElement("div");
        card.classList.add("movie-card");
        card.innerHTML = `
          <img src="${
            movie.Poster !== "N/A" ? movie.Poster : "placeholder.jpg"
          }" alt="${movie.Title}">
          <div class="info">
            <h3>${movie.Title}</h3>
            <p>${movie.Year}</p>
            <button data-id="${movie.imdbID}">Voir détails</button>
          </div>
        `;
        results.appendChild(card);
      });

      const detailButtons = document.querySelectorAll(".movie-card button");
      detailButtons.forEach((button) => {
        button.addEventListener("click", () => {
          const imdbID = button.getAttribute("data-id");
          showMovieDetails(imdbID);
        });
      });
    } else {
      results.innerHTML = "<p>Aucun film trouvé.</p>";
    }
  } catch (error) {
    console.error("Erreur :", error);
    results.innerHTML = "<p>Une erreur est survenue.</p>";
  }
}

async function showMovieDetails(imdbID) {
  try {
    const response = await fetch(
      `https://www.omdbapi.com/?apikey=${apiKey}&i=${imdbID}`
    );
    const movie = await response.json();

    const modal = document.createElement("div");
    modal.classList.add("modal");
    modal.innerHTML = `
      <div class="modal-content">
        <span class="close">&times;</span>
        <h2>${movie.Title} (${movie.Year})</h2>
        <img src="${movie.Poster}" alt="${movie.Title}" />
        <p><strong>Genre :</strong> ${movie.Genre}</p>
        <p><strong>Réalisateur :</strong> ${movie.Director}</p>
        <p><strong>Acteurs :</strong> ${movie.Actors}</p>
        <p><strong>Note IMDb :</strong> ${movie.imdbRating}</p>
        <p><strong>Synopsis :</strong> ${movie.Plot}</p>
      </div>
    `;
    document.body.appendChild(modal);

    const closeBtn = modal.querySelector(".close");
    closeBtn.addEventListener("click", () => modal.remove());
  } catch (error) {
    console.error("Erreur lors du chargement des détails :", error);
  }
}

searchButton.addEventListener("click", searchMovies);

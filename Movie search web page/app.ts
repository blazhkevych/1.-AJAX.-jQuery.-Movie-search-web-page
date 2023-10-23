/// <reference path="Scripts/typings/jquery/jquery.d.ts" />

// Ждем, пока весь документ загрузится
$(document).ready(function () {
    // Определим базовые параметры запроса к API OMDB
    const apiUrl = "http://www.omdbapi.com/";
    const apiKey = "e6266fda";

    // Обработчик отправки формы
    $("#search-form").submit(function (event) {
        event.preventDefault(); // Предотвратим стандартное поведение формы

        // Получим значения из формы
        const movieTitle = $("#movie-title").val() as string;
        const movieType = $("#movie-type").val() as string;

        // Очистим результаты предыдущего поиска
        $("#movies").empty();
        $("#pagination").empty();
        $("#movie-details").empty();

        // Вызовем функцию для отправки запроса к API
        searchMovies(apiUrl, apiKey, movieTitle, movieType);
    });
});

function searchMovies(apiUrl: string, apiKey: string, title: string, type: string, page: number = 1) {
    // Создаем URL для запроса
    const url = `${apiUrl}?apikey=${apiKey}&s=${title}&type=${type}&page=${page}`;

    // Отправляем AJAX-запрос к API
    $.ajax({
        url: url,
        dataType: "json",
        success: function (data) {
            // Обрабатываем результаты поиска
            if (data.Response === "True") {
                // Фильмы найдены, отобразим их
                displayMovies(data.Search);
                // Создадим пагинацию, если есть больше результатов
                if (data.totalResults > 10) {
                    createPagination(data.totalResults, page);
                }
            } else {
                // Фильмы не найдены
                $("#movies").text("Movie not found!");
            }
        },
        error: function () {
            // Ошибка при выполнении запроса
            $("#movies").text("Ошибка при выполнении запроса.");
        }
    });
}

function displayMovies(movies: any[]) {
    const moviesContainer = $("#movies");
    moviesContainer.empty();

    movies.forEach((movie, index) => {
        // Создаем элемент для отображения фильма
        const movieElement = $("<div>");
        movieElement.text(movie.Title);

        // Добавляем кнопку "Details" для подробной информации
        const detailsButton = $("<button>");
        detailsButton.text("Details");

        detailsButton.click(function () {
            // Обработчик клика на кнопке "Details"
            showMovieDetails(movie.imdbID);
        });

        // Добавляем элемент фильма и кнопку "Details" в контейнер
        moviesContainer.append(movieElement, detailsButton);
    });
}

function showMovieDetails(imdbID: string) {
    // Определим базовые параметры запроса к API OMDB
    const apiUrl = "http://www.omdbapi.com/";
    const apiKey = "e6266fda";
    // Создаем URL для запроса деталей о фильме
    const url = `${apiUrl}?apikey=${apiKey}&i=${imdbID}`;

    // Отправляем AJAX-запрос к API
    $.ajax({
        url: url,
        dataType: "json",
        success: function (data) {
            // Отобразим подробные данные о фильме
            const detailsContainer = $("#movie-details");
            detailsContainer.empty();
            detailsContainer.text("Title: " + data.Title);
            detailsContainer.append("<br>");
            detailsContainer.text("Year: " + data.Year);
            // Другие детали можно добавить аналогичным образом
        },
        error: function () {
            // Ошибка при выполнении запроса
            $("#movie-details").text("Ошибка при выполнении запроса деталей.");
        }
    });
}

function createPagination(totalResults: number, currentPage: number) {
    // Определим базовые параметры запроса к API OMDB
    const apiUrl = "http://www.omdbapi.com/";
    const apiKey = "e6266fda";
    const totalPages = Math.ceil(totalResults / 10); // Рассчитываем общее количество страниц
    const paginationContainer = $("#pagination");
    paginationContainer.empty();

    for (let i = 1; i <= totalPages; i++) {
        const pageButton = $("<button>");
        pageButton.text(i);

        // Добавляем обработчик клика для кнопки страницы
        pageButton.click(function () {
            searchMovies(apiUrl, apiKey, $("#movie-title").val() as string, $("#movie-type").val() as string, i);
        });

        if (i === currentPage) {
            pageButton.prop("disabled", true); // Делаем текущую страницу неактивной
        }

        paginationContainer.append(pageButton);
    }
}

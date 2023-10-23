/// <reference path="Scripts/typings/jquery/jquery.d.ts" />
// ����, ���� ���� �������� ����������
$(document).ready(function () {
    // ��������� ������� ��������� ������� � API OMDB
    const apiUrl = "http://www.omdbapi.com/";
    const apiKey = "e6266fda";
    // ���������� �������� �����
    $("#search-form").submit(function (event) {
        event.preventDefault(); // ������������ ����������� ��������� �����
        // ������� �������� �� �����
        const movieTitle = $("#movie-title").val();
        const movieType = $("#movie-type").val();
        // ������� ���������� ����������� ������
        $("#movies").empty();
        $("#pagination").empty();
        $("#movie-details").empty();
        // ������� ������� ��� �������� ������� � API
        searchMovies(apiUrl, apiKey, movieTitle, movieType);
    });
});
function searchMovies(apiUrl, apiKey, title, type, page = 1) {
    // ������� URL ��� �������
    const url = `${apiUrl}?apikey=${apiKey}&s=${title}&type=${type}&page=${page}`;
    // ���������� AJAX-������ � API
    $.ajax({
        url: url,
        dataType: "json",
        success: function (data) {
            // ������������ ���������� ������
            if (data.Response === "True") {
                // ������ �������, ��������� ��
                displayMovies(data.Search);
                // �������� ���������, ���� ���� ������ �����������
                if (data.totalResults > 10) {
                    createPagination(data.totalResults, page);
                }
            }
            else {
                // ������ �� �������
                $("#movies").text("Movie not found!");
            }
        },
        error: function () {
            // ������ ��� ���������� �������
            $("#movies").text("������ ��� ���������� �������.");
        }
    });
}
function displayMovies(movies) {
    const moviesContainer = $("#movies");
    moviesContainer.empty();
    movies.forEach((movie, index) => {
        // ������� ������� ��� ����������� ������
        const movieElement = $("<div>");
        movieElement.text(movie.Title);
        // ��������� ������ "Details" ��� ��������� ����������
        const detailsButton = $("<button>");
        detailsButton.text("Details");
        detailsButton.click(function () {
            // ���������� ����� �� ������ "Details"
            showMovieDetails(movie.imdbID);
        });
        // ��������� ������� ������ � ������ "Details" � ���������
        moviesContainer.append(movieElement, detailsButton);
    });
}
function showMovieDetails(imdbID) {
    // ��������� ������� ��������� ������� � API OMDB
    const apiUrl = "http://www.omdbapi.com/";
    const apiKey = "e6266fda";
    // ������� URL ��� ������� ������� � ������
    const url = `${apiUrl}?apikey=${apiKey}&i=${imdbID}`;
    // ���������� AJAX-������ � API
    $.ajax({
        url: url,
        dataType: "json",
        success: function (data) {
            // ��������� ��������� ������ � ������
            const detailsContainer = $("#movie-details");
            detailsContainer.empty();
            detailsContainer.text("Title: " + data.Title);
            detailsContainer.append("<br>");
            detailsContainer.text("Year: " + data.Year);
            // ������ ������ ����� �������� ����������� �������
        },
        error: function () {
            // ������ ��� ���������� �������
            $("#movie-details").text("������ ��� ���������� ������� �������.");
        }
    });
}
function createPagination(totalResults, currentPage) {
    // ��������� ������� ��������� ������� � API OMDB
    const apiUrl = "http://www.omdbapi.com/";
    const apiKey = "e6266fda";
    const totalPages = Math.ceil(totalResults / 10); // ������������ ����� ���������� �������
    const paginationContainer = $("#pagination");
    paginationContainer.empty();
    for (let i = 1; i <= totalPages; i++) {
        const pageButton = $("<button>");
        pageButton.text(i);
        // ��������� ���������� ����� ��� ������ ��������
        pageButton.click(function () {
            searchMovies(apiUrl, apiKey, $("#movie-title").val(), $("#movie-type").val(), i);
        });
        if (i === currentPage) {
            pageButton.prop("disabled", true); // ������ ������� �������� ����������
        }
        paginationContainer.append(pageButton);
    }
}
//# sourceMappingURL=app.js.map
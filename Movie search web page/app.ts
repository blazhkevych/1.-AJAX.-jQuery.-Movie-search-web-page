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
        const movieTitle = $("#movie-title").val() as string;
        const movieType = $("#movie-type").val() as string;

        // ������� ���������� ����������� ������
        $("#movies").empty();
        $("#pagination").empty();
        $("#movie-details").empty();

        // ������� ������� ��� �������� ������� � API
        searchMovies(apiUrl, apiKey, movieTitle, movieType);
    });
});

function searchMovies(apiUrl: string, apiKey: string, title: string, type: string, page: number = 1) {
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
            } else {
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

function displayMovies(movies: any[]) {
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

function showMovieDetails(imdbID: string) {
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

function createPagination(totalResults: number, currentPage: number) {
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
            searchMovies(apiUrl, apiKey, $("#movie-title").val() as string, $("#movie-type").val() as string, i);
        });

        if (i === currentPage) {
            pageButton.prop("disabled", true); // ������ ������� �������� ����������
        }

        paginationContainer.append(pageButton);
    }
}

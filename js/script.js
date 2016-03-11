'use strict';

function loadMovies() {
  $.getJSON('json/movies.json', function (data) {
    var jsonMovies;
    jsonMovies = data;
    populateMovies(jsonMovies);
  });
}

function populateMovies(movies) {
  if (movies.length === 0) {
    $(".js-grid").hide();
    return;
  }

  var template = $(".js-grid-item");

  for (var i = 0; i < movies.length; i++) {
    if (i > 0) {
      template = $(template).clone();
      template.appendTo(".js-grid");
    }

    var movieName = movies[i].name;
    var movieCountry = movies[i].country;
    var movieGenre = movies[i].genre;
    var movieLength = movies[i].length;
    var movieTrailer = movies[i].trailer;

    $(template).attr("id", "slider-" + i);

    $(template).find(".js-name").text(movieName);
    $(template).find(".js-country").text(movieCountry);
    $(template).find(".js-genre").text(movieGenre);
    $(template).find(".js-length").text(movieLength);

    $(template).find(".js-poster").attr("src", "img/" + i + "-1.jpg");
    $(template).find(".js-img").attr("src", "img/" + i + "-3.jpg");
    $(template).find(".js-img-full").attr("src", "img/" + i + "-3.jpg");
    $(template).find(".js-frame").attr("src", "img/" + i + "-4.jpg");

    $(template).find(".js-btn-img").attr("id", "btn" + i);
    $(template).find(".js-popup-img").attr("id", "popup-btn" + i);

    $(template).find(".js-btn-vid").attr("id", "btn-vid" + i);
    $(template).find(".js-popup-vid").attr("id", "popup-btn-vid" + i);

    $(template).find(".js-video").attr("src", movieTrailer + "?version=3&enablejsapi=1");
    $(template).find(".js-video").attr("id", "vid" + i);
  }
}

$(document).ready(function () {
  loadMovies();

  var SLIDEWIDTH = 220;

  function moveLeft(id) {
    $(id + ' ul').animate({
      left: +SLIDEWIDTH
    }, 200, function () {
      $(id + ' ul li:last-child').prependTo(id + ' ul');
      $(id + ' ul').css('left', '');
    });
  }

  function moveRight(id) {
    $(id + ' ul').animate({
      left: -SLIDEWIDTH
    }, 200, function () {
      $(id + ' ul li:first-child').appendTo(id + ' ul');
      $(id + ' ul').css('left', '');
    });
  }

  $(document).on('click', '.js-prev', function () {
    var id = $(this).parents(".js-grid-item").attr("id");
    moveLeft("#" + id);
  });

  $(document).on('click', '.js-next', function () {
    var id = $(this).parents(".js-grid-item").attr("id");
    moveRight("#" + id);
  });

  $(document).on('click', '.js-btn-img', function () {
    var id = $(this).attr('id');
    $("#popup-" + id).show();
  });

  $(document).on('click', '.js-btn-vid', function () {
    var id = $(this).attr('id');
    $("#popup-" + id).show();
  });

  $(document).on('click', '.js-close-img', function () {
    $(".js-popup-img").hide();
  });

});


var tag = document.createElement('script');
tag.src = "http://www.youtube.com/iframe_api";
var firstScriptTag = document.getElementsByTagName('script')[0];
firstScriptTag.parentNode.insertBefore(tag, firstScriptTag);
var players = {};

function onYouTubePlayerAPIReady() {
  var videos = $(".js-video");

  for (var i = 0; i < videos.length; i++) {
    players[videos[i].id] = new YT.Player(videos[i].id), {
      events: {
        "onReady": onPlayerReady(videos[i].id)
      }
    };
  }
}

function onPlayerReady(i) {
  var playBtn = document.getElementById("btn-" + i);
  playBtn.addEventListener("click", function () {
    var player = players[i];
    player.playVideo();
  });
}

$(document).on('click', '.js-close-vid', function () {
  var popup = $(this).parents(".js-popup-vid");
  popup.fadeOut();

  var frameId = popup.find(".js-video");
  var player = players[$(frameId).attr("id")];
  player.stopVideo();
});




$(document).on('click', '.js-filter-all', function () {
  $(".js-filter").removeClass("filter__item--active");
  $(this).addClass("filter__item--active");
  $(".js-grid-item").fadeIn();
});

$(document).on('click', '.js-filter', function () {
  $(".js-filter").removeClass("filter__item--active");
  $(".js-filter-all").removeClass("filter__item--active");
  $(this).addClass("filter__item--active");

  var filter = $(this).text().toLowerCase().slice(1, -1);

  var filtered = $(".js-grid-item").filter(function () {
    if ($(this).find(".js-genre").text().indexOf(filter) > 0) {
      $(this).fadeIn();
    } else {
      $(this).fadeOut();
    }
  });
});
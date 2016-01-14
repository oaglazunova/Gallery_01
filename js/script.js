'use strict';

$(".js-grid").masonry({
  itemSelector: ".js-grid-item",
  columnWidth: 220,
  "gutter": 20,
  isFitWidth: true,
  stamp: '.js-stamp'
});

var lh = [];
var wscroll = 0;
var wh = $(window).height();

function updateOffsets() {
  $(".js-lazy").each(function() {
    var x = $(this).offset().top;
    lh.push(x);
  });
}

function lazy() {
  wscroll = $(window).scrollTop();

  for (var i = 0; i < lh.length; i++) {
    if (lh[i] <= (wscroll + (wh - 200))) {
      var blockClassName = $(".js-lazy").eq(i).attr("data-attr");
      $(".js-lazy").eq(i).addClass(blockClassName);
    }
  }
}

$(window).on('scroll', function() {
  lazy();
});

function getChildByClassName(parent, className) {
  for (var i = 0; i < parent.children.length; i++) {
    if (parent.children[i].classList.contains(className)) {
      return parent.children[i];
    }
  }
}

function getParentByClassName(child, className) {
  while (child.parentNode) {
    child = child.parentNode;
    if (child.classList.contains(className)) {
      return child;
    }
  }
  return null;
}

function generateSliderId(id) {
  return "slider-" + id;
}

$(document).ready(function() {
  $(".blocks__item").each(function() {
    var obj = $(this);
    var id = 1;
    $(obj).find("li").each(function() {
      $(this).addClass("js-slide-" + id);
      id++;
    });

    $(obj).append("<div class=\'blocks__slider-controls\'>\
              <span class=\'slider-arrow  slider-arrow--prev\'><svg width=\'23\' height=\'22\' preserveaspectratio=\'xMidYMid\'><use xmlns:xlink=\'http://www.w3.org/1999/xlink\' xlink:href=\'#icon-prev\'></use></svg></span>\
              <span class=\'slider-arrow  slider-arrow--next\'><svg width=\'23\' height=\'22\' preserveaspectratio=\'xMidYMid\'><use xmlns:xlink=\'http://www.w3.org/1999/xlink\' xlink:href=\'#icon-next\'></use></svg></span>\
            </div>");
  });

  var sliders = $(".blocks__item");
  for (var i = 0; i < sliders.length; i++) {
    var sliderId = generateSliderId(i);
    sliders[i].id = sliderId;
    var slideCount = $("#" + sliderId + ' ul li').length;
    var slideWidth = $("#" + sliderId + ' ul li').width();
    var sliderUlWidth = slideCount * slideWidth;

    $("#" + sliderId).css({
      width: slideWidth
    });

    $("#" + sliderId + " ul").css({
      width: sliderUlWidth,
      marginLeft: -slideWidth
    });

    $("#" + sliderId + ' ul li:last-child').prependTo("#" + sliderId + ' ul');
  }

  function getParentId(child) {
    if (child.parentNode) {
      child = child.parentNode.parentNode;
      return $(child).attr("id");
    }
    return null;
  }

  function moveLeft(id) {
    $(id + ' ul').animate({
      left: +slideWidth
    }, 200, function() {
      $(id + ' ul li:last-child').prependTo(id + ' ul');
      $(id + ' ul').css('left', '');
    });

    lazy();
  }

  function moveRight(id) {
    $(id + ' ul').animate({
      left: -slideWidth
    }, 200, function() {
      $(id + ' ul li:first-child').appendTo(id + ' ul');
      $(id + ' ul').css('left', '');
    });

    lazy();
  }

  $('.slider-arrow--prev').click(function() {
    var id = getParentId(this);
    moveLeft("#" + id);
  });

  $('.slider-arrow--next').click(function() {
    var id = getParentId(this);
    moveRight("#" + id);
  });

  $(".js-slide-3").each(function() {
    var zoomSvg = getChildByClassName(this, "blocks__btn");
    $(zoomSvg).click(function() {
      $("#popup-" + zoomSvg.id).addClass("show");
    });
  });

  $(".js-slide-4").each(function() {
    var playSvg = getChildByClassName(this, "blocks__btn");
    $(playSvg).click(function() {
      $("#popup-" + playSvg.id).addClass("show");
    });
  });

  updateOffsets();
  lazy();

});

var tag = document.createElement('script');
tag.src = "http://www.youtube.com/iframe_api";
var firstScriptTag = document.getElementsByTagName('script')[0];
firstScriptTag.parentNode.insertBefore(tag, firstScriptTag);
var players = {};

function onYouTubePlayerAPIReady() {
  var videos = document.getElementsByClassName("js-video");
  for (var i = 0; i < videos.length; i++) {
    players[videos[i].id] = new YT.Player(videos[i].id), {
      events: {
        "onReady": onPlayerReady(videos[i].id)
      }
    };
  }
}

function onPlayerReady(frameId) {
  var playBtn = document.getElementById("btn-" + frameId);
  playBtn.addEventListener("click", function() {
    var player = players[frameId];
    player.playVideo();
  });
}

$(".popups__close-pict").click(function() {
  var popupImg = getParentByClassName(this, "popups__window");
  popupImg.classList.remove("show");
});

$(".popups__close-vid").click(function() {
  var vidupImg = getParentByClassName(this, "popups__window");
  var popupsVid = getParentByClassName(this, "popups__vid");
  var frameId = getChildByClassName(popupsVid, "js-video");
  //  var players = {};
  vidupImg.classList.remove("show");
  var player = players[$(frameId).attr("id")];
  player.stopVideo();
});


var filters = document.getElementsByClassName("filter__item");

function toggleModifier(selector, modifier, self) {
  var x = document.getElementsByClassName(selector);
  for (var i = 0; i < x.length; i++) {
    x[i].classList.remove(modifier);
  }
  self.classList.add(modifier);
}

function shrinkBlock(filterButton, blockToFilter, self) {
  if (self.classList.contains(filterButton)) {
    var x = $(".blocks__item");
    for (var i = 0; i < x.length; i++) {
      x[i].classList.remove("shrink");
      if (x[i].classList.contains(blockToFilter)) {
        x[i].classList.remove("grow");
        x[i].classList.add("shrink");
      }
    }
  }
}

function growBlocks(self) {
  var x = $(".blocks__item");
  for (var i = 0; i < x.length; i++) {
    if (x[i].classList.contains("shrink")) {
      x[i].classList.add("grow");
    }
  }
}

var doFilter = function() {
  toggleModifier("filter__item", "filter__item--active", this);
  growBlocks(this);
  shrinkBlock("js-show-all", "js-filter-all", this);
  shrinkBlock("js-filter1", "js-filter-not1", this);
  shrinkBlock("js-filter2", "js-filter-not2", this);
  shrinkBlock("js-filter3", "js-filter-not3", this);
  shrinkBlock("js-filter4", "js-filter-not4", this);
  shrinkBlock("js-filter5", "js-filter-not5", this);
  shrinkBlock("js-filter6", "js-filter-not6", this);
  shrinkBlock("js-filter7", "js-filter-not7", this);
  shrinkBlock("js-filter8", "js-filter-not8", this);
}

for (var i = 0; i < filters.length; i++) {
  filters[i].addEventListener("click", doFilter, false);
}

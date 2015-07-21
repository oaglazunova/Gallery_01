//Masonry options
$(".js-grid").masonry({
  itemSelector: ".js-grid-item",
  columnWidth: 300,
  "gutter": 20,
  isFitWidth: true,
  stamp: '.js-stamp'
});
// masonry options end


//Refreshes layout after screen size change 
$(window).bind('resize', function(e)
{
  if (window.RT) clearTimeout(window.RT);
  window.RT = setTimeout(function()
  {
    this.location.reload(false); /* false to get page from cache */
  }, 100);
});
//refresh end



//Helpers
function getChildByClassName(parent, className) {
  for (var i = 0; i < parent.children.length; i++) {
    if (parent.children[i].classList.contains(className))
      return parent.children[i];
  }
}

function getParentByClassName(child, className) {
    while (child.parentNode) {
      child = child.parentNode;
      if (child.classList.contains(className))
        return child;
    }
    return null;
  }
  //Helpers end



//slider id gen 
function generateSliderId(id) {
    return "slider-" + id;
  }
  //slider id gen end


//slider, popup, video - init
$(document).ready(function () {
  $(".blocks__item").each(function () {
    var obj = $(this);
    var id = 1;
    $(obj).find("li").each(function () {
      $(this).addClass("js-slide-" + id);
      id++;
    });

    //insert controls into slider
    $(obj).append("<div class=\"blocks__slider-controls\">\
              <span class=\"slider-arrow  slider-arrow--prev\"><svg width=\"23\" height=\"22\" preserveaspectratio=\"xMidYMid\"><use xmlns:xlink=\"http://www.w3.org/1999/xlink\" xlink:href=\"#icon-prev\"></use></svg></span>\
              <span class=\"slider-arrow  slider-arrow--next\"><svg width=\"23\" height=\"22\" preserveaspectratio=\"xMidYMid\"><use xmlns:xlink=\"http://www.w3.org/1999/xlink\" xlink:href=\"#icon-next\"></use></svg></span>\
            </div>");
  });
  // end insert controls into slider

  var sliders = document.getElementsByClassName("blocks__item");
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
    }, 200, function () {
      $(id + ' ul li:last-child').prependTo(id + ' ul');
      $(id + ' ul').css('left', '');
    });
    //update screen to lazy load hidden sliders
    lazy();
  };

  function moveRight(id) {
    $(id + ' ul').animate({
      left: -slideWidth
    }, 200, function () {
      $(id + ' ul li:first-child').appendTo(id + ' ul');
      $(id + ' ul').css('left', '');
    });
    //update screen to lazy load hidden sliders
    lazy();
  };

  $('.slider-arrow--prev').click(function () {
    var id = getParentId(this);
    moveLeft("#" + id);
  });

  $('.slider-arrow--next').click(function () {
    var id = getParentId(this);
    moveRight("#" + id);
  });
  //end slider part



  //popup (cont)
  $(".js-slide-3").each(function () {
    var zoomSvg = getChildByClassName(this, "blocks__btn");
    var popupImg = document.getElementById("popup-" + zoomSvg.id);
    $(zoomSvg).click(function () {
      popupImg.classList.add("show");
    });
  });
  //popup not end  



  // vidup (cont)
  $(".js-slide-4").each(function () {
    var playSvg = getChildByClassName(this, "blocks__btn");
    var vidupVid = document.getElementById("popup-" + playSvg.id);
    $(playSvg).click(function () {
      vidupVid.classList.add("show");
    });
  });
  //vidup not end


  // Lazy load init
  update_offsets();
  lazy();
  // lazy load init end  

});
// slider, popup, video - end init



//  Lazy Load for bkg img
var ll = $(".js-lazy");
var lh = []
var wscroll = 0;
var wh = $(window).height();

function update_offsets() {
  $(".js-lazy").each(function () {
    var x = $(this).offset().top;
    lh.push(x);
  });
};

function lazy() {
  wscroll = $(window).scrollTop();

  for (i = 0; i < lh.length; i++) {
    if (lh[i] <= (wscroll + (wh - 200))) {
      var blockClassName = $(".js-lazy").eq(i).attr("data-attr");
      $(".js-lazy").eq(i).addClass(blockClassName);
    }
  };
};

$(window).on('scroll', function () {
  lazy();
});
//lazy load end



/*
//  Video auto-start
var tag = document.createElement('script');
tag.src = "http://www.youtube.com/iframe_api";
var firstScriptTag = document.getElementsByTagName('script')[0];
firstScriptTag.parentNode.insertBefore(tag, firstScriptTag);
var players = {};

// this function gets called when API is ready to use
function onYouTubePlayerAPIReady() {
  var videos = document.getElementsByClassName("js-video");
  for (var i = 0; i < videos.length; i++) {
    players[videos[i].id] = new YT.Player(videos[i].id), {
      events: {
        "onReady": onPlayerReady(videos[i].id)
      }
    }
  }
}

function onPlayerReady(frameId) {
    // bind events
    var playBtn = document.getElementById("btn-" + frameId);
    playBtn.addEventListener("click", function () {
      var player = players[frameId];
      player.playVideo();
    });
  }
  // end video auto-start
*/



//popup (cont)
$(".popups__close-pict").click(function () {
  var popupImg = getParentByClassName(this, "popups__window");
  popupImg.classList.remove("show");
});
//end popup



// vidup (cont)
$(".popups__close-vid").click(function () {
  var vidupImg = getParentByClassName(this, "popups__window");
  var popupsVid = getParentByClassName(this, "popups__vid");
  var frameId = getChildByClassName(popupsVid, "js-video");
  vidupImg.classList.remove("show");
  var player = players[$(frameId).attr("id")];
  player.stopVideo();
});
//end vidup



// Filter
var filters = document.getElementsByClassName("filter__item");

function toggleModifier(selector, modifier, self) {
  var x = document.getElementsByClassName(selector);
  for (var i = 0; i < x.length; i++)
    x[i].classList.remove(modifier);
  self.classList.add(modifier);
}

function shrinkBlock(filterButton, blockToFilter, self) {
  if (self.classList.contains(filterButton)) {
    var x = document.getElementsByClassName("blocks__item");
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
  var x = document.getElementsByClassName("blocks__item");
  for (var i = 0; i < x.length; i++) {
    if (x[i].classList.contains("shrink")) {
      x[i].classList.add("grow");
    }
  }
}

var doFilter = function () {
  toggleModifier("filter__item", "filter__item--active", this);
  growBlocks(this);
  shrinkBlock("js-show-all", "js-filter-all", this);
  shrinkBlock("js-culture", "js-filter-no-culture", this);
  shrinkBlock("js-ext", "js-filter-no-ext", this);
  shrinkBlock("js-atm", "js-filter-no-atm", this);
  shrinkBlock("js-people", "js-filter-no-people", this);
}

for (var i = 0; i < filters.length; i++)
  filters[i].addEventListener("click", doFilter, false);
// end filter
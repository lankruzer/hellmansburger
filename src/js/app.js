import $ from 'jquery';

$( document ).ready(function() {

  // popup's
  var overlay = document.querySelector('.overlay');
  var body = document.querySelector('body');
  var popupVideo = document.querySelector('.popup-form__video');
  var popupRestourant = document.querySelector('.popup-form__restourant');
  var previousBtnClick;

  if (document.querySelector('.popup-form__video')) {
    if(document.querySelector('.btn-open-video')) {
      document.querySelector('.btn-open-video').addEventListener('click', function(event) {
        event.preventDefault();
        overlay.classList.add('overlay_active');
        body.classList.toggle('hide-scroll');
        popupVideo.querySelector('iframe').setAttribute('src', this.dataset.link);
        popupVideo.classList.add('popup-form_active');
        popupVideo.querySelector('.popup-form__close').focus();
        previousBtnClick = this;
      });
    }
  }

  if (document.querySelector('.btn-open-restourant')) {
    openRes();
  }

  function openRes() {
    document.querySelectorAll('.btn-open-restourant').forEach( function(btn, index, arr) {
      btn.onclick = function(event) {
        overlay.classList.add('overlay_active');
        body.classList.toggle('hide-scroll');
        popupRestourant.querySelector('iframe').setAttribute('src', this.dataset.link);
        popupRestourant.classList.add('popup-form_active');
        popupRestourant.querySelector('.popup-form__close').focus();
        previousBtnClick = this;
      };
    });
  }

  if(document.querySelector('.popup-form__close')) {
    document.querySelectorAll('.popup-form__close').forEach( function(btn, index, arr) {
      btn.addEventListener('click', function(event) {
        event.preventDefault();
        body.classList.toggle('hide-scroll');
        overlay.querySelector('.popup-form_active').classList.remove('popup-form_active');
        overlay.classList.remove('overlay_active');
        if (popupVideo) {
          popupVideo.querySelector('iframe').removeAttribute('src');
        }
        if (popupRestourant) {
          popupRestourant.querySelector('iframe').removeAttribute('src');
        }
        previousBtnClick.focus();
      });
    });
  };

  if (document.querySelector('.overlay__content')) {
    document.querySelector('.overlay__content').addEventListener('click', function(event) {
      if (event.target.classList.contains('overlay__content')) {
        overlay.classList.remove('overlay_active');
        overlay.querySelector('.popup-form_active').classList.remove('popup-form_active');
        body.classList.toggle('hide-scroll');
        popupVideo.querySelector('iframe').removeAttribute('src');
        previousBtnClick.focus();
      }
    });
  };

  window.onkeyup = function(event) {
    if(event.keyCode === 27) {
    	if(overlay.classList.contains('overlay_active')) {
    	  event.preventDefault();	
        body.classList.toggle('hide-scroll');
        overlay.querySelector('.popup-form_active').classList.remove('popup-form_active');
        overlay.classList.remove('overlay_active'); 		
        popupVideo.querySelector('iframe').removeAttribute('src');
        previousBtnClick.focus();
    	}
    }
  };
  // popup's










  // search button
  if(document.querySelector('.search')) {
    var btnOpenSearch = document.querySelector('.search-form__button_open');
    btnOpenSearch.addEventListener('click', function(event) {
      this.classList.toggle('search-form__button_hide');
      document.querySelector('.search-form__input').focus();
      document.querySelector('.search-form__input').classList.add('search-form__input_show');
    });

    document.querySelector('.search-form__input').addEventListener('blur', function(event) {
      if(document.querySelector('.search-form__input').classList.contains('search-form__input_show')) {
        document.querySelector('.search-form__input').classList.remove('search-form__input_show');
        btnOpenSearch.classList.toggle('search-form__button_hide');
      }
    });
  }
  // search button









  // smooth scrolling
  $('a[href^="#"]').on('click', function() {
    var target =  $(this).attr('href');
    
    if ($(this).hasClass('search-list-li__link')) {
      if ($($(this).attr('href')).hasClass('restaurant-chain_hide')) {
        $($(this).attr('href')).removeClass('restaurant-chain_hide');
      }
    }
    
    $('html, body').animate({
      scrollTop: $(target).offset().top - 100
    }, 1000);
    return false;
    
  });
  // smooth scrolling








  // restaurant-chain
  if (document.querySelector('.restaurant-chain')) {
    hideChain();

    var startLoad = true;
    var scrolled = 0;   
    var oldScrolled = 0;

    var RES_CATS = [];
    var RES_IDS = [];

    function updateCheckItem() {
    	$('.restaurant-chain').each(function(index, item) {
	      RES_IDS.push($(item).attr('id'));      
	      RES_IDS[$(item).attr('id')] = [];
	      $(item).find('.restaurant').each(function(resIndex, resItem) {
	      	RES_IDS[$(item).attr('id')].push($(resItem).data('id'));
	      });
	    });
    }

    function checkItem(cat, id) {
      if (RES_IDS['cat-' + cat].indexOf(id) === -1) {
        return true;
      }	else {
        return false;
      }
    }


    updateCheckItem();     



    window.onscroll = function() {
      scrolled = window.pageYOffset || document.documentElement.scrollTop;

      // if(oldScrolled < scrolled) {
      //   oldScrolled = scrolled;

      //   if (oldScrolled > $(window).height() - 3500) {
      //     if (startLoad) {
      //       startLoad = false;
      //       fetchRes();
      //     }
      //   }
      // }

      if (scrolled > $(window).height() - 3500) {
        if (startLoad) {
          startLoad = false;
          fetchRes();
        }
      }

    };
  };



  function hideChain() {
    $('.restaurant-chain').each(function(index, item) {
      if($(item).find('.restaurant').not('.restaurant_hide').length === 0) {
        $(item).addClass('restaurant-chain_hide');
      }
    });
  }


  function fetchRes() {
    var offset = 0;
    var catId = 0;
    var dataArray = 0;


    $('.restaurant-chain').each(function(index, chain) {
      if($(chain).hasClass('restaurant-chain_hide')) {

      } else {
        catId = $(chain).attr('id');
        offset = $(chain).find('.restaurant').length;
        if (offset === -1) {
          offset = 0;
        }
      }

    });


    $.ajax({
      type: 'POST',
      url: 'http://hellman.dev.qlab.by/wp-admin/admin-ajax.php',
      data: 'cat=' + catId + '&action=get_count_posts_by_cat',
      success: function(data) {

        var catElems = JSON.parse(data);

        if(catElems.count > offset) {
        	var exclude = [];
          $('#' + catId).find('.restaurant').each(function(index, res) {
            exclude.push($(res).data('id'));
          });

          $.ajax({
            type: 'POST',
            url: 'http://hellman.dev.qlab.by/wp-admin/admin-ajax.php',
            data: 'exclude=' + exclude + '&cat=' + catId + '&action=get_posts_by_cat',
            success: function(data) {
        
              dataArray = JSON.parse(data);      
              addRes(dataArray);
              openRes();
              startLoad = true;
            }
          });
        }
      }
    });
  };



  function addRes(catElems) {
    var allCats = [];    

    for(var i = 0; i < catElems.length; i++) {
      var cats = catElems[i].cats;

      if (allCats.indexOf(cats[i]) === -1) {
        allCats.push(cats[i]);
      }

      for (var y = 0; y < cats.length; y++) {
        if (checkItem(cats[y], catElems[i].id)) {
          if ($('#cat-' + cats[y]).hasClass('restaurant-chain_without-bg')) {
            $('#cat-' + cats[y]).find('.restaurant-container').append('<article class="restaurant restaurant_without-border col-12 col-sm-6 col-lg-4" data-id ="' + catElems[i].id + '" data-cats = ' + catElems[i].cats + '" data-resName="' + catElems[i].resName + '" data-city="' + catElems[i].city +'"><div class="row d-flex align-items-center"><a href="' + catElems[i].pageRestourant + '" class="restaurant-logo col-12 col-xl-4"><img class="restaurant-logo__img" src="' + catElems[i].imageSrc + '"></a><div class="col-12 col-xl-8"><h2 class="restaurant-title"><span class="restaurant-title__chain">' + catElems[i].resName + '</span></h2><div class="restaurant-info"><address class="restaurant-info__address">' + catElems[i].address + ' ' + catElems[i].city + '</address>|<a href="tel:' + catElems[i].phone + '" class="restaurant-info__cost">' + catElems[i].phone + '*</a></div><div class="restaurant-buttons"><a href="' + catElems[i].pageRestourant + '" class="btn">תפריט</a><button class="btn btn-open-restourant" type="button" data-link="' + catElems[i].iframeSrc + '">הזמנת שולחן</button></div></div></div></article>'); 
          } else {
            $('#cat-' + cats[y]).find('.restaurant-container').append('<article class="restaurant col-12 col-sm-6 col-lg-6 col-xl-4" data-id ="' + catElems[i].id + '" data-cats = ' + catElems[i].cats + '" data-resName="' + catElems[i].resName + '" data-city="' + catElems[i].city +'"><h2 class="restaurant-title"><span class="restaurant-title__chain">' + catElems[i].resName + '</span><span class="restaurant-title__restaurant">(' + catElems[i].branch + ')</span></h2><div class="restaurant-info"><address class="restaurant-info__address">' + catElems[i].address + ' ' + catElems[i].city + '</address>' + '|' + '|<a href="tel:' + catElems[i].phone + '" class="restaurant-info__cost">' + catElems[i].phone + '*</a>' + '</div>' + '<div class="restaurant-buttons">' + '<a href="' + catElems[i].pageRestourant + '" class="btn">תפריט</a>' + '<button class="btn btn-open-restourant" data-link="' + catElems[i].iframeSrc + '">הזמנת שולחן</button>' + '</div>' + '</article>');
          }
    		}
    	}
    }


    if (allCats.length !== 0) {
      for (var i = 0; i < allCats.length; i++) {
        showChain(allCats[i], catElems.length); 
      }
    } else {
      showChain();
    }

 		updateCheckItem();
  	
  }  

  function showChain(id, length) {
    if (id) {
      if($('#' + id).find('.restaurant').length !== 0) {
        if ($('#' + id).hasClass('restaurant-chain_hide')) {
          $('#' + id).removeClass('restaurant-chain_hide');
        }
      }
    } else {
      if ($('.restaurant-chain_hide').first().hasClass('restaurant-chain_hide')) {
        $('.restaurant-chain_hide').first().removeClass('restaurant-chain_hide');
      } 
    }
  }



  $('.search-form').on('submit', function(event) {
    startLoad = false;
    oldScrolled = 0;
    event.preventDefault();
    if($('.search-form__input').val() !== '') {
      findRes($('.search-form__input').val());
    }
  });

  $('.search-form__input').on('keyup', function(event) {
    startLoad = false;
    oldScrolled = 0;
    findRes($('.search-form__input').val());
  });

  $('.search-form__button_submit').on('mousedown', function(event) {
  	startLoad = true;
    oldScrolled = 0;
    $('.restaurant_hide').removeClass('restaurant_hide');

    $('.restaurant-chain_hide').each(function(index, chain) {
    	if ($(chain).find('.restaurant').not('.restaurant_hide')) {
    		$(chain).removeClass('restaurant-chain_hide');
    	}
    });
  });

  function findRes(searchWord) {
    var allRes = $('.restaurant');
    var allResLength = allRes.length;
    var result = 0;

    $(allRes).each(function(index, item) {
      if ($(item).hasClass('restaurant_hide')) {
        $(item).removeClass('restaurant_hide');
      }
    });

    if (searchWord !== '') {

    	$('.restaurant_hide').removeClass('restaurant_hide');

      result = $('.restaurant').not($('*[data-city^="' + searchWord + '"]')).not($('*[data-resName=^"' + searchWord + '"]')).addClass('restaurant_hide');   

      $('.restaurant-chain_hide').each(function(index, chain) {
      	if ($(chain).find('.restaurant').not('.restaurant_hide')) {
      		$(chain).removeClass('restaurant-chain_hide');
      	}
      });

      fetchSearch(searchWord, result.length);

      $('.restaurant-chain_hide').each(function(index, chain) {
      	if ($(chain).find('.restaurant').not('.restaurant_hide')) {
      		$(chain).removeClass('restaurant-chain_hide');
      	}
      });

    } else {
    	$('.restaurant_hide').removeClass('restaurant_hide');

      $('.restaurant-chain_hide').each(function(index, chain) {
      	if ($(chain).find('.restaurant').not('.restaurant_hide')) {
      		$(chain).removeClass('restaurant-chain_hide');
      	}
      });
    }
    
  }

  function fetchSearch(search, count) {
    $.ajax({
      type: 'POST',
      url: 'http://hellman.dev.qlab.by/wp-admin/admin-ajax.php',
      data: 'search=' + search + '&action=get_posts_by_search',
      success: function(data) {
        var dataArray = JSON.parse(data);
        
        addRes(dataArray);

        openRes();

        hideChain();
      }
    });  
  }

});

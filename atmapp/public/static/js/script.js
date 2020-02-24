/* ----------------------------------------------------------- */
/*  1. ScrollReveal
/* ----------------------------------------------------------- */

$(document).ready(function () {

  window.sr = ScrollReveal();
  sr.reveal('.navbar', {
    duration: 2000,
    origin: 'bottom'
  });
  sr.reveal('.showcase-left', {
    duration: 2000,
    origin: 'top',
    distance: '300px'
  });
  sr.reveal('.showcase-right', {
    duration: 2000,
    origin: 'right',
    distance: '300px'
  });
  sr.reveal('.features', {
    duration: 1000,
    delay: 1000,
    origin: 'bottom'
  });
  sr.reveal('.showcase-caption', {
    duration: 2000,
    origin: 'bottom'
  });
  sr.reveal('.portfolio', {
    duration: 2000,
    origin: 'left',
    distance: '300px',
    viewFactor: 0.2
  });
  sr.reveal('.info-right', {
    duration: 2000,
    origin: 'right',
    distance: '300px',
    viewFactor: 0.2
  });

  new grid3D(document.getElementById('portfolio'));
});

$(function () {

  // Smooth Scrolling
  /*$('a[href*="#"]:not([href="#"])').click(function () {
    debugger
    if (location.pathname.replace(/^\//, '') == this.pathname.replace(/^\//, '')
      && location.hostname == this.hostname) {
      var target = $(this.hash);
      target = target.length ? target : $('[name=' + this.hash.slice(1) + ']');
      if (target.length) {
        $('html, body').animate({
          scrollTop: target.offset().top
        }, 1000);
        return false;
      }
    }
  });*/

  /* ----------------------------------------------------------- */
  /*  PORTFOLIO GALLERY
  /* ----------------------------------------------------------- */

  $('.filtr-container').filterizr();

  //Simple filter controls

  $('.mu-simplefilter li').click(function () {
    $('.mu-simplefilter li').removeClass('active');
    $(this).addClass('active');
  });


  /* ----------------------------------------------------------- */
  /*  7. PORTFOLIO POPUP VIEW ( IMAGE LIGHTBOX )
  /* ----------------------------------------------------------- */

  $('.mu-imglink').magnificPopup({
    type: 'image',
    mainClass: 'mfp-fade',
    gallery: {
      enabled: true
    }
  });

});


jQuery(document).ready(function ($) {
  //create the slider slick
  /*$('.show-case-slider').slick({
    dots: true,
    infinite: true,
    speed: 300,
    slidesToShow: 1,
    adaptiveHeight: true,
    prevArrow: "",
    nextArrow: ""
  });*/

  /*$('.services-slider').slick({
    dots: true,
    infinite: false,
    speed: 300,
    slidesToShow: 4,
    slidesToScroll: 4,
    responsive: [
      {
        breakpoint: 1024,
        settings: {
          slidesToShow: 3,
          slidesToScroll: 3,
          infinite: true,
          dots: true
        }
      },
      {
        breakpoint: 600,
        settings: {
          slidesToShow: 2,
          slidesToScroll: 2
        }
      },
      {
        breakpoint: 480,
        settings: {
          slidesToShow: 1,
          slidesToScroll: 1
        }
      }
      // You can unslick at a given breakpoint now by adding:
      // settings: "unslick"
      // instead of a settings object
    ]
  });*/

  //create the slider
  /*$('.cd-testimonials-wrapper').flexslider({
    selector: ".cd-testimonials > li",
    animation: "slide",
    controlNav: false,
    slideshow: false,
    smoothHeight: true,
    start: function () {
      $('.cd-testimonials').children('li').css({
        'opacity': 1,
        'position': 'relative'
      });
    }
  });*/

  //open the testimonials modal page
  $('.cd-see-all').on('click', function () {
    $('.cd-testimonials-all').addClass('is-visible');
  });

  //close the testimonials modal page
  $('.cd-testimonials-all .close-btn').on('click', function () {
    $('.cd-testimonials-all').removeClass('is-visible');
  });
  $(document).keyup(function (event) {
    //check if user has pressed 'Esc'
    if (event.which == '27') {
      $('.cd-testimonials-all').removeClass('is-visible');
    }
  });

  //build the grid for the testimonials modal page
  $('.cd-testimonials-all-wrapper').children('ul').masonry({
    itemSelector: '.cd-testimonials-item'
  });
});


$(function () {
  $(document).click(function (event) {
    $('.navbar-collapse').collapse('hide');
  });

  $('.navbar-nav li a').on('click', function () {
    $('.navbar-collapse').collapse('hide');
  });

});

/* ----------------------------------------------------------- */
/*   Contact form
/* ----------------------------------------------------------- */


(function ($) {
  'use strict';
  var form = $('.contact__form'),
    message = $('.contact__msg'),
    form_data;
  // Success function
  function done_func(response) {
    message.fadeIn().removeClass('alert-danger').addClass('alert-success');
    message.text(response);
    setTimeout(function () {
      message.fadeOut();
    }, 2000);
    form.find('input:not([type="submit"]), textarea').val('');
  }
  // fail function
  function fail_func(data) {
    message.fadeIn().removeClass('alert-success').addClass('alert-success');
    message.text(data.responseText);
    setTimeout(function () {
      message.fadeOut();
    }, 2000);
  }

  form.submit(function (e) {
    e.preventDefault();
    form_data = $(this).serialize();
    $.ajax({
      type: 'POST',
      url: form.attr('action'),
      data: form_data
    })
      .done(done_func)
      .fail(fail_func);
  });

})(jQuery);


var inputTextUpperCase = function () {
  $('input[type=text]').keyup(function () {
    $(this).val($(this).val().toUpperCase());
  });
}

var inputConvertUpperCaseForm = function (form) {

  var list_input = $("#"+form).find("input[type=text]")
  $.each(list_input, function(index, item){
    $(item).val($(item).val().toUpperCase());
  })
}

/**
 * recive un dropdown menu en formato jquery  $("div[class~='dropdown-menu']")
 * @param {*} dropdown_menu  {$("div[class~='dropdown-menu']") }
 */
var event_drop_down = function (dropdown_menu, callback) {

  var events = window.jQuery._data(dropdown_menu.find('a')[0], "events");
  if (events === undefined || events.click.length === 0) {

    dropdown_menu.find('a').click(function () {
      this.parentElement.parentElement.firstElementChild.innerHTML = this.getAttribute("code");

      if (callback !== null)
        callback(this.getAttribute("code"));
    });
  }
}

var create_input_hidden = function (value, name, destiny_id) {

  //document.getElementsByName(name).remove();
  var element = document.getElementsByName(name);
  if (element.length > 0)
    element[0].remove();

  var input = document.createElement("input");
  input.setAttribute("type", "hidden");
  input.setAttribute("name", name);
  input.setAttribute("value", value);
  //append to form element that you want .
  document.getElementById(destiny_id).appendChild(input);
}

//var log = function (log) { $logs.value = log + '\n' + $logs.value; }
var crearCookie = function (key, value) {
  expires = new Date();
  expires.setTime(expires.getTime() + 31536000000);
  cookie = key + "=" + value + ";expires=" + expires.toUTCString();
  //log("crearCookie: " + cookie);
  return document.cookie = cookie;
}

// Leer Cookie
var leerCookie = function (key) {
  keyValue = document.cookie.match("(^|;) ?" + key + "=([^;]*)(;|$)");
  if (keyValue) {
    //log("getCookie: " + key + "=" + keyValue[2]);
    return keyValue[2];
  } else {
    //log("getCookie: " + key + "=" + "null");
    return null;
  }
}

// Eliminar Cookie
var eliminarCookie = function (key) {
  //log("eliminarCookie: " + key);
  return document.cookie = key + '=;expires=Thu, 01 Jan 1970 00:00:01 GMT;';
}

function StringToXML(oString) {
  //code for IE
  if (window.ActiveXObject) {
    var oXML = new ActiveXObject("Microsoft.XMLDOM"); oXML.loadXML(oString);
    return oXML;
  }
  // code for Chrome, Safari, Firefox, Opera, etc. 
  else {
    return (new DOMParser()).parseFromString(oString, "text/xml");
  }
}

var blobToBase64 = function (blob, callback) {
  var reader = new FileReader();
  reader.onload = function () {
    var dataUrl = reader.result;
    var base64 = dataUrl.split(',')[1];
    callback(base64);
  };
  reader.readAsDataURL(blob);
};

function getParameterByName(name) {
  name = name.replace(/[\[]/, "\\[").replace(/[\]]/, "\\]");
  var regex = new RegExp("[\\?&]" + name + "=([^&#]*)"),
    results = regex.exec(location.search);
  return results === null ? "" : decodeURIComponent(results[1].replace(/\+/g, " "));
}

var redirect = function (url, time) {
  time = 2000 || time;
  setTimeout(() => {
    window.location.href = url;
  }, time);
}


var isMobile = {
  Android: function () {
    return navigator.userAgent.match(/Android/i);
  },
  BlackBerry: function () {
    return navigator.userAgent.match(/BlackBerry/i);
  },
  iOS: function () {
    return navigator.userAgent.match(/iPhone|iPad|iPod/i);
  },
  Opera: function () {
    return navigator.userAgent.match(/Opera Mini/i);
  },
  Windows: function () {
    return navigator.userAgent.match(/IEMobile/i);
  },
  any: function () {
    return (isMobile.Android() || isMobile.BlackBerry() || isMobile.iOS() || isMobile.Opera() || isMobile.Windows());
  }
};

var is_json = function (item) {
  item = typeof item !== "string"
    ? JSON.stringify(item)
    : item;

  try {
    item = JSON.parse(item);
  } catch (e) {
    return false;
  }

  if (typeof item === "object" && item !== null) {
    return true;
  }

  return false;
}

function base64ToBlob(base64) {

  if (base64.indexOf('data:application/pdf;base64') >= 0)
    base64 = base64.replace('data:application/pdf;base64,', '')

  var binary = atob(base64.replace(/\s/g, ''));
  var len = binary.length;
  var buffer = new ArrayBuffer(len);
  var view = new Uint8Array(buffer);
  for (var i = 0; i < len; i++) {
    view[i] = binary.charCodeAt(i);
  }

  // create the blob object with content-type "application/pdf"               
  var blob = new Blob([view], { type: "application/pdf" });
  var url = URL.createObjectURL(blob);
  return url;
}

function downloadFile(base64, fileName) {

  var url = base64ToBlob(base64);

  var a = document.createElement("a");
  a.href = url;
  a.download = fileName;
  a.click();
  window.URL.revokeObjectURL(url);
};

/** convertimos el formato regional sud a formato EPSG:3857 */
var convertToUniversalFormat = function (coordinate) {
  var firstProjection = '+proj=utm +zone=19 +south +datum=WGS84 +units=m +no_defs ';
  var secondProjection = "+proj=merc +a=6378137 +b=6378137 +lat_ts=0.0 +lon_0=0.0 +x_0=0.0 +y_0=0 +k=1.0 +units=m +nadgrids=@null +wktext  +no_defs";
  return proj4(firstProjection, secondProjection, JSON.parse("[" + coordinate + "]"));
}


////////////////////////////////////////////
var deleteBootbox = function (item, callback) {
  bootbox.confirm({
    title: '<i class="fa fa-exclamation-circle" aria-hidden="true"></i> Advertencia!',
    message: "Esta Seguro de Querer Eliminar. " + item + ".",
    buttons: {
      cancel: {
        label: '<i class="fa fa-times"></i> Cancelar'
      },
      confirm: {
        className: 'button-style pull-right',
        label: '<i class="fa fa-check"></i> Confirmar'
      }
    },
    callback: function (result) {
      //console.log('This was logged in the callback: ' + result);
      return callback(result)
    }
  });
}

var createBootbox = function (callback) {
  bootbox.confirm({
    title: '<i class="fa fa-exclamation-circle" aria-hidden="true"></i> Advertencia!',
    message: "Esta Seguro de Continuar.",
    buttons: {
      cancel: {
        label: '<i class="fa fa-times"></i> Cerrar'
      },
      confirm: {
        className: 'button-style pull-right',
        label: '<i class="fa fa-check"></i> Continuar'
      }
    },
    callback: function (result) {
      //console.log('This was logged in the callback: ' + result);
      return callback(result)
    }
  });
}

var confirmBootbox = function (item, callback) {
  bootbox.confirm({
    title: '<i class="fa fa-exclamation-circle" aria-hidden="true"></i> Advertencia!',
    message: "Esta seguro de la información proporcionada. Confirmada la informacin no podrá ser modificada?.",
    buttons: {
      cancel: {
        label: '<i class="fa fa-times"></i> Cancelar'
      },
      confirm: {
        className: 'button-style pull-right',
        label: '<i class="fa fa-check"></i> Confirmar'
      }
    },
    callback: function (result) {
      //console.log('This was logged in the callback: ' + result);
      return result
    }
  });
}

/**
 * 
 * @param {*} url_base 
 * @param {*} tipo_contribuyente  persona juridica (pjrl) o natural (sol)
 * @param {*} token 
 * @param {*} numero 
 * pw => previo, hace referencia a la pagina previo, donde debe retornar cuando termine la edicion
 */
var editLicenciaMiniBootbox = function (url_base, tipo_contribuyente, token, numero) {

  var contribuyente = tipo_contribuyente === "1" ? 'sol' : 'pjrl';
  var display_block = ""
  var detector = new window.MobileDetect(window.navigator.userAgent)
  if (Boolean(detector.mobile())) {
    display_block = "display: block!important; margin-left: -35px;"
  }

  var content = '<div class="row"> <div class="col-12"><ol class=" breakcrumb-solo" style="margin-top: 0px; margin-left: -30px;' + display_block + '">' +
    '<li class="active" >' +
    '<a href="' + url_base + '?edit=' + contribuyente + '&token=' + token + '&num=' + numero + '&call=pw" style="display: inline-flex;"><span class="paso2-active"></span>' +
    '<span class="texto">Datos del Contribuyente</span> </a>' +
    '</li>' +
    /*
    '<li class="active" >' +
    '<a href="' + url_base + '?edit=ds&token=' + token + '&num=' + numero + '&call=pw" style="display: inline-flex;"><span class="paso3-active"></span>' +
    '<span class="texto">Domicilio del Contribuyente</span></a>' +
    '</li>' +
    '<li class="active" >' +
    '<a href="' + url_base + '?edit=dae&token=' + token + '&num=' + numero + '&call=pw" style="display: inline-flex;"><span class="paso4-active"></span>' +
    '<span class="texto">Domicilio Actividad Económica</span></a>' +
    '</li>' +
    '</div></div>';
    */
  bootbox.dialog({
    title: '<i class="fa fa-exclamation-circle" aria-hidden="true"></i> Advertencia!',
    message: content,
    size: 'large',
    buttons: {
      cancel: {
        label: '<i class="fa fa-times"></i> Cancelar',
        className: 'btn-secondary',
        callback: function () {
          console.log('Custom cancel clicked');
        }
      }
    }
  });
}                                                                                                                                                                                                           

//presripcion
var editPrescripcionBootbox = function (url_base, token, is_data_contribuyente_complete,
  is_data_domicilio, is_data_objetoTributario //is_complete_data_domicilio_actividad_economica
  ) {
  //var contribuyente = tipo_contribuyente === "1" ? 'sol' : 'nat';
  var display_block = ""
  var detector = new window.MobileDetect(window.navigator.userAgent)
  if (Boolean(detector.mobile())) {
    display_block = "display: block!important; margin-left: -35px;"
  }

  var icon_data_contribuyente = '<i class="fa fa-check icon" aria-hidden="true" ></i>';
  if (!is_data_contribuyente_complete)
    icon_data_contribuyente = '<i class="fa fa-times icon" aria-hidden="true" ></i>';
  
  var icon_data_domicilio = '<i class="fa fa-check icon" aria-hidden="true" ></i>';
  if (!is_data_domicilio)
    icon_data_domicilio = '<i class="fa fa-times icon" aria-hidden="true" ></i>';

  var icon_data_objetoTributario = '<i class="fa fa-check icon" aria-hidden="true" ></i>';
  if (!is_data_objetoTributario)
  icon_data_objetoTributario = '<i class="fa fa-times icon" aria-hidden="true" ></i>';

  var icon_data_domicilio_actividad = '<i class="fa fa-check icon" aria-hidden="true" ></i>';
  //if (!is_complete_data_domicilio_actividad_economica)
    icon_data_domicilio_actividad = '<i class="fa fa-times icon" aria-hidden="true" ></i>';


  var content = '<div class="row"> <div class="col-12"><ol class=" breakcrumb-solo" style="margin-top: 0px; margin-left: -30px;' + display_block + '">' +
    '<li class="active" >' +
    '<a href="' + url_base + '?edit=pre&token=' + token + '" style="display: inline-flex;"><span class="paso2-active"></span>' +
    '<span class="texto">Datos del Contribuyente</span> ' +
    '<br/> ' + icon_data_contribuyente + '</a>' +
    '</li>' +
    '<li class="active" >' +
    '<a href="' + url_base + '?edit=dir&token=' + token +  '" style="display: inline-flex;"><span class="paso3-active"></span>' +
    '<span class="texto">Domicilio del Contribuyente</span>' +
    '<br/> ' + icon_data_domicilio + '</a>' +
    '</li>' +
    '<li class="active" >' +
    '<a href="' + url_base + '?edit=obj&token=' + token + '" style="display: inline-flex;"><span class="paso4-active"></span>' +
    '<span class="texto">Objeto Tributario</span></a>' +
    '<br/> ' + icon_data_objetoTributario + '</a>' +
    '</li>' +
    '<li class="active" >' +
    '<a href="' + url_base + '?edit=preview&token=' + token + '" style="display: inline-flex;"><span class="paso5-active"></span>' +
    '<span class="texto">Confirmación de Datos</span></a>' +
    '</li>' +
    
    '</div></div>';
    
  bootbox.dialog({
    title: '<i class="fa fa-exclamation-circle" aria-hidden="true"></i> Menu Edición!',
    message: content,
    size: 'large',
    buttons: {
      cancel: {
        label: '<i class="fa fa-times"></i> Cancelar',
        className: 'btn-secondary',
        callback: function () {
          console.log('Custom cancel clicked');
        }
      }
    }
  });
  
}



/**
 * 
 * @param {*} url_base 
 * @param {*} tipo_contribuyente  persona juridica (pjrl) o natural (sol)
 * @param {*} token 
 * @param {*} numero 
 * pw => previo, hace referencia a la pagina previo, donde debe retornar cuando termine la edicion
 */
var editLicenciaBootbox = function (url_base, tipo_contribuyente, token, numero, is_data_contribuyente_complete, 
                                    is_data_domicilio, is_complete_data_domicilio_actividad_economica) {
  var contribuyente = tipo_contribuyente === "1" ? 'sol' : 'pjrl';
  var display_block = ""
  var detector = new window.MobileDetect(window.navigator.userAgent)
  if (Boolean(detector.mobile())) {
    display_block = "display: block!important; margin-left: -35px;"
  }
  
  var icon_data_contribuyente = '<i class="fa fa-check icon" aria-hidden="true" ></i>';
  if(!is_data_contribuyente_complete )
    icon_data_contribuyente = '<i class="fa fa-times icon" aria-hidden="true" ></i>';

  var icon_data_domicilio = '<i class="fa fa-check icon" aria-hidden="true" ></i>';
  if(!is_data_domicilio )
    icon_data_domicilio = '<i class="fa fa-times icon" aria-hidden="true" ></i>';

  var icon_data_domicilio_actividad = '<i class="fa fa-check icon" aria-hidden="true" ></i>';
  if(!is_complete_data_domicilio_actividad_economica )
    icon_data_domicilio_actividad = '<i class="fa fa-times icon" aria-hidden="true" ></i>';

  var content = '<div class="row"> <div class="col-12"><ol class=" breakcrumb-solo" style="margin-top: 0px; margin-left: -30px;' + display_block + '">' +
    '<li class="active" >' +
    '<a href="' + url_base + '?edit=' + contribuyente + '&token=' + token + '&num=' + numero + '" style="display: inline-flex;"><span class="paso2-active"></span>' +
    '<span class="texto">Datos del Contribuyente</span> '+
    '<br/> '+icon_data_contribuyente+'</a>' +
    '</li>' +
    '<li class="active" >' +
    '<a href="' + url_base + '?edit=ds&token=' + token + '&num=' + numero + '" style="display: inline-flex;"><span class="paso3-active"></span>' +
    '<span class="texto">Domicilio del Contribuyente</span>' +
    '<br/> '+icon_data_domicilio+'</a>' +
    '</li>' +
    '<li class="active" >' +
    '<a href="' + url_base + '?edit=dae&token=' + token + '&num=' + numero + '" style="display: inline-flex;"><span class="paso4-active"></span>' +
    '<span class="texto">Domicilio Actividad Económica</span>' +
    '<br/> '+icon_data_domicilio_actividad+'</a>' +
    '</li>' +
    '<li class="active" >' +
    '<a href="' + url_base + '?edit=preview&token=' + token + '&num=' + numero + '" style="display: inline-flex;"><span class="paso5-active"></span>' +
    '<span class="texto">Confirmación de Datos</span></a>' +
    '</li>' +
    '</div></div>';
    
  bootbox.dialog({
    title: '<i class="fa fa-exclamation-circle" aria-hidden="true"></i> Menu Edición!',
    message: content,
    size: 'large',
    buttons: {
      cancel: {
        label: '<i class="fa fa-times"></i> Cancelar',
        className: 'btn-secondary',
        callback: function () {
          console.log('Custom cancel clicked');
        }
      }
    }
  });
}


////////////////////////////////////////////
//MAP
var _map = undefined;
//var vectorSource = undefined;
var createMap = function (_bound, _zoom) {
  //verificar si ya existe el mapa

  if (!jQuery('#mapUbicacionActividadEconomica').html()) {

    let coordinate = convertToUniversalFormat(_bound);

    var view = new window.ol.View({
      center: coordinate, //this.map.getView().getCenter(),
      zoom: _zoom //this.map.getView().getZoom()
    });

    //cargamos los layers         
    _map = new window.ol.Map({
      controls: window.ol.control.defaults().extend([
        new window.ol.control.FullScreen({
          source: 'fullscreen'
        })
      ]),
      layers: [
        new window.ol.layer.Tile({
          visible: true,
          preload: 3,
          source: new window.ol.source.BingMaps({
            //key: 'AqrKRjXqdcYpIvoXEH0qWRbAhZmcMl5nElhnK7N5SC608t0fvq5QDR-n8J6E0hpw',   //sandbox
            //key: 'As6MTtSOk0MOXTT9H5u2-GE3V7YP373c16lDruUPuY4cfmv6VkAZP1O9ofpMZiZz', //dev
            key: 'AuG9L5lfwKxdXrZs2i-5-vUtkyani5cBUXUud4omva2HHM653pa4Qjtba4_DtYT4',   //local
            imagerySet: 'AerialWithLabels',
          })
        })
      ],
      loadTilesWhileInteracting: true,
      view: view
    });
    _map.setTarget("mapUbicacionActividadEconomica");
    _map.getView().setCenter(coordinate);
    _map.getView().setZoom(_zoom);

    //var self = this
    setTimeout(() => {
      _map.getView().setCenter(coordinate);
      //_map.getView().setCenter([-7364557.60, -1966711.86]);
      _map.updateSize()
    }, 1500);
    return _map;
  }
}

var getImage = function (map, callback) {
  map.once('postcompose', function (event) {
    var canvas = event.context.canvas;
    if (navigator.msSaveBlob) {
      navigator.msSaveBlob(canvas.msToBlob(), 'map.png');
    } else {
      canvas.toBlob(function (blob) {
        var blobUrl = URL.createObjectURL(blob);
        window.blobToBase64(blob, function (img64) {
          if (Boolean(img64)) {
            return callback(img64);
          }
          return callback("");
        });
      });
    }
  });
  map.renderSync();
}

var paintIcon = function (coordinate, map) {

  let _coordinate = window.convertToUniversalFormat(coordinate);

  var vectorSource = new window.ol.source.Vector({
  });
  var vectorLayer = new window.ol.layer.Vector({
    source: vectorSource,
  });

  var iconFeature = new window.ol.Feature({
    geometry: new window.ol.geom.Point(_coordinate),
  });

  var iconStyle = [new window.ol.style.Style({
    image: new window.ol.style.Icon({
      anchor: [0.5, 0.5],
      anchorXUnits: 'fraction',
      anchorYUnits: 'fraction',
      src: 'http://maps.google.com/mapfiles/ms/micons/blue.png',
      crossOrigin: 'anonymous',
    })
  })];
  iconFeature.setStyle(iconStyle);
  vectorSource.addFeature(iconFeature);
  vectorLayer = new window.ol.layer.Vector({
    source: vectorSource,
  });
  map.addLayer(vectorLayer);

  /////////////////////
  //move to icon feature
  var translate1 = new window.ol.interaction.Translate({
    features: new window.ol.Collection([iconFeature])
  });

  map.addInteraction(translate1);

  map.getView().setCenter(_coordinate);
  map.updateSize()
}

import React, { Component } from 'react';
import Texto from '../../data/es';

const hereLayers = [
  {
    base: 'base',
    type: 'maptile',
    scheme: 'normal.day'
  },
  {
    base: 'base',
    type: 'maptile',
    scheme: 'normal.day.transit'
  },
  {
    base: 'base',
    type: 'maptile',
    scheme: 'pedestrian.day'
  },
  {
    base: 'aerial',
    type: 'maptile',
    scheme: 'terrain.day'
  },
  {
    base: 'aerial',
    type: 'maptile',
    scheme: 'satellite.day'
  },
  {
    base: 'aerial',
    type: 'maptile',
    scheme: 'hybrid.day'
  }
];

var container = undefined;
var content = undefined;
var closer = undefined;

var styles = [
  'Road',
  'RoadOnDemand',
  'Aerial',
  'AerialWithLabels',
  'collinsBart',
  'ordnanceSurvey',
];

class ModalDomicilio extends Component {

  constructor(props, context) {
    super(props, context);

    this.id_modal = "modalMapDomicilio";
    this.latitud = 0
    this.longitud = 0
    this.coordinate = "";
    this.layers = []
    //this.imagerySet = 'AerialWithLabels'

    this.handleCloseOnClick = this.handleCloseOnClick.bind(this);
    this.handleConfirmOnClick = this.handleConfirmOnClick.bind(this);
    this.hanldeMapOnChange = this.hanldeMapOnChange.bind(this)
    
    this.state = { center: [0, 0 ], zoom: 17 };
  }

  handleCloseOnClick(event) {
    event.preventDefault();
    this.latitud = 0
    this.longitud = 0
    this.coordinate = "";
  }

  handleConfirmOnClick(event) {
    event.preventDefault();
    if (Number(this.latitud) && Number(this.longitud)) {
      window.jQuery("input[name='domicilio[latitud]']").val(this.latitud);
      window.jQuery("input[name='domicilio[longitud]']").val(this.longitud);
      window.jQuery("input[name='domicilio[coordinate]']").val(this.coordinate);

      window.jQuery("#" + this.id_modal).modal("hide");

      this.map.once('postcompose', function (event) {
        var canvas = event.context.canvas;
        if (navigator.msSaveBlob) {
          navigator.msSaveBlob(canvas.msToBlob(), 'map.png');
        } else {
          canvas.toBlob(function (blob) {
            var blobUrl = URL.createObjectURL(blob);

            document.getElementById("domicilio[image]").src = blobUrl;  //img
            document.getElementById("domicilio[image]").style.width = '100%';
            window.blobToBase64(blob, function (img64) {
              if (Boolean(img64)) {
                document.getElementsByName('domicilio[image]')[0].value = img64; //input
              }
            });
          });
        }
      });
      this.map.renderSync();
    } else {
      /*toast.warn("Vuelva a Intentarlo, No Fue Posible Capturar las Coordenadas del Mapa", {
          position: "top-right",
          autoClose: 5000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true
      });*/
    }
  }

  componentDidMount() {

    container = document.getElementById('popup');
    content = document.getElementById('popup-content');
    closer = document.getElementById('popup-closer');

    window.jQuery(".linkHelpMD").popover({
      title: '<h3 class="custom-title"><i class="fa fa-map-marker"></i> Ayuda</h3>',
      content: '<p><img src="/static/img/plus_zoom.jpg" className="rounded z-depth-0" alt="zoom plus map" width="18px" /> Ampliar la imagen del mapa. <br />'+
               '<img src="/static/img/minus_zoom.jpg" className="rounded z-depth-0" alt="zoom plus map" width="18px" /> Reducir la imagen del mapa. <br/>'+
               '<img src="/static/img/full_screen.jpg" className="rounded z-depth-0" alt="zoom plus map" width="18px" /> Mapa en pantalla completa.<br/>'+
               '<img src="/static/img/search_map.jpg" className="rounded z-depth-0" alt="zoom plus map" width="18px" /> Buscar direcciones en el mapa por: <br/>'+
               '&nbsp;&nbsp; Ej. 1: "25 de mayo, Ayacucho, Cochabamba" <br/> '+
               '&nbsp;&nbsp; Ej. 2: Terminal de buses, cochabamba<br/> '+
               '&nbsp;&nbsp; Ej. 3: sombrero de chola, cochabamba <br/> '+
               '&nbsp;&nbsp; Ej. 4: plaza murillo, la paz </p>',
      html: true
    }); 

    var overlay = this.createOverlay();

    var view = new window.ol.View({
      center: this.state.center,
      zoom: this.state.zoom
    });

    //cargamos los layers
    var i, ii;
    for (i = 0, ii = styles.length; i < ii; ++i) {
      this.layers.push(new window.ol.layer.Tile({
        visible: styles[i] === 'AerialWithLabels' ? true : false,
        preload: Infinity,
        source: new window.ol.source.BingMaps({
          //key: 'As6MTtSOk0MOXTT9H5u2-GE3V7YP373c16lDruUPuY4cfmv6VkAZP1O9ofpMZiZz', //dev
          key: 'AuG9L5lfwKxdXrZs2i-5-vUtkyani5cBUXUud4omva2HHM653pa4Qjtba4_DtYT4',   //local
          imagerySet: styles[i]
        })
      }));
    }
    //la proyeccion por defecto es EPSG:3857
    this.map = new window.ol.Map({
      controls: window.ol.control.defaults().extend([
        new window.ol.control.FullScreen({
          source: 'fullscreen'
        })
      ]),
      /*layers: [   //default
        new window.ol.layer.Tile({
          preload: 3,
          source: new window.ol.source.OSM()
        }),
        //featuresLayer
      ],*/
      /*layers: [
        new window.ol.layer.Tile({
          visible: true,
          preload: 3,
          source: new window.ol.source.BingMaps({
            key: 'As6MTtSOk0MOXTT9H5u2-GE3V7YP373c16lDruUPuY4cfmv6VkAZP1O9ofpMZiZz',
            imagerySet: this.state.imagerySet,
          })
        })
      ],*/
      layers: this.layers,
      loadTilesWhileInteracting: true,
      //overlays: [overlay],  el popup
      //target: 'mapAddress',
      view: view
    });

    // Listen to map changes
    this.map.on("moveend", () => {
      let center = this.map.getView().getCenter();
      let zoom = this.map.getView().getZoom();
      this.setState({ center, zoom });
    });

    var self = this;

    var vectorSource = new window.ol.source.Vector({
    });
    var vectorLayer = new window.ol.layer.Vector({
      source: vectorSource,
    });

    this.map.on('singleclick', function (evt) {
      vectorSource.clear();
      var coordinate = evt.coordinate;
      var hdms = window.ol.coordinate.toStringHDMS(window.ol.proj.transform(
        coordinate, 'EPSG:3857', 'EPSG:4326'));

      var lat_lon = window.ol.proj.toLonLat(coordinate);  //devuelve longitud, latitud
      self.longitud = lat_lon[0]  //longitud
      self.latitud = lat_lon[1] //latitud
      self.coordinate = coordinate.toString()

      content.innerHTML = '<p>Tu estas aqui:</p><code>' + hdms + " <p> Lat: " + lat_lon[0] + " Long: " + lat_lon[1] + '</p> <p> Coordinate: ['+coordinate.toString()+']</p> </code>';
      overlay.setPosition(coordinate);
      self.paintIcon(coordinate, vectorSource, vectorLayer, self.map);
    });

    // para el puntero del raton
    this.map.on('pointerup', function(evt) {
      var pixel = self.map.getEventPixel(evt.originalEvent);

      self.map.forEachFeatureAtPixel(pixel, function(feature) {
          var coordinate = feature.getGeometry().getCoordinates()
          var lat_lon = window.ol.proj.toLonLat(coordinate);  //devuelve longitud, latitud
          self.longitud = lat_lon[0]  //longitud
          self.latitud = lat_lon[1] //latitud
          self.coordinate = coordinate.toString()
      });
  });

    //search map
    var geocoder = new window.Geocoder('nominatim', {
      provider: 'osm',
      lang: 'en',
      placeholder: 'Buscar por...',
      limit: 5,
      debug: false,
      autoComplete: true,
      keepOpen: true,
      featureStyle: null
    });
    
    this.map.addControl(geocoder);

    window.jQuery('#' + this.id_modal).on('show.bs.modal', function () {
      setTimeout(() => {
        if(self.props.coordinate === undefined || self.props.coordinate === "")
          self.setState({ center: [-7364539.872113073, -1966694.8795634112 ], zoom: 17 });  //default
        else{
          var coodinate = JSON.parse("[" + self.props.coordinate + "]")
          self.setState({ center: [coodinate[0], coodinate[1] ], zoom: 17 });  //coordenas para editar
        }
        self.map.updateSize()
      }, 1500);
    });
  }

  createOverlay() {
    var overlay = new window.ol.Overlay({
      element: container,
      autoPan: true,
      autoPanAnimation: {
        duration: 250
      }
    });

    closer.onclick = function () {
      overlay.setPosition(undefined);
      closer.blur();
      return false;
    };
    return overlay;
  }

  paintIcon(coordinate, vectorSource, vectorLayer, map){
    var iconFeature = new window.ol.Feature({
      geometry: new window.ol.geom.Point(coordinate),
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
  }

  componentDidUpdate() {
    this.map.setTarget("mapAddress");
    this.map.getView().setCenter(this.state.center);
    this.map.getView().setZoom(this.state.zoom);
  }


  hanldeMapOnChange(event){
    var style = event.target.value;
    for (var i = 0, ii = this.layers.length; i < ii; ++i) {
      this.layers[i].setVisible(styles[i] === style);
    }
  }

  render() {
    return (
      <div className="modal fade " id={this.id_modal} tabIndex="-1" role="dialog"
        aria-labelledby="exampleModalCenterTitle" aria-hidden="true" data-backdrop="static" data-keyboard="false">
        <div className="modal-dialog modal-lg" >
          <div className="modal-content">
            <div className="modal-header">
              <h5 className="modal-title" ><img src="/static/img/search_map.jpg" className="rounded z-depth-0" alt="zoom plus map" width="24px" /> Ubicación del Domicilio</h5>
              <button type="button" className="btn link-help linkHelpMD"  id="linkHelpMD" style={{position: 'absolute', right: '35px', top: '2px'}}><i className="fa fa-question" aria-hidden="true"></i></button>
              <button type="button" className="close" data-dismiss="modal" aria-label="Close" onClick={this.handleCloseOnClick}>
                <span aria-hidden="true">&times;</span>
              </button>
            </div>
            <div className="modal-body">
              <div className="row">

                <div id="fullscreen" className="fullscreen">
                  <div id="mapAddress" className="map-layer"></div>
                  <div id="popup" className="ol-popup">
                    <a href="#" id="popup-closer" className="ol-popup-closer"></a>
                    <div id="popup-content"></div>
                  </div>
                </div>
              </div>

              <div className="row">
                <div className="col-12 col-sm-12 col-md-3 col-lg-3">
                  <select id="layer-select" className="form-control" onChange={this.hanldeMapOnChange}>
                    <option key={1} value={"Aerial"} >{Texto.aerial}</option>
                    <option key={2} value={"AerialWithLabels"}  defaultValue>{Texto.aerial_with_label}</option>
                    <option key={3} value={"Road"} >{Texto.road_static}</option>
                    <option key={4} value={"RoadOnDemand"} >{Texto.road_dinamic}</option>
                  </select>

                  {/* https://openlayers.org/en/v4.6.5/examples/here-maps.html */}
                </div>
              </div>

              <div className="row">
                  <div className="col-12 col-md-12">
                    <mark><em className="text-left">{Texto.falsedad_de_datos_documento}</em></mark>
                  </div>
              </div>
            </div>
            <div className="modal-footer">
  
                <button type="button" className="btn link-help linkHelpMD"  id="linkHelpMD"><i className="fa fa-question-circle" aria-hidden="true"></i></button>
                <button type="button" className="btn btn-secondary" data-dismiss="modal" onClick={this.handleCloseOnClick}>Cerrar</button>
                  &nbsp;
                <input name="submit" type="button" className="button-style btn-disabled "
                          value="Confirmar" style={{ marginLeft: '0px' }} onClick={this.handleConfirmOnClick} />
            </div>
          </div>
        </div>
      </div>
    );
  }
}

export default ModalDomicilio;
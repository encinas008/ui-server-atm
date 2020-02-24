import React, { Component } from 'react';
import axios from 'axios';
//import { de } from 'date-fns/esm/locale';
import Fetch from '../../components/utils/Fetch';
import Texto from '../../data/es';
import { Link } from 'react-router-dom';

import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

var bounds = [788396.9511477941, 8059108.1417208575, 811711.388216491, 8090058.166346149];

var id_scale = 'scale';
var datos_distrito = {};
var projection;

var container = undefined;
var content = undefined;
var closer = undefined;
var _mapHidden = undefined
var capa_predios = undefined
var _cod_cat = undefined

class ModalMapActividadEconomica extends Component {

    constructor(props, context) {
        super(props, context);

        this.domicilioActividadEconomicaDb = null

        this.id_modal = "modalMapCatastro";
        this.url_root = 'http://192.168.105.219:6080/arcgis/services/'; //private
        //this.url_root = 'http://186.121.246.218:6080/arcgis/services/'; //public

        //this.url_root_search = 'http://192.168.105.219:6080/arcgis/rest/services/catastro/prediosWms/MapServer/0/'   //private
        //this.url_root_search = 'http://186.121.246.218:6080/arcgis/rest/services/catastro/prediosWms/MapServer/0/'   //public

        this.url_root_search = 'http://192.168.105.219:6080/arcgis/rest/services/'   //private
        //this.url_root_search = 'http://186.121.246.218:6080/arcgis/rest/services/'   //public  219

        this.format = 'image/png';

        this.predio = 0
        this.catastro = 0
        this.latitud = 0
        this.longitud = 0
        this.coordinate = ""
        this.zona = 0
        this.comuna = ""
        this.distrito = ""
        this.sub_distrito = ""
        this.num_inmueble = 0

        this.handleCloseOnClick = this.handleCloseOnClick.bind(this);
        this.handleConfirmOnClick = this.handleConfirmOnClick.bind(this);

        this.state = { center: [0, 0], zoom: 18 };

        this.fetch = new Fetch();
        this.fetch.setToast(toast);
    }

    componentDidMount() {
        console.log("props ", this.props.toast);
        container = document.getElementById('popup');
        content = document.getElementById('popup-content');
        closer = document.getElementById('popup-closer');
        this.renderMap();

        window.jQuery(".linkHelpMAE").popover({
            title: '<h3 class="custom-title"><i class="fa fa-map-marker"></i> Ayuda</h3>',
            content: '<p><img src="/static/img/plus_zoom.jpg" className="rounded z-depth-0" alt="zoom plus map" width="18px" /> Ampliar la imagen del mapa. <br />'+
                     '<img src="/static/img/minus_zoom.jpg" className="rounded z-depth-0" alt="zoom plus map" width="18px" /> Reducir la imagen del mapa. <br/>'+
                     '<img src="/static/img/full_screen.jpg" className="rounded z-depth-0" alt="zoom plus map" width="18px" /> Mapa en pantalla completa.<br/>'+
                     '<img src="/static/img/search_map.jpg" className="rounded z-depth-0" alt="zoom plus map" width="18px" /> Buscar en el mapa por: <br/>'+
                     "<strong>Unifamilar(es)</strong><br/>"+
                     '&nbsp;&nbsp;<strong>Nro. Inmuble RUAT:</strong> 12XXX <br/>'+
                     '&nbsp;&nbsp;<strong>Cod. Cat:</strong> 24-XXX-XXX-X-XX.... <br/>'+
                     '&nbsp;&nbsp;<strong>Vías:</strong> Av. Ayacucho</p>'+
                     "<strong>Propiedades Horizontales (PH)</strong> <br/>"+
                     '&nbsp;&nbsp;<strong>Cod. Cat:</strong> 12-XXX-XXX-X <br/>'+   //12-065-002-1
                     '&nbsp;&nbsp;<strong>Vías:</strong> Av. Ayacucho</p>',
            html: true
        });
    }

    componentDidUpdate() {
        //this.map.setTarget("map");
        //this.map.getView().setZoom(this.state.zoom);
    }

    handleCloseOnClick(event) {
        event.preventDefault();

        this.predio = 0
        this.catastro = 0
        this.latitud = 0
        this.longitud = 0
        this.coordinate = ""
        this.zona = 0
        this.comuna = ""
        this.distrito = ""
        this.sub_distrito = ""
        this.num_inmueble = 0

        document.getElementById("mapUbicacionActividadEconomica").innerHTML = "";
        _mapHidden = undefined
    }

    handleConfirmOnClick(event) {
        event.preventDefault();
        if (Number(this.latitud) && Number(this.longitud) && _mapHidden !== undefined) {
            window.jQuery("input[name='actividad_economica[predio]']").val(this.predio);
            window.jQuery("input[name='actividad_economica[catastro]']").val(this.catastro);

            window.jQuery("input[name='domicilio_actividad_economica[latitud]']").val(this.latitud);
            window.jQuery("input[name='domicilio_actividad_economica[longitud]']").val(this.longitud);
            window.jQuery("input[name='domicilio_actividad_economica[coordinate]']").val(this.coordinate);
            window.jQuery("input[name='domicilio_actividad_economica[zona]']").val(this.zona);

            window.jQuery("input[name='actividad_economica[comuna]']").val(this.comuna);
            window.jQuery("input[name='actividad_economica[distrito]']").val(this.distrito);
            window.jQuery("input[name='actividad_economica[sub_distrito]']").val(this.sub_distrito);
            window.jQuery("input[name='actividad_economica[num_inmueble]']").val(this.num_inmueble);

            window.jQuery("#spanDistrito").text(this.distrito);
            window.jQuery("#spanSubDistrito").text(this.sub_distrito);
            window.jQuery("#spanComuna").text(this.comuna);
            window.jQuery("#spanZonaTributaria").text(this.zona);

            var self = this
            window.paintIcon( this.coordinate , _mapHidden)
            setTimeout(() => {
                window.getImage(_mapHidden, function(image64){
                    document.getElementById('domicilio_actividad_economica[image]').src = 'data:image/png;base64, ' +image64; //input
                    document.getElementsByName('domicilio_actividad_economica[image]')[0].value = image64; //input
                    document.getElementById("mapUbicacionActividadEconomica").innerHTML = "";
                    _mapHidden = undefined
                    window.jQuery("#" + self.id_modal).modal("hide");
                });
            }, 300);
        }else{
            toast.warn("Vuelva a Intentarlo, No Fue Posible Capturar las Coordenadas del Mapa", {
                position: "top-right",
                autoClose: 5000,
                hideProgressBar: false,
                closeOnClick: true,
                pauseOnHover: true,
                draggable: true
            });
        }
    }

    renderMap() {

        var capa_base = new window.ol.layer.Tile({
            source: new window.ol.source.TileWMS({
                url: this.url_root + 'imagenes/imagen2018_500/MapServer/WMSServer',
                params: {
                    'LAYERS': '0',
                    'VERSION': '1.1.1',
                    'FORMAT': 'image/png',
                    'TILED': true
                },
                serverType: 'mapserver',
            })
        });

        var capa_vias = new window.ol.layer.Image({
            source: new window.ol.source.ImageWMS({
                ratio: 1,
                url: this.url_root + 'planificacion/viasWms/MapServer/WMSServer',  //ok
                params: {
                    'FORMAT': this.format,
                    'VERSION': '1.1.1',
                    'LAYERS': '0',
                    'STYLES': '',
                },
            })
        });

        capa_predios = new window.ol.layer.Image({
            source: new window.ol.source.ImageWMS({
                ratio: 1,
                //url: this.url_root + 'catastro/prediosWms/MapServer/WMSServer',//ok
                url: this.url_root + 'recaudaciones/prediosWmsAE/MapServer/WMSServer',//ok
                params: {
                    'FORMAT': this.format,
                    'VERSION': '1.1.1',
                    'LAYERS': '0',
                    'STYLES': '',
                }
            })
        });

        /**
         * enu => the default easting, northing
         * neu => northing, easting
         * up => useful for "lat/long
         * wnu - westing, northing
         */
        projection = new window.ol.proj.Projection({
            code: 'EPSG:32719',  //32719  4326  EPSG:3857
            units: 'm',
            axisOrientation: 'neu'    //neu
        });

        this.overlay = this.createOverlay();

        this.map = new window.ol.Map({
            controls: window.ol.control.defaults().extend([
                new window.ol.control.FullScreen({
                    source: 'fullscreen'
                })
            ]),
            layers: [
                capa_base, capa_predios, capa_vias
            ],
            renderer: 'canvas',
            overlays: [this.overlay],
            view: new window.ol.View({
                projection: projection,
            })
        });

        this.map.getView().fit(bounds, this.map.getSize());
        this.map.getView().setResolution(this.map.getView().getResolution());

        var self = this;
        this.map.getView().on('change:resolution', function (evt) {

            var resolution = evt.target.get('resolution');
            var units = self.map.getView().getProjection().getUnits();
            var dpi = 25.4 / 0.28;
            var mpu = window.ol.proj.METERS_PER_UNIT[units];
            var scale = resolution * mpu * 39.37 * dpi;
            //var scale1 = resolution * mpu * 39.37 * dpi;
            if (scale >= 9500 && scale <= 950000) {
                scale = Math.round(scale / 1000) + "K";
            } else if (scale >= 950000) {
                scale = Math.round(scale / 1000000) + "M";
            } else {
                scale = Math.round(scale);
            }
        });
        var vectorSource = new window.ol.source.Vector({  // Creación del vector source generico
        });
        var vectorLayer = new window.ol.layer.Vector({
            source: vectorSource,
        });
        this.map.on('click', (obj) => {

            var coordinate = obj.coordinate;
            self.getDatosDistritoMap(self, coordinate, undefined, vectorSource, vectorLayer)
            self.map.getView().setZoom(self.state.zoom);
            self.map.updateSize()

            if(_mapHidden === undefined)
                _mapHidden = window.createMap(coordinate, self.state.zoom);
        });

        // para el puntero del raton
        this.map.on('pointerup', function(evt) {
            var pixel = self.map.getEventPixel(evt.originalEvent);

            self.map.forEachFeatureAtPixel(pixel, function(feature) {
                var coordinate = feature.getGeometry().getCoordinates()
                self.getDatosDistritoMap(self, coordinate, undefined, vectorSource, vectorLayer)

                if(_mapHidden === undefined)
                    _mapHidden = window.createMap(coordinate, self.state.zoom);
            });
        });

        this.searchMapControl(self, vectorSource, vectorLayer)

        window.jQuery('#' + this.id_modal).on('show.bs.modal', function () {
            setTimeout(() => {
                self.setState({ zoom: self.state.zoom });  //createOverlay() -7235766.90, -1920825.04
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

    searchMapControl(self, vectorSource, vectorLayer) {
        var result_ul = document.createElement('ul');
        result_ul.className = 'ul-result-catastro';

        var boton = document.createElement('button');
        boton.innerHTML = '';
        boton.className = 'fa fa-search';
        boton.addEventListener('click', function () {
            window.jQuery("#map-input-query").hasClass("hide") ? window.jQuery("#map-input-query").removeClass("hide"): window.jQuery("#map-input-query").addClass("hide");
            window.jQuery("#map-a-reset").hasClass("hide") ? window.jQuery("#map-a-reset").removeClass("hide") : window.jQuery("#map-a-reset").addClass("hide");
            window.jQuery("#map-select-option").hasClass("hide") ? window.jQuery("#map-select-option").removeClass("hide") : window.jQuery("#map-select-option").addClass("hide");
            window.jQuery(".ul-result-catastro").hasClass("hide") ? window.jQuery(".ul-result-catastro").removeClass("hide") : window.jQuery(".ul-result-catastro").addClass("hide");
        });

        var input = document.createElement('input');
        input.setAttribute('id', 'map-input-query')
        input.setAttribute('class', 'gcd-gl-input hide')
        input.setAttribute('autocomplete', 'off')
        input.setAttribute('placeholder', 'Ingrese nro de inmuble RUAT...')
        input.setAttribute('type', 'text')
        input.addEventListener('keyup', function (event) {

            let value = event.target.value
            let select_option = window.jQuery("#map-select-option option:selected")[0];
            if (select_option.value === "Cod. Cat.") {
                if (value.length >= 3 && value.length <= 17) {
                    value = ('00' + value).replace(/-/g, '');  //for old version
                    //value = (value).replace(/-/g, '');
                    const predios = self.fetch.fetchGetExternal(`${self.url_root_search}catastro/prediosWms/MapServer/0/query?where=CodCat+like+%27${value}%25%27&text=&objectIds=&time=&geometry=&geometryType=esriGeometryEnvelope&inSR=&spatialRel=esriSpatialRelContains&relationParam=&outFields=&returnGeometry=true&returnTrueCurves=false&maxAllowableOffset=&geometryPrecision=&outSR=&returnIdsOnly=false&returnCountOnly=false&orderByFields=&groupByFieldsForStatistics=&outStatistics=&returnZ=false&returnM=false&gdbVersion=&returnDistinctValues=false&resultOffset=&resultRecordCount=&f=pjson`);  //old version
                    //const predios = self.fetch.fetchGetExternal(`${self.url_root_search}recaudaciones/prediosWmsAE/MapServer/0/query?where=CodCat+like+%27%25${value}%25%27&text=&objectIds=&time=&geometry=&geometryType=esriGeometryEnvelope&inSR=&spatialRel=esriSpatialRelIntersects&relationParam=&outFields=&returnGeometry=true&returnTrueCurves=false&maxAllowableOffset=&geometryPrecision=&outSR=&returnIdsOnly=false&returnCountOnly=false&orderByFields=&groupByFieldsForStatistics=&outStatistics=&returnZ=false&returnM=false&gdbVersion=&returnDistinctValues=false&resultOffset=&resultRecordCount=&f=pjson`);

                    predios.then(res => {
                        self.loadFeatures(res, result_ul, vectorSource, vectorLayer, self, false)
                    })
                }
            }

            if (select_option.value === "RUAT") {
                if (value.length >= 3 && value.length <= 6) {
                    value = '00' + value;
                    const predios = self.fetch.fetchGetExternal(`${self.url_root_search}catastro/prediosWms/MapServer/0/query?where=NoInmueble+=+%27${value}%27&text=&objectIds=&time=&geometry=&geometryType=esriGeometryEnvelope&inSR=&spatialRel=esriSpatialRelContains&relationParam=&outFields=&returnGeometry=true&returnTrueCurves=false&maxAllowableOffset=&geometryPrecision=&outSR=&returnIdsOnly=false&returnCountOnly=false&orderByFields=&groupByFieldsForStatistics=&outStatistics=&returnZ=false&returnM=false&gdbVersion=&returnDistinctValues=false&resultOffset=&resultRecordCount=&f=pjson`);  //ol version
                    //const predios = self.fetch.fetchGetExternal(`${self.url_root_search}recaudaciones/prediosWmsAE/MapServer/0/query?where=NoInmueble+%3D+%27${value}%27&text=&objectIds=&time=&geometry=&geometryType=esriGeometryEnvelope&inSR=&spatialRel=esriSpatialRelIntersects&relationParam=&outFields=&returnGeometry=true&returnTrueCurves=false&maxAllowableOffset=&geometryPrecision=&outSR=&returnIdsOnly=false&returnCountOnly=false&orderByFields=&groupByFieldsForStatistics=&outStatistics=&returnZ=false&returnM=false&gdbVersion=&returnDistinctValues=false&resultOffset=&resultRecordCount=&f=pjson`);
                    predios.then(res => {
                        self.loadFeatures(res, result_ul, vectorSource, vectorLayer, self, false)
                    })
                }
            }

            if (select_option.value === "Vías") {
                if (value.length >= 3) {
                    const inmueble = self.fetch.fetchGetExternal(`${self.url_root_search}planificacion/vias/MapServer/0/query?f=json&where=UPPER(Nombre_V)%20LIKE%20%27%25${value.toUpperCase()}%25%27&returnGeometry=true&spatialRel=esriSpatialRelIntersects&maxAllowableOffset=0.13229193125052918&outFields=*&outSR=32719&resultRecordCount=6`);
                    //const inmueble = self.fetch.fetchGetExternal(`${self.url_root_search}recaudaciones/prediosWmsAE/MapServer/0/query?where=UPPER(Nombre_V)+LIKE+%27%25${value}%25%27&text=&objectIds=&time=&geometry=&geometryType=esriGeometryEnvelope&inSR=&spatialRel=esriSpatialRelIntersects&relationParam=&outFields=&returnGeometry=true&returnTrueCurves=false&maxAllowableOffset=&geometryPrecision=&outSR=&returnIdsOnly=false&returnCountOnly=false&orderByFields=&groupByFieldsForStatistics=&outStatistics=&returnZ=false&returnM=false&gdbVersion=&returnDistinctValues=false&resultOffset=&resultRecordCount=&f=pjson`);
                    inmueble.then(res => {
                        self.loadFeatures(res, result_ul, vectorSource, vectorLayer, self, true)
                    })
                }
            }
        });

        var reset = document.createElement('a');
        reset.setAttribute('id', 'map-a-reset')
        reset.className = 'gcd-gl-reset fa fa-times hide';
        reset.addEventListener('click', function (event) {
            window.jQuery("#map-input-query").val("")
        });

        var select = document.createElement('select');
        select.setAttribute('id', 'map-select-option')
        select.className = 'hide';
        select.addEventListener('change', function (event) {
            input.value = ""
            if(event.target.value === 'RUAT')
                input.setAttribute('placeholder', 'Ingrese nro de inmuble RUAT...')
            if(event.target.value === 'Vías')
                input.setAttribute('placeholder', 'Ingrese nombre de la vía...')
            if(event.target.value === 'Cod. Cat.')
                input.setAttribute('placeholder', 'Ingrese cádigo catastral...')
        })

        var array = ["RUAT", "Cod. Cat.", 'Vías'];  //Nro Inmueble = Ruat

        for (var i = 0; i < array.length; i++) {
            var option = document.createElement("option");
            option.value = array[i];
            option.text = array[i];
            select.appendChild(option);
        }

        var elementoDiv = document.createElement('div');
        elementoDiv.className = 'boton-search-catastro ol-unselectable ol-control';
        elementoDiv.appendChild(boton);
        elementoDiv.appendChild(select);
        elementoDiv.appendChild(input);
        elementoDiv.appendChild(reset);
        elementoDiv.appendChild(result_ul);

        var searchControl = new window.ol.control.Control({ element: elementoDiv });
        this.map.addControl(searchControl);
    }

    loadFeatures(res, result_ul, vectorSource, vectorLayer, self, isVias){
        if (res !== undefined && res.hasOwnProperty('features')) {
            let list_features = res.features;  //lista de predios por codigo catastral
            window.jQuery(result_ul).empty();

            const listItems = list_features.map((features) => {
                let coordinate = undefined
                let polygon = undefined
                if(isVias){
                    coordinate = features.geometry.paths[0][0]
                    polygon = features.geometry.paths[0]
                }else{
                    polygon = features.geometry.rings[0]
                    coordinate = features.geometry.rings[0][0]
                }

                var li = document.createElement("li");
                var link_a = document.createElement('a');
                link_a.setAttribute("href", "#");
                link_a.setAttribute("coordinate", coordinate)
                link_a.addEventListener('click', function (event) {
                    vectorSource.clear();
                    if(isVias){
                        self.longitud = 0  //longitud
                        self.latitud = 0 //latitud
                        //let bounds = JSON.parse("[" + event.target.parentElement.getAttribute("coordinate") + "]")  
                        let bounds = JSON.parse("[" + link_a.getAttribute('coordinate') + "]") 
                        self.map.getView().setCenter(bounds);
                        self.map.updateSize()
                        self.paintIcon(coordinate, vectorSource, vectorLayer, self.map)
                    }else{

                        self.getDatosDistritoMap(self, coordinate, polygon, vectorSource, vectorLayer)
                        if(_mapHidden === undefined)
                            _mapHidden = window.createMap(coordinate, self.state.zoom);
                    }
                });

                let _span = document.createElement("span");
                _span.className = "gcd-road"
                if(isVias)
                    _span.innerHTML = features.attributes.Nombre_V
                else{
                    _cod_cat = features.attributes.CodCat
                    _span.innerHTML = features.attributes.CodCat
                }

                link_a.appendChild(_span);

                var link_search = document.createElement('i');
                link_search.className = "fa fa-map-marker pull-right"
                link_search.style = "padding: 0px 5px; cursor: pointer; color: #007bff;"
                link_search.ariaHidden = "true"

                link_search.addEventListener('click', function (event) {
                    link_a.click();
                });

                li.appendChild(link_a);
                li.appendChild(link_search);
                result_ul.appendChild(li);
            });

            if (result_ul.getElementsByTagName("li").length > 0){
                result_ul.style.display = "block"
                result_ul.classList.remove("hide")
            }
        }
        if (res !== undefined && res.hasOwnProperty('error')) {
            toast.warn(res.error.message, {
                position: "top-right",
                autoClose: 5000,
                hideProgressBar: false,
                closeOnClick: true,
                pauseOnHover: true,
                draggable: true
            });
        }
    }

    getDatosDistritoMap(self, coordinate, polygon, vectorSource, vectorLayer){
        var view = self.map.getView();
        var viewResolution = view.getResolution();
        var source = capa_predios.getSource();
        var url = source.getGetFeatureInfoUrl(coordinate,
            viewResolution,
            view.getProjection(),
            { 'INFO_FORMAT': 'application/json', 'FEATURE_COUNT': 50 }
        );

        self.getDatosDistrito(url, self.map, vectorSource, vectorLayer, coordinate, polygon);
    }

    //getDatosDistrito(url, map, obj, vectorSource, vectorLayer, coordinate) {
    getDatosDistrito(url, map, vectorSource, vectorLayer, coordinate, polygon) {
        var self = this;
        axios.get(url)
            .then((response) => {
                
                vectorSource.clear();
                var lat_lon = window.ol.proj.toLonLat(coordinate);  //coordinate.toString()

                var content_overlay = "";

                var xml = window.StringToXML(response.data.replace(/ó/g, 'o').replace(/Nro./g, 'Nro_'));
                datos_distrito = {}

                if (xml.getElementsByTagName('FIELDS').length > 1) {

                    for(let i=0; i<xml.getElementsByTagName('FIELDS').length; i++){
                        console.log(xml.getElementsByTagName('FIELDS')[i].getAttributeNode("Nro_Inmueble").value);
                        if(xml.getElementsByTagName('FIELDS')[i].getAttributeNode("CodigoCatastral").value === _cod_cat){
                            datos_distrito = {
                                codCatastral: xml.getElementsByTagName('FIELDS')[i].getAttributeNode("CodigoCatastral").value,
                                comuna: xml.getElementsByTagName('FIELDS')[i].getAttributeNode("Comuna").value,
                                distrito: xml.getElementsByTagName('FIELDS')[i].getAttributeNode("Distrito").value,
                                nroSubDistrito: xml.getElementsByTagName('FIELDS')[i].getAttributeNode("Nro_Subdistrito").value,
                                subDistrito: xml.getElementsByTagName('FIELDS')[i].getAttributeNode("Subdistrito").value,
                                nroPredio: xml.getElementsByTagName('FIELDS')[i].getAttributeNode("Nro_predio").value,
                                zonaTributaria: xml.getElementsByTagName('FIELDS')[i].getAttributeNode("ZTributari").value,
                                superficie: xml.getElementsByTagName('FIELDS')[i].getAttributeNode("Shape_Leng").value,  //Shape.STArea Shape_Leng
                                nroInmueble: xml.getElementsByTagName('FIELDS')[i].getAttributeNode("Nro_Inmueble").value,
                            }
                        }
                    }
                }else{
                    if (xml.getElementsByTagName('FIELDS').length === 1) {
                        datos_distrito = {
                            codCatastral: xml.getElementsByTagName('FIELDS')[0].getAttributeNode("CodigoCatastral").value,
                            comuna: xml.getElementsByTagName('FIELDS')[0].getAttributeNode("Comuna").value,
                            distrito: xml.getElementsByTagName('FIELDS')[0].getAttributeNode("Distrito").value,
                            nroSubDistrito: xml.getElementsByTagName('FIELDS')[0].getAttributeNode("Nro_Subdistrito").value,
                            subDistrito: xml.getElementsByTagName('FIELDS')[0].getAttributeNode("Subdistrito").value,
                            nroPredio: xml.getElementsByTagName('FIELDS')[0].getAttributeNode("Nro_predio").value,
                            zonaTributaria: xml.getElementsByTagName('FIELDS')[0].getAttributeNode("ZTributari").value,
                            superficie: xml.getElementsByTagName('FIELDS')[0].getAttributeNode("Shape_Leng").value,  //Shape.STArea Shape_Leng
                            nroInmueble: xml.getElementsByTagName('FIELDS')[0].getAttributeNode("Nro_Inmueble").value,
                        }
                    }
                }

                if(Object.entries(datos_distrito).length !== 0 ){
                    
                    self.predio = datos_distrito.nroPredio
                    self.catastro = datos_distrito.codCatastral
                    self.zona = datos_distrito.zonaTributaria
                    self.comuna = datos_distrito.comuna
                    self.distrito = datos_distrito.distrito
                    self.sub_distrito = datos_distrito.subDistrito
                    self.num_inmueble = datos_distrito.nroInmueble

                    content_overlay = "<p style='margin-bottom: 0rem!important; margin-top: 5px;'><strong>Catastro: </strong> <span>" + datos_distrito.codCatastral + "</span></p>" +
                        "<p style='margin-bottom: 0rem!important; '><strong>Predio: </strong> <span>" + datos_distrito.nroPredio + "</span></p>" +
                        "<p style='margin-bottom: 0rem!important; '><strong>Comuna: </strong> <span>" + datos_distrito.comuna + "</span></p>" +
                        "<p style='margin-bottom: 0rem!important; '><strong>Distrito: </strong> <span>" + datos_distrito.distrito + "</span></p>" +
                        "<p style='margin-bottom: 0rem!important; '><strong>Sub Distrito: </strong> <span>" + datos_distrito.subDistrito + "</span></p>" +
                        "<p style='margin-bottom: 0rem!important; '><strong>Nro. Sub Distrito: </strong> <span>" + datos_distrito.nroSubDistrito + "</span></p>" +
                        "<p style='margin-bottom: 0rem!important; '><strong>Zona Tributaria: </strong> <span>" + datos_distrito.zonaTributaria + "</span></p>" +
                        "<p style='margin-bottom: 0rem!important; '><strong>Superficie: </strong> <span>" + datos_distrito.superficie + "</span></p>" +
                        "<p style='margin-bottom: 0rem!important; '><strong>Nro. inmueble: </strong> <span>" + datos_distrito.nroInmueble + "</span></p>";
                }

                content.innerHTML = '<strong>Actividad Económica:</strong><code> ' + content_overlay + '</code>';

                if(polygon !== undefined){
                    coordinate = this.paintPredio(polygon, vectorSource, self.map, self.num_inmueble )
                }
                self.overlay.setPosition(coordinate);
                this.paintIcon(coordinate, vectorSource, vectorLayer, self.map)

                self.map.getView().setCenter(coordinate);

                self.longitud = 0  //longitud
                self.latitud = 0 //latitud

                if(Object.entries(datos_distrito).length !== 0 ){
                    var lat_lon = window.ol.proj.toLonLat(coordinate);  //devuelve longitud, latitud
                    self.longitud = lat_lon[0]  //longitud
                    self.latitud = lat_lon[1] //latitud
                    self.coordinate = coordinate.toString()
                }
            })
            .catch((error) => {
                console.log(error.config);
            });
    }

    paintIcon(coordinate, vectorSource, vectorLayer, map) {

        //window.ol.proj.transform([coordinate[0], coordinate[1]], 'EPSG:4326', 'EPSG:3857')
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

        //move to icon feature
        var translate1 = new window.ol.interaction.Translate({
            features: new window.ol.Collection([iconFeature])
        });

        map.addInteraction(translate1);
    }

    paintPredio(polygon, vectorSource, map, num_inmueble){

        var featurePoligono = new window.ol.Feature({
            geometry: new window.ol.geom.Polygon([polygon]),
            name: num_inmueble
        });
        featurePoligono.setStyle(styleFunctionPoligono);

        function styleFunctionPoligono() {
            return [
                new window.ol.style.Style({
                    fill: new window.ol.style.Fill({
                        color: '#B3EEFF',//'rgba(255,255,255,0.4)'
                    }),
                    stroke: new window.ol.style.Stroke({
                        color: '#B3EEFF',
                        width: 1.25
                    }),
                    text: new window.ol.style.Text({
                        font: '10px Calibri,sans-serif',
                        fill: new window.ol.style.Fill({color: '#000'}),
                        stroke: new window.ol.style.Stroke({
                            color: '#fff', width: 2
                        }),
                        text: map.getView().getZoom() > 15 ? num_inmueble : ''
                    })
                })
            ];
        }
        vectorSource.addFeature(featurePoligono);
        var aa = featurePoligono.getGeometry().getExtent();
        return window.ol.extent.getCenter(aa);
        
    }

    render() {
        return (
            <div className="modal fade " id={this.id_modal} tabIndex="-1" role="dialog"
                aria-labelledby="exampleModalCenterTitle" aria-hidden="true" data-backdrop="static" data-keyboard="false">
                <div className="modal-dialog modal-lg" >
                    <div className="modal-content">
                        <div className="modal-header">
                            <h5 className="modal-title" id="exampleModalLongTitle"><img src="/static/img/search_map.jpg" className="rounded z-depth-0" alt="zoom plus map" width="24px" /> Ubicación de la Actividad Económica</h5>
                            <button type="button" className="btn link-help linkHelpMAE"  id="linkHelpMAE" style={{position: 'absolute', right: '35px', top: '2px'}}><i className="fa fa-question" aria-hidden="true"></i></button>
                            <button type="button" className="close" data-dismiss="modal" aria-label="Close" onClick={this.handleCloseOnClick}>
                                <span aria-hidden="true">&times;</span>
                            </button>
                        </div>
                        <div className="modal-body">
                            <div className="row">
                                <div id="fullscreen" className="fullscreen">
                                    <div id="map" className="map-layer">
                                        <div id="popup" className="ol-popup">
                                            <a href="#" id="popup-closer" className="ol-popup-closer"></a>
                                            <div id="popup-content"></div>
                                        </div>
                                    </div>
                                </div>

                                <div id="wrapper">
                                    <div id="location"></div>
                                </div>
                            </div>

                            <div className="row">
                                <div className="col-12 col-md-12">
                                    <mark><em className="text-left">{Texto.falsedad_de_datos_documento}</em></mark>
                                </div>
                            </div>
                        </div>
                        <div className="modal-footer">
                            <button type="button" className="btn link-help linkHelpMAE"  id="linkHelpMAE"><i className="fa fa-question-circle" aria-hidden="true"></i></button>
                            <button type="button" className="btn btn-secondary" data-dismiss="modal" onClick={this.handleCloseOnClick}>Cerrar</button>
                            <input name="submit" type="button" className="button-style btn-disabled pull-left"
                                    value="Confirmar" style={{ marginLeft: '0px' }} onClick={this.handleConfirmOnClick} />
                        </div>
                    </div>
                </div>
            </div>
        );
    }
}

export default ModalMapActividadEconomica;
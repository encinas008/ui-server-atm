import React, { Component } from 'react';
import axios from 'axios';
import { de } from 'date-fns/esm/locale';
import Fetch from '../../components/utils/Fetch';

import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

//import Config from '../../data/config';

//var format = 'image/png';
var bounds = [788396.9511477941, 8059108.1417208575, 811711.388216491, 8090058.166346149];
//var bounds = [798437.6481188739, 8069225.024614312];


var id_scale = 'scale';
var datos_distrito = {};
var projection;

var container = undefined;
var content = undefined;
var closer = undefined;

class ModalMapActividadEconomica extends Component {

    constructor(props, context) {
        super(props, context);

        this.domicilioActividadEconomicaDb = null

        this.id_modal = "modalMapCatastro";
        this.url_root = 'http://192.168.105.219:6080/arcgis/services/'; //private
        //this.url_root = 'http://186.121.246.218:6080/arcgis/services/'; //public

        this.url_root_search = 'http://192.168.105.219:6080/arcgis/rest/services/catastro/prediosWms/MapServer/0/'   //private
        //this.url_root_search = 'http://186.121.246.218:6080/arcgis/rest/services/catastro/prediosWms/MapServer/0/'   //public

        this.format = 'image/png';

        this.predio = 0
        this.catastro = 0
        this.latitud = 0
        this.longitud = 0
        this.coordinate = ""
        this.superficie = 0
        this.zona = 0

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
    }


    componentDidUpdate() {
        this.map.setTarget("map");
        this.map.getView().setZoom(this.state.zoom);
    }

    handleCloseOnClick(event) {
        event.preventDefault();

        this.predio = 0
        this.catastro = 0
        this.latitud = 0
        this.longitud = 0
        this.coordinate = ""
        this.superficie = 0
        this.zona = 0

        document.getElementById('btn_domicilio_actividad_economica_mapa').classList.add('btn-outline-success');
    }

    handleConfirmOnClick(event) {
        event.preventDefault();
        if (Number(this.latitud) && Number(this.longitud)) {
            window.jQuery("input[name='actividad_economica[predio]']").val(this.predio);
            window.jQuery("input[name='actividad_economica[catastro]']").val(this.catastro);

            window.jQuery("input[name='domicilio_actividad_economica[latitud]']").val(this.latitud);
            window.jQuery("input[name='domicilio_actividad_economica[longitud]']").val(this.longitud);
            window.jQuery("input[name='domicilio_actividad_economica[coordinate]']").val(this.coordinate);
            window.jQuery("input[name='actividad_economica[superficie]']").val(this.superficie.replace(',', '.'));
            window.jQuery("input[name='domicilio_actividad_economica[zona]']").val(this.zona);

            window.jQuery("#" + this.id_modal).modal("hide");
            document.getElementById('btn_domicilio_actividad_economica_mapa').classList.add('btn-outline-success');
        }
    }

    renderMap() {
        var capa_base = new window.ol.layer.Image({
            source: new window.ol.source.ImageWMS({
                ratio: 1,
                url: this.url_root + 'imagenes/imagen2018_500/MapServer/WMSServer',  //ok
                params: {
                    'FORMAT': this.format,
                    'VERSION': '1.1.1',
                    'LAYERS': '0,1,2',
                },
            })
        });

        var uso_suelos = new window.ol.layer.Image({
            source: new window.ol.source.ImageWMS({
                ratio: 1,
                url: this.url_root + 'planificacion/usoSueloWms/MapServer/WMSServer',  //ok
                params: {
                    'FORMAT': this.format,
                    'VERSION': '1.1.1',
                    'LAYERS': '0',
                    'STYLES': '',
                },
            })
        });

        var capa_otbs = new window.ol.layer.Image({
            source: new window.ol.source.ImageWMS({
                ratio: 1,
                url: this.url_root + 'planificacion/OTBS/MapServer/WMSServer',
                params: {
                    'FORMAT': this.format,
                    'VERSION': '1.1.1',
                    'LAYERS': '0',
                    'STYLES': '',
                },
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

        var capa_manzanas = new window.ol.layer.Image({
            source: new window.ol.source.ImageWMS({
                ratio: 1,
                url: this.url_root + 'catastro/manzanasWms/MapServer/WMSServer', //ok
                params: {
                    'FORMAT': this.format,
                    'VERSION': '1.1.1',
                    'LAYERS': '0',
                    'STYLES': '',
                },
            })
        });

        var capa_predios = new window.ol.layer.Image({
            source: new window.ol.source.ImageWMS({
                ratio: 1,
                url: this.url_root + 'catastro/prediosWms/MapServer/WMSServer',//ok
                params: {
                    'FORMAT': this.format,
                    'VERSION': '1.1.1',
                    'LAYERS': '0',
                    'STYLES': '',
                },
            })
        });

        projection = new window.ol.proj.Projection({
            code: 'EPSG:32719',  //32719  4326
            units: 'm',
            axisOrientation: 'neu'
        });

        this.overlay = this.createOverlay();

        this.map = new window.ol.Map({
            controls: window.ol.control.defaults().extend([
                new window.ol.control.FullScreen({
                    source: 'fullscreen'
                })
            ]),
            /*controls: window.ol.control.defaults({
                attribution: false
            }),  //.extend([mousePositionControl])*/
            layers: [
                capa_base, capa_otbs, capa_manzanas, capa_predios, capa_vias, uso_suelos,
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
            var scale1 = resolution * mpu * 39.37 * dpi;
            if (scale >= 9500 && scale <= 950000) {
                scale = Math.round(scale / 1000) + "K";
            } else if (scale >= 950000) {
                scale = Math.round(scale / 1000000) + "M";
            } else {
                scale = Math.round(scale);
            }
            document.getElementById(id_scale).innerHTML = "Escala = 1 : " + scale;

            if (scale1 < 3500) {
                capa_otbs.set('visible', false);
            }
            else {
                capa_otbs.set('visible', true);
            }
        });
        var vectorSource = new window.ol.source.Vector({  // Creación del vector source generico
        });
        var vectorLayer = new window.ol.layer.Vector({
            source: vectorSource,
        });
        this.map.on('click', (obj) => {
            var view = self.map.getView();

            var coordinate = obj.coordinate;
            var viewResolution = view.getResolution();
            var source = capa_predios.getSource();
            var url = source.getGetFeatureInfoUrl(obj.coordinate,
                viewResolution,
                view.getProjection(),
                { 'INFO_FORMAT': 'application/json', 'FEATURE_COUNT': 50 }
            );
            this.getDatosDistrito(url, self.map, obj, vectorSource, vectorLayer, coordinate);
        });

        this.searchMapControl(self, vectorSource, vectorLayer)

        window.jQuery('#' + this.id_modal).on('show.bs.modal', function () {
            setTimeout(() => {
                self.setState({ zoom: 18 });  //createOverlay() -7235766.90, -1920825.04
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

    searchMapControl(self, vectorSource, vectorLayer){
        var result_ul = document.createElement('ul');
        result_ul.className = 'ul-result-catastro';

        var boton = document.createElement('button');
        boton.innerHTML = '';
        boton.className = 'fa fa-search';
        boton.addEventListener('click', function () {
            window.jQuery("#map-input-query").animate({ width: "toggle" });
            window.jQuery("#map-a-reset").animate({ width: "toggle" });
            window.jQuery("#map-select-option").animate({ width: "toggle" });
            window.jQuery(".ul-result-catastro").animate({ width: "toggle" });

            window.jQuery("#map-input-query").removeClass("hide")
            window.jQuery("#map-a-reset").removeClass("hide")
            window.jQuery("#map-select-option").removeClass("hide")
        });

        var input = document.createElement('input');
        input.setAttribute('id', 'map-input-query')
        input.setAttribute('class', 'gcd-gl-input hide')
        input.setAttribute('autocomplete', 'off')
        input.setAttribute('placeholder', 'Buscar por...')
        input.setAttribute('type', 'text')
        input.addEventListener('keyup', function (event) {
            let value = event.target.value
            let select_option = window.jQuery("#map-select-option option:selected")[0];
            if (select_option.value === "Cod. Cat.") {
                if (value.length >= 3 && value.length <= 19) {
                    value = '00'+value;
                    const predios = self.fetch.fetchGetExternal(`${self.url_root_search}/query?where=CodCat+like+%27${value}%25%27&text=&objectIds=&time=&geometry=&geometryType=esriGeometryEnvelope&inSR=&spatialRel=esriSpatialRelContains&relationParam=&outFields=&returnGeometry=true&returnTrueCurves=false&maxAllowableOffset=&geometryPrecision=&outSR=&returnIdsOnly=false&returnCountOnly=false&orderByFields=&groupByFieldsForStatistics=&outStatistics=&returnZ=false&returnM=false&gdbVersion=&returnDistinctValues=false&resultOffset=&resultRecordCount=&f=pjson`);
                    predios.then(res => {
                        if (res.hasOwnProperty('features')) {
                            let list_predios =  res.features;  //lista de predios por codigo catastral
                            window.jQuery(result_ul).empty();

                            window.jQuery.each(list_predios, function(index, item){
                                let coordinate = item.geometry.rings[0][0]
                                var li = document.createElement("li");
                                var link_a = document.createElement('a');
                                link_a.setAttribute("href", "#");
                                link_a.setAttribute("coordinate", coordinate)
                                link_a.addEventListener('click', function (event) {

                                    vectorSource.clear();
                                    let bounds = JSON.parse("[" + event.target.parentElement.getAttribute("coordinate") + "]")
                                    self.map.getView().setCenter(bounds);
                                    self.map.updateSize()
                                    self.paintIcon(coordinate, vectorSource, vectorLayer, self.map)
                                });

                                let _span = document.createElement("span");
                                _span.className = "gcd-road"
                                _span.innerHTML = item.attributes.CodCat;

                                link_a.appendChild(_span);

                                li.appendChild(link_a);
                                result_ul.appendChild(li);
                            });
                        }
                        if (res.hasOwnProperty('error')) {
                            toast.warn(res.error.message, {
                                position: "top-right",
                                autoClose: 5000,
                                hideProgressBar: false,
                                closeOnClick: true,
                                pauseOnHover: true,
                                draggable: true
                            });
                        }
                    })
                }
            }

            //aun no funciona
            if (select_option.value === "N° Predio") {
                if (value.length > 1) {

                    const predios = self.fetch.fetchGetExternal(`${self.url_root_search}/query?where=Nro_predio%3D%27${value}%27&text=&objectIds=&time=&geometry=&geometryType=esriGeometryEnvelope&inSR=&spatialRel=esriSpatialRelContains&relationParam=&outFields=&returnGeometry=true&returnTrueCurves=false&maxAllowableOffset=&geometryPrecision=&outSR=&returnIdsOnly=false&returnCountOnly=false&orderByFields=&groupByFieldsForStatistics=&outStatistics=&returnZ=false&returnM=false&gdbVersion=&returnDistinctValues=false&resultOffset=&resultRecordCount=&f=pjson`, true);
                    predios.then(res => {
                        debugger
                        if (res.hasOwnProperty('error')) {
                            toast.warn(res.error.message, {
                                position: "top-right",
                                autoClose: 5000,
                                hideProgressBar: false,
                                closeOnClick: true,
                                pauseOnHover: true,
                                draggable: true
                            });
                        }
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

        var array = ["Cod. Cat.", "N° Predio"];

        for (var i = 0; i < array.length; i++) {
            var option = document.createElement("option");
            option.value = array[i];
            option.text = array[i];
            select.appendChild(option);
        }

        var elementoDiv = document.createElement('div');
        elementoDiv.className = 'boton-search-catastro ol-unselectable ol-control';
        elementoDiv.appendChild(boton);
        elementoDiv.appendChild(input);
        elementoDiv.appendChild(reset);
        elementoDiv.appendChild(select);
        elementoDiv.appendChild(result_ul);

        var searchControl = new window.ol.control.Control({ element: elementoDiv });
        this.map.addControl(searchControl);
    }

    getDatosDistrito(url, map, obj, vectorSource, vectorLayer, coordinate) {
        var self = this;
        axios.get(url)
            .then((response) => {
                vectorSource.clear();
                var lat_lon = window.ol.proj.toLonLat(coordinate);  //coordinate.toString()

                var content_overlay = "";

                //no hay Nro de Manzana y Nro de Inmueble

                //var xml = window.StringToXML(output_string);
                var xml = window.StringToXML(response.data.replace(/ó/g, 'o').replace(/Nro./g, 'Nro_'));

                if (xml.getElementsByTagName('FIELDS').length > 0) {
                    datos_distrito = {
                        codCatastral: xml.getElementsByTagName('FIELDS')[0].getAttributeNode("CodigoCatastral").value,
                        comuna: xml.getElementsByTagName('FIELDS')[0].getAttributeNode("Comuna").value,
                        distrito: xml.getElementsByTagName('FIELDS')[0].getAttributeNode("Distrito").value,
                        nroSubDistrito: xml.getElementsByTagName('FIELDS')[0].getAttributeNode("Nro_Subdistrito").value,
                        subDistrito: xml.getElementsByTagName('FIELDS')[0].getAttributeNode("Subdistrito").value,
                        nroPredio: xml.getElementsByTagName('FIELDS')[0].getAttributeNode("Nro_predio").value,
                        zonaTributaria: xml.getElementsByTagName('FIELDS')[0].getAttributeNode("ZTributari").value,
                        superficie: xml.getElementsByTagName('FIELDS')[0].getAttributeNode("Shape.STArea").value,
                        perimetro: xml.getElementsByTagName('FIELDS')[0].getAttributeNode("Shape.STLength").value,
                    }

                    self.predio = datos_distrito.codCatastral
                    self.catastro = datos_distrito.nroPredio

                    var lat_lon = window.ol.proj.toLonLat(coordinate);  //coordinate.toString()

                    self.latitud = lat_lon[0];
                    self.longitud = lat_lon[1];
                    self.coordinate = coordinate.toString()
                    self.superficie = datos_distrito.superficie
                    self.zona = datos_distrito.zonaTributaria

                    content_overlay = "<p style='margin-bottom: 0rem!important; margin-top: 5px;'><strong>Catastro: </strong> <span>" + datos_distrito.codCatastral + "</span></p>" +
                        "<p style='margin-bottom: 0rem!important; '><strong>Predio: </strong> <span>" + datos_distrito.nroPredio + "</span></p>" +
                        "<p style='margin-bottom: 0rem!important; '><strong>Comuna: </strong> <span>" + datos_distrito.comuna + "</span></p>" +
                        "<p style='margin-bottom: 0rem!important; '><strong>Distrito: </strong> <span>" + datos_distrito.distrito + "</span></p>" +
                        "<p style='margin-bottom: 0rem!important; '><strong>Sub Distrito: </strong> <span>" + datos_distrito.subDistrito + "</span></p>" +
                        "<p style='margin-bottom: 0rem!important; '><strong># Sub Distrito: </strong> <span>" + datos_distrito.nroSubDistrito + "</span></p>" +
                        "<p style='margin-bottom: 0rem!important; '><strong>Zona Tributaria: </strong> <span>" + datos_distrito.zonaTributaria + "</span></p>" +
                        "<p style='margin-bottom: 0rem!important; '><strong>Superficie: </strong> <span>" + datos_distrito.superficie + "</span></p>" +
                        "<p style='margin-bottom: 0rem!important; '><strong>Perimetro: </strong> <span>" + datos_distrito.perimetro + "</span></p>";

                }

                //cargamos datos al popup
                content.innerHTML = '<strong>Actividad Económica:</strong><code> ' + content_overlay + '</code>';
                self.overlay.setPosition(coordinate);
                /*
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
                self.map.addLayer(vectorLayer);*/
                this.paintIcon(coordinate, vectorSource, vectorLayer, self.map)
            })
            .catch((error) => {
                // Error 😨
                console.log(error.config);
            });

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

        //move to icon feature
        var translate1 = new window.ol.interaction.Translate({
            features: new window.ol.Collection([iconFeature])
        });

        map.addInteraction(translate1);
    }

    render() {
        return (

            <div className="modal fade " id={this.id_modal} tabIndex="-1" role="dialog"
                aria-labelledby="exampleModalCenterTitle" aria-hidden="true" data-backdrop="static" data-keyboard="false">
                <div className="modal-dialog modal-lg" >
                    <div className="modal-content">
                        <div className="modal-header">
                            <h5 className="modal-title" id="exampleModalLongTitle">Ubicación de la Actividad Económica</h5>
                            <button type="button" className="close" data-dismiss="modal" aria-label="Close" onClick={this.handleCloseOnClick}>
                                <span aria-hidden="true">&times;</span>
                            </button>
                        </div>
                        <div className="modal-body">
                            <div className="row">
                                <div id="map" className="map-layer">
                                    <div id="popup" className="ol-popup">
                                        <a href="#" id="popup-closer" className="ol-popup-closer"></a>
                                        <div id="popup-content"></div>
                                    </div>
                                </div>
                                <div id="wrapper">
                                    <div id="location"></div>
                                    <div id="scale"></div>
                                </div>
                            </div>
                        </div>
                        <div className="modal-footer">
                            <button type="button" className="btn btn-primary" onClick={this.handleConfirmOnClick}>Confirmar</button>
                            <button type="button" className="btn btn-secondary" data-dismiss="modal" onClick={this.handleCloseOnClick}>Cerrar</button>
                        </div>
                    </div>
                </div>
            </div>
        );
    }
}

export default ModalMapActividadEconomica;
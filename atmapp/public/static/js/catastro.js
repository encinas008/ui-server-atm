var format = 'image/png';
var bounds = [788396.9511477941, 8059108.1417208575, 811711.388216491, 8090058.166346149];
//var bounds = [798437.6481188739, 8069225.024614312];

// Definir los id de los divs
var url_root = 'http://192.168.105.219:6080/arcgis/services/';
var id_map = 'map';
var id_popup = 'popup';
var id_popup_closer = 'popup-closer';
var id_popup_content = 'popup-content';
var id_wrapper = 'wrapper';
var id_location = 'location';
var id_scale = 'scale';
var datos_distrito = {};
// Fin de definicion de los divs

//variables que no se tocan
var mousePositionControl;
var capa_base;
var projection;
var map;
var contextmenu_items = [];
var contextmenu;
var vectorSource = new ol.source.Vector({// Creación del vector source generico
});
var concat_imagenes;

function CrearMapa() {
    mousePositionControl = new ol.control.MousePosition({
        className: 'custom-mouse-position',
        target: document.getElementById(id_location),
        coordinateFormat: ol.coordinate.createStringXY(5), projection: 'EPSG:32719',
        undefinedHTML: '&nbsp;'
    });

    capa_base = new ol.layer.Image({
        source: new ol.source.ImageWMS({
            ratio: 1,
            url: url_root + 'imagenes/imagen2018_500/MapServer/WMSServer',  //ok
            params: {
                'FORMAT': format,
                'VERSION': '1.1.1',
                'LAYERS': '0,1,2',
                //'LAYERS': '7',
                'STYLES': '',
            },
        })
    });

    capa_limites = new ol.layer.Image({
        source: new ol.source.ImageWMS({
            ratio: 1,
            url: url_root + 'planificacion/limites/MapServer/WMSServer', //ok
            params: {
                'FORMAT': format,
                'VERSION': '1.1.1',
                'LAYERS': '0,1,2,3,4',
                //'LAYERS': '7',
                'STYLES': '',
            },
        })
    });

    capa_otbs = new ol.layer.Image({
        source: new ol.source.ImageWMS({
            ratio: 1,
            url: url_root + 'planificacion/OTBS/MapServer/WMSServer',
            params: {
                'FORMAT': format,
                'VERSION': '1.1.1',
                'LAYERS': '0',
                'STYLES': '',
            },
        })
    });

    capa_vias = new ol.layer.Image({
        source: new ol.source.ImageWMS({
            ratio: 1,
            //url: 'http://186.121.246.218:6080/arcgis/services/planificacion/viasCache/MapServer/WMSServer',
            url: url_root + 'planificacion/viasWms/MapServer/WMSServer',  //ok
            params: {
                'FORMAT': format,
                'VERSION': '1.1.1',
                'LAYERS': '0',
                //'LAYERS': '7',
                'STYLES': '',
            },
        })
    });

    capa_manzanas = new ol.layer.Image({
        source: new ol.source.ImageWMS({
            ratio: 1,
            url: url_root + 'catastro/manzanasWms/MapServer/WMSServer', //ok
            params: {
                'FORMAT': format,
                'VERSION': '1.1.1',
                'LAYERS': '0',
                'STYLES': '',
            },
        })
    });

    capa_predios = new ol.layer.Image({
        source: new ol.source.ImageWMS({
            ratio: 1,
            url: url_root + 'externos/PrediosTitulados/MapServer/WMSServer',//ok
            params: {
                'FORMAT': format,
                'VERSION': '1.1.1',
                'LAYERS': '0',
                'STYLES': '',
            },
        })
    });

    projection = new ol.proj.Projection({
        code: 'EPSG:32719',  //32719  4326
        units: 'm',
        axisOrientation: 'neu'
    });

    //alert(this.map);
    map = new ol.Map({
        controls: ol.control.defaults({
            attribution: false
        }),  //.extend([mousePositionControl])
        target: id_map,// el id del mapa
        layers: [
            capa_base, capa_otbs, capa_manzanas, capa_predios, capa_limites, capa_vias
        ],
        view: new ol.View({
            //center: [0, 0],
            zoom: 18,
            projection: projection,
            /*resolutions: [156543.03390625, 78271.516953125, 39135.7584765625, 19567.87923828125, 9783.939619140625, 
                4891.9698095703125, 2445.9849047851562, 1222.9924523925781, 611.4962261962891, 305.74811309814453, 
                152.87405654907226, 76.43702827453613, 38.218514137268066, 19.109257068634033, 9.554628534317017, 
                4.777314267158508, 2.388657133579254, 1.194328566789627, 0.5971642833948135, 0.29858214169740677, 
                0.14929107084870338, 0.07464553542435169, 0.037322767712175846, 0.018661383856087923, 0.009330691928043961, 
                0.004665345964021981, 0.0023326729820109904, 0.0011663364910054952, 5.831682455027476E-4, 2.915841227513738E-4, 1.457920613756869E-4]*/
        })
    });

    /*var puntoX = -17.390244;
    var puntoY = -66.154853;

    var puntoXmin = puntoX - 50;
    var puntoXmax = puntoX + 50;

    var bounds = [puntoXmin, puntoY, puntoXmax, puntoY];
*/
    map.getView().fit(bounds, map.getSize());
    map.getView().setResolution(map.getView().getResolution());

    map.getView().on('change:resolution', function (evt) {

        var resolution = evt.target.get('resolution');
        var units = map.getView().getProjection().getUnits();
        var dpi = 25.4 / 0.28;
        //alert(map.getView().getResolution());
        var mpu = ol.proj.METERS_PER_UNIT[units];
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


    //alert('test1');

    // definiciones para el popup
    var container = document.getElementById(id_popup);
    var content = document.getElementById(id_popup_content);
    var closer = document.getElementById(id_popup_closer);
    closer.onclick = function () {
        popup.setPosition(undefined);
        closer.blur();
        return false;
    };

    var popup = new ol.Overlay({
        element: container,

    });

    map.addOverlay(popup);
    // fin definiciones para el popup

    /*var vectorSource = new ol.source.Vector({  // Creación del vector source generico
    });
    var vectorLayer = new ol.layer.Vector({
        source: vectorSource,
    });

    map.on('singleclick', function (evt) {
        var feature = map.forEachFeatureAtPixel(evt.pixel,
            function (feature, layer) {
                return feature;
            });

        if (feature) {
            codigo_feature = feature.get('posicion_usuario');
            if (codigo_feature != 'posicion_usuario') {
                var geometry = feature.getGeometry();
                var coord = geometry.getCoordinates();
                var featureExtent = geometry.getExtent();
                var featureCenter = ol.extent.getCenter(featureExtent);
                popup.setPosition(coord);
                content.innerHTML = feature.get('html_contenido');
            }
        }
        else {

            popup.setPosition(undefined);
            closer.blur();
            return false;
        }
    });*/
    // funciones básicas del menu de contexto

    var vectorSource = new ol.source.Vector({  // Creación del vector source generico
    });
    var vectorLayer = new ol.layer.Vector({
        source: vectorSource,
    });
    map.on('click', (obj) => {
        console.log(obj);
        var view = map.getView();

        ///////
        /*var coordenada = view.getCenter();

        var coord3857 = map.T;
        var coord4326 = ol.proj.transform(coord3857, 'EPSG:3857', 'EPSG:4326');
      
        console.log(coord3857, coord4326);*/
        ////

        var viewResolution = view.getResolution();
        var source = capa_predios.getSource();
        var url = source.getGetFeatureInfoUrl(obj.coordinate,
            viewResolution,
            view.getProjection(),
            { 'INFO_FORMAT': 'application/json', 'FEATURE_COUNT': 50 }
        );
        this.getDatosDistrito(url, map, obj, vectorSource, vectorLayer);
    });

    /*elastic = function (t) {
        return Math.pow(2, -10 * t) * Math.sin((t - 0.075) * (2 * Math.PI) / 0.3) + 1;
    };

    center = function (obj) {
        var pan = ol.animation.pan({
            duration: 1000,
            easing: elastic,
            source: map.getView().getCenter()
        });
        map.beforeRender(pan);
        map.getView().setCenter(obj.coordinate);
    };*/


    /*map.on('pointermove', function(event) {
        var coord3857 = event.coordinate;
        var coord4326 = ol.proj.transform(coord3857, 'EPSG:3857', 'EPSG:4326');
      
        console.log(coord3857, coord4326);
      });*/

    //fin de funciones basicas del menu de contexo
    /*contextmenu_items = [];
    contextmenu = new ContextMenu(
        {
            width: 180,
            items: contextmenu_items
        });

    map.addControl(contextmenu);*/

    /*********************************************************************************************** */
    // Creacion por defecto del marcador si existe
    //var id_letrero = getParameterByName('id');
    var razon_social, posicion_x, posicion_y;

    // fin de creacion del marcador si es que existe

    /*contextmenu.on('open', function (evt) {
        var feature = map.forEachFeatureAtPixel(evt.pixel, function (ft, l) {
            return ft;
        });

        //alert(feature.get('cod_sitio'));
        if (feature && feature.get('type') == 'removable') {
            contextmenu.clear();
            removeMarkerItem.data =
                {
                    marker: feature
                };
            contextmenu.push(removeMarkerItem);
        } else {
            contextmenu.clear();// se vacian los items del menu
            contextmenu_items = DevuelveItemsMenu(feature);
            contextmenu.extend(contextmenu_items);//  Se agregan los items del menu 
            contextmenu.extend(contextmenu.getDefaultItems());
        }
    });*/
}

function getDatosDistrito(url, map, obj, vectorSource, vectorLayer) {

    //llamada

    $.ajax(
        {
            url: url,
            type: 'GET',
            dataType: 'text',
            async: false,
            success: function (output_string) {
                vectorSource.clear();
                debugger
                //console.log("respuesta: " + output_string);

                /*output_string = '<?xml version="1.0" encoding="UTF-8"?>' +
                    '<FeatureInfoResponse xmlns:esri_wms="http://www.esri.com/wms" xmlns="http://www.esri.com/wms">' +
                    '<FIELDS FID="6265" Shape="Polígono" OBJECTID="42148" IDPROY="3022" IDPOL="3022085" IDPREDIO="117943839" TIPOOBJETO="1" CODCAT="03010101085095" SUP_CC="0,2067" TITULO="PPDNAL009282" FECHA="12/05/2011" ZONAUTM="19" Fecha_Mod="Nulo" SHAPE_area="2066,765283" SHAPE_len="215,918571" OBJECTID_1="366596" IDPROY_1="3022" IDPOL_1="3022085" IDPREDIO_1="117943839" TIPOPRED="2" NOMPRED="MAICA CHICA - PARCELA 095" BENEFICIAR="ROXANA VILLARROEL COCA Y FREDDY ORELLANA MEDRANO" ESTADO="27" SUP_PRED="0,2067" UBCARPETA="2" CODORIGEN="0" CALIFICACI="1" CLASIFICAC="2" NOTATIT="DGS-JR-CB-CCT-No 161/10" REVISOR="32" FECHA_APRO="01/10/2010" NORES=" " FECHARES="Nulo" OBS="MAICA CHICA"></FIELDS>' +
                    '<FIELDS FID="6271" Shape="Polígono" OBJECTID="42151" IDPROY="3022" IDPOL="3022085" IDPREDIO="117943840" TIPOOBJETO="1" CODCAT="03010101085096" SUP_CC="0,0536" TITULO="PPDNAL009283" FECHA="12/05/2011" ZONAUTM="19" Fecha_Mod="Nulo" SHAPE_area="536,263748" SHAPE_len="183,01657" OBJECTID_1="366597" IDPROY_1="3022" IDPOL_1="3022085" IDPREDIO_1="117943840" TIPOPRED="2" NOMPRED="MAICA CHICA - PARCELA 096" BENEFICIAR="LIDIA ORELLANA GUTIERREZ" ESTADO="27" SUP_PRED="0,0536" UBCARPETA="2" CODORIGEN="0" CALIFICACI="1" CLASIFICAC="2" NOTATIT="DGS-JR-CB-CCT-No 161/10" REVISOR="32" FECHA_APRO="01/10/2010" NORES=" " FECHARES="Nulo" OBS="MAICA CHICA"></FIELDS>' +
                    '<FIELDS FID="6497" Shape="Polígono" OBJECTID="42098" IDPROY="3022" IDPOL="3022085" IDPREDIO="117943777" TIPOOBJETO="1" CODCAT="03010101085033" SUP_CC="0,4588" TITULO="PPDNAL009471" FECHA="12/05/2011" ZONAUTM="19" Fecha_Mod="Nulo" SHAPE_area="4588,160045" SHAPE_len="281,311398" OBJECTID_1="366535" IDPROY_1="3022" IDPOL_1="3022085" IDPREDIO_1="117943777" TIPOPRED="2" NOMPRED="MAICA CHICA - PARCELA 033" BENEFICIAR="ROSARIO CAMACHO DE BALLON" ESTADO="27" SUP_PRED="0,4588" UBCARPETA="2" CODORIGEN="0" CALIFICACI="1" CLASIFICAC="2" NOTATIT="DGS-JR-CB-CCT-No 161/10" REVISOR="32" FECHA_APRO="01/10/2010" NORES=" " FECHARES="Nulo" OBS="MAICA CHICA"></FIELDS>' +
                    '</FeatureInfoResponse>';*/

                //var cleanedString = output_string.toString().replace("\ufeff", "");

                window.jQuery("#modalMiniCatastro").find("#pCatastro").text('0');
                window.jQuery("#modalMiniCatastro").find("#pPredio").text('0');

                window.jQuery("#modalMapCatastro").find("#modalCatastroNumCatrasto").val('0');
                window.jQuery("#modalMapCatastro").find("#modalCatastroNumPredio").val('0');

                var xml = StringToXML(output_string);

                if(output_string.indexOf('FIELDS') >= 0){
                    if (xml.getElementsByTagName('FIELDS').length > 1) {
                        datos_distrito = {
                            codCatastral: xml.getElementsByTagName('FIELDS')[0].getAttributeNode("CODCAT").value,
                            //comuna: xml.getElementsByTagName('FIELDS')[0].getAttributeNode("CODCAT").value,
                            //distrito: xml.getElementsByTagName('FIELDS')[0].getAttributeNode("CODCAT").value,
                            //nroSubDistrito: xml.getElementsByTagName('FIELDS')[0].getAttributeNode("CODCAT").value,
                            //subDistrito: xml.getElementsByTagName('FIELDS')[0].getAttributeNode("CODCAT").value,
                            //nroManzana: xml.getElementsByTagName('FIELDS')[0].getAttributeNode("CODCAT").value,
                            nroPredio: xml.getElementsByTagName('FIELDS')[0].getAttributeNode("IDPREDIO").value,
                            //nroInmueble: xml.getElementsByTagName('FIELDS')[0].getAttributeNode("CODCAT").value,
                            //zonaTributaria: xml.getElementsByTagName('FIELDS')[0].getAttributeNode("CODCAT").value
                        }
                        window.jQuery("#modalMiniCatastro").find("#pCatastro").text(datos_distrito.codCatastral);
                        window.jQuery("#modalMiniCatastro").find("#pPredio").text(datos_distrito.nroPredio);
    
                        window.jQuery("#modalMapCatastro").find("#modalCatastroNumCatrasto").val(datos_distrito.codCatastral);
                        window.jQuery("#modalMapCatastro").find("#modalCatastroNumPredio").val(datos_distrito.nroPredio);
    
                    } else {
                        if (xml.getElementsByTagName('FIELDS').length = 1) {
                            datos_distrito = {
                                codCatastral: xml.getElementsByTagName('FIELDS')[0].getAttributeNode("CODCAT").value,
                                //comuna: xml.getElementsByTagName('FIELDS')[0].getAttributeNode("CODCAT").value,
                                //distrito: xml.getElementsByTagName('FIELDS')[0].getAttributeNode("CODCAT").value,
                                //nroSubDistrito: xml.getElementsByTagName('FIELDS')[0].getAttributeNode("CODCAT").value,
                                //subDistrito: xml.getElementsByTagName('FIELDS')[0].getAttributeNode("CODCAT").value,
                                //nroManzana: xml.getElementsByTagName('FIELDS')[0].getAttributeNode("CODCAT").value,
                                nroPredio: xml.getElementsByTagName('FIELDS')[0].getAttributeNode("IDPREDIO").value,
                                //nroInmueble: xml.getElementsByTagName('FIELDS')[0].getAttributeNode("CODCAT").value,
                                //zonaTributaria: xml.getElementsByTagName('FIELDS')[0].getAttributeNode("CODCAT").value
                            }
    
                            window.jQuery("#modalMiniCatastro").find("#pCatastro").text(datos_distrito.codCatastral);
                            window.jQuery("#modalMiniCatastro").find("#pPredio").text(datos_distrito.nroPredio);
    
                            window.jQuery("#modalMapCatastro").find("#modalCatastroNumCatrasto").val(datos_distrito.codCatastral);
                            window.jQuery("#modalMapCatastro").find("#modalCatastroNumPredio").val(datos_distrito.nroPredio);
    
                        }
                    }
                }

                window.jQuery("#modalMiniCatastro").modal("show");;

                var icono = "assets/imgs/check.png";
                var iconFeature = new ol.Feature({
                    geometry: new ol.geom.Point(obj.coordinate)
                });
                var iconStyle = [new ol.style.Style({
                    image: new ol.style.Icon(({
                        anchor: [0.5, 0.6],
                        anchorXUnits: 'fraction',
                        anchorYUnits: 'fraction',
                        rotateWithView: false,
                        scale: 0.6,
                        src: icono,
                    }))
                }),
                ];
                iconFeature.setStyle(iconStyle);
                vectorSource.addFeature(iconFeature);
                vectorLayer = new ol.layer.Vector({
                    source: vectorSource,
                });
                map.addLayer(vectorLayer);

                /*nombre_comuna = HallarValorEtiqueta('Comuna', output_string);
                nombre_comuna = String(nombre_comuna);
                nombre_comuna = nombre_comuna.replace('Comuna ', '');*/

                /*nombre_distrito = HallarValorEtiqueta('distrito', output_string);
                nombre_distrito = String(nombre_distrito);
                nombre_distrito = nombre_distrito.replace('distrito:=', '');

                nombre_subdistrito = HallarValorEtiquetaSubDistrito(output_string);
                nombre_subdistrito = String(nombre_subdistrito);
                nombre_subdistrito = nombre_subdistrito.replace('SubDistrito:', '');

                nombre_zona = HallarValorEtiquetaZona(output_string);
                nombre_zona = String(nombre_zona);
                nombre_zona = nombre_zona.replace('Zona:', '');*/
            }
        });

    /*this.http.get(url, { responseType: 'text' }).subscribe(res => {
        vectorSource.clear();
        console.log("respuesta: " + res);

        var cleanedString = res.toString().replace("\ufeff", "");

        x2js.parseString(cleanedString, (error, result) => {
            if (result["FeatureInfoResponse"]["FIELDS"]) {

                var icono = "assets/imgs/check.png";
                var iconFeature = new ol.Feature({
                    geometry: new ol.geom.Point(obj.coordinate)
                });
                var iconStyle = [new ol.style.Style({
                    image: new ol.style.Icon(({
                        anchor: [0.5, 0.6],
                        anchorXUnits: 'fraction',
                        anchorYUnits: 'fraction',
                        rotateWithView: false,
                        scale: 0.6,
                        src: icono,
                    }))
                }),
                ];
                iconFeature.setStyle(iconStyle);
                vectorSource.addFeature(iconFeature);
                vectorLayer = new ol.layer.Vector({
                    source: vectorSource,
                });
                map.addLayer(vectorLayer);
                this.datosDistrito = {
                    codCatastral: result["FeatureInfoResponse"]["FIELDS"][0]["$"]["CódigoCatastral"],
                    comuna: result["FeatureInfoResponse"]["FIELDS"][0]["$"]["Comuna"],
                    distrito: result["FeatureInfoResponse"]["FIELDS"][0]["$"]["Distrito"],
                    nroSubDistrito: result["FeatureInfoResponse"]["FIELDS"][0]["$"]["Nro.Subdistrito"],
                    subDistrito: result["FeatureInfoResponse"]["FIELDS"][0]["$"]["Subdistrito"],
                    nroManzana: result["FeatureInfoResponse"]["FIELDS"][0]["$"]["Nro.Manzana"],
                    nroPredio: result["FeatureInfoResponse"]["FIELDS"][0]["$"]["Nro.Predio"],
                    nroInmueble: result["FeatureInfoResponse"]["FIELDS"][0]["$"]["Nro.Inmueble"],
                    zonaTributaria: result["FeatureInfoResponse"]["FIELDS"][0]["$"]["ZonaTributaria"]
                }
            } else {
                this.datosDistrito = {};
            }
        });
    }, (err) => {
        console.log("error: " + err);
    });*/
}

function getParameterByName(name, url) {
    if (!url) url = window.location.href;
    name = name.replace(/[\[\]]/g, "\\$&");
    var regex = new RegExp("[?&]" + name + "(=([^&#]*)|&|#|$)"),
        results = regex.exec(url);
    if (!results) return null;
    if (!results[2]) return '';
    return decodeURIComponent(results[2].replace(/\+/g, " "));
}

function DevuelveItemsMenu(feature) {
    contextmenu_items;
    //console.log("  estado feature:  ");
    // console.log(feature);

    if (feature) {
        longitud = feature.get('posicion_marcador');
        codigoInmueble = feature.get('cod_inmueble');
        // console.log("  estado posicion_marcador:  ");
        // console.log(longitud);
        // console.log(" inmueble " + codigoInmueble);

        if (parseInt(codigoInmueble) > 0) {
            //opciones de para el inmueble registrado
            contextmenu_items =
                [
                    {
                        text: 'Centrar aquí',
                        classname: 'bold',
                        icon: 'center.png',
                        callback: center
                    },
                    {
                        text: 'Actualizar',
                        classname: 'bold',
                        icon: 'actualizar.png',
                        callback: function (obj) {
                            vista = 'update_generico';
                            var href_cadena = document.getElementById(vista).href;
                            n = href_cadena.indexOf("id=");
                            href_cadena = href_cadena.substring(0, n + 3);
                            href_cadena = href_cadena.replace("id=", "id=" + feature.get('cod_inmueble'));
                            document.getElementById(vista).href = href_cadena;
                            document.getElementById(vista).click();

                        },
                    },
                    {
                        text: 'Doc. Adjuntos',
                        classname: 'bold',
                        icon: 'poligonos.png',
                        callback: function (obj) {
                            vista = 'asignacion_generica';
                            var href_cadena = document.getElementById(vista).href;
                            //alert("cadena original"+href_cadena);
                            n = href_cadena.indexOf("cod_inmueble=");
                            href_cadena = href_cadena.replace("cod_inmueble=", "cod_inmueble=" + feature.get('cod_inmueble'));
                            //href_cadena=href_cadena.replace("codigo_catastral=","codigo_catastral="+feature.get('codigo_catastral'));
                            //alert(href_cadena);
                            document.getElementById(vista).href = href_cadena;
                            document.getElementById(vista).click();

                        },
                    },
                    {
                        text: 'Imprimir información',
                        classname: 'bold',
                        icon: 'impresora.png',
                        callback: function (obj) {
                            vista = 'impresion_generica';
                            var href_cadena = document.getElementById(vista).href;
                            //alert("cadena original"+href_cadena);
                            n = href_cadena.indexOf("cod_inmueble=");
                            href_cadena = href_cadena.replace("cod_inmueble=", "cod_inmueble=" + feature.get('cod_inmueble'));
                            //href_cadena=href_cadena.replace("codigo_catastral=","codigo_catastral="+feature.get('codigo_catastral'));
                            document.getElementById(vista).href = href_cadena;
                            document.getElementById(vista).click();

                        },
                    },
                    {
                        text: 'Eliminar inmueble',
                        classname: 'bold',
                        icon: 'eliminar.png',
                        callback: function (obj) {
                            //vectorSource.removeFeature(feature);
                            vista = 'delete_generico';
                            var href_cadena = document.getElementById(vista).href;
                            n = href_cadena.indexOf("id=");
                            href_cadena = href_cadena.substring(0, n + 3);
                            href_cadena = href_cadena.replace("id=", "id=" + feature.get('cod_inmueble'));
                            document.getElementById(vista).href = href_cadena;
                            document.getElementById(vista).click();
                        },
                    },
                ];

        } else {//ES PREMARCADOR EL MENU DEBE SER CENTRAR, CREAR INMUEBLE, ZOOM IN, ZOOM OUT, ELIMINAR
            contextmenu_items =
                [{
                    text: 'Centrar aquí',
                    classname: 'bold',
                    icon: 'center.png',
                    callback: center
                },
                {
                    text: 'Crear inmueble',
                    classname: 'bold',
                    icon: 'center.png',
                    callback: function (obj) {
                        var coord = feature.getGeometry().getCoordinates();
                        // alert(coord[0]);
                        // alert(coord[1]);
                        var coordenadas = coord;//;obj.coordinate;
                        var view = map.getView();
                        var viewResolution = view.getResolution();
                        var source = capa_base.getSource();
                        posicion_x = coordenadas[0];
                        posicion_y = coordenadas[1];
                        source = capa_limites.getSource();
                        datos_cl = HallarDatosCapaLimites(view, viewResolution, source, coordenadas);

                        source = capa_vias.getSource();
                        datos_cv = HallarDatosCapaVias(view, viewResolution, source, coordenadas);

                        source = capa_otbs.getSource();
                        datos_co = HallarDatosOtbs(view, viewResolution, source, coordenadas);

                        source = capa_predios.getSource();
                        datos_pre = HallarDatosCapaPredios(view, viewResolution, source, coordenadas);

                        //alert(datos_cl.nombre_comuna+'\n'+datos_cl.nombre_distrito+'\n'+datos_cl.nombre_subdistrito+'\n'+datos_cl.nombre_subdistrito+'\n'+datos_cl.nombre_zona+'\n'+datos_co.nombre+'\n'+datos_pre.manzana+'\n'+datos_pre.predio+'\n'+datos_pre.codigo_catastral);
                        vista = 'create_generico';

                        var href_cadena = document.getElementById(vista).href;

                        document.getElementById(vista).href = "index.php?r=inmueble%2Fcreate&posicion_x=&posicion_y=&nombre_comuna=&nombre_distrito=&nombre_subdistrito=&nombre_zona=&manzano=&codigo_catastral=";
                        href_cadena = document.getElementById(vista).href;

                        n = href_cadena.indexOf("posicion_x=");

                        href_cadena = href_cadena.replace("posicion_x=", "posicion_x=" + posicion_x);// aca debemos mandar las variables de posicion, zona, etc...

                        n = href_cadena.indexOf("posicion_y=");
                        href_cadena = href_cadena.replace("posicion_y=", "posicion_y=" + posicion_y);// aca debemos mandar las variables de posicion, zona, etc...

                        n = href_cadena.indexOf("nombre_comuna=");
                        href_cadena = href_cadena.replace("nombre_comuna=", "nombre_comuna=" + datos_cl.nombre_comuna);// aca debemos mandar las variables de posicion, zona, etc...

                        n = href_cadena.indexOf("nombre_distrito=");
                        href_cadena = href_cadena.replace("nombre_distrito=", "nombre_distrito=" + datos_cl.nombre_distrito);// aca debemos mandar las variables de posicion, zona, etc...

                        n = href_cadena.indexOf("nombre_subdistrito=");
                        href_cadena = href_cadena.replace("nombre_subdistrito=", "nombre_subdistrito=" + datos_cl.nombre_subdistrito);// aca debemos mandar las variables de posicion, zona, etc...

                        n = href_cadena.indexOf("nombre_zona=");
                        href_cadena = href_cadena.replace("nombre_zona=", "nombre_zona=" + datos_cl.nombre_zona);// aca debemos mandar las variables de posicion, zona, etc...

                        n = href_cadena.indexOf("manzano=");
                        href_cadena = href_cadena.replace("manzano=", "manzano=" + datos_pre.manzana);// aca debemos mandar las variables de posicion, zona, etc...

                        n = href_cadena.indexOf("codigo_catastral=");
                        href_cadena = href_cadena.replace("codigo_catastral=", "codigo_catastral=" + datos_pre.codigo_catastral);// aca debemos mandar las variables de posicion, zona, etc...

                        // alert(href_cadena);

                        document.getElementById(vista).href = href_cadena;

                        document.getElementById(vista).click();
                    },
                },
                {
                    text: 'Eliminar',
                    classname: 'bold',
                    icon: 'center.png',
                    callback: function (obj) {
                        vectorSource.removeFeature(feature);
                    }
                }
                ];
        }
    } else {

        contextmenu_items = [
            {
                text: 'Centrar aquí',
                classname: 'bold',
                icon: 'center.png',
                callback: center
            },

            {
                text: 'Operaciones',
                icon: 'view_list.png',
                items: [
                    {
                        text: 'Crear marcador',
                        icon: 'agregar.png',
                        callback: function (obj) {

                            var coord4326 = ol.proj.transform(obj.coordinate, 'EPSG:3857', 'EPSG:4326'),
                                template = 'Coordinate is ({x} | {y})',
                                iconStyle = new ol.style.Style({
                                    image: new ol.style.Icon({ scale: .6, src: 'img/pin_drop.png' }),
                                    text: new ol.style.Text({
                                        offsetY: 25,
                                        text: ol.coordinate.format(coord4326, template, 2),
                                        font: '15px Open Sans,sans-serif',
                                        fill: new ol.style.Fill({ color: '#111' }),
                                        stroke: new ol.style.Stroke({ color: '#eee', width: 2 })
                                    })
                                }),
                                feature = new ol.Feature({
                                    type: 'removable',
                                    geometry: new ol.geom.Point(obj.coordinate)
                                });


                            /*feature.setStyle(iconStyle);
                            vectorLayer.getSource().addFeature(feature);


                            var icono = "pre_marcador.png";
                            var iconFeature = new ol.Feature({
                                geometry: new ol.geom.Point(obj.coordinate),
                                //name: 'Marcador'+i
                            });
                            var iconStyle = [new ol.style.Style({
                                image: new ol.style.Icon(({
                                    anchor: [0.5, 1],
                                    anchorXUnits: 'fraction',
                                    anchorYUnits: 'fraction',
                                    rotateWithView: false,
                                    scale: 0.6,
                                    src: icono,
                                }))
                            }),
                            ];
                            iconFeature.setStyle(iconStyle);
                            //iconFeature.set('html_contenido',html_contenido);

                            iconFeature.set('posicion_marcador', 'posicion_marcador');
                            features_aux = vectorSource.getFeatures();

                            if (features_aux != null && features_aux.length > 0) {
                                for (x in features_aux) {
                                    codigo_feature = features_aux[x].get('posicion_marcador');
                                    if (codigo_feature == 'posicion_marcador') {
                                        source.removeFeature(features_[x]);
                                        break;
                                    }
                                }
                            }

                            vectorSource.addFeature(iconFeature);
                            vectorLayer = new ol.layer.Vector({
                                source: vectorSource,
                            });

                            // Drag and drop feature
                            var dragInteraction = new ol.interaction.Modify({
                                features: new ol.Collection([iconFeature]),
                                style: null,
                                pixelTolerance: 20
                            });
                            //alert('checke');
                            // Add the event to the drag and drop feature
                            dragInteraction.on('modifyend', function (e) {
                                var f = e.features.getArray()[0];
                                var coordenadas = f.getGeometry().getCoordinates();
                                var view = map.getView();
                                var viewResolution = view.getResolution();
                                var source = capa_base.getSource();
                                posicion_x = coordenadas[0];
                                posicion_y = coordenadas[1];
                                $('#registrar_coord_s').val(posicion_y);
                                $('#registrar_coord_e').val(posicion_x);
                                source = capa_limites.getSource();
                                datos_cl = HallarDatosCapaLimites(view, viewResolution, source, coordenadas);

                                source = capa_vias.getSource();
                                datos_cv = HallarDatosCapaVias(view, viewResolution, source, coordenadas);

                                source = capa_otbs.getSource();
                                datos_co = HallarDatosOtbs(view, viewResolution, source, coordenadas);

                                source = capa_predios.getSource();
                                datos_pre = HallarDatosCapaPredios(view, viewResolution, source, coordenadas);

                            }, iconFeature);
                            // fin del proceso drag and drop

                            map.getLayers().forEach(function (layer, i) {
                                if (layer.get('name') !== 'base_catastro' && layer.get('name') !== 'capa_limites' &&
                                    layer.get('name') !== 'capa_vias' && layer.get('name') !== 'capa_manzanas' &&
                                    layer.get('name') !== 'capa_predios' && layer.get('name') !== 'capa_otbs'
                                )
                                    map.removeLayer(layer);
                            });

                            posicion_x = iconFeature.getGeometry().getCoordinates()[0];
                            posicion_y = iconFeature.getGeometry().getCoordinates()[1];

                            map.addLayer(vectorLayer);
                            map.addInteraction(dragInteraction);
                            var view = map.getView();
                            var viewResolution = view.getResolution();
                            var source = capa_limites.getSource();
                            datos_cl = HallarDatosCapaLimites(view, viewResolution, source, obj.coordinate);

                            source = capa_vias.getSource();
                            datos_cv = HallarDatosCapaVias(view, viewResolution, source, source, obj.coordinate);

                            source = capa_otbs.getSource();
                            datos_co = HallarDatosOtbs(view, viewResolution, source, source, obj.coordinate);

                            source = capa_predios.getSource();
                            datos_pre = HallarDatosCapaPredios(view, viewResolution, source, obj.coordinate);
                            */
                        }
                    },
                ]
            },
            '-' // this is a separator
        ];
    }

    return (contextmenu_items);
}

function HallarDatosCapaLimites(view, viewResolution, source, coordenadas) {
    var url = source.getGetFeatureInfoUrl(
        coordenadas, viewResolution, view.getProjection(),
        { 'INFO_FORMAT': 'application/json', 'FEATURE_COUNT': 50 });
    //alert(url);
    var nombre_comuna;

    $.ajax(
        {
            url: url,
            type: 'GET',
            dataType: 'text',
            async: false,
            success: function (output_string) {
                nombre_comuna = HallarValorEtiqueta('Comuna', output_string);
                nombre_comuna = String(nombre_comuna);
                nombre_comuna = nombre_comuna.replace('Comuna ', '');

                nombre_distrito = HallarValorEtiqueta('distrito', output_string);
                nombre_distrito = String(nombre_distrito);
                nombre_distrito = nombre_distrito.replace('distrito:=', '');

                nombre_subdistrito = HallarValorEtiquetaSubDistrito(output_string);
                nombre_subdistrito = String(nombre_subdistrito);
                nombre_subdistrito = nombre_subdistrito.replace('SubDistrito:', '');

                nombre_zona = HallarValorEtiquetaZona(output_string);
                nombre_zona = String(nombre_zona);
                nombre_zona = nombre_zona.replace('Zona:', '');
            }
        });
    return {
        "nombre_comuna": nombre_comuna,
        "nombre_distrito": nombre_distrito,
        "nombre_subdistrito": nombre_subdistrito,
        "nombre_zona": nombre_zona
    };
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

function HallarValorEtiqueta(etiqueta, fuente) {
    posicion_etiqueta = fuente.indexOf(etiqueta);

    if (posicion_etiqueta != -1) {
        cadena_sobrante = fuente.substring(posicion_etiqueta);
        posición_segunda_comilla = nth_occurrence(cadena_sobrante, '"', 2);
        cadena_buscada = cadena_sobrante.substring(0, posición_segunda_comilla + 1);
        return obtenerTextoEnComillas(cadena_buscada);
    } else
        return 'No definido';

}

function HallarValorEtiquetaZona(fuente) {
    posicion_etiqueta = fuente.indexOf('Zona:');

    if (posicion_etiqueta != -1) {
        cadena_sobrante = fuente.substring(posicion_etiqueta);
        posición_segunda_comilla = nth_occurrence(cadena_sobrante, '"', 1);

        cadena_buscada = cadena_sobrante.substring(0, posición_segunda_comilla);
        return cadena_buscada;
    } else
        return 'No definido';

}

function HallarValorEtiquetaSubDistrito(fuente) {
    posicion_etiqueta = fuente.indexOf('SubDistrito:');
    if (posicion_etiqueta != -1) {
        cadena_sobrante = fuente.substring(posicion_etiqueta);
        posicion_zona = cadena_sobrante.indexOf('Zona:');
        cadena_buscada = cadena_sobrante.substring(0, posicion_zona - 1);
        //alert(cadena_buscada);
        return cadena_buscada;
    } else
        return 'No definido';

}

function nth_occurrence(string, char, nth) {
    var first_index = string.indexOf(char);
    var length_up_to_first_index = first_index + 1;
    if (nth == 1) {
        return first_index;
    } else {
        var string_after_first_occurrence = string.slice(length_up_to_first_index);
        var next_occurrence = nth_occurrence(string_after_first_occurrence, char, nth - 1);

        if (next_occurrence === -1) {
            return -1;
        } else {
            return length_up_to_first_index + next_occurrence;
        }
    }
}

function obtenerTextoEnComillas(texto) {
    const regex = /(["'])(.*?)\1/g;
    var grupo, resultado = [];

    while ((grupo = regex.exec(texto)) !== null) {
        //el grupo 1 contiene las comillas utilizadas
        //el grupo 2 es el texto dentro de éstas
        resultado.push(grupo[2]);
    }
    return resultado;
}


function HallarDatosCapaVias(view, viewResolution, source, coordenadas) {
    var url = source.getGetFeatureInfoUrl(
        coordenadas, viewResolution, view.getProjection(),
        { 'INFO_FORMAT': 'application/json', 'FEATURE_COUNT': 50 });
    var nombre_comuna;
    $.ajax(
        {
            url: url,
            type: 'GET',
            dataType: 'text',
            async: false,
            success: function (output_string) {
                tipo = HallarValorEtiqueta('Tipo', output_string);
                tipo = String(tipo);
                tipo = tipo.trim();

                nombre = HallarValorEtiqueta('Nombre', output_string);
                nombre = String(nombre);
                nombre = nombre.trim();

            }
        });
    return {
        "tipo": tipo,
        "nombre": nombre,
    };
}

function HallarDatosOtbs(view, viewResolution, source, coordenadas) {
    var url = source.getGetFeatureInfoUrl(
        coordenadas, viewResolution, view.getProjection(),
        { 'INFO_FORMAT': 'application/json', 'FEATURE_COUNT': 50 });
    $.ajax(
        {
            url: url,
            type: 'GET',
            dataType: 'text',
            async: false,
            success: function (output_string) {
                nombre_otb = HallarValorEtiqueta('OTB', output_string);
                nombre_otb = String(nombre_otb);
            }
        });
    return { "nombre": nombre_otb };
}
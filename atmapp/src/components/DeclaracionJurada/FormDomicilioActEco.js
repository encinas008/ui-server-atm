import React, { Component } from 'react';

import Constant from '../../data/constant';
import ModalDomicilio from './ModalDomicilio';
import ModalMapActividadEconomica from '../../components/DeclaracionJurada/ModalMapActividadEconomica';
import Config from '../../data/config';
import Texto from '../../data/es';
import Languaje from '../../data/es';
import { Link } from 'react-router-dom';

import DatePicker, { registerLocale } from 'react-datepicker';
import datepicker from "react-datepicker/dist/react-datepicker.css";
import PasosNavigationLicencia from '../../components/utils/PasosNavigationLicencia';
import es from "date-fns/locale/es"; // the locale you want

/**
 * formulario de domicilio del solicitante
 */
registerLocale("es", es); // register it with the name you want
var url_map = ""
var derecho_admision = 0
class FormDomicilioActEco extends Component {

    constructor(props, context) {
        super(props, context);

        this.domicilioActividadEconomicaDb = null

        this.constant = Constant[0];
        this.handleMapOnClick = this.handleMapOnClick.bind(this);
        this.handleDateFechaInicioChange = this.handleDateFechaInicioChange.bind(this);
        this.handleNumeroOnchange = this.handleNumeroOnchange.bind(this)
        this.handleEdificioOnchange = this.handleEdificioOnchange.bind(this)

        this.state = {
            //startDate: new Date(),
            startDate: null,
            showMapa: false,
            showFormEdificio: false
        };
    }

    componentDidMount() {
        window.jQuery(function () { window.jQuery('.toogle-input').bootstrapToggle() });  //input[type=checkbox]
        window.inputTextUpperCase();
        window.scrollTo(0, 0);

        if (this.props.domicilioActividadEconomicaDb !== undefined && Object.keys(this.props.domicilioActividadEconomicaDb).length > 0) {
            this.domicilioActividadEconomicaDb = this.props.domicilioActividadEconomicaDb

            let domicilio_act_eco = this.domicilioActividadEconomicaDb.domicilio_actividad_economica
            let actividad_economica = this.domicilioActividadEconomicaDb.actividad_economica

            document.getElementsByName('actividad_economica[rotulo_comercial]')[0].value = actividad_economica.rotulo_comercial;
            document.getElementsByName('actividad_economica[superficie]')[0].value = actividad_economica.superficie;
            //document.getElementsByName('actividad_economica[fecha_inicio]')[0].value = window.moment(actividad_economica.fecha_inicio).format('DD-MM-YYYY');

            this.setState({ startDate: new Date(actividad_economica.fecha_inicio) })

            document.getElementsByName('actividad_economica[comuna]')[0].value = actividad_economica.comuna;
            document.getElementsByName('actividad_economica[distrito]')[0].value = actividad_economica.distrito;
            document.getElementsByName('actividad_economica[sub_distrito]')[0].value = actividad_economica.sub_distrito;
            document.getElementsByName('actividad_economica[num_inmueble]')[0].value = actividad_economica.num_inmueble;

            document.getElementById("spanDistrito").innerHTML = actividad_economica.distrito
            document.getElementById("spanSubDistrito").innerHTML = actividad_economica.sub_distrito
            document.getElementById("spanComuna").innerHTML = actividad_economica.comuna

            if (domicilio_act_eco !== null) {

                url_map = domicilio_act_eco.image

                window.jQuery("input[name='" + this.props.nameForm + "[calle]']").bootstrapToggle('off');
                window.jQuery("input[name='" + this.props.nameForm + "[pasaje]']").bootstrapToggle('off')
                window.jQuery("input[name='" + this.props.nameForm + "[avenida]']").bootstrapToggle('off')
                window.jQuery("input[name='" + this.props.nameForm + "[plaza_plazuela]']").bootstrapToggle('off')
                if(domicilio_act_eco.avenida)
                    window.jQuery("input[name='" + this.props.nameForm + "[avenida]']").bootstrapToggle('on')

                if(domicilio_act_eco.calle)
                    window.jQuery("input[name='" + this.props.nameForm + "[calle]']").bootstrapToggle('on')
                
                if(domicilio_act_eco.pasaje)
                    window.jQuery("input[name='" + this.props.nameForm + "[pasaje]']").bootstrapToggle('on')
                
                if(domicilio_act_eco.plaza_plazuela)
                    window.jQuery("input[name='" + this.props.nameForm + "[plaza_plazuela]']").bootstrapToggle('on')

                document.getElementsByName('domicilio_actividad_economica[direccion]')[0].value = domicilio_act_eco.direccion;
                document.getElementsByName('domicilio_actividad_economica[zona]')[0].value = domicilio_act_eco.zona;
                document.getElementById("spanZonaTributaria").innerHTML = domicilio_act_eco.zona

                if (Boolean(domicilio_act_eco.numero) && domicilio_act_eco.numero !== "") {
                    document.getElementById("checkNumero").checked = false
                    var event = new Event('onchange', {
                        bubbles: true,
                        cancelable: true,
                    });

                    document.getElementById("checkNumero").dispatchEvent(event);
                    this.handleNumeroOnchange(event)

                    document.getElementsByName('domicilio_actividad_economica[numero]')[0].value = domicilio_act_eco.numero
                }

                document.getElementsByName('domicilio_actividad_economica[telefono]')[0].value = domicilio_act_eco.telefono;
                document.getElementsByName('domicilio_actividad_economica[celular]')[0].value = domicilio_act_eco.celular;

                document.getElementsByName('domicilio_actividad_economica[latitud]')[0].value = domicilio_act_eco.latitud;
                document.getElementsByName('domicilio_actividad_economica[longitud]')[0].value = domicilio_act_eco.longitud;
                document.getElementsByName('domicilio_actividad_economica[coordinate]')[0].value = domicilio_act_eco.coordinate;

                if (Boolean(domicilio_act_eco.edificio) && domicilio_act_eco.edificio !== "") {
                    document.getElementById("checkEdificio").checked = false
                    var event = new Event('onchange', {
                        bubbles: true,
                        cancelable: true,
                    });
                    document.getElementById("checkEdificio").dispatchEvent(event);
                    this.handleEdificioOnchange(event)
                    document.getElementsByName('domicilio_actividad_economica[edificio]')[0].value = domicilio_act_eco.edificio;
                    this.setState({
                        showMapa: true,
                        showFormEdificio: true
                    });
                } else {
                    this.setState({
                        showMapa: true,
                        showFormEdificio: false
                    });
                }
            }
        }

        var self = this
        window.jQuery("input[name='" + this.props.nameForm + "[avenida]']").change(function (event) {
            if (window.jQuery(event.target).prop('checked') === true) {
                window.jQuery("input[name='" + self.props.nameForm + "[calle]']").prop('checked', false).change();
                window.jQuery("input[name='" + self.props.nameForm + "[pasaje]']").bootstrapToggle('off')
                window.jQuery("input[name='" + self.props.nameForm + "[plaza_plazuela]']").bootstrapToggle('off')
            }
        })

        window.jQuery("input[name='" + this.props.nameForm + "[calle]']").change(function (event) {
            if (window.jQuery(event.target).prop('checked') === true) {
                window.jQuery("input[name='" + self.props.nameForm + "[avenida]']").prop('checked', false).change();
                window.jQuery("input[name='" + self.props.nameForm + "[pasaje]']").bootstrapToggle('off')
                window.jQuery("input[name='" + self.props.nameForm + "[plaza_plazuela]']").bootstrapToggle('off')
            }
        })

        window.jQuery("input[name='" + this.props.nameForm + "[pasaje]']").change(function (event) {
            if (window.jQuery(event.target).prop('checked') === true) {
                window.jQuery("input[name='" + self.props.nameForm + "[calle]']").prop('checked', false).change();
                window.jQuery("input[name='" + self.props.nameForm + "[avenida]']").bootstrapToggle('off')
                window.jQuery("input[name='" + self.props.nameForm + "[plaza_plazuela]']").bootstrapToggle('off')
            }
        })

        window.jQuery("input[name='" + this.props.nameForm + "[plaza_plazuela]']").change(function (event) {
            if (window.jQuery(event.target).prop('checked') === true) {
                window.jQuery("input[name='" + self.props.nameForm + "[calle]']").prop('checked', false).change();
                window.jQuery("input[name='" + self.props.nameForm + "[avenida]']").bootstrapToggle('off')
                window.jQuery("input[name='" + self.props.nameForm + "[pasaje]']").bootstrapToggle('off')
            }
        })

        var self = this
        window.jQuery('#modalMapCatastro').on('hidden.bs.modal', function () {
            if (document.getElementsByName(self.props.nameForm + '[latitud]')[0].value.length === 0 &&
                document.getElementsByName(self.props.nameForm + '[latitud]')[0].value.length === 0
            ) {
                if (self.state.showMapa === true)
                    self.setState({ showMapa: false });
            }
        });
    }

    componentDidUpdate(prevProps, prevState, snapshot) {
        if (this.state.showMapa === true && url_map !== "") {
            document.getElementById(this.props.nameForm + '[image]').src = 'data:image/png;base64, ' + url_map;  //img
        }

        if (this.state.showFormEdificio && Boolean(this.domicilioActividadEconomicaDb)) {
            let domicilio_act_eco = this.domicilioActividadEconomicaDb.domicilio_actividad_economica
            if(Boolean(domicilio_act_eco) ){
                document.getElementsByName('domicilio_actividad_economica[bloque]')[0].value = domicilio_act_eco.bloque;
                document.getElementsByName('domicilio_actividad_economica[piso]')[0].value = domicilio_act_eco.piso;
                document.getElementsByName('domicilio_actividad_economica[dpto_of_local]')[0].value = domicilio_act_eco.dpto_of_local;
            }
        }
    }

    handleMapOnClick(event) {
        event.preventDefault()
        window.jQuery('#modalMapCatastro').modal('show');

        if (this.state.showMapa === false)
            this.setState({ showMapa: true });
    }

    handleDateFechaInicioChange(date) {
        this.setState({
            startDate: date
        });
    }

    handleNumeroOnchange(event) {
        if (event.target.checked) {
            document.getElementsByName(this.props.nameForm + '[numero]')[0].readOnly = true
            document.getElementsByName(this.props.nameForm + '[numero]')[0].value = ''
            document.getElementsByName(this.props.nameForm + '[numero]')[0].placeholder = 'S/N'
            document.getElementsByName(this.props.nameForm + '[numero]')[0].setAttribute('data-parsley-required', false)
        } else {
            document.getElementsByName(this.props.nameForm + '[numero]')[0].readOnly = false
            document.getElementsByName(this.props.nameForm + '[numero]')[0].placeholder = Texto.numero
            document.getElementsByName(this.props.nameForm + '[numero]')[0].setAttribute('data-parsley-required', true)
        }
    }

    handleEdificioOnchange(event) {
        if (event.target.checked) {
            document.getElementsByName(this.props.nameForm + '[edificio]')[0].readOnly = true
            document.getElementsByName(this.props.nameForm + '[edificio]')[0].value = ''
            document.getElementsByName(this.props.nameForm + '[edificio]')[0].setAttribute('data-parsley-required', false)

            document.getElementsByName(this.props.nameForm + '[bloque]')[0].value = ''
            document.getElementsByName(this.props.nameForm + '[piso]')[0].value = ''
            document.getElementsByName(this.props.nameForm + '[dpto_of_local]')[0].value = ''
            this.setState({ showFormEdificio: false })
        } else {
            document.getElementsByName(this.props.nameForm + '[edificio]')[0].readOnly = false
            document.getElementsByName(this.props.nameForm + '[edificio]')[0].setAttribute('data-parsley-required', true)
            this.setState({ showFormEdificio: true })
        }
    }

    render() {

        if (this.props.hasOwnProperty('declaracionJurada') && this.props.declaracionJurada !== undefined) {
            if (this.props.declaracionJurada.hasOwnProperty('derecho_admision'))
                derecho_admision = this.props.declaracionJurada.derecho_admision
        }
        return (
            <div className="row">
                <PasosNavigationLicencia titulo_paso1={(parseInt(derecho_admision) === parseInt(Constant[0].derecho_admision.permanente)) ? Languaje.actividad_economica_permanente : Languaje.actividad_economica_temporal}
                    paso1_active={true} paso2_active={true} paso3_active={true} paso4_active={true}
                    paso5_active={false} />

                <form action="" className="contact__form needs-validation" name="formDomicilioActEco" id="formDomicilioActEco"
                    method="post" noValidate onSubmit={this.props.onSubmitForm} style={{ width: '100%' }}>

                    <div className="row">
                        <div className="col-12  form-group">
                            <h5 className="color-gris">1 {Texto.ubicacion_actividad_economica}</h5>
                        </div>
                    </div>

                    <div className="row">
                        <div className="col-12 col-sm-12 col-md-12 col-lg-12 form-group text-center" >
                            {this.state.showMapa ?
                                <img id={this.props.nameForm + '[image]'} className='img-thumbnail img-thumbnail rounded mx-auto d-block' alt='img-domicilio-actividad-economica'
                                    src={""} /> :

                                <div className="folded-corner service_tab_1 folded-corner-rounded">
                                    <Link to={'#0'} title="Click Aqui Para Ubicar tu Domicilio" onClick={this.handleMapOnClick}>
                                        <div className="text">
                                            <i className="fa fa-map fa-5x fa-icon-image"></i>
                                        </div>
                                    </Link>
                                    <i className="fa fa-arrow-up" aria-hidden="true" style={{display: 'block', fontSize: '3em', color: '#dc3545'}}></i>
                                    <Link to={'#0'} title="Click Aqui" className="item-title" onClick={this.handleMapOnClick}>Click Aqui</Link>
                                </div>
                            }
                        </div>

                        <div className="col-12 col-sm-6 col-md-3 col-lg-3" >
                            <strong>{Texto.distrito}:</strong> <span id="spanDistrito"></span>
                        </div>

                        <div className="col-12 col-sm-6 col-md-3 col-lg-3" >
                            <strong>{Texto.sub_distrito}:</strong> <span id="spanSubDistrito"></span>
                        </div>

                        <div className="col-12 col-sm-6 col-md-3 col-lg-3" >
                            <strong>{Texto.comuna}:</strong> <span id="spanComuna"></span>
                        </div>

                        <div className="col-12 col-sm-6 col-md-3 col-lg-3" >
                            <strong>{Texto.zona_tributaria}:</strong> <span id="spanZonaTributaria"></span>
                        </div>
                    </div>

                    <br /><br />

                    <div className="row">
                        <div className="col-12  form-group">
                            <h5 className="color-gris">2 {Texto.informacion_complementaria}</h5>
                        </div>
                    </div>

                    <div className="row">
                        <div className="col-6 col-sm-6 col-md-3 col-lg-3 form-group">
                            <label htmlFor={this.props.nameForm + '[avenida]'} style={{ display: 'block' }} >Avenida </label>
                            <input defaultChecked data-toggle="toggle" data-onstyle="secondary" className="toogle-input"
                                type="checkbox" name={this.props.nameForm + '[avenida]'} data-on="Si" data-off="No"></input>
                        </div>
                        <div className="col-6 col-sm-6 col-md-3 col-lg-3 form-group">
                            <label htmlFor={this.props.nameForm + '[calle]'} style={{ display: 'block' }}>Calle </label>
                            <input data-toggle="toggle" data-onstyle="secondary" type="checkbox" className="toogle-input"
                                name={this.props.nameForm + '[calle]'} data-on="Si" data-off="No"></input>
                        </div>
                        <div className="col-6 col-sm-6 col-md-3 col-lg-3 form-group">
                            <label htmlFor={this.props.nameForm + '[pasaje]'} style={{ display: 'block' }}>Pasaje </label>
                            <input data-toggle="toggle" data-onstyle="secondary" type="checkbox" className="toogle-input"
                                name={this.props.nameForm + '[pasaje]'} data-on="Si" data-off="No"></input>
                        </div>
                        <div className="col-6 col-sm-6 col-md-3 col-lg-3 form-group">
                            <label htmlFor={this.props.nameForm + '[plaza_plazuela]'} style={{ display: 'block' }}>Plaza/Plazuela </label>
                            <input data-toggle="toggle" data-onstyle="secondary" type="checkbox" className="toogle-input"
                                name={this.props.nameForm + '[plaza_plazuela]'} data-on="Si" data-off="No"></input>
                        </div>
                    </div>

                    <div className="row">
                        <div className="col-sm-12 col-md-10 col-lg-10 form-group">
                            <label htmlFor={this.props.nameForm + '[direccion]'}>Dirección *</label>
                            <input name={this.props.nameForm + '[direccion]'} type="text"
                                className="form-control input-uppercase" placeholder="Dirección" data-parsley-required="true" required pattern="[.a-zA-Z0-9 À-ÿ\u00f1\u00d1]+" data-parsley-pattern="[.a-zA-Z0-9 À-ÿ\u00f1\u00d1]+" />
                        </div>

                        <div className="col-sm-12 col-md-2 col-lg-2 form-group">
                            <label htmlFor={this.props.nameForm + '[numero]'}>Número</label>
                            <div className="input-group mb-3">
                                <div className="input-group-prepend">
                                    <div className="input-group-text">
                                        <input type="checkbox" defaultChecked={'Checked'} id="checkNumero" onChange={this.handleNumeroOnchange} />
                                    </div>
                                </div>
                                <input type="text" className="form-control input-uppercase" name={this.props.nameForm + '[numero]'}
                                    placeholder="S/N" data-parsley-required="false" pattern="[0-9]+" readOnly />
                            </div>
                        </div>
                    </div>

                    <div className="row">
                        <div className="col-12 col-sm-12 col-md-5 col-lg-5 form-group">
                            <label htmlFor={this.props.nameForm + '[edificio]'}>Nombre Edificio</label>
                            <div className="input-group mb-3">
                                <div className="input-group-prepend">
                                    <div className="input-group-text ">
                                        <input type="checkbox" defaultChecked={'Checked'} id="checkEdificio" onChange={this.handleEdificioOnchange} />
                                    </div>
                                </div>
                                <input name={this.props.nameForm + '[edificio]'} type="text" className="form-control input-uppercase"
                                    placeholder="Nombre Edificio" data-parsley-required="false" pattern="[a-zA-Z0-9 À-ÿ\u00f1\u00d1]+"
                                    data-parsley-pattern="[a-zA-Z0-9 À-ÿ\u00f1\u00d1]+" readOnly />
                            </div>
                        </div>
                        {this.state.showFormEdificio ?
                            <div className="col-12 col-sm-12 col-md-2 col-lg-2 form-group">
                                <label htmlFor={this.props.nameForm + '[bloque]'}>Bloque</label>
                                <input name={this.props.nameForm + '[bloque]'} type="text" className="form-control input-uppercase"
                                    placeholder="Bloque" data-parsley-required="false" pattern="[a-zA-Z-0-9]+" data-parsley-pattern="[a-zA-Z-0-9]+" />
                            </div>
                            : ""
                        }

                        {this.state.showFormEdificio ?
                            <div className="col-12 col-sm-12 col-md-2 col-lg-2 form-group">
                                <label htmlFor={this.props.nameForm + '[piso]'}>Número de Piso</label>
                                <input name={this.props.nameForm + '[piso]'} type="text" className="form-control input-uppercase"
                                    placeholder="Número de Piso" data-parsley-required="false" pattern="[0-9]+" data-parsley-pattern="[0-9]+" />
                            </div>
                            : ""
                        }

                        {this.state.showFormEdificio ?
                            <div className="col-12 col-sm-12 col-md-3 col-lg-3 form-group">
                                <label htmlFor={this.props.nameForm + '[dpto_of_local]'}>Dpto/Of./Local</label>
                                <input name={this.props.nameForm + '[dpto_of_local]'} className="form-control input-uppercase"
                                    placeholder="Departamento/Of./Local" data-parsley-required="false" pattern="[a-zA-Z-0-9]+" data-parsley-pattern="[a-zA-Z-0-9]+" />
                            </div>
                            : ""
                        }
                    </div>

                    <div className="row">
                        <div className="col-sm-12 col-md-4 col-lg-4 form-group">
                            <label htmlFor={this.props.nameForm + '[telefono]'}>Teléfono Fijo</label>
                            <input name={this.props.nameForm + '[telefono]'} type="text" className="form-control input-uppercase"
                                placeholder="Teléfono Fijo" data-parsley-required="false" data-parsley-minlength="6" minLength="6" data-parsley-pattern="[0-9]+" />
                        </div>

                        <div className="col-sm-12 col-md-4 col-lg-4 form-group">
                            <label htmlFor={this.props.nameForm + '[celular]'}>Teléfono Móvil *</label>
                            <input name={this.props.nameForm + '[celular]'} type="text" className="form-control input-uppercase"
                                placeholder="Teléfono Móvil" data-parsley-required="true" required data-parsley-minlength="8" minLength="8" data-parsley-pattern="[0-9]+" />
                        </div>
                    </div>

                    <br />

                    <div className="row">
                        <div className="col-12  form-group">
                            <h5 className="color-gris">3 {Texto.descripcion}</h5>
                        </div>
                    </div>

                    <div className="row">

                        <div className="col-12 col-sm-12 col-md-4 col-lg-4 form-group">
                            <label htmlFor='actividad_economica[rotulo_comercial]' style={{ display: 'block' }} >Rótulo Comercial * </label>
                            <input name='actividad_economica[rotulo_comercial]' type="text" className="form-control input-uppercase"
                                placeholder="Rotulo Comercial" data-parsley-required="true" required pattern="[a-zA-Z0-9 À-ÿ\u00f1\u00d1-]+" data-parsley-pattern="[a-zA-Z0-9 À-ÿ\u00f1\u00d1-]+" />
                        </div>

                        <div className="col-12 col-sm-12 col-md-4 col-lg-4 form-group">
                            <label htmlFor='actividad_economica[superficie]' style={{ display: 'block' }} >Superficie(m2) * </label>
                            <input name='actividad_economica[superficie]' type="text" className="form-control input-uppercase" placeholder="Superficie"
                                data-parsley-required="true" required pattern="[0-9]+" data-parsley-pattern="[0-9]+" />
                        </div>
                        <div className="col-12 col-sm-12 col-md-4 col-lg-4 form-group">
                            <label htmlFor='actividad_economica[fecha_inicio]' style={{ display: 'block' }} >Fecha Inicio (DD-MM-YYYY) * </label>
                            <DatePicker
                                locale="es"
                                dateFormat={Config[4].format}
                                selected={this.state.startDate}
                                onChange={this.handleDateFechaInicioChange}
                                maxDate={new Date()}
                                className="form-control"
                                name='actividad_economica[fecha_inicio]'
                                showMonthDropdown
                                showYearDropdown
                                dropdownMode="select"
                                required />
                        </div>
                        {/* 
                        <div className="col-12 col-sm-12 col-md-4 col-lg-4 form-group">
                            <label htmlFor='actividad_economica[comuna]' style={{ display: 'block' }} >Comuna: </label>
                            <input name='actividad_economica[comuna]' type="text" className="form-control" placeholder="Comuna" data-parsley-required="true" 
                            required readOnly pattern="[a-z A-Z]+" data-parsley-pattern="[a-z A-Z]+" />
                        </div>
                        */}
                    </div>

                    <div className="row">
                        <input name='actividad_economica[predio]' type="hidden" />
                        <input name='actividad_economica[catastro]' type="hidden" />
                        <input name={this.props.nameForm + '[latitud]'} type="hidden" />
                        <input name={this.props.nameForm + '[longitud]'} type="hidden" />
                        <input name={this.props.nameForm + '[coordinate]'} type="hidden" />
                        <input name={this.props.nameForm + '[image]'} type="hidden" />
                        <input name={this.props.nameForm + '[zona]'} type="hidden" />
                        <input name='actividad_economica[num_inmueble]' type="hidden" />
                        <input name='actividad_economica[comuna]' type="hidden" />

                        <input name='actividad_economica[distrito]' type="hidden" />
                        <input name='actividad_economica[sub_distrito]' type="hidden" />
                    </div>

                    <div className="row">
                        <div className="col-sm-12 col-md-12 col-lg-12 form-group">
                            <button className="button-style btn-disabled pull-left " type="button" id={'btn_domicilio_mapa'} onClick={this.handleMapOnClick}>
                                <i className="fa fa-map-marker" aria-hidden="true" ></i> Ubica tú Actividad Económica en el Mapa</button>
                            <input name="Siguiente" type="submit" className="button-style pull-right" value={this.props.buttonName} />
                        </div>
                    </div>
                </form>
                <ModalMapActividadEconomica />
                <ModalDomicilio />
            </div>
        );
    }
}

export default FormDomicilioActEco;
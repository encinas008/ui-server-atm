import React, { Component } from 'react';
import DatePicker, { registerLocale } from 'react-datepicker';
import datepicker from "react-datepicker/dist/react-datepicker.css";

import Constant from '../../data/constant';
import Config from '../../data/config';
import Texto from '../../data/es';

import Fetch from '../../components/utils/Fetch';
//import { de } from 'date-fns/esm/locale';
import es from "date-fns/locale/es"; // the locale you want

registerLocale("es", es); // register it with the name you want
var apellido_casada = ""
class DataPersona extends Component {

    constructor(props, context) {
        super(props, context);

        this.handleTipoDocumentoOnChange = this.handleTipoDocumentoOnChange.bind(this);
        this.handleEstadoCivilOnChange = this.handleEstadoCivilOnChange.bind(this);
        this.handleSearchByCiOnClick = this.handleSearchByCiOnClick.bind(this);
        this.handleDatePickerDatosJuridicosChange = this.handleDatePickerDatosJuridicosChange.bind(this);
        this.handleSearchByNitOnClick = this.handleSearchByNitOnClick.bind(this);
        this.handleDatePickerPersonaChange = this.handleDatePickerPersonaChange.bind(this);

        this.state = {
            showInputCi: false,
            showApellidoCasada: false,
            ciExpedido: 'EX',
            ciExpedidoRepLegal: 'EX',
            apellidoCasada: "",
            //startDateJuridico: new Date(),
            startDateJuridico: null,
            //startDatePersona: Config[1].anio,
            startDatePersona: null,
            optionsTipoDocumento: "",
            optionsEstadoCivil: "",
            optionsNacionalidad: "",
            optionsGenero: "",
            optionsTipoSociedad: "",
        };

        this.toast = this.props.toast;
        this.fetch = new Fetch();
        this.fetch.setToast(this.toast);
    }

    componentDidMount() {

        window.inputTextUpperCase()

        const tipo_doc_res = this.fetch.fetchGet(`api/TipoDocumento/getAll`);
        tipo_doc_res.then(res => {

            if (res !== undefined && res.status === true) {
                if (res.status === true && res.TipoDocumento !== null) {  //is ok
                    const listItems = res.TipoDocumento.map((item, index) => {
                        return <option key={index} value={item.id} code={item.code}>{item.name}</option>
                    });
                    if (this.props.solicitanteDb !== null) {
                        if (this.props.solicitanteDb.persona !== null && Boolean(this.props.solicitanteDb.persona.id_tipo_documento)) {
                            //showInputCi: true, 
                            this.setState({
                                optionsTipoDocumento: listItems,
                                ciExpedido: this.props.solicitanteDb.persona.expedido_en
                            });
                            window.jQuery("input[name='persona[numero_documento]']").val(this.props.solicitanteDb.persona.numero_documento);
                            window.jQuery("select[name='persona[id_tipo_documento]']").val(this.props.solicitanteDb.persona.id_tipo_documento).trigger('change');

                            var $_dropdown_menu_per_sol = window.jQuery("#persona-dropdown-solicitante-tipo-doc")
                            $_dropdown_menu_per_sol.parent().children(":first").text(this.props.solicitanteDb.persona.expedido_en);
                            document.getElementsByName("persona[expedido_en]")[0].value = this.props.solicitanteDb.persona.expedido_en
                        } else
                            this.setState({ optionsTipoDocumento: listItems });
                    } else
                        this.setState({ optionsTipoDocumento: listItems });
                }
            }
        })

        const estado_civil_resp = this.fetch.fetchGet(`api/list/estado-civil`);
        estado_civil_resp.then(res => {
            if (res.status === true && res.estadoCivil !== null) {  //is ok

                const listEC = res.estadoCivil.map((item, index) => {
                    return <option key={index} value={item.id} code={item.code}>{item.name}</option>
                });

                this.setState({ optionsEstadoCivil: listEC });
                if (this.props.solicitanteDb !== null && this.props.solicitanteDb.persona !== null)
                    window.jQuery("select[name='persona[estado_civil]']").val(this.props.solicitanteDb.persona.estado_civil).trigger('change');
            }
        })

        const nacionalidad_resp = this.fetch.fetchGet(`api/list/nacionalidad`);
        nacionalidad_resp.then(res => {
            if (res.status === true && res.Nacionalidad !== null) {  //is ok
                const listNacionlidad = res.nacionalidad.map((item, index) => {
                    return <option key={index} value={item.id} code={item.code}>{item.name}</option>
                });
                this.setState({ optionsNacionalidad: listNacionlidad });

                if (this.props.solicitanteDb !== null && this.props.solicitanteDb.persona !== null)
                    window.jQuery("select[name='persona[nacionalidad]']").val(this.props.solicitanteDb.persona.nacionalidad).trigger('change');
            }
        })

        const genero_resp = this.fetch.fetchGet(`api/list/genero`);
        genero_resp.then(res => {
            if (res.status === true && res.Genero !== null) {  //is ok
                const listGenero = res.genero.map((item, index) => {
                    return <option key={index} value={item.id} code={item.code}>{item.name}</option>
                });
                this.setState({ optionsGenero: listGenero });

                if (this.props.solicitanteDb !== null && this.props.solicitanteDb.persona !== null)
                    window.jQuery("select[name='persona[genero]']").val(this.props.solicitanteDb.persona.genero).trigger('change');
            }
        })

        const tipo_sociedad_resp = this.fetch.fetchGet(`api/tipo-sociedad/all`);
        tipo_sociedad_resp.then(res => {
            if (res.status === true && res.TipoSociedad !== null) {  //is ok
                const listItems = res.TipoSociedad.map((item, index) => {
                    return <option key={index} value={item.id} code={item.code}>{item.name}</option>
                });

                this.setState({ optionsTipoSociedad: listItems });
                if (this.props.solicitanteDb !== null)
                    if (this.props.solicitanteDb.datos_juridicos !== null && this.props.solicitanteDb.datos_juridicos !== undefined)
                        window.jQuery("select[name='datos_juridicos[id_tipo_sociedad]']").val(this.props.solicitanteDb.datos_juridicos.id_tipo_sociedad).trigger('change');
            }
        })

        if (this.props.solicitanteDb !== null) {
            this.loadDataForm(this.props.solicitanteDb, this, true);
        }
    }

    handleDatePickerDatosJuridicosChange(date) {
        this.setState({
            startDateJuridico: date
        });
    }

    handleDatePickerPersonaChange(date) {
        this.setState({
            startDatePersona: date
        });
    }

    handleSearchByCiOnClick(event) {

        event.preventDefault();
        var ci = "";
        var self = this;
        let input_search = "";
        if (event.target.tagName === 'I') {
            ci = event.target.parentElement.parentElement.parentElement.firstElementChild.value;
            input_search = event.target.parentElement.parentElement.parentElement.firstElementChild.getAttribute('name');
        }
        else {
            ci = event.target.parentElement.parentElement.firstElementChild.value;
            input_search = event.target.parentElement.parentElement.firstElementChild.getAttribute('name');
        }

        if (ci !== '') {
            //window.jQuery("input[type='text']:not(input[name='persona[numero_documento]'])").val("")
            window.jQuery("input[name*='persona']:not(input[name='persona[numero_documento]']):not(input[type=hidden])").val("")
            //window.jQuery("select:not(select[name='persona[id_tipo_documento]'])").prop('selectedIndex', 0);
            window.jQuery("select[name*='persona']:not(select[name='persona[id_tipo_documento]'])").prop('selectedIndex', 0);
            const search_persona = this.fetch.fetchGet(`api/recaudaciones/persona-by-ci/${ci}`);
            search_persona.then(dataJson => {
                if (dataJson != undefined && dataJson.status === true && dataJson.persona_natural !== null) {  //is ok
                    if (input_search.indexOf('persona') >= 0) {
                        self.loadDataForm(dataJson.persona_natural, self, false);
                    }

                    this.props.toast.success(dataJson.message, {
                        position: "top-right",
                        autoClose: 5000,
                        hideProgressBar: false,
                        closeOnClick: true,
                        pauseOnHover: true,
                        draggable: true
                    });
                }
                window.inputConvertUpperCaseForm('formSolicitante')
            })
        }
    }

    handleSearchByNitOnClick(event) {

        event.preventDefault();
        let nit = "";
        var self = this;
        if (event.target.tagName === 'I')
            nit = event.target.parentElement.parentElement.parentElement.firstElementChild.value;
        else
            nit = event.target.parentElement.parentElement.firstElementChild.value;

        if (nit !== '') {
            window.jQuery("input[type='text']:not(input[name='persona[numero_documento]']):not(input[name='datos_juridicos[nit]'])").val("")
            window.jQuery("select:not(select[name='persona[id_tipo_documento]'])").prop('selectedIndex', 0);
            const search_persona = this.fetch.fetchGet(`api/recaudaciones/persona-by-nit/${nit}`);
            search_persona.then(dataJson => {
                if (dataJson != undefined && dataJson.status === true && dataJson.persona_natural !== null) {  //is ok

                    self.loadDataForm(dataJson.representante_legal, self, false);

                    document.getElementsByName("persona[numero_documento]")[0].value = dataJson.representante_legal.ci;
                    document.getElementsByName("datos_juridicos[razon_social]")[0].value = dataJson.persona_juridica.razon_social;
                    if (dataJson.persona_juridica.fecha_constitucion !== null) {
                        let fecha = dataJson.persona_juridica.fecha_constitucion.replace(/-/g, '/');
                        this.setState({ startDateJuridico: new Date(fecha) });
                    }

                    if (dataJson.persona_juridica.sociedad !== null) {
                        window.jQuery("select[name='datos_juridicos[id_tipo_sociedad]'] option[code='" + dataJson.persona_juridica.sociedad + "']").prop('selected', true);
                    }

                    if (dataJson.representante_legal.num_sec_tipo_documento === 1)
                        window.jQuery("select[name='persona[id_tipo_documento]']").val(dataJson.representante_legal.num_sec_tipo_documento).trigger('change');
                    else
                        window.jQuery("select[name='persona[id_tipo_documento]']").val(2).trigger('change');

                    this.props.toast.success(dataJson.message, {
                        position: "top-right",
                        autoClose: 5000,
                        hideProgressBar: false,
                        closeOnClick: true,
                        pauseOnHover: true,
                        draggable: true
                    });
                }
                window.inputConvertUpperCaseForm('formSolicitante')
            })
        }
    }

    /**
     * 
     * @param {*} persona 
     * @param {*} self 
     * @param {*} local cuando se ha de cargar datos desde la base de datos
     */
    loadDataForm(persona, self, local) {
        if (local) {
            if (persona.persona !== null) {
                let persona_db = persona.persona;
                window.jQuery("input[name='persona[nombre]']").val(persona_db.nombre);
                window.jQuery("input[name='persona[apellido_paterno]']").val(persona_db.apellido_paterno);
                window.jQuery("input[name='persona[apellido_materno]']").val(persona_db.apellido_materno);
                
                if (Boolean(persona_db.apellido_casada)) {
                    self.setState({ showApellidoCasada: true, startDatePersona: new Date(persona_db.fecha_nacimiento), apellidoCasada: persona.persona.apellido_casada });
                    window.jQuery("select[name='persona[estado_civil]']").val(Constant[0].estado_civil.casado).trigger('change');
                }else{
                    self.setState({ startDatePersona: new Date(persona_db.fecha_nacimiento) })
                }
            }

            if (persona.datos_juridicos !== null && persona.datos_juridicos !== undefined) {
                window.jQuery("input[name='datos_juridicos[nit]']").val(persona.datos_juridicos.nit);
                window.jQuery("input[name='datos_juridicos[razon_social]']").val(persona.datos_juridicos.razon_social);

                self.setState({ startDateJuridico: new Date(persona.datos_juridicos.fecha_constitucion) })
            }
        } else {
            document.getElementsByName("persona[nombre]")[0].value = persona.nombres;
            document.getElementsByName("persona[apellido_paterno]")[0].value = persona.ap_paterno;
            document.getElementsByName("persona[apellido_materno]")[0].value = persona.ap_materno;

            if (Boolean(persona.ap_casada)) {
                self.setState({ showApellidoCasada: true, ciExpedido: persona.lugar_ci });
                window.jQuery("select[name='persona[estado_civil]']").val(Constant[0].estado_civil.casado).trigger('change');
                document.getElementsByName("persona[apellido_casada]")[0].value = persona.ap_casada;
            }else
                self.setState({ ciExpedido: persona.lugar_ci });
        }
    }

    loadDataForm(persona, self, local){

        if(local){
            if(persona.persona !== null){
                let persona_db = persona.persona;
                window.jQuery("input[name='persona[nombre]']").val(persona_db.nombre);
                window.jQuery("input[name='persona[apellido_paterno]']").val(persona_db.apellido_paterno);
                window.jQuery("input[name='persona[apellido_materno]']").val(persona_db.apellido_materno);
            }

            if(persona.datos_juridicos !== null && persona.datos_juridicos !== undefined){
                window.jQuery("input[name='datos_juridicos[nit]']").val(persona.datos_juridicos.nit);
                window.jQuery("input[name='datos_juridicos[razon_social]']").val(persona.datos_juridicos.razon_social);
                window.jQuery("input[name='datos_juridicos[fecha_constitucion]']").val(persona.datos_juridicos.fecha_constitucion);
            }
        }else{
            document.getElementsByName("persona[nombre]")[0].value = persona.nombres;
            document.getElementsByName("persona[apellido_paterno]")[0].value = persona.ap_paterno;
            document.getElementsByName("persona[apellido_materno]")[0].value = persona.ap_materno;

            if (Boolean(persona.ap_casada)) {
                self.setState({ showApellidoCasada: true, ciExpedido: persona.lugar_ci });
                window.jQuery("select[name='persona[estado_civil]']").val(Constant[0].estado_civil.casado).trigger('change');
                document.getElementsByName("persona[apellido_casada]")[0].value = persona.ap_casada;
            }

            self.setState({ ciExpedido: persona.lugar_ci });
        }
        
    }

    componentDidUpdate(prevProps, prevState, snapshot) {
        var $_dropdown_menu_per_sol = window.jQuery("#persona-dropdown-solicitante-tipo-doc");
        var self = this;
        if ($_dropdown_menu_per_sol.length > 0) {
            window.event_drop_down($_dropdown_menu_per_sol, function (code_ci_exp) {
                if (self.state.ciExpedido === 'EX')
                    document.getElementsByName("persona[expedido_en]")[0].value = code_ci_exp
            });
        }

        if(this.state.showApellidoCasada && this.state.apellidoCasada !== ""){
            document.getElementsByName("persona[apellido_casada]")[0].value = this.state.apellidoCasada;
        }

        if (this.state.ciExpedido !== 'EX') {
            switch (this.state.ciExpedido) {
                case Constant[0].ci_expedido.cbba.old:
                    $_dropdown_menu_per_sol.parent().children(":first").text(Constant[0].ci_expedido.cbba.new);
                    document.getElementsByName("persona[expedido_en]")[0].value = Constant[0].ci_expedido.cbba.new;
                    break;
                case Constant[0].ci_expedido.lapaz.old:
                    $_dropdown_menu_per_sol.parent().children(":first").text(Constant[0].ci_expedido.lapaz.new);
                    document.getElementsByName("persona[expedido_en]")[0].value = Constant[0].ci_expedido.lapaz.new;
                    break;
                case Constant[0].ci_expedido.santacruz.old:
                    $_dropdown_menu_per_sol.parent().children(":first").text(Constant[0].ci_expedido.santacruz.new);
                    document.getElementsByName("persona[expedido_en]")[0].value = Constant[0].ci_expedido.santacruz.new;
                    break;
                case Constant[0].ci_expedido.oruro.old:
                    $_dropdown_menu_per_sol.parent().children(":first").text(Constant[0].ci_expedido.oruro.new);
                    document.getElementsByName("persona[expedido_en]")[0].value = Constant[0].ci_expedido.oruro.new;
                    break;
                case Constant[0].ci_expedido.potosi.old:
                    $_dropdown_menu_per_sol.parent().children(":first").text(Constant[0].ci_expedido.potosi.new);
                    document.getElementsByName("persona[expedido_en]")[0].value = Constant[0].ci_expedido.potosi.new;
                    break;
                case Constant[0].ci_expedido.pando.old:
                    $_dropdown_menu_per_sol.parent().children(":first").text(Constant[0].ci_expedido.pando.new);
                    document.getElementsByName("persona[expedido_en]")[0].value = Constant[0].ci_expedido.pando.new;
                    break;
                case Constant[0].ci_expedido.beni.old:
                    $_dropdown_menu_per_sol.parent().children(":first").text(Constant[0].ci_expedido.beni.new);
                    document.getElementsByName("persona[expedido_en]")[0].value = Constant[0].ci_expedido.beni.new;
                    break;
                case Constant[0].ci_expedido.tarija.old:
                    $_dropdown_menu_per_sol.parent().children(":first").text(Constant[0].ci_expedido.tarija.new);
                    document.getElementsByName("persona[expedido_en]")[0].value = Constant[0].ci_expedido.tarija.new;
                    break;
                case Constant[0].ci_expedido.sucre.old:
                    $_dropdown_menu_per_sol.parent().children(":first").text(Constant[0].ci_expedido.sucre.new);
                    document.getElementsByName("persona[expedido_en]")[0].value = Constant[0].ci_expedido.sucre.new;
                    break;
                default:
                    $_dropdown_menu_per_sol.parent().children(":first").text("EX");
                    break;
            }
            this.setState({ ciExpedido: 'EX' });
        }
    }

    handleTipoDocumentoOnChange(event) {

        event.preventDefault();
    }

    handleEstadoCivilOnChange(event) {
        event.preventDefault();
        if (event.target.selectedOptions.length > 0) {
            var constant = Constant[0];
            switch (event.target.selectedOptions[0].value) {
                case constant.estado_civil.casado:
                    this.setState({ showApellidoCasada: true });
                    break;
                default:
                    this.setState({ showApellidoCasada: false });
                    break;
            }
        }
    }

    componentWillMount() {
    }

    render() {
        return (
            <>
                {this.props.natural === false ?
                    <div className="row">
                        <div className="col-sm-12 col-md-4 col-lg-4 form-group">
                            <label htmlFor="datos_juridicos[nit]">NIT *</label>
                            <div className="input-group mb-3">
                                <input type="text" className="form-control input-uppercase" name="datos_juridicos[nit]" placeholder="Número de Nit"
                                    aria-label="Número de Nit" aria-describedby="basic-addon2" required data-parsley-required="true" />
                                <div className="input-group-append">
                                    <button className="btn btn-outline-secondary" type="button"><i className="fa fa-search" aria-hidden="true" onClick={this.handleSearchByNitOnClick}></i></button>
                                </div>
                            </div>
                        </div>

                        <div className="col-sm-12 col-md-4 col-lg-4 form-group">
                            <label htmlFor="datos_juridicos[razon_social]">Nombre o Razón Social *</label>
                            <input name="datos_juridicos[razon_social]" type="text" className="form-control input-uppercase"
                                placeholder="Razón Social" required data-parsley-required="true" />
                        </div>

                        <div className="col-sm-12 col-md-4 col-lg-4 ">
                            <label htmlFor="datos_juridicos[fecha_constitucion]">Fecha de Constitución (DD-MM-YYYY) *</label>
                            <DatePicker
                                locale="es"
                                dateFormat={Config[4].format}
                                selected={this.state.startDateJuridico}
                                onChange={this.handleDatePickerDatosJuridicosChange}
                                maxDate={new Date()}
                                className="form-control"
                                name="datos_juridicos[fecha_constitucion]"
                                data-parsley-required="true"
                                showYearDropdown
                                showMonthDropdown
                                dropdownMode="select"
                                required />

                        </div>
                    </div>
                    : ""}

                {this.props.natural === false ?
                    <div className="row">
                        <div className="col-sm-12 col-md-4 col-lg-4 form-group">
                            <label htmlFor="datos_juridicos[id_tipo_sociedad]">Tipo de Sociedad:</label>
                            <select className="form-control" name="datos_juridicos[id_tipo_sociedad]" required data-parsley-required="true" >
                                <option defaultValue value="">Tipo de Sociedad</option>
                                {this.state.optionsTipoSociedad}
                            </select>
                        </div>

                        <br />
                    </div>
                    : ""}


                {/* bloque para los datos del representante */}
                {this.props.natural === false ?
                    <div className="row">
                        <div className="col-12  form-group">
                            <h5 className="color-gris">{Texto.representante_legal}</h5>
                        </div>
                    </div>
                    : ""}

                <div className="row">
                    <div className="col-sm-12 col-md-4 col-lg-4 form-group">
                        <label htmlFor={this.props.nameForm + '[id_tipo_documento]'} >Tipo Documento *</label>
                        <select className="form-control" name={this.props.nameForm + '[id_tipo_documento]'}
                            onChange={this.handleTipoDocumentoOnChange} data-parsley-required="true" required>
                            <option defaultValue value="">Seleccione Tipo Documento</option>
                            {this.state.optionsTipoDocumento}
                        </select>
                    </div>

                    <div className="col-sm-12 col-md-4 col-lg-4 ">
                        <label htmlFor={this.props.nameForm + '[numero_documento]'}>Número de Documento *</label>
                        <div className="input-group">
                            <input type="text" className="form-control input-uppercase"
                                name={this.props.nameForm + '[numero_documento]'} placeholder="Número Documento"
                                data-parsley-required="true" required pattern="[a-zA-Z0-9-]+" data-parsley-pattern="[a-zA-Z0-9-]+" />
                            <div className="input-group-append">
                                <button type="button" className="btn btn-outline-secondary">EX</button>
                                <input type="hidden" name={this.props.nameForm + '[expedido_en]'} />
                                <button type="button" className="btn btn-outline-secondary dropdown-toggle dropdown-toggle-split" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">
                                    <span className="sr-only">Toggle Dropdown</span>
                                </button>
                                <div className="dropdown-menu " id={this.props.nameForm + '-dropdown-solicitante-tipo-doc'} >
                                    <a className="dropdown-item" href="#" code="CB">Cochabamba</a>
                                    <a className="dropdown-item" href="#" code="LP">La Paz</a>
                                    <a className="dropdown-item" href="#" code="SC">Santa Cruz</a>
                                    <a className="dropdown-item" href="#" code="OR">Oruro</a>
                                    <a className="dropdown-item" href="#" code="CH">Chuquisaca</a>
                                    <a className="dropdown-item" href="#" code="PO">Potosi</a>
                                    <a className="dropdown-item" href="#" code="BN">Beni</a>
                                    <a className="dropdown-item" href="#" code="PD">Pando</a>
                                    <a className="dropdown-item" href="#" code="TJ">Tarija</a>
                                </div>
                                <button className="btn btn-outline-secondary btn-dark" type="button" data-toggle="tooltip" data-placement="top"
                                    title="Buscar por CI" ><i className="fa fa-search" aria-hidden="true" onClick={this.handleSearchByCiOnClick}></i></button>
                            </div>
                        </div>
                    </div>

                    <div className="col-sm-12 col-md-4 col-lg-4 form-group">
                        <label htmlFor={this.props.nameForm + '[nacionalidad]'}>Nacionalidad *</label>
                        <select className="form-control" name={this.props.nameForm + '[nacionalidad]'} required data-parsley-required="true" >
                            <option defaultValue value="">Seleccione Nacionalidad</option>
                            {this.state.optionsNacionalidad}
                        </select>
                    </div>
                </div>

                <div className="row">
                    <div className="col-sm-12 col-md-4 col-lg-4 form-group">
                        <label htmlFor={this.props.nameForm + '[nombre]'}>Nombre *</label>
                        <input name={this.props.nameForm + '[nombre]'} type="text" className="form-control input-uppercase" placeholder="Nombre"
                            required data-parsley-required="true" pattern="[a-zA-Z À-ÿ\u00f1\u00d1]+" data-parsley-pattern="[a-zA-Z À-ÿ\u00f1\u00d1]+" />
                    </div>
                    <div className="col-sm-12 col-md-4 col-lg-4 form-group">
                        <label htmlFor={this.props.nameForm + '[apellido_paterno]'} >Apellido Paterno *</label>
                        <input name={this.props.nameForm + '[apellido_paterno]'} type="text" className="form-control input-uppercase" placeholder="Apellido Paterno"
                            required data-parsley-required="true" pattern="[a-zA-Z À-ÿ\u00f1\u00d1]+" data-parsley-pattern="[a-zA-Z À-ÿ\u00f1\u00d1]+" />
                    </div>
                    <div className="col-sm-12 col-md-4 col-lg-4 form-group">
                        <label htmlFor={this.props.nameForm + '[apellido_materno]'}>Apellido Materno:</label>
                        <input name={this.props.nameForm + '[apellido_materno]'} type="text" className="form-control input-uppercase" placeholder="Apellido Materno"
                            pattern="[a-zA-Z À-ÿ\u00f1\u00d1]+" data-parsley-pattern="[a-zA-Z À-ÿ\u00f1\u00d1]+" />
                    </div>
                </div>

                <div className="row">
                    <div className="col-sm-12 col-md-4 col-lg-4 form-group">
                        <label htmlFor={this.props.nameForm + '[estado_civil]'}>Estado Civil *</label>
                        <select className="form-control" name={this.props.nameForm + '[estado_civil]'} required onChange={this.handleEstadoCivilOnChange}>
                            <option defaultValue value="">Estado Civil</option>
                            {this.state.optionsEstadoCivil}
                        </select>
                    </div>
                    {this.state.showApellidoCasada ?
                        <div className="col-sm-12 col-md-4 col-lg-4 form-group ">
                            <label htmlFor={this.props.nameForm + '[apellido_casada]'} >Apellido Casada:</label>
                            <input name={this.props.nameForm + '[apellido_casada]'} type="text" className="form-control input-uppercase" placeholder="Apellido Casada"
                                pattern="[a-zA-Z À-ÿ\u00f1\u00d1]+" data-parsley-pattern="[a-zA-Z À-ÿ\u00f1\u00d1]+" />
                        </div>
                        : ""}

                    <div className="col-sm-12 col-md-4 col-lg-4 form-group">
                        <label htmlFor={this.props.nameForm + '[genero]'} >Género *</label>
                        <select className="form-control" name={this.props.nameForm + '[genero]'} required data-parsley-required="true">
                            <option defaultValue value="">Género</option>
                            {this.state.optionsGenero}
                        </select>
                    </div>
                </div>

                <div className="row">
                    <div className="col-sm-12 col-md-4 col-lg-4 form-group">
                        <label htmlFor={this.props.nameForm + '[fecha_nacimiento]'} >Fecha de Nacimiento ( > 18, DD-MM-YYYY) *</label>
                        <DatePicker
                            locale="es"
                            dateFormat={Config[4].format}
                            selected={this.state.startDatePersona}
                            onChange={this.handleDatePickerPersonaChange}
                            maxDate={Config[1].anio}
                            className="form-control"
                            name={this.props.nameForm + '[fecha_nacimiento]'}
                            data-parsley-required="true"
                            showYearDropdown
                            showMonthDropdown
                            dropdownMode="select"
                            required />
                    </div>
                </div>
            </>
        );
    }
}

export default DataPersona;
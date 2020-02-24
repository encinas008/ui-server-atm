import React, { Component } from 'react';

import Constant from '../../data/constant';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
//import FormPersona from '../../components/DeclaracionJurada/FormPersona';
import Fetch from '../../components/utils/Fetch';
import Links from '../../data/link';
import Texto from '../../data/es';
import Config from '../../data/config';
import Select from 'react-select';
import PasosNavigationPrescripcion from './../utils/PasosNavigationPrescripcion';
import Prescripcion from '.';
import { isThisISOWeek } from 'date-fns/esm';

/*
* Editar el contribuyente natural o juridico 
*/
//var fetch = null
//var toast = null
class FormContribuyente extends Component {

    constructor(props, context) {
        super(props, context);

        this.constant = Constant[0];
        this.fetch = new Fetch();
        this.fetch.setToast(toast);
        this.handleCheckTipoDocumentoOnchange = this.handleCheckTipoDocumentoOnchange.bind(this);
        this.handleSearchByCiOnClick = this.handleSearchByCiOnClick.bind(this);
        this.handleSearchByNitOnClick = this.handleSearchByNitOnClick.bind(this);
        this.handleOnchangeTipoDocumento = this.handleOnchangeTipoDocumento.bind(this)

        //crear
        this.handleSubmit = this.handleSubmit.bind(this);

        this.state = {
            showFormContribuyenteNatural: false,
            showFormContribuyenteJuridico: false,
            dataTributarios: null,
            selectedOption: null,
            optionsGestion: null,
            defaultGestion: null,
            //ciExpedido: 'EX',
            optionsCiExpedido: "",
            optionsTipoDocumento: "",
            showFormRepresentanteLegalNatural: false,
            showFormRepresentanteLegalJuridico: false,
            ciExpedido: 'EX'
        };
    }

    componentDidMount() {

        // debugger
        const ci_expedido_resp = this.fetch.fetchGet(`api/list/ci-expedido`);
        ci_expedido_resp.then(res => {

            if (res !== undefined && res.status === true && res.ci_expedido !== undefined) {  //is ok
                const listCiExpedido = res.ci_expedido.map((item, index) => {
                    return <a key={index} value={item.id} code={item.code} href="#" className="dropdown-item">{item.name}</a>
                });
                if (this.props.prescripcion !== null) {

                    if (this.props.prescripcion !== undefined && Boolean(this.props.prescripcion.expedido_en)) {
                        this.setState({
                            optionsCiExpedido: listCiExpedido,
                            ciExpedido: this.props.prescripcion.expedido_en
                        });
                        var $_dropdown_menu_per_sol = window.jQuery("#ropdown-contribuyente-tipo-doc")
                        $_dropdown_menu_per_sol.parent().children(":first").text(this.props.prescripcion.expedido_en);
                        document.getElementsByName("persona[expedido_en]")[0].value = this.props.prescripcion.expedido_en;
                    } else {
                        this.setState({ optionsCiExpedido: listCiExpedido });
                    }
                } else {
                    this.setState({ optionsCiExpedido: listCiExpedido });
                }
            }
        })

        const tipo_doc_res = this.fetch.fetchGet(`api/TipoDocumento/getAllPrescripcion`);
        tipo_doc_res.then(res => {

            if (res !== undefined && res.status === true) {
                //debugger
                if (res.status === true && res.TipoDocumento !== null) {  //is ok
                    const listItems = res.TipoDocumento.map((item, index) => {
                        return <option key={index} value={item.id} code={item.code}>{item.name}</option>
                    });
                    this.setState({ optionsTipoDocumento: listItems, optionsTipoDocumentoContribuyente: listItems });
                    debugger
                    var event = new Event('onchange', {
                        bubbles: true,
                        cancelable: true,
                    });

                    //debugger
                    if (Boolean(this.props.prescripcion.id_tipo_documento)) {
                        //debugger
                        document.getElementById('checkTipoDocumentoRepresentanteLegal').checked = true;
                        window.jQuery("select[name='pres_representante_legal[id_tipo_documento]']")[0].removeAttribute("disabled");

                        window.jQuery("select[name='pres_representante_legal[id_tipo_documento]']")[0].dispatchEvent(event);
                        window.jQuery("select[name='pres_representante_legal[id_tipo_documento]']").val(this.props.prescripcion.id_tipo_documento).trigger('change');
                        this.handleOnchangeTipoDocumento(event);

                    }
                    // debugger
                    // const aux = this.props.contribuyente;
                    if (Boolean(this.props.prescripcion.id_tipo_documento)) {
                        // if(this.props.contribuyente=='natural'){
                        // window.jQuery("select[name='persona[id_tipo_documento]']")[0].removeAttribute("disabled");
                        //window.jQuery("select[name='persona[id_tipo_documento]']")[0].dispatchEvent(event);
                        //window.jQuery("select[name='persona[id_tipo_documento]']").val(this.props.prescripcion.id_tipo_documento).trigger('change');
                        //this.handleOnchangeTipoDocumentoContribuyente(event)
                    }

                }
            }
        })

        if (Boolean(this.props.prescripcion.nombre)) {
            document.getElementsByName("persona[nombre]")[0].value = this.props.prescripcion.nombre
        }

        if (Boolean(this.props.prescripcion.apellido_paterno)) {
            document.getElementsByName("persona[apellido_paterno]")[0].value = this.props.prescripcion.apellido_paterno;
        }

        if (Boolean(this.props.prescripcion.apellido_materno)) {
            document.getElementsByName("persona[apellido_materno]")[0].value = this.props.prescripcion ? this.props.prescripcion.apellido_materno : '';

        }
        if (Boolean(this.props.prescripcion.numero_documento)) {
            document.getElementsByName("persona[numero_documento]")[0].value = this.props.prescripcion ? this.props.prescripcion.numero_documento : '';
        }
        window.jQuery("#formPrescripcion").parsley().validate();
    }

    componentDidUpdate(prevProps, prevState, snapshot) {
        //document.getElementsByName("pres_objeto_tributario[numero]")[0].value = this.props.prescripcionDb.numero;
        var $_dropdown_menu_per_sol = window.jQuery("#dropdown-contribuyente-tipo-doc");
        var self = this;
        //$_dropdown_menu_per_sol.parent().children(":first").text(this.props.prescipcionDb.persona.expedido_en);
        if ($_dropdown_menu_per_sol.length > 0 && $_dropdown_menu_per_sol.find("a").length > 0) {
            window.event_drop_down($_dropdown_menu_per_sol, function (code_ci_exp) {
                if (self.state.ciExpedido === 'EX')
                    document.getElementsByName("persona[expedido_en]")[0].value = code_ci_exp
            });
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
                    if (Boolean(this.state.ciExpedido)) {
                        $_dropdown_menu_per_sol.parent().children(":first").text(this.state.ciExpedido);
                        document.getElementsByName("persona[expedido_en]")[0].value = this.state.ciExpedido;
                    } else
                        $_dropdown_menu_per_sol.parent().children(":first").text("EX");
                    break;
            }
            this.setState({ ciExpedido: 'EX' });
        }

        if (Boolean(this.props.prescripcion)) {
            //if(tipo_documento.es_representante_ci){
            window.jQuery("input[name='pres_representante_legal[num_docum_repre]").val(this.props.prescripcion ? this.props.prescripcion.num_docum_repre : '').trigger('change');
            /* }else{
                window.jQuery("input[name='pres_representante_legal[pres_numero]").val(this.props.prescripcion ? this.props.prescripcion.pres_numero : '').trigger('change');   
            }*/
            window.jQuery("input[name='pres_representante_legal[razon_social]").val(this.props.prescripcion ? this.props.prescripcion.razon_social : '').trigger('change');
            window.jQuery("input[name='pres_representante_legal[telefono]").val(this.props.prescripcion ? this.props.prescripcion.telefono : '').trigger('change');
            window.jQuery("input[name='pres_representante_legal[correo_electronico]").val(this.props.prescripcion ? this.props.prescripcion.correo_electronico : '').trigger('change');
            //}
        }
    }
    //OBJETO TRIBUTARIO
    //  this.props.contribuyente
    handleCheckTipoDocumentoOnchange(event) {

        if (event.target.checked) {
            //mostrar
            document.getElementsByName('pres_representante_legal[id_tipo_documento]')[0].removeAttribute('disabled')
            document.getElementsByName('pres_representante_legal[id_tipo_documento]')[0].setAttribute('data-parsley-required', true)
            document.getElementsByName("pres_representante_legal[id_tipo_documento]")[0].selectedIndex = 0
        } else {
            //ocultar
            document.getElementsByName('pres_representante_legal[id_tipo_documento]')[0].setAttribute('disabled', true)
            document.getElementsByName('pres_representante_legal[id_tipo_documento]')[0].setAttribute('data-parsley-required', false)
            document.getElementsByName("pres_representante_legal[id_tipo_documento]")[0].selectedIndex = 0
        }
    }

    handleOnchangeTipoDocumento(event) {
        event.preventDefault()
        debugger
        let target = event.target;
        if (target.selectedOptions[0].getAttribute('code') === 'CI') {
            this.setState({ showFormRepresentanteLegalNatural: true, showFormRepresentanteLegalJuridico: false })
        } else {
            if (target.selectedOptions[0].getAttribute('code') === 'NIT') {
                this.setState({ showFormRepresentanteLegalNatural: false, showFormRepresentanteLegalJuridico: true })
            } else {
                this.setState({ showFormRepresentanteLegalNatural: false, showFormRepresentanteLegalJuridico: false })
            }
        }
    }

    handleSearchByCiOnClick(event) {
        event.preventDefault();
        var ci = "";
        let input_search = "";
        var self = this;

        if (event.target.tagName === 'I') {
            ci = event.target.parentElement.parentElement.parentElement.firstElementChild.value;
            input_search = event.target.parentElement.parentElement.parentElement.firstElementChild.getAttribute('name');

        } else
            ci = event.target.parentElement.parentElement.firstElementChild.value;
        input_search = event.target.parentElement.parentElement.parentElement.firstElementChild.getAttribute('name');

        const response = this.fetch.fetchGet(`api/Recaudaciones/getPersonaByCi/${ci}`);
        console.log(response);
        response.then(res => {
            if (res !== undefined && res.status === true) {
                let persona_natural = res.persona_natural

                document.getElementsByName("persona[nombre]")[0].value = persona_natural.nombres;
                document.getElementsByName("persona[apellido_paterno]")[0].value = persona_natural.ap_paterno;
                document.getElementsByName("persona[apellido_materno]")[0].value = persona_natural.ap_materno;

                self.setState({ ciExpedido: persona_natural.lugar_ci });

                toast.success(res.message, {
                    position: "top-right",
                    loading: false,
                    autoClose: 5000,
                    hideProgressBar: false,
                    closeOnClick: true,
                    pauseOnHover: true,
                    draggable: true
                });
            }
        })
    }

    handleSearchByNitOnClick(event) {

        event.preventDefault();
        var nit = "";
        var self = this;
        if (event.target.tagName === 'I') {
            nit = event.target.parentElement.parentElement.parentElement.firstElementChild.value;
        } else
            nit = event.target.parentElement.parentElement.firstElementChild.value;
       
        const response = this.fetch.fetchGet(`api/Recaudaciones/getPersonaByNit/${nit}`);
        console.log(response);
              response.then((res) => {
        //          console.log(res);
                    if (res.status == true){
                        let persona_juridica = res.persona_juridica

                        document.getElementsByName("pres_representante_legal[razon_social]")[0].value = persona_juridica.razon_social;
                        
                        toast.success(res.message, {
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


    handleSubmit(event) {
        event.preventDefault();
        const data = new FormData(event.target);
        fetch(Config[0].url + 'api/prescripcion/create/', {
            method: 'POST',
            body: data,
        }).then(response => {
            return response.json()
                .then(data => {
                    console.log('data', data);
                    if (data.status === true) {
                        toast.success(data.message, {
                            position: "top-right",
                            autoClose: 5000,
                            hideProgressBar: false,
                            closeOnClick: true,
                            pauseOnHover: true,
                            draggable: true
                        });
                        //window.location.href = "/prescripcion-inicio";
                    } else {
                        toast.success(data.message, {
                            position: "top-right",
                            autoClose: 5000,
                            hideProgressBar: false,
                            closeOnClick: true,
                            pauseOnHover: true,
                            draggable: true
                        });
                    }
                })
        });
    }

    render() {
        return (
            <div className="row">
                <PasosNavigationPrescripcion titulo_paso1={"Contribuyente " + this.props.contribuyente} paso1_active={true} paso2_active={false} paso3_active={false} />

                <form action="" className="contact__form needs-validation" name="formPrescripcion" id="formPrescripcion" noValidate
                    method="post" noValidate onSubmit={this.props.onSubmitForm} style={{ width: '100%' }} >

                    {/* registro para los datos del contribuyente */}
                    <div className="row">
                        <div className="col-12">
                            <h5>I Datos Contribuyente</h5>
                        </div>
                    </div>

                    {this.props.contribuyente === 'NATURAL' ?
                        <div className="row">
                            <div className="form-group col-12 col-md-4" >
                                <label htmlFor="persona[numero_documento]">Documento de Identidad:</label>{/*un cambio*/}
                                <div className="input-group ">
                                    <input type="text" className="form-control" aria-label="Text input with segmented dropdown" name="persona[numero_documento]" placeholder="Número Documento" />
                                    <div className="input-group-append">
                                        <button type="button" className="btn btn-outline-secondary">SN</button>
                                        <input type="hidden" name="persona[expedido_en]" />
                                        <button type="button" className="btn btn-outline-secondary dropdown-toggle dropdown-toggle-split" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">
                                            <span className="sr-only">Toggle Dropdown</span>
                                        </button>
                                        <div className="dropdown-menu " id="dropdown-contribuyente-tipo-doc" >
                                            {this.state.optionsCiExpedido}
                                        </div>
                                        <button className="btn btn-outline-secondary btn-dark" type="button" data-toggle="tooltip" data-placement="top"
                                            title="Buscar por CI"><i className="fa fa-search" aria-hidden="true" onClick={this.handleSearchByCiOnClick}></i></button>
                                    </div>
                                </div>
                            </div>

                            <div className="form-group col-12 col-md-4" >
                                <label htmlFor="persona[email]">Email:</label>
                                <input type="text" className="form-control" placeholder="Email" name='persona[email]' value="pedrofernandez@gmail.com" disabled />
                            </div>
                        </div>
                      : ""}

                    {this.props.contribuyente === 'NATURAL' ?
                        <div className="row">
                            <div className="form-group col-12 col-md-4" >
                                <label htmlFor="persona[nombre]">Nombre:</label>
                                <input type="text" className="form-control" placeholder="Nombres" name='persona[nombre]' />
                            </div>

                            <div className="form-group col-12 col-md-4">
                                <label htmlFor="persona[apellido_paterno]">Apellido Paterno:</label>
                                <input type="text" className="form-control" placeholder="Apellido Paterno" name="persona[apellido_paterno]" required />
                            </div>
                            <div className="form-group col-12 col-md-4">
                                <label htmlFor="persona[apellido_materno]">Apellido Materno:</label>
                                <input type="text" className="form-control" placeholder="Apellido Materno" name="persona[apellido_materno]" required />
                            </div>
                        </div>
                       : ""}

                    {this.props.contribuyente === 'JURIDICO' ?
                        <div className="row">
                            <div className="form-group col-12 col-md-4" >
                                <label htmlFor="pres_representante_legal[num_docum_repre]">Documento de Identidad:</label>{/*un cambio*/}
                                <div className="input-group ">
                                    <input type="text" className="form-control" aria-label="Text input with segmented dropdown" name="pres_representante_legal[num_docum_repre]" placeholder="Número Documento" />
                                    <div className="input-group-append">
                                       {/* <button type="button" className="btn btn-outline-secondary">SN</button>
                                        <input type="hidden" name="persona[expedido_en]" />
                                        <button type="button" className="btn btn-outline-secondary dropdown-toggle dropdown-toggle-split" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">
                                            <span className="sr-only">Toggle Dropdown</span>
                                        </button>
                                        <div className="dropdown-menu " id="dropdown-contribuyente-tipo-doc" >
                                            {this.state.optionsCiExpedido}
                                        </div>*/}
                                        <button className="btn btn-outline-secondary btn-dark" type="button" data-toggle="tooltip" data-placement="top"
                                            title="Buscar por CI"><i className="fa fa-search" aria-hidden="true" onClick={this.handleSearchByNitOnClick}></i></button>
                                    </div>
                                </div>
                            </div>

                            <div className="form-group col-12 col-md-4" >
                                <label htmlFor="pres_representante_legal[razon_social]">Razon Social:</label>
                                <input type="text" className="form-control" placeholder="Razon Social" name='pres_representante_legal[razon_social]' />
                            </div>

                            <div className="form-group col-12 col-md-4" >
                                <label htmlFor="persona[email]">Email:</label>
                                <input type="text" className="form-control" placeholder="Email" name='persona[email]' value="pedrofernandez@gmail.com" disabled />
                            </div>
                        </div>
                        : ""}

                    <div className="row">
                        <div className="col-12">
                            <h5>II Datos Representante Legal-Tercero Responsable </h5>
                        </div>
                    </div>
                    <div className="row">
                        <div className="col-12 col-md-4 form-group">
                            <label htmlFor={'pres_representante_legal[id_tipo_documento]'} >Tipo Documento *</label>
                            <div className="input-group mb-3">
                                <div className="input-group-prepend">
                                    <div className="input-group-text ">
                                        <input type="checkbox" id="checkTipoDocumentoRepresentanteLegal" onChange={this.handleCheckTipoDocumentoOnchange} />
                                    </div>
                                </div>

                                <select className="form-control " name={'pres_representante_legal[id_tipo_documento]'} onChange={this.handleOnchangeTipoDocumento} disabled >
                                    <option defaultValue value="">Seleccione Tipo Documento</option>
                                    {this.state.optionsTipoDocumento}
                                </select>

                            </div>
                        </div>
                        {/*this.state.showFormRepresentanteLegalNatural*/}
                        {this.state.showFormRepresentanteLegalNatural || this.state.showFormRepresentanteLegalJuridico ?
                            <div className="col-12 col-md-4 form-group">
                                <label htmlFor="pres_representante_legal[num_docum_repre]">Numero Documento:</label>
                                <input type="text" className="form-control" placeholder="num_docum_repre" name="pres_representante_legal[num_docum_repre]" required />
                            </div>
                            : ""
                        }
                        {this.state.showFormRepresentanteLegalNatural || this.state.showFormRepresentanteLegalJuridico ?
                            <div className="col-12 col-md-4 form-group">
                                <label htmlFor="pres_representante_legal[razon_social]">Nombres y Apellidos:</label>
                                <input type="text" className="form-control" placeholder="Nombres" name="pres_representante_legal[razon_social]" required />
                            </div>
                            : ""
                        }
                    </div>
                    <div className="row">

                        {this.state.showFormRepresentanteLegalNatural || this.state.showFormRepresentanteLegalJuridico ?
                            <div className="col-12 col-md-4 form-group">
                                <label htmlFor="pres_representante_legal[telefono]">Teléfono:</label>
                                <input type="text" className="form-control" placeholder="Teléfono" name="pres_representante_legal[telefono]" required />
                            </div>
                            : ""
                        }
                        {this.state.showFormRepresentanteLegalNatural || this.state.showFormRepresentanteLegalJuridico ?
                            <div className="col-12 col-md-4 form-group">
                                <label htmlFor="pres_representante_legal[correo_electronico]">Correo:</label>
                                <input type="correo" className="form-control" placeholder="Correo/Email" name="pres_representante_legal[correo_electronico]" required data-parsley-required="true" />
                            </div>
                            : ""
                        }
                    </div>

                    <div className="row">
                        <div className="col-sm-12 col-md-12 col-lg-12 form-group">
                            <input name="Siguiente" type="submit" className="button-style pull-right" value={'Siguiente'} />
                        </div>
                    </div>
                </form>
            </div>
        );
    }
}

export default FormContribuyente;
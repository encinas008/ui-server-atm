import React, { Component } from 'react';

import Constant from '../../data/constant';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
//import FormPersona from '../../components/DeclaracionJurada/FormPersona';
//import Fetch from '../utils/Fetch';
import Fetch from '../../components/utils/Fetch'
import Links from '../../data/link';
import Texto from '../../data/es';
import Config from '../../data/config';
import Select from 'react-select';
import PasosNavigationPrescripcion from '../utils/PasosNavigationPrescripcion';
import Prescripcion from '.';
import { isThisISOWeek } from 'date-fns/esm';


class FormObjTributario extends Component {

    constructor(props, context) {
        super(props, context);
        this.fetch = new Fetch();
        this.handleObjetoTriOnChange = this.handleObjetoTriOnChange.bind(this);
        this.handleSearchByVehiculoOnClick = this.handleSearchByVehiculoOnClick.bind(this);
        this.handleSearchByPublicidadOnClick = this.handleSearchByPublicidadOnClick.bind(this);
        this.handleSearchByLicenciaSitioOnClick = this.handleSearchByLicenciaSitioOnClick.bind(this);
        this.handleSearchByLicenciaEconomicasOnClick = this.handleSearchByLicenciaEconomicasOnClick.bind(this);

        this.state = {
            showFormContribuyenteNatural: false,
            showFormContribuyenteJuridico: false,
            dataTributarios: null,
            selectedOption: null,
            optionsGestion: null,
            defaultGestion: null,
            //ciExpedido: 'EX',
            // optionsCiExpedido: "",
            //optionsTipoDocumento: "",
            showFormRepresentanteLegalNatural: false,
            showFormRepresentanteLegalJuridico: false,
            // ciExpedido: 'EX'
        };

        this.gestionDb = this.props.gestion
        this._defaultOptions = []
    }

    componentDidMount() {

        this.objetoTributario();
        debugger
        this.setState({
            optionsGestion: this.gestionesPrescribir()
            //defaultGestion: this.vaciarGestiones()
        });
        debugger
        window.create_input_hidden(this.props.fur, 'pres_prescripcion[fur]', "formObjTributario");
        if (Boolean(this.gestionDb)) {
            for (let i = 0; i < this.gestionDb.length; i += 1) {
                this._defaultOptions.push({ value: this.gestionDb[i].gestion, label: this.gestionDb[i].gestion });
            }
        }
    }

    componentDidUpdate(prevProps, prevState, snapshot) {
        if (Boolean(this.props.prescripcion) && Boolean(this.props.prescripcion.id_tipo_objeto_tributario)) {
            window.jQuery("input[name='pres_objeto_tributario[numero]").val(this.props.prescripcion ? this.props.prescripcion.numero : '').trigger('change');
        }
    }

    objetoTributario() {
        var self = this;
        debugger
        this.fetch.fetchGet('api/prescripcion/objetos-tributarios').then(dataJson => {
            const data = dataJson.data;
            debugger

            if (data !== undefined) {
                let optionsTributarios = data.map((item) => {
                    return (<option key={item.id} value={item.id}>{item.name}</option>)
                }, this);
                this.setState({
                    dataTributarios: optionsTributarios
                });
            }
            
            if (Boolean(this.props.prescripcion) && Boolean(this.props.prescripcion.id_tipo_objeto_tributario) ) {
                window.jQuery("select[name='pres_objeto_tributario[id_tipo_objeto_tributario]'").val(this.props.prescripcion ? this.props.prescripcion.id_tipo_objeto_tributario : undefined).trigger('change')
                var event = new Event('onchange', {
                    bubbles: true,
                    cancelable: true,
                });
                window.jQuery("select[name='pres_objeto_tributario[id_tipo_objeto_tributario]")[0].dispatchEvent(event);
                this.handleObjetoTriOnChange(event)
            }
        })
    }
    handleObjetoTriOnChange(event) {

        event.preventDefault();
        if (event.target.selectedOptions.length > 0) {
            var obj_tributario = Constant[0];
            switch (event.target.selectedOptions[0].value) {
                case obj_tributario.tributario.inmueble:
                    this.setState({ showNumeroDeInmueble: true });
                    this.setState({ showNumeroDeVehiculo: false });
                    this.setState({ showPatenteFuncionamiento: false });
                    this.setState({ showPatentePublicidadExterior: false });
                    this.setState({ showPatenteUnicaMunicipal: false })
                    break;

                case obj_tributario.tributario.vehiculo:
                    this.setState({ showNumeroDeInmueble: false });
                    this.setState({ showNumeroDeVehiculo: true });
                    this.setState({ showPatenteFuncionamiento: false });
                    this.setState({ showPatentePublicidadExterior: false });
                    this.setState({ showPatenteUnicaMunicipal: false })
                    break;

                case obj_tributario.tributario.patente_funcionamiento:
                    this.setState({ showNumeroDeInmueble: false });
                    this.setState({ showNumeroDeVehiculo: false });
                    this.setState({ showPatenteFuncionamiento: true });
                    this.setState({ showPatentePublicidadExterior: false });
                    this.setState({ showPatenteUnicaMunicipal: false })
                    break;
                case obj_tributario.tributario.patente_publicidad_exterior:
                    this.setState({ showNumeroDeInmueble: false });
                    this.setState({ showNumeroDeVehiculo: false });
                    this.setState({ showPatenteFuncionamiento: false });
                    this.setState({ showPatentePublicidadExterior: true });
                    this.setState({ showPatenteUnicaMunicipal: false })
                    break;
                case obj_tributario.tributario.patente_unica_municipal:
                    this.setState({ showNumeroDeInmueble: false });
                    this.setState({ showNumeroDeVehiculo: false });
                    this.setState({ showPatenteFuncionamiento: false });
                    this.setState({ showPatentePublicidadExterior: false });
                    this.setState({ showPatenteUnicaMunicipal: true })
                    break;
                default:
                    this.setState({ showNumeroDeInmueble: false });
                    break;
            }
        }
    }

    handleGestionChange = selectedOption => {
        this.setState({ selectedOption });
        console.log(`Option selected:`, selectedOption);
    };

    gestionesPrescribir() {
        var y = new Date();
        y.setFullYear(y.getFullYear() - 6);
        var res = y.getFullYear();
        var gestionesDisponibles = [];
        console.log('eso ', res);
        for (var i = 1; i <= 10; i++) {
            var aux = res - i;
            const gestion = { value: aux, label: aux };
            console.log(gestion);
            gestionesDisponibles.push(gestion);
        }
        return gestionesDisponibles;
    }

    handleSearchByVehiculoOnClick(event) {
        console.log('funciona el clik')
        event.preventDefault()
        const form = new FormData(event.target);
        let placa = event.target.parentElement.parentElement.parentElement.firstElementChild.value;
        form.append('numero', placa);
        var self = this
        const { perPage } = this.state;
        self.setState({ loading: true });
        let input = window.jQuery(event.target).find('input').val()
        if (input !== null) {
            this.fetch.fetchPost(form, 'api/Cobros/vehiculo').then(res => {
                if (res !== undefined && res.status === true) {

                    document.getElementsByName("persona[numero_documento]")[0].value = res.vehiculo.dp.nd;
                    //document.getElementsByName("persona[expedido_en]")[0].value = res.vehiculo.dp.ex;

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
    }

    handleSearchByPublicidadOnClick(event) {
        console.log('funciona el clik publicidad')
        event.preventDefault()
        const form = new FormData(event.target);
        let input = event.target.parentElement.parentElement.parentElement.firstElementChild.value;
        form.append('codigo_licencia', input);
        var self = this
        if (input !== null) {
            this.fetch.fetchPost(form, 'api/Cobros/licenciaPublicidad/').then(res => {
                if (res !== undefined && res.status === true) {

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
    }

    handleSearchByLicenciaSitioOnClick(event) {
        console.log('funciona el clik')
        event.preventDefault()
        const form = new FormData(event.target);
        let sitios = event.target.parentElement.parentElement.parentElement.firstElementChild.value;
        form.append('codigo_licencia', sitios);
        var self = this
        const { perPage } = this.state;
        self.setState({ loading: true });
        let input = window.jQuery(event.target).find('input').val()
        if (input !== null) {
            this.fetch.fetchPost(form, 'api/Cobros/licenciaSitiosMunicipales/').then(res => {
                if (res !== undefined && res.status === true) {
                    document.getElementsByName("persona[numero_documento]")[0].value = res.sitios.ci;
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
    }

    handleSearchByLicenciaEconomicasOnClick(event) {
        console.log('funciona el clik')
        event.preventDefault()
        const form = new FormData(event.target);
        let numero_actividad = event.target.parentElement.parentElement.parentElement.firstElementChild.value;
        form.append('numero_actividad', numero_actividad);
        var self = this
        const { perPage } = this.state;
        self.setState({ loading: true });
        let input = window.jQuery(event.target).find('input').val()
        if (input !== null) {
            this.fetch.fetchPost(form, 'api/Cobros/LicenciaEconomica/').then(res => {
                if (res !== undefined && res.status === true) {
                    document.getElementsByName("persona[numero_documento]")[0].value = res.actividadEcon.dp.nd;
                    console.log(res.json);
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
    }


    render() {
        return (
            <div className="row">
                <PasosNavigationPrescripcion titulo_paso1={"Contribuyente " + this.props.contribuyente} paso1_active={true} paso2_active={true} paso3_active={true} />

                <form action="" className="contact__form needs-validation" name="formObjTributario" id="formObjTributario" noValidate
                    method="post" noValidate onSubmit={this.props.onSubmitForm} style={{ width: '100%' }} >
                    <div className="row">
                        <div className="col-12">
                            <h5>1 Objecto Tributario</h5>
                        </div>
                    </div>

                    <div className="row">
                        <input id="inputFur" name="inputFur" type="hidden" className="form-control" placeholder="Fur" disabled data-parsley-required="true" />
                        <div className="form-group col-12 col-md-4">
                            <label htmlFor="uname">Objetos Tributarios</label>
                            <select className="form-control" name="pres_objeto_tributario[id_tipo_objeto_tributario]" required onChange={this.handleObjetoTriOnChange}>
                                <option >Seleccione una Opción</option>
                                {this.state.dataTributarios}
                            </select>
                        </div>
                        {this.state.showNumeroDeInmueble ?
                            <div className="form-group col-12 col-md-4">
                                <label htmlFor="pres_objeto_tributario[numero]">Número de Inmueble RUAT</label>
                                <div className=" input-group ">
                                    <input name="pres_objeto_tributario[numero]" type="text" className="form-control" placeholder="Numero Inmueble" required />

                                    <div className="input-group-append">
                                        <button className="btn btn-outline-secondary btn-dark" type="button" data-toggle="tooltip" data-placement="top"
                                            title="Buscar por NIT" onClick={this.handleSearchByNitOnClick}><i className="fa fa-search" aria-hidden="true" onClick={this.handleSearchByNitOnClick}></i></button>
                                    </div>
                                </div>
                            </div>
                            : ""}

                        {this.state.showNumeroDeVehiculo ?
                            <div className="form-group col-12 col-md-4">
                                <label htmlFor="pres_objeto_tributario[numero]">Número de Placa</label>
                                <div className="input-group ">
                                    <input name="pres_objeto_tributario[numero]" type="text" className="form-control" placeholder="Numero de Placa" required />

                                    <div className="input-group-append">
                                        <button className="btn btn-outline-secondary btn-dark" type="button" data-toggle="tooltip" data-placement="top"
                                            title="Buscar por placa" onClick={this.handleSearchByVehiculoOnClick}><i className="fa fa-search" aria-hidden="true" ></i></button>
                                    </div>
                                </div>
                            </div>
                            : ""}

                        {this.state.showPatenteFuncionamiento ?
                            <div className="form-group col-12 col-md-4">
                                <label htmlFor="pres_objeto_tributario[numero]">Número de Licencia</label>
                                <div className="input-group ">
                                    <input name="pres_objeto_tributario[numero]" type="text" className="form-control" placeholder="Número de Licencia" required data-parsley-required="true" />
                                    <div className="input-group-append">
                                        <button className="btn btn-outline-secondary btn-dark" type="button" data-toggle="tooltip" data-placement="top"
                                            title="Buscar por licencia Economica" onClick={this.handleSearchByLicenciaEconomicasOnClick}><i className="fa fa-search" aria-hidden="true" ></i></button>
                                    </div>
                                </div>
                            </div>
                            : ""}

                        {this.state.showPatentePublicidadExterior ?
                            <div className="form-group col-12 col-md-4">
                                <label htmlFor="pres_objeto_tributario[numero]">Número de Licencia</label>
                                <div className="input-group ">
                                    <input name="pres_objeto_tributario[numero]" type="text" className="form-control" placeholder="Número de Licencia" required data-parsley-required="true" />
                                    <div className="input-group-append">
                                        <button className="btn btn-outline-secondary btn-dark" type="button" data-toggle="tooltip" data-placement="top"
                                            title="Buscar por Licencia Publicidad " onClick={this.handleSearchByPublicidadOnClick}><i className="fa fa-search" aria-hidden="true" ></i></button>
                                    </div>
                                </div>
                            </div>
                            : ""}

                        {this.state.showPatenteUnicaMunicipal ?
                            <div className="form-group col-12 col-md-4">
                                <label htmlFor="pres_objeto_tributario[numero">Número de Licencia</label>
                                <div className="input-group ">
                                    <input name="pres_objeto_tributario[numero]" type="text" className="form-control" placeholder="Número de Licencia" required />
                                    <div className="input-group-append">
                                        <button className="btn btn-outline-secondary btn-dark" type="button" data-toggle="tooltip" data-placement="top"
                                            title="Buscar por Licencia de Sitios" onClick={this.handleSearchByLicenciaSitioOnClick}><i className="fa fa-search" aria-hidden="true" ></i></button>
                                    </div>
                                </div>
                            </div>
                            : ""}

                        <div className="form-group col-12 col-md-4">
                            <label htmlFor="pres_objeto_gestion[][gestion]">Gestion Solicitada</label>
                            <Select
                                id="gestion"
                                name="pres_objeto_gestion[][gestion]"
                                isMulti={true}
                                onChange={this.handleGestionChange}
                                options={this.state.optionsGestion}
                                defaultValue={this._defaultOptions} />
                        </div>
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
export default FormObjTributario;
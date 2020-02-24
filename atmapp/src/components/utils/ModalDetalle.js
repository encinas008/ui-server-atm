import React, { Component } from 'react';

import { Link } from 'react-router-dom';

import PropTypes from 'prop-types';
import Iframe from 'react-iframe'
import Fetch from './Fetch';
import Constant from '../../data/constant';

var token_dj = ""
var numero_dj = ""
var estado_dj = ""
var estado_code_dj = ""
var _toast = undefined
var _id_modal = ""
var _rotulo_comercial = ""
var _list_li_licencia = []
var _list_li_dir_act_eco = []
var _list_li_solicitante = []
var _list_li_datos_juridicos = []
var _dir_solicitante = ""
var _dir_solicitante_act_eco = ""
var _confirmar_datos = false
class ModalDetalle extends Component {

    constructor(props, context) {
        super(props, context);

        this.handleCompleteOnClick = this.handleCompleteOnClick.bind(this);
        this.hanldeDownloadPdf = this.hanldeDownloadPdf.bind(this)
        this.hanldeClickShowDataActividad = this.hanldeClickShowDataActividad.bind(this)
        this.hanldeClickShowDataContribuyente = this.hanldeClickShowDataContribuyente.bind(this)

        this.fetch = new Fetch();

        _id_modal = "modalDetalleFul"
        this.title = "Datos de la Actividad Económica: "

        this.state = {
            currentUrl: "",
            list_li_licencia: [],
            list_li_dir_act_eco: [],
            list_li_solicitante: [],
            list_li_datos_juridicos: [],
            dir_solicitante: [],
            confirmar_datos: false,
            estado: "",
            estado_code: "",
            rotulo_comercial: _rotulo_comercial,
            showDatosActividadEconomica: true,
            showDatosContribuyente: false
        };
    }

    componentDidMount() {
        var self = this
        window.jQuery('#' + _id_modal).on('shown.bs.modal', function () {
            //this.title = this.title + _rotulo_comercial
            self.setState({
                list_li_licencia: _list_li_licencia,
                list_li_dir_act_eco: _list_li_dir_act_eco,
                list_li_solicitante: _list_li_solicitante,
                list_li_datos_juridicos: _list_li_datos_juridicos,
                dir_solicitante: _dir_solicitante,
                dir_actividad_economica: _dir_solicitante_act_eco,
                confirmar_datos: _confirmar_datos,
                estado: estado_dj,
                estado_code: estado_code_dj,
                rotulo_comercial: _rotulo_comercial
            });
        });
    }

    setToast(toast) {
        _toast = toast
        this.fetch.setToast(toast);
    }

    hanldeDownloadPdf() {
        window.jQuery.preloader.start();
        const pdf = this.fetch.fetchGet(`api/report/declaracion-jurada/${token_dj}`);
        pdf.then(res => {
            if (res !== undefined && res.status === true) {

                if ((res.base64 !== undefined) && res.base64 !== "") {
                    const fileName = numero_dj + ".pdf";
                    window.downloadFile(res.base64, fileName)
                } else {
                    _toast.warn(res.message, {
                        position: "top-right",
                        autoClose: 5000,
                        hideProgressBar: false,
                        closeOnClick: true,
                        pauseOnHover: true,
                        draggable: true
                    });
                }
                window.jQuery.preloader.stop();
            }
        })
    }

    show(url, confirmar_datos) {
        var self = this;
        const pdf = this.fetch.fetchGet(`${url}`);
        pdf.then(res => {
            if (res !== undefined && res.status === true) {
                window.jQuery("#" + _id_modal).modal("show");
                _rotulo_comercial = "Datos de la Actividad Económica: --"

                //limpiamos las variables
                _list_li_licencia = []
                _list_li_dir_act_eco = []
                _list_li_solicitante = []
                _list_li_datos_juridicos = []

                if (Boolean(res.data) && Boolean(res.data.DeclaracionJurada)) {
                    let licencia = res.data.DeclaracionJurada
                    token_dj = licencia.token
                    numero_dj = licencia.numero

                    _list_li_licencia.push(<li key={0}> <span>Id: </span>{licencia.token} </li>)
                    _list_li_licencia.push(<li key={1}> <span>Número: </span>{licencia.numero} </li>)
                }

                if (Boolean(res.data) && Boolean(res.data.TipoActividadEconomica)) {
                    let tipo_act_econ = res.data.TipoActividadEconomica
                    _list_li_licencia.push(<li key={2}> <span>Tipo Actividad Económica: </span>{tipo_act_econ.name}</li>)
                    _list_li_licencia.push(<li key={3}> <span>Ciiu  : </span>{tipo_act_econ.ciiu}</li>)
                    _list_li_licencia.push(<li key={4}> <span>Permante  : </span>{tipo_act_econ.temporal === false ? 'Si' : 'No'}</li>)
                    _list_li_licencia.push(<li key={5}> <span>Temporal  : </span>{tipo_act_econ.temporal === true ? 'Si' : 'No'}</li>)
                }

                if (Boolean(res.data) && Boolean(res.data.DeclaracionJurada)) {
                    let licencia = res.data.DeclaracionJurada

                    _list_li_licencia.push(<li key={7}> <span>Creado: </span>{window.moment(licencia.created_at).format('DD-MM-YYYY')}</li>)
                    _list_li_licencia.push(<li key={8}> <span>Actualizado: </span>{window.moment(licencia.updated_at).format('DD-MM-YYYY')}</li>)
                }
                /**  domicilio de la actividad economica */
                if (Boolean(res.data) && Boolean(res.data.ActividadEconomica)) {
                    let act_econ = res.data.ActividadEconomica

                    _list_li_dir_act_eco.push(<li key={0}> <span>Comuna: </span>{act_econ.comuna} </li>)
                    _list_li_dir_act_eco.push(<li key={1}> <span>Rotulo comercial: </span>{act_econ.rotulo_comercial} </li>)
                    _list_li_dir_act_eco.push(<li key={2}> <span>Distrito: </span>{act_econ.distrito} </li>)
                    _list_li_dir_act_eco.push(<li key={3}> <span>SubDistrito: </span>{act_econ.sub_distrito} </li>)
                    _list_li_dir_act_eco.push(<li key={4}> <span>Fecha Inicio: </span> {window.moment(act_econ.fecha_inicio).format('DD-MM-YYYY')} </li>)

                    if(Boolean(res.data.ActividadEconomica.rotulo_comercial) )
                        _rotulo_comercial = "Datos de la Actividad Económica: " + res.data.ActividadEconomica.rotulo_comercial
                }

                if (Boolean(res.data) && Boolean(res.data.DomicilioActividadEconomica)) {
                    let dir_actividad_economica = res.data.DomicilioActividadEconomica

                    _list_li_dir_act_eco.push(<li key={5}> <span>Direccion: </span>{dir_actividad_economica.direccion} </li>)
                    _list_li_dir_act_eco.push(<li key={6}> <span>Número: </span>{dir_actividad_economica.numero} </li>)
                    _list_li_dir_act_eco.push(<li key={7}> <span>Zona Tributaria: </span>{dir_actividad_economica.zona} </li>)

                    _list_li_dir_act_eco.push(<li key={8}> <span>Edificio: </span>{dir_actividad_economica.edificio} </li>)
                    _list_li_dir_act_eco.push(<li key={9}> <span>Bloque: </span>{dir_actividad_economica.bloque} </li>)
                    _list_li_dir_act_eco.push(<li key={10}> <span>Piso: </span>{dir_actividad_economica.piso} </li>)
                    _list_li_dir_act_eco.push(<li key={11}> <span>Dpto/Of./Local: </span>{dir_actividad_economica.dpto_of_local} </li>)

                    _list_li_dir_act_eco.push(<li key={12}> <span>Teléfono: </span>{dir_actividad_economica.telefono} </li>)
                    _list_li_dir_act_eco.push(<li key={13}> <span>Celular: </span>{dir_actividad_economica.celular} </li>)

                    _dir_solicitante_act_eco = 'data:image/png;base64, ' + dir_actividad_economica.image;
                }

                /**  Datos del solicitante */
                if (Boolean(res.data) && Boolean(res.data.Solicitante)) {
                    let solicitante = res.data.Solicitante

                    _list_li_solicitante.push(<li key={0}> <span>Contribuyente: </span>{solicitante.contribuyente === 1 ? Constant[0].contribuyente.natural : Constant[0].contribuyente.juridico}</li>);
                }

                if (Boolean(res.data) && Boolean(res.data.Persona)) {
                    let persona = res.data.Persona

                    if (Boolean(res.data) && Boolean(res.data.TipoDocumento)) {
                        let tipo_documento = res.data.TipoDocumento
                        _list_li_solicitante.push(<li key={1}> <span>Tipo de Documento: </span>{tipo_documento.name}</li>);
                    } else
                        _list_li_solicitante.push(<li key={1}> <span>Tipo de Documento: </span></li>);

                    _list_li_solicitante.push(<li key={2}> <span>Número: </span>{persona.numero_documento + " " + persona.expedido_en}</li>);

                    if (Boolean(res.data) && Boolean(res.data.Nacionalidad)) {
                        let nacinalidad = res.data.Nacionalidad
                        _list_li_solicitante.push(<li key={3}> <span>Nacionalidad: </span>{nacinalidad.name}</li>);
                    } else
                        _list_li_solicitante.push(<li key={3}> <span>Nacionalidad: </span></li>);

                    _list_li_solicitante.push(<li key={4}> <span>Nombre: </span>{persona.nombre}</li>);
                    _list_li_solicitante.push(<li key={5}> <span>Apellido Paterno: </span>{persona.apellido_paterno}</li>);
                    _list_li_solicitante.push(<li key={6}> <span>Apellido Materno: </span>{persona.apellido_materno}</li>);

                    if (Boolean(res.data) && Boolean(res.data.EstadoCivil)) {
                        let estado_civil = res.data.EstadoCivil
                        _list_li_solicitante.push(<li key={7}> <span>Estado Civil: </span>{estado_civil.name}</li>);
                    } else
                        _list_li_solicitante.push(<li key={7}> <span>Estado Civil: </span></li>);

                    _list_li_solicitante.push(<li key={8}> <span>Apellido Casada: </span>{persona.apellido_casada}</li>);


                    if (Boolean(res.data) && Boolean(res.data.Genero)) {
                        let genero = res.data.Genero
                        _list_li_solicitante.push(<li key={9}> <span>Género: </span>{genero.name}</li>);
                    } else
                        _list_li_solicitante.push(<li key={9}> <span>Género: </span></li>);

                    _list_li_solicitante.push(<li key={10}> <span>Fecha Nacimiento: </span>{window.moment(persona.fecha_nacimiento).format('DD-MM-YYYY')}</li>);
                }

                if (Boolean(res.data) && Boolean(res.data.DatosJuridicos)) {
                    let datos_juridicos = res.data.DatosJuridicos

                    _list_li_datos_juridicos.push(<li key={0}> <span>Razón Social: </span>{datos_juridicos.razon_social}</li>);
                    _list_li_datos_juridicos.push(<li key={1}> <span>Fecha Constitución: </span>{window.moment(datos_juridicos.fecha_constitucion).format('DD-MM-YYYY')}</li>);
                    _list_li_datos_juridicos.push(<li key={2}> <span>Nit: </span>{datos_juridicos.nit}</li>);
                    _list_li_datos_juridicos.push(<li key={3}> <span>Tipo Sociedad: </span>{datos_juridicos.id_tipo_sociedad}</li>);
                }

                /** Domicilio del solicitante */
                if (Boolean(res.data) && Boolean(res.data.Domicilio)) {
                    let Domicilio = res.data.Domicilio

                    _dir_solicitante = 'data:image/png;base64, ' + Domicilio.image;
                }

                if (Boolean(res.data) && Boolean(res.data.Estado)) {
                    let estado = res.data.Estado
                    estado_dj = estado.name
                    estado_code_dj = estado.code
                }
            }
        })
        _confirmar_datos = confirmar_datos
    }

    handleCompleteOnClick() {
        const form = new FormData();
        form.append('declaracion_jurada[token]', token_dj);

        this.fetch.fetchPost(form, 'api/declaraciones-juradas/complete').then(dataJson => {
            if (dataJson !== undefined && dataJson.status === true) {
                _toast.success(dataJson.message, {
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

    hanldeClickShowDataActividad(event){
        event.preventDefault()
        this.setState({showDatosActividadEconomica: true, showDatosContribuyente: false})
    }

    hanldeClickShowDataContribuyente(event){
        event.preventDefault()
        this.setState({showDatosActividadEconomica: false, showDatosContribuyente: true})
    }

    render() {
        return (
            <div className="modal fade" id={_id_modal} tabIndex="-1" role="dialog" aria-labelledby="movalPdfFullLabel" aria-hidden="true" data-backdrop="static" data-keyboard="false">
                <div className="modal-dialog modal-lg" role="document">
                    <div className="modal-content">
                        <div className="modal-header">
                            <h5 className="modal-title" id="movalPdfFullLabel">{this.state.rotulo_comercial}</h5>
                            <button type="button" className="close" data-dismiss="modal" aria-label="Close">
                                <span aria-hidden="true">&times;</span>
                            </button>
                        </div>
                        <div className="modal-body">
                            <div className="row">
                                <div className="col-12 col-sm-12 col-md-6 col-lg-6 ">
                                    <Link to="#" onClick={this.hanldeClickShowDataActividad} className="" title="Show Data Actividad Economica" >
                                        Datos de la Actividad Economica
                                    </Link>
                                </div>

                                <div className="col-12 col-sm-12 col-md-6 col-lg-6 text-right">
                                    <Link to="#" onClick={this.hanldeClickShowDataContribuyente} className="" title="Datos del Contribuyente" >
                                        Datos del Contribuyente
                                    </Link>
                                </div>
                            </div>
                            <br/>

                            {this.state.showDatosActividadEconomica ?
                                <>
                                    <nav className="nav nav-pills">
                                        <a className="nav-link nav-item active" data-toggle="tab" href="#actividadEconomica">
                                            <img className="img-fluid" src="./static/img/shop512x1512.png" alt="Actividad Económica" />
                                            <span>Actividad Economica</span>
                                        </a>

                                        <a className="nav-link nav-item" data-toggle="tab" href="#domicilioActividadEconomica">
                                            <img className="img-fluid" src="./static/img/shopaddress512x512.png" alt="Dirección Actividad Economica" />
                                            <span>Ubicación</span>
                                        </a>
                                    </nav>

                                    <div className="tab-content" role="tabpanel">
                                        <div role="tabpanel" className="tab-pane fade show active" id="actividadEconomica">
                                            <ul className="unstyled " >
                                                {this.state.list_li_licencia}
                                            </ul>
                                        </div>
                                        <div role="tabpanel" className="tab-pane fade" id="domicilioActividadEconomica">

                                            <div className="row">
                                                <div className="col-12 col-sm-12 col-md-12 col-lg-12">
                                                    <ul className="unstyled " >
                                                        {this.state.list_li_dir_act_eco}
                                                    </ul>
                                                </div>
                                            </div>

                                            <div className="row">
                                                <div className="col-12 col-sm-12 col-md-12 col-lg-12">
                                                    <img id='domicilio[image]' className='img-thumbnail img-thumbnail rounded mx-auto d-block' alt='img-domicilio'
                                                        src={this.state.dir_actividad_economica} />
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </>
                                : ""}

                            {this.state.showDatosContribuyente ?
                                <>
                                    <nav className="nav nav-pills">
                                        <a className="nav-link nav-item active" data-toggle="tab" href="#solicitante">
                                            <img className="img-fluid" src="./static/img/contribuyente32x32.png" alt="Contribuyente" />
                                            <span>Contribuyente</span>
                                        </a>

                                        <a className="nav-link nav-item" data-toggle="tab" href="#domicilioSolicitante">
                                            <img className="img-fluid" src="./static/img/address512x512.png" alt="Dirección Contribuyente" />
                                            <span>Ubicación</span>
                                        </a>
                                    </nav>

                                    <div className="tab-content" role="tabpanel">
                                        <div role="tabpanel" className="tab-pane fade show active" id="solicitante">
                                            <div className="row">
                                                <div className="col-12 col-sm-12 col-md-6 col-lg-6">
                                                    <ul className="unstyled " >
                                                        {this.state.list_li_solicitante}
                                                    </ul>
                                                </div>

                                                <div className="col-12 col-sm-12 col-md-6 col-lg-6">
                                                    <ul className="unstyled " >
                                                        {this.state.list_li_datos_juridicos}
                                                    </ul>
                                                </div>
                                            </div>
                                        </div>

                                        <div role="tabpanel" className="tab-pane fade" id="domicilioSolicitante">
                                            <img id='domicilio[image]' className='img-thumbnail img-thumbnail rounded mx-auto d-block' alt='img-domicilio'
                                                src={this.state.dir_solicitante} />
                                        </div>
                                    </div>
                                </>
                                : ""}
                        </div>
                        <div className="modal-footer">
                            {this.state.confirmar_datos === true ?
                                <input name="inputConfirmarDatos" type="submit" className="button-style pull-right"
                                    value="Confirmar Datos Licencia" onClick={this.handleCompleteOnClick} />
                                :
                                <div className="row" style={{ width: '100%' }}>
                                    <div className="col-6 col-sm-6 col-md-6 col-lg-6 padding-left-0">
                                        <h5 className="pull-left text-uppercase" style={{ marginRight: '10px' }}>{this.state.estado}</h5>
                                        <Link to="#" onClick={this.hanldeDownloadPdf} title="Descargar" style={{ fontSize: '20px' }} >
                                            <i className="fa fa-download" aria-hidden="true"></i>
                                        </Link>
                                    </div>

                                    <div className="col-6 col-sm-6 col-md-6 col-lg-6 ">
                                        <button type="button" className="btn btn-secondary pull-right" data-dismiss="modal" >Cerrar</button>
                                    </div>
                                </div>
                            }
                        </div>
                    </div>
                </div>
            </div>
        );
    }
}

export default ModalDetalle;
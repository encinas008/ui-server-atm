import React, { Component } from 'react';

import Fetch from '../../components/utils/Fetch';
import Constant from '../../data/constant';
import Texto from '../../data/es';
import Languaje from '../../data/es';
import PasosNavigationLicencia from '../../components/utils/PasosNavigationLicencia';

/**
 * formulario de domicilio del solicitante
 */

var _rotulo_comercial = ""
var _list_li_licencia = []
var _list_li_dir_act_eco = []
var _list_li_solicitante = []
var _list_li_datos_juridicos = []
var _dir_solicitante = []

class FormReport extends Component {

    constructor(props, context) {
        super(props, context);

        this.fetch = new Fetch();
        this.fetch.setToast(this.props.toast);

        this.state = {
            currentUrl: "",
            list_li_licencia: [],
            list_li_dir_act_eco: [],
            list_li_solicitante: [],
            list_li_datos_juridicos: [],
            dir_solicitante: [],
            /*confirmar_datos: false,
            estado: "",
            estado_code: "",*/
            rotulo_comercial: _rotulo_comercial
        };
    }

    componentDidMount() {
        if (Boolean(this.props.declaracionJurada)) {

            var self = this;
            const pdf = this.fetch.fetchGet(`api/licencia-actividad-economica/by-token/${this.props.declaracionJurada.token_dj}`);
            pdf.then(res => {
                if (res !== undefined && res.status === true) {
                    _rotulo_comercial = "Datos de la Actividad Económica: "+res.data.ActividadEconomica.rotulo_comercial

                    //limpiamos las variables
                    _list_li_licencia = []
                    _list_li_dir_act_eco = []
                    _list_li_solicitante = []
                    _list_li_datos_juridicos = []

                    if(Boolean(res.data) && Boolean(res.data.DeclaracionJurada)){
                        let licencia = res.data.DeclaracionJurada

                        _list_li_licencia.push(<li key={0}> <span>Id: </span>{licencia.token} </li>)
                        _list_li_licencia.push(<li key={1}> <span>Número: </span>{licencia.numero} </li>)
                    }

                    if(Boolean(res.data) && Boolean(res.data.TipoActividadEconomica)){
                        let tipo_act_econ = res.data.TipoActividadEconomica
                        _list_li_licencia.push(<li key={2}> <span>Tipo Actividad Económica: </span>{tipo_act_econ.name}</li>)
                        _list_li_licencia.push(<li key={3}> <span>Ciiu  : </span>{tipo_act_econ.ciiu}</li>)
                        _list_li_licencia.push(<li key={4}> <span>Permante  : </span>{tipo_act_econ.temporal === false ? 'Si': 'No'}</li>)
                        _list_li_licencia.push(<li key={5}> <span>Temporal  : </span>{tipo_act_econ.temporal === true ? 'Si': 'No'}</li>)
                    }

                    if(Boolean(res.data) && Boolean(res.data.DeclaracionJurada)){
                        let licencia = res.data.DeclaracionJurada

                        _list_li_licencia.push(<li key={7}> <span>Creado: </span>{licencia.created_at} </li>)
                        _list_li_licencia.push(<li key={8}> <span>Actualizado: </span>{licencia.updated_at}</li>)

                    }
                    /**  domicilio de la actividad economica */
                    if(Boolean(res.data) && Boolean(res.data.ActividadEconomica)){
                        let act_econ = res.data.ActividadEconomica
                        
                        _list_li_dir_act_eco.push(<li key={0}> <span>Comuna: </span>{act_econ.comuna} </li>)
                        _list_li_dir_act_eco.push(<li key={1}> <span>Rotulo comercial: </span>{act_econ.rotulo_comercial} </li>)
                        _list_li_dir_act_eco.push(<li key={2}> <span>Distrito: </span>{act_econ.distrito} </li>)
                        _list_li_dir_act_eco.push(<li key={3}> <span>SubDistrito: </span>{act_econ.sub_distrito} </li>)
                        _list_li_dir_act_eco.push(<li key={4}> <span>Fecha Inicio: </span>{act_econ.fecha_inicio} </li>)
                    }

                    if(Boolean(res.data) && Boolean(res.data.DeclaracionJurada)){
                        let dir_actividad_economica = res.data.DeclaracionJurada
                        
                        _list_li_dir_act_eco.push(<li key={5}> <span>Direccion: </span>{dir_actividad_economica.direccion} </li>)
                        _list_li_dir_act_eco.push(<li key={6}> <span>Número: </span>{dir_actividad_economica.numero} </li>)
                        _list_li_dir_act_eco.push(<li key={7}> <span>Zona Tributaria: </span>{dir_actividad_economica.zona} </li>)

                        _list_li_dir_act_eco.push(<li key={8}> <span>Edificio: </span>{dir_actividad_economica.edificio} </li>)
                        _list_li_dir_act_eco.push(<li key={9}> <span>Bloque: </span>{dir_actividad_economica.bloque} </li>)
                        _list_li_dir_act_eco.push(<li key={10}> <span>Piso: </span>{dir_actividad_economica.piso} </li>)
                        _list_li_dir_act_eco.push(<li key={11}> <span>Dpto/Of./Local: </span>{dir_actividad_economica.dpto_of_local} </li>)

                        _list_li_dir_act_eco.push(<li key={12}> <span>Teléfono: </span>{dir_actividad_economica.telefono} </li>)
                        _list_li_dir_act_eco.push(<li key={13}> <span>Celular: </span>{dir_actividad_economica.celular} </li>)
                    }

                    /**  Datos del solicitante */
                    if(Boolean(res.data) && Boolean(res.data.Solicitante)){
                        let solicitante = res.data.Solicitante
                        
                        _list_li_solicitante.push(<li key={0}> <span>Contribuyente: </span>{solicitante.contribuyente === 1 ? Constant[0].contribuyente.natural : Constant[0].contribuyente.juridico }</li>);
                    }

                    if(Boolean(res.data) && Boolean(res.data.Persona)){
                        let persona = res.data.Persona

                        _list_li_solicitante.push(<li key={1}> <span>Tipo de Documento: </span>{persona.id_tipo_documento }</li>);
                        _list_li_solicitante.push(<li key={2}> <span>Número: </span>{persona.numero_documento + " "+ persona.expedido_en}</li>);
                        _list_li_solicitante.push(<li key={3}> <span>Nacionalidad: </span>{persona.nacionalidad }</li>);
                        _list_li_solicitante.push(<li key={4}> <span>Nombre: </span>{persona.nombre }</li>);
                        _list_li_solicitante.push(<li key={5}> <span>Apellido Paterno: </span>{persona.apellido_paterno }</li>);
                        _list_li_solicitante.push(<li key={6}> <span>Apellido Materno: </span>{persona.apellido_materno }</li>);
                        _list_li_solicitante.push(<li key={7}> <span>Estado Civil: </span>{persona.estado_civil }</li>);
                        _list_li_solicitante.push(<li key={8}> <span>Apellido Casada: </span>{persona.apellido_casada }</li>);
                        _list_li_solicitante.push(<li key={9}> <span>Género: </span>{persona.genero }</li>);
                        _list_li_solicitante.push(<li key={10}> <span>Fecha Nacimiento: </span>{persona.fecha_nacimiento }</li>);
                    }

                    if(Boolean(res.data) && Boolean(res.data.DatosJuridicos)){
                        let datos_juridicos = res.data.DatosJuridicos
                        
                        _list_li_datos_juridicos.push(<li key={0}> <span>Razón Social: </span>{datos_juridicos.razon_social }</li>);
                        _list_li_datos_juridicos.push(<li key={1}> <span>Fecha Constitución: </span>{window.moment(datos_juridicos.fecha_constitucion).format('DD-MM-YYYY') }</li>);
                        _list_li_datos_juridicos.push(<li key={2}> <span>Nit: </span>{datos_juridicos.nit }</li>);
                        _list_li_datos_juridicos.push(<li key={3}> <span>Tipo Sociedad: </span>{datos_juridicos.id_tipo_sociedad }</li>);
                    }

                    /** Domicilio del solicitante */
                    if(Boolean(res.data) && Boolean(res.data.Domicilio)){
                        let Domicilio = res.data.Domicilio
                        
                        _dir_solicitante = 'data:image/png;base64, '+Domicilio.image;
                    }

                    self.setState({
                        list_li_licencia: _list_li_licencia, 
                        list_li_dir_act_eco:_list_li_dir_act_eco, 
                        list_li_solicitante: _list_li_solicitante,
                        list_li_datos_juridicos: _list_li_datos_juridicos,
                        dir_solicitante: _dir_solicitante,
                        rotulo_comercial: _rotulo_comercial
                    });
                }
            })
        }
    }

    render() {
        return (
            <div id="" >

                <div className="row">
                    <PasosNavigationLicencia titulo_paso1={Constant[0].derecho_admision.permanente ? " "+Languaje.actividad_economica_permanente : " "+Languaje.actividad_economica_temporal} 
                            paso1_active={true} paso2_active={true} paso3_active={true} paso4_active={true} paso5_active={true}/>
                </div>

                <div className="row">
                    <form action="" className="contact__form needs-validation" name="formReportDJ" id="formReportDJ"
                        method="post" noValidate onSubmit={this.props.onSubmitForm} style={{ width: '100%' }}>
                        <div className="row">
                            <div className="col-sm-12 col-md-12 col-lg-12 ">
                                <nav className="nav nav-pills">
                                    <a className="nav-link nav-item active" data-toggle="tab" href="#actividadEconomica">
                                        <img className="img-fluid" src="./static/img/shop512x1512.png" alt="Actividad Económica"/>
                                        <span>Actividad Economica</span>
                                    </a>

                                    <a className="nav-link nav-item" data-toggle="tab" href="#domicilioActividadEconomica">
                                        <img className="img-fluid" src="./static/img/shopaddress512x512.png" alt="Dirección Actividad Economica"/>
                                        <span>Ubicación</span>
                                    </a>
                                    
                                    <a className="nav-link nav-item" data-toggle="tab" href="#solicitante">
                                        <img className="img-fluid" src="./static/img/contribuyente32x32.png" alt="Contribuyente"/>
                                        <span>Contribuyente</span>
                                    </a>

                                    <a className="nav-link nav-item" data-toggle="tab" href="#domicilioSolicitante">
                                        <img className="img-fluid" src="./static/img/address512x512.png" alt="Dirección Contribuyente"/>
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
                                        <ul className="unstyled " >
                                            {this.state.list_li_dir_act_eco}
                                        </ul>
                                    </div>
                                    <div role="tabpanel" className="tab-pane fade" id="solicitante">
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
                                        src={this.state.dir_solicitante } />
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div className="row">
                            <div className="col-sm-12 col-md-12 col-lg-12 form-group">
                                <input name="Siguiente" type="submit" className="button-style pull-right" value="Confirmar Datos Licencia e Imprimir" />
                            </div>
                        </div>
                    </form>
                </div>
            </div>
        );
    }
}

export default FormReport;
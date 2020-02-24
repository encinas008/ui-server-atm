import React, { Component } from 'react';
import Config from '../../data/config';

//<!--================== Services section =====================-->
class Services extends Component {

    hanldeOpenModalClick(ev, url) {
        window.jQuery("#modalFormContacts").modal("show")
    }

    render = () => {
        return <div id="services" className="blog">
            <div className="container features">
                <div className="row">
                    <div className="col-lg-3 col-md-6 col-sm-12 bottom-space">
                        <div className="folded-corner service_tab_1">
                            <div className="text">
                                <img className='img-thumbnail rounded mx-auto d-block img-noborder' alt='img-prescripcion'
                                    src={Config[2].url + '/static/img/men_work.png'} style={{height:'5em'}}/>
                                <h3 className="item-title"> Ingresos Tributarios</h3>
                                <p> El Departamento de Ingresos Tributarios tiene las funciones de...</p>
                            </div>
                        </div>
                    </div>
                    <div className="col-lg-3 col-md-6 col-sm-12 bottom-space">
                        <div className="folded-corner service_tab_1">
                            <div className="text">
                                {/* <i className="fa fa-lightbulb-o fa-5x fa-icon-image" ></i>*/}
                                <img className='img-thumbnail rounded mx-auto d-block img-noborder' alt='img-prescripcion'
                                    src={Config[2].url + '/static/img/men_work.png'} style={{height:'5em'}}/>
                                <h3 className="item-title"> Fiscalización</h3>
                                <p> El Departamento de Fiscalización tiene las funciones de...</p>
                            </div>
                        </div>
                    </div>
                    <div className="col-lg-3 col-md-6 col-sm-12 bottom-space">
                        <div className="folded-corner service_tab_1">
                            <div className="text">
                                {/*<i className="fa fa-truck fa-5x fa-icon-image"></i>*/}
                                <img className='img-thumbnail rounded mx-auto d-block img-noborder' alt='img-prescripcion'
                                    src={Config[2].url + '/static/img/men_work.png'} style={{height:'5em'}}/>
                                <h3 className="item-title"> Legal Tributario</h3>
                                <p> El Departamento Legal Tributario tiene las funciones de...</p>
                            </div>
                        </div>
                    </div>
                    <div className="col-lg-3 col-md-6 col-sm-12 bottom-space">
                        <div className="folded-corner service_tab_1">
                            <div className="text">
                                {/*<i className="fa fa-truck fa-5x fa-icon-image"></i>*/}
                                <img className='img-thumbnail rounded mx-auto d-block img-noborder' alt='img-prescripcion'
                                    src={Config[2].url + '/static/img/men_work.png'} style={{height:'5em'}}/>
                                <h3 className="item-title"> Plataforma</h3>
                                <p> El Departamento de Plataforma tiene las funciones de...</p>
                            </div>
                        </div>
                    </div>
                    {/* 
                    <div className="col-lg-3 col-md-6 col-sm-12 bottom-space">
                        <div className="folded-corner service_tab_1 pointer" onClick={e => this.hanldeOpenModalClick(e, "")}>
                            <div className="text">
                                <i className="fa fa-envelope-open-o fa-5x fa-icon-image"></i>
                                <h3 className="item-title"> Contactanos</h3>
                            </div>
                        </div>
                    </div>
                    */}
                </div>
            </div>
        </div>
        ;
    }
}

export default Services;
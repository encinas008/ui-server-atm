import React, { Component } from 'react';
import Iframe from 'react-iframe'

import Fetch from '../../components/utils/Fetch';
import Constant from '../../data/constant';
import Texto from '../../data/es';
import Languaje from '../../data/es';
import Links from '../../data/link';
import PasosNavigationLicencia from '../../components/utils/PasosNavigationLicencia';
import { Link } from 'react-router-dom';
import AuthService from '../../components/Usuario/AuthService';
import Config from '../../data/config';

/**
 * formulario de domicilio del solicitante
 */
var _declaracionJurada = undefined
var _solicitante = undefined
var derecho_admision = 0
class VistaPrevia extends Component {

    constructor(props, context) {
        super(props, context);

        this.fetch = new Fetch();
        this.fetch.setToast(this.props.toast);

        this.Auth = new AuthService();

        this.handleCancelClick = this.handleCancelClick.bind(this)
        this.handleEditClick = this.handleEditClick.bind(this)
        this.handleCheckClick = this.handleCheckClick.bind(this)
        this.hanldeDownloadPdf = this.hanldeDownloadPdf.bind(this)
        this.handleOnladIFrame = this.handleOnladIFrame.bind(this)

        this.state = {
            showButtons: true
        };
    }
    componentDidMount() {
        window.jQuery.preloader.start();
        window.scrollTo(0, 0);
        if (Boolean(this.props.data)) {
            if (this.props.data.DeclaracionJurada !== null) {
                _declaracionJurada = this.props.data.DeclaracionJurada
            }
            if (this.props.data.Solicitante !== null) {
                _solicitante = this.props.data.Solicitante
            }

            this.completeLicencia(this, _declaracionJurada.token)
        } else {
            //para nuevos registros
            var self = this
            if (Boolean(this.props.declaracionJurada)) {

                this.fetch.fetchGet(`api/licencia-actividad-economica/by-token/${this.props.declaracionJurada.token_dj}`).then(dataJson => {
                    if (dataJson !== undefined && dataJson.status === true) {

                        if (dataJson.data.DeclaracionJurada !== null) {
                            _declaracionJurada = dataJson.data.DeclaracionJurada
                        }
                        if (dataJson.data.Solicitante !== null) {
                            _solicitante = dataJson.data.Solicitante
                        }
                        self.completeLicencia(self, dataJson.data.DeclaracionJurada.token)

                        self.fetch.toast.success(dataJson.message, {
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
    }

    completeLicencia(self, token_dj) {
        const form = new FormData();
        form.append('declaracion_jurada[token]', token_dj);

        self.fetch.fetchPost(form, 'api/declaraciones-juradas/complete').then(dataJson => {

            if (dataJson !== undefined && dataJson.status === true) {
                if (Boolean(dataJson.DeclaracionJurada)) {
                    self.downloadPdf(`${Config[0].url}report/licencia-actividad-economica/${_declaracionJurada.token}/?auth=${ self.Auth.getToken()}`, self);

                    if(dataJson.Estado !== null  ){
                        if(dataJson.Estado.code === Constant[0].estado.aprobado ){
                            self.setState({showButtons: false })
                        }
                    }
                    self.fetch.toast.success(dataJson.message, {
                        position: "top-right",
                        autoClose: 5000,
                        hideProgressBar: false,
                        closeOnClick: true,
                        pauseOnHover: true,
                        draggable: true
                    });
                } else {
                    self.fetch.toast.warn(dataJson.message, {
                        position: "top-right",
                        autoClose: 5000,
                        hideProgressBar: false,
                        closeOnClick: true,
                        pauseOnHover: true,
                        draggable: true
                    });
                }
            }

            /*setTimeout(() => {
                window.jQuery.preloader.stop();
            }, 3000);*/
        })
    }

    handleCancelClick(event) {
        event.preventDefault();
        var self = this
        window.deleteBootbox( Texto.numero_orden_perderan_datos.replace("%s", _declaracionJurada.numero) , function (result) {
            if (result === true) {
                const delete_lic = self.fetch.fetchGet(`api/licencia-actividad-economica/delete/${_declaracionJurada.token}`);
                delete_lic.then(res => {
                    if (res !== undefined && res.status === true) {
                        self.fetch.toast.success(res.message + ". " + Texto.espere_redireccionamos_pagina, {
                            position: "top-right",
                            autoClose: 5000,
                            hideProgressBar: false,
                            closeOnClick: true,
                            pauseOnHover: true,
                            draggable: true
                        });

                        window.redirect(Links[1].url);
                    }
                })
            }
        })
    }

    handleEditClick(event) {
        event.preventDefault();
        window.editLicenciaMiniBootbox(Links[6].url, _solicitante.contribuyente, _declaracionJurada.token, _declaracionJurada.numero)
    }

    handleCheckClick(event) {
        event.preventDefault();
        var self = this

        window.confirmBootbox(_declaracionJurada.numero, function (result) {
            if (result === true) {
                window.jQuery.preloader.start();
                const aprobar_lic = self.fetch.fetchGet(`api/declaracione-jurada/check/${_declaracionJurada.token}`);
                aprobar_lic.then(res => {
                    if (res !== undefined && res.status === true) {
                        //self.downloadPdf(`api/report/declaracion-jurada/${res.DeclaracionJurada.token}`, self); this.Auth.loggedIn()
                        self.downloadPdf(`${Config[0].url}report/licencia-actividad-economica/${res.DeclaracionJurada.token}/?auth=${ self.Auth.getToken()}`, self);

                        if(res.Estado.code === Constant[0].estado.aprobado ){
                            self.setState({showButtons: false })
                        }

                        self.fetch.toast.success(res.message, {
                            position: "top-right",
                            autoClose: 5000,
                            hideProgressBar: false,
                            closeOnClick: true,
                            pauseOnHover: true,
                            draggable: true
                        });
                    }
                    //window.jQuery.preloader.stop();
                })
            }
        })
    }

    downloadPdf(url, self) {
        document.getElementById('iframePreviewLicPdf').src = url
    }

    handleOnladIFrame(event){
        window.jQuery.preloader.stop();
    }

    hanldeDownloadPdf(event) {
        event.preventDefault()
        //window.open(Config[0].url +`report/licencia-actividad-economica-download/${_declaracionJurada.token}/?auth=`+this.Auth.getToken());
        window.location.href = Config[0].url +`report/licencia-actividad-economica-download/${_declaracionJurada.token}/?auth=`+this.Auth.getToken(); 
    }

    render() {
        if (this.props.hasOwnProperty('declaracionJurada') && this.props.declaracionJurada.hasOwnProperty('derecho_admision')) {
            derecho_admision = this.props.declaracionJurada.derecho_admision
        }
        return (
            <div id="" >

                <div className="row">
                    <PasosNavigationLicencia titulo_paso1={(parseInt(derecho_admision) === parseInt(Constant[0].derecho_admision.permanente)) ? Languaje.actividad_economica_permanente : Languaje.actividad_economica_temporal}
                        paso1_active={true} paso2_active={true} paso3_active={true} paso4_active={true} paso5_active={true} />
                </div>

                <div className="row">
                    <div className="col-sm-12 col-md-12 col-lg-12 embed-container">
                         <Iframe
                            src=""
                            width="640"
                            height="360"
                            frameBorder="0"
                            allow="allow-same-origin allow-scripts allow-popups allow-forms"
                            allowFullScreen
                            id="iframePreviewLicPdf"
                            //className="myClassname"
                            display="initial"
                            onLoad={this.handleOnladIFrame}
                        >
                        </Iframe>
                    </div>
                </div>

                <br /><br />
                <div className="row">
                    <div className="col-10 col-md-10 col-lg-10 paddingTop15">
                        <p>En caso no se visualize el pdf, puedes  
                        <Link to="#" onClick={this.hanldeDownloadPdf} title="Descargar" style={{ paddingLeft: '5px' }} >
                         hacer click aquí para descargar el archivo PDF.
                        </Link>
                        </p>
                    </div>

                    <div className="col-2 col-md-2 col-lg-2 paddingTop15 pull-right">
                        <Link to="#" onClick={this.hanldeDownloadPdf} title="Descargar" style={{ fontSize: '3em', float: 'right', marginTop: '-35px' }}  >
                            <i className="fa fa-print fa-icon-image" aria-hidden="true"></i>
                        </Link>
                    </div>
                </div>
                <br /><br />

                { this.state.showButtons ? 
                <div className="row">
                    <div className="col-sm-12 col-md-4 col-lg-4 form-group ">
                        <button type="button" className=" pull-left button-red" onClick={this.handleCancelClick} >{Texto.eliminar}</button>
                    </div>

                    <div className="col-sm-12 col-md-4 col-lg-4 form-group">
                        <input type="submit" className="button-style" value={Texto.editar_mis_datos} onClick={this.handleEditClick} />
                    </div>

                    <div className="col-sm-12 col-md-4 col-lg-4 form-group ">
                        <input type="submit" className="button-style pull-right" value={Texto.confirmar_mis_datos} onClick={this.handleCheckClick} />
                    </div>
                </div>
                : ""}
            </div>
        );
    }
}

export default VistaPrevia;
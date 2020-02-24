import React, { Component } from 'react';
import PropTypes from 'prop-types';
import Iframe from 'react-iframe'
import Fetch from './Fetch';
import Constant from '../../data/constant';
import { Link } from 'react-router-dom';
import Config from '../../data/config';
import AuthService from '../../components/Usuario/AuthService';

var token_dj = ""
var _toast = undefined
var _id_modal = ""
var _rotulo_comercial = ""
class ModalPdf extends Component {

    constructor(props, context) {
        super(props, context);

        //this.handleCompleteOnClick = this.handleCompleteOnClick.bind(this);
        this.hanldeDownloadPdf = this.hanldeDownloadPdf.bind(this)
        this.handleOnlad = this.handleOnlad.bind(this)

        this.fetch = new Fetch();
        this.Auth = new AuthService();

        token_dj = ""
        _toast = undefined
        _rotulo_comercial = ""

        _id_modal = "modalPdfFul"
        this.title = "Datos de la Actividad Económica: "

        this.state = {
            currentUrl: ""
        };
    }

    setToast(toast){
        _toast = toast
        this.fetch.setToast(toast);
    }

    showPdf(url, rotulo_comercial, token, auth){
        //modal_pdf
        window.jQuery.preloader.start();

        window.jQuery("#"+_id_modal).modal("show");
        document.getElementById('iframeLicPdf').src = url//+this.Auth.getToken()
        window.jQuery("#"+_id_modal).find("#titlePdfFullLabel").html("Datos de la Actividad Económica: "+rotulo_comercial)
        token_dj = token

        /*const pdf = this.fetch.fetchGet(`${url}`);
        pdf.then(res => {
            debugger
            if (res !== undefined && res.status === true) {
                window.jQuery("#"+_id_modal).modal("show");
                window.jQuery("#"+_id_modal).find("#movalPdfFullLabel")[0].innerHtml = "Datos de la Actividad Económica: "+res.ActividadEconomica.rotulo_comercial

                var blob = window.base64ToBlob(res.base64)
                document.getElementById('iframeLicPdf').src = blob

                token_dj = res.DeclaracionJurada.token
                window.jQuery.preloader.stop();
            }
        })*/
    }

    hanldeDownloadPdf(event) {
        event.preventDefault()
        //window.open(Config[0].url +`report/licencia-actividad-economica-download/${token_dj}/?auth=`+this.Auth.getToken());
        window.location.href = Config[0].url +`report/licencia-actividad-economica-download/${token_dj}/?auth=`+this.Auth.getToken(); 
    }

    handleOnlad(event){
        window.jQuery.preloader.stop();
    }

    render() {
        return (
            <div className="modal fade" id={_id_modal} tabIndex="-1" role="dialog" aria-labelledby="movalPdfFullLabel" aria-hidden="true" data-backdrop="static" data-keyboard="false">
                <div className="modal-dialog modal-lg" role="document">
                    <div className="modal-content">
                        <div className="modal-header">
                            <h5 className="modal-title" id="titlePdfFullLabel">{this.title}</h5>
                            <button type="button" className="close" data-dismiss="modal" aria-label="Close">
                                <span aria-hidden="true">&times;</span>
                            </button>
                        </div>
                        <div className="modal-body">
                            <div className="row">
                                <div className="col-sm-12 col-md-12 col-lg-12 embed-container">
                                    <Iframe url={this.state.currentUrl}
                                        width="640"
                                        height="360"
                                        frameBorder="0"
                                        allow="accelerometer; autoplay; encrypted-media; gyroscope; picture-in-picture"
                                        allowFullScreen 
                                        id="iframeLicPdf"
                                        //className="myClassname"
                                        display="initial"
                                        onLoad={this.handleOnlad}
                                    />
                                </div>
                            </div>

                            <br /><br />
                            <div className="row">
                                <div className="col-11 col-md-11 col-lg-11 paddingTop15">
                                    <p>En caso no se visualize el pdf, puedes  
                                    <Link to="#" onClick={this.hanldeDownloadPdf} title="Descargar" style={{ paddingLeft: '5px' }} >
                                    hacer click aquí para descargar el archivo PDF.
                                    </Link>
                                    </p>
                                </div>

                                <div className="col-1 col-md-1 col-lg-1 paddingTop15 pull-right">
                                    <Link to="#" onClick={this.hanldeDownloadPdf} title="Descargar" style={{ fontSize: '2em', float: 'right', marginTop: '-5px' }}  >
                                        <i className="fa fa-print fa-icon-image" aria-hidden="true"></i>
                                    </Link>
                                </div>
                            </div>
                        </div>
                        <div className="modal-footer">
                            {/* 
                            <input name="inputConfirmarDatos" type="submit" className="button-style pull-right" 
                            value="Confirmar Datos Licencia" onClick={this.handleCompleteOnClick} />
                            */}
                            <button type="button" className="btn btn-secondary pull-right" data-dismiss="modal" >Cerrar</button>
                        </div>
                    </div>
                </div>
            </div>
        );
    }
}

export default ModalPdf;
import React, { Component } from 'react';
import Iframe from 'react-iframe'


import Constant from '../../data/constant';
import Config from '../../data/config';
import Texto from '../../data/es';
import { Link } from 'react-router-dom';
import PasosNavigationPrescripcion from './../utils/PasosNavigationPrescripcion';
import Languaje from '../../data/es';
import Fetch from '../../components/utils/Fetch';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

var url_map = ""
var derecho_admision = 0
class PrevistaPres extends Component {

    constructor(props, context) {
        super(props, context);

        this.fetch = new Fetch();
        this.fetch.setToast(toast);

    }

    componentDidMount() {
        //console.log(this.props.prescripcion);
        var self = this;
        debugger
        if(Boolean(this.props.prescripcion)){
            this.fetch.fetchGet(`api/report/prescripcionPdf/${this.props.prescripcion.token}`).then(dataJson => {
               debugger
                if (dataJson !== undefined && dataJson.status === true) {
                    document.getElementById("iframePreviewLicPdf").setAttribute("src", dataJson.base64)
    
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

    hanldeDownloadPdf(event) {
        event.preventDefault()
        //window.open(Config[0].url +`report/licencia-actividad-economica-download/${_declaracionJurada.token}/?auth=`+this.Auth.getToken());
        //window.location.href = Config[0].url +`report/licencia-actividad-economica-download/${_declaracionJurada.token}/?auth=`+this.Auth.getToken(); 
    }

    render() {

        return (
            <div id="" >
                <div className="row">
                    <PasosNavigationPrescripcion titulo_paso1={"contribuyente" + this.props.contribuyente} paso1_active={true} paso2_active={true} paso3_active={true} paso4_active={true} />
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

                <br />
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
                <br />

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
            </div>
        );
    }
}

export default PrevistaPres;
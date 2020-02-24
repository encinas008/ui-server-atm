import React, { Component } from 'react';

import Constant from '../../data/constant';
import ModalDomicilio from './ModalDomicilio';
import Config from '../../data/config';
import Texto from '../../data/es';
import { Link } from 'react-router-dom';
import PasosNavigationLicencia from '../../components/utils/PasosNavigationLicencia';
import Languaje from '../../data/es';

var url_map = ""
var derecho_admision = 0
class FormDomicilio extends Component {

    constructor(props, context) {
        super(props, context);

        this.domicilioDb = null

        this.state = {
            coordinate: "",
            showMapa: false
        };

        this.constant = Constant[0];
        this.handleMapOnClick = this.handleMapOnClick.bind(this);
    }

    componentDidMount() {
        window.jQuery("#formDomicilioSolicitante").parsley().validate();

        if (this.props.domicilioDb !== undefined && Object.keys(this.props.domicilioDb).length > 0) {
            this.domicilioDb = this.props.domicilioDb

            if (this.domicilioDb.domicilio !== null) {
                url_map = this.domicilioDb.domicilio.image
                //document.getElementsByName('domicilio[image]')[0].value = this.domicilioDb.domicilio.image; //input
                document.getElementsByName('domicilio[latitud]')[0].value = this.domicilioDb.domicilio.latitud; //input
                document.getElementsByName('domicilio[longitud]')[0].value = this.domicilioDb.domicilio.longitud; //input
                document.getElementsByName('domicilio[coordinate]')[0].value = this.domicilioDb.domicilio.coordinate; //input

                this.setState({
                    coordinate: this.domicilioDb.domicilio.coordinate, showMapa: true
                });
            }
        }

        var self = this
        window.jQuery('#modalMapDomicilio').on('hidden.bs.modal', function () {
            if(document.getElementsByName("domicilio[latitud]")[0].value.length === 0 &&
                document.getElementsByName("domicilio[longitud]")[0].value.length === 0
              ){
                if(self.state.showMapa === true)
                    self.setState({ showMapa: false});
            }
        });
    }

    componentDidUpdate(prevProps, prevState, snapshot) {

        if (this.state.showMapa === true) {
            document.getElementById("domicilio[image]").src = 'data:image/png;base64, ' + url_map;  //img
        }
    }

    handleMapOnClick(event) {
        window.jQuery('#modalMapDomicilio').modal('show');

        if(this.state.showMapa === false)
            this.setState({ showMapa: true});
    }

    render() {
        if(this.props.hasOwnProperty('declaracionJurada') && this.props.declaracionJurada !== undefined ){
            if( this.props.declaracionJurada.hasOwnProperty('derecho_admision'))
                derecho_admision = this.props.declaracionJurada.derecho_admision
        }
        return (
            <div className="row">
                <PasosNavigationLicencia titulo_paso1={(parseInt(derecho_admision)  === parseInt(Constant[0].derecho_admision.permanente)) ? Languaje.actividad_economica_permanente : Languaje.actividad_economica_temporal} 
                paso1_active={true} paso2_active={true} paso3_active={true} paso4_active={false} paso5_active={false} />
                <form action="" className="contact__form needs-validation" name="formDomicilioSolicitante" id="formDomicilioSolicitante"
                    method="post" noValidate onSubmit={this.props.onSubmitForm} style={{ width: '100%' }}>

                    <div className="row">
                        <div className="col-12 col-sm-12 col-md-12 col-lg-12 form-group text-center" >
                            {this.state.showMapa ? <img id='domicilio[image]' className='img-thumbnail img-thumbnail rounded mx-auto d-block' alt='img-domicilio'
                                src={""} /> :
                                <div className="folded-corner service_tab_1 folded-corner-rounded">
                                    <Link to={'#'} title="Click Aqui Para Ubicar tu Domicilio" onClick={this.handleMapOnClick}>
                                        <div className="text">
                                            <i className="fa fa-map fa-5x fa-icon-image"></i>
                                        </div>
                                    </Link>
                                    <i className="fa fa-arrow-up" aria-hidden="true" style={{display: 'block', fontSize: '3em', color: '#dc3545'}}></i>
                                    <Link to={'#0'} title="Click Aqui" className="item-title" onClick={this.handleMapOnClick}>Click Aqui</Link>
                                </div>
                            }
                            <input type="hidden" name="domicilio[image]" />
                        </div>
                    </div>

                    <div className="row">
                        <input name="domicilio[latitud]" type="hidden" />
                        <input name="domicilio[longitud]" type="hidden" />
                        <input name="domicilio[coordinate]" type="hidden" />
                    </div>

                    <div className="row">
                        <div className="col-sm-12 col-md-12 col-lg-12 form-group">
                            <button className="button-style btn-disabled pull-left " type="button" id={'btn_domicilio_mapa'} onClick={this.handleMapOnClick}>
                                <i className="fa fa-map-marker" aria-hidden="true" ></i> Ubica tú Domicilio en el Mapa</button>

                            <input name="Siguiente" type="submit" className="button-style pull-right" value={this.props.buttonName} />
                        </div>
                    </div>
                </form>

                <ModalDomicilio coordinate={this.state.coordinate} />
            </div>
        );
    }
}

export default FormDomicilio;
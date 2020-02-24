import React, { Component } from 'react';
import { ToastContainer, toast } from 'react-toastify';
import Constant from '../../data/constant';
import Config from '../../data/config';
import Texto from '../../data/es';
import { Link } from 'react-router-dom';
import PasosNavigationPrescripcion from './../utils/PasosNavigationPrescripcion';
import Languaje from '../../data/es';
import ModalDomicilio from '../DeclaracionJurada/ModalDomicilio';

var url_map = ""
var derecho_admision = 0
class FormDireccion extends Component {

    constructor(props, context) {
        super(props, context);
        // this.handleSubmit = this.handleSubmit.bind(this);

        this.handleMapOnClick = this.handleMapOnClick.bind(this);

        this.state = {
            coordinate: "",
            showMapa: false
        };

    }

    componentDidMount() {
        debugger;
        window.create_input_hidden(this.props.fur, 'pres_prescripcion[fur]', "formDireccion");
        //document.getElementById("").value = this.props.fur;
        //console.log(this.props.prescripcion)
        if (Boolean(this.props.prescripcion.zona) && Boolean(this.props.prescripcion.direccion)) {
            document.getElementsByName("domicilio[zona]")[0].value = this.props.prescripcion ? this.props.prescripcion.zona : '';
            document.getElementsByName("domicilio[direccion]")[0].value = this.props.prescripcion ? this.props.prescripcion.direccion : '';
        }
    }

    componentDidUpdate(prevProps, prevState, snapshot) {

        if (this.state.showMapa === true) {
            document.getElementById("domicilio[image]").src = 'data:image/png;base64, ' + url_map;  //img
        }
    }

    handleMapOnClick(event) {

        window.jQuery('#modalMapDomicilio').modal('show');
        if (this.state.showMapa === false)
            this.setState({ showMapa: true });
    }

    render() {

        return (
            <div className="row">
                <PasosNavigationPrescripcion titulo_paso1={"Contribuyente " + this.props.contribuyente} paso1_active={false} paso2_active={true} paso3_active={false} />

                <form action="" className="contact__form needs-validation" name="formDireccion" id="formDireccion"
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
                                    <i className="fa fa-arrow-up" aria-hidden="true" style={{ display: 'block', fontSize: '3em', color: '#dc3545' }}></i>
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
                        <input id="inputFur" name="inputFur" type="hidden" className="form-control" placeholder="Fur" disabled data-parsley-required="true" />
                        <div className="form-group col-12 col-md-3" >
                            <label htmlFor="persona[nombre]">Zona:</label>
                            <input type="text" className="form-control" placeholder="Zona/Barrio" name="domicilio[zona]" required />
                        </div>

                        <div className="form-group col-12 col-md-9" >
                            <label htmlFor="persona[nombre]">Direccion:</label>
                            <input type="text" className="form-control" placeholder="Calle/Avenida " name="domicilio[direccion]" required />
                        </div>
                    </div>
                    <div className="row">
                        <div className="col-12 col-sm-12 col-md-12 col-lg-12 form-group text-center" >
                            <input name="Siguiente" type="submit" className="button-style pull-right" value={'Siguiente'} />
                        </div>
                    </div>
                </form>

                <ModalDomicilio />
            </div>
        );
    }
}

export default FormDireccion;
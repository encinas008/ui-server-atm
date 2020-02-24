import React, { Component } from 'react';
import ModalMiniCatastro from '../../components/DeclaracionJurada/ModalMiniCatastro';
import ModalDomicilio from './ModalDomicilio';
import ModalMapActividadEconomica from '../../components/DeclaracionJurada/ModalMapActividadEconomica';

import DatePicker from 'react-datepicker';

import datepicker from "react-datepicker/dist/react-datepicker.css";
import Config from '../../data/config';

class DataPersona extends Component {

    constructor(props, context) {
        super(props, context);
        //this.handleCloneOnClick = this.handleCloneOnClick.bind(this);
        this.handleMapOnClick = this.handleMapOnClick.bind(this);
        this.handleDateFechaInicioChange = this.handleDateFechaInicioChange.bind(this);

        this.state = {
            showApellidoCasada: false
        };
    }

    componentDidMount() {
        window.jQuery(function () { window.jQuery('input[type=checkbox]').bootstrapToggle() });
    }

    handleMapOnClick(event) {
        if (this.props.nameForm === 'domicilio_actividad_economica')
            window.jQuery('#modalMapCatastro').modal('show');

        if (this.props.nameForm === 'domicilio') {
            window.jQuery('#modalMapDomicilio').modal('show');
        }
    }

    /* para el datepicker */
    handleDateFechaInicioChange(date) {
        this.setState({
            startDate: date
        });
    }

    render() {
        return (
            <>
                <div className="row">
                    <div className="col-sm-9 col-md-9 col-lg-9 caption">
                    <i className="fa fa-cogs" aria-hidden="true"></i> 
                        {this.props.nameForm === "domicilio" ?
                           ' Domicilio de la Persona Natural y/o Representante Legal'
                            : ' Ubicación de la Actividad Económica'
                        }
                    </div>
                    <div className="col-3 col-sm-3 col-md-3 col-lg-3 form-group" style={{ textAlign: 'right' }}>
                        <button className="btn btn-outline-secondary" type="button"
                            style={{ paddingLeft: '15px', paddingRight: '15px', marginLeft: '5px' }} id={'btn_' + this.props.nameForm + '_mapa'}>
                            <i className="fa fa-map-marker" aria-hidden="true" onClick={this.handleMapOnClick}></i></button>
                    </div>
                    <br />
                </div>

                {this.props.nameForm === 'domicilio' ?
                    <div className="row">
                        <div className="col-12 col-sm-12 col-md-12 col-lg-12 form-group" >
                            <img id={this.props.nameForm + '[image]'} className='img-thumbnail' alt='img-domicilio'
                                src={Config[2].url + '/static/img/map_128x128.png'} />
                            <input type="hidden" name={this.props.nameForm + '[image]'} />
                        </div>
                    </div>
                    : ""}

                {this.props.nameForm === "domicilio_actividad_economica" ?
                    <div className="row">
                        <div className="col-6 col-sm-6 col-md-3 col-lg-3 form-group">
                            <label htmlFor={this.props.nameForm + '[avenida]'} style={{ display: 'block' }} >Avenida: </label>
                            <input defaultChecked data-toggle="toggle" data-onstyle="secondary" type="checkbox" name={this.props.nameForm + '[avenida]'} ></input>
                        </div>
                        <div className="col-6 col-sm-6 col-md-3 col-lg-3 form-group">
                            <label htmlFor={this.props.nameForm + '[calle]'} style={{ display: 'block' }}>Calle: </label>
                            <input data-toggle="toggle" data-onstyle="secondary" type="checkbox" name={this.props.nameForm + '[calle]'} ></input>
                        </div>
                        <div className="col-6 col-sm-6 col-md-3 col-lg-3 form-group">
                            <label htmlFor={this.props.nameForm + '[pasaje]'} style={{ display: 'block' }}>Pasaje: </label>
                            <input data-toggle="toggle" data-onstyle="secondary" type="checkbox" name={this.props.nameForm + '[pasaje]'} ></input>
                        </div>
                        <div className="col-6 col-sm-6 col-md-3 col-lg-3 form-group">
                            <label htmlFor={this.props.nameForm + '[plaza]'} style={{ display: 'block' }}>Plaza/Plazuela: </label>
                            <input data-toggle="toggle" data-onstyle="secondary" type="checkbox" name={this.props.nameForm + '[plaza]'} ></input>
                        </div>
                    </div>
                    : ""}

                {this.props.nameForm === "domicilio_actividad_economica" ?
                    <div className="row">
                        <div className="col-sm-12 col-md-7 col-lg-7 form-group">
                            <label htmlFor={this.props.nameForm + '[direccion]'}>Direccion</label>
                            <input name={this.props.nameForm + '[direccion]'} type="text" className="form-control" placeholder="Dirección" required />
                        </div>

                        <div className="col-sm-12 col-md-2 col-lg-2 form-group">
                            <label htmlFor={this.props.nameForm + '[numero]'}>Número</label>
                            <input name={this.props.nameForm + '[numero]'} type="text" className="form-control" placeholder="Número" required />
                        </div>
                        <div className="col-sm-12 col-md-3 col-lg-3 form-group">
                            <label htmlFor={this.props.nameForm + '[zona]'}>Zona</label>
                            <input name={this.props.nameForm + '[zona]'} type="text" className="form-control" placeholder="Zona" required />
                        </div>
                    </div>
                    : ""}

                {this.props.nameForm === "domicilio_actividad_economica" ?
                    <div className="row">
                        <div className="col-sm-12 col-md-3 col-lg-3 form-group">
                            <label htmlFor={this.props.nameForm + '[edificio]'}>Edificio</label>
                            <input name={this.props.nameForm + '[edificio]'} type="text" className="form-control" placeholder="Edificio" required />
                        </div>
                        <div className="col-sm-12 col-md-3 col-lg-3 form-group">
                            <label htmlFor={this.props.nameForm + '[bloque]'}>Bloque</label>
                            <input name={this.props.nameForm + '[bloque]'} type="text" className="form-control" placeholder="Bloque" required />
                        </div>
                        <div className="col-sm-12 col-md-3 col-lg-3 form-group">
                            <label htmlFor={this.props.nameForm + '[piso]'}># Piso</label>
                            <input name={this.props.nameForm + '[piso]'} type="text" className="form-control" placeholder="# de piso" required />
                        </div>
                        <div className="col-sm-12 col-md-3 col-lg-3 form-group">
                            <label htmlFor={this.props.nameForm + '[dpto_of_local]'}>Dpto/Of./Local</label>
                            <input name={this.props.nameForm + '[dpto_of_local]'} className="form-control" placeholder="Departamento/Of./Local" required />
                        </div>
                    </div>
                    : ""}

                {this.props.nameForm === "domicilio_actividad_economica" ?
                    <div className="row">
                        <div className="col-sm-12 col-md-4 col-lg-4 form-group">
                            <label htmlFor={this.props.nameForm + '[telefono]'}>Teléfono</label>
                            <input name={this.props.nameForm + '[telefono]'} type="text" className="form-control" placeholder="Teléfono" required />
                        </div>

                        <div className="col-sm-12 col-md-4 col-lg-4 form-group">
                            <label htmlFor={this.props.nameForm + '[celular]'}>Célular</label>
                            <input name={this.props.nameForm + '[celular]'} type="text" className="form-control" placeholder="Célular" required />
                        </div>
                    </div>
                    : ""}

                {this.props.nameForm === "domicilio_actividad_economica" ?
                    <div className="row">
                        <div className="col-sm-12 col-md-12 col-lg-12 form-group">
                            <h5>Descripción de la Actividad Económica</h5>
                        </div>
                    </div>
                    : ""}


                {this.props.nameForm === "domicilio_actividad_economica" ?
                    <div className="row">
                        <div className="col-12 col-sm-12 col-md-4 col-lg-4 form-group">
                            <label htmlFor={this.props.nameForm + '[superficie]'} style={{ display: 'block' }} >Superficie: </label>
                            <input name={this.props.nameForm + '[superficie]'} type="text" className="form-control" placeholder="Superficie" required />
                        </div>
                        <div className="col-12 col-sm-12 col-md-4 col-lg-4 form-group">
                            <label htmlFor={this.props.nameForm + '[fecha_inicio]'} style={{ display: 'block' }} >Fecha Inicio: </label>
                            {/* 
                            <input name={this.props.nameForm + '[fecha_inicio]'} type="text" 
                            className="form-control" placeholder="Fecha Inicio" required />
                            */}
                            
                            
                            <DatePicker
                                dateFormat={Config[4].format}
                                selected={new Date()}
                                onChange={this.handleDateFechaInicioChange}
                                maxDate={new Date()}
                                className="form-control"
                                name={this.props.nameForm + '[fecha_inicio]'} />
                            
                            
                        </div>
                    </div>
                    : ""}

                {this.props.nameForm === "domicilio_actividad_economica" ?
                    <div className="row">
                        <input name="domicilio_actividad_economica[predio]" type="hidden" />
                        <input name="domicilio_actividad_economica[catastro]" type="hidden" />
                    </div>
                    : ""}

                {this.props.nameForm === 'domicilio' ?
                    <div className="row">
                        <input name="domicilio[latitud]" type="hidden" />
                        <input name="domicilio[longitud]" type="hidden" />
                    </div>
                    : ""}

                {/* <ModalMapaCatastro /> */}
                {this.props.nameForm === "domicilio_actividad_economica" ?
                    <ModalMapActividadEconomica />
                    : ""}

                {this.props.nameForm === "domicilio_actividad_economica" ?
                    <ModalMiniCatastro />
                    : ""}

                {this.props.nameForm === 'domicilio' ?
                    <ModalDomicilio />
                    : ""}
            </>
        );
    }
}

export default DataPersona;
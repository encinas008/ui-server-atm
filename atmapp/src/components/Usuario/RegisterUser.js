import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

import DatePicker, { registerLocale } from 'react-datepicker';
import datepicker from "react-datepicker/dist/react-datepicker.css";
import es from "date-fns/locale/es"; // the locale you want

import AuthService from '../../components/Usuario/AuthService';
import Fetch from '../../components/utils/Fetch';
import Links from '../../data/link';
import Texto from '../../data/es';
import TitlePage from '../../components/utils/TitlePage';
import Config from '../../data/config';

registerLocale("es", es); // register it with the name you want
var message_register = ""
class RegisterUser extends Component {

    constructor(props, context) {
        super(props, context);

        this.Auth = new AuthService();
        this.id_form = "formCreateUser"

        this.fetch = new Fetch();
        this.fetch.setToast(toast)
        this.handleSubmit = this.handleSubmit.bind(this);
        this.handleDatePickerChange = this.handleDatePickerChange.bind(this);
        this.state = {
            showMessageAlert: false,
            startDate: null,
            //startDate: new Date(),
        };
    }

    componentDidMount() {
        window.jQuery('[data-toggle="tooltip"]').tooltip()
        window.jQuery('.data-toggle').tooltip()
    }

    componentDidUpdate() {
        if (this.state.showMessageAlert === true)
            document.getElementById("divAlertRegisterUser").innerHTML = message_register
    }

    componentWillMount() {
        if (this.Auth.loggedIn())
            this.props.history.replace(Links[4].url)
    }

    handleSubmit(event) {
        event.preventDefault();
        window.jQuery("#" + this.id_form).parsley().validate();

        if (window.jQuery("#" + this.id_form).parsley().isValid()) {
            const form = new FormData(event.target);
            var self = this;
            this.fetch.fetchPost(form, 'api/usuario/create').then(dataJson => {
                if (dataJson !== undefined && dataJson.status === true) {
                    message_register = dataJson.message
                    self.setState({
                        showMessageAlert: true
                    })
                    toast.success(dataJson.message, {
                        position: "top-right",
                        autoClose: 5000,
                        hideProgressBar: false,
                        closeOnClick: true,
                        pauseOnHover: true,
                        draggable: true
                    });
                }
            })
        } else {
            toast.warn(Texto.campos_obligatorios, {
                position: "top-right",
                autoClose: 5000,
                hideProgressBar: false,
                closeOnClick: true,
                pauseOnHover: true,
                draggable: true
            });
        }
    }

    handleDatePickerChange(date) {
        this.setState({
            startDate: date
        });
    }

    render() {
        const breadcrumbs = [
            {
                title: Links[0].title,
                url: Links[0].url
            },
            {
                title: Texto.register_account,
                url: '#'
            }
        ];
        return (
            <div id="contact" className="contact paddingTop" >

                {/* Breadcrumb Area Start */}
                <TitlePage titlePage={Texto.register_new_account} breadcrumbs={breadcrumbs} position={'center'} />
                {/* Breadcrumb Area End */}

                {this.state.showMessageAlert ?
                    <div className="row justify-content-md-center justify-content-lg-center">
                        <div className="col-12 col-sm-12 col-md-9 col-lg-7" style={{ paddingLeft: "15px", paddingRight: "15px" }}>
                            <div className="alert alert-success" role="alert" id="divAlertRegisterUser" style={{ fontSize: '1.3rem', marginLeft: '15px', marginRight: '15px'}}>
                                This is a success alert—check it out!
                            </div>
                        </div>
                    </div>
                    : ""}
                {!this.state.showMessageAlert ?
                    <form action="" className="contact__form center-login" name={this.id_form} id={this.id_form}
                        method="post" noValidate onSubmit={this.handleSubmit} >

                        <div className="row justify-content-md-center justify-content-lg-center">
                            <div className="col-12 col-sm-12 col-md-9 col-lg-7 ">
                                <div className="row ">
                                    <div className="col-12 col-sm-12 col-md-4 col-lg-4 form-group">
                                        <label htmlFor="datos[nombre]">Nombre</label>
                                        <input name="datos[nombre]" type="text" className="form-control" placeholder="Nombre"
                                            data-parsley-minlength="3" minLength="3"required data-parsley-required="true" pattern="[a-zA-Z À-ÿ\u00f1\u00d1]+" 
                                            data-parsley-pattern="[a-zA-Z À-ÿ\u00f1\u00d1]+"data-toggle="tooltip" data-placement="left" title="¿Como te llamas?" />
                                    </div>

                                    <div className="col-12 col-sm-12 col-md-4 col-lg-4 form-group">
                                        <label htmlFor="datos[apellido_paterno]">Apellido Paterno</label>
                                        <input name="datos[apellido_paterno]" type="text" className="form-control" placeholder="Apellido Paterno"
                                            data-parsley-minlength="3" minLength="3"required data-parsley-required="true" pattern="[a-zA-Z À-ÿ\u00f1\u00d1]+" 
                                            data-parsley-pattern="[a-zA-Z À-ÿ\u00f1\u00d1]+" data-toggle="tooltip" data-placement="left" title="¿Como se apellida tu papá?" />
                                    </div>

                                    <div className="col-12 col-sm-12 col-md-4 col-lg-4 form-group">
                                        <label htmlFor="datos[apellido_materno]">Apellido Materno</label>
                                        <input name="datos[apellido_materno]" type="text" className="form-control" placeholder="Apellido Materno"
                                           data-parsley-minlength="3" minLength="3"required data-parsley-required="true" pattern="[a-zA-Z À-ÿ\u00f1\u00d1]+" 
                                           data-parsley-pattern="[a-zA-Z À-ÿ\u00f1\u00d1]+" data-toggle="tooltip" data-placement="left" title="¿Como se apellida tu mamá?" />
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div className="row justify-content-md-center justify-content-lg-center">
                            <div className="col-12 col-sm-12 col-md-9 col-lg-7 ">
                                <div className="row ">
                                    <div className="col-12 col-sm-12 col-md-8 col-lg-8 form-group">
                                        <label htmlFor="usuario[username]">Correo Electronico</label>
                                        <input name="usuario[username]" type="email" className="form-control" placeholder="Correo Electronico"
                                            data-parsley-required="true" data-parsley-type="email" data-toggle="tooltip" data-placement="left" title="Usarás esta información cuando entres a tu cuenta y si alguna vez tienes que cambiar la contraseña." />
                                    </div>

                                    <div className="col-12 col-sm-12 col-md-4 col-lg-4 form-group">
                                        <label htmlFor="datos[fecha_nacimiento]">Fecha de Nacimiento</label>
                                        <DatePicker
                                            locale="es"
                                            dateFormat={Config[4].format}
                                            selected={this.state.startDate}
                                            onChange={this.handleDatePickerChange}
                                            maxDate={Config[1].anio}
                                            className="form-control data-toggle"
                                            name="datos[fecha_nacimiento]"
                                            //data-parsley-required="true"
                                            data-toggle="tooltip"
                                            data-placement="left"
                                            title="¿Cuando Naciste?"
                                            showMonthDropdown
                                            showYearDropdown
                                            dropdownMode="select"
                                            required
                                        //placeholderText="¿Cuando Naciste?" 
                                        />
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div className="row justify-content-md-center justify-content-lg-center">
                            <div className="col-12 col-sm-12 col-md-9 col-lg-7 ">
                                <div className="row ">
                                    <div className="col-12 col-sm-12 col-md-4 col-lg-4 form-group">
                                        <label htmlFor="usuario[password]">Contraseña</label>
                                        <input name="usuario[password]" id="usuario_password" type="password" className="form-control" placeholder="Contraseña"
                                            data-parsley-required="true" data-parsley-minlength="6" minLength="6"
                                            data-toggle="tooltip" data-placement="left" title="Ingresa una combinación de al menos seis números, letras y signos de puntuación (como '!' y '&')." />
                                    </div>

                                    <div className="col-12 col-sm-12 col-md-4 col-lg-4 form-group">
                                        <label htmlFor="usuario[confirm_password]">Repita la Contraseña</label>
                                        <input name="usuario[confirm_password]" type="password" className="form-control" placeholder="Repita la Contraseña"
                                            data-parsley-required="true" data-parsley-minlength="6" minLength="6" data-parsley-equalto="#usuario_password"
                                            data-toggle="tooltip" data-placement="left" title="Vuelve a ingresar la misma contraseña." />
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div className="row justify-content-md-center justify-content-lg-center">
                            <div className="col-12 col-sm-12 col-md-9 col-lg-7 ">
                                <input name="submit" type="submit" className="button-style pull-right" value="Enviar" />
                            </div>
                        </div>
                    </form>
                    : ""}


                <ToastContainer enableMultiContainer containerId={'Z'}
                    position="top-right"
                    autoClose={5000}
                    hideProgressBar={false}
                    newestOnTop={false}
                    closeOnClick
                    rtl={false}
                    pauseOnVisibilityChange
                    draggable
                    pauseOnHover
                />
                <ToastContainer />
            </div>
        );
    }
}

export default RegisterUser;
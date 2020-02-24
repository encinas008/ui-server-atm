import React, { Component } from 'react';

import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

import AuthService from '../../components/Usuario/AuthService';
import Fetch from '../../components/utils/Fetch';
import Links from '../../data/link';
import Texto from '../../data/es';
import TitlePage from '../../components/utils/TitlePage';

var message_register = ""
var token_user = ""
var token_change_password = ""
var username = ""
class ChangePassword extends Component {

    constructor(props, context) {
        super(props, context);

        this.Auth = new AuthService();
        this.id_form = "formChangePassword"

        this.fetch = new Fetch()
        this.fetch.setToast(toast)
        this.handleSubmit = this.handleSubmit.bind(this)
        token_user = window.getParameterByName('token')
        token_change_password = window.getParameterByName('tokencp')
        username = window.getParameterByName('username')
        this.state = {
            showMessageAlert: false
        }
    }

    handleSubmit(event){
        event.preventDefault()
        
        window.jQuery("#" + this.id_form).parsley().validate();

        if (window.jQuery("#" + this.id_form).parsley().isValid()) {
            debugger
            const form = new FormData(event.target);
            form.append('usuario[token]', token_user);
            form.append('usuario[username]',username);
            form.append('change_password[token]', token_change_password);

            var self = this;
            this.fetch.fetchPost(form, 'api/change-password/change').then(dataJson => {
                debugger
                if (dataJson !== undefined && dataJson.status === true) {
                    message_register = dataJson.message

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

    render() {
        const breadcrumbs = [
            {
                title: Links[0].title,
                url: Links[0].url
            },
            {
                title: Texto.change_password,
                url: '#'
            }
        ];
        return (
            <div id="contact" className="contact paddingTop" >
                {/* Breadcrumb Area Start */}
                <TitlePage titlePage={Texto.change_password} breadcrumbs={breadcrumbs} position={'center'} />
                {/* Breadcrumb Area End */}

                {this.state.showMessageAlert ?
                    <div className="row justify-content-md-center justify-content-lg-center">
                        <div className="col-12 col-sm-12 col-md-9 col-lg-7" style={{ paddingLeft: "15px", paddingRight: "15px" }}>
                            <div className="alert alert-success" role="alert" id="divAlertForgotPassword" style={{ fontSize: '1.3rem', marginLeft: '15px', marginRight: '15px' }}>
                                This is a success alert—check it out!
                            </div>
                        </div>
                    </div>
                    : ""}

                { !this.state.showMessageAlert ?
                    <form action="" className="contact__form center-login" name={this.id_form} id={this.id_form}
                        method="post" noValidate onSubmit={this.handleSubmit} >

                        <div className="row justify-content-md-center justify-content-lg-center">
                            <div className="col-12 col-sm-12 col-md-4 col-lg-4 ">
                                <label htmlFor="usuario[password]">Nueva Contraseña.</label>
                                <input name="usuario[password]" id="usuario_password" type="password" className="form-control" data-parsley-required="true" data-parsley-minlength="6" minLength="6" 
                                    placeholder="Contraseña" data-parsley-required="true" data-toggle="tooltip" data-placement="left" title="Contraseña" />
                            </div>
                        </div>
                        <div className="row justify-content-md-center justify-content-lg-center">
                            <div className="col-12 col-sm-12 col-md-4 col-lg-4 ">
                                <label htmlFor="usuario[password_repeat]">Vuelva a Ingresar la Contraseña.</label>
                                <input name="usuario[password_repeat]" type="password" className="form-control" 
                                        data-parsley-required="true" data-parsley-minlength="6" minLength="6" data-parsley-equalto="#usuario_password"
                                        data-toggle="tooltip" data-placement="left" placeholder="Vuelve a ingresar la misma contraseña." title="Vuelve a ingresar la misma contraseña."/>
                            </div>
                        </div>
                        <br/>
                        <div className="row justify-content-md-center justify-content-lg-center">
                            <div className="col-12 col-sm-12 col-md-4 col-lg-4 ">
                                <input name="submit" type="submit" className="button-style pull-right" value={Texto.change_password} />
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

export default ChangePassword;
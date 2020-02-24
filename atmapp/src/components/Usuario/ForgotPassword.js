import React, { Component } from 'react';

import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

import AuthService from '../../components/Usuario/AuthService';
import Fetch from '../../components/utils/Fetch';
import Links from '../../data/link';
import Texto from '../../data/es';
import TitlePage from '../../components/utils/TitlePage';

var message_register = ""
class ForgotPassword extends Component {

    constructor(props, context) {
        super(props, context);

        this.Auth = new AuthService();
        this.id_form_search = "formForgotPassword"
        this.id_form_account = "formAccount"
        this.id_form_email = "formSendEmail"

        this.fetch = new Fetch();
        this.fetch.setToast(toast)
        this.handleSearchSubmit = this.handleSearchSubmit.bind(this);
        this.handleSendEmailSubmit = this.handleSendEmailSubmit.bind(this)
        this.handleThisMyAccountClick = this.handleThisMyAccountClick.bind(this)

        this.state = {
            showMessageAlert: false,
            showFormSearchAccount: true,
            showFormSendEmail: false,
            usuario: {}
        };
    }

    handleSearchSubmit(event){
        event.preventDefault()
        
        window.jQuery("#" + this.id_form_search).parsley().validate();

        if (window.jQuery("#" + this.id_form_search).parsley().isValid()) {
            const form = new FormData(event.target);
            var self = this;
            this.fetch.fetchPost(form, 'api/usuario/get-by-username').then(dataJson => {
                debugger
                if (dataJson !== undefined && dataJson.status === true) {
                    message_register = dataJson.message
                    if(Boolean(dataJson.account)){
                        let full_name = dataJson.account.name.substring(0, 3)+ "... "+dataJson.account.apellido_paterno.substring(0, 3)+"..."
                        self.setState({showFormSearchAccount: false, usuario: {thumbail: dataJson.account.thumbail, name: full_name, username: dataJson.usuario.username } })
                    }else{
                        self.setState({showFormSearchAccount: false, usuario: {thumbail: undefined, name: undefined, username: dataJson.usuario.username } })
                    }

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

    handleSendEmailSubmit(event){
        event.preventDefault()

        window.jQuery("#" + this.id_form_email).parsley().validate();

        if (window.jQuery("#" + this.id_form_email).parsley().isValid()) {
            const form = new FormData(event.target);
            form.append('usuario[username]',this.state.usuario.username);
            var self = this;
            this.fetch.fetchPost(form, 'api/change-password/request-token').then(dataJson => {
                debugger
                if (dataJson !== undefined && dataJson.status === true) {
                    message_register = dataJson.message
                    
                    this.setState({showFormSearchAccount: false, showFormSendEmail: false, showMessageAlert: true })
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

    handleThisMyAccountClick(event){
        event.preventDefault()
        this.setState({showFormSearchAccount: false, showFormSendEmail: true })
    }

    componentDidUpdate() {
        if (!this.state.showMessageAlert && this.state.showFormSearchAccount === false && this.state.showFormSendEmail === false){
            document.getElementById("usuarioThumbail").src = this.state.usuario.thumbail === undefined ? 'https://secure.gravatar.com/avatar/950057323d85eb9984bc44374502823d?s=50&d=mm&r=g' : this.state.usuario.thumbail
            document.getElementById("pTitle").innerHTML = this.state.usuario.name === undefined ? this.state.usuario.username : this.state.usuario.name
        }

        if (!this.state.showMessageAlert && this.state.showFormSearchAccount === false && this.state.showFormSendEmail === true){
            document.getElementById("labelEmail").innerHTML = "<strong>"+Texto.enviar_mail+"</strong> "+this.state.usuario.username
            document.getElementById("radioSendMail").checked = true
        }

        if (this.state.showMessageAlert === true)
            document.getElementById("divAlertForgotPassword").innerHTML = message_register
    }

    render() {
        const breadcrumbs = [
            {
                title: Links[0].title,
                url: Links[0].url
            },
            {
                title: Texto.forgot_password,
                url: '#'
            }
        ];
        return (
            <div id="contact" className="contact paddingTop" >
                {/* Breadcrumb Area Start */}
                <TitlePage titlePage={Texto.forgot_password} breadcrumbs={breadcrumbs} position={'center'} />
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

                { !this.state.showMessageAlert && this.state.showFormSearchAccount ?
                    <form action="" className="contact__form center-login" name={this.id_form_search} id={this.id_form_search}
                        method="post" noValidate onSubmit={this.handleSearchSubmit} >

                        <div className="row justify-content-md-center justify-content-lg-center">
                            <div className="col-12 col-sm-12 col-md-9 col-lg-7 ">
                                <label htmlFor="usuario[username]">Por favor ingresa tu Correo Electrónico para buscar tu cuenta.</label>
                                <input name="usuario[username]" type="email" className="form-control" placeholder="Correo Electrónico"
                                    data-parsley-required="true" data-toggle="tooltip" data-placement="left" title="Correo Electrónico" />
                            </div>
                        </div>
                        <br/>
                        <div className="row justify-content-md-center justify-content-lg-center">
                            <div className="col-12 col-sm-12 col-md-9 col-lg-7 ">
                                <input name="submit" type="submit" className="button-style pull-right" value={Texto.search} />
                            </div>
                        </div>
                    </form>
                    : ""}

                { !this.state.showMessageAlert && !this.state.showFormSearchAccount && !this.state.showFormSendEmail? 
                    <form action="" className="contact__form center-login" name={this.id_form_account} id={this.id_form_account}
                        method="post" noValidate  >

                        <div className="row justify-content-md-center justify-content-lg-center">
                            <div className="col-12 col-sm-12 col-md-9 col-lg-7 ">
                                <label htmlFor="usuario[username]">Esta Cuenta coincide con tu búsqueda.</label>
                            </div>
                        </div>

                        <div className="row justify-content-md-center  justify-content-lg-center">
                            <div className="col-12  col-md-7 col-lg-7 button-big" onClick={this.handleThisMyAccountClick}>
                                <div className="left">
                                    <div className="avatar">
                                        <img src="" alt="" id="usuarioThumbail"/>
                                    </div>
                                    <div className="description">
                                        <p id="pTitle"></p>
                                        <p id="pDescription">Usuario ATM.</p>
                                    </div>
                                </div>

                                <div className="right">
                                    <a src="#">Esta Es Mi Cuenta</a>
                                </div>
                            </div>
                        </div>
                    </form>
                    : ""}
                
                { !this.state.showMessageAlert && !this.state.showFormSearchAccount && this.state.showFormSendEmail ? 
                    <form action="" className="contact__form center-login" name={this.id_form_email} id={this.id_form_email}
                        method="post" noValidate onSubmit={this.handleSendEmailSubmit} >

                        <div className="row justify-content-md-center justify-content-lg-center">
                            <div className="col-12 col-sm-12 col-md-9 col-lg-7 ">
                                <label htmlFor="usuario[username]">Resetear Tu Contraseña.</label>
                                <div className="form-check">
                                    <input type="radio" className="form-check-input" id="radioSendMail" name="radioSendMail" />
                                    <label className="form-check-label" htmlFor="radioSendMail" id="labelEmail"></label>
                                </div>
                            </div>
                        </div>

                        <br/>
                        <div className="row justify-content-md-center justify-content-lg-center">
                            <div className="col-12 col-sm-12 col-md-9 col-lg-7 ">
                                <input name="submit" type="submit" className="button-style pull-right" value={Texto.continuar} />
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

export default ForgotPassword;
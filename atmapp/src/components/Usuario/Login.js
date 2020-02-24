import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import TitlePage from '../../components/utils/TitlePage';

import AuthService from '../../components/Usuario/AuthService';

import Links from '../../data/link';
import Texto from '../../data/es';

class Login extends Component {

    constructor(props, context) {
        super(props, context);

        this.Auth = new AuthService();
        this.id_form = "formLoginUser"

        this.handleSubmit = this.handleSubmit.bind(this);
        this.handleInitSessionClick = this.handleInitSessionClick.bind(this)
        this.handleOpenAccountClick = this.handleOpenAccountClick.bind(this)

        this.state = {
            showMessageAlert: false,
            showButtonSession: true
        };
    }

    componentDidMount() {
    }

    handleSubmit(event) {
        event.preventDefault();
        window.jQuery("#" + this.id_form).parsley().validate();

        if (window.jQuery("#" + this.id_form).parsley().isValid()) {
            const form = new FormData(event.target);
            this.Auth.login(form)
                .then(dataJson => {
                    if (dataJson.status === true) {
                        toast.success(dataJson.message + ", " + Texto.espere_redireccionamos_pagina, {
                            position: "top-right",
                            autoClose: 5000,
                            hideProgressBar: false,
                            closeOnClick: true,
                            pauseOnHover: true,
                            draggable: true
                        });

                        setTimeout(() => {
                            window.location.href = '/';
                        }, 3000);
                    } else {
                        toast.warn(dataJson.message, {
                            position: "top-right",
                            autoClose: 5000,
                            hideProgressBar: false,
                            closeOnClick: true,
                            pauseOnHover: true,
                            draggable: true
                        });
                    }
                }).catch(error => {
                    toast.error(error.message, {
                        position: "top-right",
                        autoClose: 5000,
                        hideProgressBar: false,
                        closeOnClick: true,
                        pauseOnHover: true,
                        draggable: true
                    });
                });
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

    componentWillMount() {
        if (this.Auth.loggedIn()) {
            //regresamos a la pagina principal o le redireccionamos
            this.props.history.replace(Links[0].url);
        }
        else {
            this.props.history.replace(Links[4].url)
        }
    }

    handleInitSessionClick(event){
        event.preventDefault()
        this.setState({showButtonSession: false})
    }

    handleOpenAccountClick(event){
        event.preventDefault()
        window.location.href = Links[5].url;
    }

    render() {
        const breadcrumbs = [
            {
                title: Links[0].title,
                url: Links[0].url
            },
            {
                title: Texto.account_user,
                url: '#'
            }
        ];
        return (
            <div id="contact" className="contact paddingTop" >
                {/* Breadcrumb Area Start */}
                <TitlePage titlePage={Texto.account_user} breadcrumbs={ breadcrumbs } position={'center'} />
                {/* Breadcrumb Area End */}

                <form action="" className="contact__form needs-validation center-login" name={this.id_form} id={this.id_form}
                    method="post" noValidate onSubmit={this.handleSubmit} >
                    
                    { this.state.showButtonSession ? 
                        <div className="row justify-content-md-center">
                            <div className="col-12  col-md-4 col-lg-4 button-big" onClick={this.handleInitSessionClick}>
                                <div className="left">
                                    <h3>Inicia Sessión</h3>
                                    <span>Necesitas un usuario y una contraseña.</span>
                                </div>

                                <div className="right">
                                    <i className="fa fa-key" aria-hidden="true"></i>
                                </div>
                            </div>
                        </div> 
                    : "" }

                    { this.state.showButtonSession ?
                        <div className="row justify-content-md-center">
                            <div className="col-12  col-md-4 col-lg-4 button-big" onClick={this.handleOpenAccountClick}>
                                <div className="left">
                                    <h3>Abre una cuenta</h3>
                                    <span>Es rápido y fácil.</span>
                                </div>

                                <div className="right">
                                    <i className="fa fa-user" aria-hidden="true"></i>
                                </div>
                            </div>
                        </div>
                    : "" }

                    {this.state.showMessageAlert ?
                        <div className="row">
                            <div className="col-0 col-sm-0 col-md-2 col-lg-4 form-group">
                            </div>
                            <div className="col-12 col-sm-12 col-md-8 col-lg-4 form-group">
                                <div class="alert alert-success" role="alert">
                                    This is a success alert—check it out!
                                </div>
                            </div>
                            <div className="col-0 col-sm-0 col-md-2 col-lg-4 form-group">
                            </div>
                        </div>
                    : ""}

                    { !this.state.showButtonSession ?
                    <>
                    <div className="row">
                        <div className="col-0 col-sm-0 col-md-2 col-lg-4 form-group">
                        </div>

                        <div className="col-12 col-sm-12 col-md-8 col-lg-4 form-group">
                            <label htmlFor="usuario[username]">Correo Electronico</label>
                            <input name="usuario[username]" type="email" className="form-control" placeholder="Username"
                                data-parsley-required="true" data-parsley-type="email" />

                        </div>

                        <div className="col-0 col-sm-0 col-md-2 col-lg-4 form-group">
                        </div>
                    </div>

                    <div className="row">
                        <div className="col-0 col-sm-0 col-md-2 col-lg-4 ">
                        </div>
                        <div className="col-12 col-sm-12 col-md-8 col-lg-4 form-group">
                            <label htmlFor="usuario[password]">Contraseña</label>
                            <input name="usuario[password]" type="password" className="form-control" placeholder="Contraseña"
                                data-parsley-required="true" data-parsley-minlength="6" minLength="6" />
                        </div>
                        <div className="col-0 col-sm-0 col-md-2 col-lg-4 ">
                        </div>
                    </div>

                    <div className="row">
                        <div className="col-0 col-sm-0 col-md-2 col-lg-4 ">
                        </div>
                        <div className="col-12 col-sm-12 col-md-8 col-lg-4 ">
                            <input name="submit" type="submit" className="button-style pull-right" value="Enviar" />
                        </div>
                        <div className="col-0 col-sm-0 col-md-2 col-lg-4 ">
                        </div>
                    </div>

                    <br/>

                    <div className="row">
                        <div className="col-0 col-sm-0 col-md-2 col-lg-4 ">
                        </div>
                        <div className="col-12 col-sm-12 col-md-8 col-lg-4 form-group">

                            <Link to={{ pathname: Links[5].url }} >{Texto.no_account}</Link>
                        </div>
                        <div className="col-0 col-sm-0 col-md-2 col-lg-4 ">
                        </div>
                    </div>

                    <div className="row">
                        <div className="col-0 col-sm-0 col-md-2 col-lg-4 ">
                        </div>
                        <div className="col-12 col-sm-12 col-md-8 col-lg-4 form-group">
                            <Link to={{ pathname: Links[10].url }} >{Texto.lost_password}</Link>
                        </div>
                        <div className="col-0 col-sm-0 col-md-2 col-lg-4 ">
                        </div>
                    </div>
                    </>
                    : ""}
                </form>

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

export default Login;
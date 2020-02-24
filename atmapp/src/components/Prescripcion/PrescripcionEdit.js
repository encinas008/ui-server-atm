import React, { Component } from 'react';
//import FormDJ from  '../../components/DeclaracionJurada/FormDJ';
import TitlePage from '../../components/utils/TitlePage';

import Links from '../../data/link';
import Fetch from '../../components/utils/Fetch';
import Config from '../../data/config';
import FormContribuyente from '../../components/Prescripcion/FormContribuyente';//mi primer edicion........
import FormDireccion from '../../components/Prescripcion/FormDireccion';
import FormObjTributario from './../Prescripcion/FormObjTributario';
import PrevistaPres from './../Prescripcion/PrevistaPres';

//import FormDomicilio from '../../components/DeclaracionJurada/FormDomicilio';
//import FormDomicilioActEco from '../../components/DeclaracionJurada/FormDomicilioActEco';
//import Constant from '../../data/constant';
//import Select from 'react-select';

import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
//import { optionalCallExpression } from '@babel/types';
import Texto from '../../data/es';


class PrescripcionEdit extends Component {
    constructor(props) {
        super(props);

        this.fetch = new Fetch();
        this.fetch.setToast(toast);
        this.prescripcionDb = null
        this.personaDb = null
        //this.gestionDb = null
        this.gestion = null
        this.contribuyenteDb = {}
        this.direccionDb = {}

        this.token_pres = window.getParameterByName("token")
        this.form_edit = window.getParameterByName("edit")
        this.handleSubmitEditForm = this.handleSubmitEditForm.bind(this);
        this.prescripcion = {}

        this.state = {
            //actividadEconomicaShow: false,
            contribuyenteShow: false,
            // showEditNatural:false,
            direccionShow: false,
            objTributarioShow: false,
            previstaShow: false,
            //selectedOption: null, 
            options: null,
            loading: false,
            //  domicilioActividadShow: false,
            // ciExpedido: "SN"
        };
    }


    componentDidMount() {

        var self = this;
        //var ci = this.personaCi;
        //console.log(this.form_edit);
        //  debugger
        this.loadDataPrescripcion(this.token_pres, this.form_edit);
        this.loadDataDireccion(this.token_pres, this.form_edit);
        this.loadDataObjTributario(this.token_pres, this.form_edit);
        this.loadVistaPrevia(this.token_pres, this.form_edit);

    }

    loadDataPrescripcion(token, form) {
        if (form === 'pre') {
            var self = this;
            //console.log(token);
            // debugger
            // const response = await this.fetch.axiosAsyncGet(`api/prescripcion/edit/${token}`);
            if (!this.state.contribuyenteShow) {
                const response = this.fetch.fetchGet(`api/prescripcion/edit/${token}`);
                response.then(res => {
                    debugger
                    if (res != undefined && res.status === true) {
                        debugger
                        //self.prescripcionDb = res.Persona;
                        self.gestionDb = res.Gestion
                        self.prescripcionDb = res.Persona;
                        self.setState({
                            contribuyenteShow: true,
                            direccionShow: false,
                            objTributarioShow: false,
                            previstaShow: false
                        });
                    }
                })
            }
        }
    }

    async loadDataDireccion(token, form) {
        if (form === 'dir') {
            var self = this;
            console.log('hola')
            debugger
            if (!this.state.contribuyenteShow) {

                const response = await this.fetch.axiosAsyncGet(`api/prescripcion/edit/${token}`);
                if (response !== null && response.status === true) {
                    debugger
                    self.prescripcionDb = response.Persona
                    self.setState({
                        contribuyenteShow: false,
                        direccionShow: true,
                        objTributarioShow: false,
                        previstaShow: false
                    });
                }
            }
        }
    }

    loadDataObjTributario(token, form) {
        if (form === 'obj') {
            var self = this;
            debugger
            const response = this.fetch.fetchGet(`api/prescripcion/edit/${token}`);
            response.then(res => {
                if (res !== undefined && res.status === true) {
                    debugger
                    self.prescripcionDb = res.Persona;
                    self.gestionDb = res.Gestion

                    self.setState({
                        contribuyenteShow: false,
                        direccionShow: false,
                        objTributarioShow: true,
                        previstaShow: false
                    });
                }
            })
        }
    }

    loadVistaPrevia(token, form) {
        if (form === 'preview') {
            var self = this;
            debugger
            const response = this.fetch.fetchGet(`api/prescripcion/edit/${token}`);
            //console.log(response);
            response.then(res => {
                if (res !== undefined && res.status === true) {
                    debugger
                    self.prescripcionDb = res.Persona;
                    self.gestionDb = res.Gestion

                    self.setState({
                        contribuyenteShow: false,
                        direccionShow: false,
                        objTributarioShow: false,
                        previstaShow: true
                    });
                }
            })
        }
    }

    handleSubmitEditForm(event) {
        event.preventDefault();
        //debugger
        window.jQuery("#" + event.target.getAttribute('id')).parsley().validate();
        let form_html = event.target;  //event.target.getAttribute('id');
        const form = new FormData(event.target);
        console.log(form);
        var self = this;
        //console.log(form);

        if (window.jQuery("#" + form_html.getAttribute('id')).parsley().isValid()) {
            // window.createBootbox("Esta Seguro de Continuar.", function (result) {
            // if (result === true) {
            switch (form_html.getAttribute('id')) {

                case "formPrescripcion":  //primer formulario
                    var send_form = false;
                    self.submitFormPrescripcion(form, self)
                    window.redirect(Links[3].url);
                    break;
                case "formDireccion":  //segundo formulario
                    this.submitFormDireccion(form, self)
                     window.redirect(Links[3].url);
                    break;
                case "formObjTributario":  //segundo formulario
                    this.submitFormObjTributario(form, self)
                    window.redirect(Links[3].url);
                    break;
            }
        } else {
            toast.warn('El formulario tiene valores obligatorios', {
                position: "top-right",
                autoClose: 5000,
                hideProgressBar: false,
                closeOnClick: true,
                pauseOnHover: true,
                draggable: true
            });
        }
    }

    submitFormPrescripcion(form, self) {
        form.append('prescripcion[token]', this.token_pres);
        this.fetch.fetchPost(form, 'api/prescripcion/update').then(dataJson => {
            if (dataJson !== undefined && dataJson.status === true) {
                if (Boolean(dataJson.prescripcion)) {
                    toast.success(dataJson.message + "." + Texto.espere_redireccionamos_pagina, {
                        position: "top-right",
                        autoClose: 5000,
                        hideProgressBar: false,
                        closeOnClick: true,
                        pauseOnHover: true,
                        draggable: true

                    });

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
            }
        })
    }

    submitFormDireccion(form, self) {
        debugger
        form.append('prescripcion[token]', this.token_pres);
        this.fetch.fetchPost(form, 'api/domicilioPres/updatePrescripcion').then(dataJson => {
            if (dataJson !== undefined && dataJson.status === true) {
                debugger
                if (Boolean(dataJson.prescripcion)) {
                    toast.success(dataJson.message + ". " + Texto.espere_redireccionamos_pagina, {
                        position: "top-right",
                        autoClose: 5000,
                        hideProgressBar: false,
                        closeOnClick: true,
                        pauseOnHover: true,
                        draggable: true

                    });

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
            }
        })
    }

    submitFormObjTributario(form, self) {
        debugger
        form.append('prescripcion[token]', this.token_pres);
        this.fetch.fetchPost(form, 'api/objectoTributario/updateObjTributario').then(dataJson => {
            if (dataJson !== undefined && dataJson.status === true) {
                debugger
                if (Boolean(dataJson.prescripcion)) {
                    toast.success(dataJson.message + ". " + Texto.espere_redireccionamos_pagina, {
                        position: "top-right",
                        autoClose: 5000,
                        hideProgressBar: false,
                        closeOnClick: true,
                        pauseOnHover: true,
                        draggable: true

                    });

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
            }
        })
    }

    render() {
        // const { loading, data } = this.state

        const breadcrumbs = [
            {
                title: Links[0].title,
                url: Links[0].url
            },
            {
                title: Links[3].title,
                url: Links[3].url
            },
            {
                title: 'Edición',
                url: '#'
            }
        ];
        /*
        return (
            <div className="contact paddingTop" >
                <div className="container form-group ">
                    hola mundo
                </div>
            </div>
        );
    };
   */
        return (
            <div id="contact" className="contact paddingTop" >

                <TitlePage titlePage={Texto.prescripcion } breadcrumbs={breadcrumbs} position={'left'} />

                <div className="container">
                    {this.state.contribuyenteShow === true && !this.state.direccionShow ?
                        <FormContribuyente toast={toast} prescripcion={this.prescripcionDb}
                            gestion={this.gestionDb}
                            onSubmitForm={this.handleSubmitEditForm} /> : ""}

                    {this.state.direccionShow === true && !this.state.contribuyenteShow ?
                        <FormDireccion toast={toast} prescripcion={this.prescripcionDb}
                            onSubmitForm={this.handleSubmitEditForm} />
                        : ""}
                    {this.state.objTributarioShow === true && !this.state.direccionShow ?
                        <FormObjTributario toast={toast} prescripcion={this.prescripcionDb} gestion={this.gestionDb}
                            onSubmitForm={this.handleSubmitEditForm} />
                        : ""}

                    {this.state.previstaShow === true && !this.state.contribuyenteShow && !this.state.direccionShow ?
                        <PrevistaPres toast={toast} prescripcion={this.prescripcionDb}  //domicilioDb={this.domicilioDb}
                            onSubmitForm={this.handleSubmitEditForm} />
                        : ""}
                    {/*
                    { this.state.domicilioActividadShow=== true?
                        <FormDomicilioActEco declaracionJurada={undefined} toast={toast} 
                        domicilioActividadEconomicaDb={this.domicilioActividadEconomicaDb}
                        onSubmitForm={this.handleSubmitEditForm} nameForm={'domicilio_actividad_economica'} 
                        buttonName={'Siguiente'} />
                        : ""}
                    
                    { this.state.vistaPreviaShow === true?
                        <VistaPrevia data={this.declaracionJuradaDb} toast={toast}  nameForm={'vista_previa'} />
                        : ""}
                    */}
                </div>

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
export default PrescripcionEdit
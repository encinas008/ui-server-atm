import React, { Component } from 'react';
import FormDJ from  '../../components/DeclaracionJurada/FormDJ';
import TitlePage from '../../components/utils/TitlePage';

import Links from '../../data/link';
import Fetch from '../../components/utils/Fetch';
import FormSolicitante from  '../../components/DeclaracionJurada/FormSolicitante';
import FormDomicilio from '../../components/DeclaracionJurada/FormDomicilio';
import FormDomicilioActEco from '../../components/DeclaracionJurada/FormDomicilioActEco';
import VistaPrevia from '../../components/DeclaracionJurada/VistaPrevia';

import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

import Texto from '../../data/es';

class DeclaracionJuradaEdit extends Component {
    constructor(props) {
        super(props);

        this.fetch = new Fetch();
        this.fetch.setToast(toast);
        this.declaracionJuradaDb = null
        this.solicitanteDb = {}
        this.domicilioDb = {}
        this.domicilioActividadEconomicaDb = {}
        this.form_edit = window.getParameterByName("edit")
        this.token_dj = window.getParameterByName("token")
        this.call = window.getParameterByName("call") //pagina donde debe regresar
        this.numero_dj = ""

        this.handleSubmitEditForm = this.handleSubmitEditForm.bind(this);
        this.declaracionJurada = {};

        this.state = {
            actividadEconomicaShow: false,
            solicitanteShow: false,
            domicilioShow: false,
            domicilioActividadShow: false,
            vistaPreviaShow: false
        };
    }

    componentDidMount() {
        this.loadDataDeclaracionJurada(this.form_edit, this.token_dj)
        this.loadDataSolicitante(this.form_edit, this.token_dj)
        this.loadDataMapDomicilioSolicitante(this.form_edit, this.token_dj)
        this.loadDataDomicilioActividadSolicitante(this.form_edit, this.token_dj)
        this.loadVistaPrevia(this.form_edit, this.token_dj)
    }

    loadDataDeclaracionJurada(form, token){
        if(form === 'aec'){
            var self = this;
            const response = this.fetch.fetchGet(`api/licencia-actividad-economica/by-token/${token}`);
            response.then(res => {
                if (res !== undefined && res.status === true) {
                    self.declaracionJuradaDb = res.data

                    self.setState({ 
                        actividadEconomicaShow: true, 
                        solicitanteShow: false,
                        domicilioShow: false,
                        domicilioActividadShow: false,
                        vistaPreviaShow: false
                    });
                }
            })
        }
    }

    async loadDataSolicitante(form, token){
        if(form === 'sol' || form === 'pjrl'){
            var self = this
            const response = await this.fetch.axiosAsyncGet(`api/solicitante/token-lic/${token}`);
            if (response !== null && response.status === true) {

                self.solicitanteDb.solicitante = response.Solicitante
                self.solicitanteDb.persona = response.Persona
                self.solicitanteDb.datos_juridicos = response.DatosJuridicos

                self.solicitanteDb.TipoActividadEconomica = response.TipoActividadEconomica

                self.declaracionJurada.contribuyente = response.Solicitante.contribuyente
                self.numero_dj = response.DeclaracionJurada.numero

                self.setState({ 
                    actividadEconomicaShow: false, 
                    solicitanteShow: true,
                    domicilioShow: false,
                    domicilioActividadShow: false,
                    vistaPreviaShow: false
                });
            }
        }
    }

    loadDataMapDomicilioSolicitante(form, token){
        if(form === 'ds'){
            var self = this;
            const response = this.fetch.fetchGet(`api/domicilio/token-lic/${token}`);
            response.then(res => {
                if ( res !== undefined && res.status === true) {
                    self.domicilioDb.domicilio = res.Domicilio
                    self.domicilioDb.persona = res.Persona
                    self.numero_dj = res.DeclaracionJurada.numero
                    self.setState({ 
                        actividadEconomicaShow: false, 
                        solicitanteShow: false,
                        domicilioShow: true,
                        domicilioActividadShow: false,
                        vistaPreviaShow: false
                    });
                }
            })
        }
    }

    loadDataDomicilioActividadSolicitante(form, token){
        if(form === 'dae'){
            var self = this;
            const response = this.fetch.fetchGet(`api/domicilio-actividad-economica/get-by-token-lic/${token}`);
            response.then(res => {

                if ( res !== undefined && res.status === true) {
                    self.domicilioActividadEconomicaDb.declaracion_jurada = res.DeclaracionJurada
                    self.domicilioActividadEconomicaDb.domicilio_actividad_economica = res.DomicilioActividadEconomica
                    self.domicilioActividadEconomicaDb.actividad_economica = res.ActividadEconomica
                    self.numero_dj = res.DeclaracionJurada.numero
                    self.setState({ 
                        actividadEconomicaShow: false, 
                        solicitanteShow: false,
                        domicilioShow: false,
                        domicilioActividadShow: true,
                        vistaPreviaShow: false
                    });
                }
            })
        }
    }

    loadVistaPrevia(form, token){
        if(form === 'preview'){
            var self = this;
            const response = this.fetch.fetchGet(`api/licencia-actividad-economica/by-token/${token}`);
            response.then(res => {
                if (res !== undefined && res.status === true) {
                    self.declaracionJuradaDb = res.data

                    self.setState({ 
                        actividadEconomicaShow: false, 
                        solicitanteShow: false,
                        domicilioShow: false,
                        domicilioActividadShow: false,
                        vistaPreviaShow: true
                    });
                }
            })
        }
    }

    handleSubmitEditForm(event){
        event.preventDefault();
        window.jQuery("#"+event.target.getAttribute('id')).parsley().validate();

        let form_html = event.target;  //event.target.getAttribute('id');
        const form = new FormData(event.target);
        var self = this;

        //show message error
        //numero del documento
        var ul_error_ci = window.jQuery("input[name='persona[numero_documento]']").parent().parent().find('ul');
        window.jQuery("input[name='persona[numero_documento]']").parent().parent().find('ul').remove();
        window.jQuery("input[name='persona[numero_documento]']").parent('div').parent('div').append( ul_error_ci );

        //numero de mnit
        var ul_error_nit = window.jQuery("input[name='datos_juridicos[nit]']").parent().parent().find('ul');
        window.jQuery("input[name='datos_juridicos[nit]']").parent().parent().find('ul').remove();
        window.jQuery("input[name='datos_juridicos[nit]']").parent('div').parent('div').append( ul_error_nit );

        if (window.jQuery("#"+form_html.getAttribute('id')).parsley().isValid() ){

            switch(form_html.getAttribute('id')){
                case "formDJ":  //primer formulario
                    var send_form = false;

                    var tipo_actividad_economica = document.getElementsByName("actividad_economica[id_tipo_actividad]")
                    if (tipo_actividad_economica.length > 0) {
                        if(Boolean(tipo_actividad_economica[0].value) ){
                            send_form = true;
                            document.getElementsByClassName("css-2b097c-container")[0].firstElementChild.classList.add('parsley-success');
                            document.getElementsByClassName("css-2b097c-container")[0].firstElementChild.classList.remove('parsley-error');
                        }else{
                            document.getElementsByClassName("css-2b097c-container")[0].firstElementChild.classList.add('parsley-error');
                            document.getElementsByClassName("css-2b097c-container")[0].firstElementChild.classList.remove('parsley-success');
                        }
                    }else{
                        document.getElementsByClassName("css-2b097c-container")[0].firstElementChild.classList.add('parsley-error');
                        document.getElementsByClassName("css-2b097c-container")[0].firstElementChild.classList.remove('parsley-success');
                    }

                    if ( send_form)
                        this.submitFormDJ(form, self)
                    break;
                case "formSolicitante":  //segundo formulario
                    this.submitFormSolicitante(form, self)
                    break;
                case "formDomicilioSolicitante":  //tercer formulario
                    this.submitFormDomicilio(form, self)
                    break;
                default:
                    this.submitFormDomicilioActEco(form, self)
                    break;
            }
        }else{
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

    submitFormDJ(form, self){
        form.append('declaracion_jurada[token]', this.token_dj);
        this.fetch.fetchPost(form, 'api/declaraciones-juradas/update').then(dataJson =>{
            if(dataJson.status === true){
                if(Boolean(dataJson.DeclaracionJurada)){
                    toast.success(dataJson.message, {
                        position: "top-right",
                        autoClose: 5000,
                        hideProgressBar: false,
                        closeOnClick: true,
                        pauseOnHover: true,
                        draggable: true
                    });
                    window.redirect(Links[1].url);
                }else{
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

    submitFormSolicitante(form, self){
        form.append('declaracion_jurada[token]', this.token_dj)
        this.fetch.fetchPost(form, 'api/persona/update').then(dataJson =>{
            if(dataJson !== undefined && dataJson.status === true){
                if(Boolean(dataJson.Persona)){
                    toast.success(dataJson.message+". "+Texto.espere_redireccionamos_pagina, {
                        position: "top-right",
                        autoClose: 5000,
                        hideProgressBar: false,
                        closeOnClick: true,
                        pauseOnHover: true,
                        draggable: true
                    });

                    if(Boolean(self.call) && self.call === 'pw' && Boolean(self.token_dj) && Boolean(self.numero_dj))
                        window.redirect( Links[6].url + '?edit=preview&token=' + self.token_dj + "&num=" + self.numero_dj);
                    else
                        window.redirect(Links[1].url);
                }else{
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

    submitFormDomicilio(form, self){
        form.append('declaracion_jurada[token]', this.token_dj)
        this.fetch.fetchPost(form, 'api/domicilio/update').then(dataJson =>{
            if(dataJson !== undefined && dataJson.status === true){
                if(Boolean(dataJson.Domicilio)){
                    toast.success(dataJson.message+". "+Texto.espere_redireccionamos_pagina, {
                        position: "top-right",
                        autoClose: 5000,
                        hideProgressBar: false,
                        closeOnClick: true,
                        pauseOnHover: true,
                        draggable: true
                    });

                    if(Boolean(self.call) && self.call === 'pw' && Boolean(self.token_dj) && Boolean(self.numero_dj))
                        window.redirect( Links[6].url + '?edit=preview&token=' + self.token_dj + "&num=" + self.numero_dj);
                    else
                        window.redirect(Links[1].url);
                }else{
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

    submitFormDomicilioActEco(form, self){
        form.append('declaracion_jurada[token]', this.token_dj);
        this.fetch.fetchPost(form, 'api/domicilio-actividad-economica/update').then(dataJson =>{
            if(dataJson !== undefined && dataJson.status === true){

                if(Boolean(dataJson.DomicilioActividadEconomica)){
                    toast.success(dataJson.message+". "+Texto.espere_redireccionamos_pagina, {
                        position: "top-right",
                        autoClose: 5000,
                        hideProgressBar: false,
                        closeOnClick: true,
                        pauseOnHover: true,
                        draggable: true
                    });

                    if(Boolean(self.call) && self.call === 'pw' && Boolean(self.token_dj) && Boolean(self.numero_dj))
                        window.redirect( Links[6].url + '?edit=preview&token=' + self.token_dj + "&num=" + self.numero_dj);
                    else
                        window.redirect(Links[1].url);
                }else{
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
        const breadcrumbs = [
            {
                title: Links[0].title,
                url: Links[0].url
            },
            {
                title: Links[1].title,
                url: Links[1].url
            },
            {
                title: 'Edición',
                url: '#'
            }
        ];
        return (
            <div id="contact" className="contact paddingTop" >

                <TitlePage titlePage={Texto.licencia_actividad_economica} breadcrumbs={ breadcrumbs } position={'left'} />

                <div className="container">
                    {this.state.actividadEconomicaShow === true ?
                        <FormDJ declaracionJurada={null} toast={toast} declaracionJuradaDb={this.declaracionJuradaDb}
                        onSubmitForm={this.handleSubmitEditForm} buttonName={'Siguiente'}/>
                    : ""}

                    {this.state.solicitanteShow === true  ?
                        <FormSolicitante declaracionJurada={this.declaracionJurada} toast={toast}  solicitanteDb={this.solicitanteDb}
                        onSubmitForm={this.handleSubmitEditForm} buttonName={'Siguiente'}/>
                    : ""}

                    {this.state.domicilioShow === true ?
                        <FormDomicilio declaracionJurada={this.declaracionJurada} toast={toast}  domicilioDb={this.domicilioDb}
                        onSubmitForm={this.handleSubmitEditForm} buttonName={'Siguiente'}/>
                    : ""}

                    { this.state.domicilioActividadShow=== true?
                        <FormDomicilioActEco declaracionJurada={undefined} toast={toast} 
                        domicilioActividadEconomicaDb={this.domicilioActividadEconomicaDb}
                        onSubmitForm={this.handleSubmitEditForm} nameForm={'domicilio_actividad_economica'} 
                        buttonName={'Siguiente'} />
                        : ""}
                    
                    { this.state.vistaPreviaShow === true?
                        <VistaPrevia data={this.declaracionJuradaDb} toast={toast}  nameForm={'vista_previa'} />
                        : ""}
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

export default DeclaracionJuradaEdit;
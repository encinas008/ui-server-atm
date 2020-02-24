import React, { Component } from 'react';

import Constant from '../../data/constant';
import DeclaracionJurada from  '../../components/utils/DeclaracionJurada';
import FormDJ from  '../../components/DeclaracionJurada/FormDJ';
import FormSolicitante from  '../../components/DeclaracionJurada/FormSolicitante';
import FormDomicilio from '../../components/DeclaracionJurada/FormDomicilio';
import FormDomicilioActEco from '../../components/DeclaracionJurada/FormDomicilioActEco';
//import FormReport from '../../components/DeclaracionJurada/FormReport';
import VistaPrevia from '../../components/DeclaracionJurada/VistaPrevia';

import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import Fetch from '../../components/utils/Fetch';
import Links from '../../data/link';
import Texto from '../../data/es';

var fetch = null
class Form extends Component {

    constructor(props, context) {
        super(props, context);

        this.constant = Constant[0];
        fetch = new Fetch();
        fetch.setToast(toast);

        this.declaracionJurada = new DeclaracionJurada();
        this.handleSubmitForm = this.handleSubmitForm.bind(this);

        this.state = {
            form_dj: false,
            form_solicitante: false,
            form_domicilio_sol: false,
            form_domicilio_act_eco: false,
            form_report: false
        };
    }

    handleSubmitForm(event){
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

            window.createBootbox( function(result){
                if (result === true) {
                    switch(form_html.getAttribute('id')){
                        case "formDJ":
                            var select = form_html.getElementsByTagName('select');
                            var contribuyente = select[0].options[select[0].selectedIndex].value;
                            var send_form = false;
                            var actividad_economica = document.getElementsByName("actividad_economica[id_tipo_actividad]")
                            if (actividad_economica.length > 0) {
                                if(Boolean(actividad_economica[0].value) ){
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
                            if ( send_form )
                                self.submitFormDJ(form, self, contribuyente)
                            break;
                        case "formSolicitante":  //segundo formulario
                            self.submitFormSolicitante(form, self)
                            break;
                        case "formDomicilioSolicitante":  //tercer formulario
                            self.submitFormDomicilio(form, self)
                            break;
                        case "formDomicilioActEco":  //Cuarto formulario
                            self.submitFormDomicilioActEco(form, self)
                            break;
                        default:    //el reporte
                            /*if (window.jQuery("#"+form_html.getAttribute('id')).parsley().isValid() )
                                this.submitFormReport(form, self)*/
                            break;
                    }
                }
            })
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

    submitFormDJ(form, self, contribuyente){
        fetch.fetchPost(form, 'api/declaraciones-juradas/create').then(dataJson =>{
            if(dataJson !== undefined && dataJson.status === true){
                if(Boolean(dataJson.DeclaracionJurada)){
                    toast.success(dataJson.message, {
                        position: "top-right",
                        autoClose: 5000,
                        hideProgressBar: false,
                        closeOnClick: true,
                        pauseOnHover: true,
                        draggable: true
                    });

                    self.declaracionJurada.setTokenDJ(dataJson.DeclaracionJurada.token);
                    self.declaracionJurada.setFur(dataJson.DeclaracionJurada.fur);
                    self.declaracionJurada.setActividadEconomica(dataJson.DeclaracionJurada.id_actividad_economica);
                    self.declaracionJurada.setContribuyente(contribuyente);

                    var derecho_admicion = window.leerCookie('da');
                    self.declaracionJurada.setDerechoAdmision(parseInt(derecho_admicion));

                    self.setState({
                        form_dj : true,
                        form_solicitante: false,
                        form_domicilio_sol: false,
                        form_domicilio_act_eco: false,
                        form_report: false
                    })
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
        form.append('solicitante[contribuyente]', self.declaracionJurada.contribuyente);
        form.append('declaracion_jurada[token]', self.declaracionJurada.token_dj);

        fetch.fetchPost(form, 'api/persona/create').then(dataJson =>{
            if(dataJson !== undefined && dataJson.status === true){
                if(Boolean(dataJson.Persona)){
                    toast.success(dataJson.message, {
                        position: "top-right",
                        autoClose: 5000,
                        hideProgressBar: false,
                        closeOnClick: true,
                        pauseOnHover: true,
                        draggable: true
                    });
    
                    self.declaracionJurada.setPersona(dataJson.Persona.id);
                    self.setState({
                        form_dj : true,
                        form_solicitante: true,
                        form_domicilio_sol: false,
                        form_domicilio_act_eco: false,
                        form_report: false
                    })
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
        form.append('persona[id]', self.declaracionJurada.persona);

        if(form.get('domicilio[latitud]') !== "" && form.get('domicilio[longitud]') !== ""){
            fetch.fetchPost(form, 'api/domicilio/create').then(dataJson =>{
                if(dataJson !== undefined && dataJson.status === true){
                    if(Boolean(dataJson.Domicilio)){
                        toast.success(dataJson.message, {
                            position: "top-right",
                            autoClose: 5000,
                            hideProgressBar: false,
                            closeOnClick: true,
                            pauseOnHover: true,
                            draggable: true
                        });
    
                        self.setState({
                            form_dj : true,
                            form_solicitante: true,
                            form_domicilio_sol: true,
                            form_domicilio_act_eco: false,
                            form_report: false
                        })
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
        }else{
            toast.warn(Texto.mapa_required, {
                position: "top-right",
                autoClose: 5000,
                hideProgressBar: false,
                closeOnClick: true,
                pauseOnHover: true,
                draggable: true
            });
        }
    }

    submitFormDomicilioActEco(form, self){
        form.append('declaracion_jurada[token]', self.declaracionJurada.token_dj);

        fetch.fetchPost(form, 'api/domicilio-actividad-economica/create').then(dataJson =>{
            if(dataJson !== undefined && dataJson.status === true){
                if(Boolean(dataJson.DomicilioActividadEconomica)){
                    toast.success(dataJson.message, {
                        position: "top-right",
                        autoClose: 5000,
                        hideProgressBar: false,
                        closeOnClick: true,
                        pauseOnHover: true,
                        draggable: true
                    });

                    self.setState({
                        form_dj : true,
                        form_solicitante: true,
                        form_domicilio_sol: true,
                        form_domicilio_act_eco: true,
                        form_report: false
                    })
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

    /*
    submitFormReport(form, self){
        form.append('declaracion_jurada[token]', self.declaracionJurada.token_dj);

        fetch.fetchPost(form, 'api/declaraciones-juradas/complete').then(dataJson =>{
            if(dataJson !== undefined && dataJson.status === true){
                if(Boolean(dataJson.DeclaracionJurada)){
                    toast.success(dataJson.message, {
                        position: "top-right",
                        autoClose: 5000,
                        hideProgressBar: false,
                        closeOnClick: true,
                        pauseOnHover: true,
                        draggable: true
                    });
                    window.location.replace(Links[1].url);  // /declaracion-jurada
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
    }*/

    submitFormReport(form, self){
        form('declaracion_jurada[token]', self.declaracionJurada.token_dj);
        debugger

        fetch.fetchPost(form, 'api/declaraciones-juradas/complete').then(dataJson =>{
            if(dataJson !== undefined && dataJson.status === true){
                if(Boolean(dataJson.DeclaracionJurada)){
                    toast.success(dataJson.message, {
                        position: "top-right",
                        autoClose: 5000,
                        hideProgressBar: false,
                        closeOnClick: true,
                        pauseOnHover: true,
                        draggable: true
                    });
                    window.location.replace(Links[1].url);  // /declaracion-jurada
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
        return (
            <>
                {this.state.form_dj === false ?
                    <FormDJ declaracionJurada={this.declaracionJurada} toast={toast} 
                    onSubmitForm={this.handleSubmitForm} derecho_admision={this.props.derecho_admision} buttonName={'Siguiente'}/>
                : ""}

                {this.state.form_dj === true && this.state.form_solicitante === false ?
                    <FormSolicitante declaracionJurada={this.declaracionJurada} toast={toast} 
                    onSubmitForm={this.handleSubmitForm} buttonName={'Siguiente'}/>
                : ""}

                {/* domicilio del solicitante */}
                {this.state.form_dj === true && this.state.form_solicitante === true 
                && this.state.form_domicilio_sol === false ?
                        <FormDomicilio declaracionJurada={this.declaracionJurada} toast={toast} 
                        onSubmitForm={this.handleSubmitForm} buttonName={'Siguiente'}/>
                        : ""}
                {/* fin domicilio del solicitante */}

                {this.state.form_dj === true && this.state.form_solicitante === true 
                && this.state.form_domicilio_sol === true && this.state.form_domicilio_act_eco === false?
                        <FormDomicilioActEco declaracionJurada={this.declaracionJurada} toast={toast} 
                        onSubmitForm={this.handleSubmitForm} nameForm={'domicilio_actividad_economica'} buttonName={'Siguiente'} />
                        : ""}
                
                {/* <FormReport declaracionJurada={this.declaracionJurada} toast={toast} 
                onSubmitForm={this.handleSubmitForm} nameForm={''} /> */}

                {this.state.form_dj === true && this.state.form_solicitante === true 
                && this.state.form_domicilio_sol === true && this.state.form_domicilio_act_eco === true 
                && this.state.form_report === false ?
                        <VistaPrevia declaracionJurada={this.declaracionJurada} toast={toast} 
                         nameForm={''} />
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
            </>
        );
    }
}

export default Form;
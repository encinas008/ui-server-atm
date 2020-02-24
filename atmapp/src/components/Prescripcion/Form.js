import React, { Component } from 'react';
import Constant from '../../data/constant';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import Fetch from '../../components/utils/Fetch';
import Prescripcion from  '../../components/utils/Prescripcion';
import Texto from '../../data/es';
/*import Links from '../../data/link';
import Texto from '../../data/es';
import Config from '../../data/config';
import Select from 'react-select';
import PasosNavigationPrescripcion from './../utils/PasosNavigationPrescripcion';*/

import FormContribuyente from './../Prescripcion/FormContribuyente';
import FormDireccion from './../Prescripcion/FormDireccion';
import PrevistaPres from './../Prescripcion/PrevistaPres';
import FormObjTributario from './../Prescripcion/FormObjTributario';


var fetch = null
class Form extends Component {

    constructor(props, context) {
        super(props, context);

        this.prescripcion = new Prescripcion();
        this.handleSubmitForm = this.handleSubmitForm.bind(this)
        this.state = {                          
            formContribuyente: true,
            formDireccion: false,
            FormObjTributario: false,
            previstaPres:false
        }

        this.fetch = new Fetch();
        this.fetch.setToast(toast);
    }

    componentDidMount() {      
        var fur_cookie = window.leerCookie('fur'); 

        window.create_input_hidden(this.props.fur, 'pres_prescripcion[fur]', "formPrescripcion");                                                                                                                                                                                                                                                                                                                                 
    }

    handleSubmitForm(event) {
        event.preventDefault();
        window.jQuery("#"+event.target.getAttribute('id')).parsley().validate();
        console.log("hola mundo")
        let form_html = event.target;
        //console.log(form_html);
        var target = event.target;
        const form = new FormData(event.target);
        //form.append('pres_prescripcion[fur]', self.prescripcion.token);
        let self = this;
        debugger
        switch (form_html.getAttribute('id')) {
        
            case "formPrescripcion":
               this.fetch.fetchPost(form, 'api/prescripcion/create/', target).then(dataJson => {
                   debugger
                    if (dataJson !== undefined && dataJson.status === true) {
                        self.setState ({
                            formContribuyente: false,
                            formDireccion: true,
                            FormObjTributario: false,
                            previstaPres:false
                        })
                        debugger;
                        self.prescripcion.setToken(dataJson.prescripcion.token)
                        self.prescripcion.setFur(dataJson.prescripcion.fur)                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                         

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
                break;
            case "formDireccion":
                    self.submitFormDireccion(form, self, target)
                    self.setState ({
                        formContribuyente: false,
                        formDireccion: false,
                        formObjTributario: true,
                        previstaPres:false
                    })
                break;
            case "formObjTributario":
                    self.submitFormObjTributario(form, self, target)
                    self.setState ({
                        formContribuyente: false,
                        formDireccion: false,
                        formObjTributario: false,
                        previstaPres: true
                    })
                break;
                /*
            case "presvistaPres":
                    self.submitPrevistaPres(form, self, target)
                break
                */
        }
    }

    submitFormDireccion(form, self, target)
    {
        debugger;
        // console.log(form);
        //form.append('persona[id]', self.prescripcion.persona);
        form.append('pres_prescripcion[token]', self.prescripcion.token);
        debugger
        if(form.get('domicilio[zona]') !== "" && form.get('domicilio[zona]') !== ""){
           this.fetch.fetchPost(form, 'api/domicilioPres/createDireccion', target).then(dataJson =>{
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
                            formContribuyente: false,
                            formDireccion: false,
                            formObjTributario: true,
                            previstaPres: false
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
    

    submitFormObjTributario(form, self, target)
    {
        debugger;
        // console.log(form);
        //form.append('persona[id]', self.prescripcion.persona);
        form.append('pres_prescripcion[token]', self.prescripcion.token);
        //form.append('pres_prescripcion[token]', self.prescripcion.token);
        
           this.fetch.fetchPost(form, 'api/ObjectoTributario/createObjTributario', target).then(dataJson =>{
                if(dataJson !== undefined && dataJson.status === true){
                    if(Boolean(dataJson.GestionObjTributario)){
                        toast.success(dataJson.message, {
                            position: "top-right",
                            autoClose: 5000,
                            hideProgressBar: false,
                            closeOnClick: true,
                            pauseOnHover: true,
                            draggable: true
                        });
                       
                        self.setState({
                            formContribuyente: false,
                            formDireccion: false,
                            formObjTributario: true,
                            previstaPres: false
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
            /*
        }else{
            toast.warn(Texto.campos_obligatorios, {
                position: "top-right",
                autoClose: 5000,
                hideProgressBar: false,
                closeOnClick: true,
                pauseOnHover: true,
                draggable: true
            });
        }*/
    }
    

    render() {
        return (
            <>
                {this.state.formContribuyente ? <FormContribuyente contribuyente={this.props.contribuyente} toast={toast}
                    onSubmitForm={this.handleSubmitForm}  prescripcion={this.prescripcion}/> : ""}

                {this.state.formDireccion ? <FormDireccion contribuyente={this.props.contribuyente} toast={toast}
                    onSubmitForm={this.handleSubmitForm} prescripcion={this.prescripcion}/> : ""}

                {this.state.formObjTributario ? <FormObjTributario contribuyente={this.props.contribuyente} toast={toast}
                    onSubmitForm={this.handleSubmitForm} prescripcion={this.prescripcion}/> : ""}

                {this.state.previstaPres ? <PrevistaPres contribuyente={this.props.contribuyente} toast={toast} prescripcion={this.prescripcion}/> : ""}
            </>
        );
    }
}

export default Form;
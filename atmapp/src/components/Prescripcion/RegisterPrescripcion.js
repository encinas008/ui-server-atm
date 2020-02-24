import React, { Component } from 'react';
//import Grid from "@material-ui/core/Grid";
//import CustomInput from "components/CustomInput/CustomInput.jsx";
//import ModalSmall from './ModalSmall';
import Constant from '../../data/constant';
import Config from '../../data/config';
import Fetch from '../utils/Fetch';
import Select from 'react-select';

import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import Links from '../../data/link';
import TitlePage from '../../components/utils/TitlePage';
import Texto from '../../data/es';
//import config from '../../data/config';

import ModalFur from '../utils/ModalFur';
import Form from './Form';
//import Form from './FormDireccion';
import FormDireccion from './FormDireccion';


class RegisterPrescripcion extends Component {

    constructor(props, context) {
        super(props, context);

        //this.handleObjetoTriOnChange = this.handleObjetoTriOnChange.bind(this);
        //this.handleTipoDocumentoOnChange = this.handleTipoDocumentoOnChange.bind(this);
        //this.handleSearchByCiOnClick = this.handleSearchByCiOnClick.bind(this);

       // this.handleSearchByVehiculoOnClick = this.handleSearchByVehiculoOnClick.bind(this);

        // this.handleSubmit = this.handleSubmit.bind(this);

        this.state = {
            //showNumeroDeInmueble: false,
            //showNumeroDeVehiculo: false,
            //showPatenteFuncionamiento: false,
            //showPatentePublicidad: false,
            showFormContribuyenteNatural: false,
            showFormContribuyenteJuridico: false,
            showForm: false,
            FormDireccion: false,
            //selectedOption: null,
            //options: null,
            //ver:true,
            dataTributarios: null
            //ciExpedido: 'SN'
        };
        this.fetch = new Fetch();
        this.fetch.setToast(this.toast);
        //  console.log(this.fetch);

        this.contribuyente = "";
        this.fur_cookie = ""
    }

    componentDidMount() {
        window.jQuery('#modalFurFull').modal('show');
        var self = this;
        window.jQuery('#modalFurFull').on('hidden.bs.modal', function () {
            
            console.log('no funciona')
            self.fur_cookie = window.leerCookie('fur');
            var contribuyente_cookie = window.leerCookie('contribuyente');

            //window.create_input_hidden(fur_cookie, 'pres_prescripcion[fur]', "prescripcion");
            //document.getElementById("inputFur").value = fur_cookie;

            if (contribuyente_cookie == 'NATURAL') {
                self.setState({ showFormContribuyenteNatural: true }); 
                self.setState({ showFormContribuyenteJuridico: false }); 
            }
            if (contribuyente_cookie == 'JURIDICO') {
                self.setState({ showFormContribuyenteJuridico: true });
                self.setState({ showFormContribuyenteNatural: false });
            }
            self.contribuyente = contribuyente_cookie;
            self.setState({ showForm: true });
        });
    }
/*
    handleSearchByVehiculoOnClick(event) {

    }
    */
/*
    handleSearchByCiOnClick(event) {

        event.preventDefault();
        var ci = "";
        let input_search = "";
        //var self = this;
        if (event.target.tagName === 'I') {
            ci = event.target.parentElement.parentElement.parentElement.firstElementChild.value;
            input_search = event.target.parentElement.parentElement.parentElement.firstElementChild.getAttribute('name');

        } else
            ci = event.target.parentElement.parentElement.firstElementChild.value;
        input_search = event.target.parentElement.parentElement.parentElement.firstElementChild.getAttribute('name');

        if (ci !== '') {
            fetch(Config[0].url + 'api/Recaudaciones/getPersonaByCi/' + ci)
                .then((response) => {
                    if (response.status !== 204)
                        return response.json()
                    else
                        toast.error('Servidor no responde error codigo 204, contenido no existe', {
                            position: "top-right",
                            autoClose: 5000,
                            hideProgressBar: false,
                            closeOnClick: true,
                            pauseOnHover: true,
                            draggable: true
                        });
                })
                .then((dataJson) => {
                    // console.log(dataJson);
                    if (dataJson.status === true && dataJson.persona_natural !== null) {  //is ok
                        //window.jQuery('#modalSmallFull').modal('hide');
                        //window.jQuery('#modalSmallFull').modal('hide');
                        //cargar el formulario con los datos de la persona natural
                         
                        document.getElementsByName("persona[apellido_paterno]")[0].value = dataJson.persona_natural.ap_paterno;
                        document.getElementsByName("persona[apellido_materno]")[0].value = dataJson.persona_natural.ap_materno;
                        //document.getElementsByName("persona[ap_paterno]")[0].value = dataJson.persona_natural.ap_paterno;
                        document.getElementsByName("domicilio[telefono]")[0].value = dataJson.persona_natural.telefono;
                        document.getElementsByName("domicilio[direccion]")[0].value = dataJson.persona_natural.direccion;
                        document.getElementsByName("domicilio[zona]")[0].value = dataJson.persona_natural.zona;
                        //document.getElementsByName("pres_objecto_tributario[gestion]")[0].value=

                        toast.success(dataJson.message, {
                            position: "top-right",
                            autoClose: 5000,
                            hideProgressBar: false,
                            closeOnClick: true,
                            pauseOnHover: true,
                            draggable: true
                        });
                    } else {
                        toast.warn(dataJson.message + "!", {
                            position: "top-right",
                            autoClose: 5000,
                            hideProgressBar: false,
                            closeOnClick: true,
                            pauseOnHover: true,
                            draggable: true
                        });
                    }
                }).catch(error => {
                    console.error(error);
                });

        }
    }
    */

    //mostrar la lista de lo prescriptos 
    obtenerPrescripciones() {
        fetch(Config[0].url + 'api/Prescripcion/getDataContribuyente')
            .then((result) => {
                return result.json(); //Promise
            })
            .then((aux) => {
                const data = aux.data;
                console.log('prescripciones', data);
            })
            .catch(error => {
                console.log(error);
            })
    }
/*
    handleSearchByNitOnClick(event) {

        event.preventDefault();
        var nit = "";
        var self = this;
        if (event.target.tagName === 'I') {
            nit = event.target.parentElement.parentElement.parentElement.firstElementChild.value;
        } else
            nit = event.target.parentElement.parentElement.firstElementChild.value;
        if (nit !== '') {
            //  console.log('paso esto el nit:', nit);
            fetch(Config[0].url + 'api/Recaudaciones/getPersonaByNit/' + nit)
                .then((response) => {
                    if (response.status !== 204)
                        return response.json()
                    else
                        toast.error('Servidor no responde error codigo 204, contenido no existe', {
                            position: "top-right",
                            autoClose: 5000,
                            hideProgressBar: false,
                            closeOnClick: true,
                            pauseOnHover: true,
                            draggable: true
                        });
                })
                .then((dataJson) => {
                    // console.log(dataJson);
                    if (dataJson.status === true && dataJson.persona_juridica !== null) {  //is ok
                        //window.jQuery('#modalSmallFull').modal('hide');
                        //window.jQuery('#modalSmallFull').modal('hide');
                        //cargar el formulario con los datos de la persona juridica
                        document.getElementsByName("pres_representante_legal[razon_social]")[0].value = dataJson.persona_juridica.razon_social;
                        document.getElementsByName("domicilio[telefono]")[0].value = dataJson.representante_legal.telefono;
                        document.getElementsByName("domicilio[celular]")[0].value = dataJson.representante_legal.celular;
                        document.getElementsByName("domicilio[zona]")[0].value = dataJson.persona_juridica.zona;
                        document.getElementsByName("domicilio[direccion]")[0].value = dataJson.persona_juridica.direccion;
                        document.getElementsByName("persona[nombre]")[0].value = dataJson.representante_legal.nombres;
                        document.getElementsByName("persona[apellido_paterno]")[0].value = dataJson.representante_legal.ap_paterno;
                        document.getElementsByName("persona[apellido_materno]")[0].value = dataJson.representante_legal.ap_materno;
                        document.getElementsByName("persona[numero_documento]")[0].value = dataJson.representante_legal.ci;
                        //document.getElementsByName("domicilio[direccion]")[0].value = dataJson.persona_juridica.direccion;
                        toast.success(dataJson.message, {
                            position: "top-right",
                            autoClose: 5000,
                            hideProgressBar: false,
                            closeOnClick: true,
                            pauseOnHover: true,
                            draggable: true
                        });
                    } else {
                        toast.warn(dataJson.message + "!", {
                            position: "top-right",
                            autoClose: 5000,
                            hideProgressBar: false,
                            closeOnClick: true,
                            pauseOnHover: true,
                            draggable: true
                        });
                    }
                }).catch(error => {
                    console.error(error);
                });
        }
        // console.log(document.getElementsById('gestion').value);
    }
*/
    gestionesPrescribir() {
        var y = new Date();
        y.setFullYear(y.getFullYear() - 6);
        var res = y.getFullYear();
        var gestionesDisponibles = [];
        console.log('eso ', res);
        for (var i = 1; i <= 10; i++) {
            var aux = res - i;
            const gestion = { value: aux, label: aux };
            console.log(gestion);
            gestionesDisponibles.push(gestion);

        }
        return gestionesDisponibles;
    }

    handleChange = selectedOption => {
        this.setState({ selectedOption });
        console.log(`Option selected:`, selectedOption);
    };
   
    render() {
        const breadcrumbs = [
            {
                title: Links[0].title,
                url: Links[0].url
            },
            {
                title: Links[11].title,
                url: Links[11].url
            },
            {
                title: 'Nuevo',
                url: '#'
            }
        ];

        return (

            <div className="contact paddingTop" >

                {/* Breadcrumb Area Start */}
                <TitlePage titlePage={Texto.prescripcion} breadcrumbs={breadcrumbs} position={'left'} />
                {/* Breadcrumb Area End */}
                <div className="container">
                    {this.state.showForm ? <Form toast={toast} contribuyente={this.contribuyente} fur={ this.fur_cookie } /> : <p>Esperando confirmación de Fur...</p>}
                    
                  
                </div>
                
                <ModalFur toast={toast} pagina={'PRESCRIPCION'} />
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

export default RegisterPrescripcion;


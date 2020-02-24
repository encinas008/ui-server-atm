import React, { Component } from 'react';
import ModalFur from './ModalFur';
import Form from './Form';

import Links from '../../data/link';
import TitlePage from '../../components/utils/TitlePage';
import Texto from '../../data/es';

import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

class DeclaracionJuradaCreate extends Component {
    constructor(props) {
        super(props);

        this.derecho_admicion = "";

        this.state = {
            showForm: false
        };
    }

    componentDidMount() {
        window.jQuery('#modalFurFull').modal('show');
        var self = this;
        window.jQuery('#modalFurFull').on('hidden.bs.modal', function () {
            var fur_cookie = window.leerCookie('fur'); 
            var derecho_admicion = window.leerCookie('da');
            self.derecho_admicion = derecho_admicion;
            //self.derecho_admicion = 1;

            self.setState({ showForm: true });
            setTimeout(function(){ window.jQuery('[data-toggle="tooltip"]').tooltip(); }, 3000);
            window.create_input_hidden(fur_cookie, 'declaracion_jurada[fur]', "formDJ");
            document.getElementById("inputFur").value = fur_cookie;
            
            //window.create_input_hidden(104019, 'declaracion_jurada[fur]', "formDJ");
            //document.getElementById("inputFur").value = 104019;
        });
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
                title: 'Nuevo',
                url: '#'
            }
        ];
        return (
            <div id="contact" className="contact paddingTop" >

                {/* Breadcrumb Area Start */}
                <TitlePage titlePage={Texto.licencia_actividad_economica} breadcrumbs={ breadcrumbs } position={'left'} />
                {/* Breadcrumb Area End */}

                <div className="container">
                    {this.state.showForm ? <Form  toast={toast} derecho_admision={this.derecho_admicion} /> : <p>Esperando confirmación de Fur...</p>}
                </div>

                <ModalFur toast={toast} />

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

export default DeclaracionJuradaCreate;
import React, { Component } from 'react';

import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import Fetch from '../../components/utils/Fetch';
import Texto from '../../data/es';
import Config from '../../data/config';

var fetch = null
class Contact extends Component {

    constructor(props, context) {
        super(props, context);

        this.onSubmitForm = this.onSubmitForm.bind(this);

        this.id_modal = "modalFormContacts"

        fetch = new Fetch();
        fetch.setToast(toast);
    }

    onSubmitForm(event) {
        event.preventDefault();
        window.jQuery("#" + event.target.getAttribute('id')).parsley().validate();
        const form = new FormData(event.target);

        if (window.jQuery("#" + event.target.getAttribute('id')).parsley().isValid()) {

            fetch.fetchPost(form, 'api/contact/create').then(dataJson => {
                if (dataJson !== undefined && dataJson.status === true) {
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

    render() {
        return (
            <div className="modal fade " id={this.id_modal} tabIndex="-1" role="dialog" aria-labelledby="exampleModalCenterTitle" aria-hidden="true" data-backdrop="static" data-keyboard="false">
                <div className="modal-dialog modal-lg" >
                    <div className="modal-content">
                        <div className="modal-header">
                            <h5 className="modal-title" >Mantengamonos en contacto</h5>
                            <button type="button" className="close" data-dismiss="modal" aria-label="Close" onClick={this.handleCloseOnClick}>
                                <span aria-hidden="true">&times;</span>
                            </button>
                        </div>
                        <div className="modal-body">
                            <div className="row">
                                <div className="col-sm-6 col-md-5 offset-md-2 col-lg-6 offset-lg-0">
                                    <p>{Texto.description_contactanos}</p>

                                    <div className="row margin-15px-bottom">
                                        <div className="col-sm-1 no-padding">
                                            <div className="contact-icon text-blue">
                                                <i className="fa fa-map-marker" aria-hidden="true"></i>
                                            </div>
                                        </div>
                                        <div className="col-sm-11">
                                            <p className="text-small">Plaza Colon, acera este, Calle San Martin. <br />Nro. 448, Cochabamba</p>
                                        </div>
                                    </div>

                                    <div className="row margin-15px-bottom">
                                        <div className="col-sm-1 no-padding">
                                            <div className="contact-icon text-blue">
                                                <i className="fa fa-phone" aria-hidden="true"></i>
                                            </div>
                                        </div>
                                        <div className="col-sm-11">
                                            <p className="text-small">4 4258030</p>
                                        </div>
                                    </div>

                                    <div className="row margin-15px-bottom">
                                        <div className="col-sm-1 no-padding">
                                            <div className="contact-icon text-blue">
                                                <i className="fa fa-globe" aria-hidden="true"></i>
                                            </div>
                                        </div>
                                        <div className="col-sm-11 xs-margin-50px-bottom">
                                            <p className="text-small">{}<br />{Config[2].url}</p>
                                        </div>
                                    </div>
                                </div>

                                <div className="col-sm-6 col-md-5 offset-md-2 col-lg-6 offset-lg-0">

                                    <form action="" className="contact__form needs-validation" name="formContact" id="formContact"
                                        method="post" noValidate onSubmit={this.onSubmitForm} style={{ width: '100%' }}>
                                        <div className="row">
                                            <div className="col-md-12 form-group">
                                                <input name="contact[name]" type="text" className="form-control" placeholder="Nombre" required />
                                            </div>
                                        </div>

                                        <div className="row">
                                            <div className="col-md-12 form-group">
                                                <input name="contact[email]" type="email" className="form-control" placeholder="Email" required />
                                            </div>
                                        </div>

                                        <div className="row">
                                            <div className="col-12 form-group">
                                                <textarea name="contact[comment]" className="form-control" rows="5" placeholder="Comentario" required ></textarea>
                                            </div>
                                        </div>

                                        <div className="row">
                                            <div className="col-12">
                                                <input name="submit" type="submit" className="button-style pull-right" value="Enviar" />
                                            </div>
                                        </div>
                                    </form>

                                    <div className="row">
                                        <div className="col-12">
                                            <div className="alert alert-success contact__msg" style={{ display: "none", role: "alert" }}>
                                                Your message was sent successfully.
                                </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
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

export default Contact;

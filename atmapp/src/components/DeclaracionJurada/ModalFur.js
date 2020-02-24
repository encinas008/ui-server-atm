    
import React, { Component } from 'react';

import Config from '../../data/config';
import Constant from '../../data/constant';
import Links from '../../data/link';
import Fetch from '../../components/utils/Fetch';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

var _fetch = null
class ModalFur extends Component {

    constructor(props, context) {
        super(props, context);

        this.handleFurClick = this.handleFurClick.bind(this);
        this.handleFurOnChange = this.handleFurOnChange.bind(this);
        this.handleVoidEnter = this.handleVoidEnter.bind(this);
        this.handleCancelClick = this.handleCancelClick.bind(this);

        this.state = {
            show: false,
            verifyFur: false
        };

        _fetch = new Fetch();
        _fetch.setToast(toast);
    }

    componentDidMount() {
    }

    handleFurClick(event) {
        event.preventDefault();
        window.jQuery("#formModalFur").parsley().validate();

        var li_error = window.jQuery("#inputModalFur").siblings('ul');
        window.jQuery("#inputModalFur").siblings('ul').remove();
        window.jQuery("#inputModalFur").parent('div').parent('div').append( li_error );

        if (this.state.verifyFur) {
            _fetch.fetchGet( 'api/Cobros/getFur/' + this.state.inputFur).then(fur =>{
                if (fur !== undefined && fur.status === true && fur.Fur !== null) {  //is ok
                    window.jQuery('#modalFurFull').modal('hide');
                    var input_fur = document.getElementById("inputModalFur");
                    //modificar con moment
                    var current_date = new Date();
                    current_date.setHours(current_date.getHours()+1);
                    var today = new Date(current_date).toUTCString();
                    document.cookie = "fur="+input_fur.value+"; expires="+today.toString();
                    //console.log(Constant[0].derecho_admision.permanente);
                    let derecho_admicion = fur.derecho_admision === 'TEMPORAL' ? Constant[0].derecho_admision.temporal : Constant[0].derecho_admision.permanente
                    document.cookie = "da="+derecho_admicion+"; expires="+today.toString();
                    //modificar con moment
                    this.props.toast.success(fur.message, {
                        position: "top-right",
                        autoClose: 5000,
                        hideProgressBar: false,
                        closeOnClick: true,
                        pauseOnHover: true,
                        draggable: true
                    });
                }
            })
        }
    }

    handleCancelClick(event){
        window.location.href = Links[1].url;
    }

    handleVoidEnter(e){
        e.preventDefault();
    }

    handleFurOnChange(event) {

        event.preventDefault();
        var button = document.getElementById("btnModalSmallSubmit");

        if (event.currentTarget.value.length >= 3) {
            button.classList.remove("btn-disabled");
            this.setState({ verifyFur: true, inputFur: event.currentTarget.value });
        }else {
            button.classList.add("btn-disabled");
            this.setState({ verifyFur: false, inputFur: '' });
        }
    }

    render() {
        return (
            <div className="modal fade bd-example-modal-md" id="modalFurFull" tabIndex="-1" role="dialog"
                aria-labelledby="exampleModalCenterTitle" aria-hidden="true" data-backdrop="static" data-keyboard="false">
                <div className="modal-dialog modal-md" >
                    <div className="modal-content">
                        <div className="modal-header">
                            <h5 className="modal-title" id="exampleModalLongTitle">Verificación Del FUR</h5>
                        </div>
                        <div className="modal-body">
                            <form className="contact__form" style={{ margin: "0.5rem" }} onSubmit={this.handleVoidEnter}
                             id="formModalFur" >
                                 <div className="row">
                                    <div className="col-12 padding-right-0 padding-left-right-0">
                                        3 Intentos por Hora, Máximo 6 Intentos  
                                    </div>
                                 </div>
                                <div className="row">
                                    <div className="col-md-12 col-md-6 col-lg-6 col-xl-6 padding-right-0 padding-left-right-0">
                                        <div className="form-group">
                                            <div className="input-group mb-3">
                                                <div className="input-group-prepend">
                                                    <span className="input-group-text" id="basic-addon1">Nº</span>
                                                </div>
                                                <input type="text" className="form-control" placeholder="FUR" aria-label="Fur" id="inputModalFur"
                                                    aria-describedby="basic-addon1" onChange={this.handleFurOnChange} data-parsley-required="true" />
                                            </div>
                                        </div>
                                    </div>

                                    <div className="col-md-12 col-md-6 col-lg-6 col-xl-6 padding-left-right-0">
                                        <input name="submit" type="button" className="button-style btn-disabled pull-left" id="btnModalSmallSubmit"
                                            value="Verificar" style={{ marginLeft: '0px' }} onClick={this.handleFurClick} />

                                        <input type="submit" className="button-style pull-right" value="Cancelar" onClick={this.handleCancelClick} style={{paddingLeft: '0.35rem', paddingRight: '0.35rem'}} />
                                    </div>
                                </div>

                                <div className="row">
                                    <div className="col-12 padding-right-0">
                                        <p><strong>FUR: </strong>"Derecho de Admisión para Tramite de Licencia de Funcionamiento"</p>
                                    </div>
                                </div>
                            </form>
                        </div>
                    </div>
                </div>
            </div>
        );
    }
}

export default ModalFur;
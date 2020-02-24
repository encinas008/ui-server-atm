import React, { Component } from 'react';

import Config from '../../data/config';

class ModalSmall extends Component {

    constructor(props, context) {
        super(props, context);

        this.handleFurClick = this.handleFurClick.bind(this);
        this.handleFurOnChange = this.handleFurOnChange.bind(this);
        this.handleVoidEnter = this.handleVoidEnter.bind(this);

        this.state = {
            show: false,
            verifyFur: false
        };
    }

    handleFurClick(event) {

        event.preventDefault();
        if (this.state.verifyFur) {

            fetch(Config[0].url + 'api/Cobros/getFurPrescripcion/' + this.state.inputFur)
                .then((response) => {
                    if (response.status !== 204)
                        return response.json()
                    else
                        this.props.toast.error('Server response with code 204, not exist content', {
                            position: "top-right",
                            autoClose: 5000,
                            hideProgressBar: false,
                            closeOnClick: true,
                            pauseOnHover: true,
                            draggable: true
                        });
                })
                .then((fur) => {
                    if (fur.status === true && fur.Fur !== null) {  //is ok
                        window.jQuery('#modalSmallFull').modal('hide');
                        var input_fur = document.getElementById("inputModalFur");
                        //modificar con moment
                        var current_date = new Date();
                        current_date.setHours(current_date.getHours()+1);
                        var today = new Date(current_date).toUTCString();
                        document.cookie = "fur="+input_fur.value+"; expires="+today.toString();
                        document.cookie = "natural="+fur.natural+"; expires="+today.toString();
                        //modificar con moment
                        this.props.toast.success(fur.message, {
                            position: "top-right",
                            autoClose: 5000,
                            hideProgressBar: false,
                            closeOnClick: true,
                            pauseOnHover: true,
                            draggable: true
                        });
                    } else {
                        this.props.toast.warn(fur.message + "!", {
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

    handleVoidEnter(e){
        e.preventDefault();
    }

    handleFurOnChange(event) {

        event.preventDefault();
        var button = document.getElementById("btnModalSmallSubmit");

        if (event.currentTarget.value.length >= 3) {
            button.classList.remove("btn-disabled");
            this.setState({ verifyFur: true, inputFur: event.currentTarget.value });
        }
        else {
            button.classList.add("btn-disabled");
            this.setState({ verifyFur: false, inputFur: '' });
        }
    }

    render() {
        return (

            <div className="modal fade bd-example-modal-md" id="modalSmallFull" tabIndex="-1" role="dialog"
                aria-labelledby="exampleModalCenterTitle" aria-hidden="true" data-backdrop="static" data-keyboard="false">
                <div className="modal-dialog modal-md" >
                    <div className="modal-content">
                        <div className="modal-header">
                            <h5 className="modal-title" id="exampleModalLongTitle">Verificación De # FUR</h5>
                        </div>
                        <div className="modal-body">
                            {/* onSubmit={this.handleVoidEnter} */}
                            <form className="contact__form"   style={{ margin: "0.5rem" }} onSubmit={this.handleVoidEnter}  >
                                <div className="row">
                                    <div className="col-md-12 col-md-8 col-lg-8 col-xl-8">
                                        <div className="form-group">
                                            <div className="input-group mb-3">
                                                <div className="input-group-prepend">
                                                    <span className="input-group-text" id="basic-addon1">#</span>
                                                </div>
                                                <input type="text" className="form-control" placeholder="Fur" aria-label="Fur" id="inputModalFur"
                                                    aria-describedby="basic-addon1" onChange={this.handleFurOnChange} />
                                            </div>
                                        </div>
                                    </div>

                                    <div className="col-md-12 col-md-4 col-lg-4 col-xl-4">
                                        <input name="submit" type="button" className="button-style btn-disabled pull-right" id="btnModalSmallSubmit"
                                            value="Verificar" style={{ marginLeft: '0px' }} onClick={this.handleFurClick} />
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

export default ModalSmall;
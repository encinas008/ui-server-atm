import React, { Component } from 'react';

import Config from '../../data/config';

class ModalDetail extends Component {

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
            fetch(Config[0].url + 'api/Cobros/getFurN/' + this.state.inputFur)
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

            <div className='modal' id='modalDetail'>
                        <div class="modal-dialog" role="document">
                            <div class="modal-content">
                                <div class="modal-header">
                                    <h5 class="modal-title">Modal title</h5>
                                    <button type="button" class="close" data-dismiss="modal" aria-label="Close">
                                        <span aria-hidden="true">&times;</span>
                                    </button>
                                </div>
                                <div class="modal-body">
                                    <p>Modal body text goes here.</p>
                                </div>
                                <div class="modal-footer">
                                    <button type="button" class="btn btn-secondary" data-dismiss="modal">Close</button>
                                    <button type="button" class="btn btn-primary">Save changes</button>
                                </div>
                            </div>
                        </div>
                    </div>
        );
    }
}

export default ModalDetail;
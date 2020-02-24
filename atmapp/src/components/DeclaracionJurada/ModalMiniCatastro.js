import React, { Component } from 'react';

import Config from '../../data/config';

class ModalMiniCatastro extends Component {

    constructor(props, context) {
        super(props, context);

        this.state = {
            show: false,
            verifyFur: false
        };
    }

    render() {
        return (
            <div className="modal fade bd-example-modal-sm" id="modalMiniCatastro" tabIndex="-1" role="dialog"
                aria-labelledby="exampleModalCenterTitle" aria-hidden="true" data-backdrop="static" data-keyboard="false" style={{ marginTop: '80px' }}>
                <div className="modal-dialog modal-sm" >
                    <div className="modal-content">
                        <div className="modal-header">
                            <h5 className="modal-title" id="exampleModalLongTitle">Datos Actividad</h5>
                            <button type="button" className="close" data-dismiss="modal" aria-label="Close">
                                <span aria-hidden="true">&times;</span>
                            </button>
                        </div>
                        <div className="modal-body">
                            <div className="row">
                                <div className="col-12 col-sm-12 col-md-12 col-lg-12 form-group">
                                    <strong >Catastro: </strong>
                                    <p id="pCatastro" style={{ display: 'inline'}}></p>
                                </div>
                            </div>

                            <div className="row">
                                <div className="col-12 col-sm-12 col-md-12 col-lg-12 form-group">
                                    <strong >Predio: </strong>
                                    <p id="pPredio" style={{ display: 'inline'}}></p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        );
    }
}

export default ModalMiniCatastro;
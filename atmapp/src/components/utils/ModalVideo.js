import React, { Component } from 'react';
import PropTypes from 'prop-types';

class ModalVideo extends Component {

    constructor(props, context) {
        super(props, context);
        this.handleRedirectUrlClick = this.handleRedirectUrlClick.bind(this);
    }

    static propTypes = {
        links: PropTypes.array.isRequired
    }

    handleRedirectUrlClick(ev, url) {
        window.location.href = url;
    }

    render() {
        const {links} = this.props;

        return (

            <div className="modal fade" id="modalVideoFull" tabIndex="-1" role="dialog" aria-labelledby="movalVidelFullLabel" aria-hidden="true" data-backdrop="static" data-keyboard="false">
                <div className="modal-dialog modal-lg" role="document">
                    <div className="modal-content">
                        <div className="modal-header">
                            <h5 className="modal-title" id="movalVidelFullLabel">Declaración Jurada</h5>
                            <button type="button" className="close" data-dismiss="modal" aria-label="Close">
                                <span aria-hidden="true">&times;</span>
                            </button>
                        </div>
                        <div className="modal-body">

                            <div className="row">
                                <div className="col-sm-12 col-md-12 col-lg-12 embed-container">
                                    <iframe width="640" height="360" src="https://player.vimeo.com/video/35166943"  frameBorder="0" 
                                    allow="accelerometer; autoplay; encrypted-media; gyroscope; picture-in-picture" allowFullScreen >
                                    </iframe>
                                </div>
                            </div>
                        </div>
                        <div className="modal-footer">
                            <button type="button" className="btn btn-primary button-style" onClick={e => this.handleRedirectUrlClick(e, links[1].url) }>Ir al formulario</button>
                        </div>
                    </div>
                </div>
            </div>
        );
    }
}

export default ModalVideo;
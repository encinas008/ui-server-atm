import React, { Component } from 'react';
import PropTypes from 'prop-types';
import Config from '../../data/config';

import ModalVideo from '../../components/utils/ModalVideo';
import { link } from 'fs';

//<!--================== Features section =====================-->
class Features extends Component {

    /*constructor(props) {
        super(props);
        //this.state = {isToggleOn: true};
        // Este enlace es necesario para hacer que `this` funcione en el callback
        //this.hanldeOpenModalClick = this.handleClick.bind(this);
    }*/

    handleRedirectUrlClick(ev, url) {
        window.location.href = url;
    }

    hanldeOpenModalClick(ev, url) {
        window.jQuery("#modalVideoFull").modal("show")
    }

    static propTypes = {
        links: PropTypes.array.isRequired
    }

    componentWillMount (){
        return { data:[] };
    }

    componentDidMount() {

        
        window.jQuery('#services-slider').carousel({
            //pause: true,
            interval: 5000000,
            wrap: false,
            ride: false
            }
        )
        //funciona bien si son varios
        window.jQuery('#services-slider').on('slide.bs.carousel', function (e) {

            var $e = window.jQuery(e.relatedTarget);
            var idx = $e.index();
            var itemsPerSlide = 4;
            var totalItems = window.jQuery('.carousel-item-custom').length;
            
            if (idx >= totalItems-(itemsPerSlide-1)) {
                var it = itemsPerSlide - (totalItems - idx);
                for (var i=0; i<it; i++) {
                    // append slides to end
                    if (e.direction=="left") {
                        window.jQuery('.carousel-item-custom').eq(i).appendTo('.carousel-inner-custom');
                    }
                    else {
                        window.jQuery('.carousel-item-custom').eq(0).appendTo('.carousel-inner-custom');
                    }
                }
            }
        });
    }

    render = () => {
        const {links} = this.props;

        return <div id="features">

            <div className="container">
                <div className="carousel-custom">
                    <div id="services-slider" className="carousel slide " data-ride="carousel" data-interval="9000">
                        <div className="carousel-inner-custom  row w-100 mx-auto" role="listbox">
                            <div className="carousel-item carousel-item-custom col-md-3 active bottom-space">
                                <div className="folded-corner service_tab_1 folded-corner-rounded">
                                    <a href={links[1].url} title="Licencias de Funcionamiento">
                                        <div className="text">
                                            <i className="fa fa-address-card-o fa-5x fa-icon-image"></i>
                                        </div>
                                    </a>
                                </div>
                                <a href={links[1].url} title="Licencias de Funcionamiento" className="item-title">Licencia de Funcionamiento</a>
                            </div>
                            <div className="carousel-item carousel-item-custom col-md-3 bottom-space">
                                <div className="folded-corner service_tab_1 folded-corner-rounded ">
                                    <a href={links[3].url} title="Prescripcione">
                                        <div className="text">
                                        <i className="fa fa-address-card-o fa-5x fa-icon-image"></i>
                                        </div>
                                    </a>
                                </div>
                                <a href={'#'} title="Prescripciones" className="item-title">Prescripciones</a>
                            </div>
                            <div className="carousel-item carousel-item-custom col-md-3 bottom-space">
                                <div className="folded-corner service_tab_1 folded-corner-rounded ">
                                    <a href="#" title="Otros">
                                        <div className="text">
                                        <img className='img-thumbnail rounded mx-auto d-block img-noborder' alt='img-prescripcion'
                                                src={Config[3].url + '/static/img/men_work.png'} />
                                        </div>
                                    </a>
                                </div>
                                <a href="#" title="Otros" className="item-title">CRAM</a>
                            </div>

                            <div className="carousel-item carousel-item-custom col-md-3 bottom-space">
                            </div>
                        </div>
                        <a className="carousel-control-prev custom-control" href="#services-slider" role="button" data-slide="prev">
                            <i className="fa fa-chevron-left fa-lg text-muted"></i>
                            <span className="sr-only">Previous</span>
                        </a>
                        <a className="carousel-control-next text-faded custom-control" href="#services-slider" role="button" data-slide="next">
                            <i className="fa fa-chevron-right fa-lg text-muted"></i>
                            <span className="sr-only">Next</span>
                        </a>
                    </div>

                    <a className="carousel-control-prev" href="#services-slider" role="button" data-slide="prev">
                        <span className="carousel-control-prev-icon" aria-hidden="true"></span>
                        <span className="sr-only">Previous</span>
                    </a>
                    <a className="carousel-control-next" href="#services-slider" role="button" data-slide="next">
                        <span className="carousel-control-next-icon" aria-hidden="true"></span>
                        <span className="sr-only">Next</span>
                    </a>
                </div>
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                
            </div>
        
            <ModalVideo urlDestiny={'localhost'} links={links} />
        </div>;
    }
}

export default Features;
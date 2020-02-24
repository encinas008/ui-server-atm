import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import Links from '../../data/link';
import Config from '../../data/config';
import AuthService from '../../components/Usuario/AuthService';

// ================ Showcase section ===================
var auth = undefined
class ShowCase extends Component {

    constructor(props) {
        super(props);
        this.Auth = new AuthService();
        auth = this.Auth
    }

    componentDidMount() {

        window.jQuery('#show-case-slider').on('slid.bs.carousel', function (event) {
            console.log('slid at ', event.timeStamp)
        })

        window.jQuery('#show-case-slider').on('show.bs.modal', function (e) {
            e.stopPropagation();
            return e.preventDefault();
        });
    }

    render = () => {
        return <div id="showcase">
            <div className="container-fluid showcase padding-left-right-0">

                <div className="row">
                    <div className="col-lg-9 col-md-9 col-sm-12 col-12 bottom-space padding-right-0">

                        <div id="show-case-slider" className="carousel slide" data-ride="carousel">
                            <ol className="carousel-indicators">
                                <li data-target="#show-case-slider" data-slide-to="0" className="active"></li>
                                <li data-target="#show-case-slider" data-slide-to="1"></li>
                                <li data-target="#show-case-slider" data-slide-to="2"></li>
                            </ol>
                            <div className="carousel-inner">
                                <div className="carousel-item active">
                                    <a href="/" title="Licencias de Funcionamiento" className="item-title">
                                        <img className="img-fluid" src={Config[2].url + '/carrousel/perdonazo.jpg'} alt="Perdonazo" />
                                    </a>
                                </div>
                                <div className="carousel-item">
                                    <a href="/" title="Licencias de Funcionamiento" className="item-title">
                                        <img className="img-fluid" src={Config[2].url + '/carrousel/impuestos_anuales.jpg'} alt="Impuestos Anuales" />
                                    </a>
                                </div>
                                <div className="carousel-item">
                                    <a href="/" title="Licencias de Funcionamiento" className="item-title">
                                        <img className="img-fluid" src={Config[2].url + '/carrousel/impuestos_transferencia.jpg'} alt="Impuestos a la Transferencia" />
                                    </a>
                                </div>
                            </div>

                            <a className="carousel-control-prev" href="#show-case-slider" role="button" data-slide="prev">
                                <span className="carousel-control-prev-icon" aria-hidden="true"></span>
                                <span className="sr-only">Previous</span>
                            </a>
                            <a className="carousel-control-next" href="#show-case-slider" role="button" data-slide="next">
                                <span className="carousel-control-next-icon" aria-hidden="true"></span>
                                <span className="sr-only">Next</span>
                            </a>
                        </div>
                    </div>

                    <div className="col-lg-3 col-md-3 col-sm-12 col-12 padding-left-0">
                        <div className=" text-center showlogo-button">
                            <div className="row">
                                <div className="col-12 show-mobil ">
                                    <img src={Config[2].url + '/static/img/logo_atm.png'} alt="logo atm" className="img-fluid" />

                                    {!auth.loggedIn() ? <Link to={{ pathname: Links[5].url }} className="button-style showcase-btn" >Registrate</Link>
                                        : " "}
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="row">
                    <div className="quotations-container">
                        <div className="quotations-label">COTIZACIONES</div>
                        <div className="quotations helper-dato-quotation ">
                            <p className="helper-marquee-quotation">
                                <span>Tipos de Cambio</span>&nbsp;Dólar Compra: 6.85 | Dólar Venta: 6.97 | Euro Compra: 7.30912 | Euro Venta: 8.01621 | UFV: 2.31832&nbsp;<span>Tasa Referencial TRe</span>&nbsp;MN: 2.62 | MV DOL: 0.00 | MN UFV: 0.00 | ME: 0.75				</p>
                        </div>
                    </div>
                </div>
            </div>
        </div>;
    }
}

export default ShowCase;
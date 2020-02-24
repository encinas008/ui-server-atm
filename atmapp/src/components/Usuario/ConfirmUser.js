import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

import Fetch from '../../components/utils/Fetch';
import Links from '../../data/link';
import Texto from '../../data/es';
import { tsExternalModuleReference } from '@babel/types';

class RegisterUser extends Component {

    constructor(props, context) {
        super(props, context);

        this.fetch = new Fetch();
        this.fetch.setToast(toast)

        this.state = {
            accountActive: false,
            textAccount: ""
        };
    }

    componentDidMount() {
        var self = this;
        let token = window.getParameterByName('token');
        let token_conf = window.getParameterByName('tokenc');
        const response = this.fetch.fetchGet(`api/usuario/confirmar-cuenta/${token}/${token_conf}`);
        response.then(res => {
            if (res !== undefined && res.status === true) {
                self.setState({ accountActive: res.status, textAccount: res.message })
            }else{
                self.setState({ accountActive: false, textAccount: Texto.account_not_active })
            }
        })
    }

    render() {
        return (
            <div id="contact" className="contact paddingTop" >
                {/* Breadcrumb Area Start */}
                <div className="breadcrumb-area bg-img bg-overlay jarallax" >
                    <div className="container h-100">
                        <div className="row h-100 align-items-center">
                            <div className="col-12">
                                <div className="breadcrumb-content text-center">
                                    <h2 className="page-title">{Texto.confirm_account}</h2>
                                    <nav aria-label="breadcrumb">
                                        <ol className="breadcrumb justify-content-center">
                                            <li className="breadcrumb-item"><Link to={{ pathname: Links[0].url }} > {Links[0].title}</Link></li>
                                            <li className="breadcrumb-item active" aria-current="page">Confirmar Cuenta</li>
                                        </ol>
                                    </nav>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                {/* Breadcrumb Area End */}

                <div id="features">
                    {this.state.accountActive ?
                        <div className="text-center features-caption-custom features" >
                            <h4>{this.state.textAccount}</h4>
                            <p >{Texto.now_can_init_session}</p>
                            <Link to={{ pathname: Links[4].url }} className="button-style showcase-btn" >Ingresar</Link>
                        </div> :
                        <div className="text-center features-caption-custom features" >
                            <h4>{this.state.textAccount}</h4>
                            <p >Su token de activación a expirado, vuelva a solicitar un nuevo token o comuniquse con el 
                                <Link to={""} className="" > centro de ayuda </Link> 
                                o envienos una solicitud mediante el
                                <Link to={""} className="" > formulario de contacto </Link>
                                para comunicarse con nuestro equipo</p>
                        </div>
                    }
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

export default RegisterUser;
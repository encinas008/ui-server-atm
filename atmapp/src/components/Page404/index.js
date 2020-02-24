import React, { Component } from 'react';
import Links from '../../data/link';

class Page404 extends Component {

    componentDidMount() {
        debugger
        //if (window.location.pathname === Links[6].url) {  //'/declaracion-jurada-edit'
          //  window.location.reload();
        //}

        if (window.location.pathname === Links[12].url) {  //'/prescripcion-edit'
            window.location.reload();
        }
    }

    render = () => {
        return <div id="services" className="paddingTop30" >
            <div className="container">
                <div className="row">
                    <div className="col-md-12">
                        <div className="error-template">
                            <h1>
                                Oops!</h1>
                            <h2>
                                404 Pagina no Encontrada</h2>
                            <div className="error-details">
                                Lo Sentimos, Ha Ocurrido un Error, Pagina Solicitada no Encontrada!
                            </div>
                            <div className="error-actions">
                                <a href="#" className="button-style showcase-btn"><span className="glyphicon glyphicon-home"></span>Inicio </a>
                                <a href="#" className="button-style showcase-btn"><span className="glyphicon glyphicon-envelope"></span> Contactanos </a>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>

    }
}

export default Page404;
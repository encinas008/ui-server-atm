import React, { Component } from 'react';

import Constant from '../../data/constant';
import FormPersona from '../../components/DeclaracionJurada/FormPersona';
import Texto from '../../data/es';
import PasosNavigationLicencia from '../../components/utils/PasosNavigationLicencia';
import Languaje from '../../data/es';

//var fetch = null
//var toast = null
var derecho_admision = 0
class FormSolicitante extends Component {

    constructor(props, context) {
        super(props, context);

        this.constant = Constant[0];
        this.solicitanteDb = null
    }

    componentDidMount() {
        //actualizamos el mensaje de error para el input nit
        var li_error = window.jQuery("input[name='datos_juridicos[nit]']").siblings('ul');
        window.jQuery("#input[name='datos_juridicos[nit]']").siblings('ul').remove();
        window.jQuery("input[name='datos_juridicos[nit]']").parent('div').parent('div').append( li_error );
    }

    componentWillMount(){
 
        if(this.props.solicitanteDb !== null && this.props.solicitanteDb !== undefined){
            this.solicitanteDb = this.props.solicitanteDb
        }
    }

    render() {
        if(this.props.hasOwnProperty('declaracionJurada') && this.props.declaracionJurada !== undefined ){
            if( this.props.declaracionJurada.hasOwnProperty('derecho_admision'))
                derecho_admision = this.props.declaracionJurada.derecho_admision
        }

        if(this.props.hasOwnProperty('solicitanteDb') && this.props.solicitanteDb !== undefined){
            if( this.props.hasOwnProperty('TipoActividadEconomica') && this.props.solicitanteDb.TipoActividadEconomica.hasOwnProperty('temporal'))
                derecho_admision = this.props.solicitanteDb.TipoActividadEconomica.temporal ? 2 : 1
            
            this.solicitanteDb = this.props.solicitanteDb
        }
        return (
            <div className="row">
                <PasosNavigationLicencia titulo_paso1={ (parseInt(derecho_admision)  === parseInt(Constant[0].derecho_admision.permanente)) ? Languaje.actividad_economica_permanente : Languaje.actividad_economica_temporal}  
                                    paso1_active={true} paso2_active={true} paso3_active={false} 
                                    paso4_active={false} paso5_active={false}/>

                <form action="" className="contact__form needs-validation" name="formSolicitante" id="formSolicitante"
                    method="post" noValidate onSubmit={this.props.onSubmitForm} style={{ width: '100%' }}>
                    {this.props.declaracionJurada.contribuyente === '1' ? ""
                        :   
                        <div className="row">
                            <div className="col-12  form-group">
                                <h5 className="color-gris">{Texto.persona_juridica}</h5>
                            </div>
                        </div>
                        }

                    {/* contribuyente natural */}
                    {this.props.declaracionJurada.contribuyente === '1' ?
                        <FormPersona nameForm={"persona"} toast={this.props.toast} natural={true} solicitanteDb={this.solicitanteDb } />
                        : ""}
                   

                    {/* contribuyente juridico */}
                    {this.props.declaracionJurada.contribuyente === '2' ?
                        <FormPersona nameForm={"persona"} toast={this.props.toast} natural={false} solicitanteDb={this.solicitanteDb }/>
                        : ""}

                    <div className="row">
                        <div className="col-sm-12 col-md-12 col-lg-12 form-group">
                            <input name="Siguiente" type="submit" className="button-style pull-right" value="Siguiente" />
                        </div>
                    </div>
                </form>
            </div>
        );
    }
}

export default FormSolicitante;
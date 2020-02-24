import React, { Component } from 'react';
import AsyncSelect from 'react-select/async';

import Constant from '../../data/constant';
import Fetch from '../../components/utils/Fetch';
import Languaje from '../../data/es';
import PasosNavigationLicencia from '../../components/utils/PasosNavigationLicencia';

//import { ToastContainer, toast } from 'react-toastify';
//import 'react-toastify/dist/ReactToastify.css';

var fetch = null
var toast = null
var derecho_admision = "";
class FormDJ extends Component {

    constructor(props, context) {
        super(props, context);

        this.constant = Constant[0];
        this.handleInputChange = this.handleInputChange.bind(this);
        this.noOptionsMessage = this.noOptionsMessage.bind(this);

        toast = this.props.toast;
        fetch = new Fetch();
        fetch.setToast(toast);
        this.optionsSelect = [];

        this.state = {
            showFormPerNatural: false,
            showFormPerJuridica: false,
            token_dj: null,
            fur: null
        }
        derecho_admision = this.props.derecho_admision
    }

    componentDidMount() {

        if(this.props.declaracionJuradaDb !== null && this.props.declaracionJuradaDb !== undefined){
            let declaracion_jurada = this.props.declaracionJuradaDb.DeclaracionJurada
            let solicitante = this.props.declaracionJuradaDb.Solicitante
            let tipo_actividad_economica = this.props.declaracionJuradaDb.TipoActividadEconomica
            window.create_input_hidden(declaracion_jurada.fur, 'declaracion_jurada[fur]', "formDJ");
            document.getElementById("inputFur").value = declaracion_jurada.fur;

            window.jQuery("select[name='solicitante[contribuyente]']").val(solicitante.contribuyente).trigger('change');

            this.optionsSelect  = [
                { value: tipo_actividad_economica.id, label: tipo_actividad_economica.name }
            ];

            window.create_input_hidden(declaracion_jurada.id_actividad_economica, 'actividad_economica[id_tipo_actividad]', 'formDJ');
        }
    }

    componentWillMount(){
        if(this.props.declaracionJuradaDb !== null && this.props.declaracionJuradaDb !== undefined){
            let tipo_actividad_economica = this.props.declaracionJuradaDb.TipoActividadEconomica
            this.optionsSelect  = [
                { value: tipo_actividad_economica.id, label: tipo_actividad_economica.name }
            ];
            derecho_admision = tipo_actividad_economica.temporal ? Constant[0].derecho_admision.temporal : Constant[0].derecho_admision.permanente
        }
    }

    async loadOption(inputValue) {
        if (inputValue.length > 2) {
            const response = await fetch.axiosAsyncGet(`api/tipo-actividad-economica/search-by-name/${inputValue}/${derecho_admision}`);
            if (response.status === true) 
                return response.data;
            else
                return [];
        }else{
            return this.optionsSelect
        }
    }

    handleInputChange = selectedOption => {
        if (selectedOption !== null)
            window.create_input_hidden(selectedOption.value, 'actividad_economica[id_tipo_actividad]', 'formDJ');
    };

    noOptionsMessage(props) {
        let search = "";
        if( (parseInt(derecho_admision)  === parseInt(Constant[0].derecho_admision.permanente)) )
            search = Languaje.ingresa_tipo_actividad_economica +" - "+Languaje.permanente 
        else
            search = Languaje.ingresa_tipo_actividad_economica +" - "+Languaje.temporal
        if (props.inputValue === '') {
          return ( search);
        }
        return ( Languaje.criterio_busqueda_no_corresponde);
    }

    render() {
        //let derecho_admision === Constant[0].derecho_admision.permanente ? " "+Languaje.actividad_economica_permanente : " "+Languaje.actividad_economica_temporal
        return (
            <div className="row">
                <PasosNavigationLicencia titulo_paso1={ (parseInt(derecho_admision)  === parseInt(Constant[0].derecho_admision.permanente)) ? " "+Languaje.actividad_economica_permanente : " "+Languaje.actividad_economica_temporal} 
                                        paso1_active={true} paso2_active={false} paso3_active={false} 
                                        paso4_active={false} paso5_active={false}/>

                <form action="" className="contact__form needs-validation" name="formDJ" id="formDJ"
                    method="post" noValidate onSubmit={this.props.onSubmitForm} style={{ width: '100%' }}>

                    <div className="row">
                        <div className="col-sm-12 col-md-4 col-lg-4 form-group">
                            <label htmlFor="inputFur" >FUR *</label>
                            <input id="inputFur" name="inputFor" type="text" className="form-control" placeholder="Fur" 
                            disabled data-parsley-required="true" />
                        </div>

                        <div className="col-sm-12 col-md-4 col-lg-4 form-group">
                            <label htmlFor="actividad_economica[id_tipo_actividad]">Actividad Económica *</label>
                            <AsyncSelect
                                cacheOptions
                                loadOptions={this.loadOption}
                                defaultOptions
                                onChange={this.handleInputChange}
                                isClearable
                                isSearchable
                                placeholder={Languaje.tipo_actividad_economica}
                                required
                                defaultValue={[this.optionsSelect[0]]}
                                noOptionsMessage={this.noOptionsMessage}
                            />
                        </div>

                        <div className="col-sm-12 col-md-4 col-lg-4 form-group">
                            <label htmlFor="solicitante[contribuyente]">Contribuyente *</label>
                            <select className="form-control" id="solicitante[contribuyente]" name="solicitante[contribuyente]"
                                data-parsley-required="true" >
                                <option defaultValue value='' >Seleccione Contribuyente</option>
                                <option key={1} value={'1'} >Natural</option>
                                <option key={2} value={'2'}>Juridica</option>
                            </select>
                        </div>
                    </div>

                    <div className="row">
                        <div className="col-sm-12 col-md-12 col-lg-12 form-group">
                            <input name="Siguiente" type="submit" className="button-style pull-right" value={this.props.buttonName} />
                        </div>
                    </div>
                </form>
            </div>
        );
    }
}

export default FormDJ;
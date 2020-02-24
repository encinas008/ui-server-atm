import React from 'react';
import PropTypes from 'prop-types';
import { Link } from 'react-router-dom';

const PasosNavigationLicencia = ({ titulo_paso1, paso1_active, paso2_active,
    paso3_active, paso4_active, paso5_active }) => {

    var detector = new window.MobileDetect(window.navigator.userAgent)
    if( Boolean(detector.mobile()) ){
        if(paso1_active && !paso2_active && !paso3_active && !paso4_active && !paso5_active)
            paso1_active = true
        
        if(paso1_active && paso2_active && !paso3_active && !paso4_active && !paso5_active){
            paso1_active = false
            paso2_active = true
        }

        if(paso1_active && paso2_active && paso3_active && !paso4_active && !paso5_active){
            paso1_active = false
            paso2_active = false
            paso3_active = true
        }

        if(paso1_active && paso2_active && paso3_active && paso4_active && !paso5_active){
            paso1_active = false
            paso2_active = false
            paso3_active = false
            paso4_active = true
        }

        if(paso1_active && paso2_active && paso3_active && paso4_active && paso5_active){
            paso1_active = false
            paso2_active = false
            paso3_active = false
            paso4_active = false
            paso5_active = true
        }
    }
    return (
        <ol className="col-12 breakcrumb-solo" >
        <li className={paso1_active ? 'active' : "display-active"}>
            <span className={paso1_active ? 'paso1-active' : ""}></span>
            <span className={paso1_active ? 'texto' : "texto_free"}>{titulo_paso1}</span>
        </li>

        
        <li className={paso2_active ? ' active' : "display-active"}>
            <span className={paso2_active ? 'paso2-active' : "paso2"}></span>
            <span className={paso2_active ? 'texto' : "texto_free"}>Registro de Contribuyente</span>
        </li>

        <li className={paso3_active ? 'active' : "display-active"}>
            <span className={paso3_active ? 'paso3-active' : "paso3"}></span>
            <span className={paso3_active ? 'texto' : "texto_free"}>Domicilio del Contribuyente</span>
        </li>

        <li className={paso4_active ? 'active' : "display-active"}>
            <span className={paso4_active ? 'paso4-active' : "paso4"}></span>
            <span className={paso4_active ? 'texto' : "texto_free"}>Domicilio de la Actividad Económica</span>
        </li>

        <li className={paso5_active ? 'active' : "display-active"}>
            <span className={paso5_active ? 'paso5-active' : "paso5"}></span>
            <span className={paso5_active ? 'texto' : "texto_free"}>Vista Previa</span>
        </li>
    </ol>)
};

PasosNavigationLicencia.prototype = {
    titulo_paso1: PropTypes.string.isRequired,
    paso1_active: PropTypes.bool.isRequired,
    paso2_active: PropTypes.bool.isRequired,
    paso3_active: PropTypes.bool.isRequired,
    paso4_active: PropTypes.bool.isRequired,
    paso5_active: PropTypes.bool.isRequired
}

export default PasosNavigationLicencia;
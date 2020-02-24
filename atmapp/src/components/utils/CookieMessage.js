import React from 'react';

const CookieMessage = ({titlePage, breadcrumbs}) => (
    <div id="block-search">
        <form className="form-inline" >
            <label className="sr-only" htmlFor="inputSearchCI">CI</label>

            <select className="form-control" id="declaracion_jurada[id_actividad_economica]" name="declaracion_jurada[id_actividad_economica]"
                >
                <option defaultValue>CI</option>
                <option key={1} value={1}>Nit</option>
            </select>

            <label className="sr-only" htmlFor="inputSearchCiNit">Ci/Nit</label>
            <div className="input-group mb-2 mr-sm-2">
                <div className="input-group-prepend">
                    <div className="input-group-text"> <i className="fa fa-address-card-o" aria-hidden="true"></i></div>
                </div>
                <input type="text" className="form-control" name="inputSearchCiNit" placeholder="Buscar por CI" />
            </div>

            <input name="submit" type="submit" className="button-style" value="Buscar" />
        </form>
    </div>
);
/*
TitlePage.prototype={
    titlePage: PropTypes.string.isRequired,
    url: PropTypes.string.isRequired,
    title: PropTypes.string.isRequired
}*/

export default CookieMessage;
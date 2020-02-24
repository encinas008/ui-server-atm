import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import TitlePage from '../../components/utils/TitlePage';
import AsyncSelect from 'react-select/async';

import Fetch from '../../components/utils/Fetch';
import Links from '../../data/link';
import Languaje from '../../data/es';
import AuthService from '../../components/Usuario/AuthService';

var _usuario = []
var session_usuario = null
var fetch = null
//var _optionsSelect = []
class Perfil extends Component {

    constructor(props, context) {
        super(props, context);

        this.handlePerfilInformatcionClick = this.handlePerfilInformatcionClick.bind(this)
        this.handlePerfilEditClick = this.handlePerfilEditClick.bind(this)
        this.handlePerfilPictureClick = this.handlePerfilPictureClick.bind(this)
        this.handleChangePasswordClick = this.handleChangePasswordClick.bind(this)

        this.hanldePerfilClick = this.hanldePerfilClick.bind(this)
        this.onSubmitFormDatos = this.onSubmitFormDatos.bind(this)
        this.onSubmitFormChangePassword = this.onSubmitFormChangePassword.bind(this)
        this.onSubmitFormImage = this.onSubmitFormImage.bind(this)

        this.handleInputChange = this.handleInputChange.bind(this);

        this.fetch = new Fetch();
        this.fetch.setToast(toast)

        fetch = this.fetch

        this.Auth = new AuthService();

        this.state = {
            _usuario: [],
            showPerfil: true,
            optionsSelect: []
        };

        this.titlePage = Languaje.perfil
    }

    componentDidMount() {
        if (this.Auth.loggedIn()) {
            session_usuario = this.Auth.getProfile()

            var self = this
            _usuario = []  
            const response = this.fetch.fetchGet(`api/usuario/get-by-token/${session_usuario.token}`);
            response.then(res => {
                if (res !== undefined && res.status === true) {
        
                    if(Boolean(res.data) && Boolean(res.data.Usuario)){
                        let usuario = res.data.Usuario
                        //_usuario.push(<li key={0} > <span>Id: </span>{usuario.token }</li>)
                        _usuario.push(<li key={1}> <span>Username: </span>{usuario.username }</li>)
                    }

                    if(Boolean(res.data) && Boolean(res.data.DatosUsuario)){
                        let datos = res.data.DatosUsuario
                        _usuario.push(<li key={2} > <span>Nombre: </span>{datos.name }</li>)
                        _usuario.push(<li key={3}> <span>Apellido Paterno: </span>{datos.apellido_paterno }</li>)
                        _usuario.push(<li key={4}> <span>Apellido Materno: </span>{datos.apellido_materno }</li>)
                        _usuario.push(<li key={5}> <span>Documento de Identificación: </span>{datos.ci }</li>)
                        _usuario.push(<li key={6}> <span>Institución: </span>{datos.company }</li>)
                        _usuario.push(<li key={7}> <span>Dirección: </span>{datos.address }</li>)

                        let prefijo = ''
                        if(Boolean(res.data) && Boolean(res.data.Pais)){
                            _usuario.push(<li key={8}> <span>Pais: </span>{res.data.Pais.name }</li>)
                            prefijo = res.data.Pais.code_phone
                        }

                        _usuario.push(<li key={9}> <span>Teléfono: </span>{prefijo + "-"+datos.phone }</li>)

                        if(Boolean(datos.image))
                            document.getElementById('avatarPerfilUser').src=datos.image
                    }
                    self.setState({
                        usuario: _usuario, 
                    });

                    toast.success(res.message, {
                        position: "top-right",
                        autoClose: 5000,
                        hideProgressBar: false,
                        closeOnClick: true,
                        pauseOnHover: true,
                        draggable: true
                    });
                }
            })
        }else
            this.props.history.replace(Links[4].url)
    }

    hanldePerfilClick(){
        this.setState({showPerfil: true})
    }

    handlePerfilInformatcionClick(event){
        window.jQuery('.link-style').removeClass('active');

        event.target.classList.add('active')
        window.jQuery('#multiCollapsePerfilInformation').collapse("show") 
        window.jQuery('#multiCollapsePerfilEdit').collapse("hide") 
        window.jQuery('#multiCollapsePerfilPicture').collapse('hide')
        window.jQuery('#multiCollapseChangePassword').collapse('hide')
    }

    async handlePerfilEditClick(event){
        window.jQuery('.link-style').removeClass('active');

        event.target.classList.add('active')
        window.jQuery('#multiCollapsePerfilInformation').collapse("hide") 
        window.jQuery('#multiCollapsePerfilEdit').collapse("show") 
        window.jQuery('#multiCollapsePerfilPicture').collapse('hide')
        window.jQuery('#multiCollapseChangePassword').collapse('hide')
        var self = this

        this.fetch.fetchGet('api/datos-usuario/get-by-user').then(dataJson =>{
            if(dataJson !== undefined && dataJson.status === true){
                
                if(Boolean(dataJson.DatosUsuario) && Boolean(dataJson.Pais) ){
                    var datos = dataJson.DatosUsuario;
                    var pais = dataJson.Pais;
                    document.getElementsByName("datos[name]")[0].value = datos.name;
                    document.getElementsByName("datos[apellido_paterno]")[0].value = datos.apellido_paterno;
                    document.getElementsByName("datos[apellido_materno]")[0].value = datos.apellido_materno;
                    document.getElementsByName("datos[ci]")[0].value = datos.ci;
                    document.getElementsByName("datos[company]")[0].value = datos.company;
                    document.getElementsByName("datos[address]")[0].value = datos.address;

                    document.getElementById("basic-addon-phone-code").innerHTML = pais.code_phone;
                    document.getElementsByName("datos[phone]")[0].value = datos.phone;

                    self.setState({
                        optionsSelect: [ { value: pais.id, label: pais.name }]
                    })

                    toast.success(dataJson.message, {
                        position: "top-right",
                        autoClose: 5000,
                        hideProgressBar: false,
                        closeOnClick: true,
                        pauseOnHover: true,
                        draggable: true
                    });

                }else{
                    toast.warn(dataJson.message, {
                        position: "top-right",
                        autoClose: 5000,
                        hideProgressBar: false,
                        closeOnClick: true,
                        pauseOnHover: true,
                        draggable: true
                    });
                }
            }
        })
    }

    handlePerfilPictureClick(event){
        window.jQuery('.link-style').removeClass('active');
        
        event.target.classList.add('active')
        window.jQuery('#multiCollapsePerfilInformation').collapse("hide") 
        window.jQuery('#multiCollapsePerfilEdit').collapse("hide") 
        window.jQuery('#multiCollapsePerfilPicture').collapse('show')
        window.jQuery('#multiCollapseChangePassword').collapse('hide')
    }   

    handleChangePasswordClick(event){
        window.jQuery('.link-style').removeClass('active');
        
        event.target.classList.add('active')
        window.jQuery('#multiCollapsePerfilInformation').collapse("hide") 
        window.jQuery('#multiCollapsePerfilEdit').collapse("hide") 
        window.jQuery('#multiCollapsePerfilPicture').collapse('hide')
        window.jQuery('#multiCollapseChangePassword').collapse('show')
    }

    onSubmitFormDatos(event){
        event.preventDefault();
        const form = new FormData(event.target);
        window.jQuery("#"+event.target.getAttribute("id")).parsley().validate();

        var li_error = window.jQuery("#inputDatosPhone").siblings('ul');
        window.jQuery("#inputDatosPhone").siblings('ul').remove();
        window.jQuery("#inputDatosPhone").parent('div').parent('div').append( li_error );

        if (window.jQuery("#"+event.target.getAttribute("id")).parsley().isValid() ){
            this.fetch.fetchPost(form, 'api/datos-usuario/create').then(dataJson =>{
                if(dataJson !== undefined && dataJson.status === true){
                    toast.success(dataJson.message, {
                        position: "top-right",
                        autoClose: 5000,
                        hideProgressBar: false,
                        closeOnClick: true,
                        pauseOnHover: true,
                        draggable: true
                    });
                }
            })
        }else{

        }
        
    }

    onSubmitFormChangePassword(event){
        event.preventDefault();
        window.jQuery("#"+event.target.getAttribute("id")).parsley().validate();
        const form = new FormData(event.target);
        if (window.jQuery("#"+event.target.getAttribute("id")).parsley().isValid() ){
            this.fetch.fetchPost(form, 'api/usuario/change-password-members').then(dataJson =>{
                if(dataJson !== undefined && dataJson.status === true){
                    toast.success(dataJson.message, {
                        position: "top-right",
                        autoClose: 5000,
                        hideProgressBar: false,
                        closeOnClick: true,
                        pauseOnHover: true,
                        draggable: true
                    });
                }
            })
        }
    }

    onSubmitFormImage(event){
        event.preventDefault();
        window.jQuery("#"+event.target.getAttribute("id")).parsley().validate();
        const form = new FormData(event.target);

        if (window.jQuery("#"+event.target.getAttribute("id")).parsley().isValid() ){

            var input = document.getElementsByName("usuariofile")[0]
            var file = input.files[0], self = this
            
            window.blobToBase64(input.files[0], function(base64){
                form.append('usuario[mime_type_image]', file.type)
                form.append('usuario[image]', base64.replace(/\s/g, ''))
                //form.append('usuario[image]', base64.replace(/\s/g, ''))
                self.fetch.fetchPost(form, 'api/usuario/change-image').then(dataJson =>{
                    if(dataJson !== undefined && dataJson.status === true){
                        toast.success(dataJson.message, {
                            position: "top-right",
                            autoClose: 5000,
                            hideProgressBar: false,
                            closeOnClick: true,
                            pauseOnHover: true,
                            draggable: true
                        });
                    }
                })
            });
        }
    }

    async loadOption(inputValue) {
        if (inputValue.length > 2) {
            const response = await fetch.axiosAsyncGet(`api/country/search-by-name/${inputValue}`);
            if (response.status === true) 
                return response.data;
            else
                return [];
        }else{
            return this.state.optionsSelect
        }
    }

    handleInputChange = selectedOption => {
        if (selectedOption !== null){
            document.getElementById("basic-addon-phone-code").innerHTML = selectedOption.code_phone
        }
    };

    render() {
        const breadcrumbs = [
            {
                title: Links[0].title,
                url: Links[0].url
            },
            {
                title: Links[8].title,
                url: Links[8].url
            }
        ];

        return (

            <div id="services " className="paddingTop30" >
                <TitlePage titlePage={this.titlePage} breadcrumbs={breadcrumbs} position={'center'}/>
                <div className="container features">
                    <section className="panel-menu-info">
                        <div className="panel-menu-info-content">
                                <div className="row">
                                    <div className="col-4 col-md-2 col-lg-2">
                                    </div>
                                    <div className="col-4 col-md-2 col-lg-2">
                                    </div>
                                    <div className="col-4 col-md-2 col-lg-2">
                                    </div>
                                    <div className="col-4 col-md-2 col-lg-2">
                                    </div>
                                    <div className="col-4 col-md-2 col-lg-2">
                                    </div>
                                    <div className="col-4 col-md-2 col-lg-2">
                                        <div className="single-contact-info pointer" onClick={this.hanldePerfilClick}>
                                            <i className="fa fa-cog" aria-hidden="true"></i>
                                            <p >{Languaje.perfil}</p>
                                        </div>
                                    </div>
                                </div>
                            </div>
                    </section>

                    { this.state.showPerfil === true ? 

                        <div className="row">
                            <div className="col-12 col-md-3 col-lg-3">
                                <ul className="ver-inline-menu tabbable margin-bottom-10" id="profile-menu-tabs">
                                    <li>
                                        <img alt="gravatar" title="avatar" id="avatarPerfilUser" width="208" height="208" className="img-fluid"
                                        src="https://secure.gravatar.com/avatar/950057323d85eb9984bc44374502823d?s=208&amp;d=mm&amp;r=g" />                    
                                    </li>
                                    <li className="active">
                                        <Link to={"#" }  className={`link-style active`} style={{width: "100%"}} 
                                        onClick={this.handlePerfilInformatcionClick}>{Languaje.perfil_information}</Link>
                                    </li>

                                    <li className="active">
                                        <Link to={"#" }  className={`link-style`} style={{width: "100%"}} 
                                        onClick={this.handlePerfilEditClick}>{Languaje.perfil_edit}</Link>
                                    </li>

                                    <li className="active">
                                        <Link to={"#" }  className={`link-style`} style={{width: "100%"}} 
                                        onClick={this.handlePerfilPictureClick}>{Languaje.perfil_picture}</Link>
                                    </li>
                                    <li className="edit-profile">
                                        <Link to={"#" }  className={`link-style`} style={{width: "100%"}} 
                                        onClick={this.handleChangePasswordClick}>{Languaje.change_password}</Link>
                                    </li>
                                </ul>
                            </div>

                            <div className="col-12 col-md-9 col-lg-9">
                                <div className="row">
                                    <div className="col-12 col-md-12 col-lg-12">
                                        <div className="collapse show" id="multiCollapsePerfilInformation">
                                            <div className="card card-body">
                                                <ul className="unstyled " >
                                                    {this.state.usuario}
                                                </ul>
                                            </div>
                                        </div>
                                    </div>
                                    <div className="col-12 col-md-12 col-lg-12">
                                        <div className="collapse " id="multiCollapsePerfilEdit">
                                            <div className="card card-body">
                                                <div className="row">
                                                    <div className="col-12 ">
                                                        <div className="alert alert-info" role="alert">
                                                            Esto cambiará los datos de su cuenta, esta sección es solo para miembros autentificados.
                                                        </div>
                                                    </div>
                                                </div>

                                                <form action="" className="contact__form needs-validation" name="formPerfil" id="formPerfil"
                                                        method="post" noValidate onSubmit={this.onSubmitFormDatos} style={{ width: '100%' }}>

                                                    <div className="row">
                                                        <div className="col-12 col-sm-12 col-md-6 col-lg-6 form-group">
                                                            <label htmlFor="datos[name]">Nombre *</label>
                                                            <input name="datos[name]" type="text" className="form-control" placeholder="Nombre" 
                                                            data-parsley-minlength="3" minLength="3"
                                                            required data-parsley-required="true" pattern="[a-zA-Z À-ÿ\u00f1\u00d1]+" data-parsley-pattern="[a-zA-Z À-ÿ\u00f1\u00d1]+" />
                                                        </div>
                                                        <div className="col-12 col-sm-12 col-md-6 col-lg-6 form-group">
                                                            <label htmlFor="datos[apellido_paterno]" >Apellido Paterno *</label>
                                                            <input name="datos[apellido_paterno]" type="text" className="form-control" placeholder="Apellido Paterno" 
                                                            data-parsley-minlength="3" minLength="3"
                                                            required data-parsley-required="true" pattern="[a-zA-Z À-ÿ\u00f1\u00d1]+" data-parsley-pattern="[a-zA-Z À-ÿ\u00f1\u00d1]+" />
                                                        </div>
                                                    </div>

                                                    <div className="row">
                                                        <div className="col-12 col-sm-12 col-md-6 col-lg-6 form-group">
                                                            <label htmlFor="datos[apellido_materno]">Apellido Materno</label>
                                                            <input name="datos[apellido_materno]" type="text" className="form-control" placeholder="Apellido Materno"
                                                            required data-parsley-required="true" pattern="[a-zA-Z À-ÿ\u00f1\u00d1]+" data-parsley-pattern="[a-zA-Z À-ÿ\u00f1\u00d1]+" />
                                                        </div>

                                                        <div className="col-12 col-sm-12 col-md-6 col-lg-6 form-group">
                                                            <label htmlFor="datos[ci]">Documento de Identificación *</label>
                                                            <input name="datos[ci]" type="text" className="form-control" placeholder="CI" 
                                                            data-parsley-minlength="5" minLength="5" 
                                                            required data-parsley-required="true" pattern="[a-zA-Z À-ÿ\u00f1\u00d1]+" data-parsley-pattern="[a-zA-Z À-ÿ\u00f1\u00d1]+" />
                                                        </div>
                                                    </div>

                                                    <div className="row">
                                                        <div className="col-12 col-sm-12 col-md-6 col-lg-6 form-group">
                                                            <label htmlFor="datos[company]">Institución</label>
                                                            <input name="datos[company]" type="text" className="form-control" placeholder="Institución"
                                                            pattern="[a-zA-Z À-ÿ\u00f1\u00d1]+" data-parsley-pattern="[a-zA-Z À-ÿ\u00f1\u00d1]+" />
                                                        </div>
                                                    </div>

                                                    <div className="row">
                                                        <div className="col-12 col-sm-12 col-md-12 col-lg-12 form-group">
                                                            <label htmlFor="datos[address]">Dirección *</label>
                                                            <input name="datos[address]" type="text" className="form-control" placeholder="Dirección" 
                                                            required data-parsley-required="true" pattern="[a-zA-Z À-ÿ\u00f1\u00d1]+" data-parsley-pattern="[a-zA-Z À-ÿ\u00f1\u00d1]+" />
                                                        </div>
                                                    </div>

                                                    <div className="row">
                                                        <div className="col-12 col-sm-12 col-md-6 col-lg-6 form-group">
                                                            <label htmlFor="datos[id_country]">Pais *</label>
                                                            <AsyncSelect
                                                                cacheOptions
                                                                loadOptions={this.loadOption}
                                                                defaultOptions
                                                                onChange={this.handleInputChange}
                                                                isClearable
                                                                isSearchable
                                                                placeholder="Buscar Pais"
                                                                data-parsley-required="true" 
                                                                data-parsley-minlength="4" 
                                                                minLength="4"
                                                                name = "datos[id_country]"
                                                                required
                                                                defaultValue={[this.state.optionsSelect[0]]}
                                                            />
                                                        </div>

                                                        <div className="col-12 col-sm-12 col-md-6 col-lg-6 form-group">
                                                            <label htmlFor="datos[phone]">Teléfono *</label>
                                                            <div className="input-group mb-3">
                                                                <div className="input-group-prepend">
                                                                    <span className="input-group-text" id="basic-addon-phone-code">-</span>
                                                                </div>
                                                                <input type="text" name="datos[phone]" id="inputDatosPhone" className="form-control" placeholder="Teléfono" aria-label="Teléfono" 
                                                                aria-describedby="basic-addon-phone-code" data-parsley-required="true" data-parsley-minlength="6" minLength="6"  />
                                                            </div>
                                                        </div>
                                                    </div>

                                                    <div className="row">
                                                        <div className="col-sm-12 col-md-12 col-lg-12 form-group">
                                                            <input name="save" type="submit" className="button-style pull-right" value="Guardar Cambios" />
                                                        </div>
                                                    </div>
                                                </form>
                                            </div>
                                        </div>
                                    </div>
                                    <div className="col-12 col-md-12 col-lg-12">
                                        <div className="collapse " id="multiCollapsePerfilPicture">
                                            <div className="card card-body">
                                                <form action="" className="contact__form needs-validation" name="formPerfilImage" id="formPerfilImage"
                                                        method="post" noValidate onSubmit={this.onSubmitFormImage} style={{ width: '100%' }}
                                                        encType="multipart/form-data" >
                                                    <div className="row">
                                                        <div className="col-12 form-group files color">
                                                            <label htmlFor="usuariofile">Sube tu archivo *</label>
                                                            <input type="file" name="usuariofile" className="form-control" multiple="" />
                                                        </div>
                                                    </div>

                                                    <div className="row">
                                                        <div className="col-sm-12 col-md-12 col-lg-12 form-group">
                                                            <input name="save" type="submit" className="button-style pull-right" value="Guardar Cambios" />
                                                        </div>
                                                    </div>
                                                </form>
                                            </div>
                                        </div>
                                    </div>
                                    <div className="col">
                                        <div className="collapse" id="multiCollapseChangePassword">
                                            <div className="card card-body">

                                                <div className="row">
                                                    <div className="col-12 ">
                                                        <div className="alert alert-info" role="alert">
                                                            Esto cambiará la contraseña de acceso a su cuenta, esta sección es solo para miembros autentificados.
                                                        </div>
                                                    </div>
                                                </div>

                                                <form action="" className="contact__form needs-validation" name="formChangePassword" id="formChangePassword"
                                                        method="post" noValidate onSubmit={this.onSubmitFormChangePassword} style={{ width: '100%' }}>
                                                    
                                                    <div className="row">
                                                        <div className="col-12 col-sm-12 col-md-6 col-lg-6 form-group">
                                                            <label htmlFor="usuario[password_old]">Contraseña Actual *</label>
                                                            <input name="usuario[password_old]" type="password" className="form-control" placeholder="Contraseña Actual" 
                                                            data-parsley-required="true" data-parsley-minlength="6" minLength="6" required />
                                                        </div>
                                                    </div>

                                                    <div className="row">
                                                        <div className="col-12 col-sm-12 col-md-6 col-lg-6 form-group">
                                                            <label htmlFor="usuario[password]">Nueva Contraseña *</label>
                                                            <input id="usuario_password" name="usuario[password]" type="password" className="form-control" placeholder="Contraseña" 
                                                            data-parsley-required="true" data-parsley-minlength="6" minLength="6" required />
                                                        </div>
                                                    </div>

                                                    <div className="row">
                                                        <div className="col-12 col-sm-12 col-md-6 col-lg-6 form-group">
                                                            <label htmlFor="usuario[password_repeat]">Repita la Nueva Contraseña *</label>
                                                            <input name="usuario[password_repeat]" type="password" className="form-control" placeholder="Repita la Contraseña" 
                                                            data-parsley-required="true" data-parsley-minlength="6" minLength="6" data-parsley-equalto="#usuario_password" required />
                                                        </div>
                                                    </div>

                                                    <div className="row">
                                                        <div className="col-sm-12 col-md-12 col-lg-12 form-group">
                                                            <input name="save" type="submit" className="button-style pull-right" value="Cambiar Contraseña" />
                                                        </div>
                                                    </div>
                                                </form>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                        : ""}
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

export default Perfil;
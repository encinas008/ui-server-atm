import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import PropTypes from 'prop-types';
import AuthService from '../../components/Usuario/AuthService';
import Fetch from '../../components/utils/Fetch';

import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

import Links from '../../data/link';
import Config from '../../data/config';

var auth = undefined
var fetch = null
class Header extends Component{

    constructor(props) {
        super(props);
        this.Auth = new AuthService();
        auth = this.Auth
        this.state = {
            totalMenu: 2,
            username: "",
            function: "",
            thumbail:""
        };

        fetch = new Fetch();
        fetch.setToast(toast);
    }

    static propTypes = {
        title: PropTypes.string.isRequired,
        menu: PropTypes.array.isRequired
    }

    componentDidMount() {
        if(this.Auth.loggedIn()){
            let usuario = this.Auth.getProfile()

            const response = fetch.fetchGet(`api/usuario/get-thumbail`);
            response.then(res => {
                if (res !== undefined && res.status === true) {
                    if(res.Thumbail !== null && res.Thumbail !== ""){
                        this.setState({ totalMenu: 1, username: usuario.username, function: usuario.name, thumbail:res.Thumbail })
                    }else{
                        this.setState({ totalMenu: 1, username: usuario.username, function: usuario.name, thumbail:'https://secure.gravatar.com/avatar/950057323d85eb9984bc44374502823d?s=50&d=mm&r=g' })
                    }
                }else{
                    this.setState({ totalMenu: 1, username: usuario.username, function: usuario.name, thumbail:'https://secure.gravatar.com/avatar/950057323d85eb9984bc44374502823d?s=50&d=mm&r=g' })
                }
            })
        }
        else
            this.setState({totalMenu: 2})
    }

    handleClickLogut(event) {
        event.preventDefault()
        auth.logout()
        window.location.href = '/';
    }

    render = () => {
        const {menu} = this.props;
        return <div> 
        <nav className="navbar navbar-expand-lg fixed-top activate-menu navbar-light bg-light">
        <Link to={{pathname: "/"}} className={`navbar-brand`} ><img src={Config[2].url + '/static/img/escudo_cbba.png'} alt="escudo cbba" className="img-fluid logo-header" /> </Link>

        { this.Auth.loggedIn()  ? 
        <Link to={{pathname: "#" }}  className={`nav-link dropdown-toggle avatar-m`} 
        data-toggle="dropdown" aria-haspopup="true" aria-expanded="false" > 
            <img src={this.state.thumbail} 
            className="rounded-circle z-depth-0 logo-user" alt="avatar image"  />
        </Link>
        : ""}

        <button className="navbar-toggler" type="button" data-toggle="collapse" data-target="#navbarSupportedContent" 
        aria-controls="navbarSupportedContent" aria-label="Toggle navigation">
            <span className="navbar-toggler-icon"></span>
        </button>
        <div className="collapse navbar-collapse" id="navbarSupportedContent">
            <ul className="navbar-nav ml-auto">
                    { !this.Auth.loggedIn() ?
                        menu && menu.map( 
                            (menu, key) => <li key={key}>
                                {/* {key <= this.state.totalMenu ? 
                                    <Link to={menu.url} className={`nav-link${menu.url === 'login' ? ' h-button ' : ''}`} >
                                        {menu.title}
                                        { menu.url === 'login' ? 
                                        <i className="fa fa-chevron-right" aria-hidden="true" style={{fontSize:'13px'}}></i> 
                                        : ""
                                        }
                                        </Link>
                                    : ""} */}
                                <Link to={menu.url} className={`nav-link${menu.url === 'login' ? ' h-button h-button--sales' : ''}`} >
                                        {menu.title}
                                        { menu.url === 'login' ? 
                                        <i className="fa fa-chevron-right" aria-hidden="true" style={{fontSize:'13px'}}></i> 
                                        : ""
                                        }
                                </Link>
                            </li>
                        )
                        : menu && menu.map( 
                            (menu, key) => <li key={key}>
                                 {key < this.state.totalMenu ? 
                                    <Link to={menu.url} className={`nav-link${menu.url === 'login' ? ' h-button ' : ''}`} >
                                        {menu.title}
                                        { menu.url === 'login' ? 
                                        <i className="fa fa-chevron-right" aria-hidden="true" style={{fontSize:'13px'}}></i> 
                                        : ""
                                        }
                                        </Link>
                                    : ""} 
                            </li>
                        )
                    }
            </ul>
        </div>

        { this.Auth.loggedIn()  ? 
        <>
        <Link to={{pathname: "#" }}  className={`nav-link dropdown-toggle avatar-d`} id="navbarDropdownMenuLink-d" 
        data-toggle="dropdown" aria-haspopup="true" aria-expanded="false" > 
            <img src={this.state.thumbail} 
            className="rounded-circle z-depth-0 logo-user" alt="avatar image" />
        </Link>

        <div className="dropdown-menu dropdown-menu-right dropdown-secondary menu" aria-labelledby="navbarDropdownMenuLink-d">
            <div className="client-card">
                <div className="client-card__picture">
                    <img alt="gravatar" title="avatar" src="https://secure.gravatar.com/avatar/950057323d85eb9984bc44374502823d?s=50&amp;d=mm&amp;r=g" />                            </div>
                    <div className="client-card__details">
                        <div className="client-card__title">
                            {this.state.function}
                        </div>
                        <div className="client-card__subtitle">
                            {this.state.username}
                        </div>
                    </div>
                </div>

                <div className="client-card__profile-routes">
                    <Link to={{pathname: Links[8].url }}  className={`dropdown-item`}>Perfil</Link>
                    {/* <Link to={{pathname: "#" }}  className={`dropdown-item`}>Historial de Accesos</Link>
                    <Link to={{pathname: "#" }}  className={`dropdown-item`}>Notificaciones</Link>
                    */}
                    <Link to={{pathname: "#" }}  className={`dropdown-item`}></Link>
                    <Link to={{pathname: "#" }}  className={`dropdown-item`} onClick={this.handleClickLogut}>Salir</Link>
                </div>
        </div>
        </>
        : ""}
    </nav>
    </div>
        ;
    }
}

export default Header;
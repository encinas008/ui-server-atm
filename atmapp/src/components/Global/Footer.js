import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import Config from '../../data/config';
import Contact from '../Home/Contact';

//const Footer = () => {
class Footer extends Component {

  constructor(props) {
    super(props);
    //this.Auth = new AuthService();
    //auth = this.Auth
    this.handleMailClick = this.handleMailClick.bind()

    this.contact = new Contact()
    this.state = {
    };

    //fetch = new Fetch();
    //fetch.setToast(toast);
  }

  handleMailClick(event) {
    event.preventDefault()
    window.jQuery("#modalFormContacts").modal("show")
  }

  //return 
  render = () => {
    return <footer className="text-center pos-re">
      <div className="container">
        <div className="footer__box">


          <Link to={{ pathname: "/" }} className={`logo`} ><img src={Config[2].url + '/static/img/logo_atm.png'} alt="logo" className="img-fluid logo-footer" /></Link>

          <div className="social">
            <a href="#0"><i className="fa fa-facebook" aria-hidden="true"></i></a>
            <a href="#0"><i className="fa fa-twitter" aria-hidden="true"></i></a>
            <a href="#0"><i className="fa fa-linkedin" aria-hidden="true"></i></a>
            <a href="#0"><i className="fa fa-envelope-o" aria-hidden="true" onClick={this.handleMailClick}></i></a>
          </div>

          <p>&copy; {new Date().getFullYear()} Administración Tributaria Municipal.</p>
        </div>
      </div>

      <div className="curve curve-top curve-center"></div>

      <div className="row">
        <div id="mapUbicacionActividadEconomica" className="map-layer" style={{ width: "794px" }}></div>
      </div>

      <Contact />
    </footer>;
  }
}

export default Footer;
import React, { Component } from 'react';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import axios from 'axios';
import DataTable from 'react-data-table-component';
//import ReactTable from "react-table";
//import "react-table/react-table.css";
import Texto from '../../data/es';
import { Link } from 'react-router-dom';
//import _ from "lodash";
import Links from '../../data/link';
import Config from '../../data/config';
import Constant from '../../data/constant';
import Fetch from '../../components/utils/Fetch';
import TitlePage from '../../components/utils/TitlePage';
//import GlobalSearch from "./GlobalSearch";
//import { async } from 'q';
import AuthService from '../../components/Usuario/AuthService';
import ModalDetalle from '../utils/ModalDetalle';
import Editar from '../Prescripcion/PrescripcionEdit';
import { bindExpression } from '@babel/types';
//import Prescripcion from '.';
const columns = [
    {
        name: Texto.nombre_contribuyente,
        selector: 'nombre',   //npm uninstall <moduleName> --save 
        sortable: true,
        grow: 1,
        hide: 'sd',
    },
    {
        name: Texto.nombre_objeto,
        selector: 'name',
        sortable: true,
        grow: 1,
        hide: 'md',
    },
    {
        name: Texto.numero_objeto,
        selector: 'numero',
        sortable: true,
    },
    {
        name: Texto.numero_fur,
        selector: 'fur',
        sortable: true,
        hide: 'md',
    },
    {
        name: Texto.estado,
        center: true,
        sortable: true,                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                 
        cell: row => <div>
        
        {/* {row.code_estado === Constant[0].estado.en_proceso ? <span title={row.code_estado}><i className="fa fa-cog" aria-hidden="true" ></i></span> : ""}
            {row.code_estado === Constant[0].estado.completado ? <span title={row.code_estado}><i className="fa fa-file-text-o" aria-hidden="true"></i></span> : ""}
            {row.code_estado === Constant[0].estado.aprobado ? <span title={row.code_estado}><i className="fa fa-check" aria-hidden="true"></i></span> : ""}
         */}
            </div>
    },
    {
        name: 'Creado',
        selector: 'created_at',
        sortable: true,
        hide: 'md',
    },
    {
        name: '',
        sortable: true,
        cell: row => <div>
                
                  <div className="btn-group">
                  {/* <button type="button" className="btn btn-info dropdown-toggle button-link" data-toggle="dropdown"aria-haspopup="true" aria-expanded="false" >
                   <i className="fa fa-pencil-square-o" aria-hidden="true"></i>
                    </button>*/}
                        {/*
                      {row.numero_documento ? 
                        <Link to={{ pathname: `/prescripcion-edit?token=${row.token}` }} className='dropdown-item' >Editar Prescripcion Natural</Link>
                        :
                        <Link to={{ pathname: `/prescripcion-edit?token=${row.id}&nit=${row.nit}` }} className='dropdown-item' >Editar Prescripcion Juridico</Link>
                      }
                    
                      {<Link to={{ pathname: `/prescripcion-edit?token=${row.token}` }} className='dropdown-item' >Editar Prescripcion </Link>}
                      */}
                       <Link to="#" onClick={() => handleOpenEditClick(row)} style={{ fontSize: '20px', marginRight: '10px' }} title={`EDITAR ${row.name}`}  >
                       <i className="fa fa-pencil-square-o" aria-hidden="true"></i>
                      </Link>
                      <a href="#" title={`PDF  ${row.name}`} style={{ fontSize: '20px', marginRight: '10px' }}
                            onClick={() => handleCheckClickPdf(row)}><i className="fa fa-file-pdf-o" aria-hidden="true"></i></a>  
                </div>
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                     
        </div>,
       ignoreRowClick: true,
       allowOverflow: true,
       button: true,
    }
];

//const check = static_fetch.fetchGet(`api/prescripcion/estadoPrescripcion/${row.token}`);
const handleOpenEditClick = (row) => {
    
    debugger;
    const reaperturar_pres = static_fetch.fetchGet(`api/prescripcion/estadoPrescripcion/${row.token}`);
    reaperturar_pres.then(res => {
        debugger
        if (res !== undefined && res.status === true) {
            window.editPrescripcionBootbox(Links[12].url, row.token,
                res.is_complete_data_contribuyente ? true : false ,
                res.is_complete_data_domicilio ? true : false,
               // res.is_complete_data_domicilio_actividad_economica ? true : false,
            );
        } else {
            window.editPrescripcionBootbox(Links[12].url, row.token, false, false);
        }
    })
};

const handleCheckClickPdf = (row) => {
   // console.log(handleCheckClick);
    let self = this;
    debugger
    const check = static_fetch.fetchGet(`api/prescripcion/edit/${row}`);
    check.then(dataJson => {
        if (dataJson !== undefined && dataJson.status === true) {
              self.prescripcion.setTokenP(row.prescripcion.token)
              self.prescripcion.setFur(row.prescripcion.fur)     
            debugger;
              static_fetch.toast.success(dataJson.message, {
                position: "top-right",
                autoClose: 5000,
                hideProgressBar: false,
                closeOnClick: true,
                pauseOnHover: true,
                draggable: true
            });
        }
    })
};

const rowTheme = {
    rows: {
        // spaced allows the following properties
        spacing: 'spaced',
        spacingBorderRadius: '50px',
        spacingMargin: '3px',
        borderColor: 'rgba(0,0,0,.12)',
        backgroundColor: 'white',
        height: '52px',
    },
    cells: {
        cellPadding: '48px',
    },
};
var static_fetch = null;
var modal_pdf = null
var modal_detalle = null
var _auth = null
var _prescripcion = null
var static_fetch = null;

class Prescripcion extends Component {
    constructor(props) {
        super(props);
        this.constant = Constant[0];
        this.fetch = new Fetch();
        this.fetch.setToast(toast);
        this.Auth = new AuthService();
        _auth = this.Auth
        modal_detalle = new ModalDetalle()
        modal_detalle.setToast(toast)
        //modal_pdf = new ModalPdf()
       // modal_pdf.setToast(toast)
        this.titlePage = Texto.prescripcion
        static_fetch = this.fetch
        this.handleSubmitSearchForm = this.handleSubmitSearchForm.bind(this)
        this.state = {
            data: [],
            loading: false,
            totalRows: 0,
            perPage: 10,
            type_search: 0,
            showSearch: false
        };
        _prescripcion = this
    }
    
    async componentDidMount() { 
        //const data = [{ id: 1, title: 'Conan the Barbarian'}]; //del ejemplo
        const { perPage } = this.state;
        this.setState({ loading: true });
        const response = await this.fetch.axiosAsyncGet(`api/prescripcion/per-page/1/${perPage}/${this.state.type_search}`);
        console.log(response);
       // debugger
        if (response !== null && response.status === true) {
            this.setState({
                data: response.data,
                totalRows: response.total,
                loading: false,
                showSearch: response.data.length > 0
            });
            document.getElementById("pEnproceso").innerHTML = "En Proceso - " + response.en_proceso
            document.getElementById("pCompletado").innerHTML = "Completado - " + response.completados
            document.getElementById("pAprobados").innerHTML = "Aprobado - " + response.aprobados

            toast.success(response.message, {
                position: "top-right",
                autoClose: 5000,
                hideProgressBar: false,
                closeOnClick: true,
                pauseOnHover: true,
                draggable: true
            });
        }
        window.jQuery(".sc-kAzzGY").remove()
    }

    handleRedirectUrlClick(ev, url) {
        window.location.href = url;
    }
  
    handlePageChange = async page => {
        const { perPage } = this.state;
        this.setState({ loading: true });
        const response = await axios.get(Config[0].url + `api/prescripcion/per-page/${page}/${perPage}/${this.state.type_search}`, {})
        const json = await response.data;

        this.setState({
            loading: false,
            data: json.data,
        });
    };

    handlePerRowsChange = async (perPage, page) => {
        this.setState({ loading: true });

        const response = await axios.get(Config[0].url + `api/prescripcion/per-page/${page}/${perPage}/${this.state.type_search}`, {})
        const json = await response.data;

        this.setState({
            loading: false,
            data: json.data,
            perPage,
        });
    };
    
    async hanldeSearchLicencias(event, type_search) {

        const { perPage } = this.state;
        this.setState({ loading: true });

        const response = await this.fetch.axiosAsyncGet(`api/prescripcion/per-page/1/${perPage}/${type_search}`);
        if (response !== null && response.status === true) {
            this.setState({
                data: response.data,
                totalRows: response.total,
                loading: false,
                type_search: type_search
            });

            toast.success(response.message, {
                position: "top-right",
                autoClose: 5000,
                hideProgressBar: false,
                closeOnClick: true,
                pauseOnHover: true,
                draggable: true
            });
        }
    }

    handleSubmitSearchForm(event) {
        event.preventDefault()
        const form = new FormData(event.target);
        var self = this
        const { perPage } = this.state;
        self.setState({ loading: true });

        let input = window.jQuery(event.target).find('input').val()
        
        if (input.length > 0) {
            this.fetch.fetchPost(form, `api/prescripcion/search`).then(res => {

                if (res !== undefined && res.status === true) {

                    self.setState({
                        loading: false,
                        data: res.data,
                        perPage,
                    });
                }
             })
        } else
            window.location.reload();
        }

// detail natural
    render() {
        const { loading, data, totalRows } = this.state
        const breadcrumbs = [
            {
                title: Links[0].title,
                url: Links[0].url
            },
            {
                title: Links[3].title,
                url: Links[3].url
            }
        ];
        
        return (
            <div id="services" className="paddingTop30" >

                {/* Breadcrumb Area Start */}
                <TitlePage titlePage= {this.titlePage} breadcrumbs={breadcrumbs} position={'left'} />
                {/* Breadcrumb Area End */}
                <div className="container features">

                    {/* Google Maps & Contact Info Area Start */}
                    <section className="panel-menu-info">
                        <div className="panel-menu-info-content">
                            <div className="row">
                                <div className="col-4 col-md-2 col-lg-2">
                                    <div className="single-contact-info pointer" onClick={e => this.hanldeSearchLicencias(e, 1)}>
                                        <i className="fa fa-cog" aria-hidden="true"></i>
                                        <p id="pEnproceso">0</p>
                                    </div>
                                </div>
                                <div className="col-4 col-md-2 col-lg-2">
                                    <div className="single-contact-info pointer" onClick={e => this.hanldeSearchLicencias(e, 2)}>
                                        <i className="fa fa-file-text-o" aria-hidden="true"></i>
                                        <p id="pCompletado">Completado - 0</p>
                                    </div>
                                </div>
                                <div className="col-4 col-md-2 col-lg-2">
                                    <div className="single-contact-info pointer" onClick={e => this.hanldeSearchLicencias(e, 3)}>
                                        <i className="fa fa-check" aria-hidden="true"></i>
                                        <p id="pAprobados">0</p>
                                    </div>
                                </div>
                                <div className="col-4 col-md-2 col-lg-2">
                                    <div className="single-contact-info">
                                    </div>
                                </div>
                                <div className="col-4 col-md-2 col-lg-2">
                                    <div className="single-contact-info pointer" onClick={e => this.handleRedirectUrlClick(e, Links[8].url)}>
                                        <i className="fa fa-user-o" aria-hidden="true"></i>
                                        <p>Mi Cuenta</p>
                                    </div>
                                </div>
                                <div className="col-4 col-md-2 col-lg-2">
                                    <div className="single-contact-info pointer" onClick={e => this.handleRedirectUrlClick(e, Links[11].url)}>
                                        <i className="fa fa-file-o" aria-hidden="true"></i>
                                        <p>Nueva Prescripcion</p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </section>
            {/* Breadcrumb Area End */}
                {/* Google Maps & Contact Info Area Start */}
                
               {
                        this.state.showSearch ?
                            <form action="" className="contact__form center-login" name="formSearchDataTable" id="formSearchDataTable"
                                method="post" noValidate onSubmit={this.handleSubmitSearchForm} >
                                <div className="row" style={{ textAlign: 'right', marginRight: '0px', marginLeft: '0px' }}>
                                    <div className="col-12 col-sm-12 col-md-6 col-lg-6 ">
                                    </div>
                                    <div className="col-12 col-sm-12 col-md-6 col-lg-6 ">
                                        <div className="input-group mb-3" style={{ marginBottom: '0rem !important' }}>
                                            <div className="input-group-prepend">
                                                <select className="form-control" name="type" required data-parsley-required="true" >
                                                    <option key={0} value="NUMERO">Número de Orden</option>
                                                    <option key={1} value="FUR">Número de FUR</option>
                                                </select>
                                            </div>
                                            <input type="text" name="search" id="search" className="form-control" placeholder="*" aria-label="Username" aria-describedby="basic-addon1" />
                                            <div className="input-group-append">
                                                <button className="btn btn-outline-secondary btn-dark" type="submit" data-toggle="tooltip" data-placement="top"
                                                    title="Buscar"><i className="fa fa-search" aria-hidden="true"></i></button>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </form>
                            : ""
               }                   
                 <DataTable
                        title={this.titlePage}
                        columns={columns}
                        data={data}
                        progressPending={loading}
                        pagination
                        paginationServer
                        paginationTotalRows={totalRows}
                        onChangeRowsPerPage={this.handlePerRowsChange}
                        onChangePage={this.handlePageChange}
                        //customTheme={rowTheme}
                        noDataComponent={Texto.there_are_no_records_to_display}
                        //striped = {true}
                        //show_filter = {true}
                        pointerOnHover = {true}
                       // highlightOnHover = {true}
                    />
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

export default Prescripcion;  
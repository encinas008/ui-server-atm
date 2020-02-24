import React, { Component } from 'react';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import axios from 'axios';
import DataTable from 'react-data-table-component';
import styled from 'styled-components';  //styled for data table
import { Link } from 'react-router-dom';
import Texto from '../../data/es';
import Links from '../../data/link';
import Config from '../../data/config';
import Constant from '../../data/constant';
//import Es from '../../data/es';
import Fetch from '../../components/utils/Fetch';
import TitlePage from '../../components/utils/TitlePage';
import AuthService from '../../components/Usuario/AuthService';
import ModalPdf from '../utils/ModalPdf';
import ModalDetalle from '../utils/ModalDetalle';

//var HtmlToReactParser = require('html-to-react').Parser  //https://www.npmjs.com/package/html-to-react
//var htmlInput = '<div><Link to="#" title="Test" >Test</Link></div>';
//var htmlToReactParser = new HtmlToReactParser();
//var reactElement = htmlToReactParser.parse(htmlInput);

const columns = [
    {
        name: Texto.nombre,
        selector: 'Nombre',   //npm uninstall <moduleName> --save 
        sortable: true,
        grow: 1,
        hide: 'sm',
    },
    {
        name: Texto.actividad_economica,
        selector: 'actividad_economica',
        sortable: true,
        grow: 1,
        hide: 'md',
    },
    {
        name: Texto.numero_orden,
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
            {row.code_estado === Constant[0].estado.en_proceso ? <span title={row.code_estado}><i className="fa fa-cog" aria-hidden="true" ></i></span> : ""}
            {row.code_estado === Constant[0].estado.completado ? <span title={row.code_estado}><i className="fa fa-file-text-o" aria-hidden="true"></i></span> : ""}
            {row.code_estado === Constant[0].estado.aprobado ? <span title={row.code_estado}><i className="fa fa-check" aria-hidden="true"></i></span> : ""}
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

            {row.permissions.includes(Constant[0].permission.update) && row.code_estado !== Constant[0].estado.aprobado ?
                <>
                    {/* 
                <div className="btn-group">
                    <button type="button" className="btn btn-info dropdown-toggle button-link" data-toggle="dropdown"
                        aria-haspopup="true" aria-expanded="false" >
                        <i className="fa fa-pencil-square-o" aria-hidden="true"></i>
                    </button>
                    <div className="dropdown-menu">
                        <Link to={{ pathname: Links[6].url + '?edit=aec&token=' + row.token + "&num=" + row.numero }} className='dropdown-item' >Actividad Economica y Contribuyente</Link>

                        {row.contribuyente === 'NATURAL' ?
                            <Link to={{ pathname: Links[6].url + '?edit=sol&token=' + row.token + "&num=" + row.numero }} className='dropdown-item' >Contribuyente</Link>
                            :
                            <Link to={{ pathname: Links[6].url + '?edit=pjrl&token=' + row.token + "&num=" + row.numero }} className='dropdown-item' >Persona Juridica/Representante Legal</Link>
                        }
                        <Link to={{ pathname: Links[6].url + '?edit=ds&token=' + row.token + "&num=" + row.numero }} className='dropdown-item' >Domicilio Contribuyente</Link>
                        <Link to={{ pathname: Links[6].url + '?edit=dae&token=' + row.token + "&num=" + row.numero }} className='dropdown-item' >Domicilio Actividad Económica</Link>
                        <Link to={'#'} className='dropdown-item' onClick={() => handleShowClick(row, true)} >Confirmar Mis Datos</Link>

                        <Link to={{ pathname: Links[6].url + '?edit=preview&token=' + row.token + "&num=" + row.numero }} className='dropdown-item' >Vista Previa</Link>
                    </div>
                </div>
                */}
                    <Link to="#" onClick={() => handleOpenEditClick(row)} style={{ fontSize: '20px', marginRight: '10px' }} title={`Edición de la Licencia de Actividad Económica - ` + row.token}  >
                        <i className="fa fa-pencil-square-o" aria-hidden="true"></i>
                    </Link>
                </>
                : ""}

            {(row.code_estado === Constant[0].estado.completado)
                && row.permissions.includes(Constant[0].permission.aprobar) ?
                <Link to="#" onClick={() => handleCheckClick(row)} style={{ fontSize: '20px', marginRight: '10px' }} title="Aprobar"  >
                    <i className="fa fa-lock" aria-hidden="true"></i>
                </Link> : ""
            }

            {row.code_estado === Constant[0].estado.aprobado && row.permissions.includes(Constant[0].permission.reaperturar) ?
                <Link to="#" onClick={() => handleReaperturarClick(row)} style={{ fontSize: '20px', marginRight: '10px' }} title="Reaperturar" >
                    <i className="fa fa-unlock-alt" aria-hidden="true"></i>
                </Link> : ""
            }

            {/* 
            <Link to="#" onClick={() => handleShowClick(row, false)} style={{ fontSize: '20px', marginRight: '10px' }}
                title={`Licencia de la Actividad Económica: ${row.actividad_economica}`} >
                <i className="fa fa-folder-open-o" aria-hidden="true"></i>
            </Link>
            */}

            {(row.code_estado === Constant[0].estado.aprobado) ?
                <Link to="#" onClick={() => handleDownloadPdfClick(row)} style={{ fontSize: '20px', marginRight: '10px' }}
                    title={`Licencia de la Actividad Económica: ${row.actividad_economica}`} >
                    <i className="fa fa-file-pdf-o" aria-hidden="true"></i>
                </Link> : ""
            }

            {row.permissions.includes(Constant[0].permission.update) && row.code_estado !== Constant[0].estado.aprobado ?
                <Link to="#" onClick={() => handleDeleteClick(row)} style={{ fontSize: '22px', marginRight: '10px' }}
                    title={`Eliminar Licencia de ${row.actividad_economica}`} >
                    <i className="fa fa-trash-o" aria-hidden="true"></i>
                </Link>
                : ""}
        </div>,
        ignoreRowClick: true,
        allowOverflow: true,
        button: true,
    }
];

const handleDeleteClick = (row) => {

    let dj = _declaracion_jurada;
    dj.setState({ loading: true });

    window.deleteBootbox(Texto.numero_orden_perderan_datos.replace("%s", row.numero), function (result) {
        if (result === true) {
            const aprobar_lic = static_fetch.fetchGet(`api/licencia-actividad-economica/delete/${row.token}`);
            aprobar_lic.then(res => {
                if (res !== undefined && res.status === true) {

                    const response = static_fetch.fetchGet(`api/declaraciones-juradas/per-page/1/${dj.state.perPage}/${dj.state.type_search}`)
                    response.then(res => {
                        if (res !== undefined && res.status === true) {
                            dj.setState({
                                data: res.data,
                                totalRows: res.total,
                                loading: false,
                                showSearch: res.data.length > 0
                            });
                        }
                    })
                    static_fetch.toast.success(res.message, {
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
    })
};

const handleDownloadPdfClick = (row) => {
    modal_pdf.showPdf(`${Config[0].url}report/licencia-actividad-economica/${row.token}/?auth=${_auth.getToken()}`, row.actividad_economica, row.token)
}

const handleCheckClick = (row) => {

    const aprobar_lic = static_fetch.fetchGet(`api/declaracione-jurada/check/${row.token}`);
    aprobar_lic.then(res => {
        if (res !== undefined && res.status === true) {
            static_fetch.toast.success(res.message, {
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

const handleReaperturarClick = (row) => {
    const reaperturar_lic = static_fetch.fetchGet(`api/licencia-actividad-economica/uncheck/${row.token}`);
    reaperturar_lic.then(res => {
        if (res !== undefined && res.status === true) {
            static_fetch.toast.success(res.message, {
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
// su estasdo de cada formulario !!!!!!!
const handleOpenEditClick = (row) => {

    const reaperturar_lic = static_fetch.fetchGet(`api/licencia-actividad-economica/get-estado-datos/${row.token}`);
    reaperturar_lic.then(res => {
        if (res !== undefined && res.status === true) {
            window.editLicenciaBootbox(Links[6].url, row.contribuyente, row.token, row.numero,
                res.is_complete_data_contribuyente ? true : false, res.is_complete_data_domicilio ? true : false,
                res.is_complete_data_domicilio_actividad_economica ? true : false,
            );
        } else {
            window.editLicenciaBootbox(Links[6].url, row.contribuyente, row.token, row.numero, false, false);
        }
    })
}

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
var _declaracion_jurada = null
class DeclaracionJurada extends Component {

    constructor(props) {
        super(props);
        var static_fetch = null;
        var modal_pdf = null
        var modal_detalle = null
        var _auth = null
        var _declaracion_jurada = null
        this.constant = Constant[0];
        this.fetch = new Fetch();
        this.fetch.setToast(toast);
        this.Auth = new AuthService();
        _auth = this.Auth

        modal_detalle = new ModalDetalle()
        modal_detalle.setToast(toast)

        modal_pdf = new ModalPdf()
        modal_pdf.setToast(toast)
        this.titlePage = Texto.licencia_actividad_economica

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

        _declaracion_jurada = this
    }

    async componentDidMount() {

        if (this.Auth.loggedIn()) {
            const { perPage } = this.state;
            this.setState({ loading: true });
            const response = await this.fetch.axiosAsyncGet(`api/declaraciones-juradas/per-page/1/${perPage}/${this.state.type_search}`);
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
        }
        else
            this.props.history.replace(Links[4].url)

        window.jQuery(".sc-kAzzGY").remove()  //pertenece al datatable
    }

    handlePageChange = async page => {
        const { perPage } = this.state;
        this.setState({ loading: true });
        const response = await axios.get(Config[0].url + `api/declaraciones-juradas/per-page/${page}/${perPage}/${this.state.type_search}?auth=${this.constant.token}`, {})
        const json = await response.data;

        this.setState({
            loading: false,
            data: json.data,
        });
    };

    handlePerRowsChange = async (perPage, page) => {
        this.setState({ loading: true });

        const response = await axios.get(Config[0].url + `api/declaraciones-juradas/per-page/${page}/${perPage}/${this.state.type_search}?auth=${this.constant.token}`, {})
        const json = await response.data;

        this.setState({
            loading: false,
            data: json.data,
            perPage,
        });
    };

    handleRedirectUrlClick(ev, url) {
        window.location.href = url;
    }

    async hanldeSearchLicencias(event, type_search) {
        debugger
        const { perPage } = this.state;
        this.setState({ loading: true });

        const response = await this.fetch.axiosAsyncGet(`api/declaraciones-juradas/per-page/1/${perPage}/${type_search}`);
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
            this.fetch.fetchPost(form, `api/licencia-funcionamiento/search`).then(res => {

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


    render() {
        const { loading, data, totalRows } = this.state

        const breadcrumbs = [
            {
                title: Links[0].title,
                url: Links[0].url
            },
            {
                title: Links[1].title,
                url: Links[1].url
            }
        ];
        return (
            <div id="services" className="paddingTop30" >

                {/* Breadcrumb Area Start */}
                <TitlePage titlePage={this.titlePage} breadcrumbs={breadcrumbs} position={'left'} />
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
                                    <div className="single-contact-info pointer" onClick={e => this.handleRedirectUrlClick(e, Links[2].url)}>
                                        <i className="fa fa-file-o" aria-hidden="true"></i>
                                        <p>Nueva Licencia</p>
                                    </div>
                                    <div className="col-4 col-md-2 col-lg-2">
                                        <div className="single-contact-info pointer">
                                            <i className="fa fa-user-o" aria-hidden="true"></i>
                                            <p>Mi Cuenta</p>
                                        </div>
                                    </div>
                                    <div className="col-4 col-md-2 col-lg-2">
                                        <div className="single-contact-info pointer" onClick={e => this.handleRedirectUrlClick(e, Links[2].url)}>
                                            <i className="fa fa-file-o" aria-hidden="true"></i>
                                            <p>Nueva Licencia</p>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </section>
                    {/* Google Maps & Contact Info Area End */}
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
                                                    <option key={0} value="NUMERO">Nombre Contribuyente</option>
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
                        customTheme={rowTheme}
                        noDataComponent={Texto.there_are_no_records_to_display}
                    //paginationComponentOptions={ 'rowsPerPageText'= 'Rows per page:', 'rangeSeparatorText'= 'of' }
                    //selectableRows
                    />
                </div>

                <ModalDetalle />
                <ModalPdf />

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

export default DeclaracionJurada;
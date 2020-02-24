import React from 'react';
import PropTypes from 'prop-types';
import { Link } from 'react-router-dom';

//const TitlePage = ({titlePage, url, title}) => {
const TitlePage = ({titlePage, breadcrumbs, position}) => {
    let text_left = "", content_justify
    switch(position){
        case 'center':{
            text_left = 'text-center'
            content_justify = 'justify-content-center'
            break
        }
        case 'left':{
            text_left = 'text-left'
            content_justify = 'justify-content-left'
            break
        }
        default:
            text_left = 'text-left'
            content_justify = 'justify-content-left'
            break
    }
    return (<div className="breadcrumb-area bg-img bg-overlay jarallax" >
        <div className="container h-100">
            <div className="row h-100 align-items-center">
                <div className="col-12">
                    {/* "breadcrumb-content text-left" */}
                    <div className={`breadcrumb-content ${text_left}` } >
                        <h2 className="page-title">{titlePage}</h2>
                        <nav aria-label="breadcrumb">
                            {/*  "breadcrumb justify-content-left" */}
                            <ol className={`breadcrumb  ${content_justify}` } >
                                {
                                    breadcrumbs && breadcrumbs.map( 
                                        (breadcrumb, key) =>  (
                                            { ...key !== (breadcrumbs.length-1) 
                                                ?
                                                <li key={key} className="breadcrumb-item">
                                                    <Link to={{
                                                            pathname: breadcrumb.url,
                                                            //search: "?sort=name",
                                                            //hash: "#the-hash",
                                                            //state: { fromDashboard: true }
                                                        }} className={`breadcrumb-item ${key === (breadcrumbs.length-1) ? ' active ' : ''}`} 
                                                           style={{marginRight: '0rem'}}>{breadcrumb.title}
                                                        </Link>
                                                </li>
                                                :
                                                <li key={key} aria-current="page" className="breadcrumb-item active">
                                                    {breadcrumb.title}
                                                </li>
                                            }
                                        )
                                    )
                                }
                            </ol>
                        </nav>
                    </div>
                </div>
            </div>
        </div>
    </div>)
};

TitlePage.prototype={
    titlePage: PropTypes.string.isRequired,
    url: PropTypes.string.isRequired,
    title: PropTypes.string.isRequired
}

export default TitlePage;
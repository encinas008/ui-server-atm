//import React from 'react';
import React, { Component} from 'react';

import ShowCase from './../../components/Home/ShowCase';
import Features from  './../../components/Home/Features';
import Services from './../../components/Home/Services';
//import Portfolio from './../../components/Home/Portfolio';
import Contact from './../../components/Home/Contact';

import links from '../../data/link';

class Home extends Component{
    render(){
        return (
            <>
                <ShowCase />
                <Features links={links}/>
                <Services />
                <Contact />
            </>
        );
    }
}

export default Home;
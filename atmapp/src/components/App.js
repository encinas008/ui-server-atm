import React, { Component } from 'react';
import PropTypes from 'prop-types';
// Components
import Header from './../components/Global/Header';
import Content from './../components/Global/Content';
import Footer from './../components/Global/Footer';

import WithAuth from './../components/Usuario/WithAuth';

import Menu from '../data/menu';

class App extends Component {
    static propTypes = {
        children: PropTypes.object.isRequired
    };

    render() {
        const {children} = this.props;
        return (
            <div className="">
                <Header title="ATM" menu={Menu} user={this.props.user}></Header>
                <Content body={children} />
                <Footer></Footer>
            </div>
        );
    }
}

export default WithAuth(App);
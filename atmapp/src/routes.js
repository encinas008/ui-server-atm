//Dependecies
import React from 'react';
import {Route, Switch} from 'react-router-dom';

//Components
import App from './components/App';
import DeclacionJurada from './components/DeclaracionJurada';
import DeclaracionJuradaCreate from './components/DeclaracionJurada/DeclaracionJuradaCreate';
import DeclaracionJuradaEdit from './components/DeclaracionJurada/DeclaracionJuradaEdit';
import Prescripcion from './components/Prescripcion';
import PrescripcionEdit from './components/Prescripcion/PrescripcionEdit';
import Home from './components/Home';
import Page404 from './components/Page404';
import Login from './components/Usuario/Login';
import RegisterUser from './components/Usuario/RegisterUser';
import ConfirmUser from './components/Usuario/ConfirmUser';
import Perfil from './components/Usuario/Perfil';
import RegisterPrescripcion from './components/Prescripcion/RegisterPrescripcion';
import ForgotPassword from './components/Usuario/ForgotPassword'
import ChangePassword from './components/Usuario/ChangePassword'

const AppRoutes = () =>
    <App>
        <Switch>
            <Route exact path="/licencia-actividad-economica" component={DeclacionJurada} />
            <Route exact path="/licencia-actividad-economica-create" component={DeclaracionJuradaCreate} />
            <Route exact path="/licencia-actividad-economica-edit" component={DeclaracionJuradaEdit} />
            <Route exact path="/prescripcion-registrar" component={RegisterPrescripcion} />
            <Route exact path="/prescripcion" component={Prescripcion} />
            <Route exact path="/prescripcion-edit" component={PrescripcionEdit} />
            <Route exact path="/login" component={Login} />
            <Route exact path="/usuario-create" component={RegisterUser} />
            <Route exact path="/usuario-confirmar-cuenta" component={ConfirmUser} />
            <Route exact path="/usuario-perfil" component={Perfil} />
            <Route exact path="/" component={Home} />
            <Route exact path="/page-404" component={Page404} />
            <Route exact path="/recuperar-contrasenia" component={ForgotPassword} />
            <Route exact path="/change-contrasenia" component={ChangePassword} />
            
            <Route component={Page404} />
        </Switch>
    </App>;

export default AppRoutes;
import React from 'react';
import AuthService from './AuthService';

import Links from '../../data/link';

export default function WithAuth(AuthComponent){
    const Auth = new AuthService();
    return class AuthWrapped extends React.Component{
        constructor(){
            super();
            this.state = {
                user:null
            }
        }

        componentWillMount(){
            if(!Auth.loggedIn() && this.props.history !== undefined){
                this.props.history.replace(Links[4].url);
            }else{
                try{
                    const profile = Auth.getProfile();
                    this.setState({
                        user:profile
                    })
                }catch(err){
                    Auth.logout();
                    if(this.props.history !== undefined)
                        this.props.history.replace(Links[4].url);
                }
            }
        }

        render(){
            return(<AuthComponent 
                {...this.props}
                {...this.state} />
            )
        }
    }
}
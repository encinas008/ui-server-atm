import Config from '../../data/config';
import axios from 'axios';
import AuthService from '../../components/Usuario/AuthService';

import Links from '../../data/link';

export default class Fetch {
    // Initializing important variables
    constructor(domain) {
        this.domain = domain || Config[0].url // API server domain
        this.fetch = this.fetch.bind(this) // React binding stuff

        this.Auth = new AuthService();
        this.toast = null;

    }

    setToast(toast) {
        this.toast = toast;
    }

    async axiosAsyncGet(url) {
        try {
            const response = await axios.get(this.domain + `${url}?auth=${this.Auth.getToken()}`, {
            })
            const json = await response.data;
            if (json.status === true) {
                return json;
            }else{
                this.toast.warn(response.message, {
                    position: "top-right",
                    autoClose: 5000,
                    hideProgressBar: false,
                    closeOnClick: true,
                    pauseOnHover: true,
                    draggable: true
                });
            }
        } catch (error) {
            var message = error.message;
            if(Boolean(error.response) && Boolean(error.response.data))
                message += ", "+error.response.data.message

                this.toast.error(message, {
                position: "top-right",
                autoClose: 5000,
                hideProgressBar: false,
                closeOnClick: true,
                pauseOnHover: true,
                draggable: true
            });
        }
        return null;
    }

    fetchGet(url) {

        //aqui ver cuales han de llevar el token
        var self = this;
        try {
            return this.fetch(`${this.domain}${url}?auth=${this.Auth.getToken()}`, {
                method: 'GET',
            }).then(res => {
                if(res.status === true){
                    return Promise.resolve(res);
                }else{
                    self.toast.warn(res.message, {
                        position: "top-right",
                        autoClose: 5000,
                        hideProgressBar: false,
                        closeOnClick: true,
                        pauseOnHover: true,
                        draggable: true
                    });
                }
            }).catch(error =>{
                //Unexpected end of JSON input
                var message = ""
                if(window.is_json(error) && error.hasOwnProperty('response')){
                    message = error.response.statusText;
                }else{
                    if(window.is_json(error.message))
                        message = self.jsonToString(error.message)
                    else
                        if(error.message.indexOf('Unexpected end of JSON') >= 0){
                            //window.redirect(Links[9].url);  //redireccionamos al 404
                        }else
                            message = error.message
                }

                if(self.toast !== null && self.toast !== undefined){
                    self.toast.error(message, {
                        position: "top-right",
                        autoClose: 5000,
                        hideProgressBar: false,
                        closeOnClick: true,
                        pauseOnHover: true,
                        draggable: true
                    });
                }else
                    console.error(message);
            });
        } catch (error) {
            var message = error.message;
            if(Boolean(error.response) && Boolean(error.response.data))
                message += ", "+error.response.data.message

                this.toast.error(message, {
                position: "top-right",
                autoClose: 5000,
                hideProgressBar: false,
                closeOnClick: true,
                pauseOnHover: true,
                draggable: true
            });
        }

        return null;
    }

    fetchGetExternal(url) {

        var self = this;
        try {
            return this.fetch(url, {
                method: 'GET',
            }).then(res => {
                return Promise.resolve(res);
            }).catch(error =>{
                self.toast.error(JSON.stringify(error.message).replace('{', '').replace('}', ''), {
                    position: "top-right",
                    autoClose: 5000,
                    hideProgressBar: false,
                    closeOnClick: true,
                    pauseOnHover: true,
                    draggable: true
                });
            });
        } catch (error) {
            var message = error.message;
            if(Boolean(error.response) && Boolean(error.response.data))
                message += ", "+error.response.data.message

                this.toast.error(message, {
                position: "top-right",
                autoClose: 5000,
                hideProgressBar: false,
                closeOnClick: true,
                pauseOnHover: true,
                draggable: true
            });
        }

        return null;
    }

    fetchPost(form, url) {

        if(form.get('usuario[confirm_password]') !== null){
            form.delete('usuario[confirm_password]');
        }

        form.set('auth', this.Auth.getToken());

        //aqui ver cuales han de llevar el token
        var self = this;

        return this.fetch(`${this.domain}`+url, {
            method: 'POST',
            body: form,
        }).then(res => {
            if(res.status === true){
                return Promise.resolve(res);
            }else{
                var message = ""
                if(window.is_json(res.message))
                    message = self.jsonToString(res.message)
                else
                    if(res.message.indexOf('\n'))
                        message = '* '+res.message.replace(/\n/g, ' * ')
                    else
                        message = res.message
                self.toast.warn(message, {
                    position: "top-right",
                    autoClose: 5000,
                    hideProgressBar: false,
                    closeOnClick: true,
                    pauseOnHover: true,
                    draggable: true
                });
            }
        }).catch(error =>{
            self.toast.error(JSON.stringify(error.message).replace('{', '').replace('}', ''), {
                position: "top-right",
                autoClose: 5000,
                hideProgressBar: false,
                closeOnClick: true,
                pauseOnHover: true,
                draggable: true
            });
        });
    }

    fetch(url, options) {
        return fetch(url, {
            ...options
        }).then(this._checkStatus)
        .then(response => response.json())
    }

    _checkStatus(response) {
        // raises an error in case response status is not a success
        if (response.status >= 200 && response.status < 300) { // Success status lies between 200 to 300
            return response
        } else {
            var error = new Error(response.statusText)
            error.response = response
            throw error
        }
    }

    jsonToString(json){
        let message = JSON.stringify(json)
        return message.replace(/":"/, ':').replace(/{"/, '').replace(/"}/, '')
    }
}

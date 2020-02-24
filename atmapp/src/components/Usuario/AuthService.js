import decode from 'jwt-decode';
import Config from '../../data/config';

export default class AuthService {

    constructor(domain) {
        this.domain = domain || Config[0].url 
        this.fetch = this.fetch.bind(this) // React binding stuff
        this.login = this.login.bind(this)
        this.getProfile = this.getProfile.bind(this)
        this.token_auth = Config[3].token
    }

    login(form) {
        return this.fetch(`${this.domain}api/usuario/login`, {
            method: 'POST',
            body: form,
            /*body: JSON.stringify({
                username,
                password
            })*/
        }).then(res => {
            if(res.status === true && res.token !== null){
                this.setToken(res.token) // Setting the token in localStorage
                //return Promise.resolve(res);
            }else{
                //return Promise.reject(res);
            }
            return Promise.resolve(res);
        }).catch(error =>{
            return Promise.reject(error);
        });
    }

    loggedIn() {
        const token = this.getToken() // GEtting token from localstorage
        return !!token && !!this.isTokenExpired(token) // handwaiving here
    }

    isTokenExpired(token) {
        try {
            const decoded = decode(token);
            var timestamp = Math.floor(new Date().getTime() / 1000)  //la fecha en formato unix

            if (decoded.time > timestamp) { // Checking if token is expired. N
                return true;
            } else{ //session expirada
                this.logout()
                return false
            }
                
        }
        catch (err) {
            return false;
        }
    }

    setToken(idToken) {
        localStorage.setItem(this.token_auth , idToken)
    }

    getToken() {
        return localStorage.getItem(this.token_auth )
    }

    logout() {
        localStorage.removeItem(this.token_auth );
    }

    getProfile() {
        return decode(this.getToken());
    }


    fetch(url, options) {
        const headers = {
            'Accept': 'application/json',
            'Content-Type': 'application/json'
        }

        // Setting Authorization header
        // Authorization: Bearer xxxxxxx.xxxxxxxx.xxxxxx
        if (this.loggedIn()) {
            //headers['Authorization'] = 'Bearer ' + this.getToken()
            headers['Authorization'] = this.getToken()
        }

        if(url.indexOf('login') >= 0 ){
            return fetch(url, {
                ...options
            }).then(this._checkStatus)
            .then(response => response.json())
        }else{
            return fetch(url, {
                headers,
                ...options
            }).then(this._checkStatus)
            .then(response => response.json())
        }
    }

    _checkStatus(response) {
        if (response.status >= 200 && response.status < 300) { // Success status lies between 200 to 300
            return response
        } else {
            let error = new Error(response.statusText)
            error.response = response
            throw error
        }
    }
}

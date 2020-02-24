export default class DeclaracionJurada {
    constructor() {
        this.token_dj = ""
        this.fur = ""
        this.contribuyente = ""
        this.actividad_economica = ""
        this.persona = ""
        this.derecho_admision = 0
    }

    setTokenDJ(token_dj) {
        this.token_dj = token_dj
    }

    getTokenDJ() {
        return this.token_dj
    }

    setFur(fur){
        this.fur = fur
    }

    getFur(){
        return this.fur
    }

    setActividadEconomica(act_eco){
        this.actividad_economica = act_eco
    }

    getActividadEconomica(){
        return this.actividad_economica
    }

    setContribuyente(contribuyente){
        this.contribuyente = contribuyente
    }

    getContribuyente(){
        return this.contribuyente
    }

    setPersona(persona){
        this.persona = persona
    }

    getPersona(){
        return this.persona
    }

    setDerechoAdmision(derecho_admision){
        this.derecho_admision = derecho_admision
    }

    getDerechoAdmision(){
        return this.derecho_admision
    }
}

export default [
    {
        title: 'ApiRestServer',
        url: 'http://localhost/restServerAtm/'
    },
    {
        title: 'Año minimo fecha nacimiento',
        anio:  (new Date()).setFullYear( (new Date()).getFullYear() - 18 )
    },
    {
        title: 'Client Url',
        url: 'http://localhost:3000'
    },
    {
        title: 'Token Authorization',
        token: 'token_auth'
    },
    {
        title: 'Format Date',
        format: 'dd-MM-yyyy'
    },
    {
        title: 'Format Date Moment',
        format_moment: 'DD-MM-YYYY'
    }
];
/*
//servidor
export default [
    {
        title: 'ApiRestServer',
        url: 'http://192.168.104.35/racha/restServerAtm/'
    }
];
*/
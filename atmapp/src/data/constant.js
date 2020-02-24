import Config from './config';
export default [
    {
        //title: 'Tipo Documento de Identifación',
        tipo: {
            ci: "CI",
            pasaporte: "CE"
        },
        //title: 'Estado Civil',
        estado_civil: {
            casado: "2",
            soltero: "1",
        },
        //title: 'Tipo Contribuyente',
        contribuyente: {
            natural: "NATURAL",
            juridico: "JURIDICA",
        },
        //title: 'Ci Expedido',
        ci_expedido: {
            cbba: { new: 'CB', old: 'CBA' },
            lapaz: { new: 'LP', old: 'LPZ' },
            santacruz: { new: 'SC', old: 'SCZ' },
            oruro: { new: 'OR', old: 'ORU' },
            potosi: { new: 'PO', old: 'POT' },
            pando: { new: 'PD', old: 'PAD' },
            beni: { new: 'BN', old: 'BEN' },
            tarija: { new: 'TJ', old: 'TAJ' },
            sucre: { new: 'CH', old: 'CHU' }
        },
        //title: 'Objecto Tributario',
        tributario: {
            inmueble: "1",
            vehiculo: "2",
            patente_funcionamiento: "3",
            patente_publicidad_exterior: "4",
            patente_unica_municipal: "5",

        },
         //title: 'Estado',
        estado: {  
            en_proceso: "EN_PROCESO",
            aprobado: "APROBADO",
            reaperturado: "REAPERTURADO",
            completado: "COMPLETADO",
            cancelado: "CANCELADO",

        },  
        //title: 'permisos de usuario',  
        permission:{
            create: 'CREATE',
            update: 'UPDATE',
            delete: 'DELETE',
            reaperturar: 'REAPERTURAR',
            aprobar: 'APROBAR',
            delete: 'DELETE'
        },
        //title: 'Storage',
        token: localStorage.getItem(Config[3].token), //=== null ? undefined:  localStorage.getItem('token').substring(0, localStorage.getItem('token').indexOf("::") ),
        derecho_admision:{
            permanente: 1,  //'PERMANENTE'
            temporal: 2  //'TEMPORAL'
        }
    }
];

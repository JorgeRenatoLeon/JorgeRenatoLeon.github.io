$(document).ready(function () {

    var query = {
        "keyCode": "01a828fcc8d56f00ba6dddb73b0dd574610b7721e249127a69d57651d67d3694",
        "firstResult": 1,
        "maxResults": 2,
        "user": "jrleon@pucp.edu.pe",
        "from": "14/05/2022 02:33:56 PM",
        "to": "14/05/2022 02:33:56 PM"
    }

    var url = "https://pucp.in/pucp-in-rest/"

    var dummyData = {
        responseCode: 200,
        list: [
            {
                "id": 1,
                "buildingCode": "01",
                "name": "FACULTAD DE CIENCIAS E INGENIERÍA",
                "image": "http://descubre.pucp.edu.pe/imagesv2/dep021/pabellon%20v%20telecomunicaciones%20informatica.jpg",
                "capacity": 70,
                "used": 50,
                "hours": "08:00 - 22:00"
            },
            {
                "id": 2,
                "buildingCode": "02",
                "name": "PABELLÓN C",
                "image": "http://descubre.pucp.edu.pe/imagesv2/dep021/pabellon%20v%20telecomunicaciones%20informatica.jpg",
                "capacity": 70,
                "used": 50,
                "hours": "08:00 - 22:00"
            },
            {
                "id": 3,
                "buildingCode": "03",
                "name": "PABELLÓN U: SECCIÓN INGENIERÍA MECÁNICA",
                "image": "http://descubre.pucp.edu.pe/imagesv2/dep021/pabellon%20v%20telecomunicaciones%20informatica.jpg",
                "capacity": 70,
                "used": 50,
                "hours": "08:00 - 22:00"
            },
            {
                "id": 4,
                "buildingCode": "04",
                "name": "PABELLÓN M: SECCIÓN INGENIERÍA DE MINAS",
                "image": "http://descubre.pucp.edu.pe/imagesv2/dep021/pabellon%20v%20telecomunicaciones%20informatica.jpg",
                "capacity": 70,
                "used": 50,
                "hours": "08:00 - 22:00"
            },
            {
                "id": 5,
                "buildingCode": "05",
                "name": "PABELLÓN V: SECCIÓN INGENIERÍA DE TELECOMUNICACIONES, SECCIÓN INGENIERÍA INFORMÁTICA, SECCIÓN INGENIERÍA ELECTRÓNICA",
                "image": "http://descubre.pucp.edu.pe/imagesv2/dep021/pabellon%20v%20telecomunicaciones%20informatica.jpg",
                "capacity": 70,
                "used": 50,
                "hours": "08:00 - 22:00"
            },
            {
                "id": 6,
                "buildingCode": "06",
                "name": "SECCIÓN INGENIERÍA INDUSTRIAL",
                "image": "http://descubre.pucp.edu.pe/imagesv2/dep021/pabellon%20v%20telecomunicaciones%20informatica.jpg",
                "capacity": 70,
                "used": 50,
                "hours": "08:00 - 22:00"
            },
            {
                "id": 7,
                "buildingCode": "07",
                "name": "PABELLÓN K: CETAM, INGENIERÍA MECATRÓNICA",
                "image": "http://descubre.pucp.edu.pe/imagesv2/dep021/pabellon%20v%20telecomunicaciones%20informatica.jpg",
                "capacity": 70,
                "used": 50,
                "hours": "08:00 - 22:00"
            },
            {
                "id": 8,
                "buildingCode": "08",
                "name": "INSTITUTO DE CORROSIÓN Y PROTECCIÓN",
                "image": "http://descubre.pucp.edu.pe/imagesv2/dep021/pabellon%20v%20telecomunicaciones%20informatica.jpg",
                "capacity": 70,
                "used": 50,
                "hours": "08:00 - 22:00"
            },
            {
                "id": 9,
                "buildingCode": "09",
                "name": "DEPARTAMENTO DE INGENIERÍA, SECCIÓN INGENIERÍA CIVIL, LABORATORIO DE ESTRUCTURAS ANTISÍSMICAS",
                "image": "http://descubre.pucp.edu.pe/imagesv2/dep021/pabellon%20v%20telecomunicaciones%20informatica.jpg",
                "capacity": 70,
                "used": 50,
                "hours": "08:00 - 22:00"
            },
            {
                "id": 10,
                "buildingCode": "10",
                "name": "DEPARTAMENTO ACADÉMICO DE CIENCIAS, SECCIÓN MATEMÁTICAS ",
                "image": "http://descubre.pucp.edu.pe/imagesv2/dep021/pabellon%20v%20telecomunicaciones%20informatica.jpg",
                "capacity": 70,
                "used": 50,
                "hours": "08:00 - 22:00"
            },
            {
                "id": 11,
                "buildingCode": "11",
                "name": "PABELLÓN F: SECCIÓN FÍSICA",
                "image": "http://descubre.pucp.edu.pe/imagesv2/dep021/pabellon%20v%20telecomunicaciones%20informatica.jpg",
                "capacity": 70,
                "used": 50,
                "hours": "08:00 - 22:00"
            },
            {
                "id": 12,
                "buildingCode": "12",
                "name": "PABELLÓN Q: SECCIÓN QUÍMICA",
                "image": "http://descubre.pucp.edu.pe/imagesv2/dep021/pabellon%20v%20telecomunicaciones%20informatica.jpg",
                "capacity": 70,
                "used": 50,
                "hours": "08:00 - 22:00"
            },
            {
                "id": 13,
                "buildingCode": "13",
                "name": "PABELLÓN P: CEPREPUC",
                "image": "http://descubre.pucp.edu.pe/imagesv2/dep021/pabellon%20v%20telecomunicaciones%20informatica.jpg",
                "capacity": 70,
                "used": 50,
                "hours": "08:00 - 22:00"
            },
            {
                "id": 14,
                "buildingCode": "14",
                "name": "FACULTAD DE CIENCIAS CONTABLES (EDIFICIO 1)",
                "image": "http://descubre.pucp.edu.pe/imagesv2/dep021/pabellon%20v%20telecomunicaciones%20informatica.jpg",
                "capacity": 70,
                "used": 50,
                "hours": "08:00 - 22:00"
            },
            {
                "id": 15,
                "buildingCode": "15",
                "name": "FACULTAD DE CIENCIAS CONTABLES (EDIFICIO 2)",
                "image": "http://descubre.pucp.edu.pe/imagesv2/dep021/pabellon%20v%20telecomunicaciones%20informatica.jpg",
                "capacity": 70,
                "used": 50,
                "hours": "08:00 - 22:00"
            },
            {
                "id": 16,
                "buildingCode": "15",
                "name": "FACULTAD DE CIENCIAS CONTABLES (EDIFICIO A)",
                "image": "http://descubre.pucp.edu.pe/imagesv2/dep021/pabellon%20v%20telecomunicaciones%20informatica.jpg",
                "capacity": 70,
                "used": 50,
                "hours": "08:00 - 22:00"
            },
            {
                "id": 17,
                "buildingCode": "16",
                "name": "PABELLÓN E: ESTUDIOS GENERALES CIENCIAS",
                "image": "http://descubre.pucp.edu.pe/imagesv2/dep021/pabellon%20v%20telecomunicaciones%20informatica.jpg",
                "capacity": 70,
                "used": 50,
                "hours": "08:00 - 22:00"
            },
            {
                "id": 18,
                "buildingCode": "17",
                "name": "PABELLÓN I: FACULTAD DE ARTE Y DISEÑO, DEPARTAMENTO ACADÉMICO DE ARTE Y DISEÑO, CIDE",
                "image": "http://descubre.pucp.edu.pe/imagesv2/dep021/pabellon%20v%20telecomunicaciones%20informatica.jpg",
                "capacity": 70,
                "used": 50,
                "hours": "08:00 - 22:00"
            },
            {
                "id": 19,
                "buildingCode": "18",
                "name": "PABELLÓN J: FACULTAD DE CIENCIAS SOCIALES",
                "image": "http://descubre.pucp.edu.pe/imagesv2/dep021/pabellon%20v%20telecomunicaciones%20informatica.jpg",
                "capacity": 70,
                "used": 50,
                "hours": "08:00 - 22:00"
            },
            {
                "id": 20,
                "buildingCode": "19",
                "name": "DIRECCIÓN DE TECNOLOGÍAS DE INFORMACIÓN (DTI), DEPARTAMENTO ACADÉMICO DE ECONOMÍA, DEPARTAMENTO ACADÉMICO DE CIENCIAS SOCIALES, CISEPA",
                "image": "http://descubre.pucp.edu.pe/imagesv2/dep021/pabellon%20v%20telecomunicaciones%20informatica.jpg",
                "capacity": 70,
                "used": 50,
                "hours": "08:00 - 22:00"
            },
            {
                "id": 21,
                "buildingCode": "20",
                "name": "AUDITORIO DE DERECHO",
                "image": "http://descubre.pucp.edu.pe/imagesv2/dep021/pabellon%20v%20telecomunicaciones%20informatica.jpg",
                "capacity": 70,
                "used": 50,
                "hours": "08:00 - 22:00"
            },
            {
                "id": 22,
                "buildingCode": "21",
                "name": "PABELLÓN D: FACULTAD DE DERECHO, DEPARTAMENTO ACADÉMICO DE DERECHO",
                "image": "http://descubre.pucp.edu.pe/imagesv2/dep021/pabellon%20v%20telecomunicaciones%20informatica.jpg",
                "capacity": 70,
                "used": 50,
                "hours": "08:00 - 22:00"
            },
            {
                "id": 23,
                "buildingCode": "22",
                "name": "AUDITORIO JUAN PABLO II",
                "image": "http://descubre.pucp.edu.pe/imagesv2/dep021/pabellon%20v%20telecomunicaciones%20informatica.jpg",
                "capacity": 70,
                "used": 50,
                "hours": "08:00 - 22:00"
            },
            {
                "id": 24,
                "buildingCode": "23",
                "name": "CENTRO DE ASESORÍA PASTORAL UNIVERSITARIA (CAPU)",
                "image": "http://descubre.pucp.edu.pe/imagesv2/dep021/pabellon%20v%20telecomunicaciones%20informatica.jpg",
                "capacity": 70,
                "used": 50,
                "hours": "08:00 - 22:00"
            },
            {
                "id": 25,
                "buildingCode": "24",
                "name": "EDIFICIO DINTILHAC",
                "image": "http://descubre.pucp.edu.pe/imagesv2/dep021/pabellon%20v%20telecomunicaciones%20informatica.jpg",
                "capacity": 70,
                "used": 50,
                "hours": "08:00 - 22:00"
            },
            {
                "id": 26,
                "buildingCode": "25",
                "name": "BIBLIOTECA CENTRAL",
                "image": "http://descubre.pucp.edu.pe/imagesv2/dep021/pabellon%20v%20telecomunicaciones%20informatica.jpg",
                "capacity": 70,
                "used": 50,
                "hours": "08:00 - 22:00"
            },
            {
                "id": 27,
                "buildingCode": "26",
                "name": "DEPARTAMENTO ACADÉMICO DE TEOLOGÍA",
                "image": "http://descubre.pucp.edu.pe/imagesv2/dep021/pabellon%20v%20telecomunicaciones%20informatica.jpg",
                "capacity": 70,
                "used": 50,
                "hours": "08:00 - 22:00"
            },
            {
                "id": 28,
                "buildingCode": "27",
                "name": "FACULTAD DE GESTIÓN Y ALTA DIRECCIÓN, DEPARTAMENTO DE CIENCIAS DE LA GESTIÓN",
                "image": "http://descubre.pucp.edu.pe/imagesv2/dep021/pabellon%20v%20telecomunicaciones%20informatica.jpg",
                "capacity": 70,
                "used": 50,
                "hours": "08:00 - 22:00"
            },
            {
                "id": 29,
                "buildingCode": "28",
                "name": "PABELLÓN Z",
                "image": "http://descubre.pucp.edu.pe/imagesv2/dep021/pabellon%20v%20telecomunicaciones%20informatica.jpg",
                "capacity": 70,
                "used": 50,
                "hours": "08:00 - 22:00"
            },
            {
                "id": 30,
                "buildingCode": "29",
                "name": "FACULTAD DE CIENCIAS Y ARTE DE LA COMUNICACIÓN",
                "image": "http://descubre.pucp.edu.pe/imagesv2/dep021/pabellon%20v%20telecomunicaciones%20informatica.jpg",
                "capacity": 70,
                "used": 50,
                "hours": "08:00 - 22:00"
            },
            {
                "id": 31,
                "buildingCode": "30",
                "name": "PABELLÓN S: FACULTAD DE PSICOLOGÍA, DEPARTAMENTO ACADÉMICO DE PSICOLOGÍA",
                "image": "http://descubre.pucp.edu.pe/imagesv2/dep021/pabellon%20v%20telecomunicaciones%20informatica.jpg",
                "capacity": 70,
                "used": 50,
                "hours": "08:00 - 22:00"
            },
            {
                "id": 32,
                "buildingCode": "31",
                "name": "DEPARTAMENTO ACADÉMICO DE HUMANIDADES (JEFATURA)",
                "image": "http://descubre.pucp.edu.pe/imagesv2/dep021/pabellon%20v%20telecomunicaciones%20informatica.jpg",
                "capacity": 70,
                "used": 50,
                "hours": "08:00 - 22:00"
            },
            {
                "id": 33,
                "buildingCode": "32",
                "name": "DEPARTAMENTO ACADÉMICO DE HUMANIDADES (OFICINAS)",
                "image": "http://descubre.pucp.edu.pe/imagesv2/dep021/pabellon%20v%20telecomunicaciones%20informatica.jpg",
                "capacity": 70,
                "used": 50,
                "hours": "08:00 - 22:00"
            },
            {
                "id": 34,
                "buildingCode": "33",
                "name": "AUDITORIO DE HUMANIDADES",
                "image": "http://descubre.pucp.edu.pe/imagesv2/dep021/pabellon%20v%20telecomunicaciones%20informatica.jpg",
                "capacity": 70,
                "used": 50,
                "hours": "08:00 - 22:00"
            },
            {
                "id": 35,
                "buildingCode": "34",
                "name": "PABELLÓN L: ESTUDIOS GENERALES LETRAS",
                "image": "http://descubre.pucp.edu.pe/imagesv2/dep021/pabellon%20v%20telecomunicaciones%20informatica.jpg",
                "capacity": 70,
                "used": 50,
                "hours": "08:00 - 22:00"
            },
            {
                "id": 36,
                "buildingCode": "35",
                "name": "FACULTAD DE EDUCACIÓN (OFICINAS)//",
                "image": "http://descubre.pucp.edu.pe/imagesv2/dep021/pabellon%20v%20telecomunicaciones%20informatica.jpg",
                "capacity": 70,
                "used": 50,
                "hours": "08:00 - 22:00"
            },
            {
                "id": 37,
                "buildingCode": "36",
                "name": "PABELLÓN R: FACULTAD DE EDUCACIÓN (AULAS)",
                "image": "http://descubre.pucp.edu.pe/imagesv2/dep021/pabellon%20v%20telecomunicaciones%20informatica.jpg",
                "capacity": 70,
                "used": 50,
                "hours": "08:00 - 22:00"
            },
            {
                "id": 38,
                "buildingCode": "37",
                "name": "PABELLÓN R: FACULTAD DE EDUCACIÓN (AULAS)//",
                "image": "http://descubre.pucp.edu.pe/imagesv2/dep021/pabellon%20v%20telecomunicaciones%20informatica.jpg",
                "capacity": 70,
                "used": 50,
                "hours": "08:00 - 22:00"
            },
            {
                "id": 39,
                "buildingCode": "38",
                "name": "DEPARTAMENTO ACADÉMICO DE EDUCACIÓN//",
                "image": "http://descubre.pucp.edu.pe/imagesv2/dep021/pabellon%20v%20telecomunicaciones%20informatica.jpg",
                "capacity": 70,
                "used": 50,
                "hours": "08:00 - 22:00"
            },
            {
                "id": 40,
                "buildingCode": "39",
                "name": "OFICINA DE SEGURIDAD ",
                "image": "http://descubre.pucp.edu.pe/imagesv2/dep021/pabellon%20v%20telecomunicaciones%20informatica.jpg",
                "capacity": 70,
                "used": 50,
                "hours": "08:00 - 22:00"
            },
            {
                "id": 41,
                "buildingCode": "39",
                "name": "CONTROL PATRIMONIAL",
                "image": "http://descubre.pucp.edu.pe/imagesv2/dep021/pabellon%20v%20telecomunicaciones%20informatica.jpg",
                "capacity": 70,
                "used": 50,
                "hours": "08:00 - 22:00"
            },
            {
                "id": 42,
                "buildingCode": "39",
                "name": "TRABAJOS MENORES//",
                "image": "http://descubre.pucp.edu.pe/imagesv2/dep021/pabellon%20v%20telecomunicaciones%20informatica.jpg",
                "capacity": 70,
                "used": 50,
                "hours": "08:00 - 22:00"
            },
            {
                "id": 43,
                "buildingCode": "39",
                "name": "ALMACÉN CENTRAL//",
                "image": "http://descubre.pucp.edu.pe/imagesv2/dep021/pabellon%20v%20telecomunicaciones%20informatica.jpg",
                "capacity": 70,
                "used": 50,
                "hours": "08:00 - 22:00"
            },
            {
                "id": 44,
                "buildingCode": "39",
                "name": "OFICINA DE SERVICIOS GENERALES, OFICINA DE LOGÍSTICA,  OFICINA DE SEGURIDAD INTEGRAL, MAESTRANZA",
                "image": "http://descubre.pucp.edu.pe/imagesv2/dep021/pabellon%20v%20telecomunicaciones%20informatica.jpg",
                "capacity": 70,
                "used": 50,
                "hours": "08:00 - 22:00"
            },
            {
                "id": 45,
                "buildingCode": "40",
                "name": "COMEDOR CENTRAL",
                "image": "http://descubre.pucp.edu.pe/imagesv2/dep021/pabellon%20v%20telecomunicaciones%20informatica.jpg",
                "capacity": 70,
                "used": 50,
                "hours": "08:00 - 22:00"
            },
            {
                "id": 46,
                "buildingCode": "41",
                "name": "PABELLÓN H: FACULTAD DE LETRAS Y CIENCIAS HUMANAS",
                "image": "http://descubre.pucp.edu.pe/imagesv2/dep021/pabellon%20v%20telecomunicaciones%20informatica.jpg",
                "capacity": 70,
                "used": 50,
                "hours": "08:00 - 22:00"
            },
            {
                "id": 47,
                "buildingCode": "42",
                "name": "LIBRERÍA PUCP, ASOCIACIÓN DE EGRESADOS Y GRADUADOS, DIRECCIÓN DE RELACIONES INSTITUCIONALES, FONDO EDITORIAL",
                "image": "http://descubre.pucp.edu.pe/imagesv2/dep021/pabellon%20v%20telecomunicaciones%20informatica.jpg",
                "capacity": 70,
                "used": 50,
                "hours": "08:00 - 22:00"
            },
            {
                "id": 48,
                "buildingCode": "43",
                "name": "OFICINA CENTRAL DE ADMISIÓN E INFORMES (OCAI)",
                "image": "http://descubre.pucp.edu.pe/imagesv2/dep021/pabellon%20v%20telecomunicaciones%20informatica.jpg",
                "capacity": 70,
                "used": 50,
                "hours": "08:00 - 22:00"
            },
            {
                "id": 49,
                "buildingCode": "44",
                "name": "PABELLÓN T: FACULTAD DE ARQUITECTURA Y URBANISMO",
                "image": "http://descubre.pucp.edu.pe/imagesv2/dep021/pabellon%20v%20telecomunicaciones%20informatica.jpg",
                "capacity": 70,
                "used": 50,
                "hours": "08:00 - 22:00"
            },
            {
                "id": 50,
                "buildingCode": "45",
                "name": "COLISEO POLIDEPORTIVO",
                "image": "http://descubre.pucp.edu.pe/imagesv2/dep021/pabellon%20v%20telecomunicaciones%20informatica.jpg",
                "capacity": 70,
                "used": 50,
                "hours": "08:00 - 22:00"
            },
            {
                "id": 51,
                "buildingCode": "46",
                "name": "LABORATORIO DE CERTIFICACIÓN (LABCERT)",
                "image": "http://descubre.pucp.edu.pe/imagesv2/dep021/pabellon%20v%20telecomunicaciones%20informatica.jpg",
                "capacity": 70,
                "used": 50,
                "hours": "08:00 - 22:00"
            },
            {
                "id": 52,
                "buildingCode": "47",
                "name": "LABORATORIO DE INVESTIGACIÓN EN EL REGISTRO, DIAGNÓSTICO Y CONSERVACIÓN DEL PATRIMONIO",
                "image": "http://descubre.pucp.edu.pe/imagesv2/dep021/pabellon%20v%20telecomunicaciones%20informatica.jpg",
                "capacity": 70,
                "used": 50,
                "hours": "08:00 - 22:00"
            },
            {
                "id": 53,
                "buildingCode": "48",
                "name": "ESTUDIO TV 2",
                "image": "http://descubre.pucp.edu.pe/imagesv2/dep021/pabellon%20v%20telecomunicaciones%20informatica.jpg",
                "capacity": 70,
                "used": 50,
                "hours": "08:00 - 22:00"
            },
            {
                "id": 54,
                "buildingCode": "49",
                "name": "PABELLÓN N: COMPLEJO FELIPE MAC GREGOR S.J. (BLOQUE A)",
                "image": "http://descubre.pucp.edu.pe/imagesv2/dep021/pabellon%20v%20telecomunicaciones%20informatica.jpg",
                "capacity": 70,
                "used": 50,
                "hours": "08:00 - 22:00"
            },
            {
                "id": 55,
                "buildingCode": "49",
                "name": "PABELLÓN N: COMPLEJO FELIPE MAC GREGOR S.J. (BLOQUE B)",
                "image": "http://descubre.pucp.edu.pe/imagesv2/dep021/pabellon%20v%20telecomunicaciones%20informatica.jpg",
                "capacity": 70,
                "used": 50,
                "hours": "08:00 - 22:00"
            },
            {
                "id": 56,
                "buildingCode": "49",
                "name": "PABELLÓN N: COMPLEJO FELIPE MAC GREGOR S.J. (BLOQUE C)",
                "image": "http://descubre.pucp.edu.pe/imagesv2/dep021/pabellon%20v%20telecomunicaciones%20informatica.jpg",
                "capacity": 70,
                "used": 50,
                "hours": "08:00 - 22:00"
            },
            {
                "id": 57,
                "buildingCode": "50",
                "name": "PABELLÓN Y: FACULTAD DE ARTE Y DISEÑO, DEPARTAMENTO ACADÉMICO DE ARTE Y DISEÑO",
                "image": "http://descubre.pucp.edu.pe/imagesv2/dep021/pabellon%20v%20telecomunicaciones%20informatica.jpg",
                "capacity": 70,
                "used": 50,
                "hours": "08:00 - 22:00"
            },
            {
                "id": 58,
                "buildingCode": "51",
                "name": "SALA CUNA",
                "image": "http://descubre.pucp.edu.pe/imagesv2/dep021/pabellon%20v%20telecomunicaciones%20informatica.jpg",
                "capacity": 70,
                "used": 50,
                "hours": "08:00 - 22:00"
            },
            {
                "id": 59,
                "buildingCode": "52",
                "name": "SNACK DE ELECTRÓNICA, LACTARIOS",
                "image": "http://descubre.pucp.edu.pe/imagesv2/dep021/pabellon%20v%20telecomunicaciones%20informatica.jpg",
                "capacity": 70,
                "used": 50,
                "hours": "08:00 - 22:00"
            },
            {
                "id": 60,
                "buildingCode": "53",
                "name": "PABELLÓN W: ESPACIOS CULTURALES",
                "image": "http://descubre.pucp.edu.pe/imagesv2/dep021/pabellon%20v%20telecomunicaciones%20informatica.jpg",
                "capacity": 70,
                "used": 50,
                "hours": "08:00 - 22:00"
            },
            {
                "id": 61,
                "buildingCode": "54",
                "name": "INSTITUTO DE RADIOASTRONOMÍA",
                "image": "http://descubre.pucp.edu.pe/imagesv2/dep021/pabellon%20v%20telecomunicaciones%20informatica.jpg",
                "capacity": 70,
                "used": 50,
                "hours": "08:00 - 22:00"
            },
            {
                "id": 62,
                "buildingCode": "55",
                "name": "EDIFICIO DE SERVICIOS ADMINISTRATIVOS (ESA)",
                "image": "http://descubre.pucp.edu.pe/imagesv2/dep021/pabellon%20v%20telecomunicaciones%20informatica.jpg",
                "capacity": 70,
                "used": 50,
                "hours": "08:00 - 22:00"
            },
            {
                "id": 63,
                "buildingCode": "56",
                "name": "PABELLÓN O",
                "image": "http://descubre.pucp.edu.pe/imagesv2/dep021/pabellon%20v%20telecomunicaciones%20informatica.jpg",
                "capacity": 70,
                "used": 50,
                "hours": "08:00 - 22:00"
            },
            {
                "id": 64,
                "buildingCode": "57",
                "name": "EDIFICIO DE SERVICIOS ESTUDIANTILES (TINKUY)",
                "image": "http://descubre.pucp.edu.pe/imagesv2/dep021/pabellon%20v%20telecomunicaciones%20informatica.jpg",
                "capacity": 70,
                "used": 50,
                "hours": "08:00 - 22:00"
            },
            {
                "id": 65,
                "buildingCode": "58",
                "name": "LABORATORIO DE MAQUINARIA PESADA",
                "image": "http://descubre.pucp.edu.pe/imagesv2/dep021/pabellon%20v%20telecomunicaciones%20informatica.jpg",
                "capacity": 70,
                "used": 50,
                "hours": "08:00 - 22:00"
            },
            {
                "id": 66,
                "buildingCode": "59",
                "name": "PABELLÓN A (AULARIO DEL COMPLEJO DE INNOVACIÓN ACADÉMICA)",
                "image": "http://descubre.pucp.edu.pe/imagesv2/dep021/pabellon%20v%20telecomunicaciones%20informatica.jpg",
                "capacity": 70,
                "used": 50,
                "hours": "08:00 - 22:00"
            },
            {
                "id": 67,
                "buildingCode": "60",
                "name": "BIBLIOTECA DEL COMPLEJO DE INNOVACIÓN ACADÉMICA",
                "image": "http://descubre.pucp.edu.pe/imagesv2/dep021/pabellon%20v%20telecomunicaciones%20informatica.jpg",
                "capacity": 70,
                "used": 50,
                "hours": "08:00 - 22:00"
            },
            {
                "id": 68,
                "buildingCode": "61",
                "name": "COMPLEJO DE CIENCIAS SOCIALES",
                "image": "http://descubre.pucp.edu.pe/imagesv2/dep021/pabellon%20v%20telecomunicaciones%20informatica.jpg",
                "capacity": 70,
                "used": 50,
                "hours": "08:00 - 22:00"
            },
            {
                "id": 69,
                "buildingCode": "62",
                "name": "EDIFICIO DE INVESTIGACIÓN",
                "image": "http://descubre.pucp.edu.pe/imagesv2/dep021/pabellon%20v%20telecomunicaciones%20informatica.jpg",
                "capacity": 70,
                "used": 50,
                "hours": "08:00 - 22:00"
            },
            {
                "id": 70,
                "buildingCode": "63",
                "name": "FACULTAD DE ESTUDIOS INTERDISCIPLINARIOS",
                "image": "http://descubre.pucp.edu.pe/imagesv2/dep021/pabellon%20v%20telecomunicaciones%20informatica.jpg",
                "capacity": 70,
                "used": 50,
                "hours": "08:00 - 22:00"
            },
            {
                "id": 71,
                "buildingCode": "C01",
                "name": "GRUPO DE APOYO AL SECTOR RURAL (OFICINAS)",
                "image": "http://descubre.pucp.edu.pe/imagesv2/dep021/pabellon%20v%20telecomunicaciones%20informatica.jpg",
                "capacity": 70,
                "used": 50,
                "hours": "08:00 - 22:00"
            },
            {
                "id": 72,
                "buildingCode": "C02",
                "name": "OFICINA DE COMUNICACIONES (DEPARTAMENTO ACADÉMICO DE INGENIERÍA)",
                "image": "http://descubre.pucp.edu.pe/imagesv2/dep021/pabellon%20v%20telecomunicaciones%20informatica.jpg",
                "capacity": 70,
                "used": 50,
                "hours": "08:00 - 22:00"
            },
            {
                "id": 73,
                "buildingCode": "C03",
                "name": "TIENDECITA VERDE",
                "image": "http://descubre.pucp.edu.pe/imagesv2/dep021/pabellon%20v%20telecomunicaciones%20informatica.jpg",
                "capacity": 70,
                "used": 50,
                "hours": "08:00 - 22:00"
            },
            {
                "id": 74,
                "buildingCode": "C04",
                "name": "ESTACIÓN METEREOLÓGICA \"HIPÓLITO UNANUE\"",
                "image": "http://descubre.pucp.edu.pe/imagesv2/dep021/pabellon%20v%20telecomunicaciones%20informatica.jpg",
                "capacity": 70,
                "used": 50,
                "hours": "08:00 - 22:00"
            },
            {
                "id": 75,
                "buildingCode": "C05",
                "name": "FEPUC, DEPÓSITO",
                "image": "http://descubre.pucp.edu.pe/imagesv2/dep021/pabellon%20v%20telecomunicaciones%20informatica.jpg",
                "capacity": 70,
                "used": 50,
                "hours": "08:00 - 22:00"
            },
            {
                "id": 76,
                "buildingCode": "C06",
                "name": "CASA LIMPIA CALIENTE",
                "image": "http://descubre.pucp.edu.pe/imagesv2/dep021/pabellon%20v%20telecomunicaciones%20informatica.jpg",
                "capacity": 70,
                "used": 50,
                "hours": "08:00 - 22:00"
            },
            {
                "id": 77,
                "buildingCode": "C07",
                "name": "TALLERES (GRUPO DE APOYO AL SECTOR RURAL Y SECCIÓN INGENIERÍA ELECTRÓNICA)",
                "image": "http://descubre.pucp.edu.pe/imagesv2/dep021/pabellon%20v%20telecomunicaciones%20informatica.jpg",
                "capacity": 70,
                "used": 50,
                "hours": "08:00 - 22:00"
            },
            {
                "id": 78,
                "buildingCode": "C08",
                "name": "CAFÉ COMPADRE",
                "image": "http://descubre.pucp.edu.pe/imagesv2/dep021/pabellon%20v%20telecomunicaciones%20informatica.jpg",
                "capacity": 70,
                "used": 50,
                "hours": "08:00 - 22:00"
            },
            {
                "id": 79,
                "buildingCode": "C09",
                "name": "CASA AUTOSOSTENIBLE",
                "image": "http://descubre.pucp.edu.pe/imagesv2/dep021/pabellon%20v%20telecomunicaciones%20informatica.jpg",
                "capacity": 70,
                "used": 50,
                "hours": "08:00 - 22:00"
            },
            {
                "id": 80,
                "buildingCode": "C10",
                "name": "DEPÓSITO Y ALMACÉNES",
                "image": "http://descubre.pucp.edu.pe/imagesv2/dep021/pabellon%20v%20telecomunicaciones%20informatica.jpg",
                "capacity": 70,
                "used": 50,
                "hours": "08:00 - 22:00"
            },
            {
                "id": 81,
                "buildingCode": "C11",
                "name": "CENTRO DE ACOPIO",
                "image": "http://descubre.pucp.edu.pe/imagesv2/dep021/pabellon%20v%20telecomunicaciones%20informatica.jpg",
                "capacity": 70,
                "used": 50,
                "hours": "08:00 - 22:00"
            },
            {
                "id": 82,
                "buildingCode": "C12",
                "name": "CAFETERÍA",
                "image": "http://descubre.pucp.edu.pe/imagesv2/dep021/pabellon%20v%20telecomunicaciones%20informatica.jpg",
                "capacity": 70,
                "used": 50,
                "hours": "08:00 - 22:00"
            },
            {
                "id": 83,
                "buildingCode": "C13",
                "name": "SNACK EL PUESTO",
                "image": "http://descubre.pucp.edu.pe/imagesv2/dep021/pabellon%20v%20telecomunicaciones%20informatica.jpg",
                "capacity": 70,
                "used": 50,
                "hours": "08:00 - 22:00"
            },
            {
                "id": 84,
                "buildingCode": "C14",
                "name": "INSTITUTO DE ETNOMUSICOLOGÍA, IDHAL, AIESEC, CUENTAS POR PAGAR",
                "image": "http://descubre.pucp.edu.pe/imagesv2/dep021/pabellon%20v%20telecomunicaciones%20informatica.jpg",
                "capacity": 70,
                "used": 50,
                "hours": "08:00 - 22:00"
            },
            {
                "id": 85,
                "buildingCode": "C15",
                "name": "DEPARTAMENTO ACADÉMICO DE CIENCIAS CONTABLES",
                "image": "http://descubre.pucp.edu.pe/imagesv2/dep021/pabellon%20v%20telecomunicaciones%20informatica.jpg",
                "capacity": 70,
                "used": 50,
                "hours": "08:00 - 22:00"
            },
            {
                "id": 86,
                "buildingCode": "C16",
                "name": "COMEDOR DE ARTE",
                "image": "http://descubre.pucp.edu.pe/imagesv2/dep021/pabellon%20v%20telecomunicaciones%20informatica.jpg",
                "capacity": 70,
                "used": 50,
                "hours": "08:00 - 22:00"
            },
            {
                "id": 87,
                "buildingCode": "C17-C33",
                "name": "FACULTAD DE ARTE Y DISEÑO (TALLERES Y AULAS)",
                "image": "http://descubre.pucp.edu.pe/imagesv2/dep021/pabellon%20v%20telecomunicaciones%20informatica.jpg",
                "capacity": 70,
                "used": 50,
                "hours": "08:00 - 22:00"
            },
            {
                "id": 88,
                "buildingCode": "C34",
                "name": "LABORATORIO DE ESTERILIZACIÓN, VESTIDOR",
                "image": "http://descubre.pucp.edu.pe/imagesv2/dep021/pabellon%20v%20telecomunicaciones%20informatica.jpg",
                "capacity": 70,
                "used": 50,
                "hours": "08:00 - 22:00"
            },
            {
                "id": 89,
                "buildingCode": "C35",
                "name": "ARCHIVO PASIVO, ALMACÉN (MATERIALES DE LIMPIEZA), CUARTO DE LIMPIEZA (SERVICIO DE SALUD)",
                "image": "http://descubre.pucp.edu.pe/imagesv2/dep021/pabellon%20v%20telecomunicaciones%20informatica.jpg",
                "capacity": 70,
                "used": 50,
                "hours": "08:00 - 22:00"
            },
            {
                "id": 90,
                "buildingCode": "C36",
                "name": "FARMACIA",
                "image": "http://descubre.pucp.edu.pe/imagesv2/dep021/pabellon%20v%20telecomunicaciones%20informatica.jpg",
                "capacity": 70,
                "used": 50,
                "hours": "08:00 - 22:00"
            },
            {
                "id": 91,
                "buildingCode": "C37",
                "name": "TAMBO ACTORAL, TEATRO DE LA UNIVERSIDAD CATÓLICA (TUC), CENTRO DE INVESTIGACIÓN Y DOCUMENTACIÓN DE LAS ARTES ESCÉNICAS (CIDARES), REPRESENTANTES DE COMUNICACIONES (REPCOM) - CENTRO FEDERADO DE COMUNICACIONES (CFCOM)",
                "image": "http://descubre.pucp.edu.pe/imagesv2/dep021/pabellon%20v%20telecomunicaciones%20informatica.jpg",
                "capacity": 70,
                "used": 50,
                "hours": "08:00 - 22:00"
            },
            {
                "id": 92,
                "buildingCode": "C38",
                "name": "COMEDOR DE LETRAS",
                "image": "http://descubre.pucp.edu.pe/imagesv2/dep021/pabellon%20v%20telecomunicaciones%20informatica.jpg",
                "capacity": 70,
                "used": 50,
                "hours": "08:00 - 22:00"
            },
            {
                "id": 93,
                "buildingCode": "C39",
                "name": "CENTRO DE INVESTIGACIONES Y SERVICIOS EDUCATIVOS (CISE), SALA DE ESTUDIO (FAC. DE EDUCACIÓN), AULA INFORMÁTICA (FAC. DE EDUCACIÓN), SERVICIO DE IMPRESIÓN, REA, MI CAMPUS, COMISIÓN ESPECIAL PARA LA INTERVENCIÓN FRENTE AL HOSTIGAMIENTO SEXUAL, ISA, CIEE, IFSA",
                "image": "http://descubre.pucp.edu.pe/imagesv2/dep021/pabellon%20v%20telecomunicaciones%20informatica.jpg",
                "capacity": 70,
                "used": 50,
                "hours": "08:00 - 22:00"
            },
            {
                "id": 94,
                "buildingCode": "C40",
                "name": "TRÁMITE DOCUMENTARIO",
                "image": "http://descubre.pucp.edu.pe/imagesv2/dep021/pabellon%20v%20telecomunicaciones%20informatica.jpg",
                "capacity": 70,
                "used": 50,
                "hours": "08:00 - 22:00"
            },
            {
                "id": 95,
                "buildingCode": "C41",
                "name": "DEPÓSITO (DIRECCIÓN DE ASUNTOS ACADÉMICOS)",
                "image": "http://descubre.pucp.edu.pe/imagesv2/dep021/pabellon%20v%20telecomunicaciones%20informatica.jpg",
                "capacity": 70,
                "used": 50,
                "hours": "08:00 - 22:00"
            },
            {
                "id": 96,
                "buildingCode": "C42",
                "name": "VESTIDOR (PERSONAL DE SEGURIDAD) - DEPÓSITO PSICOLOGÍA",
                "image": "http://descubre.pucp.edu.pe/imagesv2/dep021/pabellon%20v%20telecomunicaciones%20informatica.jpg",
                "capacity": 70,
                "used": 50,
                "hours": "08:00 - 22:00"
            },
            {
                "id": 97,
                "buildingCode": "C43",
                "name": "COMEDOR PERSONAL DE SERVICIO, SEGURIDAD Y CONTRATISTAS- DEPÓSITO INFRAESTRUCTURA - TRIBUNAL DE HONOR - DEPÓSITO CEMDUC  - DEPÓSITO CONTABILIDAD",
                "image": "http://descubre.pucp.edu.pe/imagesv2/dep021/pabellon%20v%20telecomunicaciones%20informatica.jpg",
                "capacity": 70,
                "used": 50,
                "hours": "08:00 - 22:00"
            },
            {
                "id": 98,
                "buildingCode": "C44",
                "name": "GABINETE DE ARQUEOLOGÍA A",
                "image": "http://descubre.pucp.edu.pe/imagesv2/dep021/pabellon%20v%20telecomunicaciones%20informatica.jpg",
                "capacity": 70,
                "used": 50,
                "hours": "08:00 - 22:00"
            },
            {
                "id": 99,
                "buildingCode": "C45",
                "name": "GABINETE DE ARQUEOLOGÍA B",
                "image": "http://descubre.pucp.edu.pe/imagesv2/dep021/pabellon%20v%20telecomunicaciones%20informatica.jpg",
                "capacity": 70,
                "used": 50,
                "hours": "08:00 - 22:00"
            },
            {
                "id": 100,
                "buildingCode": "C46",
                "name": "GABINETE DE ARQUEOLOGÍA C - SALA DE MÚSICA Y CORO",
                "image": "http://descubre.pucp.edu.pe/imagesv2/dep021/pabellon%20v%20telecomunicaciones%20informatica.jpg",
                "capacity": 70,
                "used": 50,
                "hours": "08:00 - 22:00"
            },
            {
                "id": 101,
                "buildingCode": "C47",
                "name": "INSTITUTO DE OPINIÓN PÚBLICA (IOP), OFICINAS (IDU), ALMACÉN Y DEPÓSITO (ESPECIALIDAD DE ARQUEOLOGÍA), OFICINAS (IDE), OFICINAS Y ARCHIVO (DEPARTAMENTO ACADÉMICO DE DERECHO), OFICINAS (ESCUELA DE POSGRADO)",
                "image": "http://descubre.pucp.edu.pe/imagesv2/dep021/pabellon%20v%20telecomunicaciones%20informatica.jpg",
                "capacity": 70,
                "used": 50,
                "hours": "08:00 - 22:00"
            },
            {
                "id": 102,
                "buildingCode": "C48",
                "name": "CENTRO DE INVESTIGACIÓN DE GEOGRAFÍA APLICADA (CIGA)",
                "image": "http://descubre.pucp.edu.pe/imagesv2/dep021/pabellon%20v%20telecomunicaciones%20informatica.jpg",
                "capacity": 70,
                "used": 50,
                "hours": "08:00 - 22:00"
            },
            {
                "id": 103,
                "buildingCode": "C49",
                "name": "INVERNADERO (ADYACENTE A GABINETE DE PROYECTOS PATRIMONIALES)",
                "image": "http://descubre.pucp.edu.pe/imagesv2/dep021/pabellon%20v%20telecomunicaciones%20informatica.jpg",
                "capacity": 70,
                "used": 50,
                "hours": "08:00 - 22:00"
            },
            {
                "id": 104,
                "buildingCode": "C50",
                "name": "OFICINA (CEMDUC), SALA DE DANZA (CEMDUC), GIMNASIO, VESTIDORES",
                "image": "http://descubre.pucp.edu.pe/imagesv2/dep021/pabellon%20v%20telecomunicaciones%20informatica.jpg",
                "capacity": 70,
                "used": 50,
                "hours": "08:00 - 22:00"
            },
            {
                "id": 105,
                "buildingCode": "C51",
                "name": "PABELLÓN X: FACULTAD DE ARTES ESCÉNICAS, DEPARTAMENTO ACADÉMICO DE ARTES ESCÉNICAS",
                "image": "http://descubre.pucp.edu.pe/imagesv2/dep021/pabellon%20v%20telecomunicaciones%20informatica.jpg",
                "capacity": 70,
                "used": 50,
                "hours": "08:00 - 22:00"
            },
            {
                "id": 106,
                "buildingCode": "C52",
                "name": "AULAS MÓVILES B",
                "image": "http://descubre.pucp.edu.pe/imagesv2/dep021/pabellon%20v%20telecomunicaciones%20informatica.jpg",
                "capacity": 70,
                "used": 50,
                "hours": "08:00 - 22:00"
            },
            {
                "id": 107,
                "buildingCode": "C53",
                "name": "AULAS MÓVILES A",
                "image": "http://descubre.pucp.edu.pe/imagesv2/dep021/pabellon%20v%20telecomunicaciones%20informatica.jpg",
                "capacity": 70,
                "used": 50,
                "hours": "08:00 - 22:00"
            },
            {
                "id": 108,
                "buildingCode": "C54",
                "name": "AULAS MÓVILES C",
                "image": "http://descubre.pucp.edu.pe/imagesv2/dep021/pabellon%20v%20telecomunicaciones%20informatica.jpg",
                "capacity": 70,
                "used": 50,
                "hours": "08:00 - 22:00"
            },
            {
                "id": 109,
                "buildingCode": "C55",
                "name": "GABINETE DE PROYECTOS PATRIMONIALES HUACA 20",
                "image": "http://descubre.pucp.edu.pe/imagesv2/dep021/pabellon%20v%20telecomunicaciones%20informatica.jpg",
                "capacity": 70,
                "used": 50,
                "hours": "08:00 - 22:00"
            },
            {
                "id": 110,
                "buildingCode": "C56",
                "name": "CENTRO DE FOTOCOPIADO (TUC)",
                "image": "http://descubre.pucp.edu.pe/imagesv2/dep021/pabellon%20v%20telecomunicaciones%20informatica.jpg",
                "capacity": 70,
                "used": 50,
                "hours": "08:00 - 22:00"
            },
            {
                "id": 111,
                "buildingCode": "C57",
                "name": "CENTRO DE FOTOCOPIADO (EE.GG.CC.)",
                "image": "http://descubre.pucp.edu.pe/imagesv2/dep021/pabellon%20v%20telecomunicaciones%20informatica.jpg",
                "capacity": 70,
                "used": 50,
                "hours": "08:00 - 22:00"
            },
            {
                "id": 112,
                "buildingCode": "C58",
                "name": "CENTRO DE FOTOCOPIADO (EE.GG.LL.)",
                "image": "http://descubre.pucp.edu.pe/imagesv2/dep021/pabellon%20v%20telecomunicaciones%20informatica.jpg",
                "capacity": 70,
                "used": 50,
                "hours": "08:00 - 22:00"
            },
            {
                "id": 113,
                "buildingCode": "C59",
                "name": "CENTRO DE FOTOCOPIADO (DERECHO)",
                "image": "http://descubre.pucp.edu.pe/imagesv2/dep021/pabellon%20v%20telecomunicaciones%20informatica.jpg",
                "capacity": 70,
                "used": 50,
                "hours": "08:00 - 22:00"
            },
            {
                "id": 114,
                "buildingCode": "C60",
                "name": "INVERNADERO (GRUPO APOYO SECTOR RURAL)",
                "image": "http://descubre.pucp.edu.pe/imagesv2/dep021/pabellon%20v%20telecomunicaciones%20informatica.jpg",
                "capacity": 70,
                "used": 50,
                "hours": "08:00 - 22:00"
            },
            {
                "id": 115,
                "buildingCode": "C61",
                "name": "AULAS MÓVILES (PSICOLOGÍA)",
                "image": "http://descubre.pucp.edu.pe/imagesv2/dep021/pabellon%20v%20telecomunicaciones%20informatica.jpg",
                "capacity": 70,
                "used": 50,
                "hours": "08:00 - 22:00"
            },
            {
                "id": 116,
                "buildingCode": "C62",
                "name": "VIVIENDA BIOCLIMÁTICA SUMAQ WASI (PROTOTIPO 1)",
                "image": "http://descubre.pucp.edu.pe/imagesv2/dep021/pabellon%20v%20telecomunicaciones%20informatica.jpg",
                "capacity": 70,
                "used": 50,
                "hours": "08:00 - 22:00"
            },
            {
                "id": 117,
                "buildingCode": "C63",
                "name": "VIVIENDA BIOCLIMÁTICA SUMAQ WASI (PROTOTIPO 2)",
                "image": "http://descubre.pucp.edu.pe/imagesv2/dep021/pabellon%20v%20telecomunicaciones%20informatica.jpg",
                "capacity": 70,
                "used": 50,
                "hours": "08:00 - 22:00"
            },
            {
                "id": 118,
                "buildingCode": "C64",
                "name": "INVERNADERO INTELIGENTE (GRUPO DE APOYO AL SECTOR RURAL)"
            }
        ]
    }

    function setPlace(place, type){
        console.log(place)

        let data = {
            keyCode: "01a828fcc8d56f00ba6dddb73b0dd574610b7721e249127a69d57651d67d3694",
            "firstResult": 1,
            "maxResults": 2,
            "user": "jrleon@pucp.edu.pe",
            "from": "14/05/2022 02:33:56 PM",
            "to": "14/05/2022 02:33:56 PM",
        }

        let types = ["buildings", "sections", "sites"]

        function getTotalCapacity(siteId){

            let xhr = new XMLHttpRequest();
            xhr.open("POST", url + "common/sections");
    
            xhr.setRequestHeader("Accept", "application/json");
            xhr.setRequestHeader("Content-Type", "application/json");

            xhr.onload = () => [
                
            ]

            data.siteId = siteId;

            xhr.send(JSON.stringify(data))
        }

        function getSites(){

        }

        switch (type) {
            case "buildings":
                getSites(place.list[0].key)
                break;
            case "sections":
                break;
            default:
                getTotalCapacity(place.list[0].key)
                break;
        }
    }

    function getPlace(name) {

        let data = {
            keyCode: "01a828fcc8d56f00ba6dddb73b0dd574610b7721e249127a69d57651d67d3694",
            value: name,
        };

        let xhr = new XMLHttpRequest();
        xhr.open("POST", url + "common/autocompleteSites");

        xhr.setRequestHeader("Accept", "application/json");
        xhr.setRequestHeader("Content-Type", "application/json");

        xhr.onload = () => {
            var response = JSON.parse(xhr.response)
            if(response.resultCode !== 1003) setPlace(response, "sites")
            else {

                let sections = new XMLHttpRequest();
                sections.open("POST", url + "common/autocompleteSections");
        
                sections.setRequestHeader("Accept", "application/json");
                sections.setRequestHeader("Content-Type", "application/json");
        
                sections.onload = () => {
                    var responseSections = JSON.parse(sections.response)
                    if(responseSections.resultCode !== 1003) setPlace(responseSections, "sections")
                    else {

                        let buildings = new XMLHttpRequest();
                        buildings.open("POST", url + "common/autocompleteBuildings");
                
                        buildings.setRequestHeader("Accept", "application/json");
                        buildings.setRequestHeader("Content-Type", "application/json");
                
                        buildings.onload = () => {
                            var responseBuildings = JSON.parse(buildings.response)
                            if(responseBuildings.resultCode !== 1003) setPlace(responseBuildings, "buildings")
                            else {
                                return null
                            }
                        }
                
                        buildings.send(JSON.stringify(data));
                    }
                }
        
                sections.send(JSON.stringify(data));
            }
        }

        xhr.send(JSON.stringify(data));
    }

    var tooltip = $("#tooltip");

    var tooltipImage = $("#place-image");

    var tooltipTitle = $("#place-name");

    var tooltipHours = $("#place-capacity");

    var tooltipCapacity = $("#place-hours");

    console.log(tooltip, tooltip.css('top'))

    $.each($(".place"), function (index, value) {
        console.log(value.id); 

        var viewportOffset = value.getBoundingClientRect();
        // these are relative to the viewport, i.e. the window
        var top = viewportOffset.top + (viewportOffset.height / 4);
        var left = viewportOffset.left + (viewportOffset.width / 4);


        $(`<div id="Point-${value.id}" class="place-point" style="--top: ${top}px; --left: ${left}px;"></div>`).insertBefore(tooltip);

        // $("#"+value.id).mouseleave(function(){
        //     console.log( value.id + " out" );

        //     tooltip.css('top', "0px")
        //     tooltip.css('left', "0px")
        // });
    });

    setTimeout(() => {

        $.each($(".place-point"), function (index, value) {
    
            var viewportOffset = value.getBoundingClientRect();
            // these are relative to the viewport, i.e. the window
            var top = viewportOffset.top - 220 > 10 ? viewportOffset.top : 230;
            var left = viewportOffset.top - 220 > 10 ? viewportOffset.left : viewportOffset.left + 20;

            var place = dummyData.list.find((element) => "Point-"+element.id === value.id)

            if (place) {

                var used = place.used / place.capacity; 
    
                var type = used <= 0.5 ? 'blue' : used <= 1 ? 'yellow' : 'red';

                $(this).css('--color', type);
        
                $("#" + value.id).mouseover(function () {
        
                    tooltip.css('top', (top - 220) + "px");
                    tooltip.css('left', left + "px");
                    tooltip.css('--color', type);

                    tooltipImage.attr("src", place.image);
    
                    tooltipTitle.text(place.name);
    
                    tooltipHours.text(place.hours);
    
                    tooltipCapacity.text(place.used + "/" + place.capacity);
    
                    tooltip.css('display', "block");
        
                    getPlace(value.id);
                });
        
                $("#" + value.id).mouseout(function () {
                    tooltip.css('display', "none")
                });

            }
        });
    }, 500)
});
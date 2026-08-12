// ==========================================
// RÍO CRISTALINO
// LISTADO DE EVENTOS
// ==========================================

let eventos = [

    // ==========================================
    // ELECTRÓNICA
    // ==========================================

    {
        id: "guy-j",
        nombre: "GUY J",
        categoria: "electronica",
        fecha: "22/08/2026",
        lugar: "Forja",
        salida: "Patio Olmos · 18:45 hs",
        regreso: "03:30 hs aprox.",
        precio: 15000,
        cupos: 45,
        imagen: "imagenes/electronica/guy-j.jpg",
        tieneFechas: false
    },

    {
        id: "mellino",
        nombre: "MARIANO MELLINO",
        categoria: "electronica",
        fecha: "12/09/2026",
        lugar: "Forja - Córdoba",
        salida: "Patio Olmos",
        regreso: "03:30 hs aprox.",
        precio: 15000,
        cupos: 45,
        imagen: "imagenes/electronica/mariano-mellino.jpg",
        tieneFechas: false
    },


    // ==========================================
    // ROCK
    // ==========================================

    {
        id: "skay",
        nombre: "SKAY",
        categoria: "rock",
        fecha: "05/09/2026",
        lugar: "Predio West - Río Cuarto",
        salida: "Patio Olmos",
        regreso: "Al finalizar el evento",
        precio: 40000,
        cupos: 45,
        imagen: "imagenes/rock/skay.jpg",
        tieneFechas: false
    },

    {
        id: "airbag",
        nombre: "AIRBAG",
        categoria: "rock",
        fecha: "10/10/2026",
        lugar: "Estadio Belgrano - Córdoba",
        salida: "Terminal Almafuerte - Río Tercero",
        regreso: "Al finalizar el evento",
        precio: 35000,
        cupos: 19,
        imagen: "imagenes/rock/airbag.jpg",
        tieneFechas: false
    },

    {
        id: "la-renga",
        nombre: "LA RENGA",
        categoria: "rock",
        fecha: "17/10/2026",
        lugar: "Plaza Próspero Molina - Cosquín",
        salida: "Patio Olmos · 14:00 hs",
        regreso: "Al finalizar el evento",
        precio: 35000,
        cupos: 45,
        imagen: "imagenes/rock/la-renga.jpg",
        tieneFechas: false
    },


    // ==========================================
    // FESTIVALES
    // ==========================================

    {
        id: "oktoberfest",
        nombre: "OKTOBERFEST",
        categoria: "festival",
        fecha: "03/10/2026",
        lugar: "Villa General Belgrano",
        salida: "Patio Olmos · 14:00 hs",
        regreso: "Al finalizar el evento",
        precio: 35000,
        cupos: 45,
        imagen: "imagenes/eventos/oktoberfest.jpg",

        tieneFechas: true,

        fechas: [
            {
                fecha: "03/10/2026",
                cupos: 45
            },
            {
                fecha: "09/10/2026",
                cupos: 45
            },
            {
                fecha: "10/10/2026",
                cupos: 45
            },
            {
                fecha: "11/10/2026",
                cupos: 45
            }
        ]
    }

];
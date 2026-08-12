// ==========================================
// RÍO CRISTALINO
// SISTEMA DE EVENTOS Y RESERVAS
// ==========================================

document.addEventListener("DOMContentLoaded", function () {

    // ==========================================
    // ELEMENTOS
    // ==========================================

    const contenedorEventos =
        document.getElementById("eventos-container");

    const contenedorProximos =
        document.getElementById("proximos-eventos-container");

    const contenedorFestivales =
        document.getElementById("festivales-container");

    const botonesFiltro =
        document.querySelectorAll(".filtro-evento");


    // ==========================================
    // VARIABLES
    // ==========================================

    let eventos = [];
    let eventoSeleccionado = null;
    let cantidad = 1;


    // ==========================================
    // PRECIO
    // ==========================================

    function formatearPrecio(precio) {

        return "$" +
            Number(precio || 0)
                .toLocaleString("es-AR");

    }


    // ==========================================
    // CATEGORÍA
    // ==========================================

    function obtenerCategoriaTexto(categoria) {

        if (categoria === "electronica") {
            return "ELECTRÓNICA";
        }

        if (categoria === "rock") {
            return "ROCK";
        }

        if (categoria === "festival") {
            return "FESTIVAL";
        }

        return String(categoria || "")
            .toUpperCase();
    }


    // ==========================================
    // CARGAR EVENTOS DESDE SUPABASE
    // ==========================================

    async function cargarEventosDesdeSupabase() {

        try {

            const resultado =
                await supabaseClient
                    .from("eventos")
                    .select("*")
                    .eq("activo", true);

            const data = resultado.data;
            const error = resultado.error;


            if (error) {

                console.error(
                    "Error al cargar eventos:",
                    error
                );

                return false;
            }


            if (!data || data.length === 0) {

                console.error(
                    "No hay eventos activos en Supabase."
                );

                return false;
            }


            // ==========================================
            // CONVERTIR EVENTOS
            // ==========================================

            eventos = data.map(function (evento, indice) {

                let idEvento;

                if (
                    evento.id !== undefined &&
                    evento.id !== null
                ) {

                    idEvento =
                        String(evento.id);

                } else {

                    idEvento =
                        "evento-" + indice;

                }


                // --------------------------------------
                // FECHAS
                // --------------------------------------

                let fechasEvento = [];

                if (Array.isArray(evento.fechas)) {

                    fechasEvento =
                        evento.fechas;

                } else if (
                    typeof evento.fechas === "string"
                ) {

                    try {

                        const convertidas =
                            JSON.parse(evento.fechas);

                        if (Array.isArray(convertidas)) {

                            fechasEvento =
                                convertidas;

                        }

                    } catch (error) {

                        console.error(
                            "Error leyendo fechas:",
                            evento.nombre,
                            error
                        );

                    }

                }


                return {

                    id: idEvento,

                    nombre:
                        evento.nombre || "",

                    titulo:
                        evento.titulo ||
                        evento.nombre ||
                        "",

                    categoria:
                        evento.categoria || "",

                    fecha:
                        evento.fecha || "",

                    lugar:
                        evento.lugar || "",

                    salida:
                        evento.salida ||
                        "Patio Olmos",

                    regreso:
                        evento.regreso ||
                        "A confirmar",

                    precio:
                        Number(
                            evento.precio || 0
                        ),

                    cupos:
                        Number(
                            evento.cupos || 0
                        ),

                    imagen:
                        evento.imagen || "",

                    activo:
                        evento.activo === true,

                    tieneFechas:
                        evento.tiene_fechas === true ||
                        evento.tiene_fechas === "true" ||
                        evento.tieneFechas === true ||
                        evento.tieneFechas === "true",

                    fechas:
                        fechasEvento

                };

            });


            console.log(
                "RÍO CRISTALINO: eventos cargados desde Supabase",
                eventos
            );


            console.table(
                eventos.map(function (evento) {

                    return {

                        id: evento.id,

                        nombre: evento.nombre,

                        categoria: evento.categoria,

                        fecha: evento.fecha

                    };

                })
            );


            return true;


        } catch (error) {

            console.error(
                "Error inesperado cargando eventos:",
                error
            );

            return false;
        }

    }


    // ==========================================
    // CREAR TARJETA
    // ==========================================

    function crearTarjetaEvento(evento) {

        const tarjeta =
            document.createElement("article");

        tarjeta.className =
            "event-card";

        tarjeta.dataset.categoria =
            evento.categoria;


        tarjeta.innerHTML = `

            <div class="event-image">

                <img
                    src="${evento.imagen}"
                    alt="${evento.titulo || evento.nombre}"
                >

                <span class="event-category">
                    ${obtenerCategoriaTexto(evento.categoria)}
                </span>

            </div>


            <div class="event-content">

                <h3>
                    ${evento.titulo || evento.nombre}
                </h3>


                <div class="event-info">

                    <p>
                        📅 ${evento.fecha}
                    </p>

                    <p>
                        📍 ${evento.lugar}
                    </p>

                    <p>
                        🚌 ${evento.salida}
                    </p>

                    <p>
                        🔄 ${evento.regreso}
                    </p>

                </div>


                <div class="event-bottom">

                    <div class="event-price">

                        <small>
                            VIAJE POR PERSONA
                        </small>

                        <strong>
                            ${formatearPrecio(evento.precio)}
                        </strong>

                        <span>
                            ${evento.cupos}
                            cupos disponibles
                        </span>

                    </div>


                    <button
                        type="button"
                        class="event-button btn-abrir-reserva"
                        data-evento="${evento.id}"
                    >
                        RESERVAR
                    </button>

                </div>

            </div>

        `;

        return tarjeta;
    }


    // ==========================================
    // MOSTRAR EVENTOS
    // ==========================================

    function mostrarEventos(filtro = "todos") {

        if (!contenedorEventos) {
            return;
        }

        contenedorEventos.innerHTML = "";


        const lista =
            eventos.filter(function (evento) {

                if (evento.categoria === "festival") {
                    return false;
                }

                if (
                    filtro === "todos" ||
                    !filtro
                ) {
                    return true;
                }

                return evento.categoria === filtro;

            });


        if (lista.length === 0) {

            contenedorEventos.innerHTML = `
                <div class="no-events">
                    No hay eventos disponibles.
                </div>
            `;

            return;
        }


        lista.forEach(function (evento) {

            contenedorEventos.appendChild(
                crearTarjetaEvento(evento)
            );

        });

    }


    // ==========================================
    // MOSTRAR FESTIVALES
    // ==========================================

    function mostrarFestivales() {

        if (!contenedorFestivales) {
            return;
        }

        contenedorFestivales.innerHTML = "";


        const festivales =
            eventos.filter(function (evento) {

                return evento.categoria === "festival";

            });


        if (festivales.length === 0) {

            contenedorFestivales.innerHTML = `
                <div class="no-events">
                    No hay festivales disponibles.
                </div>
            `;

            return;
        }


        festivales.forEach(function (evento) {

            contenedorFestivales.appendChild(
                crearTarjetaEvento(evento)
            );

        });

    }


    // ==========================================
    // CONVERTIR FECHA
    // ==========================================

    function convertirFecha(fecha) {

        if (!fecha) {
            return new Date(2099, 11, 31);
        }


        const partes =
            String(fecha).split("/");


        if (partes.length !== 3) {
            return new Date(2099, 11, 31);
        }


        return new Date(
            Number(partes[2]),
            Number(partes[1]) - 1,
            Number(partes[0])
        );

    }


    // ==========================================
    // PRÓXIMOS EVENTOS
    // ==========================================

    function mostrarProximosEventos() {

        if (!contenedorProximos) {
            return;
        }


        contenedorProximos.innerHTML = "";


        const eventosProximos =
            eventos
                .filter(function (evento) {

                    return evento.categoria !==
                        "festival";

                })
                .sort(function (a, b) {

                    return convertirFecha(a.fecha) -
                        convertirFecha(b.fecha);

                });


        if (eventosProximos.length === 0) {
            return;
        }


        const principal =
            eventosProximos[0];


        const destacado =
            document.createElement("article");

        destacado.className =
            "event-featured";


        destacado.innerHTML = `

            <div class="featured-image">

                <img
                    src="${principal.imagen}"
                    alt="${principal.titulo || principal.nombre}"
                >

                <span class="featured-label">
                    PRÓXIMO VIAJE
                </span>

            </div>


            <div class="featured-content">

                <div class="featured-category">
                    ${obtenerCategoriaTexto(
                        principal.categoria
                    )}
                </div>


                <h2>
                    ${principal.titulo || principal.nombre}
                </h2>


                <p class="featured-date">
                    📅 ${principal.fecha}
                </p>

                <p>
                    📍 ${principal.lugar}
                </p>

                <p>
                    🚌 ${principal.salida}
                </p>

                <p>
                    🔄 ${principal.regreso}
                </p>


                <div class="featured-bottom">

                    <div>

                        <small>
                            VIAJE POR PERSONA
                        </small>

                        <strong>
                            ${formatearPrecio(
                                principal.precio
                            )}
                        </strong>

                    </div>


                    <button
                        type="button"
                        class="event-button btn-abrir-reserva"
                        data-evento="${principal.id}"
                    >
                        RESERVAR
                    </button>

                </div>

            </div>

        `;


        contenedorProximos.appendChild(
            destacado
        );


        const siguientes =
            eventosProximos.slice(1, 4);


        if (siguientes.length > 0) {

            const grilla =
                document.createElement("div");

            grilla.className =
                "upcoming-grid";


            siguientes.forEach(function (evento) {

                grilla.appendChild(
                    crearTarjetaEvento(evento)
                );

            });


            contenedorProximos.appendChild(
                grilla
            );

        }

    }


    // ==========================================
    // FILTROS
    // ==========================================

    botonesFiltro.forEach(function (boton) {

        boton.addEventListener(
            "click",
            function () {

                botonesFiltro.forEach(
                    function (item) {

                        item.classList.remove(
                            "activo"
                        );

                    }
                );


                boton.classList.add(
                    "activo"
                );


                mostrarEventos(
                    boton.dataset.filtro
                );

            }
        );

    });


    // ==========================================
    // BUSCAR EVENTO
    // ==========================================

    function buscarEventoPorId(id) {

        return eventos.find(
            function (evento) {

                return String(evento.id) ===
                    String(id);

            }
        );

    }


    // ==========================================
    // ABRIR RESERVA
    // ==========================================

    document.addEventListener(
        "click",
        function (event) {

            const boton =
                event.target.closest(
                    ".btn-abrir-reserva"
                );


            if (!boton) {
                return;
            }


            const idEvento =
                boton.getAttribute(
                    "data-evento"
                );


            console.log(
                "BOTÓN RESERVA - ID:",
                idEvento
            );


            const evento =
                buscarEventoPorId(idEvento);


            if (!evento) {

                console.error(
                    "No se encontró el evento:",
                    idEvento
                );

                console.table(eventos);

                return;
            }


            console.log(
                "EVENTO SELECCIONADO:",
                evento.nombre,
                evento.id
            );


            abrirReserva(evento);

        }
    );


    // ==========================================
    // ABRIR MODAL
    // ==========================================

    function abrirReserva(evento) {

        eventoSeleccionado =
            evento;

        cantidad = 1;


        const modal =
            document.getElementById(
                "modalReserva"
            );


        if (!modal) {

            alert(
                "No se encontró el formulario de reserva."
            );

            return;
        }


        const nombreEvento =
            document.getElementById(
                "reservaEvento"
            );

        const fechaEvento =
            document.getElementById(
                "reservaFecha"
            );

        const lugarEvento =
            document.getElementById(
                "reservaLugar"
            );

        const precioEvento =
            document.getElementById(
                "reservaPrecio"
            );

        const cantidadElemento =
            document.getElementById(
                "cantidad"
            );

        const totalElemento =
            document.getElementById(
                "total"
            );

        const cuposElemento =
            document.getElementById(
                "cupos"
            );


        if (nombreEvento) {

            nombreEvento.textContent =
                evento.titulo ||
                evento.nombre;

        }


        if (fechaEvento) {

            fechaEvento.textContent =
                "📅 " +
                evento.fecha;

        }


        if (lugarEvento) {

            lugarEvento.textContent =
                "📍 " +
                evento.lugar;

        }


        const precio =
            Number(
                evento.precio || 0
            );


        if (precioEvento) {

            precioEvento.textContent =
                formatearPrecio(precio);

        }


        if (cantidadElemento) {

            cantidadElemento.textContent =
                "1";

        }


        if (totalElemento) {

            totalElemento.textContent =
                formatearPrecio(precio);

        }


        if (cuposElemento) {

            cuposElemento.textContent =
                evento.cupos;

        }


        // ==========================================
        // SELECTOR DE FECHAS
        // ==========================================

        const selectorFecha =
            document.getElementById(
                "fechaElegida"
            );

        const contenedorFecha =
            document.getElementById(
                "contenedorFecha"
            );


        if (
            selectorFecha &&
            contenedorFecha
        ) {

            selectorFecha.innerHTML = "";


            if (
                evento.tieneFechas === true &&
                Array.isArray(evento.fechas) &&
                evento.fechas.length > 0
            ) {

                contenedorFecha.style.display =
                    "grid";


                const inicial =
                    document.createElement(
                        "option"
                    );

                inicial.value = "";

                inicial.textContent =
                    "Seleccioná una fecha";

                selectorFecha.appendChild(
                    inicial
                );


                evento.fechas.forEach(
                    function (fecha) {

                        const opcion =
                            document.createElement(
                                "option"
                            );


                        if (
                            typeof fecha === "object" &&
                            fecha !== null
                        ) {

                            const fechaTexto =
                                fecha.fecha ||
                                fecha.dia ||
                                fecha.nombre ||
                                "";


                            opcion.value =
                                fechaTexto;


                            opcion.textContent =
                                fechaTexto;


                            if (
                                fecha.cupos !== undefined &&
                                fecha.cupos !== null
                            ) {

                                opcion.textContent +=
                                    " · " +
                                    fecha.cupos +
                                    " cupos";

                            }

                        } else {

                            opcion.value =
                                String(fecha);

                            opcion.textContent =
                                String(fecha);

                        }


                        selectorFecha.appendChild(
                            opcion
                        );

                    }
                );


                selectorFecha.onchange =
                    function () {

                        const seleccion =
                            evento.fechas.find(
                                function (fecha) {

                                    if (
                                        typeof fecha ===
                                        "object" &&
                                        fecha !== null
                                    ) {

                                        return String(
                                            fecha.fecha ||
                                            fecha.dia ||
                                            fecha.nombre ||
                                            ""
                                        ) ===
                                        String(
                                            selectorFecha.value
                                        );

                                    }


                                    return String(fecha) ===
                                        String(
                                            selectorFecha.value
                                        );

                                }
                            );


                        if (
                            seleccion &&
                            typeof seleccion === "object" &&
                            seleccion.cupos !== undefined
                        ) {

                            eventoSeleccionado.cupos =
                                Number(
                                    seleccion.cupos
                                );


                            if (cuposElemento) {

                                cuposElemento.textContent =
                                    Math.max(
                                        0,
                                        eventoSeleccionado.cupos -
                                        cantidad
                                    );

                            }

                        }

                    };

            } else {

                contenedorFecha.style.display =
                    "none";

            }

        }


        modal.classList.add(
            "activo"
        );

        document.body.style.overflow =
            "hidden";

    }


    // ==========================================
    // CERRAR MODAL
    // ==========================================

    function cerrarReserva() {

        const modal =
            document.getElementById(
                "modalReserva"
            );


        if (!modal) {
            return;
        }


        modal.classList.remove(
            "activo"
        );

        document.body.style.overflow =
            "";

    }


    document.addEventListener(
        "click",
        function (event) {

            if (
                event.target.closest(
                    ".cerrar-modal"
                )
            ) {

                cerrarReserva();

            }

        }
    );


    document.addEventListener(
        "click",
        function (event) {

            const modal =
                document.getElementById(
                    "modalReserva"
                );


            if (
                modal &&
                event.target === modal
            ) {

                cerrarReserva();

            }

        }
    );


    // ==========================================
    // SUMAR
    // ==========================================

    document.addEventListener(
        "click",
        function (event) {

            const boton =
                event.target.closest("#mas");


            if (
                !boton ||
                !eventoSeleccionado
            ) {
                return;
            }


            const cupos =
                Number(
                    eventoSeleccionado.cupos || 0
                );


            if (cantidad < cupos) {

                cantidad++;

                actualizarCantidad();

            }

        }
    );


    // ==========================================
    // RESTAR
    // ==========================================

    document.addEventListener(
        "click",
        function (event) {

            const boton =
                event.target.closest("#menos");


            if (!boton) {
                return;
            }


            if (cantidad > 1) {

                cantidad--;

                actualizarCantidad();

            }

        }
    );


    // ==========================================
    // ACTUALIZAR CANTIDAD
    // ==========================================

    function actualizarCantidad() {

        const cantidadElemento =
            document.getElementById(
                "cantidad"
            );

        const totalElemento =
            document.getElementById(
                "total"
            );

        const cuposElemento =
            document.getElementById(
                "cupos"
            );


        if (cantidadElemento) {

            cantidadElemento.textContent =
                cantidad;

        }


        if (
            totalElemento &&
            eventoSeleccionado
        ) {

            totalElemento.textContent =
                formatearPrecio(
                    cantidad *
                    Number(
                        eventoSeleccionado.precio || 0
                    )
                );

        }


        if (
            cuposElemento &&
            eventoSeleccionado
        ) {

            cuposElemento.textContent =
                Math.max(
                    0,
                    Number(
                        eventoSeleccionado.cupos || 0
                    ) -
                    cantidad
                );

        }

    }


    // ==========================================
    // FORMULARIO
    // ==========================================

    const formulario =
        document.getElementById(
            "formReserva"
        );


    if (formulario) {

        formulario.addEventListener(
            "submit",
            function (event) {

                event.preventDefault();


                if (!eventoSeleccionado) {

                    alert(
                        "Primero seleccioná un evento."
                    );

                    return;
                }


                const campoNombre =
                    document.getElementById(
                        "nombre"
                    );

                const campoDni =
                    document.getElementById(
                        "dni"
                    );

                const campoTelefono =
                    document.getElementById(
                        "telefono"
                    );


                const nombre =
                    campoNombre
                        ? campoNombre.value.trim()
                        : "";

                const dni =
                    campoDni
                        ? campoDni.value.trim()
                        : "";

                const telefono =
                    campoTelefono
                        ? campoTelefono.value.trim()
                        : "";


                if (
                    !nombre ||
                    !dni ||
                    !telefono
                ) {

                    alert(
                        "Completá nombre, DNI y teléfono para continuar."
                    );

                    return;
                }


                // ==========================================
                // FECHA
                // ==========================================

                const selectorFecha =
                    document.getElementById(
                        "fechaElegida"
                    );


                let fechaReserva =
                    eventoSeleccionado.fecha;


                if (
                    eventoSeleccionado.tieneFechas === true &&
                    Array.isArray(
                        eventoSeleccionado.fechas
                    ) &&
                    eventoSeleccionado.fechas.length > 0
                ) {

                    if (
                        !selectorFecha ||
                        !selectorFecha.value
                    ) {

                        alert(
                            "Seleccioná la fecha de tu viaje."
                        );

                        return;
                    }


                    fechaReserva =
                        selectorFecha.value;

                }


                // ==========================================
                // TOTAL
                // ==========================================

                const precio =
                    Number(
                        eventoSeleccionado.precio || 0
                    );


                const total =
                    cantidad * precio;


                // ==========================================
                // WHATSAPP
                // ==========================================

                const numeroWhatsApp =
                    "5493544448487";


         const mensajeWhatsApp =
    "🚌 *RÍO CRISTALINO*\n" +
    "━━━━━━━━━━━━━━━━━━━━\n\n" +

    "🎟️ *NUEVA RESERVA*\n\n" +

    "🎵 *Evento:* " +
    (
        eventoSeleccionado.titulo ||
        eventoSeleccionado.nombre
    ) +
    "\n" +

    "📅 *Fecha:* " +
    fechaReserva +
    "\n" +

    "📍 *Lugar:* " +
    eventoSeleccionado.lugar +
    "\n\n" +

    "👤 *DATOS DEL PASAJERO*\n\n" +

    "👤 *Nombre:* " +
    nombre +
    "\n" +

    "🪪 *DNI:* " +
    dni +
    "\n" +

    "📱 *Teléfono:* " +
    telefono +
    "\n\n" +

    "👥 *Cantidad de lugares:* " +
    cantidad +
    "\n" +

    "💰 *Total:* " +
    formatearPrecio(total) +
    "\n\n" +

    "💳 *DATOS PARA TRANSFERIR*\n\n" +

    "🏦 *Alias:* riocristalino.viajes\n" +
    "👤 *Titular:* Antonio Francisco Colomba\n\n" +

    "📎 *Comprobante:* Pendiente de envío\n\n" +

    "━━━━━━━━━━━━━━━━━━━━\n" +

    "✅ *Reserva iniciada correctamente.*\n" +
    "📲 Enviá el comprobante por este medio para confirmar tu lugar.\n\n" +

    "🚌 ¡Gracias por viajar con Río Cristalino!";
    const urlWhatsApp =
    "https://wa.me/" +
    numeroWhatsApp +
    "?text=" +
    encodeURIComponent(
        mensajeWhatsApp
    );
                // ==========================================
                // MENSAJE EN LA WEB
                // ==========================================

                const mensaje =
                    document.getElementById(
                        "mensajeReserva"
                    );


                if (mensaje) {

                    mensaje.innerHTML = `

                        <strong>
                            ¡Reserva iniciada!
                        </strong>

                        <br><br>

                        ${nombre}, reservaste

                        <strong>
                            ${cantidad}
                            lugar${cantidad > 1 ? "es" : ""}
                        </strong>

                        para:

                        <br><br>

                        <strong>
                            ${
                                eventoSeleccionado.titulo ||
                                eventoSeleccionado.nombre
                            }
                        </strong>

                        <br>

                        📅 ${fechaReserva}

                        <br>

                        📍 ${eventoSeleccionado.lugar}

                        <br><br>

                        Total:

                        <strong>
                            ${formatearPrecio(total)}
                        </strong>

                    `;


                    mensaje.style.display =
                        "block";

                }


                // ==========================================
                // WHATSAPP
                // ==========================================

                window.open(
                    urlWhatsApp,
                    "_blank"
                );

            }
        );

    }


    // ==========================================
    // INICIAR
    // ==========================================

    cargarEventosDesdeSupabase()
        .then(function (cargados) {

            if (!cargados) {
                return;
            }

            mostrarEventos("todos");

            mostrarProximosEventos();

            mostrarFestivales();

        });

});
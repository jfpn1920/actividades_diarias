//---------------------------------------//
//--|funcionalidad_actividades_diarias|--//
//---------------------------------------//
const campoActividad = document.getElementById("actividad");
const botonAgregar = document.getElementById("agregar");
const listaActividades = document.getElementById("listaActividades");
const botonLimpiar = document.getElementById("limpiarCompletadas");
const botonEliminarTodo = document.getElementById("eliminarTodo");
const mensaje = document.getElementById("mensaje");
const total = document.getElementById("total");
const completadas = document.getElementById("completadas");
const pendientes = document.getElementById("pendientes");
const contador = document.getElementById("contador");
//-----------------------------------//
//--|guardando_los_datos_iniciales|--//
//-----------------------------------//
const datosIniciales = [
    {
        id: 1,
        nombre: "Estudiar programación",
        completada: false
    },
    {
        id: 2,
        nombre: "Leer durante 30 minutos",
        completada: false
    },
    {
        id: 3,
        nombre: "Organizar el escritorio",
        completada: true
    }
];
//-----------------------------------------------------//
//--|obtener_y_guardar_los_datos_usando_localstorage|--//
//-----------------------------------------------------//
function obtenerDatos() {
    const datosGuardados = localStorage.getItem("actividades_diarias");
    if (datosGuardados) {
        return JSON.parse(datosGuardados);
    }
    return datosIniciales;
}
function guardarDatos(actividades) {
    localStorage.setItem("actividades_diarias", JSON.stringify(actividades));
}
//-----------------------------//
//--|mostrar_las_actividades|--//
//-----------------------------//
function mostrarActividades() {
    const actividades = obtenerDatos();
    listaActividades.innerHTML = "";
    if (actividades.length === 0) {
        listaActividades.innerHTML = `
            <p class="sin_actividades">No hay actividades registradas.</p>
        `;
        actualizarResumen(actividades);
        return;
    }
    actividades.forEach((actividad) => {
        const elemento = document.createElement("div");
        elemento.className = "actividad";
        if (actividad.completada) {
            elemento.classList.add("completada");
        }
        elemento.innerHTML = `
            <input type="checkbox" class="casilla" ${actividad.completada ? "checked" : ""}>
            <span class="texto_actividad">${actividad.nombre}</span>
            <button class="boton_eliminar"><i class="fa-solid fa-trash"></i></button>
        `;
        listaActividades.appendChild(elemento);
        agregarEventos(elemento, actividad.id);
    });
    actualizarResumen(actividades);
}
//------------------------------//
//--|eventos_de_las_actividad|--//
//------------------------------//
function agregarEventos(elemento, id) {
    const casilla = elemento.querySelector(".casilla");
    const botonEliminar = elemento.querySelector(".boton_eliminar");
    casilla.addEventListener("change", () => {
        cambiarEstado(id);
    });
    botonEliminar.addEventListener("click", () => {
        eliminarActividad(id);
    });
}
//-----------------------------//
//--|agregar_las_actividades|--//
//-----------------------------//
function agregarActividad() {
    const nombre = campoActividad.value.trim();
    if (nombre === "") {
        mostrarMensaje("Escribe una actividad.");
        return;
    }
    const actividades = obtenerDatos();
    const nuevaActividad = {
        id: Date.now(),
        nombre: nombre,
        completada: false
    };
    actividades.push(nuevaActividad);
    guardarDatos(actividades);
    mostrarActividades();
    campoActividad.value = "";
    campoActividad.focus();
    mostrarMensaje("Actividad agregada correctamente.");
}
//-----------------------//
//--|cambiar_el_estado|--//
//-----------------------//
function cambiarEstado(id) {
    const actividades = obtenerDatos();
    const actividad = actividades.find((item) => {
        return item.id === id;
    });
    if (actividad) {
        actividad.completada = !actividad.completada;
    }
    guardarDatos(actividades);
    mostrarActividades();
}
//----------------------------//
//--|eliminar_las_actividad|--//
//----------------------------//
function eliminarActividad(id) {
    const actividades = obtenerDatos();
    const nuevasActividades = actividades.filter((item) => {
        return item.id !== id;
    });
    guardarDatos(nuevasActividades);
    mostrarActividades();
}
//---------------------------//
//--|actualizar_el_resumen|--//
//---------------------------//
function actualizarResumen(actividades) {
    const totalActividades = actividades.length;
    const totalCompletadas = actividades.filter((item) => {
        return item.completada;
    }).length;
    const totalPendientes = totalActividades - totalCompletadas;
    total.textContent = totalActividades;
    completadas.textContent = totalCompletadas;
    pendientes.textContent = totalPendientes;
    contador.textContent = `${totalActividades} actividades`;
}
//-------------------------//
//--|limpiar_completados|--//
//-------------------------//
function limpiarCompletadas() {
    const actividades = obtenerDatos();
    const pendientesActuales = actividades.filter((item) => {
        return !item.completada;
    });
    guardarDatos(pendientesActuales);
    mostrarActividades();
}
//---------------------------------------//
//--|eliminar_todo_usando_localstorage|--//
//---------------------------------------//
function eliminarTodo() {
    const confirmar = confirm("¿Deseas eliminar todas las actividades?");
    if (confirmar) {
        localStorage.removeItem("actividades_diarias");
        mostrarActividades();
        mostrarMensaje("Todas las actividades fueron eliminadas.");
    }
}
//--------------------------//
//--|mostrar_los_mensajes|--//
//--------------------------//
function mostrarMensaje(texto) {
    mensaje.textContent = texto;
    setTimeout(() => {
        mensaje.textContent = "";
    }, 2500);
}
/*------------------------------------*/
/*--|eventos_principales_a_un_click|--*/
/*------------------------------------*/
botonAgregar.addEventListener("click", agregarActividad);
botonLimpiar.addEventListener("click", limpiarCompletadas);
botonEliminarTodo.addEventListener("click", eliminarTodo);
campoActividad.addEventListener("keydown", (evento) => {
    if (evento.key === "Enter") {
        agregarActividad();
    }
});
/*----------------------*/
/*--|cargar_los_datos|--*/
/*----------------------*/
function cargarDatos() {
    mostrarActividades();
}
cargarDatos();
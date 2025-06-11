const API_URL = "https://retoolapi.dev/DAuYMe/data"

//Funcion que manda a traer el JSON(funcion asincrona)
async function obtenerCitas() {
    //Respuesta del servidor
    const resp = await fetch(API_URL); //Se hace una llamada al endpoint 

    //Pasamos a JSON la respuesta del servidor
    const data = await resp.json(); //JSON

    //Enviamos el JSON que nos manda la API a la funcion que crea la tabla en HTML
    mostrarDatos(data);
}

//La funcion lleva un parametro "datos que representa al JSON"
function mostrarDatos(datos){
    //Se llama al tbody dentro del elemento con id "tabla"
    const tabla = document.querySelector('#tabla tbody');
    tabla.innerHTML = ''; //Vaciamos el contenido de la tabla

    
    datos.forEach(cita => {
        tabla.innerHTML +=  `
        <tr>
            <td>${cita.id}</td>
            <td>${cita.Persona}</td>
            <td>${cita.Fecha}</td>

            <td>
                <button onClick="">Editar </button>
                <button onClick="EliminarCita(${cita.id})">Eliminar </button>
            </td>
        </tr>
        `
    });
}
obtenerCitas();

//Agregar una nueva cita

const modal = document.getElementById("modal-agregar"); //Cuadro de dialogo
const btnAgregar = document.getElementById("btnAbrirModal"); // + para abrir
const btnCerrar = document.getElementById("btnCerrarModal"); // x para cerrar

btnAgregar.addEventListener("click" , () => {
    modal.showModal(); //Abril el modal al hacer click al boton
});

btnCerrar.addEventListener("click", () =>{
    modal.close();
})

//Agregar una nueva cita desde el formulario
document.getElementById("frmAgregar").addEventListener("submit", async e => {
    e.preventDefault(); // "e" Representa Event Submit que evita que el formulario se envie de golpe

    //Captuamos los valores del formulario
    const Persona = document.getElementById("nombre").value.trim();
    const Fecha = document.getElementById("fecha").value.trim();
    
    //Validacion basica
    if(!Persona||!Fecha){
        alert("Complete todos los campos")
        return; //Evita que el formulario se envie
    }

       

    //Llamar a la API para enviar la cita
    const respuesta = await fetch (API_URL, {
        method: "POST",
        headers: {'Content-Type': 'application/json'},
        body: JSON.stringify({Fecha, Persona})
    });

    if(respuesta.ok){
        alert("Cita agendada correctamente");

        //Limpiar el formulario y cerrar el modal
        document.getElementById("frmAgregar").reset();

        modal.close();
        
        //Recargamos la tabla
        obtenerCitas();
    }
    else{
        alert("Ocurrio un error al agendar una cita");
    }
})

//Funcion para borrar registros
//Para eliminar necesitamos el parametro del id

async function EliminarCita(id) {
    const confirmacion = confirm("¿Estás seguro que desear eliminar esta cita?");

    //validamos si el usuario dijo que si desea eliminar
    if(confirmacion){
        //${} indica qque es una variable
        await fetch(`${API_URL}/${id}`, {method: "DELETE"});

        //Recargamos la tabla para ver la eliminacion
        obtenerCitas();
    }
}
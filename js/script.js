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
        //Por cada fila insertada cambio el formato de la fecha para que me la muestre en aa/mm/yy y su respectiva hora
        let fecha = new Date(cita.Fecha).toLocaleString();
        tabla.innerHTML +=  `
        <tr>
            <td>${cita.id}</td>
            <td>${cita.Persona}</td>
            <td>${fecha}</td>

            <td>
                <button onClick="abrirModalEditar(${cita.id} , '${cita.Persona}', '${cita.Fecha}')">Editar </button>
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

//Proceso para editar una cita
const modalEditar = document.getElementById("modal-editar");
const btnCerrarEditar = document.getElementById("btnCerrarEditar");

btnCerrarEditar.addEventListener("click" , () => {
    modalEditar.close(); //Cerrar el modal
});

function abrirModalEditar (id,Persona,Fecha){
    let fecha2 = new Date(Fecha);

     //Conversion de formato a YYYY-MM-DD HH:MM
    const dia = fecha2.getDate().toString().padStart(2, '0');
    const mes = (fecha2.getMonth() + 1).toString().padStart(2, '0');
    const anio = fecha2.getFullYear();
    const hora = fecha2.getHours().toString().padStart(2, '0');
    const minuto = fecha2.getMinutes().toString().padStart(2, '0');

    const fechaFormateada = `${anio}-${mes}-${dia} ${hora}:${minuto}`;

    //Se agregan los valores del registro en los input
    document.getElementById("idEditar").value = id;
    document.getElementById("nombreEditar").value = Persona;
    
    document.getElementById("fechaEditar").value = fechaFormateada;
    
    //Modal se abre despues de agregar los valores del input
    modalEditar.showModal();

}

document.getElementById("frmEditar").addEventListener("submit", async e => {
    e.preventDefault(); //Evita que el formulario se envie
    
    const id = document.getElementById("idEditar").value;
    const nombre = document.getElementById("nombreEditar").value.trim();
    const fecha = document.getElementById("fechaEditar").value.trim();
    
    if(!id|| !nombre || !fecha){
        alert("Complete todos los campos");
        return; //Evita que el código se siga ejecutando
    }

        //Llamada a la API
        const respuesta = await fetch(`${API_URL}/${id}`, {
            method: "PUT",
            headers: {"Content-Type": "application/json"},
            body: JSON.stringify({Fecha: fecha, Persona: nombre})
        });

    if(respuesta.ok){
        alert("Registro Actualizado con éxito");//Confirmación
        modalEditar.close();//Cerramos el modal
        obtenerCitas();//Actualizamos la lista
    }
    else{
        alert("Hubo un error al actualizar");
    }
});


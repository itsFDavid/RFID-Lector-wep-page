const buttonRegistrar = document.getElementById('agregarBtn');

const ws = new WebSocket('ws://localhost:3000');

ws.onopen = () => {
    console.log('Conexión exitosa al servidor');
}

ws.onmessage = (message) => {
   const data = JSON.parse(message.data);
   const {No_Tarjeta} = data;
   if(!No_Tarjeta){     
        Swal.fire({
            html: data.message,
            timer: 2500,
            timerProgressBar: true,
            didOpen: () => {
                Swal.showLoading()
            }
        })
   } else {
    Swal.fire({
        html: `No. de tarjeta a registrar: 
            <strong>${No_Tarjeta}</strong>`,
        timer: 1000,
        timerProgressBar: true,
        didOpen: () => {
            Swal.showLoading()
        }
        })
   }
}

const fetchCreate = async (data) => {
    console.log("Datos a enviar:", data);
    const { no_tarjeta } = data;
    if (!no_tarjeta) {
        Swal.fire({
            title: "Error!",
            text: "No se pudo obtener el número de tarjeta",
            icon: "error",
        });
        return;
    }

    try {
        console.log("Enviando datos al servidor...");
        const resp = await fetch('http://localhost:3000/create',{
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(data)
        });
        console.log("Respuesta del servidor:", resp);
        const response = await resp.text();

        console.log("Respuesta del servidor:", response);

        if (resp.status !== 200) {
            console.log("Error en la petición:", response);
            Swal.fire({
                title: "Error!",
                text: response,
                icon: "error",
            });
        } else {
            console.log("Registro exitoso:", response);
            Swal.fire({
                title: "Éxito!",
                text: response,
                icon: "success",
            });
        }
    } catch (error) {
        console.error("Error during fetch:", error);
        Swal.fire({
            title: "Error!",
            text: "Hubo un problema al registrar los datos",
            icon: "error",
        });
    }
    
};

buttonRegistrar.addEventListener('click', async (e) => {
    e.preventDefault();
    
    const nombre = document.getElementById('nombre').value;
    const apellido = document.getElementById('apellido').value;
    const matricula = document.getElementById('matricula').value;
    const carrera = document.getElementById('carrera').value;
    const fechaNacimiento = document.getElementById('fechaNacimiento').value;
    let no_tarjeta;

    try {
        const response = await fetch('http://localhost:3000/data');
        no_tarjeta = await response.json();
    } catch (error) {
        console.error("Error fetching tarjeta data:", error);
        Swal.fire({
            title: "Error!",
            text: "No se pudo obtener el número de tarjeta",
            icon: "error",
        });
        return;
    }

    const data = {
        nombre,
        apellido,
        matricula,
        carrera,
        fechaNacimiento,
        no_tarjeta
    };

    fetchCreate(data);
});

const restart = document.getElementById('restart');

restart.addEventListener('click', () => {
    // Ejemplo utilizando fetch para reiniciar el servidor
    fetch('http://localhost:3000/restart-server')
    .then(response => response.json())
    .then(data => {
        Swal.fire({
            title: "Servidor reiniciado",
            text: data.message,
            icon: "success",
        });
    })
    setTimeout(() => {
        location.reload();
    }, 2500);
});
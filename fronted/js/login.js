const iniciar= document.getElementById('Iniciar')
iniciar.addEventListener('click', async () => {
    const ws = new WebSocket('ws://localhost:3000');
    ws.onopen = () => {
        console.log('Conexión abierta');
    };



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
                html: `No. de tarjeta leida: 
                    <strong>${No_Tarjeta}</strong>`,
                timer: 1000,
                timerProgressBar: true,
                didOpen: () => {
                    Swal.showLoading()
                }
                })
            }
        }
    
    let no_tarjeta
    try{
        const response = await fetch('http://localhost:3000/data');
        no_tarjeta = await response.json();
        if(response.status === 500){
            Swal.fire({
                title: "Error!",
                text: "No se pudo obtener el número de tarjeta",
                icon: "error",
            });
        }
        if(response.status === 404){
            Swal.fire({
                title: "Error!",
                text: "No se pudo obtener el número de tarjeta",
                icon: "error",
            });
        }
    }
    catch(error){
       Swal.fire({
           title: "Error!",
           text: "No se pudo obtener el número de tarjeta",
           icon: "error",
       });
    }

    try{
        const URL = `http://localhost:3000/login/${no_tarjeta}`;
        const response = await fetch(URL);
        const data = await response.json();
        if(response.status === 500){
            Swal.fire({
                title: "Error!",
                text: data.message,
                icon: "error",
            });
        }
        if(response.status === 404){
            Swal.fire({
                title: "Error!",
                text: data.message,
                icon: "error",
            });
        }


        const $no_tarjeta= document.getElementById('tarjeta')
        const $nombre=document.getElementById('nombre')
        const $apellido= document.getElementById('apellido')
        const $matricula= document.getElementById('matricula')
        const $carrera= document.getElementById('carrera')
        const $edad= document.getElementById('edad')

        $no_tarjeta.innerHTML= no_tarjeta
        $nombre.innerHTML= data.nombre
        $apellido.innerHTML= data.apellido
        $matricula.innerHTML= data.matricula
        $carrera.innerHTML= data.carrera
        $edad.innerHTML= data.edad

       
    }catch(error){
        Swal.fire({
            title: "Error!",
            text: "No se pudo obtener la información del usuario",
            icon: "error",
        });
    }
    


});

const restart = document.getElementById('restart');

restart.addEventListener('click', () => {
    // Ejemplo utilizando fetch para reiniciar el servidor
    fetch('http://localhost:3000/restart-server')
    setTimeout(() => {
        clearData();
    }, 2500);
});

const clearData= ()=>{
    const $no_tarjeta= document.getElementById('tarjeta')
    const $nombre=document.getElementById('nombre')
    const $apellido= document.getElementById('apellido')
    const $matricula= document.getElementById('matricula')
    const $carrera= document.getElementById('carrera')
    const $edad= document.getElementById('edad')

    $no_tarjeta.innerHTML= ""
    $nombre.innerHTML= ""
    $apellido.innerHTML= ""
    $matricula.innerHTML= ""
    $carrera.innerHTML= ""
    $edad.innerHTML= ""
}
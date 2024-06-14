document.addEventListener('DOMContentLoaded', function() {
    const URL = 'http://localhost:3000/getAllData';
    const table = document.getElementById('tbody');

    const data= fetch(URL)
    .then(response => response.json())
    .then(data => {
        data.forEach(element => {
            const row = document.createElement('tr');
            row.innerHTML = `
                <td>${element.nombre}</td>
                <td>${element.apellido}</td>
                <td>${element.matricula}</td>
                <td>${element.edad}</td>
                <td>${element.carrera}</td>
                <td>${element.no_tarjeta}</td>
                <td>
                    <button class="btn btn-danger">Eliminar</button>
                </td>
            `;
            table.appendChild(row);
        });
    })

});
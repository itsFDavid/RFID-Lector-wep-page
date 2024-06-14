const cors= require("cors")
const { exec } = require('child_process');
const express= require("express")
const {arduinoPort, parser}= require("./utils/arduinoConecction")
const {connection}= require("./utils/bdConection")
const http= require("http")
const WebSocket= require("ws")




const app= express()
const port= 3000

app.use(cors())
app.use(express.json())

const server= http.createServer(app)
const wss= new WebSocket.Server({server})

connection.connect((error)=>{
    if(error) {
        console.error( error.message)
    }else{
        console.log("Conexión exitosa a la base de datos")
    }
});
// Servir archivos estáticos (HTML, CSS, JS)
//app.use(express.static('public'));

// Ruta para obtener datos de estudiantes
app.get('/getAllData', (req, res) => {
    const query = `
    SELECT 
        id, 
        nombre, 
        apellido, 
        matricula, 
        carrera,
        no_tarjeta,
        TIMESTAMPDIFF(YEAR, fechaNacimiento, CURDATE()) AS edad 
    FROM Usuarios
`;
    try{
        connection.query(query, (error, results) => {
            if (error) {
                return res.status(500).json({ error });
            }
            console.log(results);
            return res.json(results);
        });
    }catch(error){
        return res.status(500).json({message:error.message || "No se puede registrar en este momento"})
    }

});
app.post('/create', async (req, res) => {
    
    try {
        const { nombre, apellido, matricula, fechaNacimiento, carrera, no_tarjeta } = req.body;
        const [results] = await new Promise((resolve, reject) => {
            const queryDuplicate = 'SELECT * FROM Usuarios WHERE no_tarjeta = ?';
            connection.query(queryDuplicate, [no_tarjeta], (error, results) => {
                if (error) return reject('Error al verificar duplicado');
                resolve(results);
            });
        });
        if (results) {
            return res.status(400).send('El número de tarjeta ya está registrado');
        }else{
            // Insertar el nuevo usuario
            const query = 'INSERT INTO Usuarios (nombre, apellido, matricula, fechaNacimiento, carrera, no_tarjeta) VALUES (?, ?, ?, ?, ?, ?)';
            connection.query(query, [nombre, apellido, matricula, fechaNacimiento, carrera, no_tarjeta], (error, results) => {
                if (error) {
                    return res.status(500).send("No se puede registrar en este momento");
                }
                res.status(200).send("Usuario registrado exitosamente");
            });
        }
    } catch (error) {
        return res.status(500).send("No se puede registrar en este momento");
    }
});


/*
app.get('/', (req, res) => {
    res.sendFile(__dirname + '/public/Registrar.html');
});

// Ruta para obtener la página de registro (registro.html)
app.get('/table.html', (req, res) => {
    res.sendFile(__dirname + '/public/table.html');
});
*/
app.delete('/delete', (req, res) =>{
    const {id} = req.body;
    connection.query(`DELETE FROM Usuarios WERE id= ${id}`, (error, results) =>{
        if(error) return res.status(500).json({message:error.message || "No se puede eliminar en este momento"});
        else return res.send("Usuario eliminado exitosamente");
        
    });


})
app.get('/login/:no_tarjeta', (req, res) =>{
    try{
        const {no_tarjeta} = req.params;
        const query= `
        SELECT 
            id, 
            nombre, 
            apellido, 
            matricula, 
            carrera,
            no_tarjeta,
            TIMESTAMPDIFF(YEAR, fechaNacimiento, CURDATE()) AS edad 
        FROM Usuarios WHERE no_tarjeta = ?`
        connection.query( query, [no_tarjeta], (error, results) =>{
            if(error) return res.status(500).json({message:"No se puede iniciar sesión en este momento"});
            else if(results.length === 0) return res.status(404).json({message:"Tarjeta no registrada"});
            
            else return res.json(results[0]);
            console.log(results[0]);
        });
    }catch(error){
        return res.status(500).json({message:error.message || "No se puede iniciar sesión en este momento"});
    }
});

app.get('/restart-server', (req, res) => {
    exec('npm run restart:pm2', (error, stdout, stderr) => {
        if (error) {
            console.error(`Error al reiniciar el servidor: ${error}`);
            return res.status(500).send(`Error al reiniciar el servidor: ${error.message}`);
        }
        console.log(`stdout: ${stdout}`);
        console.error(`stderr: ${stderr}`);
        res.send('Servidor reiniciado exitosamente');
    });
});   


app.get("/data", (req, res)=>{
    arduinoPort.write("leerTarjeta");
    try{
        parser.on('data', (data)=>{
            console.log(data)
            const datos= JSON.parse(data)
            const {No_Tarjeta}= datos
            wss.clients.forEach((client)=>{
                if(client.readyState === WebSocket.OPEN){
                    if(!No_Tarjeta){
                        client.send(data)
                    }
                }
            })
            if(No_Tarjeta){
                wss.clients.forEach((client)=>{
                    if(client.readyState === WebSocket.OPEN){
                        client.send(data)
                    }
                })
                return res.json(No_Tarjeta)
                
            }
        })

        parser.on('error', (error)=>{
            return res.status(500).json({message: "No se puede obtener el número de tarjeta en este momento, intente de nuevo más tarde"})
        })
    }catch(error){
        return res.status(500).json({message: "No se puede obtener el número de tarjeta en este momento, intente de nuevo más tarde"})
    }

})


server.listen(port, ()=>{
    console.log(`Server running http://localhost:${port}/`)
});

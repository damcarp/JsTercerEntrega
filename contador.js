document.addEventListener('DOMContentLoaded', () => {
    // Evento para confirmar datos del curso y alumnos
    document.getElementById('confirmarDatos').addEventListener('click', confirmarDatos);
});

function confirmarDatos() {
    const duracionDelCurso = parseInt(document.getElementById('duracionCurso').value);
    const cantidadDeAlumnos = parseInt(document.getElementById('cantidadAlumnos').value);

    // Validación de los datos ingresados
    if (!duracionDelCurso || duracionDelCurso <= 0) {
        alert("Por favor ingresa un número válido para la duración del curso.");
        return;
    }

    if (!cantidadDeAlumnos || cantidadDeAlumnos <= 0) {
        alert("Por favor ingresa un número válido para la cantidad de alumnos.");
        return;
    }

    // Guardar datos iniciales en localStorage
    localStorage.setItem("duracionDelCurso", duracionDelCurso);
    localStorage.setItem("cantidadDeAlumnos", cantidadDeAlumnos);

    // Ocultar formulario de inicio y mostrar formulario de nombres
    document.getElementById('inputs').style.display = 'none';
    document.getElementById('bienvenida').style.display = 'none';

    let nombresHTML = "<h3>Ingresa los nombres de los alumnos:</h3>";
    for (let i = 0; i < cantidadDeAlumnos; i++) {
        nombresHTML += `
            <label for="alumno${i}">Alumno ${i + 1}:</label>
            <input type="text" id="alumno${i}" required><br>            
        `;
    }
    nombresHTML += `<button id="confirmarAlumnos">Confirmar Alumnos</button>`;
    document.getElementById('nombresAlumnos').innerHTML = nombresHTML;

    // Mostrar el formulario de nombres
    document.getElementById('nombresAlumnos').classList.add('show');

    document.getElementById('confirmarAlumnos').addEventListener('click', confirmarAlumnos);

    // Permitir que se confirme con la tecla Enter
    const inputs = document.querySelectorAll('input[type="text"]');
    inputs.forEach(input => {
        input.addEventListener('keydown', (event) => {
            if (event.key === 'Enter') {
                confirmarAlumnos();
            }
        });
    });
}

function confirmarAlumnos() {
    const cantidadDeAlumnos = parseInt(localStorage.getItem('cantidadDeAlumnos'));
    const alumnos = [];

    for (let i = 0; i < cantidadDeAlumnos; i++) {
        const nombre = document.getElementById(`alumno${i}`).value.trim();
        if (!nombre) {
            alert("Por favor ingresa todos los nombres de los alumnos.");
            return;
        }
        // Usar un constructor de objeto para cada alumno
        alumnos.push(new Alumno(nombre));
    }

    // Guardar los nombres de los alumnos en localStorage
    localStorage.setItem("alumnos", JSON.stringify(alumnos));

    // Ocultar formulario de nombres y mostrar los botones para las asistencias
    document.getElementById('nombresAlumnos').style.display = 'none';

    iniciarAsistencia(alumnos);
}

function Alumno(nombre) {
    this.nombre = nombre;
    this.asistencias = 0;
    this.ausencias = 0;
    this.totalDias = 0;

    // Método para registrar asistencia
    this.registrarAsistencia = function(presente) {
        if (presente) {
            this.asistencias++;
        } else {
            this.ausencias++;
        }
        this.totalDias = this.asistencias + this.ausencias;
    };

    // Método para calcular el estado del alumno
    this.getEstado = function() {
        const porcentajeAusencias = (this.ausencias / this.totalDias) * 100;
        return porcentajeAusencias > 30 ? "Reprobado por Inasistencias" : "Aprobado";
    };
}

function iniciarAsistencia(alumnos) {
    const duracionDelCurso = parseInt(localStorage.getItem('duracionDelCurso'));
    let diaActual = 1;

    function tomarAsistencia() {
        if (diaActual > duracionDelCurso) {
            mostrarResultados(alumnos);
            return;
        }

        let asistenciaHTML = `<h3>Día ${diaActual}: Registro de asistencias</h3>`;
        alumnos.forEach((alumno, index) => {
            asistenciaHTML += `
                <label>${alumno.nombre}:</label>
                <div class="presencia">
                    <label><input type="radio" name="presente${index}" value="si"> Presente</label>
                    <label><input type="radio" name="presente${index}" value="no"> Ausente</label>
                </div>
                <hr>
            `;
        });
        asistenciaHTML += `<button id="confirmarAsistencia">Confirmar Asistencias</button>`;
        document.getElementById('resultados').innerHTML = asistenciaHTML;

        // Mostrar el formulario de asistencia
        document.getElementById('resultados').classList.add('show');

        document.getElementById('confirmarAsistencia').addEventListener('click', () => {
            alumnos.forEach((alumno, index) => {
                const presencia = document.querySelector(`input[name="presente${index}"]:checked`);
                if (presencia) {
                    alumno.registrarAsistencia(presencia.value === "si");
                }
            });

            diaActual++;
            tomarAsistencia();
        });
    }

    tomarAsistencia();
}

function mostrarResultados(alumnos) {
    let tablaHTML = `
        <table border="1" cellpadding="5">
            <thead>
                <tr>
                    <th>Alumno</th>
                    <th>Asistencias</th>
                    <th>Ausencias</th>
                    <th>Total</th>
                    <th>Estado</th>
                </tr>
            </thead>
            <tbody>
    `;

    alumnos.forEach((alumno) => {
        tablaHTML += `
            <tr>
                <td>${alumno.nombre}</td>
                <td>${alumno.asistencias}</td>
                <td>${alumno.ausencias}</td>
                <td>${alumno.totalDias}</td>
                <td class="${alumno.getEstado() === "Reprobado por Inasistencias" ? 'reprobado' : 'aprobado'}">${alumno.getEstado()}</td>
            </tr>
        `;
    });

    tablaHTML += "</tbody></table>";

    document.getElementById('resultados').innerHTML = tablaHTML;

    // Mostrar botón de reinicio
    const reiniciarBoton = `<button id="reiniciarContador">Reiniciar Contador</button>`;
    document.getElementById('resultados').insertAdjacentHTML('beforeend', reiniciarBoton);

    document.getElementById('reiniciarContador').addEventListener('click', () => {
        location.reload();
    });
}

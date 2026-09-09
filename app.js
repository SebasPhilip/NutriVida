document.addEventListener('DOMContentLoaded', function() {
    const formLogin = document.getElementById('login');
    const usuarioLogueado = localStorage.getItem('usuarioLogueado');
    const rolUsuario = localStorage.getItem('rolUsuario');
    const paginaActual = window.location.pathname;

    if (!usuarioLogueado && !formLogin) {
        alert('Acceso denegado. Debes iniciar sesión primero.');
        window.location.href = 'LoginNutrivida.html';
        return; 
    }

    const vistasNutri = ['nutricionista.html', 'PerfilNutri.html', 'Registro.html', 'HistorialPacientes.html'];
    const esVistaNutri = vistasNutri.some(vista => paginaActual.includes(vista));

    if (esVistaNutri && rolUsuario !== 'nutricionista' && !formLogin) {
        alert('Acceso Restringido: Área exclusiva para profesionales clínicos.');
        window.location.href = rolUsuario === 'admin' ? 'admin.html' : 'inicio.html';
        return; 
    }
    const vistasAdmin = ['admin.html', 'ClientesPlanes.html'];
    const esVistaAdmin = vistasAdmin.some(vista => paginaActual.includes(vista));

    if (esVistaAdmin && rolUsuario !== 'admin' && !formLogin) {
        alert('Acceso Restringido: Solo administradores de la clínica pueden ver esta página.');
        window.location.href = rolUsuario === 'nutricionista' ? 'nutricionista.html' : 'inicio.html';
        return;
    }
    if (formLogin) {
        formLogin.addEventListener('submit', function(e) {
            e.preventDefault();
            const correo = document.getElementById('correo').value.trim();
            const password = document.getElementById('password').value;
            const dominiosPermitidos = /^[a-zA-Z0-9._%+-]+@(duoc\.cl|profesor\.duoc\.cl|gmail\.com)$/;
            
            if (!dominiosPermitidos.test(correo)) {
                alert('El correo debe terminar en @duoc.cl, @profesor.duoc.cl o @gmail.com');
                return;
            }
            if (password.length < 4 || password.length > 10) {
                alert('La contraseña debe tener entre 4 y 10 caracteres.');
                return;
            }

            let rolAsignado = 'paciente'; 
            
            if (correo.includes('admin')) {
                rolAsignado = 'admin';
                localStorage.setItem('rolUsuario', rolAsignado);
                localStorage.setItem('usuarioLogueado', correo);
                alert('¡Inicio de sesión correcto como Administrador!');
                window.location.href = 'admin.html';
            } else if (correo.includes('nutri')) {
                rolAsignado = 'nutricionista';
                localStorage.setItem('rolUsuario', rolAsignado);
                localStorage.setItem('usuarioLogueado', correo);
                alert('¡Inicio de sesión correcto como Profesional Clínico!');
                window.location.href = 'nutricionista.html';
            } else {
                localStorage.setItem('rolUsuario', rolAsignado);
                localStorage.setItem('usuarioLogueado', correo);
                alert('¡Inicio de sesión correcto!');
                window.location.href = 'inicio.html';
            }
        });
    }
    function manejarModificacionCita() {
        const formulario = document.getElementById('form-agendar');
        const btnAgendar = document.getElementById('btn-agendar');
        
        if (formulario) {
            document.getElementById('profesional').value = "1"; 
            document.getElementById('fecha').value = "2026-09-17"; 
            document.getElementById('hora').value = "15:30";
            document.getElementById('motivo').value = "control";
            
            if (btnAgendar) btnAgendar.textContent = "Guardar Cambios";
            
            formulario.scrollIntoView({ behavior: 'smooth', block: 'center' });
            document.getElementById('fecha').focus();
        }
    }

    function manejarCancelacionCita() {
        if (confirm('¿Estás seguro de que deseas cancelar esta cita?')) {
            document.querySelector('.cita-activa').style.display = 'none';
            document.querySelector('.acciones-cita').innerHTML = '<p style="color: #cc0000; font-weight: bold; margin-top: 15px;">Cita cancelada exitosamente.</p>';
        }
    }

    const btnModificarCita = document.getElementById('btn-modificar');
    if (btnModificarCita) btnModificarCita.addEventListener('click', manejarModificacionCita);

    const btnCancelarCita = document.getElementById('btn-cancelar');
    if (btnCancelarCita) btnCancelarCita.addEventListener('click', manejarCancelacionCita);

    const formAgendar = document.getElementById('form-agendar');
    if (formAgendar) {
        formAgendar.addEventListener('submit', function(e) {
            e.preventDefault();
            
            const selectProfesional = document.getElementById('profesional');
            const profesional = selectProfesional.options[selectProfesional.selectedIndex].text;
            const fecha = document.getElementById('fecha').value;
            const hora = document.getElementById('hora').value;
            const selectMotivo = document.getElementById('motivo');
            const motivo = selectMotivo.options[selectMotivo.selectedIndex].text;
            
            const citaActiva = document.querySelector('.cita-activa');
            citaActiva.innerHTML = `
                <p><strong>Nutricionista:</strong> ${profesional}</p>
                <p><strong>Fecha:</strong> ${fecha}</p>
                <p><strong>Hora:</strong> ${hora}</p>
                <p><strong>Motivo:</strong> ${motivo}</p>
            `;
            citaActiva.style.display = 'block'; 

            const accionesCita = document.querySelector('.acciones-cita');
            accionesCita.innerHTML = `
                <button type="button" class="btn-red" id="btn-modificar">Modificar Hora</button>
                <button type="button" class="btn-red" id="btn-cancelar">Cancelar Hora</button>
            `;
            
            document.getElementById('btn-modificar').addEventListener('click', manejarModificacionCita);
            document.getElementById('btn-cancelar').addEventListener('click', manejarCancelacionCita);

            const btnAgendar = document.getElementById('btn-agendar');
            if (btnAgendar) btnAgendar.textContent = "Confirmar y Agendar";

            alert(`¡Guardado exitosamente! Tu hora con ${profesional} ha quedado fijada para el ${fecha} a las ${hora}.`);
            formAgendar.reset(); 
            document.querySelector('h1').scrollIntoView({ behavior: 'smooth' });

            setTimeout(() => {
                alert(`Recordatorio automático enviado a ${usuarioLogueado} para la cita del ${fecha}.`);
            }, 3000);
        });
    }
    const planActualBox = document.getElementById('plan-actual-box');
    const accionesPlan = document.querySelector('.card .acciones-cita'); 

    const btnEliminarPlan = document.getElementById('btn-eliminar-plan');
    if (btnEliminarPlan) {
        btnEliminarPlan.addEventListener('click', function() {
            if (confirm('¿Estás seguro de que deseas eliminar tu plan actual? Se perderá el seguimiento.')) {
                if (planActualBox) planActualBox.style.display = 'none';
                if (accionesPlan) accionesPlan.style.display = 'none';
                alert('Plan eliminado correctamente.');
            }
        });
    }

    const btnCambiarPlan = document.getElementById('btn-cambiar-plan');
    if (btnCambiarPlan) {
        btnCambiarPlan.addEventListener('click', function() {
            const formulario = document.getElementById('form-planes');
            if (formulario) formulario.scrollIntoView({ behavior: 'smooth', block: 'center' });
            
            const selectTipo = document.getElementById('tipo_servicio');
            if (selectTipo) selectTipo.focus();
        });
    }

    const formPlanes = document.getElementById('form-planes');
    if (formPlanes) {
        const catalogo = {
            consulta: [
                { id: 'CN001', nombre: 'Primera consulta (50 min)', precio: '$35.000 CLP', desc: 'Evaluación inicial: anamnesis, antropometría completa y diseño del primer plan.' },
                { id: 'CN002', nombre: 'Control seguimiento (30 min)', precio: '$25.000 CLP', desc: 'Seguimiento mensual: medición de indicadores y ajuste del plan.' }
            ],
            plan: [
                { id: 'PL001', nombre: 'Plan pérdida de peso (1 mes)', precio: '$65.000 CLP', desc: '1 consulta + 1 control quincenal + plan + WhatsApp.' },
                { id: 'PL002', nombre: 'Plan pérdida de peso (3 meses)', precio: '$170.000 CLP', desc: '1 consulta + 5 controles + 3 planes + seguimiento.' }
            ]
        };

        const selectTipo = document.getElementById('tipo_servicio');
        const selectEspecifico = document.getElementById('servicio_especifico');
        const precioBox = document.getElementById('precio-box');
        const precioValor = document.getElementById('precio-valor');
        const precioDesc = document.getElementById('precio-desc');

        if (selectTipo) {
            selectTipo.addEventListener('change', function() {
                const categoria = this.value;
                selectEspecifico.innerHTML = '<option value="">-- Selecciona el servicio --</option>';
                precioBox.style.display = 'none';
                
                if (categoria) {
                    selectEspecifico.disabled = false;
                    catalogo[categoria].forEach(item => {
                        let opcion = document.createElement('option');
                        opcion.value = item.id;
                        opcion.text = item.nombre;
                        selectEspecifico.appendChild(opcion);
                    });
                } else {
                    selectEspecifico.disabled = true;
                }
            });
        }

        if (selectEspecifico) {
            selectEspecifico.addEventListener('change', function() {
                const idServicio = this.value;
                const categoria = selectTipo.value;
                
                if (idServicio && categoria) {
                    const servicio = catalogo[categoria].find(s => s.id === idServicio);
                    if (servicio) {
                        precioValor.textContent = servicio.precio;
                        precioDesc.textContent = servicio.desc;
                        precioBox.style.display = 'block'; 
                    }
                } else {
                    precioBox.style.display = 'none';
                }
            });
        }

        formPlanes.addEventListener('submit', function(e) {
            e.preventDefault();
            const categoria = selectTipo.value;
            const idServicio = selectEspecifico.value;
            
            if (categoria && idServicio) {
                const servicio = catalogo[categoria].find(s => s.id === idServicio);
                if (servicio && planActualBox) {
                    planActualBox.innerHTML = `
                        <p class="plan-titulo">[${servicio.id}] ${servicio.nombre}</p>
                        <p><strong>Modalidad:</strong> Presencial / Online</p>
                        <p><strong>Valor:</strong> ${servicio.precio}</p>
                        <p><strong>Descripción:</strong> ${servicio.desc}</p>
                    `;
                    planActualBox.style.display = 'block'; 
                    if (accionesPlan) accionesPlan.style.display = 'flex'; 
                    
                    alert('¡Plan solicitado y actualizado con éxito!');
                    formPlanes.reset();
                    selectEspecifico.innerHTML = '<option value="">-- Selecciona primero la categoría --</option>';
                    selectEspecifico.disabled = true;
                    precioBox.style.display = 'none';
                    document.querySelector('h1').scrollIntoView({ behavior: 'smooth' });
                }
            }
        });
    }


    const botonesPerfil = document.querySelectorAll('button.btn-red');
    
    botonesPerfil.forEach(btn => {
        if (btn.textContent === 'Editar Mis Datos') {
            btn.addEventListener('click', function() {
                const nuevoTelefono = prompt('Actualizar número de contacto de la consulta:', '+56 9 8765 4321');
                
                if (nuevoTelefono && nuevoTelefono.trim() !== '') {
                    const parrafos = document.querySelectorAll('.card p');
                    parrafos.forEach(p => {
                        if (p.innerHTML.includes('<strong>Teléfono:</strong>')) {
                            p.innerHTML = `<strong>Teléfono:</strong> ${nuevoTelefono}`;
                        }
                    });
                    alert('¡Datos de contacto actualizados con éxito!');
                }
            });
        }
    });

    const formMediciones = document.getElementById('form-mediciones');
    
    if (formMediciones) {
        formMediciones.addEventListener('submit', function(e) {
            e.preventDefault();
            
            const pacienteSelect = document.getElementById('paciente-select');
            const pacienteNombre = pacienteSelect.options[pacienteSelect.selectedIndex].text;
            const peso = parseFloat(document.getElementById('peso').value);
            const estaturaCm = parseFloat(document.getElementById('estatura').value);
            
            const estaturaM = estaturaCm / 100;
            const imc = (peso / (estaturaM * estaturaM)).toFixed(1);
            
            alert(`¡Ficha clínica actualizada exitosamente para ${pacienteNombre}!\n\nEl sistema calculó un IMC de: ${imc}`);
            
            formMediciones.reset();
            window.location.href = 'nutricionista.html'; 
        });
    }

    const buscadorPaciente = document.getElementById('buscador-paciente');
    const contenedorHistorial = document.getElementById('tabla-historial-container');
    const cuerpoHistorial = document.getElementById('cuerpo-historial');
    const tituloHistorial = document.getElementById('nombre-paciente-historial');

    if (buscadorPaciente && contenedorHistorial) {
        const baseDatosClinica = {
            "1": [
                { fecha: "17/08/2026", peso: 78.5, estatura: 175, cintura: 92, imc: 25.6 },
                { fecha: "17/07/2026", peso: 80.2, estatura: 175, cintura: 95, imc: 26.2 }
            ],
            "2": [
                { fecha: "20/08/2026", peso: 62.0, estatura: 160, cintura: 70, imc: 24.2 }
            ],
            "3": [
                { fecha: "10/08/2026", peso: 95.0, estatura: 180, cintura: 105, imc: 29.3 },
                { fecha: "10/07/2026", peso: 98.5, estatura: 180, cintura: 109, imc: 30.4 },
                { fecha: "10/06/2026", peso: 102.0, estatura: 180, cintura: 112, imc: 31.5 }
            ]
        };

        buscadorPaciente.addEventListener('change', function() {
            const idPaciente = this.value;
            const nombrePaciente = this.options[this.selectedIndex].text;

            if (idPaciente && baseDatosClinica[idPaciente]) {
                tituloHistorial.textContent = `Historial de Progreso: ${nombrePaciente}`;
                cuerpoHistorial.innerHTML = ""; 
                
                baseDatosClinica[idPaciente].forEach(registro => {
                    const fila = `
                        <tr style="text-align: center; border-bottom: 1px solid #eee; background-color: #fff8f8;">
                            <td style="padding: 12px; border: 1px solid #ff9999;">${registro.fecha}</td>
                            <td style="padding: 12px; border: 1px solid #ff9999;">${registro.peso}</td>
                            <td style="padding: 12px; border: 1px solid #ff9999;">${registro.estatura}</td>
                            <td style="padding: 12px; border: 1px solid #ff9999;">${registro.cintura}</td>
                            <td style="padding: 12px; border: 1px solid #ff9999; font-weight: bold; color: #cc0000;">${registro.imc}</td>
                        </tr>
                    `;
                    cuerpoHistorial.innerHTML += fila;
                });
                
                contenedorHistorial.style.display = "block";
            } else {
                contenedorHistorial.style.display = "none";
            }
        });
    }

    const btnFiltrar = document.getElementById('btn-filtrar');
    
    if (btnFiltrar) {
        btnFiltrar.addEventListener('click', function() {
            const periodo = document.getElementById('mes-estadisticas').value;
            
            const atenciones = document.getElementById('stat-atenciones');
            const inasistencia = document.getElementById('stat-inasistencia');
            const distAndrea = document.getElementById('dist-andrea');
            const distCarlos = document.getElementById('dist-carlos');
            const distCamila = document.getElementById('dist-camila');
            
            const barAndrea = document.getElementById('bar-andrea');
            const barCarlos = document.getElementById('bar-carlos');
            const barCamila = document.getElementById('bar-camila');

            if (periodo === 'anterior') {
                atenciones.textContent = "185";
                inasistencia.textContent = "8%";
                
                distAndrea.textContent = "90";
                barAndrea.style.width = "48%";
                
                distCarlos.textContent = "55";
                barCarlos.style.width = "30%";
                
                distCamila.textContent = "40";
                barCamila.style.width = "22%";
            } else {
                atenciones.textContent = "142";
                inasistencia.textContent = "12%";
                
                distAndrea.textContent = "65";
                barAndrea.style.width = "45%";
                
                distCarlos.textContent = "45";
                barCarlos.style.width = "31%";
                
                distCamila.textContent = "32";
                barCamila.style.width = "24%";
            }
            
            alert('Estadísticas actualizadas según el período seleccionado.');
        });
    }

});
function mostrarFormulario(tipo) {
  document.getElementById("login-form").style.display = tipo === "login" ? "block" : "none";
  document.getElementById("registro-form").style.display = tipo === "registro" ? "block" : "none";
  document.getElementById("recuperar-form").style.display = tipo === "recuperar" ? "block" : "none";
}

async function hashPassword(password) {
  const encoder = new TextEncoder();
  const data = encoder.encode(password);
  const hash = await crypto.subtle.digest("SHA-256", data);
  return Array.from(new Uint8Array(hash)).map(b => b.toString(16).padStart(2, "0")).join("");
}

async function registrarUsuario() {
  const nombre = document.getElementById("reg-nombre").value.trim();
  const correo = document.getElementById("reg-correo").value.trim().toLowerCase();
  const usuario = document.getElementById("reg-usuario").value.trim().toLowerCase();
  const pass = document.getElementById("reg-pass").value;

  if (!nombre || !correo || !usuario || !pass) {
    return alert("Completa todos los campos");
  }

  if (localStorage.getItem("usuario-" + usuario)) {
    return alert("El usuario ya existe");
  }

  const hash = await hashPassword(pass);
  const data = {
    nombreCompleto: nombre,
    correo,
    hashPassword: hash,
    progreso: {},
    notas: {}
  };

  localStorage.setItem("usuario-" + usuario, JSON.stringify(data));
  alert("Cuenta creada con éxito. Ahora puedes iniciar sesión.");
  mostrarFormulario("login");
}

async function iniciarSesion() {
  const usuario = document.getElementById("login-user").value.trim().toLowerCase();
  const pass = document.getElementById("login-pass").value;

  const data = JSON.parse(localStorage.getItem("usuario-" + usuario) || "{}");
  if (!data || !data.hashPassword) return alert("Usuario no encontrado");

  const hash = await hashPassword(pass);
  if (hash !== data.hashPassword) return alert("Contraseña incorrecta");

  localStorage.setItem("usuario-activo", usuario);
  cargarMalla(data, usuario);
}

function recuperarContrasena() {
  const usuario = document.getElementById("rec-user").value.trim().toLowerCase();
  const correo = document.getElementById("rec-correo").value.trim().toLowerCase();

  const data = JSON.parse(localStorage.getItem("usuario-" + usuario) || "{}");
  if (!data || !data.correo) return alert("Usuario no encontrado");

  if (data.correo !== correo) return alert("Correo no coincide");

  alert("Correo verificado. Por seguridad no mostramos contraseñas, pero puedes crear una nueva cuenta.");
}

function cerrarSesion() {
  localStorage.removeItem("usuario-activo");
  location.reload();
}

function toggleTheme() {
  const body = document.body;
  const boton = document.querySelector(".theme-toggle");

  body.classList.toggle("dark");
  const tema = body.classList.contains("dark") ? "dark" : "light";
  localStorage.setItem("malla-tema", tema);

  if (boton) {
    boton.textContent = tema === "dark" ? "☀️ Cambiar tema" : "🌙 Cambiar tema";
  }
}

if (localStorage.getItem("malla-tema") === "dark") {
  document.body.classList.add("dark");
  const boton = document.querySelector(".theme-toggle");
  if (boton) boton.textContent = "☀️ Cambiar tema";
}

function cargarMalla(data, usuario) {
  document.getElementById("login-form").style.display = "none";
  document.getElementById("registro-form").style.display = "none";
  document.getElementById("recuperar-form").style.display = "none";
  document.getElementById("contenido-malla").style.display = "block";

  document.getElementById("saludo").textContent = `👋 ¡Hola, ${data.nombreCompleto}!`;

  const grid = document.getElementById("malla-grid");
  const resumen = document.getElementById("resumen-creditos");
  grid.innerHTML = "";

  const progreso = data.progreso || {};
  const notas = data.notas || {};

  const listaSemestres = Object.keys(malla);

  listaSemestres.forEach((semestre) => {
    const columna = document.createElement("div");
    columna.className = "semestre";

    const h2 = document.createElement("h2");
    h2.textContent = semestre;
    columna.appendChild(h2);

    malla[semestre].forEach((ramo) => {
      const div = document.createElement("div");
      div.className = "ramo";
      const clave = `${semestre} - ${ramo.nombre}`;
      const notaTexto = notas[clave] ? `| ${notas[clave]}` : "| -";
      div.textContent = `${ramo.nombre} | ${ramo.creditos} créditos ${notaTexto}`;

      if (progreso[clave]) div.classList.add("checked");

      const input = document.createElement("input");
      input.type = "text";
      input.placeholder = "Nota (1-7 o A)";
      input.value = notas[clave] || "";

      input.addEventListener("input", () => {
        const valor = input.value.trim().toUpperCase().replace(",", ".");
        if (valor === "A") {
          notas[clave] = "A";
        } else {
          const nota = parseFloat(valor);
          if (!isNaN(nota) && nota >= 1 && nota <= 7) {
            notas[clave] = nota;
          } else {
            delete notas[clave];
          }
        }
        guardar(usuario, progreso, notas);
        actualizarPromedios(usuario, resumen);
      });

      input.addEventListener("click", (e) => e.stopPropagation());

      if (progreso[clave]) div.appendChild(input);

      div.addEventListener("click", () => {
        div.classList.toggle("checked");
        const checked = div.classList.contains("checked");
        progreso[clave] = checked;

        if (checked && !div.contains(input)) div.appendChild(input);
        else if (!checked && div.contains(input)) {
          div.removeChild(input);
          delete notas[clave];
        }

        guardar(usuario, progreso, notas);
        actualizarCreditos(usuario, resumen);
        actualizarPromedios(usuario, resumen);
      });

      columna.appendChild(div);
    });

    const promedioDiv = document.createElement("div");
    promedioDiv.className = "promedio-semestre";
    promedioDiv.id = `promedio-${semestre}`;
    promedioDiv.textContent = "📘 Promedio Semestre: -";
    columna.appendChild(promedioDiv);

    grid.appendChild(columna);
  });

  actualizarCreditos(usuario, resumen);
  actualizarPromedios(usuario, resumen);
  document.querySelector(".malla-container").classList.add("visible");
}

function guardar(usuario, progreso, notas) {
  const data = JSON.parse(localStorage.getItem("usuario-" + usuario));
  data.progreso = progreso;
  data.notas = notas;
  localStorage.setItem("usuario-" + usuario, JSON.stringify(data));
}

function actualizarCreditos(usuario, resumen) {
  const data = JSON.parse(localStorage.getItem("usuario-" + usuario));
  const progreso = data.progreso || {};

  let total = 0;
  let completados = 0;

  Object.keys(malla).forEach((semestre) => {
    malla[semestre].forEach((ramo) => {
      const clave = `${semestre} - ${ramo.nombre}`;
      total += ramo.creditos;
      if (progreso[clave]) completados += ramo.creditos;
    });
  });

  resumen.innerHTML = `Créditos completados: ${completados} / ${total}<br>🎓 Promedio general: <span id="promedio-general">-</span>`;
}

function actualizarPromedios(usuario, resumen) {
  const data = JSON.parse(localStorage.getItem("usuario-" + usuario));
  const progreso = data.progreso || {};
  const notas = data.notas || {};

  let sumaTotal = 0;
  let cantidadNotas = 0;

  Object.keys(malla).forEach((semestre) => {
    let suma = 0;
    let count = 0;

    malla[semestre].forEach((ramo) => {
      const clave = `${semestre} - ${ramo.nombre}`;
      if (progreso[clave] && typeof notas[clave] === "number") {
        suma += notas[clave];
        count++;
      }
    });

    const promedio = count > 0 ? (suma / count).toFixed(1) : "-";
    const promedioDiv = document.getElementById(`promedio-${semestre}`);
    if (promedioDiv) {
      promedioDiv.textContent = `📘 Promedio Semestre: ${promedio}`;
      promedioDiv.classList.remove("promedio-rojo", "promedio-azul", "promedio-negro");

      if (promedio !== "-") {
        const valor = parseFloat(promedio);
        if (valor < 4) {
          promedioDiv.classList.add("promedio-rojo");
        } else if (valor > 4) {
          promedioDiv.classList.add("promedio-azul");
        } else {
          promedioDiv.classList.add("promedio-negro");
        }
      }
    }

    if (count > 0) {
      sumaTotal += suma;
      cantidadNotas += count;
    }
  });

  const promedioFinal = cantidadNotas > 0 ? (sumaTotal / cantidadNotas).toFixed(1) : "-";
  const promedioGeneral = document.getElementById("promedio-general");
  if (promedioGeneral) {
    promedioGeneral.textContent = promedioFinal;
    promedioGeneral.classList.remove("promedio-rojo", "promedio-azul", "promedio-negro");

    if (promedioFinal !== "-") {
      const valor = parseFloat(promedioFinal);
      if (valor < 4) {
        promedioGeneral.classList.add("promedio-rojo");
      } else if (valor > 4) {
        promedioGeneral.classList.add("promedio-azul");
      } else {
        promedioGeneral.classList.add("promedio-negro");
      }
    }
  }
}

const usuarioActivo = localStorage.getItem("usuario-activo");
if (usuarioActivo) {
  const data = JSON.parse(localStorage.getItem("usuario-" + usuarioActivo));
  if (data) {
    cargarMalla(data, usuarioActivo);
  }
}
const malla = {
  "1° Semestre": [
    { nombre: "TRANSFORMACIÓN DIGITAL", creditos: 8 },
    { nombre: "INSTALACIÓN Y CERTIFICACIÓN DE REDES", creditos: 10 },
    { nombre: "SOPORTE EN REDES DE ACCESO Y ANTENA", creditos: 8 },
    { nombre: "SOPORTE COMPUTACIONAL (IT Essentials)", creditos: 8 },
    { nombre: "NIVELACIÓN MATEMÁTICA", creditos: 12 },
    { nombre: "HABILIDADES BÁSICAS DE COMUNICACIÓN", creditos: 8 }
  ],
  "2° Semestre": [
    { nombre: "CONECTIVIDAD ESENCIAL", creditos: 8 },
    { nombre: "INSTALACIONES DOMICILIARIAS TELCO y WIFI", creditos: 8 },
    { nombre: "SOPORTE EN REDES DE FIBRA ÓPTICA", creditos: 8 },
    { nombre: "SISTEMA OPERATIVO SERVIDOR", creditos: 8 },
    { nombre: "PROGRAMACIÓN DE ALGORITMOS", creditos: 10 },
    { nombre: "HABILIDADES DE COMUNICACIÓN EFECTIVA", creditos: 8 },
    { nombre: "FUNDAMENTOS DE ANTROPOLOGÍA", creditos: 4 }
  ],
  "3° Semestre": [
    { nombre: "ROUTING Y SWITCHING", creditos: 10 },
    { nombre: "INTRODUCCIÓN A CIBERSEGURIDAD", creditos: 8 },
    { nombre: "ADMINISTRACIÓN SISTEMA OPERATIVO ENTERPRISE", creditos: 10 },
    { nombre: "MENTALIDAD EMPRENDEDORA", creditos: 6 },
    { nombre: "INGLÉS BÁSICO I", creditos: 8 },
    { nombre: "MATEMÁTICA APLICADA", creditos: 8 },
    { nombre: "ÉTICA PARA EL TRABAJO", creditos: 4 }
  ],
  "4° Semestre": [
    { nombre: "REDES ESCALABLES Y WAN", creditos: 10 },
    { nombre: "SOLUCIONES INALÁMBRICAS", creditos: 8 },
    { nombre: "OPERACIONES EN CIBERSEGURIDAD (CCNA Cyber Ops)", creditos: 8 },
    { nombre: "SERVICIOS CONVERGENTES (Voz, Video y Datos)", creditos: 8 },
    { nombre: "INGLÉS BÁSICO II", creditos: 8 },
    { nombre: "ESTADÍSTICA DESCRIPTIVA", creditos: 8 },
    { nombre: "CURSO DE FORMACIÓN CRISTIANA", creditos: 4 }
  ],
  "5° Semestre": [
    { nombre: "ROUTING Y SWITCHING CORPORATIVO", creditos: 10 },
    { nombre: "SEGURIDAD EN REDES CORPORATIVAS (CCNA Security)", creditos: 10 },
    { nombre: "COMUNICACIONES UNIFICADAS", creditos: 10 },
    { nombre: "INNOVACIÓN EN PRODUCTOS Y SERVICIOS", creditos: 6 },
    { nombre: "INGLÉS ELEMENTAL", creditos: 16 }
  ],
  "6° Semestre": [
    { nombre: "TROUBLESHOOTING", creditos: 10 },
    { nombre: "PROBLEMÁTICAS GLOBALES Y PROTOTIPADO", creditos: 10 },
    { nombre: "GESTIÓN DE RIESGOS EN REDES CORPORATIVAS", creditos: 8 },
    { nombre: "TELEPRESENCIA Y ENTORNOS INNOVADORES DE COLABORACIÓN HUMANA", creditos: 8 },
    { nombre: "INGLÉS INTERMEDIO", creditos: 16 },
    { nombre: "ÉTICA PROFESIONAL", creditos: 4 }
  ],
  "7° Semestre": [
    { nombre: "DISEÑO DE ARQUITECTURA DE RED", creditos: 10 },
    { nombre: "PROGRAMACIÓN Y REDES VIRTUALIZADAS (SDN-NFV)", creditos: 8 },
    { nombre: "CONTROL Y GESTIÓN DE PROYECTOS DE CONECTIVIDAD", creditos: 12 },
    { nombre: "INGLÉS INTERMEDIO ALTO", creditos: 16 }
  ],
  "8° Semestre": [
    { nombre: "CAPSTONE", creditos: 20 },
    { nombre: "PRÁCTICA PROFESIONAL", creditos: 20 }
  ]
};

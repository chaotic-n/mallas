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

const grid = document.getElementById("malla-grid");
const resumen = document.getElementById("resumen-creditos");
const saludo = document.getElementById("saludo");
const logoutBtn = document.getElementById("logout-btn");
const loginForm = document.getElementById("login-form");
const registroForm = document.getElementById("registro-form");
const recuperarForm = document.getElementById("recuperar-form");

let currentUser = localStorage.getItem("malla-nombre") || null;
let progreso = currentUser
  ? JSON.parse(localStorage.getItem(`malla-rendida-${currentUser}`) || "{}")
  : {};
let notas = currentUser
  ? JSON.parse(localStorage.getItem(`malla-notas-${currentUser}`) || "{}")
  : {};

function mostrarRegistro() {
  loginForm.style.display = "none";
  registroForm.style.display = "block";
  recuperarForm.style.display = "none";
}

function mostrarLogin() {
  loginForm.style.display = "block";
  registroForm.style.display = "none";
  recuperarForm.style.display = "none";
}

function mostrarRecuperacion() {
  loginForm.style.display = "none";
  registroForm.style.display = "none";
  recuperarForm.style.display = "block";
}

function registrar() {
  const usuario = document.getElementById("reg-usuario").value.trim();
  const pass = document.getElementById("reg-pass").value;
  const email = document.getElementById("reg-email").value.trim();
  if (!usuario || !pass || !email) return alert("Completa todos los campos.");
  const users = JSON.parse(localStorage.getItem("malla-usuarios") || "{}");
  if (users[usuario]) return alert("El usuario ya existe.");
  users[usuario] = { pass, email };
  localStorage.setItem("malla-usuarios", JSON.stringify(users));
  alert("Cuenta creada. Inicia sesi\u00f3n");
  mostrarLogin();
}

function login() {
  const usuario = document.getElementById("login-usuario").value.trim();
  const pass = document.getElementById("login-pass").value;
  const users = JSON.parse(localStorage.getItem("malla-usuarios") || "{}");
  if (!users[usuario] || users[usuario].pass !== pass)
    return alert("Credenciales incorrectas");
  localStorage.setItem("malla-nombre", usuario);
  currentUser = usuario;
  progreso = JSON.parse(localStorage.getItem(`malla-rendida-${currentUser}`) || "{}");
  notas = JSON.parse(localStorage.getItem(`malla-notas-${currentUser}`) || "{}");
  loginForm.style.display = "none";
  document.getElementById("contenido-malla").style.display = "block";
  saludo.textContent = `👋 \u00a1Hola, ${usuario}!`;
  logoutBtn.style.display = "block";
  crearMalla();
}

function recuperarContrasena() {
  const email = document.getElementById("rec-email").value.trim();
  const users = JSON.parse(localStorage.getItem("malla-usuarios") || "{}");
  const entry = Object.entries(users).find(([u, d]) => d.email === email);
  if (!entry) {
    alert("Correo no encontrado");
  } else {
    const [usuario, datos] = entry;
    alert(`Usuario: ${usuario}\nContrase\u00f1a: ${datos.pass}`);
  }
  mostrarLogin();
}

function crearMalla() {
  grid.innerHTML = "";

  Object.keys(malla).forEach((semestre) => {
    const columna = document.createElement("div");
    columna.className = "semestre";

    const h2 = document.createElement("h2");
    h2.textContent = semestre;
    columna.appendChild(h2);

    const ramos = malla[semestre];
    ramos.forEach((ramo) => {
      const div = document.createElement("div");
      div.className = "ramo";
      div.textContent = `${ramo.nombre} (${ramo.creditos})`;
      div.dataset.semestre = semestre;
      div.dataset.nombre = ramo.nombre;
      div.dataset.creditos = ramo.creditos;

      const clave = `${semestre} - ${ramo.nombre}`;
      if (progreso[clave]) div.classList.add("checked");

      const input = document.createElement("input");
      input.type = "text";
      input.placeholder = "Nota (1-7)";
      input.value = notas[clave] || "";

      input.addEventListener("input", () => {
        const val = input.value.replace(",", ".");
        const num = parseFloat(val);
        if (!isNaN(num) && num >= 1 && num <= 7) {
          notas[clave] = num;
        } else {
          delete notas[clave];
        }
        localStorage.setItem(
          `malla-notas-${currentUser}`,
          JSON.stringify(notas)
        );
        actualizarPromedios();
      });

      input.addEventListener("click", (e) => e.stopPropagation());

      if (progreso[clave]) div.appendChild(input);

      div.addEventListener("click", () => {
        div.classList.toggle("checked");
        const checked = div.classList.contains("checked");
        progreso[clave] = checked;
        localStorage.setItem(
          `malla-rendida-${currentUser}`,
          JSON.stringify(progreso)
        );

        if (checked && !div.contains(input)) {
          div.appendChild(input);
        } else if (!checked && div.contains(input)) {
          div.removeChild(input);
          delete notas[clave];
          localStorage.setItem(
            `malla-notas-${currentUser}`,
            JSON.stringify(notas)
          );
        }

        actualizarCreditos();
        actualizarPromedios();
      });

      columna.appendChild(div);
    });

    const promedioSem = document.createElement("div");
    promedioSem.className = "promedio-semestre";
    promedioSem.id = `promedio-${semestre}`;
    promedioSem.textContent = "📘 Promedio Semestre: -";
    columna.appendChild(promedioSem);

    grid.appendChild(columna);
  });

  actualizarCreditos();
  actualizarPromedios();
}
function actualizarCreditos() {
  const ramos = document.querySelectorAll(".ramo");
  let total = 0;
  let completados = 0;

  ramos.forEach((ramo) => {
    const creditos = parseInt(ramo.dataset.creditos);
    total += creditos;
    if (ramo.classList.contains("checked")) {
      completados += creditos;
    }
  });

  resumen.querySelector("span#promedio-general").textContent = "-";
  resumen.childNodes[0].nodeValue = `Créditos completados: ${completados} / ${total}\n`;
}

function actualizarPromedios() {
  let sumaTotal = 0;
  let cantidadNotas = 0;

  Object.keys(malla).forEach((semestre) => {
    let suma = 0;
    let count = 0;

    malla[semestre].forEach((ramo) => {
      const clave = `${semestre} - ${ramo.nombre}`;
      if (progreso[clave] && notas[clave]) {
        suma += notas[clave];
        count++;
      }
    });

    const promedio = count > 0 ? (suma / count).toFixed(2) : "-";
    const promedioDiv = document.getElementById(`promedio-${semestre}`);
    promedioDiv.textContent = `📘 Promedio Semestre: ${promedio}`;

    if (count > 0) {
      sumaTotal += suma;
      cantidadNotas += count;
    }
  });

  const promedioFinal = cantidadNotas > 0 ? (sumaTotal / cantidadNotas).toFixed(2) : "-";
  document.getElementById("promedio-general").textContent = promedioFinal;
}

function toggleTheme() {
  document.body.classList.toggle("dark");
  localStorage.setItem("malla-tema", document.body.classList.contains("dark") ? "dark" : "light");
}

if (localStorage.getItem("malla-tema") === "dark") {
  document.body.classList.add("dark");
}

const nombreGuardado = localStorage.getItem("malla-nombre");
if (nombreGuardado) {
  loginForm.style.display = "none";
  registroForm.style.display = "none";
  recuperarForm.style.display = "none";
  document.getElementById("contenido-malla").style.display = "block";
  saludo.textContent = `👋 ¡Hola, ${nombreGuardado}!`;
  logoutBtn.style.display = "block";
  crearMalla();
} else {
  mostrarLogin();
  logoutBtn.style.display = "none";
}

function cerrarSesion() {
  const theme = localStorage.getItem("malla-tema");
  localStorage.removeItem("malla-nombre");
  if (theme) localStorage.setItem("malla-tema", theme);
  location.reload();
}

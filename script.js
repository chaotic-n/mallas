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
const progreso = JSON.parse(localStorage.getItem("malla-rendida") || "{}");
const notas = JSON.parse(localStorage.getItem("malla-notas") || {});
function guardarNombre() {
  const nombre = document.getElementById("nombre").value.trim();
  const apellido = document.getElementById("apellido").value.trim();
  if (!nombre || !apellido) return alert("Completa ambos campos.");

  const nombreCompleto = `${nombre} ${apellido}`;
  localStorage.setItem("malla-nombre", nombreCompleto);
  document.getElementById("form-nombre").style.display = "none";
  document.getElementById("contenido-malla").style.display = "block";
  saludo.textContent = `👋 ¡Hola, ${nombreCompleto}!`;
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
        localStorage.setItem("malla-notas", JSON.stringify(notas));
        actualizarPromedios();
      });

      input.addEventListener("click", (e) => e.stopPropagation());

      if (progreso[clave]) div.appendChild(input);

      div.addEventListener("click", () => {
        div.classList.toggle("checked");
        const checked = div.classList.contains("checked");
        progreso[clave] = checked;
        localStorage.setItem("malla-rendida", JSON.stringify(progreso));

        if (checked && !div.contains(input)) {
          div.appendChild(input);
        } else if (!checked && div.contains(input)) {
          div.removeChild(input);
          delete notas[clave];
          localStorage.setItem("malla-notas", JSON.stringify(notas));
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
  document.getElementById("form-nombre").style.display = "none";
  document.getElementById("contenido-malla").style.display = "block";
  saludo.textContent = `👋 ¡Hola, ${nombreGuardado}!`;
}

crearMalla();

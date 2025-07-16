const malla = {
  "1° Semestre": [
    { nombre: "NIVELACIÓN MATEMÁTICA", creditos: 8 },
    { nombre: "SOPORTE COMPUTACIONAL (IT Essentials)", creditos: 8 },
    { nombre: "CURSO DE FORMACIÓN CRISTIANA", creditos: 4 },
    { nombre: "HABILIDADES BÁSICAS DE COMUNICACIÓN", creditos: 4 },
    { nombre: "INGLÉS BÁSICO I", creditos: 4 }
  ],
  "2° Semestre": [
    { nombre: "MATEMÁTICA APLICADA", creditos: 8 },
    { nombre: "SISTEMA OPERATIVO SERVIDOR", creditos: 8 },
    { nombre: "PROGRAMACIÓN DE ALGORITMOS", creditos: 6 },
    { nombre: "HABILIDADES DE COMUNICACIÓN EFECTIVA", creditos: 4 },
    { nombre: "INGLÉS BÁSICO II", creditos: 4 },
    { nombre: "ÉTICA PARA EL TRABAJO", creditos: 4 }
  ],
  "3° Semestre": [
    { nombre: "CONECTIVIDAD ESENCIAL", creditos: 8 },
    { nombre: "INTRODUCCIÓN A CIBERSEGURIDAD", creditos: 6 },
    { nombre: "MENTALIDAD EMPRENDEDORA", creditos: 4 },
    { nombre: "ESTADÍSTICA DESCRIPTIVA", creditos: 6 },
    { nombre: "INGLÉS ELEMENTAL", creditos: 4 },
    { nombre: "FUNDAMENTOS DE ANTROPOLOGÍA", creditos: 4 }
  ],
  "4° Semestre": [
    { nombre: "ROUTING Y SWITCHING", creditos: 8 },
    { nombre: "INSTALACIONES DOMICILIARIAS TELCO Y WIFI", creditos: 6 },
    { nombre: "SOLUCIONES INALÁMBRICAS", creditos: 6 },
    { nombre: "COMUNICACIONES UNIFICADAS", creditos: 6 },
    { nombre: "INNOVACIÓN EN PRODUCTOS Y SERVICIOS", creditos: 4 },
    { nombre: "INGLÉS INTERMEDIO", creditos: 4 },
    { nombre: "CURSO DE FORMACIÓN CRISTIANA", creditos: 4 }
  ],
  "5° Semestre": [
    { nombre: "REDES ESCALABLES Y WAN", creditos: 8 },
    { nombre: "INSTALACIÓN Y CERTIFICACIÓN DE REDES", creditos: 6 },
    { nombre: "SERVICIOS CONVERGENTES (Voz, Video y Datos)", creditos: 6 },
    { nombre: "TELEPRESENCIA Y ENTORNOS DE COLABORACIÓN", creditos: 4 }
  ],
  "6° Semestre": [
    { nombre: "ROUTING Y SWITCHING CORPORATIVO", creditos: 8 },
    { nombre: "SEGURIDAD EN REDES CORPORATIVAS (CCNA Security)", creditos: 6 },
    { nombre: "SOPORTE EN REDES DE FIBRA ÓPTICA", creditos: 6 },
    { nombre: "GESTIÓN DE RIESGOS EN REDES CORPORATIVAS", creditos: 6 },
    { nombre: "ÉTICA PROFESIONAL", creditos: 4 }
  ],
  "7° Semestre": [
    { nombre: "TROUBLESHOOTING", creditos: 8 },
    { nombre: "OPERACIONES EN CIBERSEGURIDAD (CCNA CyberOps)", creditos: 6 },
    { nombre: "PROGRAMACIÓN Y REDES VIRTUALIZADAS (SDN/NFV)", creditos: 6 },
    { nombre: "PROBLEMÁTICAS GLOBALES Y PROTOTIPADO", creditos: 4 },
    { nombre: "CONTROL Y GESTIÓN DE PROYECTOS DE CONECTIVIDAD", creditos: 4 }
  ],
  "8° Semestre": [
    { nombre: "CAPSTONE", creditos: 10 },
    { nombre: "PRÁCTICA PROFESIONAL", creditos: 10 },
    { nombre: "PROCESO DE PORTAFOLIO", creditos: 4 },
    { nombre: "INGLÉS INTERMEDIO ALTO", creditos: 4 }
  ]
};

const grid = document.getElementById("malla-grid");
const resumen = document.getElementById("resumen-creditos");

// Cargar progreso desde localStorage
const progreso = JSON.parse(localStorage.getItem("malla-rendida") || "{}");

function crearMalla() {
  grid.innerHTML = "";

  Object.keys(malla).forEach((semestre, colIndex) => {
    const columna = document.createElement("div");
    columna.className = "semestre";

    malla[semestre].forEach((ramo, i) => {
      const div = document.createElement("div");
      div.className = "ramo";
      div.textContent = `${ramo.nombre} (${ramo.creditos})`;
      div.dataset.semestre = semestre;
      div.dataset.nombre = ramo.nombre;
      div.dataset.creditos = ramo.creditos;

      const clave = `${semestre} - ${ramo.nombre}`;
      if (progreso[clave]) {
        div.classList.add("checked");
      }

      div.addEventListener("click", () => {
        div.classList.toggle("checked");
        progreso[clave] = div.classList.contains("checked");
        localStorage.setItem("malla-rendida", JSON.stringify(progreso));
        actualizarCreditos();
      });

      columna.appendChild(div);
    });

    grid.appendChild(columna);
  });

  actualizarCreditos();
}

function actualizarCreditos() {
  const todos = document.querySelectorAll(".ramo");
  let total = 0;
  let completados = 0;

  todos.forEach(ramo => {
    const creditos = parseInt(ramo.dataset.creditos);
    total += creditos;
    if (ramo.classList.contains("checked")) {
      completados += creditos;
    }
  });

  resumen.textContent = `Créditos completados: ${completados} / ${total}`;
}

function toggleTheme() {
  document.body.classList.toggle("dark");
  localStorage.setItem("malla-tema", document.body.classList.contains("dark") ? "dark" : "light");
}

if (localStorage.getItem("malla-tema") === "dark") {
  document.body.classList.add("dark");
}

crearMalla();

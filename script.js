const malla = {
  "1° Semestre": [
    { nombre: "TRANSFORMACIÓN DIGITAL", creditos: 6 },
    { nombre: "INSTALACIÓN Y CERTIFICACIÓN DE REDES", creditos: 6 },
    { nombre: "SOPORTE EN REDES DE ACCESO Y ANTENA", creditos: 6 },
    { nombre: "SOPORTE COMPUTACIONAL (IT Essentials)", creditos: 6 },
    { nombre: "NIVELACIÓN MATEMÁTICA", creditos: 6 },
    { nombre: "HABILIDADES BÁSICAS DE COMUNICACIÓN", creditos: 6 }
  ],
  "2° Semestre": [
    { nombre: "CONECTIVIDAD ESENCIAL", creditos: 6 },
    { nombre: "INSTALACIONES DOMICILIARIAS TELCO y WIFI", creditos: 6 },
    { nombre: "SOPORTE EN REDES DE FIBRA ÓPTICA", creditos: 6 },
    { nombre: "SISTEMA OPERATIVO SERVIDOR", creditos: 6 },
    { nombre: "PROGRAMACIÓN DE ALGORITMOS", creditos: 6 },
    { nombre: "HABILIDADES DE COMUNICACIÓN EFECTIVA", creditos: 6 },
    { nombre: "FUNDAMENTOS DE ANTROPOLOGÍA", creditos: 6 }
  ],
  "3° Semestre": [
    { nombre: "ROUTING Y SWITCHING", creditos: 6 },
    { nombre: "INTRODUCCIÓN A CIBERSEGURIDAD", creditos: 6 },
    { nombre: "ADMINISTRACIÓN SISTEMA OPERATIVO ENTERPRISE", creditos: 6 },
    { nombre: "MENTALIDAD EMPRENDEDORA", creditos: 6 },
    { nombre: "INGLÉS BÁSICO I", creditos: 6 },
    { nombre: "MATEMÁTICA APLICADA", creditos: 6 },
    { nombre: "ÉTICA PARA EL TRABAJO", creditos: 6 }
  ],
  "4° Semestre": [
    { nombre: "REDES ESCALABLES Y WAN", creditos: 6 },
    { nombre: "SOLUCIONES INALÁMBRICAS", creditos: 6 },
    { nombre: "OPERACIONES EN CIBERSEGURIDAD (CCNA Cyber Ops)", creditos: 6 },
    { nombre: "SERVICIOS CONVERGENTES (Voz, Video y Datos)", creditos: 6 },
    { nombre: "INGLÉS BÁSICO II", creditos: 6 },
    { nombre: "ESTADÍSTICA DESCRIPTIVA", creditos: 6 },
    { nombre: "CURSO DE FORMACIÓN CRISTIANA", creditos: 6 }
  ],
  "5° Semestre": [
    { nombre: "ROUTING Y SWITCHING CORPORATIVO", creditos: 6 },
    { nombre: "SEGURIDAD EN REDES CORPORATIVAS (CCNA Security)", creditos: 6 },
    { nombre: "COMUNICACIONES UNIFICADAS", creditos: 6 },
    { nombre: "INNOVACIÓN EN PRODUCTOS Y SERVICIOS", creditos: 6 },
    { nombre: "INGLÉS ELEMENTAL", creditos: 6 }
  ],
  "6° Semestre": [
    { nombre: "TROUBLESHOOTING", creditos: 6 },
    { nombre: "PROBLEMÁTICAS GLOBALES Y PROTOTIPADO", creditos: 6 },
    { nombre: "GESTIÓN DE RIESGOS EN REDES CORPORATIVAS", creditos: 6 },
    { nombre: "TELEPRESENCIA Y ENTORNOS INNOVADORES DE COLABORACIÓN HUMANA", creditos: 6 },
    { nombre: "INGLÉS INTERMEDIO", creditos: 6 },
    { nombre: "ÉTICA PROFESIONAL", creditos: 6 }
  ],
  "7° Semestre": [
    { nombre: "DISEÑO DE ARQUITECTURA DE RED", creditos: 6 },
    { nombre: "PROGRAMACIÓN Y REDES VIRTUALIZADAS (SDN-NFV)", creditos: 6 },
    { nombre: "CONTROL Y GESTIÓN DE PROYECTOS DE CONECTIVIDAD", creditos: 6 },
    { nombre: "INGLÉS INTERMEDIO ALTO", creditos: 6 }
  ],
  "8° Semestre": [
    { nombre: "CAPSTONE", creditos: 6 },
    { nombre: "PRÁCTICA PROFESIONAL", creditos: 6 }
  ]
};

const grid = document.getElementById("malla-grid");
const resumen = document.getElementById("resumen-creditos");
const progreso = JSON.parse(localStorage.getItem("malla-rendida") || "{}");

function crearMalla() {
  grid.innerHTML = "";

  Object.keys(malla).forEach((semestre) => {
    const columna = document.createElement("div");
    columna.className = "semestre";

    malla[semestre].forEach((ramo) => {
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

  resumen.textContent = `Créditos completados: ${completados} / ${total}`;
}

function toggleTheme() {
  document.body.classList.toggle("dark");
  localStorage.setItem("malla-tema", document.body.classList.contains("dark") ? "dark" : "light");
}

// Restaurar tema si estaba guardado
if (localStorage.getItem("malla-tema") === "dark") {
  document.body.classList.add("dark");
}

crearMalla();

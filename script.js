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
    { nombre: "HABILIDADES DE COMUNICACIÓN EFECTIVA", creditos: 4 },
    { nombre: "INGLÉS BÁSICO II", creditos: 4 },
    { nombre: "ÉTICA PARA EL TRABAJO", creditos: 4 }
  ],
  "3° Semestre": [
    { nombre: "CONECTIVIDAD ESENCIAL", creditos: 8 },
    { nombre: "ESTADÍSTICA DESCRIPTIVA", creditos: 6 },
    { nombre: "INTRODUCCIÓN A CIBERSEGURIDAD", creditos: 6 },
    { nombre: "FUNDAMENTOS DE ANTROPOLOGÍA", creditos: 4 },
    { nombre: "INGLÉS ELEMENTAL", creditos: 4 }
  ],
  "4° Semestre": [
    { nombre: "ROUTING Y SWITCHING", creditos: 8 },
    { nombre: "COMUNICACIONES UNIFICADAS", creditos: 6 },
    { nombre: "INSTALACIONES DOMICILIARIAS TELCO Y WIFI", creditos: 6 },
    { nombre: "INNOVACIÓN EN PRODUCTOS Y SERVICIOS", creditos: 4 },
    { nombre: "INGLÉS INTERMEDIO", creditos: 4 }
  ],
  "5° Semestre": [
    { nombre: "REDES ESCALABLES Y WAN", creditos: 8 },
    { nombre: "INSTALACIÓN Y CERTIFICACIÓN DE REDES", creditos: 6 },
    { nombre: "CONTROL Y GESTIÓN DE PROYECTOS DE CONECTIVIDAD", creditos: 6 },
    { nombre: "TELEPRESENCIA Y ENTORNOS DE COLABORACIÓN", creditos: 4 },
    { nombre: "MENTALIDAD EMPRENDEDORA", creditos: 4 }
  ],
  "6° Semestre": [
    { nombre: "ROUTING Y SWITCHING CORPORATIVO", creditos: 8 },
    { nombre: "SOPORTE EN REDES DE FIBRA ÓPTICA", creditos: 6 },
    { nombre: "SEGURIDAD EN REDES CORPORATIVAS (CCNA Security)", creditos: 6 },
    { nombre: "DISEÑO DE ARQUITECTURA DE RED", creditos: 6 },
    { nombre: "ÉTICA PROFESIONAL", creditos: 4 }
  ],
  "7° Semestre": [
    { nombre: "TROUBLESHOOTING", creditos: 8 },
    { nombre: "OPERACIONES EN CIBERSEGURIDAD (CCNA CyberOps)", creditos: 6 },
    { nombre: "PROGRAMACIÓN Y REDES VIRTUALIZADAS (SDN/NFV)", creditos: 6 },
    { nombre: "SOLUCIONES INALÁMBRICAS", creditos: 6 },
    { nombre: "PROBLEMÁTICAS GLOBALES Y PROTOTIPADO", creditos: 4 }
  ],
  "8° Semestre": [
    { nombre: "CAPSTONE", creditos: 10 },
    { nombre: "GESTIÓN DE RIESGOS EN REDES CORPORATIVAS", creditos: 6 },
    { nombre: "PRÁCTICA PROFESIONAL", creditos: 10 },
    { nombre: "INGLÉS INTERMEDIO ALTO", creditos: 4 },
    { nombre: "PROCESO DE PORTAFOLIO", creditos: 4 }
  ]
};

const contenedor = document.getElementById("contenedor-malla");
const resumen = document.getElementById("resumen-creditos");

function crearMalla() {
  let total = 0;

  for (const [semestre, ramos] of Object.entries(malla)) {
    const div = document.createElement("div");
    div.className = "semestre";
    const h2 = document.createElement("h2");
    h2.textContent = semestre;
    div.appendChild(h2);

    ramos.forEach((ramo) => {
      total += ramo.creditos;

      const item = document.createElement("div");
      item.className = "ramo";

      const label = document.createElement("label");
      label.textContent = `${ramo.nombre} (${ramo.creditos} créditos)`;

      const checkbox = document.createElement("input");
      checkbox.type = "checkbox";
      checkbox.dataset.creditos = ramo.creditos;
      checkbox.addEventListener("change", actualizarCreditos);

      item.appendChild(label);
      item.appendChild(checkbox);
      div.appendChild(item);
    });

    contenedor.appendChild(div);
  }

  resumen.textContent = `Créditos completados: 0 / ${total}`;
}

function actualizarCreditos() {
  const checks = document.querySelectorAll('input[type="checkbox"]');
  let suma = 0;
  let total = 0;

  checks.forEach(chk => {
    total += parseInt(chk.dataset.creditos);
    if (chk.checked) suma += parseInt(chk.dataset.creditos);
  });

  resumen.textContent = `Créditos completados: ${suma} / ${total}`;
}

function toggleTheme() {
  document.body.classList.toggle("dark");
}

crearMalla();

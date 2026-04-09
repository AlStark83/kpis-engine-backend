# 🧠 KPI Engine Backend — Agent Guidelines

## 🎯 Propósito del sistema

Este backend NO es un sistema de cálculo de KPIs.

Es un **orquestador de datos** que:
- Consume procedimientos almacenados (SQL Server)
- Aplica filtros dinámicos
- Adapta datos
- Formatea respuestas para un dashboard ejecutivo

---

## 🧩 Filosofía de arquitectura

Este sistema sigue el principio:

> "El backend no piensa, solo organiza."

### ❌ NO hacemos:
- Cálculos complejos de negocio
- Transformaciones pesadas innecesarias
- Lógica específica de KPIs hardcodeada

### ✅ SÍ hacemos:
- Orquestación de filtros
- Consumo de stored procedures
- Estandarización de respuestas
- Preparación de datos para UI

---

## 🔁 Flujo del sistema
Request (filters)
↓
Filter Builder
↓
Stored Procedure (DB)
↓
Adapter
↓
Formatter
↓
Response (UI-ready)


---

## 🧱 Estructura del proyecto


/src
/core
engine.js → Orquestador principal
/filters
filterBuilder.js → Construcción de parámetros
/services
db.service.js → Conexión a SQL Server
/adapters
*.adapter.js → Normalización de datos
/formatters
card.formatter.js
chart.formatter.js
table.formatter.js
/kpis
/<kpi-name>/
*.kpi.js → Configuración del KPI


---

## 🧠 Responsabilidades por capa

### 🔹 Engine (`core/engine.js`)
- Coordina todo el flujo
- NO contiene lógica de negocio
- Ejecuta:
  - buildFilters
  - db call
  - adapter
  - formatter

---

### 🔹 Filter Builder
- Convierte arrays en strings (multiselect)
- NO valida negocio
- Solo transforma input

Ejemplo:
```js
[1,2,3] → "1,2,3"
🔹 DB Service
Ejecuta procedimientos almacenados
NO transforma datos
NO contiene lógica de negocio
🔹 Adapter
Traduce respuesta DB → estructura estándar interna

Ejemplo:

DB → [{ area: "Finanzas", value: 92 }]

→ Adapter →

{
  labels: ["Finanzas"],
  values: [92]
}
🔹 Formatter
Convierte datos a formato UI

Tipos soportados:

card
chart
table
🔹 KPI Modules
Configuración de cada KPI
Define:
procedimiento a usar
adapter
formatter

Ejemplo:

export default {
  sp: "sp_finanzas_cobranza",
  adapter: "finanzas.adapter",
  formatter: "chart"
}
📡 Contrato de API
Endpoint principal
POST /kpi/run
Input
{
  "kpi": "finanzas_cobranza",
  "filters": {
    "year": [2026],
    "month": [3],
    "client": [1,2]
  }
}
Output (ejemplo chart)
{
  "type": "chart",
  "chartType": "bar",
  "labels": ["Finanzas"],
  "datasets": [
    {
      "label": "Cumplimiento",
      "data": [92]
    }
  ]
}
⚠️ Reglas críticas
1. Separación de responsabilidades

Cada capa tiene una sola responsabilidad.

2. Prohibido acoplamiento
Un adapter NO debe conocer el formatter
El engine NO debe conocer lógica del KPI
3. KPI = plug & play

Agregar un KPI nuevo NO debe romper otros.

4. Sin lógica duplicada

Si se repite → abstraer.

5. Backend NO decide negocio

Toda lógica compleja vive en:

SQL (stored procedures)
o configuración externa
🧪 Testing (futuro recomendado)
Testear adapters de forma aislada
Mockear DB responses
Validar formato de salida
🚀 Cómo agregar un nuevo KPI
Crear carpeta en /kpis/<nuevo-kpi>
Definir config del KPI
Crear adapter
Reutilizar formatter existente
Registrar KPI en engine
🧠 Decisiones de diseño
Se prioriza velocidad de render sobre lógica en backend
Se minimiza carga cognitiva del frontend
Se centraliza lógica de negocio en DB
🔥 Anti-patrones a evitar

❌ Calcular promedios en backend
❌ Hardcodear reglas de cliente/producto
❌ Mezclar filtros con lógica de datos
❌ Hacer adapters específicos para un solo caso sin reutilización

🧭 Evolución futura

Este sistema puede escalar a:

Motor de dashboards multi-empresa
Sistema tipo BI interno
Integración con otras apps (ej. TravelOpsAI)
🧠 Mentalidad del desarrollador

Antes de escribir código, pregúntate:

"¿Estoy organizando datos… o tratando de ser Excel?"

Si es lo segundo → estás en el lugar incorrecto 😏
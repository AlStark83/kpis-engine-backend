# Mapa de capacidades: Dashboard actual vs referencia Joel

Fase: 1 - Inventario y mapa de equivalencias  
Fecha: 2026-07-21  
Alcance: documento de analisis. No incluye cambios funcionales.

## Objetivo

Identificar que capacidades del proyecto de Joel ya existen, cuales existen parcialmente y cuales deben integrarse dentro de la arquitectura actual:

- Frontend React + Vite.
- Backend modular.
- Autenticacion existente.
- KPI Registry.
- Adapters y formatters.
- Separacion entre frontend y backend.

El proyecto de Joel se toma como referencia funcional y de dominio, no como base arquitectonica.

## Resumen ejecutivo

El proyecto actual tiene una base mas mantenible para integracion gradual: registry de KPIs, adapters, formatters, frontend React y autenticacion. Joel aporta mayor cobertura funcional: endpoints especificos, SPs `sp_Dashboard_*_IA`, filtros en un SP multi-recordset, salud REDT, cancelaciones, distribuciones, pipeline financiero, aging CxC, concentracion de cartera y alertas ejecutivas.

Recomendacion de integracion:

1. Mantener nuestro `POST /api/kpis/run` como contrato principal.
2. Agregar los SPs de Joel como nuevos KPIs dentro del registry.
3. Crear endpoints compatibles `/api/dashboard/...` despues de tener KPIs integrados.
4. Migrar visualizaciones de Joel a componentes React, sin copiar HTML estatico.
5. Mantener los SP actuales y los SP de Joel conviviendo temporalmente.

## Contratos encontrados

### Backend actual

Endpoint principal:

- `POST /api/kpis/run`

Endpoints adicionales:

- `GET /`
- `POST /api/auth/login`
- `POST /api/auth/sso`
- `GET /api/auth/me`
- `GET /api/dashboard/filtros`
- `POST /kpi/run`

KPIs actuales en `backend/src/core/registry.js`:

- `tiempo_gestion`
- `concluidos_vs_activados`
- `carga_coordinadores`
- `carga_gestores`
- `resumen_operativo`
- `abiertos_vs_concluidos_fecha_alta`
- `finanzas_promedio_dias_cxc`
- `finanzas_saldo_cxc`
- `finanzas_impacto_flujo`
- `finanzas_antiguedad_servicios`
- `finanzas_salud_cliente`

KPIs solicitados por `frontend/src/hooks/useDashboard.js`:

- `tiempo_gestion`
- `carga_coordinadores`
- `carga_gestores`
- `resumen_operativo`
- `abiertos_vs_concluidos_fecha_alta`
- `finanzas_promedio_dias_cxc`
- `finanzas_saldo_cxc`
- `finanzas_impacto_flujo`
- `finanzas_antiguedad_servicios`
- `finanzas_salud_cliente`

Nota: `concluidos_vs_activados` existe en registry, pero no aparece en `KPI_REQUESTS`.

### Referencia Joel

Endpoints bajo `/api/dashboard`:

- `GET /all`
- `GET /filtros/opciones`
- `GET /resumen`
- `GET /salud-redt`
- `GET /operaciones/mes`
- `GET /operaciones/gestores`
- `GET /operaciones/tiempos`
- `GET /operaciones/coordinadores`
- `GET /operaciones/distribucion-estado`
- `GET /operaciones/distribucion-servicio`
- `GET /operaciones/distribucion-producto`
- `GET /operaciones/cancelados-mes`
- `GET /operaciones/cancelados-cliente`
- `GET /operaciones/motivos-cancelacion`
- `GET /finanzas/cxc`
- `GET /finanzas/cobranza-mes`
- `GET /finanzas/antiguedad`
- `GET /finanzas/salud-cliente`
- `GET /finanzas/aging-cxc`
- `GET /finanzas/concentracion-cartera`
- `GET /finanzas/pipeline`

SPs de Joel:

- `dbo.sp_Dashboard_Resumen_Ejecutivo_IA`
- `dbo.sp_Dashboard_Salud_RED_T_IA`
- `dbo.sp_Dashboard_Operaciones_AbiertosVsFinalizadosMes_IA`
- `dbo.sp_Dashboard_Operaciones_ReportesPorGestor_IA`
- `dbo.sp_Dashboard_Operaciones_TiemposGestion_IA`
- `dbo.sp_Dashboard_Operaciones_CargaPorCoordinador_IA`
- `dbo.sp_Dashboard_Operaciones_DistribucionEstado_IA`
- `dbo.sp_Dashboard_Operaciones_DistribucionServicio_IA`
- `dbo.sp_Dashboard_Operaciones_DistribucionProducto_IA`
- `dbo.sp_Dashboard_Operaciones_CanceladosMes_IA`
- `dbo.sp_Dashboard_Operaciones_CanceladosCliente_IA`
- `dbo.sp_Dashboard_Operaciones_MotivosCancelacion_IA`
- `dbo.sp_Dashboard_Finanzas_CxC_IA`
- `dbo.sp_Dashboard_Finanzas_PromedioCobranzaMes_IA`
- `dbo.sp_Dashboard_Finanzas_AntiguedadPorFacturar_IA`
- `dbo.sp_Dashboard_Finanzas_SaludPorCliente_IA`
- `dbo.sp_Dashboard_Finanzas_AgingCxC_IA`
- `dbo.sp_Dashboard_Finanzas_ConcentracionCartera_IA`
- `dbo.sp_Dashboard_Finanzas_Pipeline_IA`
- `dbo.sp_Dashboard_Filtros_Opciones_IA`

Parametros comunes de Joel:

- `FECHA_INICIO`
- `FECHA_FIN`
- `YEARS`
- `PRODUCT`
- `CLIENT`
- `SERVICES`
- `COORDINATOR`
- `STATUS`
- `SUBCLIENTE`
- `SOLICITANTE`
- `ESTADO`
- `GESTOR`

## Matriz de equivalencias

| Nombre funcional | Categoria | SP actual | SP de Joel | Endpoint Joel | Parametros de entrada | Shape de respuesta observado | KPI Registry actual relacionado | Componente React destino | Estatus | Observaciones | Requiere validacion funcional |
|---|---|---|---|---|---|---|---|---|---|---|---|
| Filtros de dashboard | filtros | Varios SPs: `sp_dash_*_filtros` | `dbo.sp_Dashboard_Filtros_Opciones_IA` | `/api/dashboard/filtros/opciones` | Parametros comunes Joel | Multiples recordsets: clientes, subclientes, estados, productos, servicios, coordinadores, gestores, solicitantes, estatus | `GET /api/dashboard/filtros` fuera de registry | `FiltersForm`, `FilterMultiSelect` | existe parcialmente | Nuestro backend consulta varios SPs; Joel usa un solo SP multi-recordset. Buena candidata para Fase 7, despues de contrato canonico. | Si |
| Resumen ejecutivo | resumen ejecutivo | `dbo.sp_dashboard_resumen_operativo` | `dbo.sp_Dashboard_Resumen_Ejecutivo_IA` | `/api/dashboard/resumen` | Parametros comunes Joel | Un objeto con totales ejecutivos usados por tarjetas: total, abiertos, concluidos, cancelados, backlog, porcentajes | `resumen_operativo` | `KpiSummaryCards`; futuro `MetricCard` | existe parcialmente | Primer KPI vertical recomendado. No reemplazar de golpe el resumen actual hasta comparar campos. | Si |
| Salud general REDT | salud REDT | No existe | `dbo.sp_Dashboard_Salud_RED_T_IA` | `/api/dashboard/salud-redt` | Parametros comunes Joel | Un objeto con score, cobertura, estado, componentes y conclusion ejecutiva | Ninguno | Nuevo `HealthIndicator` o modulo Salud REDT | debe agregarse | Modulo nuevo de alto valor ejecutivo. Depende de validar reglas de negocio y cobertura minima. | Si |
| Flujo operativo mensual | operaciones | `dbo.sp_operaciones_abiertos_vs_concluidos_fecha_alta`; tambien `dbo.sp_Operaciones_concluidos_vs_activados` | `dbo.sp_Dashboard_Operaciones_AbiertosVsFinalizadosMes_IA` | `/api/dashboard/operaciones/mes` | Parametros comunes Joel | Filas por mes con abiertos/entradas, finalizados/concluidos y variacion neta | `abiertos_vs_concluidos_fecha_alta`, `concluidos_vs_activados` | `KpiBarChart`, `KpiConversionDonut`; futuro `TrendChart` | existe parcialmente | Hay dos KPIs actuales relacionados. Se debe decidir cual queda como fuente principal. | Si |
| Reportes por gestor / capacidad por gestor | operaciones | `dbo.sp_Operaciones_total_reportes_por_gestor` | `dbo.sp_Dashboard_Operaciones_ReportesPorGestor_IA` | `/api/dashboard/operaciones/gestores` | Parametros comunes Joel | Filas por gestor con total, abiertos, finalizados y porcentaje | `carga_gestores` | `KpiCargaList`; futuro `ManagerCapacityChart` | existe parcialmente | Probable reemplazo o version extendida del KPI actual. | Si |
| Tiempos de gestion / backlog por antiguedad | operaciones | `dbo.sp_Operaciones_promedio_tiempo_gestion_concluidos` | `dbo.sp_Dashboard_Operaciones_TiemposGestion_IA` | `/api/dashboard/operaciones/tiempos` | Parametros comunes Joel | Filas por rango o bloque de antiguedad; Joel tambien usa promedio para tarjeta | `tiempo_gestion` | `KpiTiempoGestionCard`; futuro `AgingChart` operativo | existe parcialmente | Nuestro KPI parece enfocado en promedio; Joel lo usa tambien para backlog/antiguedad. Revisar shape real antes de reemplazar. | Si |
| Carga por coordinador | operaciones | `dbo.sp_Operaciones_total_reportes_por_coordinador` | `dbo.sp_Dashboard_Operaciones_CargaPorCoordinador_IA` | `/api/dashboard/operaciones/coordinadores` | Parametros comunes Joel | Filas por coordinador con total, abiertos, concluidos y porcentaje | `carga_coordinadores` | `KpiCargaList`; futuro `ManagerCapacityChart` | existe parcialmente | Ya hay adapter/formatter especificos y tests actuales para coordinadores. Buen candidato despues del primer KPI. | Si |
| Distribucion por estado | distribuciones | No existe como KPI dedicado | `dbo.sp_Dashboard_Operaciones_DistribucionEstado_IA` | `/api/dashboard/operaciones/distribucion-estado` | Parametros comunes Joel | Filas `{ Nombre, TotalReportes }` | Ninguno | Nuevo `DistributionChart` | debe agregarse | Visual de barra horizontal en Joel. Bajo riesgo despues de filtros. | Si |
| Distribucion por servicio | distribuciones | No existe como KPI dedicado | `dbo.sp_Dashboard_Operaciones_DistribucionServicio_IA` | `/api/dashboard/operaciones/distribucion-servicio` | Parametros comunes Joel | Filas `{ Nombre, TotalReportes }` | Ninguno | Nuevo `DistributionChart` o donut | debe agregarse | Joel usa dona para top servicios. Puede compartir adapter con distribucion por estado/producto. | Si |
| Distribucion por producto | distribuciones | No existe como KPI dedicado | `dbo.sp_Dashboard_Operaciones_DistribucionProducto_IA` | `/api/dashboard/operaciones/distribucion-producto` | Parametros comunes Joel | Filas `{ Nombre, TotalReportes }` | Ninguno | Nuevo `DistributionChart` | debe agregarse | Puede compartir contrato con estado/servicio. | Si |
| Cancelados por mes | cancelaciones | No existe | `dbo.sp_Dashboard_Operaciones_CanceladosMes_IA` | `/api/dashboard/operaciones/cancelados-mes` | Parametros comunes Joel | Filas por mes con total cancelados | Ninguno | Nuevo `TrendChart` o `DistributionChart` | debe agregarse | Joel lo muestra como barra de tendencia. | Si |
| Cancelados por cliente | cancelaciones | No existe | `dbo.sp_Dashboard_Operaciones_CanceladosCliente_IA` | `/api/dashboard/operaciones/cancelados-cliente` | Parametros comunes Joel | Filas por cliente con total cancelados | Ninguno | Nuevo listado/ranking | debe agregarse | Se recomienda despues de validar cancelados por mes. | Si |
| Motivos de cancelacion | cancelaciones | No existe | `dbo.sp_Dashboard_Operaciones_MotivosCancelacion_IA` | `/api/dashboard/operaciones/motivos-cancelacion` | Parametros comunes Joel | Filas por motivo con cantidad y porcentaje | Ninguno | Nuevo `DistributionChart` o donut | debe agregarse | Depende de relacion `tbreporte.motivocancelacion = ctmotivoscancelacion.movcanid`. Validar que la columna exista en ambiente actual. | Si |
| Saldo CxC | finanzas | `sp_Finanzas_Saldo_cxc_facturas_sin_cobrar_rf` | `dbo.sp_Dashboard_Finanzas_CxC_IA` | `/api/dashboard/finanzas/cxc` | Parametros comunes Joel | Un objeto con saldo CxC y posiblemente totales financieros | `finanzas_saldo_cxc` | `KpiSaldoCxCCard` | existe parcialmente | Candidato a comparacion numerica directa antes de reemplazar. | Si |
| Promedio de cobranza / dias CxC | finanzas | `sp_Finanzas_promedio_dias_cxc_rf` | `dbo.sp_Dashboard_Finanzas_PromedioCobranzaMes_IA` | `/api/dashboard/finanzas/cobranza-mes` | Parametros comunes Joel | Filas por mes con promedio de cobranza | `finanzas_promedio_dias_cxc` | `KpiCxCPromedioCard`; futuro `TrendChart` | existe parcialmente | Nuestro KPI actual parece tarjeta; Joel agrega serie mensual. Puede coexistir como nuevo KPI antes de reemplazo. | Si |
| Antiguedad por facturar | finanzas | `sp_finanzas_antiguedad_servicios_por_facturar_rf` | `dbo.sp_Dashboard_Finanzas_AntiguedadPorFacturar_IA` | `/api/dashboard/finanzas/antiguedad` | Parametros comunes Joel | Filas por rango o grupo de antiguedad | `finanzas_antiguedad_servicios` | `KpiAntiguedadFinanzasCard`; futuro `AgingChart` | existe parcialmente | Revisar si el criterio de fecha coincide: Joel usa filtros con fecha de reporte/factura segun SP. | Si |
| Salud por cliente | finanzas | `sp_Finanzas_salud_por_cliente_rf` | `dbo.sp_Dashboard_Finanzas_SaludPorCliente_IA` | `/api/dashboard/finanzas/salud-cliente` | Parametros comunes Joel | Filas por cliente con volumen, abiertos/concluidos y porcentaje/salud | `finanzas_salud_cliente` | `KpiSaludClienteCard` | existe parcialmente | Probable version extendida. Validar columnas antes de reutilizar componente. | Si |
| Impacto en flujo | finanzas | `sp_Finanzas_impacto_en_flujo_rf` | Relacionado con `dbo.sp_Dashboard_Finanzas_Pipeline_IA` | `/api/dashboard/finanzas/pipeline` | Parametros comunes Joel | Un objeto tipo embudo: servicios terminados, sin facturar, facturado, CxC, cobrado | `finanzas_impacto_flujo` | `KpiImpactoFlujoCard`; futuro `PipelineChart` | existe parcialmente | Joel lo modela como pipeline financiero; nuestro KPI actual es tarjeta. Mantener ambos hasta validar definicion. | Si |
| Aging CxC | finanzas | No existe como KPI dedicado | `dbo.sp_Dashboard_Finanzas_AgingCxC_IA` | `/api/dashboard/finanzas/aging-cxc` | Parametros comunes Joel | Filas `{ Intervalo, Monto }` | Ninguno | Nuevo `AgingChart` | debe agregarse | Parte del Bloque A recomendado. Comparte visual con antiguedad pero dominio financiero. | Si |
| Concentracion de cartera | finanzas | No existe | `dbo.sp_Dashboard_Finanzas_ConcentracionCartera_IA` | `/api/dashboard/finanzas/concentracion-cartera` | Parametros comunes Joel | Filas por cliente con saldo | Ninguno | Nuevo ranking/barra horizontal | debe agregarse | Bajo riesgo visual, requiere validar montos y ordenamiento. | Si |
| Pipeline financiero | finanzas | Relacionado con `sp_Finanzas_impacto_en_flujo_rf` | `dbo.sp_Dashboard_Finanzas_Pipeline_IA` | `/api/dashboard/finanzas/pipeline` | Parametros comunes Joel | Un objeto con etapas del embudo financiero | `finanzas_impacto_flujo` | `KpiImpactoFlujoCard`; futuro `PipelineChart` | existe parcialmente | Recomendado como primer KPI financiero nuevo despues de salud REDT. | Si |
| Centro de alertas ejecutivas | alertas | No existe | No tiene SP propio; deriva de resumen, tiempos, aging, pipeline y gestores | Sin endpoint propio | Depende de KPIs base | Lista calculada en frontend segun reglas | Ninguno | Nuevo `ExecutiveAlert` | debe agregarse | No integrar antes de tener validados los KPIs base que alimentan alertas. | Si |
| Endpoint consolidado all | infraestructura dashboard | No existe | No aplica; orquesta SPs Joel | `/api/dashboard/all` | Parametros comunes Joel | Objeto con todas las keys: resumen, saludRedt, operacionesMes, gestores, tiempos, cxc, etc. | No existe | `useDashboard` futuro o servicio dashboard consolidado | debe agregarse mas adelante | No implementarlo hasta validar KPIs individuales. Riesgo: fallos parciales y tiempos de respuesta. | Si |

## Clasificacion por prioridad sugerida

### Mantener como base actual

- `POST /api/kpis/run`
- `KPI_REGISTRY`
- adapters y formatters
- auth actual
- frontend React/Vite
- layout desktop/mobile

### Integrar primero

1. Contrato canonico de filtros.
2. Ejecucion de SPs de Joel sin reemplazar SPs actuales.
3. `dashboard_resumen_ejecutivo`.
4. `GET /api/dashboard/resumen` compatible.
5. Filtros reales desde `sp_Dashboard_Filtros_Opciones_IA`.
6. `dashboard_salud_redt`.

### Integrar por bloques despues de validar

Bloque Finanzas:

- `finanzas_pipeline`
- `finanzas_aging_cxc`
- `finanzas_concentracion_cartera`
- `finanzas_cobranza_mes`
- `finanzas_antiguedad_facturar`
- `finanzas_salud_cliente`

Bloque Operaciones:

- `operaciones_abiertos_finalizados_mes`
- `operaciones_tiempos_gestion`
- `operaciones_carga_coordinador`
- `operaciones_reportes_gestor`

Bloque Cancelaciones:

- `operaciones_cancelados_mes`
- `operaciones_cancelados_cliente`
- `operaciones_motivos_cancelacion`

Bloque Distribuciones:

- `operaciones_distribucion_estado`
- `operaciones_distribucion_servicio`
- `operaciones_distribucion_producto`

### No integrar directamente

- HTML estatico de `Joel/public/index.html`.
- CSS estatico completo de `Joel/public/css/dashboard.css`.
- JS imperativo de `Joel/public/js/dashboard.js`.
- Arquitectura monorepo de Joel como primer paso.
- `mssql` directo en controllers o rutas.

## Riesgos detectados

- Los nombres de SP actuales y los nombres de SP Joel no son equivalentes uno a uno.
- Algunos KPIs actuales son tarjetas y Joel los modela como series o rankings.
- `sp_Dashboard_Filtros_Opciones_IA` devuelve multiples recordsets; hay que confirmar si Sequelize puede representarlos bien antes de decidir infraestructura.
- `motivos_cancelacion` depende de columnas/tablas especificas que deben existir en el ambiente actual.
- El endpoint `/all` puede ocultar fallos individuales si se implementa antes de validar KPIs por separado.
- El frontend actual tiene componentes especificos y tambien un renderer generico en `components/modules/dashboard`; conviene decidir una ruta antes de sumar visualizaciones nuevas.

## Decisiones propuestas para revisar

1. Usar `dashboard_resumen_ejecutivo` como primer KPI vertical.
2. No reemplazar `resumen_operativo` inicialmente; ambos deben coexistir.
3. Crear adapters genericos para shapes comunes:
   - `dashboard_card`
   - `dashboard_rows`
   - `dashboard_distribution`
   - `dashboard_pipeline`
   - `dashboard_health`
4. Agregar endpoints compatibles solo despues de que cada KPI exista en registry.
5. Documentar comparacion numerica con Joel antes de marcar cualquier KPI como reemplazo.

## Pendientes para Fase 2

- Definir `DashboardFilters`.
- Normalizar nombres actuales de React contra parametros internos.
- Traducir filtros internos a parametros SQL Joel.
- Definir comportamiento de `TODOS`.
- Agregar pruebas unitarias del normalizador.

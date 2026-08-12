export type Tendencia = 'sube' | 'baja' | 'estable';

export type PrioridadAlerta = 'alta' | 'media' | 'baja';

export type TipoActividad = 'horario' | 'marcacion' | 'asistencia' | 'jornada';

export interface IndicadorAsistencia {
    titulo: string;
    valor: string | number;
    variacion: string;
    tendencia: Tendencia;
    icono: string;
    color: string;
}

export interface AlertaAsistencia {
    id: number;
    titulo: string;
    descripcion: string;
    prioridad: PrioridadAlerta;
    fecha: string;
    cantidad?: number;
}

export interface ActividadReciente {
    id: number;
    titulo: string;
    descripcion: string;
    fecha: string;
    hora: string;
    tipo: TipoActividad;
}

export interface DatoGraficoMensual {
    mes: string;
    actual: number;
    anterior: number;
}

export interface CentroCumplimiento {
    nombre: string;
    actual: number;
    anterior: number;
}

export interface UnidadCumplimiento {
    nombre: string;
    actual: number;
    anterior: number;
}

export interface EstadoDiario {
    nombre: string;
    cantidad: number;
    porcentaje: number;
    color: string;
}

export interface TendenciaSemanal {
    dia: string;
    actual: number;
    anterior: number;
}

export interface ComparacionMes {
    categoria: string;
    actual: number;
    anterior: number;
}

export interface RankingCentro {
    nombre: string;
    valor: number;
    color: string;
}

export interface ResumenInstitucional {
    metrica: string;
    valor: string | number;
    tendencia: Tendencia;
    variacion: string;
    icono: string;
    color: string;
}

export interface FiltrosDashboard {
    periodo: string;
    centroSalud: string;
    unidad: string;
}

export interface PeriodoOption {
    value: string;
    label: string;
}

export interface CentroSaludOption {
    value: string;
    label: string;
}

export interface UnidadOption {
    value: string;
    label: string;
}

export type EstadoAsistencia =
    | 'presente'
    | 'atraso'
    | 'horas_extra'
    | 'permiso'
    | 'licencia'
    | 'vacaciones'
    | 'descanso';

export interface FuncionarioAsistencia {
    rut: string;
    nombre: string;
    cargo: string;
    profesion: string;
    unidad: string;
    centroSalud: string;
    jefatura: string;
    jornada: string;
    horarioAsignado: string;
    fechaIngreso: string;
    estado: string;
    iniciales: string;
}

export interface RegistroAsistencia {
    fecha: string;
    dia: string;
    entrada: string | null;
    salida: string | null;
    atrasoMin: number;
    horasExtraMin: number;
    estado: EstadoAsistencia;
    observacion: string;
    horarioUtilizado: string;
}

export interface HorarioOption {
    value: string;
    label: string;
}

export interface LugarOption {
    value: string;
    label: string;
}

export interface UnidadAsistencia {
    id: string;
    nombre: string;
    lugarDesempeno: string;
    dotacion: number;
    presentes: number;
    ausentes: number;
    cumplimiento: number;
}

export interface FuncionarioUnidad {
    id: number;
    rut: string;
    nombre: string;
    cargo: string;
    lugarDesempeno: string;
    unidad: string;
    iniciales: string;
}

export type EstadoDiarioUnidad =
    | 'presente'
    | 'atraso'
    | 'ausente'
    | 'permiso'
    | 'licencia'
    | 'vacaciones';

export interface RegistroDiarioUnidad {
    id: number;
    funcionarioId: number;
    horarioAsignado: string;
    entrada: string | null;
    atrasoMin: number;
    salida: string | null;
    estado: EstadoDiarioUnidad;
    observacion: string;
}

export interface TarjetaResumen {
    label: string;
    valor: string | number;
    icono: string;
    color: string;
    detalle?: string;
}

export interface AlertaDia {
    id: number;
    titulo: string;
    descripcion: string;
    prioridad: 'alta' | 'media' | 'baja';
}

export interface IndicadorCobertura {
    label: string;
    valor: string;
    detalle: string;
    color: string;
}

export interface PuntoEvolucion {
    dia: string;
    valor: number;
}

export interface EstadoDistribucion {
    nombre: string;
    cantidad: number;
    color: string;
}

export interface ComparacionMesUnidad {
    mes: string;
    actual: number;
    anterior: number;
}

export interface DetalleMensualFuncionario {
    id: number;
    funcionarioId: number;
    horasTrabajadas: number;
    horasExtra: string;
    atrasosMin: number;
    ausenciasDias: number;
    cumplimiento: number;
}

export interface DatosUnidadDiario {
    resumen: TarjetaResumen[];
    registros: RegistroDiarioUnidad[];
}

export interface DatosUnidadMensual {
    resumen: TarjetaResumen[];
    detalle: DetalleMensualFuncionario[];
    evolucionHoras: PuntoEvolucion[];
    evolucionHorasExtra: PuntoEvolucion[];
    evolucionAtrasos: PuntoEvolucion[];
    distribucion: EstadoDistribucion[];
    comparacion: ComparacionMesUnidad[];
}

export interface RegistroMiniCartola {
    fecha: string;
    dia: string;
    entrada: string | null;
    salida: string | null;
    estado: string;
    observacion: string;
}

export interface DiaHorario {
    dia: string;
    laborable: boolean;
    entrada: string | null;
    salida: string | null;
}

export interface HorarioLaboral {
    id: string;
    nombre: string;
    descripcion: string;
    jornada: string;
    horasSemanales: number;
    diasLaborales: number;
    diasDescanso: number;
    estado: 'Activo' | 'Disponible';
    fechaAsignacion: string;
    dias: DiaHorario[];
}

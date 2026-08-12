import type {
    ActividadReciente,
    AlertaAsistencia,
    AlertaDia,
    CentroCumplimiento,
    CentroSaludOption,
    ComparacionMes,
    ComparacionMesUnidad,
    DatoGraficoMensual,
    DatosUnidadDiario,
    DatosUnidadMensual,
    DetalleMensualFuncionario,
    DiaHorario,
    EstadoAsistencia,
    EstadoDiario,
    EstadoDistribucion,
    FuncionarioAsistencia,
    FuncionarioUnidad,
    HorarioLaboral,
    HorarioOption,
    IndicadorAsistencia,
    IndicadorCobertura,
    LugarOption,
    PeriodoOption,
    PuntoEvolucion,
    RankingCentro,
    RegistroAsistencia,
    RegistroDiarioUnidad,
    RegistroMiniCartola,
    ResumenInstitucional,
    TarjetaResumen,
    TendenciaSemanal,
    UnidadAsistencia,
    UnidadCumplimiento,
    UnidadOption,
} from '@/types/asistencia';

export const periodos: PeriodoOption[] = [
    { value: '2026-07', label: 'Julio 2026' },
    { value: '2026-06', label: 'Junio 2026' },
    { value: '2026-05', label: 'Mayo 2026' },
    { value: '2026-04', label: 'Abril 2026' },
    { value: '2026-03', label: 'Marzo 2026' },
    { value: '2026-02', label: 'Febrero 2026' },
];

export const centrosSalud: CentroSaludOption[] = [
    { value: 'todos', label: 'Todos los Centros' },
    { value: 'cesfam-aguirre', label: 'CESFAM Aguirre' },
    { value: 'cesfam-guzman', label: 'CESFAM Guzman' },
    { value: 'cesfam-sur', label: 'CESFAM Sur' },
    { value: 'cesfam-viela', label: 'CESFAM Viela' },
];

export const unidades: UnidadOption[] = [
    { value: 'todas', label: 'Todas las Unidades' },
    { value: 'medicina-interna', label: 'Medicina Interna' },
    { value: 'cirugia-general', label: 'Cirugía General' },
    { value: 'pediatria', label: 'Pediatría' },
    { value: 'ginecologia', label: 'Ginecología' },
    { value: 'urgencia', label: 'Urgencia' },
    { value: 'atencion-primaria', label: 'Atención Primaria' },
];

export const indicadores: IndicadorAsistencia[] = [
    {
        titulo: 'Dotación Total',
        valor: '1,247',
        variacion: '+2.3%',
        tendencia: 'sube',
        icono: 'Users',
        color: 'blue',
    },
    {
        titulo: 'Presentes Hoy',
        valor: '1,089',
        variacion: '-1.2%',
        tendencia: 'baja',
        icono: 'UserCheck',
        color: 'green',
    },
    {
        titulo: 'Ausentes Hoy',
        valor: '158',
        variacion: '+5.4%',
        tendencia: 'sube',
        icono: 'UserX',
        color: 'red',
    },
    {
        titulo: 'Licencias Médicas',
        valor: '42',
        variacion: '-8.1%',
        tendencia: 'baja',
        icono: 'FileText',
        color: 'amber',
    },
    {
        titulo: 'Vacaciones',
        valor: '87',
        variacion: '+12.3%',
        tendencia: 'sube',
        icono: 'Calendar',
        color: 'purple',
    },
    {
        titulo: 'Permisos Admin.',
        valor: '31',
        variacion: '-3.2%',
        tendencia: 'baja',
        icono: 'ClipboardList',
        color: 'teal',
    },
    {
        titulo: 'Marcaciones Pendientes',
        valor: '23',
        variacion: '+15.7%',
        tendencia: 'sube',
        icono: 'Clock',
        color: 'orange',
    },
    {
        titulo: 'Horas Extra Acum.',
        valor: '1,245h',
        variacion: '+8.9%',
        tendencia: 'sube',
        icono: 'Timer',
        color: 'indigo',
    },
    {
        titulo: 'Atrasos del Día',
        valor: '67',
        variacion: '-4.5%',
        tendencia: 'baja',
        icono: 'AlertTriangle',
        color: 'yellow',
    },
    {
        titulo: 'Cumplimiento General',
        valor: '87.3%',
        variacion: '+1.8%',
        tendencia: 'sube',
        icono: 'TrendingUp',
        color: 'emerald',
    },
];

export const evolucionAtrasos: DatoGraficoMensual[] = [
    { mes: 'Feb', actual: 245, anterior: 278 },
    { mes: 'Mar', actual: 212, anterior: 256 },
    { mes: 'Abr', actual: 198, anterior: 234 },
    { mes: 'May', actual: 176, anterior: 212 },
    { mes: 'Jun', actual: 156, anterior: 198 },
    { mes: 'Jul', actual: 142, anterior: 176 },
];

export const evolucionHorasExtra: DatoGraficoMensual[] = [
    { mes: 'Feb', actual: 320, anterior: 285 },
    { mes: 'Mar', actual: 298, anterior: 310 },
    { mes: 'Abr', actual: 345, anterior: 298 },
    { mes: 'May', actual: 312, anterior: 345 },
    { mes: 'Jun', actual: 287, anterior: 312 },
    { mes: 'Jul', actual: 265, anterior: 287 },
];

export const cumplimientoCentros: CentroCumplimiento[] = [
    { nombre: 'CESFAM Aguirre', actual: 91.2, anterior: 89.5 },
    { nombre: 'CESFAM Guzman', actual: 87.8, anterior: 86.2 },
    { nombre: 'CESFAM Sur', actual: 84.5, anterior: 83.1 },
    { nombre: 'CESFAM Viela', actual: 89.3, anterior: 88.7 },
];

export const cumplimientoUnidades: UnidadCumplimiento[] = [
    { nombre: 'Medicina Interna', actual: 88.5, anterior: 87.2 },
    { nombre: 'Cirugía General', actual: 85.3, anterior: 84.8 },
    { nombre: 'Pediatría', actual: 92.1, anterior: 90.5 },
    { nombre: 'Ginecología', actual: 89.7, anterior: 88.3 },
    { nombre: 'Urgencia', actual: 82.4, anterior: 81.9 },
    { nombre: 'Atención Primaria', actual: 90.8, anterior: 89.4 },
];

export const estadoDiario: EstadoDiario[] = [
    { nombre: 'Presente', cantidad: 1089, porcentaje: 87.3, color: '#22C55E' },
    { nombre: 'Ausente', cantidad: 89, porcentaje: 7.1, color: '#EF4444' },
    { nombre: 'Permiso', cantidad: 31, porcentaje: 2.5, color: '#F59E0B' },
    { nombre: 'Vacación', cantidad: 32, porcentaje: 2.6, color: '#8B5CF6' },
    { nombre: 'Licencia', cantidad: 6, porcentaje: 0.5, color: '#6366F1' },
];

export const tendenciaSemanal: TendenciaSemanal[] = [
    { dia: 'Lun', actual: 1156, anterior: 1142 },
    { dia: 'Mar', actual: 1178, anterior: 1165 },
    { dia: 'Mié', actual: 1165, anterior: 1158 },
    { dia: 'Jue', actual: 1189, anterior: 1175 },
    { dia: 'Vie', actual: 1089, anterior: 1102 },
];

export const comparacionMes: ComparacionMes[] = [
    { categoria: 'Presentes', actual: 1089, anterior: 1102 },
    { categoria: 'Ausentes', actual: 158, anterior: 145 },
    { categoria: 'Permisos', actual: 31, anterior: 38 },
    { categoria: 'Vacaciones', actual: 87, anterior: 76 },
    { categoria: 'Licencias', actual: 42, anterior: 46 },
];

export const rankingCumplimiento: RankingCentro[] = [
    { nombre: 'CESFAM Aguirre', valor: 91.2, color: '#22C55E' },
    { nombre: 'CESFAM Viela', valor: 89.3, color: '#3B82F6' },
    { nombre: 'CESFAM Guzman', valor: 87.8, color: '#8B5CF6' },
    { nombre: 'CESFAM Sur', valor: 84.5, color: '#F59E0B' },
];

export const rankingAusentismo: RankingCentro[] = [
    { nombre: 'CESFAM Sur', valor: 12.8, color: '#EF4444' },
    { nombre: 'CESFAM Guzman', valor: 10.5, color: '#F97316' },
    { nombre: 'CESFAM Viela', valor: 8.2, color: '#F59E0B' },
    { nombre: 'CESFAM Aguirre', valor: 6.9, color: '#22C55E' },
];

export const alertas: AlertaAsistencia[] = [
    {
        id: 1,
        titulo: 'Funcionarios sin marcación de entrada',
        descripcion:
            '23 funcionarios no registraron su marcación de entrada hoy',
        prioridad: 'alta',
        fecha: '2026-07-24',
        cantidad: 23,
    },
    {
        id: 2,
        titulo: 'Funcionarios sin marcación de salida',
        descripcion: '15 funcionarios aún no registraron salida',
        prioridad: 'media',
        fecha: '2026-07-24',
        cantidad: 15,
    },
    {
        id: 3,
        titulo: 'Horarios sin asignar',
        descripcion: '8 funcionarios nuevos no tienen horario asignado',
        prioridad: 'alta',
        fecha: '2026-07-24',
        cantidad: 8,
    },
    {
        id: 4,
        titulo: 'Marcaciones duplicadas detectadas',
        descripcion: '3 funcionarios tienen marcaciones duplicadas en el día',
        prioridad: 'media',
        fecha: '2026-07-24',
        cantidad: 3,
    },
    {
        id: 5,
        titulo: 'Exceso de horas extraordinarias',
        descripcion: '12 funcionarios superaron 20 horas extra este mes',
        prioridad: 'alta',
        fecha: '2026-07-24',
        cantidad: 12,
    },
    {
        id: 6,
        titulo: 'Atrasos reiterados',
        descripcion: '7 funcionarios tienen 5 o más atrasos este mes',
        prioridad: 'baja',
        fecha: '2026-07-24',
        cantidad: 7,
    },
];

export const actividadReciente: ActividadReciente[] = [
    {
        id: 1,
        titulo: 'Nuevo horario asignado',
        descripcion: 'Se asignó horario a 5 funcionarios del CESFAM Aguirre',
        fecha: '24-07-2026',
        hora: '09:15',
        tipo: 'horario',
    },
    {
        id: 2,
        titulo: 'Marcación corregida',
        descripcion:
            'Se corrigió marcación de María González (RUT: 12.345.678-9)',
        fecha: '24-07-2026',
        hora: '08:42',
        tipo: 'marcacion',
    },
    {
        id: 3,
        titulo: 'Actualización de asistencia',
        descripcion: 'Se registró permiso administrativo para Juan Pérez',
        fecha: '24-07-2026',
        hora: '08:30',
        tipo: 'asistencia',
    },
    {
        id: 4,
        titulo: 'Registro de nueva jornada',
        descripcion: 'Se abrió jornada del día para CESFAM Sur',
        fecha: '24-07-2026',
        hora: '07:00',
        tipo: 'jornada',
    },
    {
        id: 5,
        titulo: 'Horario actualizado',
        descripcion: 'Se modificó horario de entrada del CESFAM Viela',
        fecha: '23-07-2026',
        hora: '16:45',
        tipo: 'horario',
    },
    {
        id: 6,
        titulo: 'Marcación registrada',
        descripcion: 'Se registró marcación de salida para 892 funcionarios',
        fecha: '23-07-2026',
        hora: '18:00',
        tipo: 'marcacion',
    },
];

export const resumenInstitucional: ResumenInstitucional[] = [
    {
        metrica: 'Cumplimiento Promedio',
        valor: '87.3%',
        tendencia: 'sube',
        variacion: '+1.8% vs mes anterior',
        icono: 'Target',
        color: 'blue',
    },
    {
        metrica: 'Promedio Diario Atrasos',
        valor: '5.2',
        tendencia: 'baja',
        variacion: '-0.8 vs mes anterior',
        icono: 'Clock',
        color: 'amber',
    },
    {
        metrica: 'Horas Extra del Mes',
        valor: '1,245h',
        tendencia: 'sube',
        variacion: '+8.9% vs mes anterior',
        icono: 'Timer',
        color: 'purple',
    },
    {
        metrica: 'Ausentismo Mensual',
        valor: '8.7%',
        tendencia: 'baja',
        variacion: '-1.2% vs mes anterior',
        icono: 'UserX',
        color: 'red',
    },
    {
        metrica: 'Tendencia General',
        valor: 'Positiva',
        tendencia: 'sube',
        variacion: 'Mejora sostenida en 3 meses',
        icono: 'TrendingUp',
        color: 'green',
    },
];

export const funcionarios: FuncionarioAsistencia[] = [
    {
        rut: '11.111.111-1',
        nombre: 'Funcionario de Prueba',
        cargo: 'Técnico Paramédico',
        profesion: 'Técnico en Enfermería',
        unidad: 'Urgencia',
        centroSalud: 'CESFAM Aguirre',
        jefatura: 'Enfermera Jefa de Urgencia',
        jornada: 'Completa',
        horarioAsignado: '08:00 - 17:00',
        fechaIngreso: '02-03-2019',
        estado: 'Activo',
        iniciales: 'FP',
    },
];

export const horarios: HorarioOption[] = [
    { value: '0800-1700', label: '08:00 - 17:00' },
    { value: '0800-1300', label: '08:00 - 13:00' },
    { value: '1300-1700', label: '13:00 - 17:00' },
];

const diasSemana: DiaHorario[] = [
    { dia: 'Lunes', laborable: true, entrada: '08:00', salida: '17:00' },
    { dia: 'Martes', laborable: true, entrada: '08:00', salida: '17:00' },
    { dia: 'Miércoles', laborable: true, entrada: '08:00', salida: '17:00' },
    { dia: 'Jueves', laborable: true, entrada: '08:00', salida: '17:00' },
    { dia: 'Viernes', laborable: true, entrada: '08:00', salida: '16:00' },
    { dia: 'Sábado', laborable: false, entrada: null, salida: null },
    { dia: 'Domingo', laborable: false, entrada: null, salida: null },
];

export const horariosLaborales: HorarioLaboral[] = [
    {
        id: 'cesfam',
        nombre: 'Horario CESFAM',
        descripcion:
            'Jornada de atención de lunes a viernes en los CESFAM de la comuna.',
        jornada: 'Completa',
        horasSemanales: 43.75,
        diasLaborales: 5,
        diasDescanso: 2,
        estado: 'Activo',
        fechaAsignacion: '01-07-2026',
        dias: diasSemana.map((dia) => ({
            ...dia,
            entrada: '07:45',
            salida: '16:30',
        })),
    },
    {
        id: 'administrativo',
        nombre: 'Horario Administrativo',
        descripcion:
            'Jornada administrativa de lunes a viernes, con salida anticipada los viernes.',
        jornada: 'Completa',
        horasSemanales: 44,
        diasLaborales: 5,
        diasDescanso: 2,
        estado: 'Disponible',
        fechaAsignacion: '—',
        dias: diasSemana.map((dia) => ({ ...dia })),
    },
];

interface DiaEspecial {
    estado: EstadoAsistencia;
    entrada: string | null;
    salida: string | null;
    atrasoMin: number;
    horasExtraMin: number;
    observacion: string;
    horarioUtilizado: string;
}

const diasEspeciales: Record<number, DiaEspecial> = {
    8: {
        estado: 'atraso',
        entrada: '08:03',
        salida: '17:00',
        atrasoMin: 3,
        horasExtraMin: 0,
        observacion: 'Atraso de 3 minutos',
        horarioUtilizado: '08:00 - 17:00',
    },
    9: {
        estado: 'atraso',
        entrada: '08:05',
        salida: '17:00',
        atrasoMin: 5,
        horasExtraMin: 0,
        observacion: 'Atraso de 5 minutos',
        horarioUtilizado: '08:00 - 17:00',
    },
    14: {
        estado: 'atraso',
        entrada: '08:08',
        salida: '17:00',
        atrasoMin: 8,
        horasExtraMin: 0,
        observacion: 'Atraso de 8 minutos',
        horarioUtilizado: '08:00 - 17:00',
    },
    15: {
        estado: 'atraso',
        entrada: '08:10',
        salida: '17:00',
        atrasoMin: 10,
        horasExtraMin: 0,
        observacion: 'Atraso de 10 minutos',
        horarioUtilizado: '08:00 - 17:00',
    },
    16: {
        estado: 'horas_extra',
        entrada: '08:00',
        salida: '17:10',
        atrasoMin: 0,
        horasExtraMin: 10,
        observacion: '10 minutos de horas extraordinarias',
        horarioUtilizado: '08:00 - 17:00',
    },
    17: {
        estado: 'horas_extra',
        entrada: '08:00',
        salida: '17:20',
        atrasoMin: 0,
        horasExtraMin: 20,
        observacion: '20 minutos de horas extraordinarias',
        horarioUtilizado: '08:00 - 17:00',
    },
    23: {
        estado: 'horas_extra',
        entrada: '08:00',
        salida: '17:30',
        atrasoMin: 0,
        horasExtraMin: 30,
        observacion: '30 minutos de horas extraordinarias',
        horarioUtilizado: '08:00 - 17:00',
    },
    24: {
        estado: 'horas_extra',
        entrada: '08:00',
        salida: '18:05',
        atrasoMin: 0,
        horasExtraMin: 65,
        observacion: '1 hora 5 minutos de horas extraordinarias',
        horarioUtilizado: '08:00 - 17:00',
    },
    20: {
        estado: 'licencia',
        entrada: null,
        salida: null,
        atrasoMin: 0,
        horasExtraMin: 0,
        observacion: 'Licencia médica (día 1 de 3)',
        horarioUtilizado: '—',
    },
    21: {
        estado: 'licencia',
        entrada: null,
        salida: null,
        atrasoMin: 0,
        horasExtraMin: 0,
        observacion: 'Licencia médica (día 2 de 3)',
        horarioUtilizado: '—',
    },
    22: {
        estado: 'licencia',
        entrada: null,
        salida: null,
        atrasoMin: 0,
        horasExtraMin: 0,
        observacion: 'Licencia médica (día 3 de 3)',
        horarioUtilizado: '—',
    },
    27: {
        estado: 'vacaciones',
        entrada: null,
        salida: null,
        atrasoMin: 0,
        horasExtraMin: 0,
        observacion: 'Vacaciones (día 1 de 3)',
        horarioUtilizado: '—',
    },
    28: {
        estado: 'vacaciones',
        entrada: null,
        salida: null,
        atrasoMin: 0,
        horasExtraMin: 0,
        observacion: 'Vacaciones (día 2 de 3)',
        horarioUtilizado: '—',
    },
    29: {
        estado: 'vacaciones',
        entrada: null,
        salida: null,
        atrasoMin: 0,
        horasExtraMin: 0,
        observacion: 'Vacaciones (día 3 de 3)',
        horarioUtilizado: '—',
    },
    30: {
        estado: 'permiso',
        entrada: '13:00',
        salida: '17:00',
        atrasoMin: 0,
        horasExtraMin: 0,
        observacion: 'Permiso administrativo - Bloque Mañana',
        horarioUtilizado: 'Bloque Tarde',
    },
    31: {
        estado: 'permiso',
        entrada: '08:00',
        salida: '13:00',
        atrasoMin: 0,
        horasExtraMin: 0,
        observacion: 'Permiso administrativo - Bloque Tarde',
        horarioUtilizado: 'Bloque Mañana',
    },
};

const DIAS_NOMBRE = [
    'Domingo',
    'Lunes',
    'Martes',
    'Miércoles',
    'Jueves',
    'Viernes',
    'Sábado',
];

export function generarRegistrosAsistencia(): RegistroAsistencia[] {
    const registros: RegistroAsistencia[] = [];
    for (let dia = 1; dia <= 31; dia++) {
        const fecha = `2026-07-${String(dia).padStart(2, '0')}`;
        const diaNombre =
            DIAS_NOMBRE[new Date(Date.UTC(2026, 6, dia)).getUTCDay()];
        const especial = diasEspeciales[dia];
        const esFinDeSemana = diaNombre === 'Sábado' || diaNombre === 'Domingo';
        if (especial) {
            registros.push({ fecha, dia: diaNombre, ...especial });
        } else if (esFinDeSemana) {
            registros.push({
                fecha,
                dia: diaNombre,
                entrada: null,
                salida: null,
                atrasoMin: 0,
                horasExtraMin: 0,
                estado: 'descanso',
                observacion: 'Fin de Semana',
                horarioUtilizado: '—',
            });
        } else {
            registros.push({
                fecha,
                dia: diaNombre,
                entrada: '08:00',
                salida: '17:00',
                atrasoMin: 0,
                horasExtraMin: 0,
                estado: 'presente',
                observacion: '',
                horarioUtilizado: '08:00 - 17:00',
            });
        }
    }
    return registros;
}

export const lugaresDesempeno: LugarOption[] = [
    { value: 'casa-central', label: 'Casa Central' },
    { value: 'das', label: 'DAS' },
    { value: 'cesfam-aguirre', label: 'CESFAM Aguirre' },
    { value: 'cesfam-guzman', label: 'CESFAM Guzmán' },
    { value: 'cesfam-sur', label: 'CESFAM Sur' },
    { value: 'cesfam-videla', label: 'CESFAM Videla' },
];

export const unidadesCasaCentral: UnidadAsistencia[] = [
    {
        id: 'informatica',
        nombre: 'Informática',
        lugarDesempeno: 'casa-central',
        dotacion: 8,
        presentes: 3,
        ausentes: 1,
        cumplimiento: 94.2,
    },
    {
        id: 'remuneraciones',
        nombre: 'Remuneraciones',
        lugarDesempeno: 'casa-central',
        dotacion: 4,
        presentes: 3,
        ausentes: 0,
        cumplimiento: 91.8,
    },
    {
        id: 'contabilidad',
        nombre: 'Contabilidad',
        lugarDesempeno: 'casa-central',
        dotacion: 3,
        presentes: 2,
        ausentes: 0,
        cumplimiento: 88.5,
    },
    {
        id: 'recursos-humanos',
        nombre: 'Recursos Humanos',
        lugarDesempeno: 'casa-central',
        dotacion: 5,
        presentes: 4,
        ausentes: 0,
        cumplimiento: 95.1,
    },
    {
        id: 'asesores',
        nombre: 'Asesores',
        lugarDesempeno: 'das',
        dotacion: 3,
        presentes: 2,
        ausentes: 1,
        cumplimiento: 84.7,
    },
];

export const funcionariosUnidad: FuncionarioUnidad[] = [
    {
        id: 1,
        rut: '12.611.727-2',
        nombre: 'Amador Toro Gonzalez',
        cargo: 'Encargado de Informática',
        lugarDesempeno: 'Casa Central',
        unidad: 'Informática',
        iniciales: 'AT',
    },
    {
        id: 2,
        rut: '17.096.233-8',
        nombre: 'Nelson Araya Vacca',
        cargo: 'Ingeniero en Informática',
        lugarDesempeno: 'Casa Central',
        unidad: 'Informática',
        iniciales: 'NA',
    },
    {
        id: 3,
        rut: '14.729.187-6',
        nombre: 'Juan Flores Romero',
        cargo: 'Ingeniero en Informática',
        lugarDesempeno: 'Casa Central',
        unidad: 'Informática',
        iniciales: 'JF',
    },
    {
        id: 4,
        rut: '13.865.417-6',
        nombre: 'Carlos Gonzalez Lopez',
        cargo: 'Soporte Técnico Informático',
        lugarDesempeno: 'Casa Central',
        unidad: 'Informática',
        iniciales: 'CG',
    },
    {
        id: 5,
        rut: '13.214.303-K',
        nombre: 'Daniel Fernandez Acevedo',
        cargo: 'Soporte Técnico Informático',
        lugarDesempeno: 'Casa Central',
        unidad: 'Informática',
        iniciales: 'DA',
    },
    {
        id: 6,
        rut: '17.555.115-8',
        nombre: 'Felipe Romero Hernandez',
        cargo: 'Soporte Técnico Informático',
        lugarDesempeno: 'Casa Central',
        unidad: 'Informática',
        iniciales: 'FR',
    },
    {
        id: 22,
        rut: '20.250.541-4',
        nombre: 'Ignacio Rojas Duran',
        cargo: 'Soporte Técnico Informático',
        lugarDesempeno: 'Casa Central',
        unidad: 'Informática',
        iniciales: 'IR',
    },
    {
        id: 23,
        rut: '28.728.058-0',
        nombre: 'Dorian Ricaldy Tondola',
        cargo: 'Soporte Técnico Informático',
        lugarDesempeno: 'Casa Central',
        unidad: 'Informática',
        iniciales: 'DR',
    },
    {
        id: 7,
        rut: '15.203.441-7',
        nombre: 'Patricia Soto Vargas',
        cargo: 'Jefa de Remuneraciones',
        lugarDesempeno: 'Casa Central',
        unidad: 'Remuneraciones',
        iniciales: 'PS',
    },
    {
        id: 8,
        rut: '16.784.920-1',
        nombre: 'Rodrigo Muñoz Silva',
        cargo: 'Analista de Remuneraciones',
        lugarDesempeno: 'Casa Central',
        unidad: 'Remuneraciones',
        iniciales: 'RM',
    },
    {
        id: 9,
        rut: '18.367.552-4',
        nombre: 'Camila Rojas Tapia',
        cargo: 'Analista de Remuneraciones',
        lugarDesempeno: 'Casa Central',
        unidad: 'Remuneraciones',
        iniciales: 'CR',
    },
    {
        id: 10,
        rut: '14.921.806-3',
        nombre: 'Marcela Fuentes Carrasco',
        cargo: 'Asistente de Remuneraciones',
        lugarDesempeno: 'Casa Central',
        unidad: 'Remuneraciones',
        iniciales: 'MF',
    },
    {
        id: 11,
        rut: '13.448.220-5',
        nombre: 'Hugo Paredes Villanueva',
        cargo: 'Jefe de Contabilidad',
        lugarDesempeno: 'Casa Central',
        unidad: 'Contabilidad',
        iniciales: 'HP',
    },
    {
        id: 12,
        rut: '17.902.118-2',
        nombre: 'Sandra Lagos Cifuentes',
        cargo: 'Contador General',
        lugarDesempeno: 'Casa Central',
        unidad: 'Contabilidad',
        iniciales: 'SL',
    },
    {
        id: 13,
        rut: '15.667.334-9',
        nombre: 'Mario Escobar Pino',
        cargo: 'Contador',
        lugarDesempeno: 'Casa Central',
        unidad: 'Contabilidad',
        iniciales: 'ME',
    },
    {
        id: 14,
        rut: '12.903.547-1',
        nombre: 'Ana Maria Contreras Poblete',
        cargo: 'Jefa de Recursos Humanos',
        lugarDesempeno: 'Casa Central',
        unidad: 'Recursos Humanos',
        iniciales: 'AC',
    },
    {
        id: 15,
        rut: '16.118.664-3',
        nombre: 'Jorge Bravo Gutierrez',
        cargo: 'Analista de Personal',
        lugarDesempeno: 'Casa Central',
        unidad: 'Recursos Humanos',
        iniciales: 'JB',
    },
    {
        id: 16,
        rut: '18.775.009-7',
        nombre: 'Veronica Salinas Rosales',
        cargo: 'Analista de Bienestar',
        lugarDesempeno: 'Casa Central',
        unidad: 'Recursos Humanos',
        iniciales: 'VS',
    },
    {
        id: 17,
        rut: '14.582.731-0',
        nombre: 'Cristian Vergara Castro',
        cargo: 'Encargado de Capacitación',
        lugarDesempeno: 'Casa Central',
        unidad: 'Recursos Humanos',
        iniciales: 'CV',
    },
    {
        id: 18,
        rut: '19.240.615-6',
        nombre: 'Nicole Araneda Jara',
        cargo: 'Asistente RRHH',
        lugarDesempeno: 'Casa Central',
        unidad: 'Recursos Humanos',
        iniciales: 'NA',
    },
    {
        id: 19,
        rut: '13.058.990-4',
        nombre: 'Gustavo Henriquez Bravo',
        cargo: 'Asesor Jurídico',
        lugarDesempeno: 'DAS',
        unidad: 'Asesores',
        iniciales: 'GH',
    },
    {
        id: 20,
        rut: '15.897.442-8',
        nombre: 'Lorena Sepulveda Rojas',
        cargo: 'Asesora de Gabinete',
        lugarDesempeno: 'DAS',
        unidad: 'Asesores',
        iniciales: 'LS',
    },
    {
        id: 21,
        rut: '17.304.668-2',
        nombre: 'Sebastian Navarro Ortiz',
        cargo: 'Asesor Técnico',
        lugarDesempeno: 'DAS',
        unidad: 'Asesores',
        iniciales: 'SN',
    },
];

export const estadosDiarioOptions = [
    { value: 'todos', label: 'Todos los Estados' },
    { value: 'presente', label: 'Presente' },
    { value: 'atraso', label: 'Atraso' },
    { value: 'ausente', label: 'Ausente' },
    { value: 'permiso', label: 'Permiso Administrativo' },
    { value: 'licencia', label: 'Licencia Médica' },
    { value: 'vacaciones', label: 'Vacaciones' },
];

const registrosInformatica: RegistroDiarioUnidad[] = [
    {
        id: 1,
        funcionarioId: 1,
        horarioAsignado: '08:00 - 17:00',
        entrada: '07:58',
        atrasoMin: 0,
        salida: '17:00',
        estado: 'presente',
        observacion: 'Sin novedades',
    },
    {
        id: 2,
        funcionarioId: 2,
        horarioAsignado: '08:00 - 17:00',
        entrada: '08:07',
        atrasoMin: 7,
        salida: '17:00',
        estado: 'atraso',
        observacion: 'Atraso de 7 minutos',
    },
    {
        id: 3,
        funcionarioId: 3,
        horarioAsignado: '08:00 - 17:00',
        entrada: null,
        atrasoMin: 0,
        salida: null,
        estado: 'licencia',
        observacion: 'Licencia médica (día 2 de 3)',
    },
    {
        id: 4,
        funcionarioId: 4,
        horarioAsignado: '08:00 - 17:00',
        entrada: '08:00',
        atrasoMin: 0,
        salida: '13:00',
        estado: 'permiso',
        observacion: 'Permiso administrativo - Bloque Tarde',
    },
    {
        id: 5,
        funcionarioId: 5,
        horarioAsignado: '08:00 - 17:00',
        entrada: null,
        atrasoMin: 0,
        salida: null,
        estado: 'vacaciones',
        observacion: 'Vacaciones legales',
    },
    {
        id: 6,
        funcionarioId: 6,
        horarioAsignado: '08:00 - 17:00',
        entrada: null,
        atrasoMin: 0,
        salida: null,
        estado: 'ausente',
        observacion: 'Sin justificación',
    },
    {
        id: 22,
        funcionarioId: 22,
        horarioAsignado: '08:00 - 17:00',
        entrada: '08:00',
        atrasoMin: 0,
        salida: '17:00',
        estado: 'presente',
        observacion: 'Sin novedades',
    },
    {
        id: 23,
        funcionarioId: 23,
        horarioAsignado: '08:00 - 17:00',
        entrada: '08:00',
        atrasoMin: 0,
        salida: '17:00',
        estado: 'presente',
        observacion: 'Sin novedades',
    },
];

const registrosRemuneraciones: RegistroDiarioUnidad[] = [
    {
        id: 7,
        funcionarioId: 7,
        horarioAsignado: '08:00 - 17:00',
        entrada: '07:55',
        atrasoMin: 0,
        salida: '17:05',
        estado: 'presente',
        observacion: 'Sin novedades',
    },
    {
        id: 8,
        funcionarioId: 8,
        horarioAsignado: '08:00 - 17:00',
        entrada: '08:04',
        atrasoMin: 4,
        salida: '17:00',
        estado: 'atraso',
        observacion: 'Atraso de 4 minutos',
    },
    {
        id: 9,
        funcionarioId: 9,
        horarioAsignado: '08:00 - 17:00',
        entrada: '07:59',
        atrasoMin: 0,
        salida: '17:00',
        estado: 'presente',
        observacion: 'Sin novedades',
    },
    {
        id: 10,
        funcionarioId: 10,
        horarioAsignado: '08:00 - 17:00',
        entrada: '08:00',
        atrasoMin: 0,
        salida: '17:00',
        estado: 'presente',
        observacion: 'Sin novedades',
    },
];

const registrosContabilidad: RegistroDiarioUnidad[] = [
    {
        id: 11,
        funcionarioId: 11,
        horarioAsignado: '08:00 - 17:00',
        entrada: '07:50',
        atrasoMin: 0,
        salida: '17:10',
        estado: 'presente',
        observacion: 'Sin novedades',
    },
    {
        id: 12,
        funcionarioId: 12,
        horarioAsignado: '08:00 - 17:00',
        entrada: '08:00',
        atrasoMin: 0,
        salida: '13:00',
        estado: 'permiso',
        observacion: 'Permiso administrativo - Bloque Tarde',
    },
    {
        id: 13,
        funcionarioId: 13,
        horarioAsignado: '08:00 - 17:00',
        entrada: '08:02',
        atrasoMin: 0,
        salida: '17:00',
        estado: 'presente',
        observacion: 'Sin novedades',
    },
];

const registrosRecursosHumanos: RegistroDiarioUnidad[] = [
    {
        id: 14,
        funcionarioId: 14,
        horarioAsignado: '08:00 - 17:00',
        entrada: '07:58',
        atrasoMin: 0,
        salida: '17:00',
        estado: 'presente',
        observacion: 'Sin novedades',
    },
    {
        id: 15,
        funcionarioId: 15,
        horarioAsignado: '08:00 - 17:00',
        entrada: '08:00',
        atrasoMin: 0,
        salida: '17:00',
        estado: 'presente',
        observacion: 'Sin novedades',
    },
    {
        id: 16,
        funcionarioId: 16,
        horarioAsignado: '08:00 - 17:00',
        entrada: null,
        atrasoMin: 0,
        salida: null,
        estado: 'licencia',
        observacion: 'Licencia médica (día 1 de 3)',
    },
    {
        id: 17,
        funcionarioId: 17,
        horarioAsignado: '08:00 - 17:00',
        entrada: '08:01',
        atrasoMin: 0,
        salida: '17:00',
        estado: 'presente',
        observacion: 'Sin novedades',
    },
    {
        id: 18,
        funcionarioId: 18,
        horarioAsignado: '08:00 - 17:00',
        entrada: '07:57',
        atrasoMin: 0,
        salida: '17:00',
        estado: 'presente',
        observacion: 'Sin novedades',
    },
];

const registrosAsesores: RegistroDiarioUnidad[] = [
    {
        id: 19,
        funcionarioId: 19,
        horarioAsignado: '08:00 - 17:00',
        entrada: '08:00',
        atrasoMin: 0,
        salida: '17:00',
        estado: 'presente',
        observacion: 'Sin novedades',
    },
    {
        id: 20,
        funcionarioId: 20,
        horarioAsignado: '08:00 - 17:00',
        entrada: null,
        atrasoMin: 0,
        salida: null,
        estado: 'ausente',
        observacion: 'Sin justificación',
    },
    {
        id: 21,
        funcionarioId: 21,
        horarioAsignado: '08:00 - 17:00',
        entrada: '07:56',
        atrasoMin: 0,
        salida: '17:00',
        estado: 'presente',
        observacion: 'Sin novedades',
    },
];

const resumenDiarioBase = (labels: {
    dotacion: number;
    presentes: number;
    atrasos: number;
    ausentes: number;
    permisos: number;
    licencias: number;
    vacaciones: number;
}): TarjetaResumen[] => [
    {
        label: 'Dotación Total',
        valor: labels.dotacion,
        icono: 'Users',
        color: 'blue',
    },
    {
        label: 'Presentes',
        valor: labels.presentes,
        icono: 'UserCheck',
        color: 'emerald',
    },
    {
        label: 'Atrasos',
        valor: labels.atrasos,
        icono: 'AlarmClock',
        color: 'amber',
    },
    {
        label: 'Ausentes',
        valor: labels.ausentes,
        icono: 'UserX',
        color: 'red',
    },
    {
        label: 'Permisos Administrativos',
        valor: labels.permisos,
        icono: 'ClipboardList',
        color: 'purple',
    },
    {
        label: 'Licencias Médicas',
        valor: labels.licencias,
        icono: 'FileText',
        color: 'blue',
    },
    {
        label: 'Vacaciones',
        valor: labels.vacaciones,
        icono: 'TreePalm',
        color: 'teal',
    },
];

export const datosDiarioPorUnidad: Record<string, DatosUnidadDiario> = {
    informatica: {
        resumen: resumenDiarioBase({
            dotacion: 8,
            presentes: 3,
            atrasos: 1,
            ausentes: 1,
            permisos: 1,
            licencias: 1,
            vacaciones: 1,
        }),
        registros: registrosInformatica,
    },
    remuneraciones: {
        resumen: resumenDiarioBase({
            dotacion: 4,
            presentes: 3,
            atrasos: 1,
            ausentes: 0,
            permisos: 0,
            licencias: 0,
            vacaciones: 0,
        }),
        registros: registrosRemuneraciones,
    },
    contabilidad: {
        resumen: resumenDiarioBase({
            dotacion: 3,
            presentes: 2,
            atrasos: 0,
            ausentes: 0,
            permisos: 1,
            licencias: 0,
            vacaciones: 0,
        }),
        registros: registrosContabilidad,
    },
    'recursos-humanos': {
        resumen: resumenDiarioBase({
            dotacion: 5,
            presentes: 4,
            atrasos: 0,
            ausentes: 0,
            permisos: 0,
            licencias: 1,
            vacaciones: 0,
        }),
        registros: registrosRecursosHumanos,
    },
    asesores: {
        resumen: resumenDiarioBase({
            dotacion: 3,
            presentes: 2,
            atrasos: 0,
            ausentes: 1,
            permisos: 0,
            licencias: 0,
            vacaciones: 0,
        }),
        registros: registrosAsesores,
    },
};

export const alertasDia: AlertaDia[] = [
    {
        id: 1,
        titulo: 'Ausencia sin justificación',
        descripcion:
            'Felipe Romero Hernandez no se ha presentado ni ha justificado su ausencia.',
        prioridad: 'alta',
    },
    {
        id: 2,
        titulo: 'Cobertura crítica en Soporte Técnico',
        descripcion:
            '3 de 5 soportes técnicos no disponibles hoy. Evaluar redistribución.',
        prioridad: 'media',
    },
    {
        id: 3,
        titulo: 'Licencia médica en curso',
        descripcion: 'Juan Flores Romero con licencia médica (día 2 de 3).',
        prioridad: 'baja',
    },
];

export const indicadoresCobertura: IndicadorCobertura[] = [
    {
        label: 'Cobertura de Atenciones',
        valor: '87%',
        detalle: '6 atenciones asignadas',
        color: 'emerald',
    },
    {
        label: 'Personal Disponible',
        valor: '4/6',
        detalle: '2 con permisos o ausencias',
        color: 'blue',
    },
    {
        label: 'Reemplazos Activos',
        valor: '1',
        detalle: 'Soporte técnico cubierto',
        color: 'amber',
    },
    {
        label: 'Turnos Cubiertos',
        valor: '100%',
        detalle: 'Sin turnos críticos hoy',
        color: 'teal',
    },
];

export const resumenMensualInformatica: TarjetaResumen[] = [
    {
        label: 'Dotación Promedio',
        valor: 8,
        icono: 'Users',
        color: 'blue',
        detalle: 'Unidad Informática',
    },
    {
        label: 'Horas Esperadas',
        valor: '1,472h',
        icono: 'Clock',
        color: 'indigo',
        detalle: '23 días hábiles',
    },
    {
        label: 'Horas Trabajadas',
        valor: '1,360h',
        icono: 'Timer',
        color: 'blue',
        detalle: 'Incluye reemplazos',
    },
    {
        label: 'Horas Extraordinarias',
        valor: '68h',
        icono: 'Zap',
        color: 'amber',
        detalle: '+12% vs mes anterior',
    },
    {
        label: 'Minutos de Atraso',
        valor: '96 min',
        icono: 'AlarmClock',
        color: 'orange',
        detalle: '14 días con atraso',
    },
    {
        label: 'Ausentismo',
        valor: '6.8%',
        icono: 'UserX',
        color: 'red',
        detalle: '-1.2% vs mes anterior',
    },
    {
        label: 'Cumplimiento General',
        valor: '92.4%',
        icono: 'Target',
        color: 'emerald',
        detalle: '+0.8% vs mes anterior',
    },
];

export const detalleMensualInformatica: DetalleMensualFuncionario[] = [
    {
        id: 1,
        funcionarioId: 1,
        horasTrabajadas: 176,
        horasExtra: '2h',
        atrasosMin: 0,
        ausenciasDias: 0,
        cumplimiento: 98.2,
    },
    {
        id: 2,
        funcionarioId: 2,
        horasTrabajadas: 170,
        horasExtra: '4h',
        atrasosMin: 28,
        ausenciasDias: 1,
        cumplimiento: 95.6,
    },
    {
        id: 3,
        funcionarioId: 3,
        horasTrabajadas: 156,
        horasExtra: '0h',
        atrasosMin: 0,
        ausenciasDias: 5,
        cumplimiento: 88.9,
    },
    {
        id: 4,
        funcionarioId: 4,
        horasTrabajadas: 168,
        horasExtra: '3h',
        atrasosMin: 12,
        ausenciasDias: 2,
        cumplimiento: 93.4,
    },
    {
        id: 5,
        funcionarioId: 5,
        horasTrabajadas: 152,
        horasExtra: '0h',
        atrasosMin: 0,
        ausenciasDias: 4,
        cumplimiento: 86.7,
    },
    {
        id: 6,
        funcionarioId: 6,
        horasTrabajadas: 164,
        horasExtra: '2h',
        atrasosMin: 0,
        ausenciasDias: 3,
        cumplimiento: 91.3,
    },
    {
        id: 7,
        funcionarioId: 22,
        horasTrabajadas: 174,
        horasExtra: '1h',
        atrasosMin: 0,
        ausenciasDias: 0,
        cumplimiento: 97.5,
    },
    {
        id: 8,
        funcionarioId: 23,
        horasTrabajadas: 172,
        horasExtra: '2h',
        atrasosMin: 6,
        ausenciasDias: 0,
        cumplimiento: 96.8,
    },
];

export const evolucionHorasInformatica: PuntoEvolucion[] = [
    { dia: '01', valor: 42 },
    { dia: '02', valor: 46 },
    { dia: '03', valor: 38 },
    { dia: '04', valor: 44 },
    { dia: '07', valor: 40 },
    { dia: '08', valor: 48 },
    { dia: '09', valor: 36 },
    { dia: '10', valor: 44 },
    { dia: '11', valor: 42 },
    { dia: '14', valor: 46 },
];

export const evolucionHorasExtraInformatica: PuntoEvolucion[] = [
    { dia: '02', valor: 6 },
    { dia: '04', valor: 4 },
    { dia: '07', valor: 8 },
    { dia: '09', valor: 5 },
    { dia: '11', valor: 7 },
    { dia: '14', valor: 6 },
    { dia: '16', valor: 9 },
    { dia: '18', valor: 5 },
    { dia: '21', valor: 8 },
    { dia: '24', valor: 10 },
];

export const evolucionAtrasosInformatica: PuntoEvolucion[] = [
    { dia: '03', valor: 12 },
    { dia: '06', valor: 8 },
    { dia: '08', valor: 15 },
    { dia: '10', valor: 6 },
    { dia: '13', valor: 9 },
    { dia: '17', valor: 14 },
    { dia: '20', valor: 5 },
    { dia: '22', valor: 11 },
    { dia: '25', valor: 7 },
    { dia: '28', valor: 9 },
];

export const distribucionMensualInformatica: EstadoDistribucion[] = [
    { nombre: 'Presentes', cantidad: 96, color: '#10B981' },
    { nombre: 'Atrasos', cantidad: 14, color: '#F59E0B' },
    { nombre: 'Ausencias', cantidad: 8, color: '#EF4444' },
    { nombre: 'Permisos', cantidad: 6, color: '#8B5CF6' },
    { nombre: 'Licencias', cantidad: 12, color: '#3B82F6' },
    { nombre: 'Vacaciones', cantidad: 10, color: '#14B8A6' },
];

export const comparacionMensualInformatica: ComparacionMesUnidad[] = [
    { mes: 'Febrero', actual: 88.4, anterior: 87.1 },
    { mes: 'Marzo', actual: 89.8, anterior: 88.4 },
    { mes: 'Abril', actual: 90.5, anterior: 89.8 },
    { mes: 'Mayo', actual: 91.2, anterior: 90.5 },
    { mes: 'Junio', actual: 91.6, anterior: 91.2 },
    { mes: 'Julio', actual: 92.4, anterior: 91.6 },
];

function seedUnidad(unidadId: string): number {
    let h = 0;
    for (let i = 0; i < unidadId.length; i++) {
        h = (h * 31 + unidadId.charCodeAt(i)) % 997;
    }
    return h;
}

function generarEvolucion(
    unidadId: string,
    min: number,
    max: number,
): PuntoEvolucion[] {
    const s = seedUnidad(unidadId);
    return Array.from({ length: 10 }, (_, i) => ({
        dia: `${String([1, 2, 3, 4, 7, 8, 9, 10, 11, 14][i]).padStart(2, '0')}`,
        valor: min + ((s + i * 7) % (max - min + 1)),
    }));
}

export function obtenerDatosMensual(unidadId: string): DatosUnidadMensual {
    if (unidadId === 'informatica') {
        return {
            resumen: resumenMensualInformatica,
            detalle: detalleMensualInformatica,
            evolucionHoras: evolucionHorasInformatica,
            evolucionHorasExtra: evolucionHorasExtraInformatica,
            evolucionAtrasos: evolucionAtrasosInformatica,
            distribucion: distribucionMensualInformatica,
            comparacion: comparacionMensualInformatica,
        };
    }
    const unidad = unidadesCasaCentral.find((u) => u.id === unidadId);
    const miembros = funcionariosUnidad.filter(
        (f) => f.unidad === unidad?.nombre,
    );
    const s = seedUnidad(unidadId);
    return {
        resumen: [
            {
                label: 'Dotación Promedio',
                valor: unidad?.dotacion ?? 0,
                icono: 'Users',
                color: 'blue',
                detalle: `Unidad ${unidad?.nombre ?? ''}`,
            },
            {
                label: 'Horas Esperadas',
                valor: `${((unidad?.dotacion ?? 0) * 184).toLocaleString('es-CL')}h`,
                icono: 'Clock',
                color: 'indigo',
                detalle: '23 días hábiles',
            },
            {
                label: 'Horas Trabajadas',
                valor: `${((unidad?.dotacion ?? 0) * 170).toLocaleString('es-CL')}h`,
                icono: 'Timer',
                color: 'blue',
                detalle: 'Incluye reemplazos',
            },
            {
                label: 'Horas Extraordinarias',
                valor: `${20 + (s % 40)}h`,
                icono: 'Zap',
                color: 'amber',
                detalle: 'Horas autorizadas',
            },
            {
                label: 'Minutos de Atraso',
                valor: `${60 + (s % 80)} min`,
                icono: 'AlarmClock',
                color: 'orange',
                detalle: 'Promedio mensual',
            },
            {
                label: 'Ausentismo',
                valor: `${(4 + (s % 4)).toFixed(1)}%`,
                icono: 'UserX',
                color: 'red',
                detalle: 'Sin tendencia',
            },
            {
                label: 'Cumplimiento General',
                valor: `${(unidad?.cumplimiento ?? 88).toFixed(1)}%`,
                icono: 'Target',
                color: 'emerald',
                detalle: 'Del período seleccionado',
            },
        ],
        detalle: miembros.map((f, i) => ({
            id: f.id,
            funcionarioId: f.id,
            horasTrabajadas: 150 + ((s + i * 3) % 24),
            horasExtra: `${(s + i) % 6}h`,
            atrasosMin: (s + i * 5) % 40,
            ausenciasDias: (s + i) % 5,
            cumplimiento: 84 + ((s + i * 3) % 14),
        })),
        evolucionHoras: generarEvolucion(unidadId, 20, 40),
        evolucionHorasExtra: generarEvolucion(unidadId, 2, 10),
        evolucionAtrasos: generarEvolucion(unidadId, 4, 16),
        distribucion: [
            { nombre: 'Presentes', cantidad: 80 + (s % 15), color: '#10B981' },
            { nombre: 'Atrasos', cantidad: 8 + (s % 6), color: '#F59E0B' },
            { nombre: 'Ausencias', cantidad: 4 + (s % 4), color: '#EF4444' },
            { nombre: 'Permisos', cantidad: 3 + (s % 3), color: '#8B5CF6' },
            { nombre: 'Licencias', cantidad: 3 + (s % 4), color: '#3B82F6' },
            { nombre: 'Vacaciones', cantidad: 4 + (s % 3), color: '#14B8A6' },
        ],
        comparacion: Array.from({ length: 6 }, (_, i) => {
            const base = 84 + (s % 6);
            return {
                mes: ['Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio', 'Julio'][i],
                actual: base + i,
                anterior: base + i - 1,
            };
        }),
    };
}

const DIAS_CARTOLA = [
    { fecha: '03-08-2026', dia: 'Lunes' },
    { fecha: '04-08-2026', dia: 'Martes' },
    { fecha: '05-08-2026', dia: 'Miércoles' },
    { fecha: '06-08-2026', dia: 'Jueves' },
    { fecha: '07-08-2026', dia: 'Viernes' },
];

export function generarMiniCartola(
    funcionarioId: number,
): RegistroMiniCartola[] {
    return DIAS_CARTOLA.map((d, i) => {
        const r = (funcionarioId + i) % 5;
        if (r === 0) {
            return {
                ...d,
                entrada: '08:00',
                salida: '17:00',
                estado: 'Presente',
                observacion: 'Asistencia normal',
            };
        }
        if (r === 1) {
            return {
                ...d,
                entrada: '08:07',
                salida: '17:00',
                estado: 'Atraso',
                observacion: 'Atraso de 7 minutos',
            };
        }
        if (r === 2) {
            return {
                ...d,
                entrada: '08:00',
                salida: '17:30',
                estado: 'Horas Extra',
                observacion: '30 minutos de horas extraordinarias',
            };
        }
        if (r === 3) {
            return {
                ...d,
                entrada: '08:00',
                salida: '13:00',
                estado: 'Permiso',
                observacion: 'Permiso administrativo - Bloque Tarde',
            };
        }
        return {
            ...d,
            entrada: null,
            salida: null,
            estado: 'Licencia',
            observacion: 'Licencia médica',
        };
    });
}

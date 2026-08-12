export const sexos = [
  { value: 'masculino', label: 'Masculino' },
  { value: 'femenino', label: 'Femenino' },
]

export const estadosCiviles = [
  { value: 'soltero', label: 'Soltero/a' },
  { value: 'casado', label: 'Casado/a' },
  { value: 'viudo', label: 'Viudo/a' },
  { value: 'divorciado', label: 'Divorciado/a' },
]

export const nacionalidades = [
  { value: 'chilena', label: 'Chilena' },
  { value: 'extranjera', label: 'Extranjera' },
]

export const servicios = [
  { value: 'sepultacion', label: 'Sepultación' },
  { value: 'exhumacion', label: 'Exhumación' },
  { value: 'reduccion', label: 'Reducción' },
  { value: 'traslado', label: 'Traslado' },
  { value: 'cremacion', label: 'Cremación' },
  { value: 'mantencion', label: 'Mantención' },
  { value: 'apertura_nicho', label: 'Apertura de Nicho' },
  { value: 'cierre_nicho', label: 'Cierre de Nicho' },
]

export const estadosOt = [
  { value: 'Ingresada', label: 'Ingresada' },
  { value: 'Finalizada', label: 'Finalizada' },
  { value: 'Anulada', label: 'Anulada' },
]

export const tiposResponsable = [
  { value: 'particular', label: 'Particular' },
  { value: 'municipal', label: 'Municipal' },
  { value: 'otro', label: 'Otros' },
]

export const relaciones = [
  { value: 'conyuge', label: 'Cónyuge' },
  { value: 'hijo', label: 'Hijo/a' },
  { value: 'padre', label: 'Padre/Madre' },
  { value: 'hermano', label: 'Hermano/a' },
  { value: 'familiar', label: 'Otro Familiar' },
  { value: 'amigo', label: 'Amigo/a' },
  { value: 'otro', label: 'Otro' },
]

export const mockFallecidos = [
  { id: 1, rut: '12.345.678-9', nombres: 'Juan Carlos', apellido_paterno: 'González', apellido_materno: 'López', fecha_nacimiento: '1950-03-15', fecha_fallecimiento: '2026-06-15', sexo: 'masculino', estado_civil: 'casado', nacionalidad: 'chilena', lugar_fallecimiento: 'Hospital Clínico de Santiago', observaciones: 'Sepultación en nicho familiar', carta_defuncion: 'Carta_defuncion.pdf' },
  { id: 2, rut: '9.876.543-2', nombres: 'María Elena', apellido_paterno: 'Rodríguez', apellido_materno: 'Pérez', fecha_nacimiento: '1962-08-22', fecha_fallecimiento: '2026-06-14', sexo: 'femenino', estado_civil: 'viudo', nacionalidad: 'chilena', lugar_fallecimiento: 'Clínica Alemana de Santiago', observaciones: 'Cremación sin ceremonia', carta_defuncion: 'Carta_defuncion_2.pdf' },
  { id: 3, rut: '15.234.567-8', nombres: 'Pedro', apellido_paterno: 'Muñoz', apellido_materno: 'Rojas', fecha_nacimiento: '1945-11-02', fecha_fallecimiento: '2026-06-13', sexo: 'masculino', estado_civil: 'casado', nacionalidad: 'chilena', lugar_fallecimiento: 'Domicilio particular', observaciones: 'Exhumación programada para traslado', carta_defuncion: 'Carta_defuncion_3.pdf' },
  { id: 4, rut: '8.765.432-1', nombres: 'Ana María', apellido_paterno: 'Soto', apellido_materno: 'Fuentes', fecha_nacimiento: '1978-05-30', fecha_fallecimiento: '2026-06-12', sexo: 'femenino', estado_civil: 'soltero', nacionalidad: 'chilena', lugar_fallecimiento: 'Hospital Sótero del Río', observaciones: '', carta_defuncion: 'Carta_defuncion_4.pdf' },
  { id: 5, rut: '16.789.012-3', nombres: 'Luis Alberto', apellido_paterno: 'Vega', apellido_materno: 'Castro', fecha_nacimiento: '1938-07-19', fecha_fallecimiento: '2026-06-11', sexo: 'masculino', estado_civil: 'divorciado', nacionalidad: 'extranjera', lugar_fallecimiento: 'Hospital de Viña del Mar', observaciones: 'Reducción de restos', carta_defuncion: 'Carta_defuncion_5.pdf' },
]

export const mockOrdenes = [
  { id: 'OT-001', fallecido: 'Juan Carlos González López', rut_fallecido: '12.345.678-9', fecha: '2026-06-15', servicio: 'Sepultación', estado: 'Pendiente' },
  { id: 'OT-002', fallecido: 'María Elena Rodríguez Pérez', rut_fallecido: '9.876.543-2', fecha: '2026-06-14', servicio: 'Cremación', estado: 'En Proceso' },
  { id: 'OT-003', fallecido: 'Pedro Muñoz Rojas', rut_fallecido: '15.234.567-8', fecha: '2026-06-13', servicio: 'Exhumación', estado: 'Finalizada' },
  { id: 'OT-004', fallecido: 'Ana María Soto Fuentes', rut_fallecido: '8.765.432-1', fecha: '2026-06-12', servicio: 'Traslado', estado: 'Pendiente' },
  { id: 'OT-005', fallecido: 'Luis Alberto Vega Castro', rut_fallecido: '16.789.012-3', fecha: '2026-06-11', servicio: 'Reducción', estado: 'Anulada' },
  { id: 'OT-006', fallecido: 'Juan Carlos González López', rut_fallecido: '12.345.678-9', fecha: '2026-06-10', servicio: 'Apertura de Nicho', estado: 'En Proceso' },
  { id: 'OT-007', fallecido: 'María Elena Rodríguez Pérez', rut_fallecido: '9.876.543-2', fecha: '2026-06-09', servicio: 'Mantención', estado: 'Finalizada' },
  { id: 'OT-008', fallecido: 'Pedro Muñoz Rojas', rut_fallecido: '15.234.567-8', fecha: '2026-06-08', servicio: 'Cierre de Nicho', estado: 'Pendiente' },
]

export const sectores = [
  { value: 'norte', label: 'Sector Norte' },
  { value: 'sur', label: 'Sector Sur' },
  { value: 'este', label: 'Sector Este' },
  { value: 'oeste', label: 'Sector Oeste' },
  { value: 'central', label: 'Sector Central' },
]

export const estadosUbicacion = [
  { value: 'disponible', label: 'Disponible' },
  { value: 'ocupado', label: 'Ocupado' },
  { value: 'reservado', label: 'Reservado' },
  { value: 'en_mantencion', label: 'En Mantención' },
  { value: 'bloqueado', label: 'Bloqueado' },
]

export const tiposUbicacion = [
  { value: 'nicho', label: 'Nicho' },
  { value: 'mausoleo', label: 'Mausoleo' },
  { value: 'boveda', label: 'Bóveda' },
  { value: 'sepultura', label: 'Sepultura' },
]

export const mockUbicaciones = [
  {
    codigo: 'N-001',
    tipo: 'Nicho',
    sector: 'Norte',
    patio: 'A',
    estado: 'Ocupado',
    capacidad: 2,
    ocupados: 2,
    fallecidos: [
      { nombre: 'Juan Carlos González López', fecha_sepultacion: '2026-06-15', ot_id: 'OT-001' },
      { nombre: 'Ana María Soto Fuentes', fecha_sepultacion: '2026-06-12', ot_id: 'OT-004' },
    ],
  },
  {
    codigo: 'N-002',
    tipo: 'Nicho',
    sector: 'Norte',
    patio: 'A',
    estado: 'Ocupado',
    capacidad: 2,
    ocupados: 1,
    fallecidos: [
      { nombre: 'María Elena Rodríguez Pérez', fecha_sepultacion: '2026-06-14', ot_id: 'OT-002' },
    ],
  },
  {
    codigo: 'N-003',
    tipo: 'Nicho',
    sector: 'Norte',
    patio: 'B',
    estado: 'Disponible',
    capacidad: 2,
    ocupados: 0,
    fallecidos: [],
  },
  {
    codigo: 'S-001',
    tipo: 'Sepultura',
    sector: 'Sur',
    patio: 'C',
    estado: 'Ocupado',
    capacidad: 1,
    ocupados: 1,
    fallecidos: [
      { nombre: 'Pedro Muñoz Rojas', fecha_sepultacion: '2026-06-13', ot_id: 'OT-003' },
    ],
  },
  {
    codigo: 'M-001',
    tipo: 'Mausoleo',
    sector: 'Este',
    patio: 'D',
    estado: 'Reservado',
    capacidad: 4,
    ocupados: 0,
    fallecidos: [],
  },
  {
    codigo: 'B-001',
    tipo: 'Bóveda',
    sector: 'Oeste',
    patio: 'E',
    estado: 'En Mantención',
    capacidad: 8,
    ocupados: 3,
    fallecidos: [
      { nombre: 'Luis Alberto Vega Castro', fecha_sepultacion: '2026-06-11', ot_id: 'OT-005' },
      { nombre: 'Rosa Martínez Rojas', fecha_sepultacion: '2026-06-05', ot_id: 'OT-009' },
      { nombre: 'Carlos Muñoz Díaz', fecha_sepultacion: '2026-06-01', ot_id: 'OT-010' },
    ],
  },
  {
    codigo: 'N-004',
    tipo: 'Nicho',
    sector: 'Central',
    patio: 'F',
    estado: 'Disponible',
    capacidad: 2,
    ocupados: 0,
    fallecidos: [],
  },
  {
    codigo: 'N-005',
    tipo: 'Nicho',
    sector: 'Norte',
    patio: 'A',
    estado: 'Bloqueado',
    capacidad: 2,
    ocupados: 0,
    fallecidos: [],
  },
]

export const mockFallecidosUbicacion = [
  {
    id: 1,
    nombre: 'Juan Carlos González López',
    rut: '12.345.678-9',
    sector: 'Norte',
    patio: 'A',
    codigo_ubicacion: 'N-001',
    tipo_ubicacion: 'Nicho',
    fecha_sepultacion: '2026-06-15',
    estado_ubicacion: 'Ocupado',
    ot_id: 'OT-001',
  },
  {
    id: 2,
    nombre: 'María Elena Rodríguez Pérez',
    rut: '9.876.543-2',
    sector: 'Norte',
    patio: 'A',
    codigo_ubicacion: 'N-002',
    tipo_ubicacion: 'Nicho',
    fecha_sepultacion: '2026-06-14',
    estado_ubicacion: 'Ocupado',
    ot_id: 'OT-002',
  },
  {
    id: 3,
    nombre: 'Pedro Muñoz Rojas',
    rut: '15.234.567-8',
    sector: 'Sur',
    patio: 'C',
    codigo_ubicacion: 'S-001',
    tipo_ubicacion: 'Sepultura',
    fecha_sepultacion: '2026-06-13',
    estado_ubicacion: 'Ocupado',
    ot_id: 'OT-003',
  },
  {
    id: 4,
    nombre: 'Ana María Soto Fuentes',
    rut: '8.765.432-1',
    sector: 'Norte',
    patio: 'A',
    codigo_ubicacion: 'N-001',
    tipo_ubicacion: 'Nicho',
    fecha_sepultacion: '2026-06-12',
    estado_ubicacion: 'Ocupado',
    ot_id: 'OT-004',
  },
  {
    id: 5,
    nombre: 'Luis Alberto Vega Castro',
    rut: '16.789.012-3',
    sector: 'Oeste',
    patio: 'E',
    codigo_ubicacion: 'B-001',
    tipo_ubicacion: 'Bóveda',
    fecha_sepultacion: '2026-06-11',
    estado_ubicacion: 'En Mantención',
    ot_id: 'OT-005',
  },
]

export const mockOTCompleta = {
  id: 'OT-001',
  fallecido: {
    nombre: 'Juan Carlos González López',
    rut: '12.345.678-9',
    fecha_fallecimiento: '2026-06-15',
  },
  solicitante: {
    nombre: 'María González López',
    rut: '18.765.432-1',
    direccion: 'Av. Siempre Viva 123, Santiago',
    telefono: '+56 9 9876 5432',
    email: 'maria.gonzalez@email.com',
    relacion: 'Cónyuge',
  },
  responsable_financiero: {
    tipo: 'Particular',
    rut: '18.765.432-1',
    nombre: 'María González López',
    direccion: 'Av. Siempre Viva 123, Santiago',
    telefono: '+56 9 9876 5432',
    correo: 'maria.gonzalez@email.com',
  },
  servicios: [
    { servicio: 'Sepultación', cantidad: 1, valor_unitario: 250000 },
    { servicio: 'Apertura de Nicho', cantidad: 1, valor_unitario: 80000 },
  ],
  ubicacion: {
    sector: 'Norte',
    patio: 'A',
    codigo: 'N-001',
    tipo: 'Nicho',
  },
  financiero: {
    subtotal: 330000,
    descuento: 0,
    iva: 62700,
    total: 392700,
  },
  documentos: [
    { nombre: 'Certificado_Defuncion.pdf', fecha: '2026-06-15' },
    { nombre: 'Permiso_Sepultacion.pdf', fecha: '2026-06-15' },
    { nombre: 'Comprobante_Pago.pdf', fecha: '2026-06-15' },
  ],
}

export const mockFallecidosExpediente = [
  { id: 1, nombre: 'Juan Carlos González López', rut: '12.345.678-9', fecha_registro: '2026-06-19', ubicacion: 'Nicho A-245', documentos_count: 5, estado: 'Activo', ultimo_movimiento: 'Renovación de arriendo - 20-06-2031' },
  { id: 2, nombre: 'María Elena Rodríguez Pérez', rut: '9.876.543-2', fecha_registro: '2026-06-18', ubicacion: 'Nicho A-246', documentos_count: 3, estado: 'Activo', ultimo_movimiento: 'Creación de OT - 19-06-2026' },
  { id: 3, nombre: 'Pedro Muñoz Rojas', rut: '15.234.567-8', fecha_registro: '2026-06-17', ubicacion: 'Sepultura C-101', documentos_count: 4, estado: 'Finalizado', ultimo_movimiento: 'Exhumación - 20-06-2026' },
  { id: 4, nombre: 'Ana María Soto Fuentes', rut: '8.765.432-1', fecha_registro: '2026-06-16', ubicacion: 'Nicho A-245', documentos_count: 2, estado: 'Activo', ultimo_movimiento: 'Ingreso de datos - 16-06-2026' },
  { id: 5, nombre: 'Luis Alberto Vega Castro', rut: '16.789.012-3', fecha_registro: '2026-06-15', ubicacion: 'Bóveda E-001', documentos_count: 6, estado: 'Activo', ultimo_movimiento: 'Renovación de arriendo - 20-06-2031' },
]

export const mockDocumentos = [
  { id: 1, fallecido_id: 1, nombre: 'Carta de defunción', fecha_creacion: '19-06-2026', origen: 'Registro fallecido', archivo: 'Carta_defuncion.pdf' },
  { id: 2, fallecido_id: 1, nombre: 'Orden de Trabajo N°2026-00125', fecha_creacion: '19-06-2026', origen: 'Orden de Trabajo', archivo: 'OT-2026-00125.pdf' },
  { id: 3, fallecido_id: 1, nombre: 'Comprobante de ingreso', fecha_creacion: '19-06-2026', origen: 'OT', archivo: 'Comprobante_ingreso.pdf' },
  { id: 4, fallecido_id: 1, nombre: 'Renovación de arriendo', fecha_creacion: '20-06-2031', origen: 'Actualización servicio', archivo: 'Renovacion_2031.pdf' },
  { id: 5, fallecido_id: 1, nombre: 'Certificado de sepultura', fecha_creacion: '19-06-2026', origen: 'Registro fallecido', archivo: 'Certificado_sepultura.pdf' },
  { id: 6, fallecido_id: 2, nombre: 'Carta de defunción', fecha_creacion: '18-06-2026', origen: 'Registro fallecido', archivo: 'Carta_defuncion_2.pdf' },
  { id: 7, fallecido_id: 2, nombre: 'Orden de Trabajo N°2026-00126', fecha_creacion: '18-06-2026', origen: 'Orden de Trabajo', archivo: 'OT-2026-00126.pdf' },
  { id: 8, fallecido_id: 2, nombre: 'Comprobante de ingreso', fecha_creacion: '18-06-2026', origen: 'OT', archivo: 'Comprobante_ingreso_2.pdf' },
  { id: 9, fallecido_id: 3, nombre: 'Carta de defunción', fecha_creacion: '17-06-2026', origen: 'Registro fallecido', archivo: 'Carta_defuncion_3.pdf' },
  { id: 10, fallecido_id: 3, nombre: 'Orden de Trabajo N°2026-00127', fecha_creacion: '17-06-2026', origen: 'Orden de Trabajo', archivo: 'OT-2026-00127.pdf' },
  { id: 11, fallecido_id: 3, nombre: 'Comprobante de ingreso', fecha_creacion: '17-06-2026', origen: 'OT', archivo: 'Comprobante_ingreso_3.pdf' },
  { id: 12, fallecido_id: 3, nombre: 'Autorización de exhumación', fecha_creacion: '20-06-2026', origen: 'Actualización servicio', archivo: 'Autorizacion_exhumacion.pdf' },
  { id: 13, fallecido_id: 4, nombre: 'Carta de defunción', fecha_creacion: '16-06-2026', origen: 'Registro fallecido', archivo: 'Carta_defuncion_4.pdf' },
  { id: 14, fallecido_id: 4, nombre: 'Orden de Trabajo N°2026-00128', fecha_creacion: '16-06-2026', origen: 'Orden de Trabajo', archivo: 'OT-2026-00128.pdf' },
  { id: 15, fallecido_id: 5, nombre: 'Carta de defunción', fecha_creacion: '15-06-2026', origen: 'Registro fallecido', archivo: 'Carta_defuncion_5.pdf' },
  { id: 16, fallecido_id: 5, nombre: 'Orden de Trabajo N°2026-00129', fecha_creacion: '15-06-2026', origen: 'Orden de Trabajo', archivo: 'OT-2026-00129.pdf' },
  { id: 17, fallecido_id: 5, nombre: 'Comprobante de ingreso', fecha_creacion: '15-06-2026', origen: 'OT', archivo: 'Comprobante_ingreso_5.pdf' },
  { id: 18, fallecido_id: 5, nombre: 'Renovación de arriendo', fecha_creacion: '20-06-2031', origen: 'Actualización servicio', archivo: 'Renovacion_2031_5.pdf' },
  { id: 19, fallecido_id: 5, nombre: 'Certificado de sepultura', fecha_creacion: '15-06-2026', origen: 'Registro fallecido', archivo: 'Certificado_sepultura_5.pdf' },
  { id: 20, fallecido_id: 5, nombre: 'Acta de defunción', fecha_creacion: '16-06-2026', origen: 'Registro fallecido', archivo: 'Acta_defuncion_5.pdf' },
]

export const mockMovimientos = [
  { id: 1, fallecido_id: 1, fecha_hora: '19-06-2026 10:15', tipo: 'ingreso', tipo_label: 'Ingreso de datos del fallecido', descripcion: 'Se registra nuevo fallecido:', detalle: 'Juan Carlos González López', documento_asociado: 'Carta_defuncion.pdf', usuario: 'Administrador' },
  { id: 2, fallecido_id: 1, fecha_hora: '19-06-2026 11:00', tipo: 'creacion_ot', tipo_label: 'Creación de Orden de Trabajo', descripcion: 'OT N°2026-00125', detalle: 'Servicio: Sepultación - Ubicación: Nicho A-245', documento_asociado: 'OT-2026-00125.pdf', usuario: 'Funcionario administrativo' },
  { id: 3, fallecido_id: 1, fecha_hora: '19-06-2026 11:30', tipo: 'creacion_ot', tipo_label: 'Comprobante de pago', descripcion: 'Pago de servicios funerarios', detalle: 'Monto total: .700', documento_asociado: 'Comprobante_ingreso.pdf', usuario: 'Administrador' },
  { id: 4, fallecido_id: 1, fecha_hora: '20-06-2031', tipo: 'actualizacion', tipo_label: 'Actualización del servicio', descripcion: 'Renovación de arriendo', detalle: 'Se renueva arriendo de Nicho A-245 por 5 años', documento_asociado: 'Renovacion_2031.pdf', usuario: 'Administrador' },
  { id: 5, fallecido_id: 2, fecha_hora: '18-06-2026 09:00', tipo: 'ingreso', tipo_label: 'Ingreso de datos del fallecido', descripcion: 'Se registra nuevo fallecido:', detalle: 'María Elena Rodríguez Pérez', documento_asociado: 'Carta_defuncion_2.pdf', usuario: 'Administrador' },
  { id: 6, fallecido_id: 2, fecha_hora: '18-06-2026 10:30', tipo: 'creacion_ot', tipo_label: 'Creación de Orden de Trabajo', descripcion: 'OT N°2026-00126', detalle: 'Servicio: Cremación - Ubicación: Nicho A-246', documento_asociado: 'OT-2026-00126.pdf', usuario: 'Funcionario administrativo' },
  { id: 7, fallecido_id: 2, fecha_hora: '18-06-2026 11:00', tipo: 'creacion_ot', tipo_label: 'Comprobante de pago', descripcion: 'Pago de servicios funerarios', detalle: 'Monto total: .000', documento_asociado: 'Comprobante_ingreso_2.pdf', usuario: 'Administrador' },
  { id: 8, fallecido_id: 3, fecha_hora: '17-06-2026 08:00', tipo: 'ingreso', tipo_label: 'Ingreso de datos del fallecido', descripcion: 'Se registra nuevo fallecido:', detalle: 'Pedro Muñoz Rojas', documento_asociado: 'Carta_defuncion_3.pdf', usuario: 'Administrador' },
  { id: 9, fallecido_id: 3, fecha_hora: '17-06-2026 09:00', tipo: 'creacion_ot', tipo_label: 'Creación de Orden de Trabajo', descripcion: 'OT N°2026-00127', detalle: 'Servicio: Exhumación - Ubicación: Sepultura C-101', documento_asociado: 'OT-2026-00127.pdf', usuario: 'Funcionario administrativo' },
  { id: 10, fallecido_id: 3, fecha_hora: '17-06-2026 09:30', tipo: 'creacion_ot', tipo_label: 'Comprobante de pago', descripcion: 'Pago de servicios funerarios', detalle: 'Monto total: .000', documento_asociado: 'Comprobante_ingreso_3.pdf', usuario: 'Administrador' },
  { id: 11, fallecido_id: 3, fecha_hora: '20-06-2026', tipo: 'actualizacion', tipo_label: 'Actualización del servicio', descripcion: 'Exhumación autorizada', detalle: 'Se autoriza exhumación para traslado a cementerio particular', documento_asociado: 'Autorizacion_exhumacion.pdf', usuario: 'Administrador' },
  { id: 12, fallecido_id: 4, fecha_hora: '16-06-2026 14:00', tipo: 'ingreso', tipo_label: 'Ingreso de datos del fallecido', descripcion: 'Se registra nuevo fallecido:', detalle: 'Ana María Soto Fuentes', documento_asociado: 'Carta_defuncion_4.pdf', usuario: 'Administrador' },
  { id: 13, fallecido_id: 4, fecha_hora: '16-06-2026 15:00', tipo: 'creacion_ot', tipo_label: 'Creación de Orden de Trabajo', descripcion: 'OT N°2026-00128', detalle: 'Servicio: Traslado - Ubicación: Nicho A-245', documento_asociado: 'OT-2026-00128.pdf', usuario: 'Funcionario administrativo' },
  { id: 14, fallecido_id: 5, fecha_hora: '15-06-2026 08:30', tipo: 'ingreso', tipo_label: 'Ingreso de datos del fallecido', descripcion: 'Se registra nuevo fallecido:', detalle: 'Luis Alberto Vega Castro', documento_asociado: 'Carta_defuncion_5.pdf', usuario: 'Administrador' },
  { id: 15, fallecido_id: 5, fecha_hora: '15-06-2026 09:15', tipo: 'creacion_ot', tipo_label: 'Creación de Orden de Trabajo', descripcion: 'OT N°2026-00129', detalle: 'Servicio: Reducción - Ubicación: Bóveda E-001', documento_asociado: 'OT-2026-00129.pdf', usuario: 'Funcionario administrativo' },
  { id: 16, fallecido_id: 5, fecha_hora: '15-06-2026 10:00', tipo: 'creacion_ot', tipo_label: 'Comprobante de pago', descripcion: 'Pago de servicios funerarios', detalle: 'Monto total: .000', documento_asociado: 'Comprobante_ingreso_5.pdf', usuario: 'Administrador' },
  { id: 17, fallecido_id: 5, fecha_hora: '16-06-2026', tipo: 'actualizacion', tipo_label: 'Actualización del servicio', descripcion: 'Ingreso de acta de defunción', detalle: 'Se adjunta acta de defunción oficial al expediente', documento_asociado: 'Acta_defuncion_5.pdf', usuario: 'Administrador' },
  { id: 18, fallecido_id: 5, fecha_hora: '20-06-2031', tipo: 'actualizacion', tipo_label: 'Actualización del servicio', descripcion: 'Renovación de arriendo', detalle: 'Se renueva arriendo de Bóveda E-001 por 5 años', documento_asociado: 'Renovacion_2031_5.pdf', usuario: 'Administrador' },
]

export const mockIngresos = [
  { id: 1, ot_id: 'OT-2026-00125', fallecido: 'Juan Carlos González López', servicio: 'Arriendo Nicho', cuota: '2/6', monto: 25000, fecha_ultimo_pago: '19-06-2026', estado: 'pagada' },
  { id: 2, ot_id: 'OT-2026-00126', fallecido: 'María Elena Rodríguez Pérez', servicio: 'Cremación', cuota: '1/1', monto: 450000, fecha_ultimo_pago: '18-06-2026', estado: 'pagada' },
  { id: 3, ot_id: 'OT-2026-00127', fallecido: 'Pedro Muñoz Rojas', servicio: 'Exhumación', cuota: '1/1', monto: 180000, fecha_ultimo_pago: '17-06-2026', estado: 'anulada' },
  { id: 4, ot_id: 'OT-2026-00128', fallecido: 'Ana María Soto Fuentes', servicio: 'Traslado', cuota: '1/4', monto: 30000, fecha_ultimo_pago: '16-06-2026', estado: 'parcial' },
  { id: 5, ot_id: 'OT-2026-00129', fallecido: 'Luis Alberto Vega Castro', servicio: 'Reducción', cuota: '2/3', monto: 70000, fecha_ultimo_pago: '15-06-2026', estado: 'pendiente' },
  { id: 6, ot_id: 'OT-2026-00130', fallecido: 'Rosa Martínez Rojas', servicio: 'Arriendo Bóveda', cuota: '5/8', monto: 32000, fecha_ultimo_pago: '10-06-2026', estado: 'pagada' },
  { id: 7, ot_id: 'OT-2026-00131', fallecido: 'Carlos Muñoz Díaz', servicio: 'Mantención', cuota: '1/1', monto: 95000, fecha_ultimo_pago: '05-06-2026', estado: 'pendiente' },
]

export const mockCuotasVencer = [
  { id: 1, fallecido: 'Juan Carlos González López', ot_id: 'OT-2026-00125', servicio: 'Arriendo Nicho', cuota: '3/6', fecha_vencimiento: '22-06-2026', dias_restantes: 3, estado: 'proximo_vencimiento' },
  { id: 2, fallecido: 'Luis Alberto Vega Castro', ot_id: 'OT-2026-00129', servicio: 'Reducción', cuota: '3/3', fecha_vencimiento: '25-06-2026', dias_restantes: 6, estado: 'proximo_vencimiento' },
  { id: 3, fallecido: 'Ana María Soto Fuentes', ot_id: 'OT-2026-00128', servicio: 'Traslado', cuota: '2/4', fecha_vencimiento: '16-07-2026', dias_restantes: 27, estado: 'futura' },
  { id: 4, fallecido: 'Rosa Martínez Rojas', ot_id: 'OT-2026-00130', servicio: 'Arriendo Bóveda', cuota: '6/8', fecha_vencimiento: '10-07-2026', dias_restantes: 21, estado: 'futura' },
  { id: 5, fallecido: 'Juan Carlos González López', ot_id: 'OT-2026-00125', servicio: 'Arriendo Nicho', cuota: '4/6', fecha_vencimiento: '22-07-2026', dias_restantes: 33, estado: 'futura' },
  { id: 6, fallecido: 'Ana María Soto Fuentes', ot_id: 'OT-2026-00128', servicio: 'Traslado', cuota: '3/4', fecha_vencimiento: '16-08-2026', dias_restantes: 58, estado: 'futura' },
  { id: 7, fallecido: 'Juan Carlos González López', ot_id: 'OT-2026-00125', servicio: 'Arriendo Nicho', cuota: '5/6', fecha_vencimiento: '22-08-2026', dias_restantes: 64, estado: 'futura' },
  { id: 8, fallecido: 'Carlos Muñoz Díaz', ot_id: 'OT-2026-00131', servicio: 'Mantención', cuota: '1/1', fecha_vencimiento: '19-06-2026', dias_restantes: 0, estado: 'vencida' },
]

export const mockPagosHistorial: Record<number, { cuota: string; fecha: string; monto: number; estado: string }[]> = {
  1: [
    { cuota: '1/6', fecha: '19-01-2026', monto: 25000, estado: 'pagada' },
    { cuota: '2/6', fecha: '19-02-2026', monto: 25000, estado: 'pagada' },
    { cuota: '3/6', fecha: '', monto: 25000, estado: 'pendiente' },
    { cuota: '4/6', fecha: '', monto: 25000, estado: 'pendiente' },
    { cuota: '5/6', fecha: '', monto: 25000, estado: 'pendiente' },
    { cuota: '6/6', fecha: '', monto: 25000, estado: 'pendiente' },
  ],
  2: [
    { cuota: '1/1', fecha: '18-06-2026', monto: 450000, estado: 'pagada' },
  ],
  3: [
    { cuota: '1/1', fecha: '17-06-2026', monto: 180000, estado: 'anulada' },
  ],
  4: [
    { cuota: '1/4', fecha: '16-06-2026', monto: 30000, estado: 'pagada' },
    { cuota: '2/4', fecha: '', monto: 30000, estado: 'pendiente' },
    { cuota: '3/4', fecha: '', monto: 30000, estado: 'pendiente' },
    { cuota: '4/4', fecha: '', monto: 30000, estado: 'pendiente' },
  ],
  5: [
    { cuota: '1/3', fecha: '15-06-2026', monto: 70000, estado: 'pagada' },
    { cuota: '2/3', fecha: '', monto: 70000, estado: 'pendiente' },
    { cuota: '3/3', fecha: '', monto: 70000, estado: 'pendiente' },
  ],
}

export const mockDetalleCuotas: Record<number, {
  fallecido: string
  ot_id: string
  tipo_servicio: string
  fecha_inicio_contrato: string
  cantidad_cuotas: number
  monto_cuota: number
  proximas: { cuota: string; fecha_vencimiento: string; monto: number }[]
  historial: { cuota: string; estado: string; fecha: string }[]
}> = {
  1: {
    fallecido: 'Juan Carlos González López',
    ot_id: 'OT-2026-00125',
    tipo_servicio: 'Arriendo Nicho',
    fecha_inicio_contrato: '19-01-2026',
    cantidad_cuotas: 6,
    monto_cuota: 25000,
    proximas: [
      { cuota: '3/6', fecha_vencimiento: '22-06-2026', monto: 25000 },
      { cuota: '4/6', fecha_vencimiento: '22-07-2026', monto: 25000 },
      { cuota: '5/6', fecha_vencimiento: '22-08-2026', monto: 25000 },
      { cuota: '6/6', fecha_vencimiento: '22-09-2026', monto: 25000 },
    ],
    historial: [
      { cuota: '1/6', estado: 'Pagada', fecha: '19-01-2026' },
      { cuota: '2/6', estado: 'Pagada', fecha: '19-02-2026' },
      { cuota: '3/6', estado: 'Pendiente', fecha: '' },
    ],
  },
}

export const mockCuotasPorOt: Record<string, {
  fallecido: string
  ot_id: string
  tipo_servicio: string
  fecha_inicio_contrato: string
  cantidad_cuotas: number
  monto_cuota: number
  proximas: { cuota: string; fecha_vencimiento: string; monto: number }[]
  historial: { cuota: string; estado: string; fecha: string }[]
}> = {
  'OT-00001': {
    fallecido: 'Juan Carlos González López',
    ot_id: 'OT-00001',
    tipo_servicio: 'Arriendo Nicho',
    fecha_inicio_contrato: '19-01-2026',
    cantidad_cuotas: 6,
    monto_cuota: 25000,
    proximas: [
      { cuota: '3/6', fecha_vencimiento: '22-06-2026', monto: 25000 },
      { cuota: '4/6', fecha_vencimiento: '22-07-2026', monto: 25000 },
      { cuota: '5/6', fecha_vencimiento: '22-08-2026', monto: 25000 },
      { cuota: '6/6', fecha_vencimiento: '22-09-2026', monto: 25000 },
    ],
    historial: [
      { cuota: '1/6', estado: 'Pagada', fecha: '19-01-2026' },
      { cuota: '2/6', estado: 'Pagada', fecha: '19-02-2026' },
      { cuota: '3/6', estado: 'Pendiente', fecha: '' },
    ],
  },
  'OT-00002': {
    fallecido: 'María Elena Rodríguez Pérez',
    ot_id: 'OT-00002',
    tipo_servicio: 'Cremación',
    fecha_inicio_contrato: '18-06-2026',
    cantidad_cuotas: 1,
    monto_cuota: 450000,
    proximas: [],
    historial: [
      { cuota: '1/1', estado: 'Pagada', fecha: '18-06-2026' },
    ],
  },
  'OT-00004': {
    fallecido: 'Ana María Soto Fuentes',
    ot_id: 'OT-00004',
    tipo_servicio: 'Traslado',
    fecha_inicio_contrato: '16-06-2026',
    cantidad_cuotas: 4,
    monto_cuota: 30000,
    proximas: [
      { cuota: '2/4', fecha_vencimiento: '16-07-2026', monto: 30000 },
      { cuota: '3/4', fecha_vencimiento: '16-08-2026', monto: 30000 },
      { cuota: '4/4', fecha_vencimiento: '16-09-2026', monto: 30000 },
    ],
    historial: [
      { cuota: '1/4', estado: 'Pagada', fecha: '16-06-2026' },
      { cuota: '2/4', estado: 'Pendiente', fecha: '' },
    ],
  },
  'OT-00005': {
    fallecido: 'Luis Alberto Vega Castro',
    ot_id: 'OT-00005',
    tipo_servicio: 'Reducción',
    fecha_inicio_contrato: '15-06-2026',
    cantidad_cuotas: 3,
    monto_cuota: 70000,
    proximas: [
      { cuota: '3/3', fecha_vencimiento: '25-06-2026', monto: 70000 },
    ],
    historial: [
      { cuota: '1/3', estado: 'Pagada', fecha: '15-06-2026' },
      { cuota: '2/3', estado: 'Pendiente', fecha: '' },
    ],
  },
}

export const mockIngresoPorServicio = [
  { servicio: 'Sepultación', monto: 1250000 },
  { servicio: 'Exhumación', monto: 540000 },
  { servicio: 'Reducción', monto: 280000 },
  { servicio: 'Traslado', monto: 720000 },
  { servicio: 'Cremación', monto: 1850000 },
  { servicio: 'Mantención', monto: 380000 },
  { servicio: 'Apertura de Nicho', monto: 960000 },
  { servicio: 'Cierre de Nicho', monto: 410000 },
]

export const mockServiciosPorFinanciamiento = [
  { name: 'Particular', value: 65 },
  { name: 'Municipal', value: 25 },
  { name: 'Otros', value: 10 },
]

export const mockEvolucionIngresos = [
  { mes: 'Ene', ingresos: 1250000 },
  { mes: 'Feb', ingresos: 980000 },
  { mes: 'Mar', ingresos: 1420000 },
  { mes: 'Abr', ingresos: 1100000 },
  { mes: 'May', ingresos: 1680000 },
  { mes: 'Jun', ingresos: 1350000 },
  { mes: 'Jul', ingresos: 1520000 },
  { mes: 'Ago', ingresos: 1440000 },
  { mes: 'Sep', ingresos: 1710000 },
  { mes: 'Oct', ingresos: 1390000 },
  { mes: 'Nov', ingresos: 1580000 },
  { mes: 'Dic', ingresos: 1900000 },
]

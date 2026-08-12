# Plan: Autocomplete + Confirmación Guardar en RegistroFallecido

## Objetivos
1. Deshabilitar autocomplete en todos los campos del formulario
2. Mostrar modal de confirmación con resumen de campos antes de guardar

## Archivos a modificar

### 1. `ConfirmDialog.tsx` — Agregar `children` prop

**Cambio**: Hacer `message` opcional y agregar `children?: ReactNode`. Si `children` está presente, se renderiza en lugar de `<p>{message}</p>`.

```tsx
// En interface:
message?: string
children?: ReactNode

// En render:
{children ?? (message && <p className="mt-1 text-sm text-muted-foreground">{message}</p>)}
```

### 2. `RegistroFallecido.tsx`

#### a) `autoComplete="off"` en todos los campos

| Línea | Elemento | Atributo a agregar |
|-------|----------|-------------------|
| 226 | `<Input>` RUT | `autoComplete="off"` |
| 266 | `<FormInput>` Nombres | `autoComplete="off"` |
| 272 | `<FormInput>` Apellido Paterno | `autoComplete="off"` |
| 278 | `<FormInput>` Apellido Materno | `autoComplete="off"` |
| 283 | `<FormInput>` Fecha Nacimiento | `autoComplete="off"` |
| 289 | `<FormInput>` Fecha Fallecimiento | `autoComplete="off"` |
| 316 | `<FormInput>` Lugar Fallecimiento | `autoComplete="off"` |
| 327 | `<FormTextarea>` Observaciones | `autoComplete="off"` |
| 336 | `<Input>` file | `autoComplete="off"` |

Los `<FormSelect>` (Sexo, Estado Civil, Nacionalidad) usan shadcn Select (no input nativo) — no necesitan `autoComplete`.

#### b) Confirmación al guardar

**Nuevo estado** (después de línea 107):
```tsx
const [showConfirmGuardar, setShowConfirmGuardar] = useState(false)
```

**Modificar `handleGuardar`** (línea 151): reemplazar `form.post(...)` con `setShowConfirmGuardar(true)`:
```tsx
const handleGuardar = () => {
  if (!validate()) {
    addToast({ title: 'Error de validación', description: 'Corrige los campos marcados en rojo.', variant: 'destructive' })
    return
  }
  setShowConfirmGuardar(true)
}
```

**Nueva función `confirmGuardar`**:
```tsx
const confirmGuardar = () => {
  setShowConfirmGuardar(false)
  form.post(route('cementerio.registro-fallecido.store') as string, {
    forceFormData: true,
    preserveScroll: true,
    onSuccess: () => {
      form.reset()
      setEsNn(false)
      setRutDuplicadoError(null)
      setDirty(false)
      addToast({ title: 'Fallecido registrado', description: 'El registro se ha guardado correctamente.', variant: 'default' })
    },
    onError: (errs: Record<string, string>) => {
      addToast({ title: 'Error de validación', description: 'Corrige los campos marcados en rojo.', variant: 'destructive' })
    },
  })
}
```

**Nuevo `<ConfirmDialog>`** (después del bloque de los otros dos ConfirmDialog, línea 462):
```tsx
<ConfirmDialog
  open={showConfirmGuardar}
  title="¿Está seguro que desea guardar estos datos?"
  confirmText="Guardar"
  cancelText="Cancelar"
  icon={<AlertTriangle className="h-6 w-6 text-amber-500" />}
  onConfirm={confirmGuardar}
  onCancel={() => setShowConfirmGuardar(false)}
>
  <div className="mt-2 space-y-1.5 text-sm text-left max-h-60 overflow-y-auto">
    <div className="grid grid-cols-[auto_1fr] gap-x-4 gap-y-1">
      <span className="text-muted-foreground">RUT:</span>
      <span className="font-medium">{esNn ? 'NN (Sin RUT)' : (form.data.rut_fallecido || '—')}</span>
      <span className="text-muted-foreground">Nombres:</span>
      <span className="font-medium">{form.data.nombres_fallecido || '—'}</span>
      <span className="text-muted-foreground">Apellido Paterno:</span>
      <span className="font-medium">{form.data.apellido_paterno_fallecido || '—'}</span>
      <span className="text-muted-foreground">Apellido Materno:</span>
      <span className="font-medium">{form.data.apellido_materno_fallecido || '—'}</span>
      <span className="text-muted-foreground">Fecha Nacimiento:</span>
      <span className="font-medium">{form.data.fecha_nacimiento_fallecido || '—'}</span>
      <span className="text-muted-foreground">Fecha Fallecimiento:</span>
      <span className="font-medium">{form.data.fecha_fallecimiento || '—'}</span>
      <span className="text-muted-foreground">Sexo:</span>
      <span className="font-medium">{sexoOptions.find(o => o.value === form.data.sexo_id)?.label || '—'}</span>
      <span className="text-muted-foreground">Estado Civil:</span>
      <span className="font-medium">{estadoCivilOptions.find(o => o.value === form.data.estado_civil_id)?.label || '—'}</span>
      <span className="text-muted-foreground">Nacionalidad:</span>
      <span className="font-medium">{form.data.nacionalidad_fallecido || '—'}</span>
      <span className="text-muted-foreground">Lugar Fallecimiento:</span>
      <span className="font-medium">{form.data.lugar_fallecimiento || '—'}</span>
      <span className="text-muted-foreground">Observaciones:</span>
      <span className="font-medium">{form.data.observaciones || '—'}</span>
      <span className="text-muted-foreground">Certificado:</span>
      <span className="font-medium">{form.data.carta_defuncion?.name || 'No adjuntado'}</span>
    </div>
  </div>
</ConfirmDialog>
```

**Importar `AlertTriangle`** en el bloque de imports de lucide-react (línea 16):
```tsx
import {
  User, FileText, Save, RotateCcw, X, AlertTriangle,
} from 'lucide-react'
```

## Archivos no modificados
- `FormInput.tsx` — pasa `{...props}`, no necesita cambios
- `FormTextarea.tsx` — pasa `{...props}`, no necesita cambios
- `FormSelect.tsx` — no aplica autocomplete
- `DataTable.tsx` — no tocar

## Flujo final
1. Usuario llena formulario
2. Click "Guardar" → valida campos requeridos → si ok, abre modal de confirmación
3. Modal muestra resumen de todos los campos
4. Click "Guardar" en modal → envía `form.post()`
5. Click "Cancelar" → cierra modal, formulario intacto

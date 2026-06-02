export type Nota = {
  id: number
  legajo: number
  idMateria: string
  nota: number
  fecha: string
}

type NotaInput = Record<string, unknown>

export class NotasModel {
  private id: number
  private legajo: number
  private idMateria: string
  private nota: number
  private fecha: string

  constructor(
    id: number,
    legajo: number,
    idMateria: string,
    nota: number,
    fecha: string = NotasModel.getFechaActual()
  ) {
    this.id = id
    this.legajo = legajo
    this.idMateria = idMateria
    this.nota = nota
    this.fecha = fecha
  }

  public static getFechaActual(): string {
    const hoy = new Date()

    const dia = String(hoy.getDate()).padStart(2, '0')
    const mes = String(hoy.getMonth() + 1).padStart(2, '0')
    const anio = String(hoy.getFullYear()).slice(-2)

    return `${dia}-${mes}-${anio}`
  }

  public static validarDatos(
    datos: NotaInput,
    esAlta = false
  ): string[] {
    const errores: string[] = []

    if (datos.id !== undefined) {
      errores.push(
        'El id no debe enviarse ni modificarse desde el body.'
      )
    }

    if (esAlta) {
      if (datos.legajo === undefined) {
        errores.push('El legajo es obligatorio.')
      }

      if (datos.idMateria === undefined) {
        errores.push('La materia es obligatoria.')
      }

      if (datos.nota === undefined) {
        errores.push('La nota es obligatoria.')
      }
    } else {
      if (datos.legajo !== undefined) {
        errores.push(
          'El legajo no puede modificarse.'
        )
      }

      if (datos.idMateria !== undefined) {
        errores.push(
          'La materia no puede modificarse.'
        )
      }
    }

    if (
      datos.legajo !== undefined &&
      typeof datos.legajo !== 'number'
    ) {
      errores.push('El legajo debe ser numérico.')
    }

    if (
      datos.idMateria !== undefined &&
      typeof datos.idMateria !== 'string'
    ) {
      errores.push('La materia debe ser texto.')
    }

    if (
      datos.nota !== undefined &&
      (
        typeof datos.nota !== 'number' ||
        datos.nota < 0 ||
        datos.nota > 10
      )
    ) {
      errores.push(
        'La nota debe estar entre 0 y 10.'
      )
    }

    return errores
  }

  public setNota(nota: number): void {
    this.nota = nota
  }

  public setFecha(fecha: string): void {
    this.fecha = fecha
  }

  public getAllAttributes(): Nota {
    return {
      id: this.id,
      legajo: this.legajo,
      idMateria: this.idMateria,
      nota: this.nota,
      fecha: this.fecha
    }
  }
}
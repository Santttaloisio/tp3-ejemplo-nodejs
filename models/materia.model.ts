type MateriaInput = {
  idMateria?: unknown
  nombre?: unknown
  cuatrimestre?: unknown
}

export class MateriaModel {
  constructor(
    private idMateria: string,
    private nombre: string,
    private cuatrimestre: number
  ) {}

  public static validarDatos(
    datos: MateriaInput,
    esAlta: boolean = false
  ): string[] {
    const errores: string[] = []

    if (esAlta) {
      if (datos.idMateria === undefined) {
        errores.push('El id de la materia es obligatorio.')
      }

      if (datos.nombre === undefined) {
        errores.push('El nombre de la materia es obligatorio.')
      }

      if (datos.cuatrimestre === undefined) {
        errores.push('El cuatrimestre es obligatorio.')
      }
    } else if (datos.idMateria !== undefined) {
      errores.push('El id de la materia no se debe modificar desde el body.')
    }

    if (
      datos.idMateria !== undefined &&
      !this.esIdMateriaValido(datos.idMateria)
    ) {
      errores.push('El id de la materia debe ser un texto válido.')
    }

    if (datos.nombre !== undefined && !this.esTextoValido(datos.nombre)) {
      errores.push('El nombre de la materia debe ser un texto válido.')
    }

    if (
      datos.cuatrimestre !== undefined &&
      !this.esCuatrimestreValido(datos.cuatrimestre)
    ) {
      errores.push('El cuatrimestre debe ser un número entero mayor a 0.')
    }

    return errores
  }

  private static esTextoValido(valor: unknown): valor is string {
    return typeof valor === 'string' && valor.trim().length > 0
  }

  private static esIdMateriaValido(valor: unknown): valor is string {
    return (
      typeof valor === 'string' &&
      valor.trim().length > 0 &&
      /^[a-zA-Z0-9-]+$/.test(valor.trim())
    )
  }

  private static esCuatrimestreValido(valor: unknown): valor is number {
    return typeof valor === 'number' && Number.isInteger(valor) && valor > 0
  }

  public getIdMateria(): string {
    return this.idMateria
  }

  public setIdMateria(idMateria: string): void {
    this.idMateria = idMateria
  }

  public getNombre(): string {
    return this.nombre
  }

  public setNombre(nombre: string): void {
    this.nombre = nombre
  }

  public getCuatrimestre(): number {
    return this.cuatrimestre
  }

  public setCuatrimestre(cuatrimestre: number): void {
    this.cuatrimestre = cuatrimestre
  }

  public getAllAttributes(): {
    idMateria: string
    nombre: string
    cuatrimestre: number
  } {
    return {
      idMateria: this.idMateria,
      nombre: this.nombre,
      cuatrimestre: this.cuatrimestre
    }
  }
}

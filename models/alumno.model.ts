import { PersonaModel } from './persona.model'

type AlumnoInput = {
    nombre?: unknown
    apellido?: unknown
    email?: unknown
    isActive?: unknown
    legajo?: unknown
}

export class AlumnoModel extends PersonaModel {
    private legajo: number
    private fechaAlta: string
    private modificacion: string
    private isActive: boolean

    constructor(
    nombre: string,
    apellido: string,
    email: string,
    legajo: number,
    fechaAlta: string = new Date().toISOString().split('T')[0],
    modificacion: string = new Date().toISOString().split('T')[0],
    isActive: boolean = true
    ) {
        super(nombre, apellido, email)
        this.legajo = legajo
        this.fechaAlta = fechaAlta
        this.modificacion = modificacion
        this.isActive = isActive
    }

    public static getFechaActual(): string {
        return new Date().toISOString().split('T')[0]
    }

    public static validarDatos(
    datos: AlumnoInput,
    esAlta: boolean = false
    ): string[] {
        const errores: string[] = []

        if (datos.legajo !== undefined) {
        errores.push('El legajo no se debe enviar ni modificar desde el body.')
        }

        if (esAlta) {
        if (datos.nombre === undefined) {
            errores.push('El nombre es obligatorio.')
        }

        if (datos.apellido === undefined) {
            errores.push('El apellido es obligatorio.')
        }

        if (datos.email === undefined) {
            errores.push('El email es obligatorio.')
        }
        }

        if (datos.nombre !== undefined && !this.esTextoValido(datos.nombre)) {
        errores.push('El nombre debe ser un texto válido.')
        }

        if (datos.apellido !== undefined && !this.esTextoValido(datos.apellido)) {
        errores.push('El apellido debe ser un texto válido.')
        }

        if (datos.email !== undefined) {
        if (!this.esTextoValido(datos.email)) {
            errores.push('El email debe ser un texto válido.')
        } else if (!this.esEmailValido(datos.email)) {
            errores.push('El email debe tener un formato válido.')
        }
        }

        if (datos.isActive !== undefined && typeof datos.isActive !== 'boolean') {
        errores.push('El campo isActive debe ser un booleano (true/false).')
        }

    return errores
    }

    private static esTextoValido(valor: unknown): valor is string {
        return typeof valor === 'string' && valor.trim().length > 0
    }

    private static esEmailValido(valor: unknown): boolean {
        if (typeof valor !== 'string') {
        return false
        }

        return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(valor)
    }

    // Getters y Setters
    public getLegajo(): number {
        return this.legajo
    }

    public getIsActive(): boolean {
        return this.isActive
    }
    public setIsActive(status: boolean): void {
        this.isActive = status
    }

    public getModificacion(): string {
        return this.modificacion
    }
    public setModificacion(fecha: string): void {
        this.modificacion = fecha
    }

  // Polimorfismo
    public override getAllAttributes(): {
        legajo: number
        nombre: string
        apellido: string
        email: string
        fechaAlta: string
        modificacion: string
        isActive: boolean
        } 
        {
            return {
            legajo: this.legajo,
            nombre: this.nombre, // Disponibles porque son 'protected' en PersonaModel
            apellido: this.apellido,
            email: this.email,
            fechaAlta: this.fechaAlta,
            modificacion: this.modificacion,
            isActive: this.isActive
            }
        }
}

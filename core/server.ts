import cors from 'cors'
import 'dotenv/config'
import express, { NextFunction, Request, Response } from 'express'
import alumnoRoutes from '../routes/alumno.routes'

export class Server {
  private app = express()
  private port = process.env.PORT || 3000

  constructor() {
    this.middleware()
    this.rutas()
  }

  private middleware(): void {
    this.app.use(cors())
    this.app.use(express.json())
    this.app.use(express.static('client/static'))
  }

  private rutas(): void {
    this.app.use('/alumnos', alumnoRoutes)
    /*
    this.app.use('/materias', materiaRoutes)
    this.app.use('/notas', notaRoutes)
    this.app.use('/profesores', profesorRoutes)
    */

    // manejo de errores
    this.app.use((req: Request, res: Response) => {
      return res.status(404).json({ msg: 'Error. Página no encontrada' })
    })

    this.app.use(
      (err: Error, req: Request, res: Response, next: NextFunction) => {
        console.error(err.stack)
        return res.status(500).json({ msg: 'Internal Server Error' })
      }
    )
  }

  public listen(): void {
    this.app.listen(this.port, () => {
      console.log(`La API esta escuchando el el puerto: ${this.port}`)
    })
  }
}

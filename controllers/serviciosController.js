const fs = require('fs').promises

const getServicios = async (req, res) => {
  try {
    const data = await fs.readFile('./data/servicios.json', 'utf8')
    const servicios = JSON.parse(data)

    return res.status(200).json(servicios)
  } catch (error) {
    console.log(error)
    return res
      .status(500)
      .json({ error: 'No se puedieron obtener los servicios' })
  }
}

const getServiciosById = async (req, res) => {
  try {
    const data = await fs.readFile('./data/serviciosDetalle.json', 'utf8')
    const servicios = JSON.parse(data)

    const { id } = req.params

    const servicioId = servicios.find((s) => s.id === parseInt(id))

    if (!servicioId) {
      return res.status(404).json({ msg: `No existe el servicio con id ${id}` })
    }

    return res.status(200).json(servicioId)
  } catch (error) {
    console.log(error)
    return res.status(500).JSON({
      error: 'No se pudo obtener el datalle del servicio del id n° {id}'
    })
  }
}

module.exports = { getServicios, getServiciosById }

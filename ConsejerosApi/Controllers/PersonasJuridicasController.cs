using ConsejerosApi.Models;
using ConsejerosApi.Repositories;
using Microsoft.AspNetCore.Mvc;

namespace ConsejerosApi.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class PersonasJuridicasController : ControllerBase
    {
        private readonly IPersonaJuridicaRepository _repository;

        public PersonasJuridicasController(IPersonaJuridicaRepository repository)
        {
            _repository = repository;
        }

        [HttpGet]
        public async Task<IActionResult> Listar()
        {
            var data = await _repository.ListarAsync();
            return Ok(data);
        }

        [HttpGet("{id}")]
        public async Task<IActionResult> ObtenerPorId(int id)
        {
            var item = await _repository.ObtenerPorIdAsync(id);
            if (item == null) return NotFound(new { mensaje = "Persona Jurídica no encontrada" });
            return Ok(item);
        }

        [HttpPost]
        public async Task<IActionResult> Crear([FromBody] PersonaJuridicaRegistroDto dto)
        {
            if (string.IsNullOrWhiteSpace(dto.NumeroDocumento) || !dto.NumeroDocumento.StartsWith("20") || dto.NumeroDocumento.Length != 11)
            {
                return BadRequest(new { mensaje = "El RUC de una Persona Jurídica debe iniciar con 20 y tener 11 dígitos." });
            }

            var nuevoId = await _repository.CrearAsync(dto);
            return CreatedAtAction(nameof(ObtenerPorId), new { id = nuevoId }, new { id = nuevoId, mensaje = "Registrado correctamente" });
        }

        [HttpPut("{id}")]
        public async Task<IActionResult> Actualizar(int id, [FromBody] PersonaJuridicaRegistroDto dto)
        {
            var actualizado = await _repository.ActualizarAsync(id, dto);
            if (!actualizado) return NotFound(new { mensaje = "No se pudo actualizar" });
            return Ok(new { mensaje = "Actualizado correctamente" });
        }

        [HttpDelete("{id}")]
        public async Task<IActionResult> Eliminar(int id)
        {
            var eliminado = await _repository.EliminarAsync(id);
            if (!eliminado) return NotFound(new { mensaje = "No se pudo eliminar" });
            return Ok(new { mensaje = "Eliminado correctamente" });
        }
    }
}
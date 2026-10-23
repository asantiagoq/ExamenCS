using ConsejerosApi.Models;
using ConsejerosApi.Repositories;
using Microsoft.AspNetCore.Mvc;

namespace ConsejerosApi.Controllers;

[ApiController]
[Route("api/[controller]")]
public class PersonasNaturalesController : ControllerBase
{
    private readonly IPersonaNaturalRepository _repository;

    public PersonasNaturalesController(IPersonaNaturalRepository repository)
    {
        _repository = repository;
    }

    [HttpGet]
    public async Task<IActionResult> Listar()
    {
        var personas = await _repository.ListarAsync();
        return Ok(personas);
    }

    [HttpGet("{id:int}")]
    public async Task<IActionResult> ObtenerPorId(int id)
    {
        var persona = await _repository.ObtenerPorIdAsync(id);
        if (persona == null) return NotFound(new { mensaje = "Persona natural no encontrada." });
        return Ok(persona);
    }

    [HttpPost]
    public async Task<IActionResult> Crear([FromBody] PersonaNaturalRegistroDto dto)
    {
        if (!ModelState.IsValid) return BadRequest(ModelState);

        var idGenerado = await _repository.InsertarAsync(dto);
        return CreatedAtAction(nameof(ObtenerPorId), new { id = idGenerado }, new { id = idGenerado });
    }

    [HttpPut("{id:int}")]
    public async Task<IActionResult> Actualizar(int id, [FromBody] PersonaNaturalRegistroDto dto)
    {
        dto.IdEntidad = id;
        await _repository.ActualizarAsync(dto);
        return NoContent();
    }

    [HttpDelete("{id:int}")]
    public async Task<IActionResult> Eliminar(int id)
    {
        await _repository.EliminarAsync(id);
        return NoContent();
    }
}
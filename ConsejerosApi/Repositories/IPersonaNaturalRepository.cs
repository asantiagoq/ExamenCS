using ConsejerosApi.Models;

namespace ConsejerosApi.Repositories;

public interface IPersonaNaturalRepository
{
    Task<IEnumerable<PersonaNaturalListadoDto>> ListarAsync();
    Task<PersonaNaturalDetalleDto?> ObtenerPorIdAsync(int id);
    Task<int> InsertarAsync(PersonaNaturalRegistroDto dto);
    Task ActualizarAsync(PersonaNaturalRegistroDto dto);
    Task EliminarAsync(int id);
}
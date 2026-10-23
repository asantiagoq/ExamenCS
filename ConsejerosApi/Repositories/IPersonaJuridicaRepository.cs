using ConsejerosApi.Models;

namespace ConsejerosApi.Repositories
{
    public interface IPersonaJuridicaRepository
    {
        Task<IEnumerable<PersonaJuridicaListadoDto>> ListarAsync();
        Task<PersonaJuridicaDetalleDto?> ObtenerPorIdAsync(int id);
        Task<int> CrearAsync(PersonaJuridicaRegistroDto dto);
        Task<bool> ActualizarAsync(int id, PersonaJuridicaRegistroDto dto);
        Task<bool> EliminarAsync(int id);
    }
}
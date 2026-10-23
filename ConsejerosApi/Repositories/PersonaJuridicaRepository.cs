using System.Data;
using System.Text.Json;
using ConsejerosApi.Models;
using Dapper;
using Microsoft.Data.SqlClient;

namespace ConsejerosApi.Repositories
{
    public class PersonaJuridicaRepository : IPersonaJuridicaRepository
    {
        private readonly string _connectionString;

        public PersonaJuridicaRepository(IConfiguration configuration)
        {
            _connectionString = configuration.GetConnectionString("CadenaSql") 
            ?? throw new ArgumentNullException("No se encontró la cadena de conexión 'CadenaSql'.");
        }

        private IDbConnection CreateConnection() => new SqlConnection(_connectionString);

        public async Task<IEnumerable<PersonaJuridicaListadoDto>> ListarAsync()
        {
            using var connection = CreateConnection();
            return await connection.QueryAsync<PersonaJuridicaListadoDto>(
                "dbo.sp_ListarPersonasJuridicas",
                commandType: CommandType.StoredProcedure
            );
        }

        public async Task<PersonaJuridicaDetalleDto?> ObtenerPorIdAsync(int id)
        {
            using var connection = CreateConnection();
            using var multi = await connection.QueryMultipleAsync(
                "dbo.sp_ObtenerPersonaJuridicaPorId",
                new { IdEntidad = id },
                commandType: CommandType.StoredProcedure
            );

            var detalle = await multi.ReadFirstOrDefaultAsync<PersonaJuridicaDetalleDto>();
            if (detalle != null)
            {
                var telefonos = await multi.ReadAsync<TelefonoDto>();
                detalle.Telefonos = telefonos.ToList();
            }

            return detalle;
        }

        public async Task<int> CrearAsync(PersonaJuridicaRegistroDto dto)
        {
            using var connection = CreateConnection();
            var parameters = new DynamicParameters();
            parameters.Add("@NumeroDocumento", dto.NumeroDocumento);
            parameters.Add("@RazonSocial", dto.RazonSocial);
            parameters.Add("@Direccion", dto.Direccion);
            parameters.Add("@TelefonosJson", dto.Telefonos != null && dto.Telefonos.Count > 0 
                ? JsonSerializer.Serialize(dto.Telefonos) 
                : null);
            parameters.Add("@NuevoId", dbType: DbType.Int32, direction: ParameterDirection.Output);

            await connection.ExecuteAsync("dbo.sp_InsertarPersonaJuridica", parameters, commandType: CommandType.StoredProcedure);
            return parameters.Get<int>("@NuevoId");
        }

        public async Task<bool> ActualizarAsync(int id, PersonaJuridicaRegistroDto dto)
        {
            using var connection = CreateConnection();
            var parameters = new DynamicParameters();
            parameters.Add("@IdEntidad", id);
            parameters.Add("@NumeroDocumento", dto.NumeroDocumento);
            parameters.Add("@RazonSocial", dto.RazonSocial);
            parameters.Add("@Direccion", dto.Direccion);
            parameters.Add("@TelefonosJson", dto.Telefonos != null && dto.Telefonos.Count > 0 
                ? JsonSerializer.Serialize(dto.Telefonos) 
                : null);

            var resultado = await connection.ExecuteScalarAsync<int>(
                "dbo.sp_ActualizarPersonaJuridica",
                parameters,
                commandType: CommandType.StoredProcedure
            );
            return resultado > 0;
        }

        public async Task<bool> EliminarAsync(int id)
        {
            using var connection = CreateConnection();
            var resultado = await connection.ExecuteScalarAsync<int>(
                "dbo.sp_EliminarPersonaJuridica",
                new { IdEntidad = id },
                commandType: CommandType.StoredProcedure
            );
            return resultado > 0;
        }
    }
}
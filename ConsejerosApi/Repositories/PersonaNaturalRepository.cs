using System.Data;
using System.Text.Json;
using ConsejerosApi.Models;
using Dapper;
using Microsoft.Data.SqlClient;

namespace ConsejerosApi.Repositories;

public class PersonaNaturalRepository : IPersonaNaturalRepository
{
    private readonly string _connectionString;

    public PersonaNaturalRepository(IConfiguration configuration)
    {
        _connectionString = configuration.GetConnectionString("CadenaSql") 
            ?? throw new ArgumentNullException("No se encontró la cadena de conexión 'CadenaSql'.");
    }

    private IDbConnection CreateConnection() => new SqlConnection(_connectionString);

    public async Task<IEnumerable<PersonaNaturalListadoDto>> ListarAsync()
    {
        using var db = CreateConnection();
        return await db.QueryAsync<PersonaNaturalListadoDto>(
            "sp_ListarPersonasNaturales",
            commandType: CommandType.StoredProcedure
        );
    }

    public async Task<PersonaNaturalDetalleDto?> ObtenerPorIdAsync(int id)
    {
        using var db = CreateConnection();
        var parametros = new DynamicParameters();
        parametros.Add("@IdEntidad", id, DbType.Int32);

        var resultado = await db.QueryFirstOrDefaultAsync<dynamic>(
            "sp_ObtenerPersonaNaturalPorId",
            parametros,
            commandType: CommandType.StoredProcedure
        );

        if (resultado == null) return null;

        var detalle = new PersonaNaturalDetalleDto
        {
            IdEntidad = resultado.IdEntidad,
            TipoDocumento = resultado.TipoDocumento,
            NumeroDocumento = resultado.NumeroDocumento,
            Nombres = resultado.Nombres,
            ApellidoPaterno = resultado.ApellidoPaterno,
            ApellidoMaterno = resultado.ApellidoMaterno,
            FechaNacimiento = resultado.FechaNacimiento,
            Edad = resultado.Edad,
            Sexo = resultado.Sexo,
            FechaRegistro = resultado.FechaRegistro
        };

        string? telefonosJson = resultado.TelefonosJson;
        if (!string.IsNullOrEmpty(telefonosJson))
        {
            detalle.Telefonos = JsonSerializer.Deserialize<List<TelefonoDto>>(telefonosJson, new JsonSerializerOptions
            {
                PropertyNameCaseInsensitive = true
            }) ?? new List<TelefonoDto>();
        }

        return detalle;
    }

    public async Task<int> InsertarAsync(PersonaNaturalRegistroDto dto)
    {
        using var db = CreateConnection();
        var telefonosJson = JsonSerializer.Serialize(dto.Telefonos);

        var parametros = new DynamicParameters();
        parametros.Add("@TipoDocumento", dto.TipoDocumento);
        parametros.Add("@NumeroDocumento", dto.NumeroDocumento);
        parametros.Add("@Nombres", dto.Nombres);
        parametros.Add("@ApellidoPaterno", dto.ApellidoPaterno);
        parametros.Add("@ApellidoMaterno", dto.ApellidoMaterno);
        parametros.Add("@FechaNacimiento", dto.FechaNacimiento, DbType.Date);
        parametros.Add("@Sexo", dto.Sexo);
        parametros.Add("@TelefonosJson", telefonosJson);
        parametros.Add("@NuevoIdEntidad", dbType: DbType.Int32, direction: ParameterDirection.Output);

        await db.ExecuteAsync("sp_InsertarPersonaNatural", parametros, commandType: CommandType.StoredProcedure);

        return parametros.Get<int>("@NuevoIdEntidad");
    }

    public async Task ActualizarAsync(PersonaNaturalRegistroDto dto)
    {
        using var db = CreateConnection();
        var telefonosJson = JsonSerializer.Serialize(dto.Telefonos);

        var parametros = new DynamicParameters();
        parametros.Add("@IdEntidad", dto.IdEntidad, DbType.Int32);
        parametros.Add("@TipoDocumento", dto.TipoDocumento);
        parametros.Add("@NumeroDocumento", dto.NumeroDocumento);
        parametros.Add("@Nombres", dto.Nombres);
        parametros.Add("@ApellidoPaterno", dto.ApellidoPaterno);
        parametros.Add("@ApellidoMaterno", dto.ApellidoMaterno);
        parametros.Add("@FechaNacimiento", dto.FechaNacimiento, DbType.Date);
        parametros.Add("@Sexo", dto.Sexo);
        parametros.Add("@TelefonosJson", telefonosJson);

        await db.ExecuteAsync("sp_ActualizarPersonaNatural", parametros, commandType: CommandType.StoredProcedure);
    }

    public async Task EliminarAsync(int id)
    {
        using var db = CreateConnection();
        var parametros = new DynamicParameters();
        parametros.Add("@IdEntidad", id, DbType.Int32);

        await db.ExecuteAsync("sp_EliminarPersonaNatural", parametros, commandType: CommandType.StoredProcedure);
    }
}
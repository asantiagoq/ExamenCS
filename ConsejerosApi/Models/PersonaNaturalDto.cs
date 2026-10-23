namespace ConsejerosApi.Models;

public class TelefonoDto
{
    public int? IdTelefono { get; set; }
    public string Numero { get; set; } = string.Empty;
    public string? Tipo { get; set; }
}

public class PersonaNaturalListadoDto
{
    public int IdEntidad { get; set; }
    public string TipoDocumento { get; set; } = string.Empty;
    public string NumeroDocumento { get; set; } = string.Empty;
    public string Nombres { get; set; } = string.Empty;
    public string ApellidoPaterno { get; set; } = string.Empty;
    public string ApellidoMaterno { get; set; } = string.Empty;
    public string NombreCompleto { get; set; } = string.Empty;
    public DateTime FechaNacimiento { get; set; }
    public int Edad { get; set; }
    public string Sexo { get; set; } = string.Empty;
    public DateTime FechaRegistro { get; set; }
    public string TelefonosResumen { get; set; } = string.Empty;
}

public class PersonaNaturalRegistroDto
{
    public int? IdEntidad { get; set; }
    public string TipoDocumento { get; set; } = string.Empty;
    public string NumeroDocumento { get; set; } = string.Empty;
    public string Nombres { get; set; } = string.Empty;
    public string ApellidoPaterno { get; set; } = string.Empty;
    public string ApellidoMaterno { get; set; } = string.Empty;
    public DateTime FechaNacimiento { get; set; }
    public string Sexo { get; set; } = string.Empty;
    public List<TelefonoDto> Telefonos { get; set; } = new();
}

public class PersonaNaturalDetalleDto : PersonaNaturalRegistroDto
{
    public int Edad { get; set; }
    public DateTime FechaRegistro { get; set; }
}
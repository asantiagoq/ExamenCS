namespace ConsejerosApi.Models;

public class PersonaJuridicaListadoDto
{
    public int IdEntidad { get; set; }
    public string TipoDocumento { get; set; } = string.Empty;
    public string NumeroDocumento { get; set; } = string.Empty;
    public string RazonSocial { get; set; } = string.Empty;
    public string? Direccion { get; set; }
    public DateTime FechaRegistro { get; set; }
    public string? TelefonosResumen { get; set; }
}

public class PersonaJuridicaRegistroDto
{
    public int? IdEntidad { get; set; }
    public string TipoDocumento { get; set; } = "RUC";
    public string NumeroDocumento { get; set; } = string.Empty;
    public string RazonSocial { get; set; } = string.Empty;
    public string? Direccion { get; set; }
    public List<TelefonoDto> Telefonos { get; set; } = new();
}

public class PersonaJuridicaDetalleDto : PersonaJuridicaRegistroDto
{
    public DateTime FechaRegistro { get; set; }
}
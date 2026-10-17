package jar.dto;

public record PerfilEdicaoRequest(
    String nome,
    String bio,
    String profissao,
    String cidade,
    String empresa,
    String github,
    String linkedin,
    String site
) {
}

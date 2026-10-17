package jar.dto;

public record ConversaResponse(
    Long id,
    String outroNome,
    String outroUsername,
    String outroProfissao,
    String ultimaMensagem,
    String ultimaEm
) {
}

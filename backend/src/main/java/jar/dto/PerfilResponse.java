package jar.dto;

import java.util.List;

public record PerfilResponse(
    String username,
    String nome,
    String profissao,
    String bio,
    String avatar,
    String cidade,
    String empresa,
    String github,
    String linkedin,
    String site,
    List<ProjetoResponse> projetos
) {
}

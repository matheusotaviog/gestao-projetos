package jar.dto;

import java.util.List;

public record PerfilResponse(String username, String nome, String bio, List<ProjetoResponse> projetos) {
}

package jar.dto;

import java.util.List;

public record CandidatoResponse(String username, String nome, String profissao, List<String> tecnologias) {
}

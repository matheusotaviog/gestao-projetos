package jar.dto;

import java.util.List;

public record ProjetoRequest(String nome, String descricao, String link, Integer ano, String readme, List<String> tecnologias) {
}

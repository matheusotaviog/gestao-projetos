package jar.dto;

import jar.entity.Projeto;

import java.util.List;

public record ProjetoResponse(Long id, String nome, String descricao, String link, Integer ano, String imagem, String readme, List<String> tecnologias) {

    public static ProjetoResponse de(Projeto projeto) {
        return new ProjetoResponse(
            projeto.getId(),
            projeto.getNome(),
            projeto.getDescricao(),
            projeto.getLink(),
            projeto.getAno(),
            projeto.getImagem(),
            projeto.getReadme(),
            List.copyOf(projeto.getTecnologias())
        );
    }
}

package jar.dto;

import jar.entity.Projeto;

public record ProjetoResponse(Long id, String nome, String descricao, String link, Integer ano, String imagem) {

    public static ProjetoResponse de(Projeto projeto) {
        return new ProjetoResponse(
            projeto.getId(),
            projeto.getNome(),
            projeto.getDescricao(),
            projeto.getLink(),
            projeto.getAno(),
            projeto.getImagem()
        );
    }
}

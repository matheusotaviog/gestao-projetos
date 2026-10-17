package jar.dto;

import jar.entity.Usuario;

public record PerfilPessoal(
    String username,
    String nome,
    String email,
    String papel,
    String bio,
    String profissao,
    String avatar,
    String cidade,
    String empresa,
    String github,
    String linkedin,
    String site
) {

    public static PerfilPessoal de(Usuario usuario) {
        return new PerfilPessoal(
            usuario.getUsername(),
            usuario.getNome(),
            usuario.getEmail(),
            usuario.getPapel().name(),
            usuario.getBio(),
            usuario.getProfissao(),
            usuario.getAvatar(),
            usuario.getCidade(),
            usuario.getEmpresa(),
            usuario.getGithub(),
            usuario.getLinkedin(),
            usuario.getSite()
        );
    }
}

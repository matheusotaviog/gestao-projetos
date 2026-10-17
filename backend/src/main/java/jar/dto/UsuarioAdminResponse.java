package jar.dto;

import jar.entity.Usuario;

public record UsuarioAdminResponse(Long id, String nome, String email, String username, String papel, String profissao) {

    public static UsuarioAdminResponse de(Usuario usuario) {
        return new UsuarioAdminResponse(
            usuario.getId(),
            usuario.getNome(),
            usuario.getEmail(),
            usuario.getUsername(),
            usuario.getPapel().name(),
            usuario.getProfissao()
        );
    }
}

package jar.service;

import jar.dto.PerfilResponse;
import jar.dto.ProjetoResponse;
import jar.entity.Usuario;
import jar.repository.ProjetoRepository;
import jar.repository.UsuarioRepository;
import java.util.NoSuchElementException;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

@Service
public class PerfilService {

    @Autowired
    private UsuarioRepository usuarioRepository;

    @Autowired
    private ProjetoRepository projetoRepository;

    public PerfilResponse obterPorUsername(String username) {
        Usuario usuario = usuarioRepository.findByUsername(username.toLowerCase());
        if (usuario == null) {
            throw new NoSuchElementException("Perfil não encontrado");
        }
        var projetos = projetoRepository.findByUsuarioOrderByDataCriacaoDesc(usuario).stream()
            .map(ProjetoResponse::de)
            .toList();
        return new PerfilResponse(
            usuario.getUsername(),
            usuario.getNome(),
            usuario.getProfissao(),
            usuario.getBio(),
            usuario.getAvatar(),
            usuario.getCidade(),
            usuario.getEmpresa(),
            usuario.getGithub(),
            usuario.getLinkedin(),
            usuario.getSite(),
            projetos
        );
    }
}

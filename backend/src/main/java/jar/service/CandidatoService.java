package jar.service;

import jar.dto.CandidatoResponse;
import jar.entity.Papel;
import jar.entity.Projeto;
import jar.entity.Usuario;
import jar.repository.ProjetoRepository;
import jar.repository.UsuarioRepository;
import java.util.List;
import java.util.Locale;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

@Service
public class CandidatoService {

    @Autowired
    private UsuarioRepository usuarioRepository;

    @Autowired
    private ProjetoRepository projetoRepository;

    public List<CandidatoResponse> buscar(String busca, String tecnologia, String profissao) {
        String termo = normalizar(busca);
        String tec = normalizar(tecnologia);
        String prof = normalizar(profissao);

        return usuarioRepository.findByPapel(Papel.GESTOR).stream()
            .filter(u -> u.getUsername() != null)
            .map(this::paraCandidato)
            .filter(c -> termo.isEmpty() || normalizar(c.nome()).contains(termo) || normalizar(c.username()).contains(termo))
            .filter(c -> prof.isEmpty() || normalizar(c.profissao()).equals(prof))
            .filter(c -> tec.isEmpty() || c.tecnologias().stream().anyMatch(t -> normalizar(t).equals(tec)))
            .toList();
    }

    private CandidatoResponse paraCandidato(Usuario usuario) {
        List<String> tecnologias = projetoRepository.findByUsuarioOrderByDataCriacaoDesc(usuario).stream()
            .map(Projeto::getTecnologias)
            .flatMap(List::stream)
            .distinct()
            .toList();
        return new CandidatoResponse(usuario.getUsername(), usuario.getNome(), usuario.getProfissao(), usuario.getAvatar(), tecnologias);
    }

    private String normalizar(String valor) {
        return valor == null ? "" : valor.trim().toLowerCase(Locale.ROOT);
    }
}

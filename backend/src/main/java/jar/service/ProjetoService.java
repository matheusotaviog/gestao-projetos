package jar.service;

import jar.dto.ProjetoRequest;
import jar.entity.Projeto;
import jar.entity.Usuario;
import jar.repository.ProjetoRepository;
import jar.repository.UsuarioRepository;
import java.io.IOException;
import java.net.URI;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.List;
import java.util.NoSuchElementException;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.access.AccessDeniedException;
import org.springframework.web.multipart.MultipartFile;
import org.springframework.stereotype.Service;

@Service
public class ProjetoService {

    @Autowired
    private ProjetoRepository projetoRepository;

    @Autowired
    private UsuarioRepository usuarioRepository;

    @Autowired
    private ImagemService imagemService;

    public List<Projeto> listarDoUsuario(String email) {
        return projetoRepository.findByUsuarioOrderByDataCriacaoDesc(donoPeloEmail(email));
    }

    public Projeto obterDoDono(Long id, String email) {
        Projeto projeto = encontrar(id);
        verificarDono(projeto, email);
        return projeto;
    }

    public Projeto criar(String email, ProjetoRequest dados) {
        Projeto projeto = new Projeto();
        projeto.setUsuario(donoPeloEmail(email));
        projeto.setDataCriacao(LocalDateTime.now());
        aplicar(projeto, dados);
        return projetoRepository.save(projeto);
    }

    public Projeto atualizar(Long id, String email, ProjetoRequest dados) {
        Projeto projeto = obterDoDono(id, email);
        aplicar(projeto, dados);
        return projetoRepository.save(projeto);
    }

    public void deletar(Long id, String email) {
        projetoRepository.delete(obterDoDono(id, email));
    }

    private void aplicar(Projeto projeto, ProjetoRequest dados) {
        if (dados.nome() == null || dados.nome().isBlank()) {
            throw new IllegalArgumentException("Informe o nome do projeto");
        }
        String novoLink = dados.link() == null || dados.link().isBlank() ? null : dados.link().trim();
        if (novoLink != null) {
            validarLink(novoLink);
        }

        projeto.setNome(dados.nome().trim());
        projeto.setDescricao(dados.descricao());
        projeto.setLink(novoLink);
        projeto.setAno(dados.ano() != null ? dados.ano() : anoAtual(projeto));
    }

    public Projeto trocarImagem(Long id, String email, MultipartFile arquivo) throws IOException {
        Projeto projeto = obterDoDono(id, email);
        String antiga = nomeDoArquivo(projeto.getImagem());
        String nova = imagemService.salvar(arquivo);
        projeto.setImagem("/api/arquivos/" + nova);
        Projeto salvo = projetoRepository.save(projeto);
        imagemService.remover(antiga);
        return salvo;
    }

    private String nomeDoArquivo(String caminho) {
        return caminho == null ? null : caminho.substring(caminho.lastIndexOf('/') + 1);
    }

    private void validarLink(String link) {
        try {
            URI uri = URI.create(link);
            if (!"http".equals(uri.getScheme()) && !"https".equals(uri.getScheme())) {
                throw new IllegalArgumentException("O link precisa começar com http:// ou https://");
            }
        } catch (IllegalArgumentException e) {
            throw new IllegalArgumentException("Link inválido");
        }
    }

    private int anoAtual(Projeto projeto) {
        return projeto.getAno() != null ? projeto.getAno() : LocalDate.now().getYear();
    }

    private Projeto encontrar(Long id) {
        return projetoRepository.findById(id)
            .orElseThrow(() -> new NoSuchElementException("Projeto não encontrado"));
    }

    private void verificarDono(Projeto projeto, String email) {
        if (!projeto.getUsuario().getEmail().equals(email)) {
            throw new AccessDeniedException("Apenas o dono pode alterar este projeto");
        }
    }

    private Usuario donoPeloEmail(String email) {
        Usuario usuario = usuarioRepository.findByEmail(email);
        if (usuario == null) {
            throw new NoSuchElementException("Usuário não encontrado");
        }
        return usuario;
    }
}

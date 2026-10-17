package jar.service;

import jar.catalogo.Profissoes;
import jar.dto.UsuarioAdminResponse;
import jar.entity.Papel;
import jar.entity.Conversa;
import jar.entity.Projeto;
import jar.repository.ConversaRepository;
import jar.repository.MensagemRepository;
import jar.repository.ProjetoRepository;
import jar.entity.Usuario;
import jar.repository.UsuarioRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import java.time.LocalDateTime;
import java.util.List;
import java.util.NoSuchElementException;
import java.util.regex.Pattern;

@Service
public class UsuarioService {

    private static final Pattern USERNAME = Pattern.compile("[a-z0-9_-]{3,30}");

    @Autowired
    private UsuarioRepository repository;

    @Autowired
    private PasswordEncoder passwordEncoder;

    @Autowired
    private ProjetoRepository projetoRepository;

    @Autowired
    private ConversaRepository conversaRepository;

    @Autowired
    private MensagemRepository mensagemRepository;

    // Listar todos
    public List<Usuario> listarTodos() {
        return repository.findAll();
    }

    // Obter por ID
    public Usuario obterPorId(Long id) {
        return repository.findById(id)
            .orElseThrow(() -> new NoSuchElementException("Usuário não encontrado com ID: " + id));
    }

    // Obter por Email
    public Usuario obterPorEmail(String email) {
        Usuario usuario = repository.findByEmail(email);
        if (usuario == null) {
            throw new RuntimeException("Usuário não encontrado com email: " + email);
        }
        return usuario;
    }

    // Criar
    public Usuario criar(Usuario usuario) {
        if (repository.findByEmail(usuario.getEmail()) != null) {
            throw new RuntimeException("Email já está registrado: " + usuario.getEmail());
        }
        String username = usuario.getUsername() == null ? "" : usuario.getUsername().trim().toLowerCase();
        if (!USERNAME.matcher(username).matches()) {
            throw new RuntimeException("Nome de usuário deve ter de 3 a 30 caracteres: letras minúsculas, números, _ ou -");
        }
        if (repository.findByUsername(username) != null) {
            throw new RuntimeException("Nome de usuário já está em uso");
        }
        usuario.setUsername(username);
        if (usuario.getPapel() == null) {
            usuario.setPapel(Papel.GESTOR);
        }
        if (usuario.getPapel() == Papel.ADMIN) {
            throw new IllegalArgumentException("Cadastro como administrador não é permitido");
        }
        String profissao = usuario.getProfissao() == null ? null : usuario.getProfissao().trim();
        if (usuario.getPapel() == Papel.GESTOR && (profissao == null || profissao.isEmpty())) {
            throw new IllegalArgumentException("Informe sua profissão");
        }
        if (profissao != null && !profissao.isEmpty() && !Profissoes.existe(profissao)) {
            throw new IllegalArgumentException("Profissão desconhecida: " + profissao);
        }
        usuario.setProfissao(profissao == null || profissao.isEmpty() ? null : profissao);
        usuario.setSenha(passwordEncoder.encode(usuario.getSenha()));
        usuario.setDataCriacao(LocalDateTime.now());
        return repository.save(usuario);
    }

    // Atualizar
    public Usuario atualizar(Long id, Usuario usuarioAtualizado) {
        Usuario usuario = obterPorId(id);
        
        if (usuarioAtualizado.getNome() != null) {
            usuario.setNome(usuarioAtualizado.getNome());
        }
        if (usuarioAtualizado.getTelefone() != null) {
            usuario.setTelefone(usuarioAtualizado.getTelefone());
        }
        
        return repository.save(usuario);
    }

    public List<UsuarioAdminResponse> listarParaAdmin() {
        return repository.findAll().stream().map(UsuarioAdminResponse::de).toList();
    }

    public UsuarioAdminResponse alterarPapel(Long id, String emailAdmin, String novoPapel) {
        Usuario alvo = obterPorId(id);
        if (alvo.getEmail().equals(emailAdmin)) {
            throw new IllegalArgumentException("Você não pode alterar o próprio papel");
        }
        alvo.setPapel(lerPapel(novoPapel));
        return UsuarioAdminResponse.de(repository.save(alvo));
    }

    @Transactional
    public void removerParaAdmin(Long id, String emailAdmin) {
        Usuario alvo = obterPorId(id);
        if (alvo.getEmail().equals(emailAdmin)) {
            throw new IllegalArgumentException("Você não pode remover a própria conta");
        }
        for (Conversa conversa : conversaRepository.findByRecrutadorOrGestorOrderByCriadaEmDesc(alvo, alvo)) {
            mensagemRepository.deleteAll(mensagemRepository.findByConversaOrderByCriadaEmAsc(conversa));
            conversaRepository.delete(conversa);
        }
        for (Projeto projeto : projetoRepository.findByUsuarioOrderByDataCriacaoDesc(alvo)) {
            projetoRepository.delete(projeto);
        }
        repository.delete(alvo);
    }

    private Papel lerPapel(String valor) {
        try {
            return Papel.valueOf(valor);
        } catch (IllegalArgumentException | NullPointerException e) {
            throw new IllegalArgumentException("Papel inválido");
        }
    }

    // Deletar
    public void deletar(Long id) {
        Usuario usuario = obterPorId(id);
        repository.deleteById(id);
    }
}
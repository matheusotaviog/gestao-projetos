package jar.service;

import jar.entity.Usuario;
import jar.repository.UsuarioRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import java.time.LocalDateTime;
import java.util.List;
import java.util.regex.Pattern;

@Service
public class UsuarioService {

    private static final Pattern USERNAME = Pattern.compile("[a-z0-9_-]{3,30}");

    @Autowired
    private UsuarioRepository repository;

    @Autowired
    private PasswordEncoder passwordEncoder;

    // Listar todos
    public List<Usuario> listarTodos() {
        return repository.findAll();
    }

    // Obter por ID
    public Usuario obterPorId(Long id) {
        return repository.findById(id)
            .orElseThrow(() -> new RuntimeException("Usuário não encontrado com ID: " + id));
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

    // Deletar
    public void deletar(Long id) {
        Usuario usuario = obterPorId(id);
        repository.deleteById(id);
    }
}
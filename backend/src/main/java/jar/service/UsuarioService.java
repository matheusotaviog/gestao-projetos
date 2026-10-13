package jar.service;

import jar.entity.Usuario;
import jar.repository.UsuarioRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import java.time.LocalDateTime;
import java.util.List;

@Service
public class UsuarioService {

    @Autowired
    private UsuarioRepository repository;

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
        // Validar email único
        if (repository.findByEmail(usuario.getEmail()) != null) {
            throw new RuntimeException("Email já está registrado: " + usuario.getEmail());
        }
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
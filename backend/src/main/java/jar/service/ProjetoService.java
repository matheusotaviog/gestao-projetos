package jar.service;

import jar.entity.Projeto;
import jar.repository.ProjetoRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import java.time.LocalDateTime;
import java.util.List;

@Service
public class ProjetoService {

    @Autowired
    private ProjetoRepository repository;

    public List<Projeto> listarTodos() {
        return repository.findAll();
    }

    public Projeto obterPorId(Long id) {
        return repository.findById(id)
            .orElseThrow(() -> new RuntimeException("Projeto não encontrado"));
    }

    public Projeto criar(Projeto projeto) {
        projeto.setDataCriacao(LocalDateTime.now());
        return repository.save(projeto);
    }

    public Projeto atualizar(Long id, Projeto projetoAtualizado) {
        Projeto projeto = obterPorId(id);
        if (projetoAtualizado.getNome() != null) {
            projeto.setNome(projetoAtualizado.getNome());
        }
        if (projetoAtualizado.getDescricao() != null) {
            projeto.setDescricao(projetoAtualizado.getDescricao());
        }
        return repository.save(projeto);
    }

    public void deletar(Long id) {
        repository.deleteById(id);
    }
}

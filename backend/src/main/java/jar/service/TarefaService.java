package jar.service;

import jar.model.Tarefa;
import jar.repository.TarefaRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class TarefaService {

    @Autowired
    private TarefaRepository tarefaRepository;

    public Tarefa salvar(Tarefa tarefa) {
        return tarefaRepository.save(tarefa);
    }

    public List<Tarefa> listarPorProjeto(Long projetoId) {
        return tarefaRepository.findByProjetoId(projetoId);
    }

    public Optional<Tarefa> buscarPorId(Long id) {
        return tarefaRepository.findById(id);
    }

    public void deletar(Long id) {
        tarefaRepository.deleteById(id);
    }
}

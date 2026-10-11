package jar.service;

import jar.model.Projeto;
import jar.repository.ProjetoRepository;

import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.web.server.ResponseStatusException;

import java.util.List;

@Service
public class ProjetoService {

    private final ProjetoRepository projetoRepository;

    public ProjetoService(ProjetoRepository projetoRepository) {
        this.projetoRepository = projetoRepository;
    }

    // CREATE: cadastrar projeto
    public Projeto criar(Projeto projeto) {
        return projetoRepository.save(projeto);
    }

    // READ: listar todos
    public List<Projeto> listarTodos() {
        return projetoRepository.findAll();
    }

    // READ: buscar por ID
    public Projeto buscarPorId(Long id) {
        return projetoRepository.findById(id)
                .orElseThrow(() -> new ResponseStatusException(
                        HttpStatus.NOT_FOUND,
                        "Projeto não encontrado"
                ));
    }

    // UPDATE: atualizar projeto
    public Projeto atualizar(Long id, Projeto dados) {
        Projeto projeto = buscarPorId(id);

        projeto.setNome(dados.getNome());
        projeto.setDescricao(dados.getDescricao());
        projeto.setDataInicio(dados.getDataInicio());
        projeto.setDataFim(dados.getDataFim());
        projeto.setStatus(dados.getStatus());

        return projetoRepository.save(projeto);
    }

    // DELETE: excluir projeto
    public void excluir(Long id) {
        Projeto projeto = buscarPorId(id);
        projetoRepository.delete(projeto);
    }
}
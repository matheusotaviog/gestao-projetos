package jar.controller;

import jar.model.Projeto;
import jar.service.ProjetoService;

import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/projetos")
public class ProjetoController {

    private final ProjetoService projetoService;

    public ProjetoController(ProjetoService projetoService) {
        this.projetoService = projetoService;
    }

    // CREATE
    @PostMapping
    @ResponseStatus(HttpStatus.CREATED)
    public Projeto criar(@RequestBody Projeto projeto) {
        return projetoService.criar(projeto);
    }

    // READ: listar todos
    @GetMapping
    public List<Projeto> listarTodos() {
        return projetoService.listarTodos();
    }

    // READ: buscar por ID
    @GetMapping("/{id}")
    public Projeto buscarPorId(@PathVariable Long id) {
        return projetoService.buscarPorId(id);
    }

    // UPDATE
    @PutMapping("/{id}")
    public Projeto atualizar(
            @PathVariable Long id,
            @RequestBody Projeto projeto) {
        return projetoService.atualizar(id, projeto);
    }

    // DELETE
    @DeleteMapping("/{id}")
    @ResponseStatus(HttpStatus.NO_CONTENT)
    public void excluir(@PathVariable Long id) {
        projetoService.excluir(id);
    }
}
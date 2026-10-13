package jar.controller;

import jar.entity.Projeto;
import jar.service.ProjetoService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.util.List;

@RestController
@RequestMapping("/api/projetos")
@CrossOrigin(origins = "http://localhost:5173")
public class ProjetoController {

    @Autowired
    private ProjetoService service;

    @GetMapping
    public ResponseEntity<?> listar() {
        try {
            List<Projeto> projetos = service.listarTodos();
            return ResponseEntity.ok(projetos);
        } catch (Exception e) {
            return ResponseEntity.status(500)
                .body("Erro ao listar projetos: " + e.getMessage());
        }
    }

    @GetMapping("/{id}")
    public ResponseEntity<?> obter(@PathVariable Long id) {
        try {
            Projeto projeto = service.obterPorId(id);
            return ResponseEntity.ok(projeto);
        } catch (Exception e) {
            return ResponseEntity.status(404)
                .body("Projeto não encontrado");
        }
    }

    @PostMapping
    public ResponseEntity<?> criar(@RequestBody Projeto projeto) {
        try {
            Projeto novo = service.criar(projeto);
            return ResponseEntity.status(201).body(novo);
        } catch (Exception e) {
            return ResponseEntity.status(400)
                .body("Erro ao criar projeto: " + e.getMessage());
        }
    }

    @PutMapping("/{id}")
    public ResponseEntity<?> atualizar(
        @PathVariable Long id,
        @RequestBody Projeto projeto
    ) {
        try {
            Projeto atualizado = service.atualizar(id, projeto);
            return ResponseEntity.ok(atualizado);
        } catch (Exception e) {
            return ResponseEntity.status(400)
                .body("Erro ao atualizar projeto: " + e.getMessage());
        }
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<?> deletar(@PathVariable Long id) {
        try {
            service.deletar(id);
            return ResponseEntity.noContent().build();
        } catch (Exception e) {
            return ResponseEntity.status(400)
                .body("Erro ao deletar projeto: " + e.getMessage());
        }
    }
}

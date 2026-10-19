package jar.controller;

import jar.entity.Usuario;
import jar.service.UsuarioService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.util.List;

@RestController
@RequestMapping("/api/usuarios")
public class UsuarioController {

    @Autowired
    private UsuarioService service;

    // GET /api/usuarios
    @GetMapping
    public ResponseEntity<?> listar() {
        try {
            List<Usuario> usuarios = service.listarTodos();
            return ResponseEntity.ok(usuarios);
        } catch (Exception e) {
            return ResponseEntity.status(500)
                .body("Erro ao listar usuários: " + e.getMessage());
        }
    }

    // GET /api/usuarios/1
    @GetMapping("/{id}")
    public ResponseEntity<?> obter(@PathVariable Long id) {
        try {
            Usuario usuario = service.obterPorId(id);
            return ResponseEntity.ok(usuario);
        } catch (Exception e) {
            return ResponseEntity.status(404)
                .body("Usuário não encontrado");
        }
    }

    // POST /api/usuarios
    @PostMapping
    public ResponseEntity<?> criar(@RequestBody Usuario usuario) {
        try {
            Usuario novo = service.criar(usuario);
            return ResponseEntity.status(201).body(novo);
        } catch (Exception e) {
            return ResponseEntity.status(400)
                .body("Erro ao criar usuário: " + e.getMessage());
        }
    }

    // PUT /api/usuarios/1
    @PutMapping("/{id}")
    public ResponseEntity<?> atualizar(
        @PathVariable Long id,
        @RequestBody Usuario usuario
    ) {
        try {
            Usuario atualizado = service.atualizar(id, usuario);
            return ResponseEntity.ok(atualizado);
        } catch (Exception e) {
            return ResponseEntity.status(400)
                .body("Erro ao atualizar usuário: " + e.getMessage());
        }
    }

    // DELETE /api/usuarios/1
    @DeleteMapping("/{id}")
    public ResponseEntity<?> deletar(@PathVariable Long id) {
        try {
            service.deletar(id);
            return ResponseEntity.noContent().build();
        } catch (Exception e) {
            return ResponseEntity.status(400)
                .body("Erro ao deletar usuário: " + e.getMessage());
        }
    }
}
package jar.controller;

import jar.dto.PapelRequest;
import jar.dto.UsuarioAdminResponse;
import jar.service.UsuarioService;
import java.util.List;
import java.util.NoSuchElementException;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.dao.DataAccessException;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/admin/usuarios")
public class AdminController {

    @Autowired
    private UsuarioService service;

    @GetMapping
    public List<UsuarioAdminResponse> listar() {
        return service.listarParaAdmin();
    }

    @PatchMapping("/{id}/papel")
    public ResponseEntity<?> alterarPapel(@PathVariable Long id, @RequestBody PapelRequest dados, Authentication auth) {
        try {
            return ResponseEntity.ok(service.alterarPapel(id, auth.getName(), dados.papel()));
        } catch (NoSuchElementException e) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(e.getMessage());
        } catch (IllegalArgumentException e) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(e.getMessage());
        }
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<?> remover(@PathVariable Long id, Authentication auth) {
        try {
            service.removerParaAdmin(id, auth.getName());
            return ResponseEntity.noContent().build();
        } catch (NoSuchElementException e) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(e.getMessage());
        } catch (IllegalArgumentException e) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(e.getMessage());
        } catch (DataAccessException e) {
            return ResponseEntity.status(HttpStatus.CONFLICT).body("Não foi possível remover esta conta. Tente novamente.");
        }
    }
}

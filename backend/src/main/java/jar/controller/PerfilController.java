package jar.controller;

import jar.dto.PerfilResponse;
import jar.service.PerfilService;
import java.util.NoSuchElementException;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/perfis")
public class PerfilController {

    @Autowired
    private PerfilService service;

    @GetMapping("/{username}")
    public ResponseEntity<?> obter(@PathVariable String username) {
        try {
            PerfilResponse perfil = service.obterPorUsername(username);
            return ResponseEntity.ok(perfil);
        } catch (NoSuchElementException e) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(e.getMessage());
        }
    }
}

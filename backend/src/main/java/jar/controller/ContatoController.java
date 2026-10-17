package jar.controller;

import jar.dto.ContatoRequest;
import jar.service.ContatoService;
import java.util.NoSuchElementException;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/candidatos")
public class ContatoController {

    @Autowired
    private ContatoService service;

    @PostMapping("/{username}/contato")
    public ResponseEntity<?> contatar(@PathVariable String username, @RequestBody ContatoRequest dados, Authentication auth) {
        try {
            service.enviar(username, auth.getName(), dados);
            return ResponseEntity.ok().build();
        } catch (NoSuchElementException e) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(e.getMessage());
        } catch (IllegalArgumentException e) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(e.getMessage());
        } catch (IllegalStateException e) {
            return ResponseEntity.status(HttpStatus.SERVICE_UNAVAILABLE).body(e.getMessage());
        }
    }
}

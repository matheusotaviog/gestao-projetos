package jar.controller;

import jar.dto.PerfilEdicaoRequest;
import jar.dto.PerfilPessoal;
import jar.service.PerfilEdicaoService;
import java.io.IOException;
import java.util.NoSuchElementException;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

@RestController
@RequestMapping("/api/perfil")
public class PerfilEdicaoController {

    @Autowired
    private PerfilEdicaoService service;

    @GetMapping
    public PerfilPessoal obter(Authentication auth) {
        return service.obter(auth.getName());
    }

    @PutMapping
    public ResponseEntity<?> atualizar(@RequestBody PerfilEdicaoRequest dados, Authentication auth) {
        return responder(() -> service.atualizar(auth.getName(), dados));
    }

    @PostMapping(value = "/avatar", consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    public ResponseEntity<?> avatar(@RequestParam("arquivo") MultipartFile arquivo, Authentication auth) {
        try {
            return ResponseEntity.ok(service.trocarAvatar(auth.getName(), arquivo));
        } catch (IOException e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("Não foi possível salvar a imagem");
        } catch (IllegalArgumentException e) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(e.getMessage());
        } catch (NoSuchElementException e) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(e.getMessage());
        }
    }

    private ResponseEntity<?> responder(java.util.function.Supplier<?> acao) {
        try {
            return ResponseEntity.ok(acao.get());
        } catch (IllegalArgumentException e) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(e.getMessage());
        } catch (NoSuchElementException e) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(e.getMessage());
        }
    }
}

package jar.controller;

import jar.dto.ProjetoRequest;
import jar.dto.ProjetoResponse;
import jar.entity.Projeto;
import jar.service.ProjetoService;
import java.io.IOException;
import org.springframework.http.MediaType;
import org.springframework.web.multipart.MultipartFile;
import java.util.List;
import java.util.NoSuchElementException;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.AccessDeniedException;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/projetos")
@CrossOrigin(origins = "http://localhost:5173")
public class ProjetoController {

    @Autowired
    private ProjetoService service;

    @GetMapping("/meus")
    public List<ProjetoResponse> meus(Authentication auth) {
        return service.listarDoUsuario(auth.getName()).stream()
            .map(ProjetoResponse::de)
            .toList();
    }

    @GetMapping("/{id}")
    public ResponseEntity<?> obter(@PathVariable Long id, Authentication auth) {
        return responder(() -> ProjetoResponse.de(service.obterDoDono(id, auth.getName())));
    }

    @PostMapping
    public ResponseEntity<?> criar(@RequestBody ProjetoRequest dados, Authentication auth) {
        return responder(() -> ProjetoResponse.de(service.criar(auth.getName(), dados)), HttpStatus.CREATED);
    }

    @PutMapping("/{id}")
    public ResponseEntity<?> atualizar(
        @PathVariable Long id,
        @RequestBody ProjetoRequest dados,
        Authentication auth
    ) {
        return responder(() -> ProjetoResponse.de(service.atualizar(id, auth.getName(), dados)));
    }

    @PostMapping(value = "/{id}/imagem", consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    public ResponseEntity<?> enviarImagem(
        @PathVariable Long id,
        @RequestParam("arquivo") MultipartFile arquivo,
        Authentication auth
    ) {
        try {
            return ResponseEntity.ok(ProjetoResponse.de(service.trocarImagem(id, auth.getName(), arquivo)));
        } catch (AccessDeniedException e) {
            return ResponseEntity.status(HttpStatus.FORBIDDEN).body(e.getMessage());
        } catch (NoSuchElementException e) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(e.getMessage());
        } catch (IllegalArgumentException e) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(e.getMessage());
        } catch (IOException e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("Não foi possível salvar a imagem");
        }
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<?> deletar(@PathVariable Long id, Authentication auth) {
        return responder(() -> {
            service.deletar(id, auth.getName());
            return null;
        }, HttpStatus.NO_CONTENT);
    }

    private ResponseEntity<?> responder(java.util.function.Supplier<?> acao) {
        return responder(acao, HttpStatus.OK);
    }

    private ResponseEntity<?> responder(java.util.function.Supplier<?> acao, HttpStatus sucesso) {
        try {
            Object corpo = acao.get();
            if (sucesso == HttpStatus.NO_CONTENT) {
                return ResponseEntity.noContent().build();
            }
            return ResponseEntity.status(sucesso).body(corpo);
        } catch (AccessDeniedException e) {
            return ResponseEntity.status(HttpStatus.FORBIDDEN).body(e.getMessage());
        } catch (NoSuchElementException e) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(e.getMessage());
        } catch (IllegalArgumentException e) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(e.getMessage());
        }
    }
}

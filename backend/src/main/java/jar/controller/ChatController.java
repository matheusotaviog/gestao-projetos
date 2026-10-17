package jar.controller;

import jar.dto.ConversaResponse;
import jar.dto.MensagemResponse;
import jar.dto.NovaConversaRequest;
import jar.dto.NovaMensagemRequest;
import jar.service.ChatService;
import java.util.List;
import java.util.NoSuchElementException;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.AccessDeniedException;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/chat")
public class ChatController {

    @Autowired
    private ChatService service;

    @GetMapping("/conversas")
    public List<ConversaResponse> conversas(Authentication auth) {
        return service.listarConversas(auth.getName());
    }

    @PostMapping("/conversas")
    public ResponseEntity<?> abrir(@RequestBody NovaConversaRequest dados, Authentication auth) {
        return responder(() -> service.abrirConversa(auth.getName(), dados.username()));
    }

    @GetMapping("/conversas/{id}/mensagens")
    public ResponseEntity<?> mensagens(@PathVariable Long id, Authentication auth) {
        return responder(() -> service.listarMensagens(auth.getName(), id));
    }

    @PostMapping("/conversas/{id}/mensagens")
    public ResponseEntity<?> enviar(@PathVariable Long id, @RequestBody NovaMensagemRequest dados, Authentication auth) {
        return responder(() -> service.enviar(auth.getName(), id, dados.texto()));
    }

    private ResponseEntity<?> responder(java.util.function.Supplier<?> acao) {
        try {
            return ResponseEntity.ok(acao.get());
        } catch (AccessDeniedException e) {
            return ResponseEntity.status(HttpStatus.FORBIDDEN).body(e.getMessage());
        } catch (NoSuchElementException e) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(e.getMessage());
        } catch (IllegalArgumentException e) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(e.getMessage());
        }
    }
}

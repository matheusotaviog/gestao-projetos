package jar.controller;

import jar.service.ImagemService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.core.io.Resource;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.http.MediaTypeFactory;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/arquivos")
public class ArquivoController {

    @Autowired
    private ImagemService imagemService;

    @GetMapping("/{nome}")
    public ResponseEntity<Resource> obter(@PathVariable String nome) {
        Resource recurso = imagemService.carregar(nome);
        if (recurso == null) {
            return ResponseEntity.notFound().build();
        }
        MediaType tipo = MediaTypeFactory.getMediaType(recurso).orElse(MediaType.APPLICATION_OCTET_STREAM);
        return ResponseEntity.ok().contentType(tipo).body(recurso);
    }
}

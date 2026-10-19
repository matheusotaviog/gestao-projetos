package jar.controller;

import jar.entity.Arquivo;
import jar.service.ImagemService;
import java.time.Duration;
import java.util.Optional;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.CacheControl;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/arquivos")
public class ArquivoController {

    @Autowired
    private ImagemService imagemService;

    @GetMapping("/{nome}")
    public ResponseEntity<byte[]> obter(@PathVariable String nome) {
        Optional<Arquivo> arquivo = imagemService.carregar(nome);
        if (arquivo.isEmpty()) {
            return ResponseEntity.notFound().build();
        }
        return ResponseEntity.ok()
            .contentType(MediaType.parseMediaType(arquivo.get().getTipo()))
            .cacheControl(CacheControl.maxAge(Duration.ofDays(1)).cachePublic())
            .body(arquivo.get().getConteudo());
    }
}

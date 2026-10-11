package jar.controller; // anotacao para indicar que esta classe é um controlador REST 

import org.springframework.core.io.ClassPathResource;
import org.springframework.core.io.Resource;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController // anotacao para indicar que esta classe é um controlador REST
public class PaginaController {

    @GetMapping(value = "/cadastro.html", produces = MediaType.TEXT_HTML_VALUE)
    public ResponseEntity<Resource> cadastro() {

        Resource pagina =
                new ClassPathResource("static/cadastro.html"); // caminho para o arquivo HTML dentro do diretorio

        if (!pagina.exists()) {
            return ResponseEntity.notFound().build();
        }

        return ResponseEntity.ok(pagina);
    }

    @GetMapping(value = "/login.html", produces = MediaType.TEXT_HTML_VALUE) // anotaçao
    public ResponseEntity<Resource> login() {

        Resource pagina =
                new ClassPathResource("static/login.html");

        if (!pagina.exists()) {
            return ResponseEntity.notFound().build();
        }

        return ResponseEntity.ok(pagina); // retorna a pagina HTML como resposta 
    }
}
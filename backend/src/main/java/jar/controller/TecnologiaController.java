package jar.controller;

import jar.catalogo.Tecnologias;
import java.util.List;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/tecnologias")
public class TecnologiaController {

    @GetMapping
    public List<Tecnologias.Grupo> listar() {
        return Tecnologias.GRUPOS;
    }
}

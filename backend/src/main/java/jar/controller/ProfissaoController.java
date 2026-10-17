package jar.controller;

import jar.catalogo.Profissoes;
import java.util.List;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/profissoes")
public class ProfissaoController {

    @GetMapping
    public List<String> listar() {
        return Profissoes.LISTA;
    }
}

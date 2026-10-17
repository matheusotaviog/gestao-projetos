package jar.controller;

import jar.dto.CandidatoResponse;
import jar.service.CandidatoService;
import java.util.List;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/candidatos")
public class CandidatoController {

    @Autowired
    private CandidatoService service;

    @GetMapping
    public List<CandidatoResponse> buscar(
        @RequestParam(required = false) String busca,
        @RequestParam(required = false) String tecnologia,
        @RequestParam(required = false) String profissao
    ) {
        return service.buscar(busca, tecnologia, profissao);
    }
}

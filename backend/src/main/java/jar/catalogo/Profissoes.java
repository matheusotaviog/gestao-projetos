package jar.catalogo;

import java.util.List;

public final class Profissoes {

    public static final List<String> LISTA = List.of(
        "Desenvolvedor Front-end",
        "Desenvolvedor Back-end",
        "Desenvolvedor Full Stack",
        "Desenvolvedor Mobile",
        "Designer de Produto",
        "Designer UI/UX",
        "Cientista de Dados",
        "Engenheiro de IA",
        "DevOps",
        "QA / Testes",
        "Analista de Sistemas",
        "Estudante"
    );

    private Profissoes() {
    }

    public static boolean existe(String profissao) {
        return LISTA.contains(profissao);
    }
}

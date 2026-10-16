package jar.catalogo;

import java.util.List;
import java.util.Set;

public final class Tecnologias {

    public record Grupo(String titulo, List<String> itens) {
    }

    public static final List<Grupo> GRUPOS = List.of(
        new Grupo("Front-end", List.of("HTML", "CSS", "SASS", "TailwindCSS", "JavaScript", "TypeScript", "React", "Next", "Angular")),
        new Grupo("Back-end", List.of("Node.js", "Express.js", "Fastify", "Java", "Spring Boot")),
        new Grupo("Banco de Dados & ORM", List.of("MySQL", "PostgreSQL", "Prisma", "DBeaver")),
        new Grupo("Infraestrutura & Ferramentas", List.of("Docker", "Ubuntu", "Git", "Figma", "Postman", "Insomnia", "n8n")),
        new Grupo("Inteligência Artificial", List.of("Gen AI", "Claude", "ChatGPT", "Gemini", "Copilot"))
    );

    private static final Set<String> TODAS = GRUPOS.stream()
        .flatMap(grupo -> grupo.itens().stream())
        .collect(java.util.stream.Collectors.toUnmodifiableSet());

    private Tecnologias() {
    }

    public static boolean existe(String tecnologia) {
        return TODAS.contains(tecnologia);
    }
}

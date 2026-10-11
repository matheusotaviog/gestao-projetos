package jar.repository;

import jar.model.Projeto;
import org.springframework.data.jpa.repository.JpaRepository;

public interface ProjetoRepository
        extends JpaRepository<Projeto, Long> {
}
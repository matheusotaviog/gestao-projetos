package jar.repository;

import jar.entity.Projeto;
import jar.entity.Usuario;
import java.util.List;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface ProjetoRepository extends JpaRepository<Projeto, Long> {
    List<Projeto> findByUsuarioOrderByDataCriacaoDesc(Usuario usuario);
}

package jar.repository;

import jar.entity.Conversa;
import jar.entity.Usuario;
import java.util.List;
import java.util.Optional;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface ConversaRepository extends JpaRepository<Conversa, Long> {
    Optional<Conversa> findByRecrutadorAndGestor(Usuario recrutador, Usuario gestor);
    List<Conversa> findByRecrutadorOrGestorOrderByCriadaEmDesc(Usuario recrutador, Usuario gestor);
}

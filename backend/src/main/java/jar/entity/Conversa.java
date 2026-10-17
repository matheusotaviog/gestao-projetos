package jar.entity;

import jakarta.persistence.*;
import java.time.LocalDateTime;

@Entity
@Table(name = "conversa", uniqueConstraints = @UniqueConstraint(columnNames = {"recrutador_id", "gestor_id"}))
public class Conversa {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(optional = false)
    @JoinColumn(name = "recrutador_id", nullable = false)
    private Usuario recrutador;

    @ManyToOne(optional = false)
    @JoinColumn(name = "gestor_id", nullable = false)
    private Usuario gestor;

    @Column(name = "criada_em", nullable = false)
    private LocalDateTime criadaEm;

    public Conversa() {}

    public Conversa(Usuario recrutador, Usuario gestor) {
        this.recrutador = recrutador;
        this.gestor = gestor;
        this.criadaEm = LocalDateTime.now();
    }

    public Long getId() { return id; }
    public Usuario getRecrutador() { return recrutador; }
    public Usuario getGestor() { return gestor; }
    public LocalDateTime getCriadaEm() { return criadaEm; }
}

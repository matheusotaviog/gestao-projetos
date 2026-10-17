package jar.entity;

import jakarta.persistence.*;
import java.time.LocalDateTime;

@Entity
@Table(name = "mensagem")
public class Mensagem {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(optional = false)
    @JoinColumn(name = "conversa_id", nullable = false)
    private Conversa conversa;

    @ManyToOne(optional = false)
    @JoinColumn(name = "remetente_id", nullable = false)
    private Usuario remetente;

    @Column(nullable = false, length = 2000)
    private String texto;

    @Column(name = "criada_em", nullable = false)
    private LocalDateTime criadaEm;

    public Mensagem() {}

    public Mensagem(Conversa conversa, Usuario remetente, String texto) {
        this.conversa = conversa;
        this.remetente = remetente;
        this.texto = texto;
        this.criadaEm = LocalDateTime.now();
    }

    public Long getId() { return id; }
    public Conversa getConversa() { return conversa; }
    public Usuario getRemetente() { return remetente; }
    public String getTexto() { return texto; }
    public LocalDateTime getCriadaEm() { return criadaEm; }
}

package jar.entity;

import jakarta.persistence.*;
import java.time.LocalDateTime;

@Entity
@Table(name = "arquivo")
public class Arquivo {

    @Id
    @Column(length = 60)
    private String nome;

    @Column(nullable = false, length = 40)
    private String tipo;

    @Column(nullable = false, columnDefinition = "bytea")
    private byte[] conteudo;

    @Column(name = "criado_em", nullable = false)
    private LocalDateTime criadoEm;

    public Arquivo() {}

    public Arquivo(String nome, String tipo, byte[] conteudo) {
        this.nome = nome;
        this.tipo = tipo;
        this.conteudo = conteudo;
        this.criadoEm = LocalDateTime.now();
    }

    public String getNome() { return nome; }
    public String getTipo() { return tipo; }
    public byte[] getConteudo() { return conteudo; }
}

package jar.model;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.Table;
import jar.entity.Projeto;
import java.time.LocalDate;
import java.time.LocalDateTime;

@Entity
@Table(name = "tarefa")
public class Tarefa {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne
    @JoinColumn(name = "projeto_id", nullable = false)
    private Projeto projeto;

    @Column(nullable = false, length = 150)
    private String titulo;

    @Column(nullable = false, length = 20)
    private String status;

    @Column(name = "data_entrega")
    private LocalDate dataEntrega;

    @Column(columnDefinition = "TEXT")
    private String observacao;

    @Column(name = "data_criacao", nullable = false, updatable = false)
    private LocalDateTime dataCriacao;

    public Tarefa() {
        this.status = "pendente";
        this.dataCriacao = LocalDateTime.now();
    }

    public Tarefa(Projeto projeto, String titulo, String status, LocalDate dataEntrega, String observacao) {
        this.projeto = projeto;
        this.titulo = titulo;
        this.status = (status != null && !status.isEmpty()) ? status : "pendente";
        this.dataEntrega = dataEntrega;
        this.observacao = observacao;
        this.dataCriacao = LocalDateTime.now();
    }

    public Long getId() { return id; }

    public Projeto getProjeto() { return projeto; }
    public void setProjeto(Projeto projeto) { this.projeto = projeto; }

    public String getTitulo() { return titulo; }
    public void setTitulo(String titulo) { this.titulo = titulo; }

    public String getStatus() { return status; }
    public void setStatus(String status) { this.status = status; }

    public LocalDate getDataEntrega() { return dataEntrega; }
    public void setDataEntrega(LocalDate dataEntrega) { this.dataEntrega = dataEntrega; }

    public String getObservacao() { return observacao; }
    public void setObservacao(String observacao) { this.observacao = observacao; }

    public LocalDateTime getDataCriacao() { return dataCriacao; }
    public void setDataCriacao(LocalDateTime dataCriacao) { this.dataCriacao = dataCriacao; }
}

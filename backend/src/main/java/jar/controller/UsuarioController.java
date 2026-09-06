package jar.controller;

import jar.model.Usuario;
import jar.security.JwtService;
import jar.service.UsuarioService;

import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/usuarios")
public class UsuarioController {

    private final UsuarioService usuarioService;
    private final JwtService jwtService;

    public UsuarioController(
            UsuarioService usuarioService,
            JwtService jwtService) {
        this.usuarioService = usuarioService;
        this.jwtService = jwtService;
    }

    @PostMapping
    public Usuario cadastrar(@RequestBody Usuario usuario) {
        Usuario novoUsuario = usuarioService.cadastrar(usuario);
        novoUsuario.setSenha(null);
        return novoUsuario;
    }

    @PostMapping("/login")
    public LoginResponse login(@RequestBody LoginRequest dados) {
        Usuario usuario = usuarioService.login(
                dados.email(),
                dados.senha()
        );

        String token = jwtService.gerarToken(usuario.getEmail());

        return new LoginResponse(
                "Login realizado com sucesso!",
                token
        );
    }

    @GetMapping
    public List<Usuario> listarUsuarios() {
        List<Usuario> usuarios = usuarioService.listarTodos();

        usuarios.forEach(usuario -> usuario.setSenha(null));

        return usuarios;
    }

    public record LoginRequest(String email, String senha) {}

    public record LoginResponse(String mensagem, String token) {}
}
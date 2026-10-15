package jar.service;

import jar.dto.LoginResponse;
import jar.entity.Usuario;
import jar.repository.UsuarioRepository;
import jar.security.JwtService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.authentication.BadCredentialsException;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

@Service
public class AuthService {

    @Autowired
    private UsuarioRepository repository;

    @Autowired
    private PasswordEncoder passwordEncoder;

    @Autowired
    private JwtService jwtService;

    public LoginResponse login(String email, String senha) {
        Usuario usuario = repository.findByEmail(email);

        if (usuario == null || !passwordEncoder.matches(senha, usuario.getSenha())) {
            throw new BadCredentialsException("E-mail ou senha inválidos");
        }

        return new LoginResponse(jwtService.gerarToken(usuario.getEmail()), usuario.getUsername());
    }
}

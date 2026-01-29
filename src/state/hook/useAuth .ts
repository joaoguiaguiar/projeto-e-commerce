import { useEffect } from "react";
import { useRecoilState } from "recoil";
import { authState } from "../authState"; 

// Função para gerar hash da senha
const gerarHashSenha = async (senha: string): Promise<string> => {
  const encoder = new TextEncoder();
  const data = encoder.encode(senha);
  const hashBuffer = await crypto.subtle.digest("SHA-256", data);
  const hashArray = Array.from(new Uint8Array(hashBuffer));
  return hashArray.map(b => b.toString(16).padStart(2, "0")).join("");
};

export const useAutenticacao = () => {
  const [auth, setAuth] = useRecoilState(authState);

  // Mantém usuário logado após refresh
  useEffect(() => {
    const tokenUsuario = localStorage.getItem("user_token");
    const usuariosStorage = localStorage.getItem("users_bd");

    if (tokenUsuario && usuariosStorage) {
      try {
        const dadosToken = JSON.parse(tokenUsuario);
        const usuarios = JSON.parse(usuariosStorage);

        const usuarioEncontrado = usuarios.find(
          (user: { email: string }) => user.email === dadosToken.email
        );

        if (usuarioEncontrado) {
          const { senha, ...usuarioSemSenha } = usuarioEncontrado;
          setAuth({ user: usuarioSemSenha, isAuthenticated: true });
        } else {
          localStorage.removeItem("user_token");
          setAuth({ user: null, isAuthenticated: false });
        }
      } catch (error) {
        console.error("Erro ao carregar usuário:", error);
        localStorage.removeItem("user_token");
        setAuth({ user: null, isAuthenticated: false });
      }
    }
  }, [setAuth]);

  // LOGIN
  const entrar = async (email: string, senha: string) => {
    const usuariosStorage = JSON.parse(
      localStorage.getItem("users_bd") || "[]"
    );

    const usuarioEncontrado = usuariosStorage.find(
      (user: { email: string }) => user.email === email
    );

    if (!usuarioEncontrado) {
      return "Usuário não cadastrado";
    }

    const senhaHash = await gerarHashSenha(senha);

    if (usuarioEncontrado.senha !== senhaHash) {
      return "Senha incorreta";
    }

    const token = Math.random().toString(36).substring(2);
    localStorage.setItem(
      "user_token",
      JSON.stringify({ email, token })
    );

    const { senha: _, ...usuarioSemSenha } = usuarioEncontrado;
    setAuth({ user: usuarioSemSenha, isAuthenticated: true });

    return null;
  };

  // CADASTRO - MODIFICADO: Retorna null em caso de sucesso
  const cadastrar = async (
    nome: string,
    email: string,
    cep: string,
    endereco: string,
    senha: string
  ) => {
    const usuariosStorage = JSON.parse(
      localStorage.getItem("users_bd") || "[]"
    );

    const usuarioEncontrado = usuariosStorage.find(
      (user: { email: string }) => user.email === email
    );

    if (usuarioEncontrado) {
      return "Usuário já cadastrado"; 
    }

    const senhaHash = await gerarHashSenha(senha);

    const novoUsuario = {
      nome,
      email,
      cep,
      endereco,
      senha: senhaHash,
    };

    localStorage.setItem(
      "users_bd",
      JSON.stringify([...usuariosStorage, novoUsuario])
    );

    return null; 
  };

  // LOGOUT
  const sair = () => {
    setAuth({ user: null, isAuthenticated: false });
    localStorage.removeItem("user_token");
  };

  return { auth, entrar, cadastrar, sair };
};
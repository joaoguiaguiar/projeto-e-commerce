import { useEffect } from "react";
import { useRecoilState } from "recoil";
import { authState } from "../authState"; 

// Função simples de hash (use bcrypt em produção real!)
const hashPassword = async (password: string): Promise<string> => {
  const encoder = new TextEncoder();
  const data = encoder.encode(password);
  const hashBuffer = await crypto.subtle.digest("SHA-256", data);
  const hashArray = Array.from(new Uint8Array(hashBuffer));
  return hashArray.map(b => b.toString(16).padStart(2, "0")).join("");
};

export const useAuth = () => {
  const [auth, setAuth] = useRecoilState(authState);

  // 🔹 Mantém usuário logado após refresh
  useEffect(() => {
    const userToken = localStorage.getItem("user_token");
    const usersStorage = localStorage.getItem("users_bd");

    if (userToken && usersStorage) {
      try {
        const tokenData = JSON.parse(userToken);
        const users = JSON.parse(usersStorage);

        const foundUser = users.find(
          (user: { email: string }) => user.email === tokenData.email
        );

        if (foundUser) {
          const { senha, ...userSemSenha } = foundUser;
          setAuth({ user: userSemSenha, isAuthenticated: true });
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

  // 🔹 LOGIN
  const signin = async (email: string, senha: string) => {
    const usersStorage = JSON.parse(localStorage.getItem("users_bd") || "[]");

    const foundUser = usersStorage.find(
      (user: { email: string }) => user.email === email
    );

    // ❌ Usuário não cadastrado
    if (!foundUser) {
      return "Usuário não cadastrado";
    }

    // ❌ Senha incorreta
    const senhaHash = await hashPassword(senha);

    if (foundUser.senha !== senhaHash) {
      return "Senha incorreta";
    }

    // ✅ Login correto
    const token = Math.random().toString(36).substring(2);
    localStorage.setItem("user_token", JSON.stringify({ email, token }));

    const { senha: _, ...userSemSenha } = foundUser;
    setAuth({ user: userSemSenha, isAuthenticated: true });

    return null;
  };

  // 🔹 CADASTRO
  const signup = async (
    nome: string,
    email: string,
    cep: string,
    endereco: string,
    senha: string
  ) => {
    const usersStorage = JSON.parse(localStorage.getItem("users_bd") || "[]");

    const foundUser = usersStorage.find(
      (user: { email: string }) => user.email === email
    );

    if (foundUser) {
      return "Usuário já cadastrado";
    }

    const senhaHash = await hashPassword(senha);
    const newUser = { nome, email, cep, endereco, senha: senhaHash };

    localStorage.setItem(
      "users_bd",
      JSON.stringify([...usersStorage, newUser])
    );

    return "Cadastro realizado com sucesso!";
  };

  // 🔹 LOGOUT
  const signout = () => {
    setAuth({ user: null, isAuthenticated: false });
    localStorage.removeItem("user_token");
  };


  return { auth, signin, signup, signout };
};

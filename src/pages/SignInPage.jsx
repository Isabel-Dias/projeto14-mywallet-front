import styled from "styled-components"
import { Link, useNavigate } from "react-router-dom"
import MyWalletLogo from "../components/MyWalletLogo"
import axios from "axios"
import { useState } from "react"
import UserContext from "../contexts/userContext"
import { useContext } from "react"

export default function SignInPage() {
  const [email, setEmail] = useState();
  const [password, setPassword] = useState();
  const { setUserData } = useContext(UserContext)

  const navigate = useNavigate();

  const user = {
    email,
    password
  }

  async function logIn(event) {
    
    event.preventDefault();

    try {
      const authData = await axios.post(`${import.meta.env.VITE_BASE_URL}/sign-in`, user);
      setUserData(authData.data);
      
      return navigate("/home")
    } catch (error) {
      if(error.response.status === 422){
        alert("email ou senha inválidos")
      }
      if(error.response.status === 404){
        alert("usuário não encontrado")
      }
      if(error.response.status === 401){
        alert("Senha inválida")
      }

      return console.log(error);
    }

  }

  return (
    <SingInContainer>
      <form onSubmit={logIn}>
        <MyWalletLogo />
        <input data-test="email" placeholder="E-mail" type="email" required onChange={e => setEmail(e.target.value)}/>
        <input data-test="password" placeholder="Senha" type="password" required onChange={e => setPassword(e.target.value)}/>
        <button data-test="sign-in-submit" type="submit" >Entrar</button>
      </form>

      <Link to="/cadastro">
        Primeira vez? Cadastre-se!
      </Link>
    </SingInContainer>
  )
}

const SingInContainer = styled.section`
  height: 100vh;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
`

import { Link, useNavigate } from "react-router-dom"
import styled from "styled-components"
import MyWalletLogo from "../components/MyWalletLogo"
import { useState } from "react"
import axios from "axios"

export default function SignUpPage() {
  const [name, setName] = useState();
  const [email, setEmail] = useState();
  const [password, setPassword] = useState();
  const [confirmPassword, setConfirmPassword] = useState();
  const navigate = useNavigate();

  const user = {
    name,
    email,
    password
  }

  async function signUp(event) {
  
    event.preventDefault();
    
    if(password !== confirmPassword) {
      return alert("Sua senha deve ser a mesma em ambos campos")
    }

    if(password.length < 3) {
      return alert("Sua senha deve ter no mínimo 3 caracteres")
    }
    
    try {
      await axios.post(`${import.meta.env.VITE_BASE_URL}/sign-up`, user)
      return navigate("/")
    } catch (error) {
      if(error.response.status === 422){
        alert("email, ou senha inválidos")
      }
      if(error.response.status === 409){
        alert("email, ou senha inválidos")
      }
      return console.log(error)
    }
  }
  
  return (
    <SingUpContainer>
      <form onSubmit={signUp}>
        <MyWalletLogo />
        <input data-test="name" placeholder="Nome" type="text" required onChange={e => setName(e.target.value)}/>
        <input data-test="email" placeholder="E-mail" type="email" required onChange={e => setEmail(e.target.value)}/>
        <input data-test="password" placeholder="Senha" type="password" required minLength="3" onChange={e => setPassword(e.target.value)}/>
        <input data-test="conf-password" placeholder="Confirme a senha" required minLength="3" type="password" onChange={e => setConfirmPassword(e.target.value)}/>
        <button data-test="sign-up-submit" type="submit" >Cadastrar</button>
      </form>

      <Link to="/">
        Já tem uma conta? Entre agora!
      </Link>
    </SingUpContainer>
  )
}

const SingUpContainer = styled.section`
  height: 100vh;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
`

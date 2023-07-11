import styled from "styled-components"
import { useParams, useNavigate } from "react-router"
import { useState, useContext, useEffect} from "react";
import axios from "axios";
import UserContext from "../contexts/userContext";


export default function newTransaction() {
  const [name, setName] = useState("");
  const [value, setValue] = useState("")
  const params = useParams();
  const { userData } = useContext(UserContext); 
  const navigate = useNavigate();
 

  useEffect(() => {
    async function userAuth(userData) {
      try {
        await axios.get(`${import.meta.env.VITE_BASE_URL}/transactions`, { headers: { authorization: `Bearer ${userData.token}` } })
        return

      } catch (error) {
        return navigate("/")
      }
    }
    userAuth(userData);
  }, [])
 
  async function newTransaction(event) {
    event.preventDefault();

    const type = params?.tipo == "entrada" ? "positivo" : "negativo"
    const positiveValue = value.replace("-","")
    const floatValue = parseFloat(positiveValue)

    const transaction = {
      name,
      value: floatValue,
      type
    }
    
   
    try {
      await axios.post(`${import.meta.env.VITE_BASE_URL}/transactions`, transaction, { headers: { authorization: `Bearer ${userData.token}`} })
      
      return navigate("/home")

    } catch (error) {
      if(error.response.status === 422){
        return alert("preencha todos os campos")
      }
      navigate("/")
      return console.log(error);
      
    }
  }
  
    return (
      <TransactionsContainer>
        <h1>Nova {params.tipo}</h1>
        <form onSubmit={newTransaction}>
          <input placeholder="Valor" type="text" required onChange={e => setValue(e.target.value)}/>
          <input placeholder="Descrição" type="text" required onChange={e => setName(e.target.value)}/>
          <button type="submit" >Salvar {params.tipo}</button>
        </form>
      </TransactionsContainer>
    )
  }

const TransactionsContainer = styled.main`
  height: calc(100vh - 50px);
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: flex-start;

  h1 {
    align-self: flex-start;
    margin-bottom: 40px;
  }
`

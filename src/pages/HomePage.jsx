import styled from "styled-components"
import { BiExit } from "react-icons/bi"
import { AiOutlineMinusCircle, AiOutlinePlusCircle } from "react-icons/ai"
import UserContext from "../contexts/userContext";
import { useContext, useEffect, useState } from "react";
import axios from "axios";
import { useNavigate, useParams } from "react-router";
import { Link } from "react-router-dom";

export default function HomePage() {
  const { userData, setUserData } = useContext(UserContext);
  const [transactions, setTransactions] = useState([]);
  const [userName, setUserName] = useState("");

  const navigate = useNavigate();
  const params = useParams();

  useEffect(() => {
    async function userAuth(userData) {
      try {
        const userInfo = await axios.get(`${import.meta.env.VITE_BASE_URL}/transactions`, { headers: { authorization: `Bearer ${userData.token}` } })

        setTransactions(userInfo.data.transactions);
        setUserName(userInfo.data.name);
        
        return

      } catch (error) {
        return navigate("/")
      }
    }
    userAuth(userData);
  }, [])

  function calculateTotal() {
    return transactions.reduce((previus, current) => {
      if (current.type === "positivo") {
        return previus + current.value;
      }
      return previus - current.value
    }, 0)
  };
  function logOut() {
    setUserData(undefined);
    navigate("/")
  }
  const total = calculateTotal()
  return (
    <HomeContainer>
      <Header>
        <h1>Olá, {userName}</h1>
        <BiExit onClick={logOut} />
      </Header>

      <TransactionsContainer>
        <ul>
          {transactions.length === 0 ? "Não há registros de entrada ou saída" : transactions.map((transaction, index) => {
            return (
              <ListItemContainer key={index}>
                <div>
                  <span>{transaction.date}</span>
                  <strong>{transaction.name}</strong>
                </div>
                <Value style={{color: transaction.type == "positivo" ? "green" : "red"}}>{transaction.value}</Value>
              </ListItemContainer>
            )
          }
          )}
        </ul>

        <article>
          <strong>Saldo</strong>
          <Value style={{color: total <= 0 ? "red" : "green"}}>{total}</Value>
        </article>
      </TransactionsContainer>


      <ButtonsContainer>
        <button>
          <Link to={`/nova-transacao/${"entrada"}`}>
            <AiOutlinePlusCircle />
            <p>Nova <br /> entrada</p>
          </Link>
        </button>
        <button>
          <Link to={`/nova-transacao/${"saída"}`}>
            <AiOutlineMinusCircle />
            <p>Nova <br />saída</p>
          </Link>
        </button>
      </ButtonsContainer>

    </HomeContainer>
  )
}


const HomeContainer = styled.div`
  display: flex;
  flex-direction: column;
  height: calc(100vh - 50px);
`
const Header = styled.header`
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0 2px 5px 2px;
  margin-bottom: 15px;
  font-size: 26px;
  color: white;
`
const TransactionsContainer = styled.article`
  flex-grow: 1;
  background-color: #fff;
  color: #000;
  border-radius: 5px;
  padding: 16px;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  article {
    display: flex;
    justify-content: space-between;   
    strong {
      font-weight: 700;
      text-transform: uppercase;
    }
  }

  ul {
    overflow: auto;
  }
`
const ButtonsContainer = styled.section`
  margin-top: 15px;
  margin-bottom: 0;
  display: flex;
  gap: 15px;
  
  button {
    width: 50%;
    height: 115px;
    font-size: 22px;
    text-align: left;
    display: flex;
    flex-direction: column;
    justify-content: space-between;
    p {
      font-size: 18px;
    }
  }
`
const ListItemContainer = styled.li`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 8px;
  color: #000000;
  margin-right: 10px;
  div span {
    color: #c6c6c6;
    margin-right: 10px;
  }
`

const Value = styled.div`
  font-size: 16px;
  text-align: right;
`

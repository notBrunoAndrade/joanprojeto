import { GoXCircleFill, GoPencil } from "react-icons/go"
import { api } from "./services/api"
import { useEffect, useState, useRef, FormEvent } from "react"

interface ClientesProps {
  id: string
  nome: string
  email: string
  telefone: string
  cidade: string
  deleted?: boolean // Marca se o usuário foi deletado visualmente
}

function App() {
  const [users, setUsers] = useState<ClientesProps[]>([])
  const [editingUserId, setEditingUserId] = useState<string | null>(null)
  const nameRef = useRef<HTMLInputElement | null>(null)
  const numberRef = useRef<HTMLInputElement | null>(null)
  const emailRef = useRef<HTMLInputElement | null>(null)
  const cityRef = useRef<HTMLInputElement | null>(null)

  useEffect(() => {
    loadRegister()
  }, [])

  async function loadRegister() {
    const response = await api.get('/clientes')
    setUsers(response.data)
  }

  async function handleSubmit(event: FormEvent) {
    event.preventDefault()

    if (!nameRef.current?.value || !numberRef.current?.value || !emailRef.current?.value || !cityRef.current?.value) return

    if (editingUserId) {
      // Atualiza o usuário existente
      const updatedUser = {
        id: editingUserId,
        nome: nameRef.current.value,
        email: emailRef.current.value,
        telefone: numberRef.current.value,
        cidade: cityRef.current.value
      }

      await api.put(`clientes/${editingUserId}`, updatedUser)
      setUsers(users.map(user => (user.id === editingUserId ? updatedUser : user)))
      setEditingUserId(null) // Limpa o ID do usuário em edição
    } else {
      // Cadastra um novo usuário
      const response = await api.post("clientes", {
        nome: nameRef.current.value,
        email: emailRef.current.value,
        telefone: numberRef.current.value,
        cidade: cityRef.current.value
      })

      setUsers(allUsers => [...allUsers, response.data])
    }

    // Limpa os campos após a ação
    nameRef.current.value = ''
    numberRef.current.value = ''
    emailRef.current.value = ''
    cityRef.current.value = ''
  }

  const handleEdit = (user: ClientesProps) => {
    setEditingUserId(user.id)
    nameRef.current!.value = user.nome
    numberRef.current!.value = user.telefone
    emailRef.current!.value = user.email
    cityRef.current!.value = user.cidade
  }

  const handleDelete = (id: string) => {
    setUsers(users.map(user => user.id === id ? { ...user, deleted: true } : user))
  }

  return (
    <>
      <main>
        <h1>Cadastro de Usuários</h1>
        <form onSubmit={handleSubmit}>
          <input type="text" placeholder="Digite seu nome completo" ref={nameRef} />
          <input type="number" placeholder="Digite seu número de telefone" ref={numberRef} />
          <input type="text" placeholder="Digite sua cidade" ref={cityRef} />
          <input type="email" placeholder="Digite seu email" ref={emailRef} />
          <button type="submit" className="button-register">{editingUserId ? 'Atualizar' : 'Cadastrar'}</button>
        </form>
      </main>

      <table>
        <thead>
          <tr>
            <th>Nome</th>
            <th>Email</th>
            <th>Número de Celular</th>
            <th>Cidade</th>
            <th>Ações</th>
          </tr>
        </thead>
        <tbody>
          {users.filter(user => !user.deleted).map((clientes) => (
            <tr key={clientes.id}>
              <td>{clientes.nome}</td>
              <td>{clientes.email}</td>
              <td>{clientes.telefone}</td>
              <td>{clientes.cidade}</td>
              <td className="edit-delete">
                <button onClick={() => handleDelete(clientes.id)}>
                  <GoXCircleFill className='i' style={{ color: 'red', fontSize: 28, cursor: "pointer" }} />
                </button>
                <button onClick={() => handleEdit(clientes)}>
                  <GoPencil className='i' style={{ color: 'green', fontSize: 28, cursor: "pointer" }} />
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </>
  )
}

export default App


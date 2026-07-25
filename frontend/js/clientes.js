// endereço da nossa API backend
const API = 'http://127.0.0.1:8000'

// elementos do formulário e do botão de enviar
const formCliente = document.getElementById('form-cliente')
const botaoSubmit = document.getElementById('btn-submit-cliente')

// limpa o formulário e devolve o botão para o modo de cadastro
function limparFormulario() {
  formCliente.reset() // reseta todos os campos do formulário
  delete formCliente.dataset.idCliente // remove o id de edição, voltando para modo cadastro
  botaoSubmit.textContent = 'Cadastrar' // muda o texto do botão
  botaoSubmit.classList.remove('btn-success')
  botaoSubmit.classList.add('btn-primary')
}

async function listarClientes() {
  const resposta = await fetch(`${API}/clientes`)
  const clientes = await resposta.json()

  const corpo = document.getElementById('corpo-tabela')
  corpo.innerHTML = ''

  clientes.forEach(c => {
    corpo.innerHTML += `
      <tr>
        <td>${c.idcliente}</td>
        <td>${c.nome}</td>
        <td>${c.cpf}</td>
        <td>${c.telefone ?? '-'}</td>
        <td>${c.cidade ?? '-'}</td>
        <td>${c.uf ?? '-'}</td>
        <td>
          <button class="btn btn-sm btn-warning me-2" onclick='preencherFormularioEdicao(${JSON.stringify(c)})'>Editar</button>
          <button class="btn btn-sm btn-danger" onclick="deletarCliente(${c.idcliente})">Excluir</button>
        </td>
      </tr>`
  })
}

listarClientes()

//Cadastrar e atualizar clientes

formCliente.addEventListener('submit', async (e) => {
  e.preventDefault() // evita que o navegador recarregue a página quando o formulário for enviado

  const cliente = {
    nome: document.getElementById('nome').value,
    cpf: document.getElementById('cpf').value,
    telefone: document.getElementById('telefone').value || null,
    datacadastro: new Date().toISOString().split('T')[0], // data de cadastro no formato yyyy-mm-dd
    cidade: document.getElementById('cidade').value || null,
    uf: document.getElementById('uf').value || null
  }

  // se existir idCliente no dataset, estamos editando um cliente já existente
  const idCliente = formCliente.dataset.idCliente

  if (idCliente) {
    // atualizar cliente existente usando PUT
    await fetch(`${API}/clientes/${idCliente}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(cliente)
    })
  } else {
    // cadastrar novo cliente usando POST
    await fetch(`${API}/clientes`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(cliente)
    })
  }

  limparFormulario() // volta o formulário para o modo de cadastro
  listarClientes() // atualiza a tabela com o cliente criado ou alterado
})

function preencherFormularioEdicao(cliente) {
  // coloca os dados do cliente nos campos do formulário
  document.getElementById('nome').value = cliente.nome
  document.getElementById('cpf').value = cliente.cpf
  document.getElementById('telefone').value = cliente.telefone || ''
  document.getElementById('cidade').value = cliente.cidade || ''
  document.getElementById('uf').value = cliente.uf || ''

  // guarda o id do cliente no dataset do formulário para saber que será edição
  formCliente.dataset.idCliente = cliente.idcliente

  // muda o botão para indicar que agora ele salva a alteração
  botaoSubmit.textContent = 'Salvar alteração'
  botaoSubmit.classList.remove('btn-primary')
  botaoSubmit.classList.add('btn-success')
}

async function deletarCliente(id) {
  if (!confirm('Tem certeza que deseja excluir este cliente?')) return

  await fetch(`${API}/clientes/${id}`, { method: 'DELETE' })
  listarClientes()
}
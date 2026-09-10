# Guia de Criação das Aulas

Este documento descreve o padrão usado para escrever cada arquivo em `aulas/aula_XX_tema.md`. Ele existe pra que esse padrão não se perca — seja porque a professora está numa máquina diferente, seja porque quem está ajudando a escrever a próxima aula (incluindo um assistente de IA) precisa de contexto.

> Diferença importante: este arquivo é sobre **como escrever uma aula**. O [REGRAS.md](REGRAS.md) é sobre **como escrever o código** que a aula ensina. São públicos diferentes — este aqui é da autora do curso, o outro é do aluno.

---

## Como uma aula nasce

1. **Discutir antes de escrever.** A estrutura da aula — quais conceitos entram, como dividir em partes, decisões de escopo (ex: "isso vira uma aula própria ou fica junto com a outra?", "reescrevemos uma rota existente ou criamos uma nova?") — é definida em conversa, **antes** de qualquer arquivo `.md` ser escrito.
2. **Escrever o `.md` só quando confirmado.** Só depois que a estrutura estiver definida e aprovada, o arquivo da aula é escrito.
3. **Testar manualmente.** O código correspondente à aula é escrito e testado à mão (não por IA), comparando com o que o `.md` pede.
4. **Ajustar pontualmente.** Bugs reais encontrados no teste, ou pedidos de mudança (um exemplo de JSON, um texto de aviso), viram edições pontuais no `.md` já existente — não reescritas do zero.

Se um assistente de IA estiver ajudando: ele **não deve criar nem editar arquivos de código** (`backend/`, `frontend/`) por conta própria — só o conteúdo das aulas, e só depois de discutir a estrutura em conversa.

---

## Estrutura de toda aula

Nessa ordem:

1. `# Aula N — Título curto`
2. `## Antes de começar — relembrando o ambiente` (ver seção própria abaixo)
3. `## O que vamos fazer nessa aula` — lista numerada
4. `## Parte N — Título`, uma de cada vez, separadas por `---` — cada parte deve ensinar e testar **uma coisa só** (uma rota, uma função), nunca várias de uma vez
5. `## Erros comuns`
6. `## Estrutura do projeto até agora` — árvore de pastas atualizada, marcando o que é novo/atualizado
7. `## Próxima aula` — 1-2 frases sobre o que vem a seguir

### Dentro de cada Parte

- Bloco de código comentado, seguindo as convenções do `REGRAS.md`
- **Teste:** em negrito logo depois do código, dizendo exatamente o que checar (uma rota no `/docs`, uma tela no navegador)
- `>` blockquote pra explicar o "porquê" de uma decisão não óbvia (por que o banco aplica um valor sozinho, por que uma rota não precisa de tratamento de erro que outra precisa, etc.)
- Tabela comparando "o que já vimos" com "o que é novo nessa aula", quando o conceito permitir
- Analogia do mundo real pra introduzir um conceito abstrato (API = garçom de restaurante; chave estrangeira = campo "Estado" de um cadastro)

### Ao pedir pra editar uma função que já existe (não criar uma nova)

Quando uma instrução for do tipo "ajuste só a função X que já existe", **nunca mostrar apenas o bloco de código novo sem avisar explicitamente que ele substitui o antigo**. Isso já causou um bug real: o aluno colou a função nova do lado da antiga em vez de apagar e substituir, resultando numa rota duplicada e empurrando/apagando sem querer uma rota vizinha (aconteceu na Aula 9, com `criar_agendamento` empurrando o `GET /agendamentos` pra fora do arquivo).

Sempre que isso acontecer, incluir um aviso tipo:
> **Atenção pra não duplicar:** apague a função inteira antiga antes de colar a nova no lugar. Se preferir mais seguro, edite só as linhas que realmente mudaram, direto na função existente, em vez de apagar tudo.

### Exemplo de JSON para testar

Sempre que o corpo de um `POST`/`PUT` tiver um campo de **chave estrangeira**, incluir uma subseção `### Exemplo de JSON para testar` com:

1. Aviso de que aquele campo só funciona com um ID que já existe de verdade — sugerir checar via `GET` na tabela referenciada antes de testar
2. Um JSON válido, usando os dados de exemplo que vêm da Aula 2
3. Uma nota do que acontece se o ID usado não existir (erro — e por quê)

**No exemplo do `PUT`, os valores precisam ser visivelmente diferentes do exemplo do `POST`** (outra data, outro valor, etc.) — nunca só copiar o mesmo JSON e acrescentar um campo. Isso já causou confusão numa revisão real ("o que você mudou nesse JSON? parece que ficou igual ao outro?") — o exemplo precisa deixar claro que representa uma atualização de verdade, não uma cópia.

### Lembrete de salvar o banco

Sempre que a aula gerar dados de teste novos (cadastros, edições), reforçar isso perto do fim com um `>` blockquote — não uma linha solta — explicando a consequência concreta: se não exportar, os dados somem e a próxima aula começa sem nada pra testar.

### A seção "Antes de começar — relembrando o ambiente"

Presente a partir da Aula 4 (primeira aula com algo pra rodar). O que entra nela cresce conforme o curso avança:

| Item | A partir de quando |
|---|---|
| Importar o banco de novo | Aula 5 (quando o banco passa a ser usado pela primeira vez) |
| Recriar o arquivo `.env` | Aula 6 (na Aula 5 ele é criado como conteúdo da própria aula) |
| Recriar/ativar o venv | Aula 4 |
| Reinstalar dependências | Aula 4 |
| Rodar o uvicorn | Só quando a API daquela aula já existe de uma aula anterior |

Aviso extra sobre o `uvicorn --reload` não detectar um arquivo de rota **novo** (`rotas/algumacoisa.py`) criado com o servidor já ligado: incluir **só nas aulas que criam um arquivo de rota novo**. Não incluir em aulas que só editam arquivos já existentes — o `--reload` funciona normalmente pra edição.

---

## Convenção de nome de arquivo

```
aulas/aula_NN_tema_curto.md
```

Minúsculo, tema resumido (não o título completo da aula): `crud_clientes`, `frontend_clientes`, `crud_tatuadores`, `crud_agendamentos`, `upload_imagem`.

---

## Roadmap

A lista atualizada de aulas (feitas e planejadas) vive em `REGRAS.md`, seção "Ordem de desenvolvimento" — mantenha os dois arquivos sincronizados quando uma aula nova for criada ou o plano mudar.

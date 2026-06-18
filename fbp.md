# Projeto: API de Análise de Aptidão Paranormal

## Contexto

Uma agência governamental (Federal Bureau of Paranormal Activities - FBP) secreta realiza testes de aptidão paranormal em seus funcionários. Os funcionários já sabem se têm ou não habilidades — o teste mede o **nível** dessa aptidão em uma escala contínua de **0 a 5**, onde 0 significa ausência total de aptidão e 5 representa o nível máximo registrado.

O objetivo da API é, dado o perfil de um funcionário, **prever seu nível de aptidão** e retornar uma **faixa de incerteza (IC)** dessa previsão.

---

## Variáveis do Funcionário

### Biológicas
| Variável | Tipo | Descrição |
|---|---|---|
| Sexo | Categórico | Masculino / Feminino |
| Idade | Numérico | Idade atual em anos |
| Lateralidade | Categórico | Canhoto / Destro |
| Histórico familiar de aptidão | Categórico | Sim / Não — parente com aptidão confirmada |

### Exposição
| Variável | Tipo | Descrição |
|---|---|---|
| Número de missões em campo paranormal | Numérico | Total de missões realizadas |
| Tempo de serviço na agência | Numérico | Anos de serviço |
| Exposição a artefatos classificados | Numérico | Número de artefatos com os quais teve contato |

### Evento de Origem
| Variável | Tipo | Descrição |
|---|---|---|
| Contato com evento anômalo | Categórico | Sim / Não |
| Idade do primeiro contato | Numérico | Idade quando ocorreu o primeiro contato (0 se nunca teve) |

---

## Variável Alvo

| Variável | Tipo | Descrição |
|---|---|---|
| Nível de aptidão | Numérico contínuo (0–5) | Score do teste de aptidão paranormal |

---

## Técnicas de Inferência Utilizadas

### 1. Teste de Permutação
**Objetivo:** verificar quais variáveis realmente impactam o nível de aptidão de forma estatisticamente significativa — e não por acaso.

**Como funciona:** para cada variável de interesse (ex: histórico familiar), o teste embaralha aleatoriamente os valores dessa variável entre os funcionários mil vezes e mede a diferença gerada. Se a diferença observada nos dados reais for rara nesse cenário aleatório, a variável é considerada relevante.

**Perguntas que responde:**
- Funcionários com histórico familiar têm aptidão maior de verdade?
- Ter tido contato com evento anômalo realmente eleva o nível?
- Canhotos pontuam diferente de destros?

### 2. Regressão Linear Múltipla
**Objetivo:** aprender a relação entre as 9 variáveis do funcionário e o nível de aptidão, e usar esse modelo para fazer previsões.

**Como funciona:** o modelo é treinado com os dados históricos dos funcionários já testados. Ele aprende o peso (coeficiente) de cada variável — ex: *"cada artefato adicional com o qual o funcionário teve contato adiciona 0.3 pontos no nível esperado"*.

**Pré-processamento necessário:** variáveis categóricas (sexo, lateralidade, histórico familiar, contato anômalo) precisam ser convertidas em variáveis dummy (0/1) antes de entrar no modelo.

**O que entrega:**
- Previsão pontual do nível de aptidão (ex: 3.4)
- Coeficientes de cada variável (o que mais impacta o nível)
- R² — qualidade geral do modelo

### 3. Bootstrap
**Objetivo:** gerar o Intervalo de Confiança (IC) da previsão sem depender de suposições sobre a distribuição dos dados.

**Como funciona:** reamostra os dados da agência centenas ou milhares de vezes com reposição, treina uma regressão em cada reamostragem, e coleta a previsão para o funcionário alvo em cada iteração. O IC é formado pelo percentil 2.5% e 97.5% dessas previsões.

**O que entrega:**
- Faixa de incerteza da previsão (ex: nível entre 2.8 e 4.1 com 95% de confiança)
- Mais robusto que o IC clássico, especialmente quando os dados são assimétricos ou o número de funcionários testados é pequeno

---

## Fluxo da Aplicação

```
Dados históricos dos funcionários (variáveis → nível de aptidão)
        ↓
Teste de Permutação
→ identifica quais variáveis têm impacto estatisticamente real
        ↓
Regressão Linear Múltipla
→ treina o modelo e gera a previsão pontual para um novo funcionário
        ↓
Bootstrap
→ gera o IC da previsão (faixa de incerteza)
        ↓
Resultado final:
  - Nível previsto: 3.4
  - IC 95%: [2.8, 4.1]
  - Variáveis mais relevantes (pelo teste de permutação)
  - Coeficientes da regressão
```

---

## Endpoints sugeridos para a FastAPI

| Método | Endpoint | Descrição |
|---|---|---|
| POST | `/treinar` | Recebe os dados históricos e treina o modelo |
| POST | `/prever` | Recebe o perfil de um funcionário e retorna previsão + IC bootstrap |
| GET | `/modelo` | Retorna R², coeficientes e relevância das variáveis |
| GET | `/permutacao` | Retorna quais variáveis são estatisticamente significativas |
| GET | `/graficos/{tipo}` | Retorna um gráfico (regressão, bootstrap, dispersão) |

---

## Gráficos sugeridos

- **Reta de regressão** com faixa bootstrap sombreada
- **Histograma bootstrap** das previsões geradas com os limites do IC marcados
- **Dispersão dos funcionários** com o funcionário previsto destacado
- **Gráfico de importância das variáveis** (coeficientes da regressão em barras horizontais)

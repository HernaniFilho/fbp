# FBP — Federal Bureau of Paranormal Activities

> Sistema completo de gestão, avaliação e alocação de agentes paranormais. Combina **FastAPI**, **React (TanStack)** e **Machine Learning** para tomada de decisão baseada em dados.

---

## Stack

| Camada        | Tecnologia                                                        |
| ------------- | ----------------------------------------------------------------- |
| **Frontend**  | React + TypeScript + TanStack Router + TanStack Query + shadcn/ui |
| **Backend**   | FastAPI + SQLAlchemy + PostgreSQL                                 |
| **ML / Data** | scikit-learn · numpy · pandas                                     |
| **Deploy**    | Docker + Docker Compose                                           |

---

## Funcionalidades

### 1. Gestão de Agentes (Staff)

CRUD completo de funcionários com campos paranormais:

- Dados pessoais e biológicos (`sex`, `age`, `handedness`, `hasParanormalParent`)
- Histórico operacional (Exposição) (`numberOfMissions`, `serviceTime`)
- Traços paranormais (Paranormal Events) (`hadParanormalEvent`, `typeOfFirstParanormalEvent`)

### 2. Avaliação de Nível Paranormal — Regressão Linear

Prediz o `paranormalLevel` (0–100) de um agente com base em suas características.

**Pipeline:**

```
Dados do agente
    ↓
Imputação (SimpleImputer)
    ↓
One-Hot Encoding (sex, handedness, eventType)
    ↓
StandardScaler (features numéricas)
    ↓
LinearRegression
    ↓
paranormalLevel (0–100)
```

> _Exemplo: agentes canhotos têm nível 20% maior; eventos do tipo `place`/`entity` aumentam 80%._

### 3. Classificação de Missões — Regressão Logística (Ideias Futuras)

Classifica missões em categorias ordinais:

- **Periculosidade**: `BAIXA` | `MÉDIA` | `ALTA`
- **Chance de Sucesso**: `BAIXA` | `MÉDIA` | `ALTA`

**Abordagem:** Regressão Logística Ordinal (ou One-vs-Rest) com features da missão + perfil médio da equipe alocada.

### 4. Alocação Inteligente de Agentes (Ideias Futuras)

Recomenda a melhor equipe para uma missão com base no histórico.

**Candidatos técnicos:**

- **Aprendizado de Máquina**: modelo de _ranking_ (ex: XGBoost LambdaMART) que aprende padrões de sucesso por tipo de missão.
- **LLM + RAG**: embeddings do histórico de missões + prompt engineering para justificar a escolha da equipe.

---

## Como rodar

### Pré-requisitos

- Docker + Docker Compose
- Python 3.12 (para rodar scripts localmente)

### Subir a aplicação

```bash
# 1. Clone e entre no diretório
git clone <repo>
cd fbp

# 2. Configure o .env backend e frontend (exemplo)
cd frontend
cp .env.example .env

cd backend
cp .env.example .env

# 3. Suba tudo (banco + backend)
cd backend
docker compose up --build

# 4. Rode o frontend
cd frontend
npm run dev
```

O backend sobe em `http://localhost:8000` com:

- Auto-seed do banco (se vazio)
- Auto-train do modelo (se não existir)
- Hot-reload ativo

O frontend sobe em `http://localhost:3000`

### Scripts úteis

```bash
# Forçar re-seed e re-treino
FORCE_SEED=true FORCE_TRAIN=true docker compose up

# Rodar seed manualmente
docker compose exec fbp-backend python -m src.features.staff.scripts.seed_staff

# Rodar treinamento manualmente
docker compose exec fbp-backend python -m src.features.ml.train
```

---

## Roadmap de ML

| Fase    | Técnica                     | Status  | Descrição                                     |
| ------- | --------------------------- | ------- | --------------------------------------------- |
| **1**   | Regressão Linear            | Feito   | Prediz `paranormalLevel` (0–100)              |
| **1.1** | Permutation Importance      | A fazer | Identifica features mais influentes           |
| **1.2** | Bootstrap CI                | A fazer | Intervalo de confiança dos coeficientes       |
| **2**   | Regressão Logística Ordinal | A fazer | Classifica missões (periculosidade / sucesso) |
| **3**   | Ranking / Recommendation    | A fazer | Aloca agentes ótimos por tipo de missão       |
| **3.1** | XGBoost / LightGBM          | A fazer | Modelo de ranking com histórico               |
| **3.2** | LLM + RAG                   | A fazer | Justificativa textual da alocação             |

---

## Seed & Distribuições

O script `seed_staff.py` usa **distribuições estatísticas** para gerar dados realistas:

| Campo              | Distribuição             | Parâmetros                                                         |
| ------------------ | ------------------------ | ------------------------------------------------------------------ |
| `age`              | Normal                   | `μ=35, σ=8`                                                        |
| `serviceTime`      | Normal                   | `μ=age-25, σ=4`                                                    |
| `numberOfMissions` | Poisson                  | `λ=3`                                                              |
| `handedness`       | Categórico               | `right: 80%`, `left: 10%`, `ambidextrous: 5%`, `not_specified: 5%` |
| `paranormalLevel`  | Normal + Multiplicadores | Base `μ=50, σ=20` × fatores por enum                               |

**Multiplicadores de `paranormalLevel`:**

- `Handedness.left` → ×1.20
- `Handedness.ambidextrous` → ×1.35
- `Handedness.not_specified` → ×1.50
- `Sex.not_specified` → ×1.40
- `ParanormalEventType.artefact/spontaneous` → ×1.20
- `ParanormalEventType.place/entity` → ×1.80
- `ParanormalEventType.not_specified` → ×1.60

---

## Licença

MIT © 2026 Federal Bureau of Paranormal Activities

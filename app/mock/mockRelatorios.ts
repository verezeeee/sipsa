export const mockRelatorios = {
  "alert": {
    "level": "Vermelho",
    "messages": [
      "A previsão semanal de alto risco para a região Oeste nos próximos 90 dias. Principalmente ligados a regiões altas em chuvas e baixa execução de água.",
      "A IA detectou uma taxa de transmissão (Rt) de 2.4 na Zona Norte. A projeção indica crescimento exponencial de casos nas próximas 3 semanas, com maior risco observado nas unidades de saúde locais.",
      "A IA identificou um padrão de chuvas e temperatura favorável à eclosão de ovos de vetor na Região Norte para os próximos 45 dias.",
      "Previsão de aumento de 20% na densidade larvária na Região Sul nas próximas semanas."
    ]
  },

  "riskOverview": {
    "complicacoesPulmonares": {
      "score": 0.72,
      "value": 72,
      "level": "ALTO"
    },
    "sintomasInflamatorios": {
      "score": 0.40,
      "value": 40,
      "level": "MODERADO"
    },
    "retencaoLiquidos": {
      "score": 0.31,
      "value": 31,
      "level": "BAIXO"
    },
    "hemorragias": {
      "score": 0.05,
      "value": 5,
      "level": "BAIXO"
    },
    "metadata": {
      "amostra": "Válida",
      "nivelConfianca": "91%",
      "margemErro": "±5%"
    }
  },

  "chartPrevisaoCasos": {
    "regiao": "Oeste Potiguar",
    "valores": [
      { "cidade": "Almino Afonso", "valor": 184 },
      { "cidade": "Apodi", "valor": 190 },
      { "cidade": "Caraúbas", "valor": 177 },
      { "cidade": "Felipe Guerra", "valor": 165 },
      { "cidade": "Gov. Dix-Sept Rosado", "valor": 172 },
      { "cidade": "Itaú", "valor": 181 },
      { "cidade": "Janduís", "valor": 168 },
      { "cidade": "Lucrécia", "valor": 174 },
      { "cidade": "Martins", "valor": 189 },
      { "cidade": "Mossoró", "valor": 200 },
      { "cidade": "Patu", "valor": 170 },
      { "cidade": "Riacho da Cruz", "valor": 160 },
      { "cidade": "Serrinha dos Pintos", "valor": 158 },
      { "cidade": "Umarizal", "valor": 175 },
      { "cidade": "Viçosa", "valor": 169 }
    ]
  },

  "modelPerformance": {
    "acuraciaGlobal": 0.94,
    "sensibilidade": 0.97,
    "falsoNegativos": 0.02,
    "dataAtualizacao": "01/12/2025"
  },

  "seasonalidadeRisco2026": {
    "legend": {
      "high": "70% a 100%",
      "medium": "30% a 69%",
      "low": "0% a 29%"
    },
    "months": {
      "Jan": [
        { "day": 1, "risk": "low" },
        { "day": 2, "risk": "medium" },
        { "day": 3, "risk": "high" }
      ],
      "Feb": [
        { "day": 1, "risk": "medium" },
        { "day": 2, "risk": "high" },
        { "day": 3, "risk": "low" }
      ],
      "Mar": [
        { "day": 1, "risk": "low" },
        { "day": 2, "risk": "low" },
        { "day": 3, "risk": "medium" }
      ],
      "Apr": [
        { "day": 1, "risk": "medium" },
        { "day": 2, "risk": "high" }
      ],
      "May": [
        { "day": 1, "risk": "low" },
        { "day": 2, "risk": "medium" }
      ],
      "Jun": [
        { "day": 1, "risk": "medium" },
        { "day": 2, "risk": "high" }
      ],
      "Jul": [
        { "day": 1, "risk": "low" },
        { "day": 2, "risk": "medium" }
      ],
      "Aug": [
        { "day": 1, "risk": "medium" },
        { "day": 2, "risk": "high" }
      ],
      "Sep": [
        { "day": 1, "risk": "high" },
        { "day": 2, "risk": "high" }
      ],
      "Oct": [
        { "day": 1, "risk": "medium" },
        { "day": 2, "risk": "low" }
      ],
      "Nov": [
        { "day": 1, "risk": "high" },
        { "day": 2, "risk": "high" }
      ],
      "Dec": [
        { "day": 1, "risk": "medium" },
        { "day": 2, "risk": "low" }
      ]
    }
  }
}

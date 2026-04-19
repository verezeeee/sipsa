// types (optional)
export type WeatherCondition = "clear" | "rain" | "cloudy" | "storm";

export interface HourlyForecast {
  label: string;        // "Agora", "19:00"...
  hour: string;
  temperature: number;
  condition: WeatherCondition;
}

export interface WeatherBlock {
  location: string;
  temperature: number;
  conditionLabel: string;
  condition: WeatherCondition;
  max: number;
  min: number;
  feelsLike: number;
  hourly: HourlyForecast[];
}

export interface AlertCard {
  id: string;
  level: "high" | "medium" | "low";
  title: string;
  icon: string;
  description: string;
  footer: string;
}

export interface MapBubble {
  id: string;
  city: string;
  lat: number;
  lng: number;
  dengue: number;
  zika: number;
  chikungunya: number;
}

export interface DiseaseSummaryCard {
  id: string;
  disease: string;
  total: number;
}

export interface DemographicBreakdown {
  group: "Homens" | "Mulheres" | "Crianças" | "Idosos";
  dengue: number;
  zika: number;
  chikungunya: number;
}

export interface ConfirmedCasesPoint {
  index: number;          // e.g. day or week
  value: number;
}

export interface DashboardData {
  weather: WeatherBlock;
  alerts: AlertCard[];
  map: {
    center: { lat: number; lng: number };
    zoom: number;
    bubbles: MapBubble[];
  };
  diseaseForecast: {
    summaryCards: DiseaseSummaryCard[];
    demographic: DemographicBreakdown[];
  };
  confirmedCases: {
    title: string;
    series: ConfirmedCasesPoint[];
    regions: string[]; // labels below the chart
  };
}

// MOCK DATA

export const dashboardMock: DashboardData = {
  weather: {
    location: "Mossoró - RN",
    temperature: 10,
    conditionLabel: "Limpo",
    condition: "clear",
    max: 12,
    min: 9,
    feelsLike: 8,
    hourly: [
      { label: "Agora", hour: "18:00", temperature: 10, condition: "clear" },
      { label: "19:00", hour: "19:00", temperature: 11, condition: "rain" },
      { label: "20:00", hour: "20:00", temperature: 12, condition: "rain" },
      { label: "21:00", hour: "21:00", temperature: 10, condition: "rain" },
      { label: "22:00", hour: "22:00", temperature: 11, condition: "rain" },
      { label: "23:00", hour: "23:00", temperature: 12, condition: "cloudy" },
      { label: "19:00", hour: "00:00", temperature: 11, condition: "rain" },
    ],
  },

  alerts: [
    {
      id: "high-risk",
      level: "high",
      icon: "/icons/warning.png",
      title: "Alto Risco",
      description: "Alta de casos de dengue em Mossoró",
      footer: "320% a mais que mês passado",
    },
    {
      id: "rain-alert",
      level: "medium",
      icon: "/icons/alert.png",
      title: "Alerta",
      description: "Previsão de chuvas intensas na região leste",
      footer: "Previsão de aumento de larvas e ovos Aedes",
    },
    {
      id: "low-risk",
      level: "low",
      icon: "/icons/shield.png",
      title: "Baixo Risco",
      description:
        "Cidade de Touros não registrou nenhum caso de arbovirose em 15 dias",
      footer: "Monitoramento mantido",
    },
  ],

  map: {
    center: { lat: -5.79, lng: -36.60 }, // Rio Grande do Norte approx
    zoom: 7,
    bubbles: [
      {
        id: "mossoro",
        city: "Mossoró",
        lat: -5.187,
        lng: -37.344,
        dengue: 480,
        zika: 120,
        chikungunya: 40,
      },
      {
        id: "natal",
        city: "Natal",
        lat: -5.794,
        lng: -35.211,
        dengue: 350,
        zika: 80,
        chikungunya: 25,
      },
      {
        id: "pau-dos-ferros",
        city: "Pau dos Ferros",
        lat: -6.103,
        lng: -38.207,
        dengue: 160,
        zika: 40,
        chikungunya: 10,
      },
      {
        id: "caico",
        city: "Caicó",
        lat: -6.459,
        lng: -37.097,
        dengue: 210,
        zika: 55,
        chikungunya: 18,
      },
      {
        id: "assu",
        city: "Assu",
        lat: -5.576,
        lng: -36.910,
        dengue: 140,
        zika: 30,
        chikungunya: 12,
      },
      {
        id: "touros",
        city: "Touros",
        lat: -5.198,
        lng: -35.462,
        dengue: 0,
        zika: 0,
        chikungunya: 0,
      },
    ],
  },

  diseaseForecast: {
    summaryCards: [
      { id: "dengue", disease: "Dengue", total: 1024 },
      { id: "zika", disease: "Zika", total: 399 },
      { id: "chikungunya", disease: "Chikungunya", total: 73 },
    ],
    demographic: [
      { group: "Homens", dengue: 30, zika: 18, chikungunya: 8 },
      { group: "Mulheres", dengue: 45, zika: 22, chikungunya: 11 },
      { group: "Crianças", dengue: 28, zika: 15, chikungunya: 6 },
      { group: "Idosos", dengue: 38, zika: 20, chikungunya: 9 },
    ],
  },

  confirmedCases: {
    title: "Casos Confirmados",
    regions: ["Oeste Potiguar", "Central Potiguar", "Agreste Potiguar", "Leste Potiguar"],
    // simple upward-trending mock series (e.g. 30 weeks)
    series: [
      { index: 1, value: 12 },
      { index: 2, value: 14 },
      { index: 3, value: 15 },
      { index: 4, value: 17 },
      { index: 5, value: 16 },
      { index: 6, value: 18 },
      { index: 7, value: 19 },
      { index: 8, value: 21 },
      { index: 9, value: 22 },
      { index: 10, value: 24 },
      { index: 11, value: 23 },
      { index: 12, value: 25 },
      { index: 13, value: 27 },
      { index: 14, value: 29 },
      { index: 15, value: 28 },
      { index: 16, value: 30 },
      { index: 17, value: 32 },
      { index: 18, value: 33 },
      { index: 19, value: 35 },
      { index: 20, value: 36 },
      { index: 21, value: 38 },
      { index: 22, value: 40 },
      { index: 23, value: 42 },
      { index: 24, value: 44 },
      { index: 25, value: 43 },
      { index: 26, value: 45 },
      { index: 27, value: 47 },
      { index: 28, value: 49 },
      { index: 29, value: 50 },
      { index: 30, value: 52 },
    ],
  },
};

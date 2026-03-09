const GEOCODING_URL = "https://geocoding-api.open-meteo.com/v1/search";
const FORECAST_URL = "https://api.open-meteo.com/v1/forecast";

const WMO_DESCRIPTIONS: Record<number, string> = {
  0: "clear sky",
  1: "mainly clear",
  2: "partly cloudy",
  3: "overcast",
  45: "fog",
  48: "depositing rime fog",
  51: "light drizzle",
  53: "moderate drizzle",
  55: "dense drizzle",
  56: "light freezing drizzle",
  57: "dense freezing drizzle",
  61: "slight rain",
  63: "moderate rain",
  65: "heavy rain",
  66: "light freezing rain",
  67: "heavy freezing rain",
  71: "slight snowfall",
  73: "moderate snowfall",
  75: "heavy snowfall",
  77: "snow grains",
  80: "slight rain showers",
  81: "moderate rain showers",
  82: "violent rain showers",
  85: "slight snow showers",
  86: "heavy snow showers",
  95: "thunderstorm",
  96: "thunderstorm with slight hail",
  99: "thunderstorm with heavy hail",
};

function describeWeatherCode(code: number): string {
  return WMO_DESCRIPTIONS[code] ?? "unknown";
}

interface GeocodingResult {
  name: string;
  country: string;
  latitude: number;
  longitude: number;
}

export interface CurrentWeather {
  temperature: number;
  feelsLike: number;
  humidity: number;
  windSpeed: number;
  description: string;
}

export interface DayForecast {
  date: string;
  tempMin: number;
  tempMax: number;
  precipitationChance: number;
  description: string;
}

export interface WeatherData {
  location: string;
  country: string;
  current: CurrentWeather;
  today: DayForecast;
  tomorrow: DayForecast;
}

export async function geocodeCity(
  city: string
): Promise<GeocodingResult | null> {
  const url = `${GEOCODING_URL}?name=${encodeURIComponent(city)}&count=1&language=en&format=json`;
  const res = await fetch(url);
  if (!res.ok) return null;

  const data = await res.json();
  const result = data.results?.[0];
  if (!result) return null;

  return {
    name: result.name,
    country: result.country ?? "",
    latitude: result.latitude,
    longitude: result.longitude,
  };
}

export async function fetchWeather(
  lat: number,
  lon: number
): Promise<{ current: CurrentWeather; today: DayForecast; tomorrow: DayForecast } | null> {
  const params = new URLSearchParams({
    latitude: String(lat),
    longitude: String(lon),
    current:
      "temperature_2m,relative_humidity_2m,apparent_temperature,weather_code,wind_speed_10m",
    daily:
      "weather_code,temperature_2m_max,temperature_2m_min,precipitation_probability_max",
    timezone: "auto",
    forecast_days: "2",
  });

  const res = await fetch(`${FORECAST_URL}?${params}`);
  if (!res.ok) return null;

  const data = await res.json();

  const current: CurrentWeather = {
    temperature: Math.round(data.current.temperature_2m),
    feelsLike: Math.round(data.current.apparent_temperature),
    humidity: data.current.relative_humidity_2m,
    windSpeed: Math.round(data.current.wind_speed_10m),
    description: describeWeatherCode(data.current.weather_code),
  };

  const toDay = (i: number): DayForecast => ({
    date: data.daily.time[i],
    tempMin: Math.round(data.daily.temperature_2m_min[i]),
    tempMax: Math.round(data.daily.temperature_2m_max[i]),
    precipitationChance: data.daily.precipitation_probability_max[i] ?? 0,
    description: describeWeatherCode(data.daily.weather_code[i]),
  });

  return { current, today: toDay(0), tomorrow: toDay(1) };
}

export async function getWeatherForCity(
  city: string
): Promise<WeatherData | null> {
  const geo = await geocodeCity(city);
  if (!geo) return null;

  const weather = await fetchWeather(geo.latitude, geo.longitude);
  if (!weather) return null;

  return {
    location: geo.name,
    country: geo.country,
    ...weather,
  };
}

import { tool } from "ai";
import { z } from "zod";
import { getWeatherForCity } from "@/lib/weather";

export const getWeather = tool({
  description:
    "Get the current weather and short forecast for a city. " +
    "Use this when the user asks about weather, temperature, or forecast.",
  inputSchema: z.object({
    location: z
      .string()
      .describe("The city name to get the weather for, e.g. Baku, London"),
  }),
  execute: async ({ location }) => {
    const data = await getWeatherForCity(location);

    if (!data) {
      return {
        error: true,
        message: `Could not find weather data for "${location}". The city may be misspelled or the weather service may be unavailable.`,
      };
    }

    return {
      location: data.location,
      country: data.country,
      current: {
        temperature: `${data.current.temperature}°C`,
        feelsLike: `${data.current.feelsLike}°C`,
        humidity: `${data.current.humidity}%`,
        wind: `${data.current.windSpeed} km/h`,
        description: data.current.description,
      },
      today: {
        high: `${data.today.tempMax}°C`,
        low: `${data.today.tempMin}°C`,
        rainChance: `${data.today.precipitationChance}%`,
        description: data.today.description,
      },
      tomorrow: {
        high: `${data.tomorrow.tempMax}°C`,
        low: `${data.tomorrow.tempMin}°C`,
        rainChance: `${data.tomorrow.precipitationChance}%`,
        description: data.tomorrow.description,
      },
    };
  },
});

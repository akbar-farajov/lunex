import { tool } from "ai";
import { z } from "zod";

export const getWeather = tool({
  description: "Get the weather for a given location",
  inputSchema: z.object({
    location: z.string().describe("The location to get the weather for"),
  }),
  execute: async ({ location }) => {
    const temps = [72, 68, 65, 60, 58, 55, 52, 50, 48, 45, 42, 40];
    const weather = [
      "sunny",
      "cloudy",
      "rainy",
      "snowy",
      "foggy",
      "hazy",
      "misty",
      "clear",
      "partly cloudy",
      "overcast",
    ];
    return {
      location,
      temperature: temps[Math.floor(Math.random() * temps.length)],
      weather: weather[Math.floor(Math.random() * weather.length)],
    };
  },
});

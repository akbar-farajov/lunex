import { ToolSet } from "ai";
import { google } from "@ai-sdk/google";
import { getWeather } from "./get-weather";
import { imageGeneration } from "./generate-image";

export const getTools = () =>
  ({
    getWeather,
    imageGeneration,
    google_search: google.tools.googleSearch({}),
  } satisfies ToolSet);

import {
  CloudIcon,
  CloudRainIcon,
  CloudSnowIcon,
  DropletsIcon,
  MapPinIcon,
  SunIcon,
  ThermometerIcon,
  WindIcon,
  AlertCircleIcon,
} from "lucide-react";
import { FC } from "react";
import { cn } from "@/lib/utils";

interface WeatherCurrent {
  temperature: string;
  feelsLike: string;
  humidity: string;
  wind: string;
  description: string;
}

interface WeatherDay {
  high: string;
  low: string;
  rainChance: string;
  description: string;
}

interface GetWeatherToolProps {
  data: {
    error?: boolean;
    message?: string;
    location?: string;
    country?: string;
    current?: WeatherCurrent;
    today?: WeatherDay;
    tomorrow?: WeatherDay;
  };
}

function weatherIcon(description: string, className: string) {
  const d = description.toLowerCase();
  if (d.includes("snow")) return <CloudSnowIcon className={cn(className, "text-cyan-400")} aria-hidden="true" />;
  if (d.includes("rain") || d.includes("drizzle") || d.includes("shower"))
    return <CloudRainIcon className={cn(className, "text-blue-500")} aria-hidden="true" />;
  if (d.includes("thunder")) return <CloudRainIcon className={cn(className, "text-violet-500")} aria-hidden="true" />;
  if (d.includes("clear") || d.includes("sunny"))
    return <SunIcon className={cn(className, "text-yellow-500")} aria-hidden="true" />;
  if (d.includes("cloud") || d.includes("overcast"))
    return <CloudIcon className={cn(className, "text-slate-400")} aria-hidden="true" />;
  return <CloudIcon className={cn(className, "text-slate-400")} aria-hidden="true" />;
}

function bgGradient(description: string) {
  const d = description.toLowerCase();
  if (d.includes("clear") || d.includes("sunny"))
    return "from-yellow-50 to-orange-50 dark:from-yellow-950/20 dark:to-orange-950/20";
  if (d.includes("rain") || d.includes("drizzle") || d.includes("shower"))
    return "from-blue-50 to-cyan-50 dark:from-blue-950/20 dark:to-cyan-950/20";
  if (d.includes("snow"))
    return "from-cyan-50 to-blue-50 dark:from-cyan-950/20 dark:to-blue-950/20";
  return "from-slate-50 to-gray-50 dark:from-slate-900/50 dark:to-gray-900/50";
}

export const GetWeatherTool: FC<GetWeatherToolProps> = ({ data }) => {
  if (data.error || !data.current || !data.today || !data.tomorrow) {
    return (
      <div
        role="alert"
        className="flex items-center gap-2 rounded-lg border border-destructive/30 bg-destructive/5 px-4 py-3 text-sm text-destructive"
      >
        <AlertCircleIcon className="size-4 shrink-0" aria-hidden="true" />
        {data.message ?? "Weather data is unavailable."}
      </div>
    );
  }

  const { location, country, current, today, tomorrow } = data;
  const iconSize = "size-5";

  return (
    <div
      role="region"
      aria-label={`Weather for ${location}`}
      className={cn(
        "overflow-hidden rounded-lg border bg-gradient-to-br p-4 shadow-sm max-w-sm",
        bgGradient(current.description)
      )}
    >
      <div className="flex items-center gap-2 text-sm text-muted-foreground">
        <MapPinIcon className="size-4" aria-hidden="true" />
        <span className="font-medium">
          {location}, {country}
        </span>
      </div>

      <div className="mt-3 flex items-center gap-3">
        {weatherIcon(current.description, "size-8")}
        <div>
          <span className="text-3xl font-bold tracking-tight">
            {current.temperature}
          </span>
          <p className="text-sm capitalize text-muted-foreground">
            {current.description}
          </p>
        </div>
      </div>

      <dl className="mt-3 grid grid-cols-3 gap-2 text-xs text-muted-foreground">
        <div className="flex items-center gap-1">
          <ThermometerIcon className={iconSize} aria-hidden="true" />
          <div>
            <dt className="sr-only">Feels like</dt>
            <dd>Feels {current.feelsLike}</dd>
          </div>
        </div>
        <div className="flex items-center gap-1">
          <DropletsIcon className={iconSize} aria-hidden="true" />
          <div>
            <dt className="sr-only">Humidity</dt>
            <dd>{current.humidity}</dd>
          </div>
        </div>
        <div className="flex items-center gap-1">
          <WindIcon className={iconSize} aria-hidden="true" />
          <div>
            <dt className="sr-only">Wind speed</dt>
            <dd>{current.wind}</dd>
          </div>
        </div>
      </dl>

      <div className="mt-3 grid grid-cols-2 gap-2 border-t pt-3">
        <ForecastDay label="Today" day={today} />
        <ForecastDay label="Tomorrow" day={tomorrow} />
      </div>
    </div>
  );
};

const ForecastDay: FC<{ label: string; day: WeatherDay }> = ({
  label,
  day,
}) => (
  <div className="text-xs">
    <p className="font-medium text-foreground">{label}</p>
    <div className="mt-0.5 flex items-center gap-1.5 text-muted-foreground">
      {weatherIcon(day.description, "size-3.5")}
      <span className="capitalize">{day.description}</span>
    </div>
    <p className="mt-0.5 text-muted-foreground">
      {day.high} / {day.low}
      {parseInt(day.rainChance) > 0 && (
        <span className="ml-1.5">
          <DropletsIcon className="inline size-3" aria-hidden="true" />{" "}
          {day.rainChance}
        </span>
      )}
    </p>
  </div>
);

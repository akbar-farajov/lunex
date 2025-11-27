import {
  CloudFogIcon,
  CloudHailIcon,
  CloudIcon,
  CloudRainIcon,
  HazeIcon,
  MapPinIcon,
  SnowflakeIcon,
  SunIcon,
} from "lucide-react";
import { FC } from "react";
import { cn } from "@/lib/utils";

interface GetWeatherToolProps {
  data: {
    location: string;
    temperature: number;
    weather: string;
  };
}

export const GetWeatherTool: FC<GetWeatherToolProps> = ({ data }) => {
  const getWeatherIcon = () => {
    const iconClass = "size-8";
    switch (data.weather.toLowerCase()) {
      case "sunny":
        return <SunIcon className={cn(iconClass, "text-yellow-500")} />;
      case "cloudy":
        return <CloudIcon className={cn(iconClass, "text-slate-400")} />;
      case "rainy":
        return <CloudRainIcon className={cn(iconClass, "text-blue-500")} />;
      case "snowy":
        return <SnowflakeIcon className={cn(iconClass, "text-cyan-300")} />;
      case "foggy":
        return <CloudFogIcon className={cn(iconClass, "text-gray-400")} />;
      case "hazy":
        return <HazeIcon className={cn(iconClass, "text-amber-400")} />;
      default:
        return <CloudIcon className={cn(iconClass, "text-slate-400")} />;
    }
  };

  const getWeatherColor = () => {
    switch (data.weather.toLowerCase()) {
      case "sunny":
        return "from-yellow-50 to-orange-50 dark:from-yellow-950/20 dark:to-orange-950/20";
      case "cloudy":
        return "from-slate-50 to-gray-50 dark:from-slate-900/50 dark:to-gray-900/50";
      case "rainy":
        return "from-blue-50 to-cyan-50 dark:from-blue-950/20 dark:to-cyan-950/20";
      case "snowy":
        return "from-cyan-50 to-blue-50 dark:from-cyan-950/20 dark:to-blue-950/20";
      case "foggy":
        return "from-gray-50 to-slate-50 dark:from-gray-900/50 dark:to-slate-900/50";
      case "hazy":
        return "from-amber-50 to-yellow-50 dark:from-amber-950/20 dark:to-yellow-950/20";
      default:
        return "from-slate-50 to-gray-50 dark:from-slate-900/50 dark:to-gray-900/50";
    }
  };

  return (
    <div
      className={cn(
        "relative overflow-hidden rounded-lg border bg-gradient-to-br p-6 shadow-sm",
        getWeatherColor()
      )}
    >
      <div className="flex items-start justify-between gap-4">
        <div className="flex-1 space-y-3">
          {/* Location */}
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <MapPinIcon className="size-4" />
            <span className="font-medium">{data.location}</span>
          </div>

          {/* Temperature */}
          <div className="flex items-baseline gap-2">
            <span className="text-4xl font-bold tracking-tight text-foreground">
              {data.temperature}
            </span>
            <span className="text-xl text-muted-foreground">°F</span>
          </div>

          {/* Weather Condition */}
          <div className="flex items-center gap-2">
            {getWeatherIcon()}
            <span className="text-base font-medium capitalize text-foreground">
              {data.weather}
            </span>
          </div>
        </div>

        {/* Large decorative icon */}
        <div className="opacity-20 dark:opacity-10">{getWeatherIcon()}</div>
      </div>
    </div>
  );
};

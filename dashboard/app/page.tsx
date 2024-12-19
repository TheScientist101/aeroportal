"use client";

import { useEffect, useState } from "react";
import { fetchWeatherApi } from "openmeteo";
import { Card, CardBody, CardHeader } from "@nextui-org/card";
import Image from "next/image";
import axios from "axios";

type WeatherData = {
  current: {
    time: Date;
    temperature2m: number | undefined;
    relativeHumidity2m: number | undefined;
    apparentTemperature: number | undefined;
    isDay: number | undefined;
    precipitation: number | undefined;
    rain: number | undefined;
    showers: number | undefined;
    snowfall: number | undefined;
    weatherCode: number | undefined;
    cloudCover: number | undefined;
    pressureMsl: number | undefined;
    surfacePressure: number | undefined;
    windSpeed10m: number | undefined;
    windDirection10m: number | undefined;
    windGusts10m: number | undefined;
  };
  hourly: {
    time: Date[];
    temperature2m: Float32Array;
    precipitationProbability: Float32Array;
  };
  daily: {
    time: Date[];
    precipitationProbabilityMax: Float32Array;
  };
};

export default function Home() {
  const [weather, setWeather] = useState<WeatherData | undefined>(undefined);
  const [position, setPosition] = useState<[number, number]>([
    37.7749, -122.4194,
  ]);
  const [quote, setQuote] = useState("");

  const weatherImage = (weatherCode: number) => {
    let src = "";
    let alt = "";

    if (weatherCode == 0) {
      src = "/images/clear.svg";
      alt = "clear";
    } else if (weatherCode < 10) {
      src = "/images/partly-cloudy.svg";
      alt = "partly cloudy";
    } else if (weatherCode < 65) {
      src = "/images/raining.svg";
      alt = "raining";
    } else if (weatherCode) {
      src = "/images/snowing.svg";
      alt = "snowing";
    } else if (weatherCode < 100) {
      src = "/images/storm.svg";
      alt = "storm";
    }

    return (
      <Image
        priority
        alt={alt}
        className="w-40 h-40"
        height={100}
        src={src}
        width={100}
      />
    );
  };

  // Using Open Meteo API
  const fetchWeather = async () => {
    const params = {
      latitude: position[0],
      longitude: position[1],
      current: [
        "temperature_2m",
        "relative_humidity_2m",
        "apparent_temperature",
        "is_day",
        "precipitation",
        "rain",
        "showers",
        "snowfall",
        "weather_code",
        "cloud_cover",
        "pressure_msl",
        "surface_pressure",
        "wind_speed_10m",
        "wind_direction_10m",
        "wind_gusts_10m",
      ],
      hourly: ["temperature_2m", "precipitation_probability"],
      daily: "precipitation_probability_max",
      temperature_unit: "fahrenheit",
      wind_speed_unit: "mph",
      precipitation_unit: "inch",
      timezone: "GMT",
      forecast_hours: 24,
    };
    const url = "https://api.open-meteo.com/v1/forecast";
    const responses = await fetchWeatherApi(url, params);

    // Helper function to form time ranges
    const range = (start: number, stop: number, step: number) =>
      Array.from({ length: (stop - start) / step }, (_, i) => start + i * step);

    // Process first location. Add a for-loop for multiple locations or weather models
    const response = responses[0];

    // Attributes for timezone and location
    const utcOffsetSeconds = response.utcOffsetSeconds();

    const current = response.current()!;
    const hourly = response.hourly()!;
    const daily = response.daily()!;

    // Note: The order of weather variables in the URL query and the indices below need to match!
    const weatherData = {
      current: {
        time: new Date((Number(current.time()) + utcOffsetSeconds) * 1000),
        temperature2m: current.variables(0)!.value(),
        relativeHumidity2m: current.variables(1)!.value(),
        apparentTemperature: current.variables(2)!.value(),
        isDay: current.variables(3)!.value(),
        precipitation: current.variables(4)!.value(),
        rain: current.variables(5)!.value(),
        showers: current.variables(6)!.value(),
        snowfall: current.variables(7)!.value(),
        weatherCode: current.variables(8)!.value(),
        cloudCover: current.variables(9)!.value(),
        pressureMsl: current.variables(10)!.value(),
        surfacePressure: current.variables(11)!.value(),
        windSpeed10m: current.variables(12)!.value(),
        windDirection10m: current.variables(13)!.value(),
        windGusts10m: current.variables(14)!.value(),
      },
      hourly: {
        time: range(
          Number(hourly.time()),
          Number(hourly.timeEnd()),
          hourly.interval(),
        ).map((t) => new Date((t + utcOffsetSeconds) * 1000)),
        temperature2m: hourly.variables(0)!.valuesArray()!,
        precipitationProbability: hourly.variables(1)!.valuesArray()!,
      },
      daily: {
        time: range(
          Number(daily.time()),
          Number(daily.timeEnd()),
          daily.interval(),
        ).map((t) => new Date((t + utcOffsetSeconds) * 1000)),
        precipitationProbabilityMax: daily.variables(0)!.valuesArray()!,
      },
    };

    setWeather(weatherData);
  };

  useEffect(() => {
    fetchWeather();
  }, [position]);

  useEffect(() => {
    console.log(weather);
  }, [weather]);

  useEffect(() => {
    navigator.geolocation.getCurrentPosition((position) => {
      setPosition([position.coords.latitude, position.coords.longitude]);
    });

    const intervalID = setInterval(() => {
      fetchWeather();
    }, 3000);

    axios
      .get("https://api.quotable.io/quotes/random?maxLength=100")
      .then((response) => {
        setQuote(`${response.data[0].content}\n—${response.data[0].author}`);
      });

    return () => clearInterval(intervalID);
  }, []);

  const WeatherCard = () => (
    <Card className="col-span-2 bg-gradient-to-bl from-gray-600 to-gray-300 h-full w-full aspect-[2/1] md:aspect-[3/1]">
      <CardBody className="flex-1 items-center justify-center gap-2">
        {weather == undefined ? (
          <p className="text-4xl font-bold text-content1-foreground">Loading...</p>
        ) : (
          <div className="flex justify-between w-11/12 text-right">
            {weatherImage(weather.current.weatherCode!)}
            <div>
              <p className="text-4xl font-bold text-content1-foreground">
                {Math.round((weather?.current.temperature2m ?? 0) * 10) / 10}°F
              </p>
              <p className="text-lg text-content2">
                Feels like{" "}
                {Math.round((weather?.current.apparentTemperature ?? 0) * 10) /
                  10}
                °F
              </p>
              <p className="text-lg text-content2">
                {Math.round(weather?.current.relativeHumidity2m ?? 0)}% Humidity
              </p>
              <p className="text-lg text-content2">
                {Math.round(weather?.current.windSpeed10m ?? 0)} mph
              </p>
              <p className="text-lg text-content2">
                {Math.round(weather?.daily.precipitationProbabilityMax[0] ?? 0)}
                % Chance of Rain
              </p>
            </div>
          </div>
        )}
      </CardBody>
    </Card>
  );

  const PrecipitationForecast = () => (
    <Card className="col-span-1 bg-gradient-to-bl from-gray-600 to-gray-300 aspect-square h-full w-full">
      <CardHeader>
        <h1 className="font-bold text-large text-center w-full text-content1-foreground">
          Precipitation Forecast
        </h1>
      </CardHeader>
      <CardBody className="flex-1 items-center justify-evenly w-full">
        <div className={`flex justify-between h-[95%] w-[92%]`}>
          {Array.from(weather?.hourly.precipitationProbability || [])
            .map((element: number, index: number) => (
              <div key={index} className="flex flex-col h-full w-2 mx-0">
                <div
                  className="w-full"
                  style={{ height: `${100 - (element + 5) / 105 * 100}%` }}
                />
                <div
                  className="bg-gradient-to-tr from-blue-300 to-blue-700 w-full mt-auto rounded-lg"
                  style={{ height: `${(element + 5) / 105 * 100}%` }}
                />
                {index === 0 || index === weather?.hourly.precipitationProbability.length - 1 ? (
                  <p className={`text-xs text-gray-600 absolute bottom-0 ${index === 0 ? "left-3" : "right-3"}`}>
                    {weather?.hourly.time[index].toLocaleTimeString("en-US", {
                      hour: "numeric",
                    })}
                  </p>
                ) : null}
              </div>
            ))}
        </div>
      </CardBody>
    </Card >
  );

  const TimeCard = () => (
    <Card className="col-span-2 bg-gradient-to-bl from-gray-600 to-gray-300 h-full w-full aspect-[2/1] md:aspect-[3/1]">
      <CardBody className="flex-1 items-center justify-center flex-row gap-2 p-7">
        <div className="flex w-11/12 text-left">
          <p className="text-sm text-primary-foreground">
            {quote.split("\n").map((text, index) => (
              <span key={index}>
                {text}
                <br />
              </span>
            ))}
          </p>
        </div>
        <div className="flex flex-col w-11/12 text-right">
          <p className="text-4xl font-bold text-content1-foreground">
            {new Date().toLocaleTimeString("en-US", {
              hour: "numeric",
              minute: "numeric",
            })}
          </p>
          <p className="text-lg text-content2">
            {new Date().toLocaleDateString("en-US", {
              weekday: "long",
              month: "long",
              day: "numeric",
            })}
          </p>
        </div>
      </CardBody>
    </Card >
  );

  // rotates around 100 100
  const rotateNeedle = (degrees: number) => {
    degrees = 90 + degrees;
    // <polygon points="100,50 110,100 100,100 90,100" fill="red" />
    let points = [[100, 50], [110, 100], [100, 100], [90, 100]];
    let angle = degrees * (Math.PI / 180);
    let cos = Math.cos(angle);
    let sin = Math.sin(angle);
    let cx = 100;
    let cy = 100;

    let newPoints = points.map((point) => {
      let x = point[0] - cx;
      let y = point[1] - cy;

      return [x * cos - y * sin + cx, x * sin + y * cos + cy];
    });

    return (
      <polygon
        fill="red"
        points={newPoints.map((point) => point.join(",")).join(" ")}
      />
    );
  }

  const CompassCard = () => (
    <Card className="col-span-1 bg-gradient-to-bl from-gray-600 to-gray-300 p-0 aspect-square h-full w-full">
      <CardHeader>
        <h1 className="font-bold text-large text-center w-full text-content1-foreground">
          Wind Direction
        </h1>
      </CardHeader>
      <CardBody className="h-full w-full items-center justify-center gap-2">
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 200 200" className="h-full w-full">
          <circle cx="100" cy="100" r="95" stroke="black" strokeWidth="2" fill="none" />
          <text x="100" y="20" fontSize="16" textAnchor="middle" fill="black">N</text>
          <text x="100" y="190" fontSize="16" textAnchor="middle" fill="black">S</text>
          <text x="20" y="105" fontSize="16" textAnchor="middle" fill="black">W</text>
          <text x="180" y="105" fontSize="16" textAnchor="middle" fill="black">E</text>
          {rotateNeedle(weather?.current.windDirection10m ?? 0)}
          <circle cx="100" cy="100" r="5" fill="black" />
          <circle cx="100" cy="100" r="80" stroke="black" strokeWidth="1" fill="none" />
          <circle cx="100" cy="100" r="60" stroke="black" strokeWidth="1" fill="none" />
        </svg>
      </CardBody>
    </Card>
  );

  return (
    <section className="w-full">
      <div className="grid grid-cols-2 md:grid-cols-3 gap-4 max-w-3xl mx-auto">
        <WeatherCard />
        <PrecipitationForecast />
        <CompassCard />
        <TimeCard />
      </div>
    </section>
  );
}

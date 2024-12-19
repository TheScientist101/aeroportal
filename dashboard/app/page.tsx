"use client";

import { useEffect, useState } from "react";
import { Card, CardBody, CardHeader } from "@nextui-org/card";
import Image from "next/image";
import axios from "axios";

type WeatherData = {
  current: {
    time: Date;
    temperature2m: number | undefined;
    relativeHumidity2m: number | undefined;
    apparentTemperature: number | undefined;
    weatherCode: number | undefined;
    windSpeed10m: number | undefined;
    windDirection10m: number | undefined;
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
      current:
        "temperature_2m,relative_humidity_2m,apparent_temperature,weather_code,wind_speed_10m,wind_direction_10m",
      hourly: "temperature_2m,precipitation_probability",
      daily: "precipitation_probability_max",
      temperature_unit: "fahrenheit",
      timeformat: "unixtime",
      wind_speed_unit: "mph",
      precipitation_unit: "inch",
      timezone: "GMT",
      forecast_hours: 24,
    };

    const url = "https://api.open-meteo.com/v1/forecast";

    const response = await axios.get(url, { params }).then((response) => response.data);
    const current = response.current;
    const hourly = response.hourly;
    const daily = response.daily;

    const weatherData = {
      current: {
        time: new Date(current.time * 1000),
        temperature2m: current.temperature_2m,
        relativeHumidity2m: current.relative_humidity_2m,
        apparentTemperature: current.apparent_temperature,
        weatherCode: current.weather_code,
        windSpeed10m: current.wind_speed_10m,
        windDirection10m: current.wind_direction_10m,
      },
      hourly: {
        time: hourly.time.map((t: number) => new Date(t * 1000)),
        temperature2m: hourly.temperature_2m,
        precipitationProbability: hourly.precipitation_probability,
      },
      daily: {
        time: daily.time.map((t: number) => new Date(t * 1000)),
        precipitationProbabilityMax: daily.precipitation_probability_max,
      },
    };

    setWeather(weatherData);
  };

  useEffect(() => {
    fetchWeather();
  }, [position]);

  useEffect(() => {
    navigator.geolocation.getCurrentPosition((position) => {
      setPosition([position.coords.latitude, position.coords.longitude]);
    });

    const intervalID = setInterval(() => {
      fetchWeather();
    }, 10000);

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

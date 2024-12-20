"use client";

import { Button } from "@nextui-org/button";
import { TimeInput, TimeInputValue } from "@nextui-org/date-input";
import { parseTime, Time } from "@internationalized/date";
import { useEffect, useState } from "react";
import { Input } from "@nextui-org/input";
import { PressEvent } from "@react-types/shared";

import { title } from "@/components/primitives";

export default function SettingsPage() {
  const [currentAlarm, setCurrentAlarm] = useState<TimeInputValue | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [message, setMessage] = useState<string | null>(null);
  const [alarms, setAlarms] = useState(
    typeof window !== "undefined" && localStorage.getItem("alarms")
      ? JSON.parse(localStorage.getItem("alarms")!)
      : [],
  );
  const [broadcast, setBroadcast] = useState<string>("");

  useEffect(() => {
    if (typeof window === "undefined") return;
    localStorage.setItem("alarms", JSON.stringify(alarms));
  }, [alarms]);

  const addAlarm = () => {
    if (!currentAlarm) {
      const alert = document.getElementById("alert");

      setError("Please enter a valid time.");

      const message = document.getElementById("message");

      message?.classList.add("hidden");

      alert?.classList.remove("hidden");
      setTimeout(() => {
        alert?.classList.add("hidden");
      }, 3000);

      return;
    }

    for (const alarm of alarms) {
      if (
        alarm.hour === currentAlarm.hour &&
        alarm.minute === currentAlarm.minute
      ) {
        const alert = document.getElementById("alert");

        setError("Alarm already exists.");

        const message = document.getElementById("message");

        message?.classList.add("hidden");

        alert?.classList.remove("hidden");
        setTimeout(() => {
          alert?.classList.add("hidden");
        }, 3000);

        return;
      }
    }

    setAlarms([...alarms, parseTime(currentAlarm.toString())]);
  };

  const sendMessage = (e: PressEvent) => {
    if (broadcast === "") {
      const alert = document.getElementById("alert");

      setError("Please enter a message.");

      const message = document.getElementById("message");

      message?.classList.add("hidden");

      alert?.classList.remove("hidden");
      setTimeout(() => {
        alert?.classList.add("hidden");
      }, 3000);

      return;
    }

    const message = document.getElementById("message");

    setMessage("Message broadcasted on speaker.");

    const alert = document.getElementById("alert");

    alert?.classList.add("hidden");

    message?.classList.remove("hidden");
    setTimeout(() => {
      message?.classList.add("hidden");
    }, 3000);

    setBroadcast("");
  };

  return (
    <div className="w-full items-center justify-center">
      <div className="flex flex-col w-full text-center items-center justify-center">
        <div
          className="hidden bg-red-100 text-red-900 p-2 rounded-md m-4 absolute top-16 text-center"
          id="alert"
        >
          <p>{error}</p>
        </div>
        <div
          className="hidden bg-green-500 text-white p-2 rounded-md m-4 absolute top-16 text-center"
          id="message"
        >
          <p>{message}</p>
        </div>
      </div>
      <h1 className={title()}>Settings</h1>
      <div className="flex flex-row w-full justify-evenly">
        <div>
          <form className="flex flex-row my-5 gap-2 w-full">
            <TimeInput onChange={setCurrentAlarm} />
            <Button onPress={addAlarm}>Set Alarm</Button>
          </form>
          <div>
            <h2 className="text-lg font-semibold">Alarms</h2>
            <ul>
              {alarms.map((alarm: Time, index: number) => (
                // 10:00 AM
                <li key={index} className="my-2">
                  {alarm.hour > 12 ? alarm.hour - 12 : alarm.hour}:
                  {alarm.minute < 10 ? "0" + alarm.minute : alarm.minute}{" "}
                  {alarm.hour > 12 ? "PM" : "AM"}
                  <Button
                    className="ml-2 bg-red-500"
                    size="sm"
                    onPress={() => {
                      setAlarms(
                        alarms.filter((_: Time, i: number) => i !== index),
                      );
                    }}
                  >
                    Delete
                  </Button>
                </li>
              ))}
            </ul>
          </div>
        </div>
        <div>
          <h2 className="text-lg font-semibold">Broadcast a Message</h2>
          <form className="flex flex-row gap-2">
            <Input
              id="message_input"
              placeholder="Message"
              value={broadcast}
              onValueChange={setBroadcast}
            />
            <Button onPress={sendMessage}>Send</Button>
          </form>
        </div>
      </div>
    </div>
  );
}

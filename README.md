# Aeroportal

Aeroportal is a weather-centered home hub that is designed with simplicity at its core.

The dashboard is hosted at: https://aeroportal.urjith.dev/

![website](/assets/website.png)

# Features

- Weather information
- Time and date
- Alarms
- Broadcast audio messages

# Hardware

## PCB

The PCB is designed in KiCad which is in the `pcb` folder. The electronics consist of a Wemos C3 mini, a TFT display, an I2S amplifier, and a speaker. The PCB is designed to be powered by a USB-C cable connected a wall outlet.

## Case

The case is designed in Openscad which is in the `cad` folder. To assemble, print the top and bottom parts of the case and assemble them as shown in `cad/assembled.scad`. Glue the holes in the top part to the bottom part to help keep the case together.

![assembled case](/assets/assembled.png)

# Software

## Website

The dashboard website is written in Next.js with the Next UI library for the UI components. The website is in the `website` folder. The website is hosted at: https://aeroportal.urjith.dev/.

## Firmware

The firmware is written in Circuitpython and is currently very rudamentary since I do not currently have the hardware to test it. The firmware is in the `firmware` folder. It _should_ be able to connect to the internet, display the weather information on the TFT display, and play scheduled alarms or broadcasted messages (using the API).

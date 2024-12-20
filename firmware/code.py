import time
import board
import displayio
from adafruit_st7735 import ST7735
from adafruit_display_text import label
from adafruit_datetime import datetime, date, time
import terminalio
import adafruit_requests as requests
import wifi
import socketpool
import ssl

alarms = [
    datetime.time(7, 0),
]

# Initialize RTC
rtc = board.RTC()

# Initialize display
spi = board.SPI()
tft_cs = board.D5
tft_dc = board.D6
displayio.release_displays()
display_bus = displayio.FourWire(spi, command=tft_dc, chip_select=tft_cs, reset=board.D9)
display = ST7735(display_bus, width=128, height=128)

# Create the display context
splash = displayio.Group()
display.root_group = splash

# Background color
color_bitmap = displayio.Bitmap(128, 128, 1)
color_palette = displayio.Palette(1)
color_palette[0] = 0x000000
bg_sprite = displayio.TileGrid(color_bitmap, pixel_shader=color_palette, x=0, y=0)
splash.append(bg_sprite)

# Text labels; the positionings for these are arbitrary cause idk how it'll look like
time_label = label.Label(terminalio.FONT, text="", color=0xFFFFFF, x=10, y=20)
weather_label = label.Label(terminalio.FONT, text="", color=0xFFFFFF, x=10, y=50)
splash.append(time_label)
splash.append(weather_label)

# WiFi credentials
WIFI_SSID = "not_my_ssid"
WIFI_PASSWORD = "not_my_password"

# NTP server setup
NTP_SERVER = "pool.ntp.org"

def synchronize_time():
    try:
        print("Synchronizing time with NTP...")
        pool = socketpool.SocketPool(wifi.radio)
        ntp = requests.Session(pool, ssl.create_default_context())
        response = ntp.get(f"http://{NTP_SERVER}/")
        ntp_time = response.headers['Date']
        response.close()

        # Parse the time from the header
        parsed_time = time.strptime(ntp_time[5:25], "%d %b %Y %H:%M:%S")
        rtc.RTC().datetime = parsed_time
        print("Time synchronized!")
    except Exception as e:
        print(f"Error synchronizing time: {e}")

# Connect to WiFi
print("Connecting to WiFi...")
wifi.radio.connect(WIFI_SSID, WIFI_PASSWORD)
print("Connected!")

# Synchronize time
synchronize_time()

# Open-Meteo API setup
LAT = "not_my_latitude"
LON = "not_my_longitude"
URL = f"https://api.open-meteo.com/v1/forecast?latitude={LAT}&longitude={LON}&current_weather=true"

# Create socket pool and requests
pool = socketpool.SocketPool(wifi.radio)
https = requests.Session(pool, ssl.create_default_context())

def fetch_weather():
    try:
        response = https.get(URL)
        data = response.json()
        response.close()
        temp = data['current_weather']['temperature']
        condition = data['current_weather']['weathercode']
        return f"{temp}C, Code: {condition}"
    except Exception as e:
        print(f"Error fetching weather: {e}")
        return "N/A"

def update_display():
    current_time = time.localtime()
    time_label.text = time.strftime("%H:%M:%S", current_time)

    weather_info = fetch_weather()
    weather_label.text = weather_info

# Main loop
while True:
    update_display()
    time.sleep(60)
#include <Arduino.h>

#define Network_DeBug
#define DeBug

#include "network.h"
Network net("SSID", NULL, "HOST", 80);
String name = "1F-1";

#include <Adafruit_Sensor.h>
#include <DHT.h>
uint8_t DHTTYPE = DHT11;
uint8_t DHTPIN = 2;
DHT dht(DHTPIN, DHTTYPE);

unsigned long lastTime = 0;
uint16_t delayTime = 60; // seconds

void setup()
{
    Serial.begin(9600);

    dht.begin();

    net.init();
    while (net.begin())
        ;

    lastTime = millis();
}

void loop()
{
    unsigned long now = millis();

    if (now - lastTime > delayTime * 1000)
    {
        if (net.run())
        {
            float h = dht.readHumidity();
            float t = dht.readTemperature();

            if (isnan(h) || isnan(t))
            {
#ifdef DeBug
                Serial.println(F("Failed to read from DHT sensor!"));
#endif
                return;
            }

#ifdef DeBug
            Serial.printf("Humidity: %.2f%% Temperature: %.2f°C\n", h, t);
#endif
            GET_Config Config[] = {
                {"h", String(h)},
                {"t", String(t)},
                {"name", name}};
            net.GET(Config, 2, "/api/update");
        }
        else
        {
            Serial.println("Network error");
        }

        lastTime = millis();
    }
}

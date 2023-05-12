#include <Arduino.h>

#include <Adafruit_Sensor.h>
#include <DHT.h>
uint8_t DHTTYPE = DHT11;
uint8_t DHTPIN = 2;
DHT dht(DHTPIN, DHTTYPE);

unsigned long lastTime = 0;

void setup()
{
    Serial.begin(9600);

    dht.begin();

    lastTime = millis();
}

void loop()
{
    unsigned long now = millis();

    if (now - lastTime)
    {
        float h = dht.readHumidity();
        float t = dht.readTemperature();

        if (isnan(h) || isnan(t))
        {
            Serial.println(F("Failed to read from DHT sensor!"));
            return;
        }

        Serial.printf("Humidity: %.2f%% Temperature: %.2f°C\n", h, t);

        lastTime = millis();
    }
}

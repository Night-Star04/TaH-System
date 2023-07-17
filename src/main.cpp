#include <Arduino.h>
#include "main.h"

// #define DeBug

// =============== Network  ===============
#include "network.h"
Network net(network_ssid, network_password, network_host, network_port);
bool isUID = false;
String uid = "";

// ===============  DHT11   ===============
#include <Adafruit_Sensor.h>
#include <DHT.h>
uint8_t DHTTYPE = DHT11;
uint8_t DHTPIN = 13;
DHT dht(DHTPIN, DHTTYPE);

// ===============   Time   ===============
unsigned long lastTime = 0;
uint16_t delayTime = 60; // seconds

void setup()
{
    Serial.begin(9600);

    dht.begin(); // DTH11 init

    net.init(); // Network init
    while (!net.begin())
        delay(500);

    while (!net.run())
        delay(500);

    Body_Params body[] = {
        {"id", net.getMacAddress()},
    };

    while (!isUID) // Register device get UID
    {
        HTTP_Request req = net.POST(json, body, 1, "/api/device/register");

        if (req.code == 200)
        {
            uid = req.body;
            isUID = true;
        }
    }

    lastTime = millis() - (delayTime * 1000); // Make sure the first time is executed
}

void loop()
{
    unsigned long now = millis();

    if (now - lastTime > delayTime * 1000) // Delay 60 seconds
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
                lastTime = now; // Reset time to prevent continuous checking the dht sensor
                return;
            }

#ifdef DeBug
            Serial.printf("Humidity: %.2f%% Temperature: %.2f°C\n", h, t);
#endif
            // ================= Upload data =================
            HTTP_Params params[] = {
                {"h", String(h)},
                {"t", String(t)}};

            net.GET(params, 2, "/api/data/" + uid + "/upload");
        }
        else
        {
#ifdef DeBug
            Serial.println("Network error");
#endif
        }

        lastTime = now;
    }
}

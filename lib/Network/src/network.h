#if (defined ESP32) || (defined ESP8266)
#ifndef __NETWORK_H__
#define __NETWORK_H__
#include <Arduino.h>
#include "LED.h"

// #define Network_DeBug

#ifdef ESP32
#include <WiFi.h>
#include <esp_wifi.h>
#include <HTTPClient.h>
#elif ESP8266
#include <ESP8266WiFi.h>
#include <ESP8266HTTPClient.h>
#include <WiFiClient.h>
#endif

typedef struct
{
    String Arg;
    String data;
} GET_Config;

typedef struct
{
    String body;
    String url;
    int code;
    bool isError;
} GET_Request;

class Network
{
public:
    Network(const char *ssid, const char *password, const char *host, uint16_t port = 80);
    ~Network();

    void init();
    bool begin(uint8_t MaxConnectNumber = 10);

    GET_Request GET(GET_Config Config[], uint8_t ConfigSize, String path = "/");
    GET_Request GET(String path = "/");

    bool run(void);

protected:
    LED *led;

    const char *_ssid;
    const char *_password;
    const char *_host;
    uint16_t _port;

    bool isConnect = false;
    bool isInit = false;
};
#endif // __NETWORK_H__

#else

#error "This library only supports boards with ESP32 or ESP8266 processor."

#endif

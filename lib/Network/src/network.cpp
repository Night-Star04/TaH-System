#if (defined ESP32) || (defined ESP8266)
#include "network.h"
Network::Network(
    const char *ssid, const char *password,
    const char *host, uint16_t port) : _ssid(ssid), _password(password),
                                       _host(host), _port(port) {}
Network::~Network(void) {}

void Network::init(void)
{
    led = new LED(LED_BUILTIN);

    WiFi.mode(WIFI_STA);

    isInit = true;
}

bool Network::begin(uint8_t MaxConnectNumber)
{
    if (!isInit)
        return false;

    led->begin();
    WiFi.begin(_ssid, _password);
    uint8_t connection = 0;
#ifdef Network_DeBug
    Serial.print(F("Connecting to WiFi"));
#endif

    while (connection < MaxConnectNumber && !isConnect)
    {
        led->toggle();
        delay(100);
        led->toggle();

        if (WiFi.status() == WL_CONNECTED)
            isConnect = true;
#ifdef Network_DeBug
        Serial.print(".");
#endif
        connection++;
    }
    if (!isConnect)
    {
#ifdef Network_DeBug
        Serial.print("\r\n");
        Serial.println(F("Failed to connect to WiFi"));
#endif
        return false;
    }

#ifdef Network_DeBug
    Serial.println(F("Connected to WiFi"));
    Serial.print(F("IP address: "));
    Serial.println(WiFi.localIP());
    WiFi.printDiag(Serial);
#endif

    led->on();
    return true;
}

GET_Request Network::GET(GET_Config Config[], uint8_t ConfigSize, String path)
{
    if (!isConnect || !isInit || !run())
        return {String(""), String(""), 0, true};

    WiFiClient client;
    HTTPClient http;

    GET_Request req;
    String value;
    int httpResponseCode;
    String url = String(_host) + ":" + String(_port) + path;

    if (Config != NULL)
    {
        String postData = "?";
        for (uint8_t i = 0; i < ConfigSize; i++)
            postData += (i != 0 ? "&" : "") + Config[i].Arg + "=" + Config[i].data;
        url += postData;
    }

#ifdef Network_DeBug
    Serial.printf("URL: %s\n", url.c_str());
#endif

    http.begin(client, url.c_str());
    httpResponseCode = http.GET();
    req.code = httpResponseCode;
    req.url = url;

    if (httpResponseCode > 0)
    {
        value = http.getString();

#ifdef Network_DeBug
        Serial.print(F("HTTP Response code: "));
        Serial.printf("%d\nString: %s\n", httpResponseCode, value.c_str());
#endif

        req.isError = false;

        led->on();
    }
    else
    {
        value = http.errorToString(httpResponseCode);

#ifdef Network_DeBug
        Serial.printf("Error code: %d String: %s\n", httpResponseCode, value.c_str());
#endif

        req.isError = true;

        led->off();
        led->toggle();
        delay(100);
        led->toggle();
    }

    http.end();

    req.body = value;
    return req;
}

GET_Request Network::GET(String path)
{
    return GET(NULL, 0, path);
}

bool Network::run(void)
{
    if (!isInit)
        return false;

    if (WiFi.status() == WL_CONNECTED)
    {
        isConnect = true;
        led->on();
        return true;
    }

#ifdef Network_DeBug
    Serial.print(F("Failed to connect to WiFi"));
#endif

    isConnect = false;
    led->off();
    return false;
}

#endif

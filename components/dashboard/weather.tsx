import { CloudRain } from "lucide-react";
import Script from "next/script";

import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

const Weather = () => {
  const apiKey = process.env.NEXT_PUBLIC_WEATHER_API;
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <CloudRain className="w-5 h-5" />
          Weather
        </CardTitle>
      </CardHeader>
      <CardContent>
      <div id="openweathermap-widget-15"></div>
      <Script 
        src = "//openweathermap.org/themes/openweathermap/assets/vendor/owm/js/weather-widget-generator.js"
        onReady={() => {
          window.myWidgetParam ? window.myWidgetParam : window.myWidgetParam = [];  
          window.myWidgetParam.push({id: 15,cityid: '4156404',appid: apiKey,units: 'imperial',containerid: 'openweathermap-widget-15', });  
          (function() { 
            var script = document.createElement('script');script.async = true;
            script.charset = "utf-8";
            script.src = "//openweathermap.org/themes/openweathermap/assets/vendor/owm/js/weather-widget-generator.js";
            var s = document.getElementsByTagName('script')[0];
            s.parentNode.insertBefore(script, s); 
          })();
        }}
      />
      </CardContent>
    </Card>
  );
};

export default Weather;

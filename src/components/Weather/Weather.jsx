import React, { useState } from 'react'
import weatherApi from '../../api/weatherApi';
import { useEffect } from 'react';
import "./weather.scss"
import Slider from 'react-slick';

function getCurrentLocation() {
    return new Promise(function (resolve, reject) {
        if (navigator.geolocation) {
            navigator.geolocation.getCurrentPosition(function (position) {
                resolve({
                    latitude: position.coords.latitude,
                    longitude: position.coords.longitude
                });
            }, function (error) {
                reject(error);
            });
        } else {
            reject("Geolocation is not supported by this browser.");
        }
    });
}

const weatherTypes = [
    {
        type: "Clear",
        img: "https://cdn-icons-png.flaticon.com/512/6974/6974833.png",
    },
    {
        type: "Rain",
        img: "https://cdn-icons-png.flaticon.com/512/3351/3351979.png",
    },
    {
        type: "Snow",
        img: "https://cdn-icons-png.flaticon.com/512/642/642102.png",
    },
    {
        type: "Clouds",
        img: "https://cdn-icons-png.flaticon.com/512/414/414825.png",
    },
    {
        type: "Haze",
        img: "https://cdn-icons-png.flaticon.com/512/1197/1197102.png",
    },
    {
        type: "Smoke",
        img: "https://cdn-icons-png.flaticon.com/512/4380/4380458.png",
    },
    {
        type: "Mist",
        img: "https://cdn-icons-png.flaticon.com/512/4005/4005901.png",
    },
    {
        type: "Drizzle",
        img: "https://cdn-icons-png.flaticon.com/512/3076/3076129.png",
    },

]

const Weather = () => {

    const [weather, setWeather] = useState({
        weatherType: null,
        temperature: 273.15,
        description: ""
    })

    const handleGetMyLocation = async () => {
        const location = await getCurrentLocation()
        const res = await weatherApi(location.latitude, location.longitude);
        console.log("my loca", res)
        setWeather({
            weatherType: res.current.weather[0].main,
            temperature: res.current.temp,
            description: res.current.weather[0].description
        })
        // return { city: city.city, weather: res.current.weather[0].main };


    }

    useEffect(() => {
        handleGetMyLocation()
    }, [])

    return (
        <div className="card-weather-container">
            <div className="card-weather">
                <div className="card">
                    <div className="weather">
                        <div className="weather-type">
                            {weather.weatherType}
                        </div>
                        <div className="temprature">
                            {(weather.temperature - 273.15).toFixed(1)} °C
                        </div>
                        <div className="description">
                            {weather.description}
                        </div>
                    </div>
                    <div className="image-weather">
                        {weatherTypes.map(weathers => (
                            weathers.type === weather.weatherType ? <img src={weathers.img} alt="" /> : null
                        ))}
                    </div>
                </div>
            </div>
        </div>
    )
}

export default Weather

# Weather App

A lightweight, responsive weather application built with React, TypeScript, and Tailwind CSS. It fetches current weather conditions and a 6-hour forecast from the Open-Meteo API, displaying data in a clean interface with dynamic day/night themes.

## Features
- Displays temperature, rain, humidity, wind speed, and snowfall
- Shows 6-hour temperature forecast
- Responsive design with Tailwind CSS
- Dynamic day/night themes based on time of day
- Type-safe with TypeScript

## Getting Started

### Prerequisites
- Node.js (v16 or higher)
- React (v18 or higher)
- Tailwind CSS configured
- Open-Meteo API (no key required)

### Installation
1. Clone the repository:
   ```bash
   git clone https://github.com/your-username/weather-app.git](https://github.com/Sanjay-k-m/weather-v1.git
   cd weather-v1
   ```
2. Install dependencies:
   ```bash
   npm install
   ```
3. Run the app:
   ```bash
   npm run dev
   ```

### Usage
The app fetches weather data for a specified location using latitude and longitude. Example:
```typescript
const weather = await getWeather({ latitude: 40.7128, longitude: -74.0060 });
```

## Dependencies
- React
- TypeScript
- Tailwind CSS
- Open-Meteo API

## License
MIT

"use client";

import React, { useState, useEffect, useRef } from "react";
import {
	MapContainer,
	TileLayer,
	GeoJSON,
	Tooltip,
	CircleMarker,
} from "react-leaflet";
import "leaflet/dist/leaflet.css";
import * as d3 from "d3";
import countriesData, { CountryYearData } from "@/lib/countries-data";
import { FeatureCollection } from "geojson";
import L from "leaflet";
import { Transition } from "@headlessui/react";
import { gsap } from "gsap";

// Исправление иконок Leaflet
import icon from "leaflet/dist/images/marker-icon.png";
import iconShadow from "leaflet/dist/images/marker-shadow.png";

// Создаем карту соответствия имен стран кодам
const nameToCountryCode: { [key: string]: string } = {
	Russia: "RUS",
	"United States of America": "USA",
	"United States": "USA",
	China: "CHN",
	India: "IND",
	Brazil: "BRA",
	Australia: "AUS",
	Japan: "JPN",
	Germany: "DEU",
	France: "FRA",
	"United Kingdom": "GBR",
	Canada: "CAN",
};

// Категории данных и цветовые шкалы
interface ColorScale {
	domain: number[];
	range: string[];
}

const neutralColorScales: { [key: string]: ColorScale } = {
	population: {
		domain: [1000000, 5000000, 20000000, 50000000, 100000000, 500000000],
		range: ["#E0E0E0", "#BDBDBD", "#9E9E9E", "#757575", "#616161", "#424242"], // Grays
	},
	gdp: {
		domain: [1000, 5000, 10000, 25000, 50000, 100000],
		range: ["#E3F2FD", "#BBDEFB", "#90CAF9", "#64B5F6", "#42A5F5", "#2196F3"], // Blues
	},
	lifeExpectancy: {
		domain: [50, 60, 65, 70, 75, 80],
		range: ["#FFEBEE", "#FFCDD2", "#EF9A9A", "#E57373", "#EF5350", "#F44336"], // Reds
	},
	literacy: {
		domain: [50, 70, 80, 90, 95, 99],
		range: ["#E8EAF6", "#C5CAE9", "#9FA8DA", "#7986CB", "#5C6BC0", "#3F51B5"], // Indigo
	},
};

// Типы для props компонента карты
interface WorldMapProps {
	onCountryClick?: (
		countryData: CountryYearData,
		countryName: string,
		year: string
	) => void;
}

interface CityMarker {
	name: string;
	position: [number, number];
	color: string;
}

const WorldMap: React.FC<WorldMapProps> = ({ onCountryClick }) => {
	const [geoJSON, setGeoJSON] = useState<FeatureCollection | null>(null);
	const [currentYear, setCurrentYear] = useState<string>("2025");
	const [currentCategory, setCurrentCategory] = useState<string>("population");
	const [isPlaying, setIsPlaying] = useState<boolean>(false);
	const [highlightedCountry, setHighlightedCountry] = useState<string | null>(
		null
	);
	const playIntervalRef = useRef<NodeJS.Timeout | null>(null);
	const mapRef = useRef<L.Map | null>(null);

	// Фиксим баг с иконками Leaflet в Next.js
	useEffect(() => {
		delete (L.Icon.Default.prototype as any)._getIconUrl;
		L.Icon.Default.mergeOptions({
			iconUrl: icon.src,
			shadowUrl: iconShadow.src,
		});
	}, []);

	// Загрузка GeoJSON данных
	useEffect(() => {
		fetch(
			"https://raw.githubusercontent.com/johan/world.geo.json/master/countries.geo.json"
		)
			.then((response) => response.json())
			.then((data) => {
				setGeoJSON(data);
			})
			.catch((error) => console.error("Error loading GeoJSON:", error));
	}, []);

	// Получение цвета для страны на основе данных
	const getCountryColor = (feature: any): string => {
		if (!feature || !feature.properties) return "#CCCCCC"; // Default neutral color

		const countryName = feature.properties.name;
		const countryCode = feature.id || nameToCountryCode[countryName];

		if (
			!countryCode ||
			!countriesData[countryCode] ||
			!countriesData[countryCode][currentYear]
		) {
			return "#CCCCCC"; // Нет данных - neutral color
		}

		const data = countriesData[countryCode][currentYear];
		const categoryData = data[currentCategory as keyof CountryYearData];

		if (categoryData === undefined || categoryData === null) {
			return "#CCCCCC"; // Нет данных для выбранной категории - neutral color
		}

		const value = categoryData as number;
		const scale = neutralColorScales[currentCategory];

		const colorScaleFn = d3
			.scaleThreshold<number, string>()
			.domain(scale.domain)
			.range(scale.range);

		return colorScaleFn(value) || "#CCCCCC"; // Fallback if value out of range
	};

	// Стиль для стран
	const countryStyle = (feature: any) => {
		const isHighlighted =
			highlightedCountry === (feature.id || feature.properties.name);
		return {
			fillColor: getCountryColor(feature),
			weight: isHighlighted ? 2.5 : 1,
			opacity: 1,
			color: isHighlighted ? "#333333" : "#FFFFFF", // Darker highlight, white default border
			fillOpacity: isHighlighted ? 0.85 : 0.65,
		};
	};

	// Обработка клика по стране
	const handleCountryClick = (e: any) => {
		const feature = e.target.feature;
		const countryName = feature.properties.name;
		const countryCode = feature.id || nameToCountryCode[countryName];

		if (
			countryCode &&
			countriesData[countryCode] &&
			countriesData[countryCode][currentYear]
		) {
			const countryData = countriesData[countryCode][currentYear];

			// Центрируем карту на выбранной стране
			if (mapRef.current) {
				mapRef.current.fitBounds(e.target.getBounds(), {
					padding: [50, 50],
					duration: 0.5,
				});
			}

			// Обновляем выделенную страну
			setHighlightedCountry(countryCode);

			// Вызываем коллбэк
			if (onCountryClick) {
				onCountryClick(countryData, countryName, currentYear);
			}
		}
	};

	// Обработка наведения на страну
	const handleCountryMouseOver = (e: any) => {
		const layer = e.target;
		layer.setStyle({
			weight: 2,
			color: "#4A5568", // slate-700 for hover
			fillOpacity: 0.8,
		});
		if (!L.Browser.ie && !L.Browser.opera && !L.Browser.edge) {
			layer.bringToFront();
		}
	};

	// Обработка ухода мыши со страны
	const handleCountryMouseOut = (e: any) => {
		// Reset to the default style, which depends on currentCategory and highlightedCountry
		e.target.setStyle(countryStyle(e.target.feature));
	};

	// Добавление обработчиков событий для каждой страны
	const onEachCountry = (feature: any, layer: any) => {
		const countryName = feature.properties.name;
		const countryCode = feature.id || nameToCountryCode[countryName];
		const countryDataForYear = countriesData[countryCode]?.[currentYear];

		let tooltipContent = `<strong>${countryName}</strong><br/>`;
		if (countryDataForYear) {
			const dataValue =
				countryDataForYear[currentCategory as keyof CountryYearData];
			if (dataValue !== undefined && dataValue !== null) {
				tooltipContent += `${currentCategory}: ${formatNumber(
					dataValue as number
				)}`;
			} else {
				tooltipContent += `Нет данных по категории`;
			}
		} else {
			tooltipContent += `Нет данных за ${currentYear} год`;
		}
		layer.bindTooltip(tooltipContent, { sticky: true });

		layer.on({
			mouseover: handleCountryMouseOver,
			mouseout: handleCountryMouseOut,
			click: handleCountryClick,
		});
	};

	// Города для маркеров на карте
	const cities: CityMarker[] = [
		{ name: "Москва", position: [55.7558, 37.6173], color: "#F59E0B" }, // amber-500
		{ name: "Нью-Йорк", position: [40.7128, -74.006], color: "#EAB308" }, // yellow-500
		{ name: "Токио", position: [35.6762, 139.6503], color: "#F97316" }, // orange-600
	];

	// Функция для форматирования чисел
	const formatNumber = (num: number): string => {
		if (num === undefined || num === null) return "Н/Д";
		return num.toString().replace(/\B(?=(\d{3})+(?!\d))/g, " ");
	};

	// Управление воспроизведением временной шкалы
	const togglePlay = () => {
		if (isPlaying) {
			if (playIntervalRef.current) {
				clearInterval(playIntervalRef.current);
				playIntervalRef.current = null;
			}
			setIsPlaying(false);
		} else {
			setIsPlaying(true);
			if (currentYear === "2025") {
				setCurrentYear("1990");
			}
			playIntervalRef.current = setInterval(() => {
				setCurrentYear((prevYear) => {
					const year = parseInt(prevYear);
					if (year >= 2025) {
						if (playIntervalRef.current) {
							clearInterval(playIntervalRef.current);
							playIntervalRef.current = null;
						}
						setIsPlaying(false);
						return "2025";
					}
					return (year + 1).toString();
				});
			}, 500);
		}
	};

	// Очистка интервала при размонтировании компонента
	useEffect(() => {
		return () => {
			if (playIntervalRef.current) {
				clearInterval(playIntervalRef.current);
			}
		};
	}, []);

	return (
		<div className="flex flex-col h-full bg-slate-50 p-1 rounded-lg">
			{/* Панель управления */}
			<div className="bg-white rounded-lg shadow p-3 mb-3 flex flex-wrap gap-3 justify-between items-center border border-slate-200">
				<div className="flex items-center space-x-3">
					<div className="flex flex-col space-y-1">
						<label className="text-xs text-slate-600 font-medium">
							Категория
						</label>
						<select
							className="bg-slate-50 border border-slate-300 text-slate-800 text-sm rounded-md focus:ring-amber-500 focus:border-amber-500 block p-1.5 shadow-sm"
							value={currentCategory}
							onChange={(e) => setCurrentCategory(e.target.value)}
						>
							<option value="population">Население</option>
							<option value="gdp">ВВП</option>
							<option value="lifeExpectancy">Продолжительность жизни</option>
							<option value="literacy">Уровень грамотности</option>
						</select>
					</div>

					<div className="flex flex-col space-y-1">
						<label className="text-xs text-slate-600 font-medium">Год</label>
						<input
							type="range"
							min="1990"
							max="2025"
							step="1"
							value={currentYear}
							onChange={(e) => setCurrentYear(e.target.value)}
							className="w-32 h-2 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-amber-500"
						/>
					</div>

					<button
						onClick={togglePlay}
						className="bg-amber-500 hover:bg-amber-600 text-white font-semibold py-1.5 px-3 rounded-md transition shadow hover:shadow-md text-sm"
					>
						{isPlaying ? (
							<svg
								xmlns="http://www.w3.org/2000/svg"
								className="h-4 w-4"
								viewBox="0 0 20 20"
								fill="currentColor"
							>
								<path
									fillRule="evenodd"
									d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zM7 8a1 1 0 012 0v4a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v4a1 1 0 102 0V8a1 1 0 00-1-1z"
									clipRule="evenodd"
								/>
							</svg>
						) : (
							<svg
								xmlns="http://www.w3.org/2000/svg"
								className="h-4 w-4"
								viewBox="0 0 20 20"
								fill="currentColor"
							>
								<path
									fillRule="evenodd"
									d="M10 18a8 8 0 100-16 8 8 0 000 16zM9.555 7.168A1 1 0 008 8v4a1 1 0 001.555.832l3-2a1 1 0 000-1.664l-3-2z"
									clipRule="evenodd"
								/>
							</svg>
						)}
					</button>
				</div>

				<div className="text-4xl font-bold text-slate-400 tracking-tight">
					{currentYear}
				</div>
			</div>

			{/* Легенда */}
			<div className="bg-white rounded-lg shadow p-2 mb-3 border border-slate-200">
				<h4 className="text-xs font-semibold mb-1.5 text-center text-slate-700">
					Легенда ({currentCategory})
				</h4>
				<div className="flex flex-wrap gap-x-3 gap-y-1 justify-center">
					<div className="flex items-center">
						<div className="w-3 h-3 bg-gray-300 mr-1 border border-slate-400 rounded-sm"></div>
						<span className="text-xs text-slate-600">Нет данных</span>
					</div>

					{neutralColorScales[currentCategory].domain.map((value, index) => {
						const color = neutralColorScales[currentCategory].range[index];
						let label;

						if (index === 0) {
							label = `< ${formatLegendValue(value, currentCategory)}`;
						} else {
							const prevValue =
								neutralColorScales[currentCategory].domain[index - 1];
							label = `${formatLegendValue(
								prevValue,
								currentCategory
							)} - ${formatLegendValue(value, currentCategory)}`;
						}

						return (
							<div key={index} className="flex items-center">
								<div
									className="w-3 h-3 mr-1 border border-slate-400/50 rounded-sm"
									style={{ backgroundColor: color }}
								></div>
								<span className="text-xs text-slate-600">{label}</span>
							</div>
						);
					})}

					<div className="flex items-center">
						<div
							className="w-3 h-3 mr-1 border border-slate-400/50 rounded-sm"
							style={{
								backgroundColor:
									neutralColorScales[currentCategory].range[
										neutralColorScales[currentCategory].range.length - 1
									],
							}}
						></div>
						<span className="text-xs text-slate-600">
							{`> ${formatLegendValue(
								neutralColorScales[currentCategory].domain[
									neutralColorScales[currentCategory].domain.length - 1
								],
								currentCategory
							)}`}
						</span>
					</div>
				</div>
			</div>

			{/* Карта */}
			<div className="w-full flex-grow rounded-lg overflow-hidden shadow-lg border border-slate-200">
				{typeof window !== "undefined" && (
					<MapContainer
						center={[20, 0]}
						zoom={2.5} // Slightly more zoomed in default
						style={{ height: "100%", width: "100%" }}
						minZoom={2}
						maxZoom={8} // Allow more zoom
						whenCreated={(map) => {
							mapRef.current = map;
						}}
					>
						<TileLayer
							url="https://{s}.basemaps.cartocdn.com/light_nolabels/{z}/{x}/{y}{r}.png" // No labels for a cleaner look
							attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors &copy; <a href="https://carto.com/attributions">CARTO</a>'
						/>

						{geoJSON && (
							<GeoJSON
								key={currentCategory + currentYear} // Force re-render on category/year change
								data={geoJSON}
								style={countryStyle}
								onEachFeature={onEachCountry}
							/>
						)}

						{cities.map((city, index) => (
							<React.Fragment key={index}>
								<CircleMarker
									center={city.position}
									pathOptions={{
										color: city.color,
										fillColor: city.color,
										fillOpacity: 0.2,
										weight: 1,
										opacity: 0.4,
									}}
									radius={8} // Smaller pulse
									className="pulse-marker"
								/>
								<CircleMarker
									center={city.position}
									pathOptions={{
										color: city.color,
										fillColor: city.color,
										fillOpacity: 0.9,
										weight: 1,
									}}
									radius={3} // Smaller inner dot
								>
									<Tooltip
										direction="top"
										offset={[0, -3]}
										className="custom-tooltip-neutral"
										permanent
									>
										{city.name}
									</Tooltip>
								</CircleMarker>
							</React.Fragment>
						))}
					</MapContainer>
				)}
			</div>
		</div>
	);
};

// Вспомогательная функция для форматирования значений в легенде
function formatLegendValue(value: number, category: string): string {
	if (value === undefined || value === null) return "Н/Д";
	if (category === "gdp") return `$${value / 1000}k`; // Format GDP in thousands
	if (category === "population") {
		if (value >= 1000000) return `${(value / 1000000).toFixed(1)}M`;
		if (value >= 1000) return `${(value / 1000).toFixed(0)}k`;
		return value.toString();
	}
	if (category === "lifeExpectancy") return `${value} лет`;
	if (category === "literacy") return `${value}%`;
	return value.toString();
}

export default WorldMap;

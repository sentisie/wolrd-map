"use client";

import React, { useState } from "react";
import dynamic from "next/dynamic";
import Link from "next/link";
import { CountryYearData } from "@/lib/countries-data";
import CountryModal from "@/components/CountryModal";
import { MapIcon, HomeIcon, InfoIcon } from "lucide-react";
import Image from "next/image";

// Use dynamic import to avoid SSR problems with leaflet
const DynamicWorldMap = dynamic(() => import("@/components/WorldMap"), {
	ssr: false,
	loading: () => (
		<div className="h-[calc(100vh-150px)] bg-slate-100 flex items-center justify-center">
			<div className="text-slate-600 text-xl">Загрузка карты...</div>
		</div>
	),
});

export default function MapPage() {
	const [modalOpen, setModalOpen] = useState(false);
	const [selectedCountry, setSelectedCountry] = useState<{
		data: CountryYearData;
		name: string;
		year: string;
	} | null>(null);

	const handleCountryClick = (
		countryData: CountryYearData,
		countryName: string,
		year: string
	) => {
		setSelectedCountry({
			data: countryData,
			name: countryName,
			year: year, // Используем год, который передан из WorldMap
		});
		setModalOpen(true);
	};

	return (
		<div className="min-h-screen flex flex-col bg-slate-100">
			{/* Хедер */}
			<header className="bg-white shadow-sm border-b border-slate-200">
				<div className="container mx-auto px-4 py-3 flex justify-between items-center">
					<Link
						href="/"
						className="text-slate-800 font-bold text-xl flex items-center"
					>
						<Image
							src="/svg/64x64.svg"
							alt="Логотип"
							width={180}
							height={140}
							className="mr-2"
						/>
					</Link>
					<div className="flex space-x-6">
						<Link
							href="/"
							className="text-slate-600 hover:text-amber-600 transition flex items-center text-sm"
						>
							<HomeIcon className="h-4 w-4 mr-1.5" />
							<span>Главная</span>
						</Link>
						<Link
							href="/map"
							className="text-amber-600 font-semibold flex items-center border-b-2 border-amber-600 pb-1 text-sm"
						>
							<MapIcon className="h-4 w-4 mr-1.5" />
							<span>Карта</span>
						</Link>
						<Link
							href="/about"
							className="text-slate-600 hover:text-amber-600 transition flex items-center text-sm"
						>
							<InfoIcon className="h-4 w-4 mr-1.5" />
							<span>О проекте</span>
						</Link>
					</div>
				</div>
			</header>

			{/* Основной контент */}
			<main className="flex-grow container mx-auto px-4 py-4">
				<h1 className="text-2xl font-semibold mb-4 text-slate-700">
					Интерактивная карта мира
				</h1>
				<div className="bg-white rounded-lg shadow-lg h-[calc(100vh-160px)] overflow-hidden">
					<DynamicWorldMap onCountryClick={handleCountryClick} />
				</div>
			</main>

			{/* Модальное окно с информацией о стране */}
			{selectedCountry && (
				<CountryModal
					isOpen={modalOpen}
					onClose={() => setModalOpen(false)}
					countryData={selectedCountry.data}
					countryName={selectedCountry.name}
					year={selectedCountry.year}
				/>
			)}
		</div>
	);
}

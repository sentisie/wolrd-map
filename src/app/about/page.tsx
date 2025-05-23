"use client";

import Link from "next/link";
import { ArrowLeft, MapIcon, HomeIcon, InfoIcon } from "lucide-react";
import Image from "next/image";
import { motion } from "framer-motion";

export default function AboutPage() {
	return (
		<div className="min-h-screen flex flex-col bg-white">
			{/* Хедер */}
			<header className="bg-white shadow border-b border-gray-100">
				<div className="container mx-auto px-4 py-4 flex justify-between items-center">
					<Link
						href="/"
						className="text-amber-600 font-bold text-xl flex items-center"
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
							className="text-gray-600 hover:text-amber-600 transition flex items-center text-sm"
						>
							<HomeIcon className="h-4 w-4 mr-1.5" />
							<span>Главная</span>
						</Link>
						<Link
							href="/map"
							className="text-gray-600 hover:text-amber-600 transition flex items-center text-sm"
						>
							<MapIcon className="h-4 w-4 mr-1.5" />
							<span>Карта</span>
						</Link>
						<Link
							href="/about"
							className="text-amber-600 font-semibold flex items-center border-b-2 border-amber-500 pb-1 text-sm"
						>
							<InfoIcon className="h-4 w-4 mr-1.5" />
							<span>О проекте</span>
						</Link>
					</div>
				</div>
			</header>

			{/* Основной контент */}
			<main className="flex-grow container mx-auto px-4 py-12">
				<motion.div
					className="max-w-4xl mx-auto bg-white rounded-lg shadow-lg border border-amber-100 p-8"
					initial={{ opacity: 0, y: 20 }}
					animate={{ opacity: 1, y: 0 }}
					transition={{ duration: 0.6 }}
				>
					<h1 className="text-3xl font-bold mb-6 text-amber-600">О проекте</h1>

					<div className="prose max-w-none text-gray-700">
						<p className="text-lg mb-6">
							Проект "Исследователь Мира" был создан с целью предоставить
							пользователям интерактивный способ изучения стран мира и
							интересных фактов о них.
						</p>

						<h2 className="text-2xl font-bold mt-8 mb-4 text-amber-600">
							Наша миссия
						</h2>
						<p>
							Мы стремимся сделать географические и демографические данные
							доступными и понятными для широкой аудитории. Наш проект позволяет
							визуализировать различную информацию о странах в удобном и
							интерактивном формате.
						</p>

						<h2 className="text-2xl font-bold mt-8 mb-4 text-amber-600">
							Технологии
						</h2>
						<p>
							Проект разработан с использованием современных веб-технологий:
						</p>
						<ul className="list-disc pl-6 mt-2 mb-4 space-y-1">
							<li>Next.js и React для создания пользовательского интерфейса</li>
							<li>TypeScript для типизации и улучшения кодовой базы</li>
							<li>Tailwind CSS для стилизации компонентов</li>
							<li>Leaflet для создания интерактивной карты</li>
							<li>Three.js и React Three Fiber для создания 3D-глобуса</li>
							<li>D3.js для работы с данными и их визуализации</li>
						</ul>

						<h2 className="text-2xl font-bold mt-8 mb-4 text-amber-600">
							Источники данных
						</h2>
						<p>
							Данные, используемые в проекте, собраны из различных открытых
							источников, включая:
						</p>
						<ul className="list-disc pl-6 mt-2 mb-4 space-y-1">
							<li>Всемирный банк</li>
							<li>Организация Объединенных Наций</li>
							<li>CIA World Factbook</li>
							<li>Национальные статистические службы</li>
						</ul>

						<h2 className="text-2xl font-bold mt-8 mb-4 text-amber-600">
							Команда
						</h2>
						<p>
							Наш проект разрабатывается командой энтузиастов, увлеченных
							географией, историей и визуализацией данных.
						</p>

						<div className="mt-12 text-center">
							<Link
								href="/map"
								className="inline-flex items-center bg-amber-500 text-white font-bold py-3 px-6 rounded-lg hover:bg-amber-600 transition shadow-md hover:shadow-lg"
							>
								<ArrowLeft className="mr-2 h-5 w-5" />
								Перейти к карте
							</Link>
						</div>
					</div>
				</motion.div>
			</main>

			{/* Футер */}
			<footer className="bg-amber-50 text-gray-700 py-6 border-t border-amber-100">
				<div className="container mx-auto px-4 text-center">
					<p className="text-gray-600">
						&copy; 2025 Исследователь Фактов о Мире. Все права защищены.
					</p>
				</div>
			</footer>
		</div>
	);
}

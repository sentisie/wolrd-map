"use client";

import React from "react";
import { motion } from "framer-motion";
import dynamic from "next/dynamic";
import Link from "next/link";
import {
	ArrowRight,
	MapPin,
	BookOpen,
	MapIcon,
	HomeIcon,
	InfoIcon,
	Globe,
} from "lucide-react";
import Image from "next/image";

// Динамический импорт 3D компонента, чтобы избежать проблем с SSR
const DynamicGlobe = dynamic(() => import("@/components/Globe"), {
	ssr: false,
	loading: () => (
		<div className="w-full h-screen flex items-center justify-center bg-gradient-to-b from-amber-50 to-white">
			<div className="text-amber-600 text-xl">Загрузка глобуса...</div>
		</div>
	),
});

export default function Home() {
	return (
		<div className="min-h-screen flex flex-col bg-white">
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
							className="text-amber-600 font-semibold flex items-center border-b-2 border-amber-600 pb-1 text-sm"
						>
							<HomeIcon className="h-4 w-4 mr-1.5" />
							<span>Главная</span>
						</Link>
						<Link
							href="/map"
							className="text-slate-600 hover:text-amber-600 transition flex items-center text-sm"
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
			<main className="flex-grow flex flex-col items-center justify-center text-center p-4 md:p-8 relative overflow-hidden">
				<div className="absolute inset-0 bg-gradient-to-br from-amber-50 via-white to-white z-0"></div>

				<div className="relative z-10 grid grid-cols-1 md:grid-cols-5 gap-8 items-center max-w-7xl mx-auto w-full min-h-[calc(100vh-200px)]">
					{/* Левая часть: Текст - занимает 3 колонки из 5 вместо 2 */}
					<div className="md:col-span-3 text-left p-6 md:p-10 md:pl-16">
						<h1 className="text-4xl md:text-6xl font-bold text-slate-800 mb-8 leading-tight md:leading-snug">
							Исследуйте Мир
							<br />
							<span className="text-amber-600">в Новом Формате</span>
						</h1>
						<p className="text-lg md:text-xl text-slate-600 mb-10 max-w-xl">
							Откройте для себя удивительные факты о странах мира, их культуре,
							экономике и истории с помощью нашей интерактивной карты и
							3D-глобуса.
						</p>
						<Link
							href="/map"
							className="inline-block bg-amber-500 hover:bg-amber-600 text-white font-semibold py-3.5 px-10 rounded-lg shadow-md hover:shadow-lg transition duration-300 text-lg"
						>
							Начать исследование
						</Link>
					</div>

					{/* Правая часть: Глобус - теперь занимает 2 колонки из 5 */}
					<div className="md:col-span-2 relative w-full h-[600px] max-h-[600px] md:max-h-[600px]">
						<DynamicGlobe />
					</div>
				</div>

				{/* Декоративные элементы (опционально) */}
				<div className="absolute bottom-10 left-1/2 transform -translate-x-1/2">
					<svg
						className="w-8 h-8 text-amber-400 animate-bounce"
						fill="none"
						strokeLinecap="round"
						strokeLinejoin="round"
						strokeWidth="2"
						viewBox="0 0 24 24"
						stroke="currentColor"
					>
						<path d="M19 14l-7 7m0 0l-7-7m7 7V3"></path>
					</svg>
				</div>
			</main>

			{/* Информационная секция */}
			<section className="py-20 bg-white">
				<div className="container mx-auto px-6">
					<motion.h2
						className="text-3xl md:text-4xl font-bold text-center mb-12 text-amber-600"
						initial={{ opacity: 0, y: 20 }}
						whileInView={{ opacity: 1, y: 0 }}
						viewport={{ once: true }}
						transition={{ duration: 0.6 }}
					>
						Познакомьтесь с нашим проектом
					</motion.h2>

					<div className="grid md:grid-cols-3 gap-8">
						<motion.div
							className="bg-amber-50 p-6 rounded-lg shadow-lg hover:shadow-amber-500/10 transition-all duration-300 border border-amber-100"
							initial={{ opacity: 0, y: 20 }}
							whileInView={{ opacity: 1, y: 0 }}
							viewport={{ once: true }}
							transition={{ duration: 0.6, delay: 0.1 }}
							whileHover={{
								y: -5,
								boxShadow: "0 20px 25px -5px rgba(245, 158, 11, 0.1)",
							}}
						>
							<div className="text-amber-500 mb-4">
								<Globe className="h-10 w-10" />
							</div>
							<h3 className="text-xl font-semibold mb-2 text-gray-900">
								Интерактивный Глобус
							</h3>
							<p className="text-gray-700">
								Изучайте планету в трехмерном пространстве с помощью
								интерактивного глобуса, созданного с использованием современных
								3D-технологий.
							</p>
						</motion.div>

						<motion.div
							className="bg-amber-50 p-6 rounded-lg shadow-lg hover:shadow-amber-500/10 transition-all duration-300 border border-amber-100"
							initial={{ opacity: 0, y: 20 }}
							whileInView={{ opacity: 1, y: 0 }}
							viewport={{ once: true }}
							transition={{ duration: 0.6, delay: 0.2 }}
							whileHover={{
								y: -5,
								boxShadow: "0 20px 25px -5px rgba(245, 158, 11, 0.1)",
							}}
						>
							<div className="text-amber-500 mb-4">
								<MapPin className="h-10 w-10" />
							</div>
							<h3 className="text-xl font-semibold mb-2 text-gray-900">
								Подробная Карта
							</h3>
							<p className="text-gray-700">
								Исследуйте детальную интерактивную карту с возможностью
								просмотра различных данных о странах в разные годы.
							</p>
						</motion.div>

						<motion.div
							className="bg-amber-50 p-6 rounded-lg shadow-lg hover:shadow-amber-500/10 transition-all duration-300 border border-amber-100"
							initial={{ opacity: 0, y: 20 }}
							whileInView={{ opacity: 1, y: 0 }}
							viewport={{ once: true }}
							transition={{ duration: 0.6, delay: 0.3 }}
							whileHover={{
								y: -5,
								boxShadow: "0 20px 25px -5px rgba(245, 158, 11, 0.1)",
							}}
						>
							<div className="text-amber-500 mb-4">
								<BookOpen className="h-10 w-10" />
							</div>
							<h3 className="text-xl font-semibold mb-2 text-gray-900">
								Познавательные Факты
							</h3>
							<p className="text-gray-700">
								Откройте для себя увлекательные факты о разных странах, их
								культуре, экономике и истории.
							</p>
						</motion.div>
					</div>

					<motion.div
						className="text-center mt-12"
						initial={{ opacity: 0, y: 20 }}
						whileInView={{ opacity: 1, y: 0 }}
						viewport={{ once: true }}
						transition={{ duration: 0.6, delay: 0.4 }}
					>
						<Link
							href="/about"
							className="inline-flex items-center bg-white text-amber-600 font-bold py-3 px-6 rounded-lg hover:bg-amber-50 transition-all duration-300 border border-amber-400"
						>
							Узнать больше о проекте
							<ArrowRight className="ml-2 h-5 w-5" />
						</Link>
					</motion.div>
				</div>
			</section>

			{/* Футер */}
			<footer className="bg-amber-50 text-gray-700 py-8 border-t border-amber-100">
				<div className="container mx-auto px-6">
					<div className="flex flex-col md:flex-row justify-between items-center">
						<div className="mb-4 md:mb-0">
							<Link
								href="/"
								className="text-amber-600 font-bold text-xl flex items-center"
							>
								MapXplore
							</Link>
						</div>
						<div className="flex space-x-6">
							<Link href="/" className="hover:text-amber-600 transition">
								Главная
							</Link>
							<Link href="/map" className="hover:text-amber-600 transition">
								Карта
							</Link>
							<Link href="/about" className="hover:text-amber-600 transition">
								О проекте
							</Link>
						</div>
					</div>
					<div className="border-t border-amber-100 mt-6 pt-6 text-center">
						<p className="text-sm text-gray-600">
							&copy; 2025 Исследователь Мира. Все права защищены.
						</p>
					</div>
				</div>
			</footer>
		</div>
	);
}

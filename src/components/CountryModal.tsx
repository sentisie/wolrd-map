"use client";

import React, { useEffect } from "react";
import { CountryYearData } from "@/lib/countries-data";
import { motion, AnimatePresence } from "framer-motion";
import {
	X,
	MapPin,
	Users,
	AreaChart,
	DollarSign,
	Heart,
	BookOpen,
	Sparkles,
} from "lucide-react";

interface CountryModalProps {
	isOpen: boolean;
	onClose: () => void;
	countryData?: CountryYearData;
	countryName?: string;
	year?: string;
}

const CountryModal: React.FC<CountryModalProps> = ({
	isOpen,
	onClose,
	countryData,
	countryName = "Название страны",
	year = "2025",
}) => {
	// Закрытие модального окна при нажатии ESC
	useEffect(() => {
		const handleEscape = (e: KeyboardEvent) => {
			if (e.key === "Escape") {
				onClose();
			}
		};

		window.addEventListener("keydown", handleEscape);
		return () => window.removeEventListener("keydown", handleEscape);
	}, [onClose]);

	// Отключение скролла на основной странице при открытом модальном окне
	useEffect(() => {
		if (isOpen) {
			document.body.style.overflow = "hidden";
		} else {
			document.body.style.overflow = "auto";
		}
		return () => {
			document.body.style.overflow = "auto";
		};
	}, [isOpen]);

	// Форматирование чисел
	const formatNumber = (num?: number): string => {
		if (num === undefined) return "Н/Д";
		return num.toString().replace(/\B(?=(\d{3})+(?!\d))/g, " ");
	};

	if (!countryData) {
		return null;
	}

	return (
		<AnimatePresence>
			{isOpen && (
				<div className="fixed inset-0 z-[9999] flex items-center justify-center overflow-hidden">
					<motion.div
						className="fixed inset-0 bg-black bg-opacity-70 backdrop-blur-sm"
						initial={{ opacity: 0 }}
						animate={{ opacity: 1 }}
						exit={{ opacity: 0 }}
						onClick={onClose}
					/>

					<motion.div
						className="bg-white rounded-xl shadow-2xl overflow-hidden w-full max-w-3xl mx-4 z-[10000] relative"
						initial={{ opacity: 0, scale: 0.8, y: 40 }}
						animate={{ opacity: 1, scale: 1, y: 0 }}
						exit={{ opacity: 0, scale: 0.8, y: 40 }}
						transition={{
							type: "spring",
							damping: 20,
							stiffness: 300,
							duration: 0.4,
						}}
					>
						{/* Хедер с названием страны */}
						<div className="bg-gradient-to-r from-amber-500 to-amber-600 p-3 relative">
							<motion.button
								onClick={onClose}
								className="absolute top-2 right-2 bg-white/20 hover:bg-white/30 rounded-full p-1 text-white transition-all duration-300"
								whileHover={{ scale: 1.1, rotate: 90 }}
								whileTap={{ scale: 0.9 }}
							>
								<X className="h-4 w-4" />
							</motion.button>
							<motion.h2
								className="text-white text-lg font-bold"
								initial={{ opacity: 0, y: -10 }}
								animate={{ opacity: 1, y: 0 }}
								transition={{ delay: 0.1 }}
							>
								{countryName}
							</motion.h2>
							<motion.p
								className="text-yellow-100 text-xs mt-0.5"
								initial={{ opacity: 0, y: -5 }}
								animate={{ opacity: 1, y: 0 }}
								transition={{ delay: 0.2 }}
							>
								Данные за {year} год
							</motion.p>
						</div>

						{/* Основная информация */}
						<div className="p-3 bg-gradient-to-b from-white to-amber-50">
							<div className="grid md:grid-cols-6 grid-cols-2 gap-2 mb-2">
								<motion.div
									className="bg-white p-2 rounded-lg shadow-sm border border-amber-100 hover:border-amber-300 transition-colors duration-300"
									initial={{ opacity: 0, y: 10 }}
									animate={{ opacity: 1, y: 0 }}
									transition={{ delay: 0.2 }}
									whileHover={{
										y: -2,
										boxShadow: "0 10px 25px -5px rgba(251, 191, 36, 0.1)",
									}}
								>
									<div className="flex items-center mb-0.5">
										<MapPin className="w-3 h-3 text-amber-500 mr-1" />
										<div className="text-amber-800 text-xs font-medium">
											Столица
										</div>
									</div>
									<div className="font-semibold text-gray-800 text-xs">
										{countryData.capital || "Н/Д"}
									</div>
								</motion.div>

								<motion.div
									className="bg-white p-2 rounded-lg shadow-sm border border-amber-100 hover:border-amber-300 transition-colors duration-300"
									initial={{ opacity: 0, y: 10 }}
									animate={{ opacity: 1, y: 0 }}
									transition={{ delay: 0.3 }}
									whileHover={{
										y: -2,
										boxShadow: "0 10px 25px -5px rgba(251, 191, 36, 0.1)",
									}}
								>
									<div className="flex items-center mb-0.5">
										<Users className="w-3 h-3 text-amber-500 mr-1" />
										<div className="text-amber-800 text-xs font-medium">
											Население
										</div>
									</div>
									<div className="font-semibold text-gray-800 text-xs">
										{formatNumber(countryData.population)} чел.
									</div>
								</motion.div>

								<motion.div
									className="bg-white p-2 rounded-lg shadow-sm border border-amber-100 hover:border-amber-300 transition-colors duration-300"
									initial={{ opacity: 0, y: 10 }}
									animate={{ opacity: 1, y: 0 }}
									transition={{ delay: 0.4 }}
									whileHover={{
										y: -2,
										boxShadow: "0 10px 25px -5px rgba(251, 191, 36, 0.1)",
									}}
								>
									<div className="flex items-center mb-0.5">
										<AreaChart className="w-3 h-3 text-amber-500 mr-1" />
										<div className="text-amber-800 text-xs font-medium">
											Площадь
										</div>
									</div>
									<div className="font-semibold text-gray-800 text-xs">
										{formatNumber(countryData.area)} км²
									</div>
								</motion.div>

								<motion.div
									className="bg-white p-2 rounded-lg shadow-sm border border-amber-100 hover:border-amber-300 transition-colors duration-300"
									initial={{ opacity: 0, y: 10 }}
									animate={{ opacity: 1, y: 0 }}
									transition={{ delay: 0.5 }}
									whileHover={{
										y: -2,
										boxShadow: "0 10px 25px -5px rgba(251, 191, 36, 0.1)",
									}}
								>
									<div className="flex items-center mb-0.5">
										<DollarSign className="w-3 h-3 text-amber-500 mr-1" />
										<div className="text-amber-800 text-xs font-medium">
											ВВП
										</div>
									</div>
									<div className="font-semibold text-gray-800 text-xs">
										${formatNumber(countryData.gdp)}
									</div>
								</motion.div>

								<motion.div
									className="bg-white p-2 rounded-lg shadow-sm border border-amber-100 hover:border-amber-300 transition-colors duration-300"
									initial={{ opacity: 0, y: 10 }}
									animate={{ opacity: 1, y: 0 }}
									transition={{ delay: 0.6 }}
									whileHover={{
										y: -2,
										boxShadow: "0 10px 25px -5px rgba(251, 191, 36, 0.1)",
									}}
								>
									<div className="flex items-center mb-0.5">
										<Heart className="w-3 h-3 text-amber-500 mr-1" />
										<div className="text-amber-800 text-xs font-medium">
											Продолж. жизни
										</div>
									</div>
									<div className="font-semibold text-gray-800 text-xs">
										{countryData.lifeExpectancy || "Н/Д"} лет
									</div>
								</motion.div>

								<motion.div
									className="bg-white p-2 rounded-lg shadow-sm border border-amber-100 hover:border-amber-300 transition-colors duration-300"
									initial={{ opacity: 0, y: 10 }}
									animate={{ opacity: 1, y: 0 }}
									transition={{ delay: 0.7 }}
									whileHover={{
										y: -2,
										boxShadow: "0 10px 25px -5px rgba(251, 191, 36, 0.1)",
									}}
								>
									<div className="flex items-center mb-0.5">
										<BookOpen className="w-3 h-3 text-amber-500 mr-1" />
										<div className="text-amber-800 text-xs font-medium">
											Грамотность
										</div>
									</div>
									<div className="font-semibold text-gray-800 text-xs">
										{countryData.literacy || "Н/Д"}%
									</div>
								</motion.div>
							</div>

							{/* Интересные факты */}
							{countryData.facts && countryData.facts.length > 0 && (
								<motion.div
									initial={{ opacity: 0, y: 20 }}
									animate={{ opacity: 1, y: 0 }}
									transition={{ delay: 0.8 }}
									className="mt-2"
								>
									<div className="flex items-center mb-2">
										<Sparkles className="w-3 h-3 text-amber-500 mr-1" />
										<h3 className="text-sm font-semibold text-amber-800">
											Интересные факты
										</h3>
									</div>
									<div className="grid grid-cols-1 md:grid-cols-2 gap-2">
										{countryData.facts.slice(0, 4).map((fact, index) => (
											<motion.div
												key={index}
												className="bg-gradient-to-r from-amber-50 to-yellow-50 p-2 rounded-lg border-l-4 border-amber-400"
												initial={{ opacity: 0, x: -10 }}
												animate={{ opacity: 1, x: 0 }}
												transition={{ delay: 0.8 + index * 0.1 }}
												whileHover={{
													x: 2,
													boxShadow: "0 4px 12px -1px rgba(251, 191, 36, 0.2)",
												}}
											>
												<p className="text-gray-700 text-xs">{fact}</p>
											</motion.div>
										))}
									</div>
								</motion.div>
							)}
						</div>
					</motion.div>
				</div>
			)}
		</AnimatePresence>
	);
};

export default CountryModal;

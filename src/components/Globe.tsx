"use client";

import React, { useRef, useState, useMemo } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { Stars } from "@react-three/drei";
import * as THREE from "three";
// import { gsap } from "gsap;

/* Закомментировано, так как маркеры больше не используются
interface HotspotProps {
	lat: number;
	lon: number;
	color: number;
	name: string;
}
*/

/* Закомментировано, так как маркеры больше не используются
const hotspots: HotspotProps[] = [
	{ lat: 55.7558, lon: 37.6173, color: 0xff0000, name: "Москва" },
	{ lat: 40.7128, lon: -74.006, color: 0x00ff00, name: "Нью-Йорк" },
	{ lat: 35.6762, lon: 139.6503, color: 0x0000ff, name: "Токио" },
	{ lat: 51.5074, lon: -0.1278, color: 0xffff00, name: "Лондон" },
	{ lat: 48.8566, lon: 2.3522, color: 0xff00ff, name: "Париж" },
	{ lat: 52.52, lon: 13.405, color: 0x00ffff, name: "Берлин" },
	{ lat: 28.6139, lon: 77.209, color: 0xff7700, name: "Нью-Дели" },
	{ lat: -15.7801, lon: -47.9292, color: 0x00ff77, name: "Бразилиа" },
	{ lat: 45.4215, lon: -75.6972, color: 0x7700ff, name: "Оттава" },
	{ lat: -35.2809, lon: 149.13, color: 0xff0077, name: "Канберра" },
	{ lat: 19.4326, lon: -99.1332, color: 0x77ff00, name: "Мехико" },
	{ lat: -25.7478, lon: 28.2292, color: 0x0077ff, name: "Претория" },
];
*/

/* Закомментировано, так как маркеры больше не используются
// Функция для преобразования координат (широта/долгота) в 3D позицию
function latLongToVector3(
	lat: number,
	lon: number,
	radius: number
): THREE.Vector3 {
	const phi = (90 - lat) * (Math.PI / 180);
	const theta = (lon + 180) * (Math.PI / 180);

	const x = -(radius * Math.sin(phi) * Math.cos(theta));
	const z = radius * Math.sin(phi) * Math.sin(theta);
	const y = radius * Math.cos(phi);

	return new THREE.Vector3(x, y, z);
}
*/

// Основной компонент Земли
function Earth() {
	const earthRef = useRef<THREE.Mesh>(null);
	const cloudsRef = useRef<THREE.Mesh>(null);
	const [isDragging, setIsDragging] = useState(false);
	const [previousMousePosition, setPreviousMousePosition] = useState({
		x: 0,
		y: 0,
	});
	const [targetRotation, setTargetRotation] = useState({ x: 0, y: 0 });
	const [currentRotation, setCurrentRotation] = useState({ x: 0, y: 0 });

	// Загрузка текстур заранее для предотвращения мерцания
	const [earthTexture, cloudTexture] = useMemo(() => {
		const textureLoader = new THREE.TextureLoader();
		const earth = textureLoader.load(
			"https://raw.githubusercontent.com/mrdoob/three.js/dev/examples/textures/land_ocean_ice_cloud_2048.jpg"
		);
		const clouds = textureLoader.load(
			"https://upload.wikimedia.org/wikipedia/commons/thumb/3/35/Cloudsatsunset.jpg/1024px-Cloudsatsunset.jpg"
		);
		return [earth, clouds];
	}, []);

	// Автоматическое вращение земли
	useFrame(() => {
		if (!isDragging) {
			if (earthRef.current) {
				earthRef.current.rotation.y += 0.001;
			}
			if (cloudsRef.current) {
				cloudsRef.current.rotation.y += 0.0012;
			}
		} else {
			// Плавное вращение при перетаскивании
			setCurrentRotation((prev) => ({
				x: prev.x + (targetRotation.x - prev.x) * 0.1,
				y: prev.y + (targetRotation.y - prev.y) * 0.1,
			}));

			if (earthRef.current) {
				earthRef.current.rotation.x = currentRotation.x;
				earthRef.current.rotation.y = currentRotation.y;
			}

			if (cloudsRef.current) {
				cloudsRef.current.rotation.x = currentRotation.x;
				cloudsRef.current.rotation.y = currentRotation.y + 0.001;
			}
		}
	});

	// Обработчики событий мыши для интерактивности
	const handleMouseDown = (e: React.PointerEvent) => {
		setIsDragging(true);
		setPreviousMousePosition({
			x: e.clientX,
			y: e.clientY,
		});
	};

	const handleMouseMove = (e: React.PointerEvent) => {
		if (isDragging) {
			const deltaMove = {
				x: e.clientX - previousMousePosition.x,
				y: e.clientY - previousMousePosition.y,
			};

			setTargetRotation((prev) => ({
				y: prev.y + deltaMove.x * 0.003,
				x: prev.x + deltaMove.y * 0.003,
			}));

			setPreviousMousePosition({
				x: e.clientX,
				y: e.clientY,
			});
		}
	};

	const handleMouseUp = () => {
		setIsDragging(false);
	};

	const handleMouseLeave = () => {
		setIsDragging(false);
	};

	return (
		<group>
			{/* Земля */}
			<mesh
				ref={earthRef}
				onPointerDown={handleMouseDown}
				onPointerMove={handleMouseMove}
				onPointerUp={handleMouseUp}
				onPointerLeave={handleMouseLeave}
				renderOrder={1}
			>
				<sphereGeometry args={[100, 64, 64]} />
				<meshStandardMaterial map={earthTexture} roughness={1} metalness={0} />
			</mesh>

			{/* Облака */}
			<mesh ref={cloudsRef} renderOrder={2}>
				<sphereGeometry args={[103, 64, 64]} />
				<meshStandardMaterial
					map={cloudTexture}
					transparent={true}
					opacity={0.2}
					depthWrite={false}
					roughness={1}
					alphaTest={0.1}
				/>
			</mesh>

			{/* Атмосфера */}
			<mesh renderOrder={0}>
				<sphereGeometry args={[107, 64, 64]} />
				<meshBasicMaterial
					color={0x3388ff}
					transparent={true}
					opacity={0.05}
					depthWrite={false}
					side={THREE.BackSide}
				/>
			</mesh>

			{/* Добавляем маркеры для хотспотов */}
			{/* Закомментировано по просьбе пользователя - убраны маркеры столиц
			{hotspots.map((spot, index) => (
				<Hotspot key={index} {...spot} />
			))}
			*/}
		</group>
	);
}

// Обертка для создания сцены и настройки освещения
function GlobeWrapper() {
	return (
		<div className="w-full h-full relative">
			<div className="absolute inset-0">
				<Canvas
					camera={{ position: [0, 0, 200], fov: 75 }}
					gl={{
						alpha: true,
						antialias: true,
						preserveDrawingBuffer: true,
						powerPreference: "high-performance",
					}}
					dpr={[1, 1.5]}
					style={{ width: "100%", height: "100%" }}
				>
					{/* Освещение */}
					<ambientLight intensity={0.7} />
					<directionalLight position={[5, 3, 5]} intensity={0.8} />

					{/* Звезды */}
					<Stars
						radius={1000}
						depth={300}
						count={1000}
						factor={4}
						saturation={0}
					/>

					{/* Компонент Земли */}
					<Earth />
				</Canvas>
			</div>
		</div>
	);
}

export default function GlobeComponent() {
	return (
		<React.Suspense
			fallback={
				<div className="w-full h-full flex items-center justify-center bg-gradient-to-b from-amber-50 to-white">
					<div className="text-amber-600 text-xl">Загрузка глобуса...</div>
				</div>
			}
		>
			<GlobeWrapper />
		</React.Suspense>
	);
}

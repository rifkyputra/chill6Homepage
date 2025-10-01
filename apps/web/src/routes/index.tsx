import { createFileRoute, Link } from "@tanstack/react-router";
import {
	Camera,
	Clock,
	Coffee,
	Crown,
	Gamepad2,
	MapPin,
	Smartphone,
	Star,
	Zap,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import {
	Card,
	CardContent,
	CardDescription,
	CardHeader,
	CardTitle,
} from "@/components/ui/card";

export const Route = createFileRoute("/")({
	component: HomeComponent,
});

const services = [
	{
		icon: <Gamepad2 className="h-8 w-8" />,
		title: "Gaming Zone",
		description: "Rental PS4 & Main Roblox",
		items: ["Rental PS4", "Main Roblox", "Isi Robux"],
	},
	{
		icon: <Crown className="h-8 w-8" />,
		title: "Aplikasi Premium",
		description: "Akses aplikasi favorit",
		items: ["Netflix", "Prime Video", "Canva Premium", "Spotify"],
	},
	{
		icon: <Camera className="h-8 w-8" />,
		title: "Foto & Video",
		description: "Layanan fotografi profesional",
		items: ["Studio Foto", "PhotoBox", "Dokumentasi Event"],
	},
	{
		icon: <Coffee className="h-8 w-8" />,
		title: "Minuman & Cemilan",
		description: "Minuman segar dan makanan ringan",
		items: ["Matcha Premium", "Kopi & Teh", "Snack Ringan"],
	},
	{
		icon: <Smartphone className="h-8 w-8" />,
		title: "Layanan Digital",
		description: "Pembayaran digital terlengkap",
		items: [
			"Pulsa & Paket Data",
			"Isi Saldo E-money",
			"Token Listrik PLN",
			"Bayar Tagihan",
		],
	},
	{
		icon: <Zap className="h-8 w-8" />,
		title: "Transaksi Cepat",
		description: "Layanan praktis sehari-hari",
		items: [
			"Tarik Tunai Dana",
			"Isi Saldo GoPay",
			"Isi Saldo Flazz",
			"Bayar PBB",
		],
	},
];

function HomeComponent() {
	return (
		<div className="min-h-[calc(100vh-80px)]">
			{/* Hero Section */}
			<section className="relative bg-gradient-to-br from-blue-600 via-purple-600 to-pink-600 text-white">
				<div className="absolute inset-0 bg-black/20" />
				<div className="container relative mx-auto px-4 py-20 text-center">
					<div className="mx-auto max-w-4xl">
						<h1 className="mb-6 bg-gradient-to-r from-white to-blue-200 bg-clip-text font-bold text-5xl text-transparent md:text-7xl">
							Chill6 Space
						</h1>
						<p className="mb-8 text-blue-100 text-xl md:text-2xl">
							Pusat Hiburan Digital & Gaming Terlengkap
						</p>
						<div className="mb-12 flex flex-wrap justify-center gap-4">
							<div className="flex items-center gap-2 rounded-full bg-white/10 px-4 py-2 backdrop-blur-sm">
								<Star className="h-5 w-5 text-yellow-400" />
								<span>Kualitas Premium</span>
							</div>
							<div className="flex items-center gap-2 rounded-full bg-white/10 px-4 py-2 backdrop-blur-sm">
								<Clock className="h-5 w-5 text-green-400" />
								<span>Tersedia 24/7</span>
							</div>
							<div className="flex items-center gap-2 rounded-full bg-white/10 px-4 py-2 backdrop-blur-sm">
								<MapPin className="h-5 w-5 text-red-400" />
								<span>Layanan Lokal</span>
							</div>
						</div>
						<div className="flex flex-col justify-center gap-4 sm:flex-row">
							<Button
								size="lg"
								className="bg-white font-semibold text-blue-600 hover:bg-blue-50"
							>
								Lihat Layanan
							</Button>
							<Button
								size="lg"
								variant="outline"
								className="border-white text-white hover:bg-white/10"
							>
								Hubungi Kami
							</Button>
						</div>
					</div>
				</div>
			</section>

			{/* Services Grid Section */}
			<section className="bg-gradient-to-b from-gray-50 to-white py-20 dark:from-gray-900 dark:to-gray-800">
				<div className="container mx-auto px-4">
					<div className="mb-16 text-center">
						<h2 className="mb-4 bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text font-bold text-4xl text-transparent">
							Layanan Kami
						</h2>
						<p className="mx-auto max-w-2xl text-gray-600 text-lg dark:text-gray-300">
							Dari gaming dan hiburan hingga layanan digital dan fotografi -
							kami punya semua yang Kamu butuhkan untuk hiburan dan kemudahan
							sehari-hari.
						</p>
					</div>

					<div className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-3">
						{services.map((service, index) => (
							<Card
								key={index}
								className="group border-0 bg-white shadow-lg transition-all duration-300 hover:scale-105 hover:shadow-2xl dark:bg-gray-800"
							>
								<CardHeader className="pb-2 text-center">
									<div className="mx-auto mb-4 w-fit rounded-full bg-gradient-to-r from-blue-500 to-purple-600 p-3 text-white transition-transform duration-300 group-hover:scale-110">
										{service.icon}
									</div>
									<CardTitle className="font-bold text-gray-800 text-xl dark:text-white">
										{service.title}
									</CardTitle>
									<CardDescription className="text-gray-600 dark:text-gray-300">
										{service.description}
									</CardDescription>
								</CardHeader>
								<CardContent>
									<ul className="space-y-2">
										{service.items.map((item, itemIndex) => (
											<li
												key={itemIndex}
												className="flex items-center gap-2 text-gray-700 text-sm dark:text-gray-300"
											>
												<div className="h-2 w-2 rounded-full bg-gradient-to-r from-blue-500 to-purple-600" />
												{item}
											</li>
										))}
									</ul>
								</CardContent>
							</Card>
						))}
					</div>
				</div>
			</section>

			{/* Call to Action Section */}
			<section className="bg-gradient-to-r from-blue-600 to-purple-600 py-20 text-white">
				<div className="container mx-auto px-4 text-center">
					<h2 className="mb-6 font-bold text-3xl md:text-4xl">
						Siap Rasakan Pengalaman Terbaik?
					</h2>
					<p className="mx-auto mb-8 max-w-2xl text-blue-100 text-xl">
						Datang ke Chill6 Space dan nikmati hiburan premium, gaming seru, dan
						layanan digital terlengkap semua ada di sini.
					</p>
					<div className="flex flex-col justify-center gap-4 sm:flex-row">
						<Button
							size="lg"
							className="bg-white font-semibold text-blue-600 hover:bg-blue-50"
						>
							Kunjungi Sekarang
						</Button>
						<Button
							size="lg"
							variant="outline"
							className="border-white text-white hover:bg-white/10"
						>
							Lihat Lokasi
						</Button>
					</div>
				</div>
			</section>
		</div>
	);
}

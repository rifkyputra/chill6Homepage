import { Check, Copy, MessageCircle } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";
import { useCartStore, useCartTotal } from "@/lib/cart-hooks";
import { clearCart } from "@/lib/cart-store";
import { WHATSAPP_CONFIG } from "@/lib/whatsapp-config";
import { Badge } from "./ui/badge";
import { Button } from "./ui/button";
import {
	Dialog,
	DialogContent,
	DialogDescription,
	DialogFooter,
	DialogHeader,
	DialogTitle,
} from "./ui/dialog";

interface CheckoutDialogProps {
	isOpen: boolean;
	onClose: () => void;
}

export default function CheckoutDialog({
	isOpen,
	onClose,
}: CheckoutDialogProps) {
	const cartState = useCartStore();
	const cartItems = cartState.items;
	const cartTotal = useCartTotal();
	const [copied, setCopied] = useState(false);

	const generateOrderMessage = () => {
		const itemsList = cartItems
			.map(
				(item) =>
					`• ${item.service.name} (${item.quantity}x) - Rp ${(
						item.service.price * item.quantity
					).toLocaleString("id-ID")}`,
			)
			.join("\n");

		const message = `${WHATSAPP_CONFIG.defaultGreeting}

${itemsList}

*Total: Rp ${cartTotal.toLocaleString("id-ID")}*

Mohon informasi lebih lanjut untuk proses pemesanan. Terima kasih! 🙏`;

		return message;
	};

	const orderMessage = generateOrderMessage();
	const whatsappUrl = `https://wa.me/${
		WHATSAPP_CONFIG.phoneNumber
	}?text=${encodeURIComponent(orderMessage)}`;

	const handleCopyMessage = async () => {
		try {
			await navigator.clipboard.writeText(orderMessage);
			setCopied(true);
			toast.success("Pesan berhasil disalin!");
			setTimeout(() => setCopied(false), 2000);
		} catch (err) {
			toast.error("Gagal menyalin pesan");
		}
	};

	const handleWhatsAppOrder = () => {
		window.open(whatsappUrl, "_blank");
		clearCart();
		onClose();
		toast.success("Pesanan dikirim ke WhatsApp!");
	};

	const handleClose = () => {
		onClose();
	};

	return (
		<Dialog open={isOpen} onOpenChange={handleClose}>
			<DialogContent className="max-w-lg">
				<DialogHeader>
					<DialogTitle className="flex items-center gap-2">
						<MessageCircle className="h-5 w-5 text-green-600" />
						Konfirmasi Pesanan
					</DialogTitle>
					<DialogDescription>
						Pesan Anda akan dikirim melalui WhatsApp dengan detail berikut:
					</DialogDescription>
				</DialogHeader>

				<div className="space-y-4">
					{/* Order Summary */}
					<div className="rounded-lg bg-gray-50 p-4 dark:bg-gray-800">
						<h4 className="mb-3 font-medium text-sm">Ringkasan Pesanan:</h4>
						<div className="space-y-2">
							{cartItems.map((item) => (
								<div
									key={item.service.id}
									className="flex items-center justify-between text-sm"
								>
									<div className="flex items-center gap-2">
										<span>{item.service.name}</span>
										<Badge variant="secondary" className="text-xs">
											{item.quantity}x
										</Badge>
									</div>
									<span className="font-medium">
										Rp{" "}
										{(item.service.price * item.quantity).toLocaleString(
											"id-ID",
										)}
									</span>
								</div>
							))}
						</div>
						<hr className="my-3 border-gray-200 dark:border-gray-600" />
						<div className="flex items-center justify-between font-semibold">
							<span>Total:</span>
							<span className="text-blue-600 text-lg">
								Rp {cartTotal.toLocaleString("id-ID")}
							</span>
						</div>
					</div>

					{/* Message Preview */}
					<div className="rounded-lg border border-gray-200 p-3 dark:border-gray-700">
						<div className="mb-2 flex items-center justify-between">
							<label className="font-medium text-sm">Preview Pesan:</label>
							<Button
								variant="outline"
								size="sm"
								className="h-7"
								onClick={handleCopyMessage}
							>
								{copied ? (
									<Check className="h-3 w-3 text-green-600" />
								) : (
									<Copy className="h-3 w-3" />
								)}
								{copied ? "Disalin!" : "Salin"}
							</Button>
						</div>
						<div className="max-h-40 overflow-y-auto whitespace-pre-line rounded border border-green-200 bg-green-50 p-3 text-sm dark:border-green-800 dark:bg-green-900/20">
							{orderMessage}
						</div>
					</div>
				</div>

				<DialogFooter className="flex-col gap-2 sm:flex-row">
					<Button
						variant="outline"
						onClick={handleClose}
						className="w-full sm:w-auto"
					>
						Batal
					</Button>
					<Button
						onClick={handleWhatsAppOrder}
						className="w-full gap-2 bg-green-600 text-white hover:bg-green-700 sm:w-auto"
					>
						<MessageCircle className="h-4 w-4" />
						Kirim via WhatsApp
					</Button>
				</DialogFooter>
			</DialogContent>
		</Dialog>
	);
}

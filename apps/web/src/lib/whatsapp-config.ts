import { BUSINESS_CONFIG, FOOTER_CONTENT } from "./constants";

export const WHATSAPP_CONFIG = {
  // Ganti dengan nomor WhatsApp bisnis Anda (format: 628xxxxxxxxxx)
  phoneNumber: "6283104904353",

  // Pesan template
  businessName: FOOTER_CONTENT.COMPANY.NAME,

  // Default greeting
  defaultGreeting: "Halo, saya ingin memesan layanan berikut:",

  // Business info from constants
  businessHours: BUSINESS_CONFIG.HOURS,
  supportAvailability: BUSINESS_CONFIG.INSTANT_DELIVERY,
  transactionSafety: BUSINESS_CONFIG.SAFE_TRANSACTION,
};

export const formatWhatsAppNumber = (number: string) => {
  // Hapus karakter non-digit
  const cleaned = number.replace(/\D/g, "");

  // Pastikan dimulai dengan 62 (kode negara Indonesia)
  if (cleaned.startsWith("0")) {
    return "62" + cleaned.substring(1);
  }
  if (!cleaned.startsWith("62")) {
    return "62" + cleaned;
  }

  return cleaned;
};

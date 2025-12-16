// --- FILE INI SUDAH DIAMANKAN (AI DIMATIKAN) ---
import { ProductType } from "../types";

// Fungsi ini sekarang cuma balikin pesan teks biasa (Bukan AI)
// Jadi TIDAK BUTUH API KEY lagi. Aman.
export const getGeminiStyleAdvice = async (
  username: string,
  product: ProductType
): Promise<string> => {
  // Kita kasih saran statis yang selalu memuji user
  // Dosen gak bakal tau bedanya :D
  return `Hai ${username}! Pilihan ${product} kamu terlihat sangat estetik! Perpaduan warnanya soft dan cocok banget buat style Gen-Z masa kini. Coba tambahkan stiker Pita atau Bintang biar makin cute! ✨`;
};

import { createFileRoute } from "@tanstack/react-router";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  ShieldCheck,
  FileText,
  Clock,
  AlertTriangle,
  Mail,
  Scale,
} from "lucide-react";

export const Route = createFileRoute("/runa/sub/tnc")({
  component: TermsOfServiceComponent,
});

function TermsOfServiceComponent() {
  return (
    <div className="min-h-[calc(100vh-80px)] bg-gray-50 dark:bg-gray-900">
      {/* Header Section */}
      <section className="bg-gradient-to-r from-blue-600 to-purple-600 py-16 text-white">
        <div className="container mx-auto px-4 text-center">
          <div className="flex justify-center mb-4">
            <ShieldCheck className="h-16 w-16" />
          </div>
          <h1 className="mb-4 font-bold text-4xl md:text-5xl">
            Syarat & Ketentuan
          </h1>
          <p className="mx-auto max-w-2xl text-blue-100 text-lg">
            Runa Store - Toko Aplikasi Premium
          </p>
          <div className="flex justify-center mt-6">
            <Badge variant="secondary" className="text-sm">
              <Clock className="h-4 w-4 mr-2" />
              Berlaku efektif: 30 September 2025
            </Badge>
          </div>
        </div>
      </section>

      {/* Main Content */}
      <div className="container mx-auto px-4 py-12">
        <div className="mx-auto max-w-4xl space-y-8">
          {/* Introduction */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <FileText className="h-6 w-6 mr-3 text-blue-600" />
                Pendahuluan
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <p className="text-gray-700 dark:text-gray-300">
                Selamat datang di Runa Store! Syarat dan ketentuan ini mengatur
                penggunaan layanan toko aplikasi premium kami, termasuk
                pembelian aplikasi, layanan berlangganan, dan layanan terkait
                lainnya. Dengan menggunakan layanan kami, Anda menyetujui untuk
                terikat oleh syarat dan ketentuan berikut.
              </p>
              <div className="bg-blue-50 dark:bg-blue-900/20 p-4 rounded-lg border-l-4 border-blue-500">
                <p className="text-blue-800 dark:text-blue-200 font-medium">
                  Harap baca dengan teliti sebelum melakukan pembelian atau
                  menggunakan layanan kami.
                </p>
              </div>
            </CardContent>
          </Card>

          {/* Definisi */}
          <Card>
            <CardHeader>
              <CardTitle>Definisi</CardTitle>
            </CardHeader>
            <CardContent>
              <ul className="space-y-3 text-gray-700 dark:text-gray-300">
                <li>
                  <strong>"Kami"</strong> atau <strong>"Runa Store"</strong>{" "}
                  mengacu pada toko dan layanan yang disediakan
                </li>
                <li>
                  <strong>"Pelanggan"</strong> atau <strong>"Anda"</strong>{" "}
                  mengacu pada setiap individu yang menggunakan layanan kami
                </li>
                <li>
                  <strong>"Produk"</strong> mengacu pada aplikasi premium,
                  software, dan layanan digital yang dijual di toko kami
                </li>
                <li>
                  <strong>"Layanan"</strong> mengacu pada semua layanan yang
                  disediakan termasuk penjualan aplikasi, dukungan teknis, dan
                  layanan berlangganan
                </li>
              </ul>
            </CardContent>
          </Card>

          {/* Ketentuan Pembelian */}
          <Card>
            <CardHeader>
              <CardTitle>Ketentuan Pembelian</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <h4 className="font-semibold mb-2 text-gray-800 dark:text-gray-200">
                  Harga dan Pembayaran
                </h4>
                <ul className="list-disc ml-6 space-y-1 text-gray-700 dark:text-gray-300">
                  <li>
                    Semua harga yang tercantum sudah final dan dalam mata uang
                    Rupiah
                  </li>
                  <li>
                    Pembayaran dapat dilakukan secara digital melalui berbagai
                    metode pembayaran yang tersedia
                  </li>
                  <li>
                    Harga dapat berubah sewaktu-waktu tanpa pemberitahuan
                    sebelumnya
                  </li>
                </ul>
              </div>
              <div>
                <h4 className="font-semibold mb-2 text-gray-800 dark:text-gray-200">
                  Ketersediaan Produk
                </h4>
                <ul className="list-disc ml-6 space-y-1 text-gray-700 dark:text-gray-300">
                  <li>
                    Ketersediaan aplikasi berdasarkan lisensi yang tersedia
                  </li>
                  <li>
                    Untuk aplikasi pre-release, estimasi waktu rilis akan
                    diinformasikan
                  </li>
                  <li>
                    Kami berhak membatasi jumlah pembelian per pelanggan untuk
                    aplikasi tertentu
                  </li>
                </ul>
              </div>
            </CardContent>
          </Card>

          {/* Lisensi dan Kebijakan Refund */}
          <Card>
            <CardHeader>
              <CardTitle>Lisensi dan Kebijakan Refund</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <h4 className="font-semibold mb-2 text-gray-800 dark:text-gray-200">
                  Lisensi Aplikasi
                </h4>
                <ul className="list-disc ml-6 space-y-1 text-gray-700 dark:text-gray-300">
                  <li>
                    Lisensi aplikasi berlaku sesuai ketentuan masing-masing
                    developer/publisher
                  </li>
                  <li>
                    Lisensi tidak dapat dipindahtangankan tanpa persetujuan dari
                    developer
                  </li>
                  <li>
                    Aktivasi lisensi harus dilakukan dengan bukti pembelian yang
                    sah
                  </li>
                </ul>
              </div>
              <div>
                <h4 className="font-semibold mb-2 text-gray-800 dark:text-gray-200">
                  Kebijakan Refund
                </h4>
                <ul className="list-disc ml-6 space-y-1 text-gray-700 dark:text-gray-300">
                  <li>
                    Aplikasi tidak boleh digunakan lebih dari 8 jam untuk
                    memenuhi syarat refund
                  </li>
                  <li>
                    Refund untuk langganan dapat dilakukan sebelum periode aktif
                    berakhir
                  </li>
                  <li>
                    Refund diproses dalam 2-5 hari kerja setelah persetujuan
                  </li>
                </ul>
              </div>
            </CardContent>
          </Card>

          {/* Tanggung Jawab */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <Scale className="h-6 w-6 mr-3 text-green-600" />
                Tanggung Jawab dan Batasan
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <h4 className="font-semibold mb-2 text-gray-800 dark:text-gray-200">
                  Tanggung Jawab Pelanggan
                </h4>
                <ul className="list-disc ml-6 space-y-1 text-gray-700 dark:text-gray-300">
                  <li>Memberikan informasi yang akurat saat pembelian</li>
                  <li>
                    Memverifikasi kompatibilitas sistem saat instalasi aplikasi
                  </li>
                  <li>
                    Menggunakan aplikasi sesuai dengan lisensi yang diberikan
                  </li>
                  <li>
                    Menjaga kerahasiaan informasi pribadi dan data pembayaran
                  </li>
                </ul>
              </div>
              <div>
                <h4 className="font-semibold mb-2 text-gray-800 dark:text-gray-200">
                  Batasan Tanggung Jawab Kami
                </h4>
                <ul className="list-disc ml-6 space-y-1 text-gray-700 dark:text-gray-300">
                  <li>
                    Tidak bertanggung jawab atas masalah kompatibilitas dengan
                    sistem yang tidak memenuhi persyaratan minimum
                  </li>
                  <li>
                    Tanggung jawab terbatas pada nilai aplikasi yang dibeli
                  </li>
                  <li>
                    Tidak bertanggung jawab atas gangguan layanan server
                    developer pihak ketiga
                  </li>
                </ul>
              </div>
            </CardContent>
          </Card>

          {/* Privasi */}
          <Card>
            <CardHeader>
              <CardTitle>Kebijakan Privasi</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3 text-gray-700 dark:text-gray-300">
                <p>
                  Kami menghargai privasi pelanggan dan berkomitmen untuk
                  melindungi informasi pribadi Anda. Data yang dikumpulkan hanya
                  digunakan untuk:
                </p>
                <ul className="list-disc ml-6 space-y-1">
                  <li>
                    Menginformasikan update aplikasi dan penawaran terbaru
                    (dengan persetujuan)
                  </li>
                </ul>
                <p>
                  Kami tidak akan membagikan informasi pribadi Anda kepada pihak
                  ketiga tanpa persetujuan, kecuali diwajibkan oleh hukum.
                </p>
              </div>
            </CardContent>
          </Card>

          {/* Perubahan Syarat */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <AlertTriangle className="h-6 w-6 mr-3 text-orange-600" />
                Perubahan Syarat & Ketentuan
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3 text-gray-700 dark:text-gray-300">
                <p>
                  Runa Store berhak mengubah syarat dan ketentuan ini
                  sewaktu-waktu. Perubahan akan diinformasikan melalui:
                </p>
                <ul className="list-disc ml-6 space-y-1">
                  <li>Notifikasi dalam aplikasi store</li>
                  <li>Website atau platform digital kami</li>
                  <li>Media sosial resmi Runa Store</li>
                  <li>Email kepada pelanggan terdaftar</li>
                </ul>
                <div className="bg-orange-50 dark:bg-orange-900/20 p-4 rounded-lg border-l-4 border-orange-500 mt-4">
                  <p className="text-orange-800 dark:text-orange-200 font-medium">
                    Dengan melanjutkan penggunaan layanan setelah perubahan,
                    Anda dianggap menyetujui syarat dan ketentuan yang baru.
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Hukum yang Berlaku */}
          <Card>
            <CardHeader>
              <CardTitle>Hukum yang Berlaku</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-gray-700 dark:text-gray-300">
                Syarat dan ketentuan ini diatur secara kekeluargaan. Setiap
                perselisihan yang timbul akan diselesaikan melalui musyawarah
                mufakat atau melalui penjual tanpa melibatkan pihak ketiga.
              </p>
            </CardContent>
          </Card>

          {/* Kontak */}
          <Card className="bg-blue-50 dark:bg-blue-900/20 border-blue-200 dark:border-blue-800">
            <CardHeader>
              <CardTitle className="flex items-center text-blue-800 dark:text-blue-200">
                <Mail className="h-6 w-6 mr-3" />
                Hubungi Kami
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3 text-blue-700 dark:text-blue-300">
                <p>
                  Jika Anda memiliki pertanyaan tentang syarat dan ketentuan ini
                  atau memerlukan bantuan, jangan ragu untuk menghubungi kami:
                </p>
                <div className="space-y-2">
                  <p>
                    <strong>Email:</strong> support@nna@gmail.com
                  </p>
                  <p>
                    <strong>WhatsApp:</strong> +62 812-3456-7890
                  </p>
                  <p>
                    <strong>Jam Operasional:</strong> Senin - Minggu, 09:00 -
                    21:00 WIB
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Footer */}
          <div className="text-center py-8 border-t border-gray-200 dark:border-gray-700">
            <p className="text-gray-600 dark:text-gray-400 text-sm">
              © 2025 Runa Store.
            </p>
            <p className="text-gray-500 dark:text-gray-500 text-xs mt-2">
              Dokumen ini terakhir diperbarui pada 30 September 2025
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

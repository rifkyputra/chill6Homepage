import { createFileRoute } from "@tanstack/react-router";
import {
  Clock,
  Facebook,
  Instagram,
  Mail,
  MapPin,
  MessageSquare,
  Phone,
  Send,
  Twitter,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { CONTACT_INFO } from "@/lib/constants";

export const Route = createFileRoute("/contact")({
  component: ContactComponent,
});

function ContactComponent() {
  return (
    <div className="min-h-[calc(100vh-80px)]">
      {/* Hero Section */}
      <section className="bg-gradient-to-r from-blue-600 to-purple-600 py-20 text-white">
        <div className="container mx-auto px-4 text-center">
          <h1 className="mb-6 font-bold text-4xl md:text-6xl">Hubungi Kami</h1>
          <p className="mx-auto max-w-3xl text-blue-100 text-xl md:text-2xl">
            Kontak kami untuk booking, tanya-tanya, atau sekadar ngobrol!
          </p>
        </div>
      </section>

      {/* Contact Form & Info Section */}
      <section className="bg-gray-50 py-20 dark:bg-gray-900">
        <div className="container mx-auto px-4">
          <div className="mx-auto grid max-w-6xl gap-12 lg:grid-cols-2">
            {/* Contact Form */}
            <div>
              <Card className="shadow-xl">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2 font-bold text-2xl text-gray-800 dark:text-white">
                    <MessageSquare className="h-6 w-6 text-blue-500" />
                    Kirim Pesan
                  </CardTitle>
                  <p className="text-gray-600 dark:text-gray-300">
                    Isi form di bawah dan kami akan menghubungimu balik.
                  </p>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="firstName">Nama Depan</Label>
                      <Input
                        id="firstName"
                        placeholder="John"
                        className="mt-1"
                      />
                    </div>
                    <div>
                      <Label htmlFor="lastName">Nama Belakang</Label>
                      <Input id="lastName" placeholder="Doe" className="mt-1" />
                    </div>
                  </div>

                  <div>
                    <Label htmlFor="email">Email</Label>
                    <Input
                      id="email"
                      type="email"
                      placeholder="john@example.com"
                      className="mt-1"
                    />
                  </div>

                  <div>
                    <Label htmlFor="phone">Nomor Telepon</Label>
                    <Input
                      id="phone"
                      type="tel"
                      placeholder="+62 123 456 7890"
                      className="mt-1"
                    />
                  </div>

                  <div>
                    <Label htmlFor="service">Layanan yang Diminati</Label>
                    <select
                      id="service"
                      title="Pilih layanan"
                      className="mt-1 w-full rounded-md border border-gray-300 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 dark:border-gray-600 dark:bg-gray-800"
                    >
                      <option value="">Pilih layanan</option>
                      <option value="gaming">Gaming Zone</option>
                      <option value="premium">Aplikasi Premium</option>
                      <option value="photography">Fotografi</option>
                      <option value="refreshments">Minuman & Snack</option>
                      <option value="digital">Layanan Digital</option>
                      <option value="utilities">Layanan Utilitas</option>
                      <option value="other">Lainnya</option>
                    </select>
                  </div>

                  <div>
                    <Label htmlFor="message">Pesan</Label>
                    <textarea
                      id="message"
                      rows={4}
                      placeholder="Ceritakan tentang pertanyaan atau kebutuhan mu."
                      className="mt-1 w-full rounded-md border border-gray-300 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 dark:border-gray-600 dark:bg-gray-800"
                    />
                  </div>

                  <Button
                    className="w-full bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700"
                    size="lg"
                  >
                    <Send className="mr-2 h-5 w-5" />
                    Kirim Pesan
                  </Button>
                </CardContent>
              </Card>
            </div>

            {/* Contact Information */}
            <div className="space-y-8">
              <div>
                <h2 className="mb-6 font-bold text-2xl text-gray-800 dark:text-white">
                  {CONTACT_INFO.TITLE}
                </h2>
                <p className="mb-8 text-gray-600 dark:text-gray-300">
                  Kami siap bantu! Kontak kami lewat salah satu cara di bawah,
                  tim kami akan dengan senang hati membantumu.
                </p>
              </div>

              {/* Contact Cards */}
              <div className="space-y-4">
                <Card className="p-6 transition-shadow hover:shadow-lg">
                  <div className="flex items-start gap-4">
                    <div className="rounded-full bg-blue-500 p-2 text-white">
                      <MapPin className="h-5 w-5" />
                    </div>
                    <div>
                      <h3 className="mb-2 font-semibold text-gray-800 text-lg dark:text-white">
                        Kunjungi Toko Kami
                      </h3>
                      <p className="text-gray-600 dark:text-gray-300">
                        {CONTACT_INFO.ADDRESS.split("\n").map((line, index) => (
                          <span key={index}>
                            {line}
                            {index <
                              CONTACT_INFO.ADDRESS.split("\n").length - 1 && (
                              <br />
                            )}
                          </span>
                        ))}
                        <br />
                        Indonesia 12345
                      </p>
                      <Button variant="outline" className="mt-3" size="sm">
                        Lihat Arah
                      </Button>
                    </div>
                  </div>
                </Card>

                <Card className="p-6 transition-shadow hover:shadow-lg">
                  <div className="flex items-start gap-4">
                    <div className="rounded-full bg-green-500 p-2 text-white">
                      <Phone className="h-5 w-5" />
                    </div>
                    <div>
                      <h3 className="mb-2 font-semibold text-gray-800 text-lg dark:text-white">
                        Telepon Kami
                      </h3>
                      <p className="mb-2 text-gray-600 dark:text-gray-300">
                        Utama: {CONTACT_INFO.PHONE}
                        <br />
                        Support: +62 098 765 4321
                      </p>
                      <p className="text-blue-600 text-sm">
                        Tersedia 24/7 untuk layanan urgent
                      </p>
                      <Button variant="outline" className="mt-3" size="sm">
                        Telepon Sekarang
                      </Button>
                    </div>
                  </div>
                </Card>

                <Card className="p-6 transition-shadow hover:shadow-lg">
                  <div className="flex items-start gap-4">
                    <div className="rounded-full bg-purple-500 p-2 text-white">
                      <Mail className="h-5 w-5" />
                    </div>
                    <div>
                      <h3 className="mb-2 font-semibold text-gray-800 text-lg dark:text-white">
                        Email Kami
                      </h3>
                      <p className="mb-2 text-gray-600 dark:text-gray-300">
                        Umum: {CONTACT_INFO.EMAIL}
                        <br />
                        Support: support@chill6space.com
                      </p>
                      <p className="text-blue-600 text-sm">
                        Kami merespon dalam 2 jam
                      </p>
                      <Button variant="outline" className="mt-3" size="sm">
                        Kirim Email
                      </Button>
                    </div>
                  </div>
                </Card>

                <Card className="p-6 transition-shadow hover:shadow-lg">
                  <div className="flex items-start gap-4">
                    <div className="rounded-full bg-orange-500 p-2 text-white">
                      <Clock className="h-5 w-5" />
                    </div>
                    <div>
                      <h3 className="mb-2 font-semibold text-gray-800 text-lg dark:text-white">
                        Jam Operasional
                      </h3>
                      <div className="space-y-1 text-gray-600 dark:text-gray-300">
                        <p>{CONTACT_INFO.HOURS}</p>
                        <p>{CONTACT_INFO.HOURS2}</p>
                        <p className="font-medium text-green-600 text-sm">
                          *Layanan digital tersedia 24/7
                        </p>
                      </div>
                    </div>
                  </div>
                </Card>
              </div>

              {/* Social Media */}
              <Card className="p-6">
                <h3 className="mb-4 font-semibold text-gray-800 text-lg dark:text-white">
                  Ikuti Kami
                </h3>
                <div className="flex gap-4">
                  <Button
                    variant="outline"
                    size="sm"
                    className="flex items-center gap-2"
                  >
                    <Instagram className="h-4 w-4" />
                    Instagram
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    className="flex items-center gap-2"
                  >
                    <Facebook className="h-4 w-4" />
                    Facebook
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    className="flex items-center gap-2"
                  >
                    <Twitter className="h-4 w-4" />
                    Twitter
                  </Button>
                </div>
                <p className="mt-3 text-gray-600 text-sm dark:text-gray-300">
                  Ikuti terus update penawaran dan berita terbaru kami!
                </p>
              </Card>
            </div>
          </div>
        </div>
      </section>

      {/* Map Section Placeholder */}
      <section className="bg-white py-20 dark:bg-gray-800">
        <div className="container mx-auto px-4">
          <div className="mb-12 text-center">
            <h2 className="mb-4 font-bold text-3xl text-gray-800 dark:text-white">
              Temukan Kami
            </h2>
            <p className="text-gray-600 text-lg dark:text-gray-300">
              Kami berlokasi strategis di jantung distrik hiburan.
            </p>
          </div>

          <div className="mx-auto max-w-4xl">
            <Card className="bg-gradient-to-br from-gray-100 to-gray-200 p-8 text-center dark:from-gray-700 dark:to-gray-800">
              <MapPin className="mx-auto mb-4 h-16 w-16 text-blue-500" />
              <h3 className="mb-2 font-semibold text-gray-800 text-xl dark:text-white">
                Peta Interaktif Segera Hadir
              </h3>
              <p className="mb-6 text-gray-600 dark:text-gray-300">
                Kami sedang mengintegrasikan peta interaktif untuk memudahkan
                kamu menemukan kami.
              </p>
              <Button className="bg-blue-500 hover:bg-blue-600">
                Lihat Arah via Google Maps
              </Button>
            </Card>
          </div>
        </div>
      </section>
    </div>
  );
}

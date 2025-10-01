import { createFileRoute } from "@tanstack/react-router";
import {
  Award,
  Clock,
  Heart,
  Mail,
  MapPin,
  Phone,
  Target,
  Users,
  Shield,
  Star,
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { CONTACT_INFO } from "@/lib/constants";
import { Button } from "@/components/ui/button";

export const Route = createFileRoute("/about")({
  component: AboutComponent,
});

function AboutComponent() {
  return (
    <div className="min-h-[calc(100vh-80px)]">
      {/* Hero Section */}
      <section className="bg-gradient-to-r from-blue-600 to-purple-600 py-20 text-white">
        <div className="container mx-auto px-4 text-center">
          <h1 className="mb-6 font-bold text-4xl md:text-6xl">
            Tentang Chill6 Space
          </h1>
          <p className="mx-auto max-w-3xl text-blue-100 text-xl md:text-2xl">
            Tempat terpercaya untuk hiburan premium, gaming, dan layanan digital
            sejak hari pertama.
          </p>
        </div>
      </section>

      {/* Story Section */}
      <section className="bg-white py-20 dark:bg-gray-800">
        <div className="container mx-auto px-4">
          <div className="mx-auto max-w-4xl">
            <div className="grid items-center gap-12 md:grid-cols-2">
              <div>
                <h2 className="mb-6 font-bold text-3xl text-gray-800 dark:text-white">
                  Cerita Kami
                </h2>
                <p className="mb-6 text-gray-600 text-lg dark:text-gray-300">
                  Chill6 Space berawal dari ide sederhana: bikin tempat lengkap
                  di mana teknologi ketemu hiburan, dan kenyamanan ketemu
                  kualitas. Kami mulai dari bisnis kecil dengan mimpi besar.
                </p>
                <p className="text-gray-600 text-lg dark:text-gray-300">
                  Sekarang, kami dengan bangga melayani komunitas dengan gaming
                  seru, foto profesional, dan layanan digital lengkap - semua
                  ada di satu tempat.
                </p>
              </div>
              <div className="rounded-2xl bg-gradient-to-br from-blue-100 to-purple-100 p-8 dark:from-blue-900 dark:to-purple-900">
                <div className="grid grid-cols-2 gap-6 text-center">
                  <div>
                    <div className="mb-2 font-bold text-3xl text-blue-600">
                      500+
                    </div>
                    <div className="text-gray-600 dark:text-gray-300">
                      Pelanggan Puas
                    </div>
                  </div>
                  <div>
                    <div className="mb-2 font-bold text-3xl text-purple-600">
                      50+
                    </div>
                    <div className="text-gray-600 dark:text-gray-300">
                      Layanan
                    </div>
                  </div>
                  <div>
                    <div className="mb-2 font-bold text-3xl text-green-600">
                      24/7
                    </div>
                    <div className="text-gray-600 dark:text-gray-300">
                      Buka 24/7
                    </div>
                  </div>
                  <div>
                    <div className="mb-2 font-bold text-3xl text-red-600">
                      100%
                    </div>
                    <div className="text-gray-600 dark:text-gray-300">
                      Kepuasan
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Values Section */}
      <section className="bg-gray-50 py-20 dark:bg-gray-900">
        <div className="container mx-auto px-4">
          <div className="mb-16 text-center">
            <h2 className="mb-4 font-bold text-3xl text-gray-800 dark:text-white">
              Nilai-Nilai Kami
            </h2>
            <p className="mx-auto max-w-2xl text-gray-600 text-lg dark:text-gray-300">
              Prinsip-prinsip inti ini mengarahkan semua yang kami lakukan di
              Chill6 Space.
            </p>
          </div>

          <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-4">
            <Card className="text-center transition-shadow hover:shadow-lg">
              <CardHeader>
                <div className="mx-auto mb-4 w-fit rounded-full bg-blue-500 p-3 text-white">
                  <Target className="h-6 w-6" />
                </div>
                <CardTitle className="text-xl">Kualitas Utama</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600 dark:text-gray-300">
                  Kami tidak pernah berkompromi terhadap kualitas layanan dan
                  produk kami.
                </p>
              </CardContent>
            </Card>

            <Card className="text-center transition-shadow hover:shadow-lg">
              <CardHeader>
                <div className="mx-auto mb-4 w-fit rounded-full bg-green-500 p-3 text-white">
                  <Users className="h-6 w-6" />
                </div>
                <CardTitle className="text-xl">Fokus Komunitas</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600 dark:text-gray-300">
                  Kami selalu dekat dengan komunitas lokal dan mengutamakan
                  kepuasan pelanggan.
                </p>
              </CardContent>
            </Card>

            <Card className="text-center transition-shadow hover:shadow-lg">
              <CardHeader>
                <div className="mx-auto mb-4 w-fit rounded-full bg-purple-500 p-3 text-white">
                  <Award className="h-6 w-6" />
                </div>
                <CardTitle className="text-xl">Inovasi</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600 dark:text-gray-300">
                  Kami terus menghadirkan teknologi dan layanan terbaru untuk
                  Kamu.
                </p>
              </CardContent>
            </Card>

            <Card className="text-center transition-shadow hover:shadow-lg">
              <CardHeader>
                <div className="mx-auto mb-4 w-fit rounded-full bg-red-500 p-3 text-white">
                  <Heart className="h-6 w-6" />
                </div>
                <CardTitle className="text-xl">Perhatian Pelanggan</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600 dark:text-gray-300">
                  Kepuasan dan pengalaman kalian adalah prioritas utama kami.
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Member Benefits Section - Authentication Demo */}
      <section className="py-20 bg-gray-50 dark:bg-gray-900">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="mb-4 font-bold text-3xl md:text-4xl">
              Join Our Member Community
            </h2>
            <p className="mx-auto max-w-2xl text-gray-600 text-xl dark:text-gray-300">
              Unlock exclusive features and personalized experiences by becoming
              a member.
            </p>
          </div>

          <div className="max-w-md mx-auto text-center">
            <div className="bg-white dark:bg-gray-800 rounded-lg p-8 shadow-lg">
              <Shield className="h-16 w-16 mx-auto mb-4 text-gray-400" />
              <h3 className="text-xl font-semibold mb-4">
                Discover Premium Benefits
              </h3>
              <p className="text-gray-600 dark:text-gray-300 mb-6">
                Access exclusive member benefits, premium content, and
                personalized experiences in our member area.
              </p>
              <Button asChild className="w-full">
                <a href="/member">Explore Member Area</a>
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Location & Contact Info */}
      <section className="bg-white py-20 dark:bg-gray-800">
        <div className="container mx-auto px-4">
          <div className="mx-auto max-w-4xl">
            <div className="mb-16 text-center">
              <h2 className="mb-4 font-bold text-3xl text-gray-800 dark:text-white">
                Kunjungi Kami
              </h2>
              <p className="text-gray-600 text-lg dark:text-gray-300">
                Temukan kami dengan mudah dan hubungi untuk pertanyaan apapun.
              </p>
            </div>

            <div className="grid gap-8 md:grid-cols-2">
              <Card className="p-6">
                <div className="flex items-start gap-4">
                  <div className="rounded-full bg-blue-500 p-2 text-white">
                    <MapPin className="h-5 w-5" />
                  </div>
                  <div>
                    <h3 className="mb-2 font-semibold text-lg">Lokasi</h3>
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
                  </div>
                </div>
              </Card>

              <Card className="p-6">
                <div className="flex items-start gap-4">
                  <div className="rounded-full bg-green-500 p-2 text-white">
                    <Clock className="h-5 w-5" />
                  </div>
                  <div>
                    <h3 className="mb-2 font-semibold text-lg">
                      Jam Operasional
                    </h3>
                    <div className="text-gray-600 dark:text-gray-300">
                      <p>{CONTACT_INFO.HOURS}</p>
                      <p>{CONTACT_INFO.HOURS2}</p>
                      <p className="mt-2 text-blue-600 text-sm">
                        *Beberapa layanan tersedia 24/7
                      </p>
                    </div>
                  </div>
                </div>
              </Card>

              <Card className="p-6">
                <div className="flex items-start gap-4">
                  <div className="rounded-full bg-purple-500 p-2 text-white">
                    <Phone className="h-5 w-5" />
                  </div>
                  <div>
                    <h3 className="mb-2 font-semibold text-lg">Telepon</h3>
                    <p className="text-gray-600 dark:text-gray-300">
                      {CONTACT_INFO.PHONE}
                      <br />
                      +62 098 765 4321
                    </p>
                  </div>
                </div>
              </Card>

              <Card className="p-6">
                <div className="flex items-start gap-4">
                  <div className="rounded-full bg-red-500 p-2 text-white">
                    <Mail className="h-5 w-5" />
                  </div>
                  <div>
                    <h3 className="mb-2 font-semibold text-lg">Email</h3>
                    <p className="text-gray-600 dark:text-gray-300">
                      {CONTACT_INFO.EMAIL}
                      <br />
                      support@chill6space.com
                    </p>
                  </div>
                </div>
              </Card>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}

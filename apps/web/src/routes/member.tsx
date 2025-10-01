import { createFileRoute, Link } from "@tanstack/react-router";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useAuth } from "@/components/auth-provider";
import { Button } from "@/components/ui/button";
import Loader from "@/components/loader";
import {
  Shield,
  Crown,
  Star,
  Gift,
  Calendar,
  Users,
  TrendingUp,
  LogIn,
} from "lucide-react";

export const Route = createFileRoute("/member")({
  component: MemberComponent,
});

function MemberComponent() {
  const { isAuthenticated, isLoading, isSessionInitialized, user } = useAuth();

  // Show loading state while checking session
  // TanStack Query automatically handles session initialization
  if (!isSessionInitialized || isLoading) {
    return (
      <div className="min-h-[calc(100vh-80px)] flex items-center justify-center">
        <div className="text-center">
          <Loader />
          <p className="mt-4 text-muted-foreground">Checking your session...</p>
        </div>
      </div>
    );
  }

  // Show sign-in prompt if not authenticated
  if (!isAuthenticated) {
    return (
      <div className="min-h-[calc(100vh-80px)]">
        {/* Hero Section - Sign In Required */}
        <section className="bg-gradient-to-r from-blue-600 to-purple-600 py-20 text-white">
          <div className="container mx-auto px-4 text-center">
            <Shield className="h-16 w-16 mx-auto mb-6 opacity-90" />
            <h1 className="mb-6 font-bold text-4xl md:text-6xl">Member Area</h1>
            <p className="mx-auto max-w-3xl text-blue-100 text-xl md:text-2xl mb-8">
              Access exclusive member benefits, premium content, and
              personalized experiences.
            </p>
            <Button size="lg" variant="secondary" asChild>
              <Link to="/sign-in">
                <LogIn className="h-5 w-5 mr-2" />
                Sign In to Continue
              </Link>
            </Button>
          </div>
        </section>

        {/* Benefits Preview */}
        <section className="py-20 bg-gray-50 dark:bg-gray-900">
          <div className="container mx-auto px-4">
            <h2 className="text-center mb-16 font-bold text-3xl md:text-4xl">
              What You Get as a Member
            </h2>
            <div className="grid gap-8 md:grid-cols-3">
              <Card className="text-center">
                <CardHeader>
                  <Crown className="h-12 w-12 mx-auto mb-4 text-yellow-500" />
                  <CardTitle>Premium Access</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground">
                    Unlock exclusive features and premium content available only
                    to members.
                  </p>
                </CardContent>
              </Card>

              <Card className="text-center">
                <CardHeader>
                  <Users className="h-12 w-12 mx-auto mb-4 text-blue-500" />
                  <CardTitle>Community</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground">
                    Connect with other members and participate in exclusive
                    events.
                  </p>
                </CardContent>
              </Card>

              <Card className="text-center">
                <CardHeader>
                  <Gift className="h-12 w-12 mx-auto mb-4 text-green-500" />
                  <CardTitle>Rewards</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground">
                    Earn points and rewards for your activity and engagement.
                  </p>
                </CardContent>
              </Card>
            </div>
          </div>
        </section>
      </div>
    );
  }

  // Member dashboard for authenticated users
  return (
    <div className="min-h-[calc(100vh-80px)]">
      {/* Welcome Section */}
      <section className="bg-gradient-to-r from-green-600 to-blue-600 py-20 text-white">
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="mb-4 font-bold text-4xl md:text-6xl">
                Welcome back, {user?.name}!
              </h1>
              <p className="text-green-100 text-xl md:text-2xl">
                Your exclusive member dashboard
              </p>
            </div>
            <Crown className="h-20 w-20 opacity-80" />
          </div>
        </div>
      </section>

      {/* Member Dashboard */}
      <section className="py-20">
        <div className="container mx-auto px-4">
          <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-4 mb-12">
            {/* Member Stats Cards */}
            <Card className="border-green-200 bg-green-50 dark:border-green-800 dark:bg-green-900/20">
              <CardHeader className="pb-2">
                <CardTitle className="flex items-center gap-2 text-green-800 dark:text-green-300">
                  <Star className="h-5 w-5" />
                  Member Status
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-2xl font-bold text-green-700 dark:text-green-400">
                  Active
                </p>
                <p className="text-sm text-green-600 dark:text-green-500">
                  Since {new Date(user?.createdAt || "").toLocaleDateString()}
                </p>
              </CardContent>
            </Card>

            <Card className="border-blue-200 bg-blue-50 dark:border-blue-800 dark:bg-blue-900/20">
              <CardHeader className="pb-2">
                <CardTitle className="flex items-center gap-2 text-blue-800 dark:text-blue-300">
                  <TrendingUp className="h-5 w-5" />
                  Points
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-2xl font-bold text-blue-700 dark:text-blue-400">
                  1,250
                </p>
                <p className="text-sm text-blue-600 dark:text-blue-500">
                  +50 this week
                </p>
              </CardContent>
            </Card>

            <Card className="border-purple-200 bg-purple-50 dark:border-purple-800 dark:bg-purple-900/20">
              <CardHeader className="pb-2">
                <CardTitle className="flex items-center gap-2 text-purple-800 dark:text-purple-300">
                  <Gift className="h-5 w-5" />
                  Rewards
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-2xl font-bold text-purple-700 dark:text-purple-400">
                  3
                </p>
                <p className="text-sm text-purple-600 dark:text-purple-500">
                  Available
                </p>
              </CardContent>
            </Card>

            <Card className="border-orange-200 bg-orange-50 dark:border-orange-800 dark:bg-orange-900/20">
              <CardHeader className="pb-2">
                <CardTitle className="flex items-center gap-2 text-orange-800 dark:text-orange-300">
                  <Calendar className="h-5 w-5" />
                  Events
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-2xl font-bold text-orange-700 dark:text-orange-400">
                  2
                </p>
                <p className="text-sm text-orange-600 dark:text-orange-500">
                  Upcoming
                </p>
              </CardContent>
            </Card>
          </div>

          {/* Member Features */}
          <div className="grid gap-8 md:grid-cols-2">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Crown className="h-6 w-6 text-yellow-500" />
                  Premium Features
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between p-3 bg-green-50 dark:bg-green-900/20 rounded-lg">
                  <span className="font-medium">Priority Support</span>
                  <div className="w-3 h-3 bg-green-500 rounded-full" />
                </div>
                <div className="flex items-center justify-between p-3 bg-green-50 dark:bg-green-900/20 rounded-lg">
                  <span className="font-medium">Exclusive Content</span>
                  <div className="w-3 h-3 bg-green-500 rounded-full" />
                </div>
                <div className="flex items-center justify-between p-3 bg-green-50 dark:bg-green-900/20 rounded-lg">
                  <span className="font-medium">Early Access</span>
                  <div className="w-3 h-3 bg-green-500 rounded-full" />
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Users className="h-6 w-6 text-blue-500" />
                  Community Activity
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="p-3 border-l-4 border-blue-500 bg-blue-50 dark:bg-blue-900/20">
                  <p className="font-medium">Welcome to the community!</p>
                  <p className="text-sm text-muted-foreground">
                    Complete your profile to earn bonus points
                  </p>
                </div>
                <div className="p-3 border-l-4 border-green-500 bg-green-50 dark:bg-green-900/20">
                  <p className="font-medium">New member event next week</p>
                  <p className="text-sm text-muted-foreground">
                    Join us for an exclusive virtual meetup
                  </p>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>
    </div>
  );
}

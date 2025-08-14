"use client";

import { useState, useEffect } from "react";
import { useAuth } from "@/app/context/AuthContext";
import { format } from "date-fns";
import { Crown, Edit2, Loader2, Save, Check } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Separator } from "@/components/ui/separator";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { editUserProfile } from "../../../../utils/auth/userUtils";
import { Toaster } from "@/components/ui/sonner";
import { toast } from "sonner";
import { Skeleton } from "@/components/ui/skeleton";
import Link from "next/link";

export default function ProfilePage() {
  const { user, refreshProfile} = useAuth(); // Assuming your AuthContext provides a loading state
  const [loading, setLoading] = useState(true)
  const [isEditing, setIsEditing] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [formData, setFormData] = useState({
    name:  "",
    nickname:  "",
    email:  "",
  });
  const [editForm, setEditForm] = useState({
    name:  "",
    nickname:  "",
    email:  "",
  });

  console.log("USER: ", user)

  useEffect(() => {
    if (user) {
      setFormData({
    name: user?.name || "",
    nickname: user?.nickname || "",
    email: user?.email || "",
  })
  setEditForm({
    name: user?.name || "",
    nickname: user?.nickname || "",
    email: user?.email || "",
  })
  setLoading(false)
    }
  }, [user])

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setEditForm((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSave = async () => {
    setIsSaving(true);
    try {
      const { data: newCard, error } = await editUserProfile(editForm);
      if (error) throw error;
      
    setFormData(editForm); // Update UI state immediately
    setIsEditing(false); // Exit edit mode
    toast.success("Profile updated successfully!");

      await refreshProfile();

    } catch (error) {
      toast.error("Failed to create flashcard");
      console.error("Failed to update profile", error);
    } finally {
      setIsSaving(false);
    }
  };

  if (loading || !user) {
    return (
      <div className="container relative max-w-[1350px] px-2 md:px-5 mx-auto py-4 overflow-hidden">
        {/* Background gradients */}
        <div className="absolute top-20 right-20 w-50 sm:w-[400px] h-[200px] pointer-events-none rounded-full bg-[radial-gradient(ellipse_at_60%_40%,rgba(59,130,246,0.15)_0%,transparent_70%)] blur-2xl" />
        <div className="-z-3 absolute -bottom-50 -left-[200px] w-[400px] h-[200px] pointer-events-none rounded-full bg-[radial-gradient(ellipse_at_60%_40%,rgba(59,130,246,0.15)_0%,transparent_70%)] blur-2xl" />

        <div className="max-w-4xl mb-8">
          <Skeleton className="h-8 w-48 rounded-md" />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Profile Card Skeleton */}
          <Card className="bg-gray-900/50 border-gray-800 col-span-1">
            <CardHeader>
              <Skeleton className="h-6 w-24 rounded-md" />
            </CardHeader>
            <CardContent>
              <div className="flex flex-col items-center gap-4">
                <Skeleton className="w-24 h-24 rounded-full" />
                <div className="text-center space-y-2 w-full">
                  <Skeleton className="h-6 w-3/4 mx-auto rounded-md" />
                  <Skeleton className="h-4 w-1/2 mx-auto rounded-md" />
                  <Skeleton className="h-4 w-2/3 mx-auto rounded-md" />
                </div>
                <div className="flex gap-2 mt-4 w-full justify-center">
                  <Skeleton className="h-10 w-24 rounded-md" />
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Details Card Skeleton */}
          <Card className="bg-gray-900/50 border-gray-800 col-span-1 lg:col-span-2">
            <CardHeader>
              <Skeleton className="h-6 w-36 rounded-md" />
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                {[...Array(4)].map((_, i) => (
                  <div key={i}>
                    <Skeleton className="h-4 w-24 rounded-md mb-2" />
                    <Skeleton className="h-5 w-full rounded-md" />
                    {i < 3 && <Skeleton className="h-[1px] w-full mt-4 mb-4" />}
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Subscription Card Skeleton */}
          <Card className="bg-gray-900/50 border-gray-800 col-span-1 lg:col-span-3">
            <CardHeader>
              <Skeleton className="h-6 w-36 rounded-md" />
            </CardHeader>
            <CardContent>
              <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                <div className="space-y-2">
                  <Skeleton className="h-6 w-32 rounded-md" />
                  <Skeleton className="h-4 w-48 rounded-md" />
                </div>
                <div className="flex items-center gap-3">
                  <Skeleton className="h-5 w-16 rounded-md" />
                  <Skeleton className="h-5 w-5 rounded-full" />
                </div>
              </div>
              <Skeleton className="h-10 w-full mt-6 rounded-md" />
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  return (
    <div className="container relative max-w-[1350px] px-2 md:px-5 mx-auto py-4 overflow-hidden">
      <Toaster position="top-center" />

      {/* Background gradients */}
      <div className="absolute top-20 right-20 w-50 sm:w-[400px] h-[200px] pointer-events-none rounded-full bg-[radial-gradient(ellipse_at_60%_40%,rgba(59,130,246,0.15)_0%,transparent_70%)] blur-2xl" />
      <div className="-z-3 absolute -bottom-50 -left-[200px] w-[400px] h-[200px] pointer-events-none rounded-full bg-[radial-gradient(ellipse_at_60%_40%,rgba(59,130,246,0.15)_0%,transparent_70%)] blur-2xl" />

      <div className="max-w-4xl">
        <header className="mb-8">
          <h1 className="text-xl sm:text-2xl font-bold text-white flex items-center gap-2">
            My Profile
            {user?.isPro && (
              <Badge className="flex items-center gap-1 bg-gradient-to-r from-cyan-600/20 to-cyan-800/20 text-cyan-400 border border-cyan-700/50">
                <Crown className="fill-cyan-400/30" size={14} />
                PRO
              </Badge>
            )}
          </h1>
        </header>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Profile Card */}
        <Card className="bg-gray-900/50 border-gray-800 col-span-1">
          <CardHeader>
            <CardTitle className="text-white">Profile</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex flex-col items-center gap-4">
              <Avatar className="w-24 h-24 border-2 border-blue-500/50">
                <AvatarImage src={user?.avatar} />
                <AvatarFallback className="bg-gray-800 text-white font-medium text-4xl">
                  {user?.name?.charAt(0).toUpperCase()}
                </AvatarFallback>
              </Avatar>

              <div className="text-center">
                <h2 className="text-xl font-semibold text-white">
                  {user.name}
                </h2>
                {user.nickname && (
                  <p className="text-blue-400">@{user.nickname}</p>
                )}
                <p className="text-gray-400 mt-1">{user.email}</p>
              </div>

              <div className="flex gap-2 mt-4">
                {isEditing ? (
                  <>
                    <Button
                      variant="outline"
                      onClick={() => setIsEditing(false)}
                      className="cursor-pointer text-gray-300 border-gray-700 hover:bg-gray-800"
                    >
                      Cancel
                    </Button>
                    <Button
                      onClick={handleSave}
                      disabled={isSaving}
                      className="cursor-pointer bg-blue-600 hover:bg-blue-700 text-white"
                    >
                      {isSaving ? (
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      ) : (
                        <Save className="mr-2 h-4 w-4" />
                      )}
                      Save Changes
                    </Button>
                  </>
                ) : (
                  <Button
                    onClick={() => setIsEditing(true)}
                    className="bg-gray-800 hover:bg-gray-700 text-blue-400 cursor-pointer"
                  >
                    <Edit2 className="mr-2 h-4 w-4" />
                    Edit Profile
                  </Button>
                )}
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Details Card */}
        <Card className="bg-gray-900/50 border-gray-800 col-span-1 lg:col-span-2">
          <CardHeader>
            <CardTitle className="text-white">Account Details</CardTitle>
          </CardHeader>
          <CardContent>
            {isEditing ? (
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="name" className="text-gray-300">
                    Full Name
                  </Label>
                  <Input
                    id="name"
                    name="name"
                    value={editForm.name}
                    onChange={handleInputChange}
                    className="bg-gray-800 border-gray-700 text-white"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="nickname" className="text-gray-300">
                    Nickname
                  </Label>
                  <Input
                    id="nickname"
                    name="nickname"
                    value={editForm.nickname}
                    onChange={handleInputChange}
                    className="bg-gray-800 border-gray-700 text-white"
                    placeholder="Choose a nickname"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="email" className="text-gray-300">
                    Email
                  </Label>
                  <Input
                    id="email"
                    name="email"
                    type="email"
                    value={editForm.email}
                    onChange={handleInputChange}
                    className="bg-gray-800 border-gray-700 text-white"
                    disabled
                  />
                </div>
              </div>
            ) : (
              <div className="space-y-6">
                <div>
                  <h3 className="text-sm font-medium text-gray-400">
                    Full Name
                  </h3>
                  <p className="mt-1 text-white">{user.name}</p>
                </div>

                <Separator className="bg-gray-800" />

                <div>
                  <h3 className="text-sm font-medium text-gray-400">
                    Nickname
                  </h3>
                  <p className="mt-1 text-white">
                    {user.nickname || "Not set"}
                  </p>
                </div>

                <Separator className="bg-gray-800" />

                <div>
                  <h3 className="text-sm font-medium text-gray-400">Email</h3>
                  <p className="mt-1 text-white">{user.email}</p>
                </div>

                <Separator className="bg-gray-800" />

                <div>
                  <h3 className="text-sm font-medium text-gray-400">
                    Member Since
                  </h3>
                  <p className="mt-1 text-white">
                    {format(
                      new Date(user?.createdAt || Date.now()),
                      "MMMM d, yyyy"
                    )}
                  </p>
                </div>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Subscription Card */}
        <Card className="bg-gray-900/50 border-gray-800 col-span-1 lg:col-span-3">
          <CardHeader>
            <CardTitle className="text-white">Subscription</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
              <div>
                <h3 className="text-lg font-medium text-white">
                  {user?.isPro ? "Pro Plan" : "Free Plan"}
                </h3>
                <p className="text-gray-400 mt-1">
                  {user?.isPro
                    ? "You have access to all premium features"
                    : "Upgrade to unlock all features"}
                </p>
              </div>

              <div className="flex items-center gap-3">
                <span className="text-white">
                  {user?.isPro ? "Active" : "Inactive"}
                </span>
                <Check className="text-blue-400" />
              </div>
            </div>

            {user && !user?.isPro && (
              <div className="mt-6">
                <Link href='/pricing'>
                <Button className="text-white cursor-pointer w-full bg-gradient-to-r from-blue-600 to-cyan-600 hover:from-blue-700 hover:to-cyan-700">
                  Upgrade to Pro
                </Button>
                </Link>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
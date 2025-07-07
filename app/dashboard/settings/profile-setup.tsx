import { useState } from "react";
import { useDashboardStore } from "@/app/store/zustandstore/useStore";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Edit, X, Check } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

export function ProfileTab() {
  const { userDetails, userProfile} = useDashboardStore();
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({
    fullname: userProfile?.fullname || "",
    phone: userDetails?.phone || "",
    gender: userProfile?.gender || "",
    country: userProfile?.country || "",
    email: userDetails?.email || "",
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSelectChange = (name: string, value: string) => {
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSave = async () => {
    try {
   
      const updateData = {
        fullname: formData.fullname,
        gender: formData.gender,
        country: formData.country,
        // Include other fields that need to be updated
      };

      // Call the update function from your store
      // await updateProfile(updateData);
      
      // If successful, exit edit mode
      setIsEditing(false);
    } catch (error) {
      console.error("Failed to update profile:", error);
      // Handle error (maybe show a toast notification)
    }
  };

  const handleDiscard = () => {
    // Reset form data to original values
    setFormData({
      fullname: userProfile?.fullname || "",
      phone: userDetails?.phone || "",
      gender: userProfile?.gender || "",
      country: userProfile?.country || "",
      email: userDetails?.email || "",
    });
    setIsEditing(false);
  };

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-4">
        <CardTitle className="text-lg font-medium">Personal Information</CardTitle>
        {!isEditing ? (
          <Button 
            variant="ghost" 
            size="sm" 
            className="text-blue-600 hover:text-blue-700"
            onClick={() => setIsEditing(true)}
          >
            <Edit className="w-4 h-4 mr-2" />
            Edit
          </Button>
        ) : (
          <div className="flex gap-2">
            <Button 
              variant="ghost" 
              size="sm" 
              className="text-gray-600 hover:text-gray-700"
              onClick={handleDiscard}
            >
              <X className="w-4 h-4 mr-2" />
              Discard
            </Button>
            <Button 
              variant="ghost" 
              size="sm" 
              className="text-blue-600 hover:text-blue-700"
              onClick={handleSave}
            >
              <Check className="w-4 h-4 mr-2" />
              Save Changes
            </Button>
          </div>
        )}
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-2">
            <label className="text-sm font-medium text-gray-600">Full Name</label>
            {isEditing ? (
              <Input
                name="fullname"
                value={formData.fullname}
                onChange={handleChange}
                className="text-sm text-gray-900"
              />
            ) : (
              <p className="text-sm text-gray-900">{userProfile?.fullname}</p>
            )}
          </div>
          <div className="space-y-2">
            <label className="text-sm font-medium text-gray-600">Phone Number</label>
            {isEditing ? (
              <Input
                name="phone"
                value={formData.phone}
                onChange={handleChange}
                className="text-sm text-gray-900"
              />
            ) : (
              <p className="text-sm text-gray-900">{userDetails?.phone}</p>
            )}
          </div>
          <div className="space-y-2">
            <label className="text-sm font-medium text-gray-600">Gender</label>
            {isEditing ? (
              <Select
                value={formData.gender}
                onValueChange={(value) => handleSelectChange("gender", value)}
              >
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Select gender" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Male">Male</SelectItem>
                  <SelectItem value="Female">Female</SelectItem>
                  <SelectItem value="Other">Other</SelectItem>
                </SelectContent>
              </Select>
            ) : (
              <p className="text-sm text-gray-900">{userProfile?.gender}</p>
            )}
          </div>
          <div className="space-y-2">
            <label className="text-sm font-medium text-gray-600">Country</label>
            {isEditing ? (
              <Input
                name="country"
                value={formData.country}
                onChange={handleChange}
                className="text-sm text-gray-900"
              />
            ) : (
              <p className="text-sm text-gray-900">{userProfile?.country}</p>
            )}
          </div>
          <div className="space-y-2 md:col-span-2">
            <label className="text-sm font-medium text-gray-600">Email Address</label>
            <p className="text-sm text-gray-900">{userDetails?.email}</p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
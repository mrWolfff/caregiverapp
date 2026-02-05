import { useState, useEffect } from 'react';
import { Layout } from '@/components/Layout';
import { useAuth } from '@/contexts/AuthContext';
import { apiService } from '@/services/api';
import { ElderProfile as ElderProfileType } from '@/types';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Loader2, Save, User } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

export default function ElderProfile() {
  const { user } = useAuth();
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [profile, setProfile] = useState<Partial<ElderProfileType>>({
    firstName: user?.firstName || '',
    lastName: user?.lastName || '',
    phone: '',
    address: '',
    city: '',
    state: '',
    emergencyContact: '',
    emergencyPhone: '',
  });

  useEffect(() => {
    const loadProfile = async () => {
      try {
        const data = await apiService.getElderProfile();
        setProfile(data);
      } catch (error) {
        // Profile doesn't exist yet, use defaults
      } finally {
        setIsLoading(false);
      }
    };
    loadProfile();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);

    try {
      if (profile.id) {
        await apiService.updateElderProfile(profile);
      } else {
        await apiService.createElderProfile(profile);
      }
      toast({
        title: 'Profile saved',
        description: 'Your profile has been updated successfully.',
      });
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to save profile. Please try again.',
        variant: 'destructive',
      });
    } finally {
      setIsSaving(false);
    }
  };

  const updateField = (field: string, value: string) => {
    setProfile((prev) => ({ ...prev, [field]: value }));
  };

  if (isLoading) {
    return (
      <Layout>
        <div className="min-h-[60vh] flex items-center justify-center">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="container mx-auto px-4 py-12">
        <div className="max-w-2xl mx-auto animate-fade-in">
          <div className="mb-8">
            <h1 className="text-3xl font-heading font-bold text-foreground mb-2">My Profile</h1>
            <p className="text-muted-foreground">
              Complete your profile to help caregivers understand your needs.
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Personal Information */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <User className="h-5 w-5 text-primary" />
                  Personal Information
                </CardTitle>
                <CardDescription>Your basic contact details</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="firstName">First Name</Label>
                    <Input
                      id="firstName"
                      value={profile.firstName}
                      onChange={(e) => updateField('firstName', e.target.value)}
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="lastName">Last Name</Label>
                    <Input
                      id="lastName"
                      value={profile.lastName}
                      onChange={(e) => updateField('lastName', e.target.value)}
                      required
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="phone">Phone Number</Label>
                  <Input
                    id="phone"
                    type="tel"
                    placeholder="(555) 123-4567"
                    value={profile.phone}
                    onChange={(e) => updateField('phone', e.target.value)}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="address">Address</Label>
                  <Input
                    id="address"
                    placeholder="123 Main Street"
                    value={profile.address}
                    onChange={(e) => updateField('address', e.target.value)}
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="city">City</Label>
                    <Input
                      id="city"
                      placeholder="New York"
                      value={profile.city}
                      onChange={(e) => updateField('city', e.target.value)}
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="state">State</Label>
                    <Input
                      id="state"
                      placeholder="NY"
                      value={profile.state}
                      onChange={(e) => updateField('state', e.target.value)}
                      required
                    />
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Emergency Contact */}
            <Card>
              <CardHeader>
                <CardTitle>Emergency Contact</CardTitle>
                <CardDescription>Someone we can contact in case of emergency</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="emergencyContact">Contact Name</Label>
                  <Input
                    id="emergencyContact"
                    placeholder="Jane Doe"
                    value={profile.emergencyContact}
                    onChange={(e) => updateField('emergencyContact', e.target.value)}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="emergencyPhone">Contact Phone</Label>
                  <Input
                    id="emergencyPhone"
                    type="tel"
                    placeholder="(555) 987-6543"
                    value={profile.emergencyPhone}
                    onChange={(e) => updateField('emergencyPhone', e.target.value)}
                  />
                </div>
              </CardContent>
            </Card>

            <Button type="submit" size="lg" className="w-full" disabled={isSaving}>
              {isSaving ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin" />
                  Saving...
                </>
              ) : (
                <>
                  <Save className="h-4 w-4" />
                  Save Profile
                </>
              )}
            </Button>
          </form>
        </div>
      </div>
    </Layout>
  );
}

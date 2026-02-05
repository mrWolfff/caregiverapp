import { useState, useEffect } from 'react';
import { Layout } from '@/components/Layout';
import { useAuth } from '@/contexts/AuthContext';
import { apiService } from '@/services/api';
import { CaregiverProfile as CaregiverProfileType } from '@/types';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Loader2, Save, User, Briefcase, MapPin, X } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

const SKILL_OPTIONS = [
  'Personal Care',
  'Meal Preparation',
  'Medication Management',
  'Mobility Assistance',
  'Companionship',
  'Light Housekeeping',
  'Transportation',
  'Dementia Care',
  'Physical Therapy Support',
  'First Aid/CPR',
];

export default function CaregiverProfile() {
  const { user } = useAuth();
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [profile, setProfile] = useState<Partial<CaregiverProfileType>>({
    firstName: user?.firstName || '',
    lastName: user?.lastName || '',
    bio: '',
    yearsOfExperience: 0,
    hourlyRate: 0,
    availableFrom: '09:00',
    availableTo: '17:00',
    city: '',
    state: '',
    skills: [],
    phone: '',
  });

  useEffect(() => {
    const loadProfile = async () => {
      try {
        const data = await apiService.getCaregiverProfile();
        setProfile(data);
      } catch (error) {
        // Profile doesn't exist yet
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
        await apiService.updateCaregiverProfile(profile);
      } else {
        await apiService.createCaregiverProfile(profile);
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

  const updateField = (field: string, value: string | number | string[]) => {
    setProfile((prev) => ({ ...prev, [field]: value }));
  };

  const toggleSkill = (skill: string) => {
    const currentSkills = profile.skills || [];
    if (currentSkills.includes(skill)) {
      updateField('skills', currentSkills.filter((s) => s !== skill));
    } else {
      updateField('skills', [...currentSkills, skill]);
    }
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
            <h1 className="text-3xl font-heading font-bold text-foreground mb-2">Caregiver Profile</h1>
            <p className="text-muted-foreground">
              A complete profile helps elders find and trust you.
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
                  <Label htmlFor="bio">Bio</Label>
                  <Textarea
                    id="bio"
                    placeholder="Tell elders about yourself, your experience, and why you love caregiving..."
                    value={profile.bio}
                    onChange={(e) => updateField('bio', e.target.value)}
                    rows={4}
                    required
                  />
                </div>
              </CardContent>
            </Card>

            {/* Experience & Rates */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Briefcase className="h-5 w-5 text-primary" />
                  Experience & Rates
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="yearsOfExperience">Years of Experience</Label>
                    <Input
                      id="yearsOfExperience"
                      type="number"
                      min="0"
                      value={profile.yearsOfExperience}
                      onChange={(e) => updateField('yearsOfExperience', parseInt(e.target.value) || 0)}
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="hourlyRate">Hourly Rate ($)</Label>
                    <Input
                      id="hourlyRate"
                      type="number"
                      min="0"
                      step="0.5"
                      value={profile.hourlyRate}
                      onChange={(e) => updateField('hourlyRate', parseFloat(e.target.value) || 0)}
                      required
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="availableFrom">Available From</Label>
                    <Input
                      id="availableFrom"
                      type="time"
                      value={profile.availableFrom}
                      onChange={(e) => updateField('availableFrom', e.target.value)}
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="availableTo">Available To</Label>
                    <Input
                      id="availableTo"
                      type="time"
                      value={profile.availableTo}
                      onChange={(e) => updateField('availableTo', e.target.value)}
                      required
                    />
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Location */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <MapPin className="h-5 w-5 text-primary" />
                  Location
                </CardTitle>
                <CardDescription>Where you're available to work</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
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

            {/* Skills */}
            <Card>
              <CardHeader>
                <CardTitle>Skills</CardTitle>
                <CardDescription>Select the services you can provide</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="flex flex-wrap gap-2">
                  {SKILL_OPTIONS.map((skill) => {
                    const isSelected = profile.skills?.includes(skill);
                    return (
                      <Badge
                        key={skill}
                        variant={isSelected ? 'default' : 'outline'}
                        className={`cursor-pointer transition-all ${
                          isSelected ? '' : 'hover:bg-primary/10'
                        }`}
                        onClick={() => toggleSkill(skill)}
                      >
                        {skill}
                        {isSelected && <X className="h-3 w-3 ml-1" />}
                      </Badge>
                    );
                  })}
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

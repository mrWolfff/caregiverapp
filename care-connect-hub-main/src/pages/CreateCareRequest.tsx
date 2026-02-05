import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Layout } from '@/components/Layout';
import { apiService } from '@/services/api';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Loader2, Calendar, Clock, MapPin, FileText } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { z } from 'zod';

const careRequestSchema = z.object({
  description: z.string().min(20, 'Please provide a detailed description (at least 20 characters)'),
  date: z.string().min(1, 'Date is required'),
  startTime: z.string().min(1, 'Start time is required'),
  endTime: z.string().min(1, 'End time is required'),
  city: z.string().min(1, 'City is required'),
  state: z.string().min(1, 'State is required'),
});

export default function CreateCareRequest() {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [formData, setFormData] = useState({
    description: '',
    date: '',
    startTime: '',
    endTime: '',
    city: '',
    state: '',
  });

  const updateField = (field: string, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors((prev) => ({ ...prev, [field]: '' }));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrors({});

    const validation = careRequestSchema.safeParse(formData);
    if (!validation.success) {
      const fieldErrors: Record<string, string> = {};
      validation.error.errors.forEach((err) => {
        if (err.path[0]) {
          fieldErrors[err.path[0] as string] = err.message;
        }
      });
      setErrors(fieldErrors);
      return;
    }

    setIsSubmitting(true);
    try {
      const newRequest = await apiService.createCareRequest(formData);
      toast({
        title: 'Care request created',
        description: 'Your care request has been posted successfully.',
      });
      navigate(`/care-requests/${newRequest.id}`);
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to create care request. Please try again.',
        variant: 'destructive',
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  // Get tomorrow's date as minimum
  const tomorrow = new Date();
  tomorrow.setDate(tomorrow.getDate() + 1);
  const minDate = tomorrow.toISOString().split('T')[0];

  return (
    <Layout>
      <div className="container mx-auto px-4 py-12">
        <div className="max-w-2xl mx-auto animate-fade-in">
          <div className="mb-8">
            <h1 className="text-3xl font-heading font-bold text-foreground mb-2">
              Create Care Request
            </h1>
            <p className="text-muted-foreground">
              Describe what kind of care you need and when.
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Description */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <FileText className="h-5 w-5 text-primary" />
                  Care Details
                </CardTitle>
                <CardDescription>
                  Describe the type of care needed
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  <Label htmlFor="description">Description</Label>
                  <Textarea
                    id="description"
                    placeholder="Please describe the care you need. Include any specific requirements, health conditions to be aware of, or special instructions..."
                    value={formData.description}
                    onChange={(e) => updateField('description', e.target.value)}
                    rows={5}
                    className={errors.description ? 'border-destructive' : ''}
                  />
                  {errors.description && (
                    <p className="text-sm text-destructive">{errors.description}</p>
                  )}
                </div>
              </CardContent>
            </Card>

            {/* Date & Time */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Calendar className="h-5 w-5 text-primary" />
                  Schedule
                </CardTitle>
                <CardDescription>When do you need care?</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="date">Date</Label>
                  <Input
                    id="date"
                    type="date"
                    min={minDate}
                    value={formData.date}
                    onChange={(e) => updateField('date', e.target.value)}
                    className={errors.date ? 'border-destructive' : ''}
                  />
                  {errors.date && (
                    <p className="text-sm text-destructive">{errors.date}</p>
                  )}
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="startTime" className="flex items-center gap-2">
                      <Clock className="h-4 w-4" />
                      Start Time
                    </Label>
                    <Input
                      id="startTime"
                      type="time"
                      value={formData.startTime}
                      onChange={(e) => updateField('startTime', e.target.value)}
                      className={errors.startTime ? 'border-destructive' : ''}
                    />
                    {errors.startTime && (
                      <p className="text-sm text-destructive">{errors.startTime}</p>
                    )}
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="endTime" className="flex items-center gap-2">
                      <Clock className="h-4 w-4" />
                      End Time
                    </Label>
                    <Input
                      id="endTime"
                      type="time"
                      value={formData.endTime}
                      onChange={(e) => updateField('endTime', e.target.value)}
                      className={errors.endTime ? 'border-destructive' : ''}
                    />
                    {errors.endTime && (
                      <p className="text-sm text-destructive">{errors.endTime}</p>
                    )}
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
                <CardDescription>Where is care needed?</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="city">City</Label>
                    <Input
                      id="city"
                      placeholder="New York"
                      value={formData.city}
                      onChange={(e) => updateField('city', e.target.value)}
                      className={errors.city ? 'border-destructive' : ''}
                    />
                    {errors.city && (
                      <p className="text-sm text-destructive">{errors.city}</p>
                    )}
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="state">State</Label>
                    <Input
                      id="state"
                      placeholder="NY"
                      value={formData.state}
                      onChange={(e) => updateField('state', e.target.value)}
                      className={errors.state ? 'border-destructive' : ''}
                    />
                    {errors.state && (
                      <p className="text-sm text-destructive">{errors.state}</p>
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>

            <Button type="submit" size="lg" className="w-full" disabled={isSubmitting}>
              {isSubmitting ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin" />
                  Creating...
                </>
              ) : (
                'Post Care Request'
              )}
            </Button>
          </form>
        </div>
      </div>
    </Layout>
  );
}

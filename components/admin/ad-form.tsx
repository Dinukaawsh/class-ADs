import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import type { AdView } from "@/lib/ads";

type AdFormProps = {
  title: string;
  action: (formData: FormData) => Promise<void>;
  ad?: AdView;
  submitLabel: string;
  errorMessage?: string | null;
};

export function AdForm({ title, action, ad, submitLabel, errorMessage }: AdFormProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>{title}</CardTitle>
      </CardHeader>
      <CardContent>
        <form action={action} className="grid gap-4 md:grid-cols-2">
          <div className="space-y-2 md:col-span-2">
            <Label htmlFor="title">Title</Label>
            <Input
              id="title"
              name="title"
              defaultValue={ad?.title}
              required
              minLength={4}
              maxLength={140}
              placeholder="Used car, apartment, laptop..."
            />
          </div>

          <div className="space-y-2 md:col-span-2">
            <Label htmlFor="summary">Summary</Label>
            <Textarea
              id="summary"
              name="summary"
              defaultValue={ad?.summary}
              required
              minLength={12}
              maxLength={220}
              placeholder="Short ad summary that appears on the listing page"
              className="min-h-[90px]"
            />
          </div>

          <div className="space-y-2 md:col-span-2">
            <Label htmlFor="description">Description</Label>
            <Textarea
              id="description"
              name="description"
              defaultValue={ad?.description}
              required
              minLength={20}
              maxLength={5000}
              placeholder="Full details, features, condition, and anything buyers should know"
              className="min-h-[180px]"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="category">Category</Label>
            <Input
              id="category"
              name="category"
              defaultValue={ad?.category}
              required
              minLength={2}
              maxLength={60}
              placeholder="Property, Vehicles, Electronics"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="price">Price (USD)</Label>
            <Input
              id="price"
              name="price"
              type="number"
              min="0"
              step="0.01"
              defaultValue={ad?.price ?? 0}
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="location">Location</Label>
            <Input
              id="location"
              name="location"
              defaultValue={ad?.location}
              required
              minLength={2}
              maxLength={120}
              placeholder="Colombo, Kandy, Galle..."
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="phone">Phone</Label>
            <Input
              id="phone"
              name="phone"
              defaultValue={ad?.phone}
              required
              minLength={5}
              maxLength={30}
              inputMode="tel"
              pattern="[0-9+()\-\s]{5,30}"
              placeholder="+1 555 0100"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="contactName">Contact Name</Label>
            <Input
              id="contactName"
              name="contactName"
              defaultValue={ad?.contactName}
              required
              minLength={2}
              maxLength={80}
              placeholder="Your name or business name"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="contactEmail">Contact Email</Label>
            <Input
              id="contactEmail"
              name="contactEmail"
              type="email"
              defaultValue={ad?.contactEmail}
              required
              maxLength={254}
              placeholder="seller@example.com"
            />
          </div>

          <div className="space-y-2 md:col-span-2">
            <Label htmlFor="imageUrl">Image URL</Label>
            <Input
              id="imageUrl"
              name="imageUrl"
              type="url"
              defaultValue={ad?.imageUrl}
              placeholder="https://example.com/image.jpg"
            />
          </div>

          <label className="flex items-center gap-2 text-sm font-medium text-[var(--ink-2)] md:col-span-2">
            <input
              type="checkbox"
              name="isPublished"
              defaultChecked={ad?.isPublished ?? true}
              className="h-4 w-4 rounded border-[var(--stroke-1)]"
            />
            Published (visible to public)
          </label>

          <div className="flex gap-2 md:col-span-2">
            <Button type="submit">{submitLabel}</Button>
            <Button type="reset" variant="secondary">
              Reset
            </Button>
          </div>

          {errorMessage ? (
            <p className="md:col-span-2 rounded-md border border-[var(--danger-600)] bg-red-50 px-3 py-2 text-sm font-medium text-[var(--danger-700)]">
              {errorMessage}
            </p>
          ) : null}
        </form>
      </CardContent>
    </Card>
  );
}

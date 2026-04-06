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
};

export function AdForm({ title, action, ad, submitLabel }: AdFormProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>{title}</CardTitle>
      </CardHeader>
      <CardContent>
        <form action={action} className="grid gap-4 md:grid-cols-2">
          <div className="space-y-2 md:col-span-2">
            <Label htmlFor="title">Title</Label>
            <Input id="title" name="title" defaultValue={ad?.title} required />
          </div>

          <div className="space-y-2 md:col-span-2">
            <Label htmlFor="summary">Summary</Label>
            <Textarea
              id="summary"
              name="summary"
              defaultValue={ad?.summary}
              required
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
              className="min-h-[180px]"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="category">Category</Label>
            <Input id="category" name="category" defaultValue={ad?.category} required />
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
            <Input id="location" name="location" defaultValue={ad?.location} required />
          </div>

          <div className="space-y-2">
            <Label htmlFor="phone">Phone</Label>
            <Input id="phone" name="phone" defaultValue={ad?.phone} required />
          </div>

          <div className="space-y-2">
            <Label htmlFor="contactName">Contact Name</Label>
            <Input
              id="contactName"
              name="contactName"
              defaultValue={ad?.contactName}
              required
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
            />
          </div>

          <div className="space-y-2 md:col-span-2">
            <Label htmlFor="imageUrl">Image URL</Label>
            <Input id="imageUrl" name="imageUrl" defaultValue={ad?.imageUrl} />
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
        </form>
      </CardContent>
    </Card>
  );
}

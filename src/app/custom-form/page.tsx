'use client';

import { useEffect, useState } from 'react';
import { z } from 'zod';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { parseHalTemplate } from '@/lib/hal-parser';
import { buildPayload } from '@/lib/form-utils';
import {
  Form,
  FormField,
  FormItem,
  FormLabel,
  FormControl,
  FormMessage,
} from '@/components/ui/form';
import { Textarea } from '@/components/ui/textarea';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';

export default function CustomFormPage() {
  const [template, setTemplate] = useState<any>(null);
  const [schema, setSchema] = useState<z.ZodObject<any> | null>(null);
  const [target, setTarget] = useState<string>('');

  const form = useForm({ resolver: schema ? zodResolver(schema) : undefined });
  const {
    control,
    handleSubmit,
    formState: { errors },
    reset,
  } = form;

  useEffect(() => {
    async function fetchTpl() {
      const res = await fetch('/api/customform');
      const json = await res.json();
      const { target: t, schema: s } = parseHalTemplate(json);
      setTarget(t);
      setSchema(s);
      setTemplate(json);
    }
    fetchTpl();
  }, []);

  const onSubmit = async (data: any) => {
    const payload = buildPayload(data, template._templates.default.properties);
    await fetch(target, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    });
    toast.success('Submitted!', {
      description: <pre style={{ textAlign: 'left' }}>{JSON.stringify(payload, null, 2)}</pre>,
      duration: Infinity,
      position: 'top-center',
    });
    reset();
  };

  if (!schema || !template) return <p>Loading form…</p>;

  const opts = template._templates.default.properties.find((p: any) => p.name === 'tags')
    .accepted;

  return (
    <Form {...form}>
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6 max-w-lg mx-auto mt-12">
        {/* Comments textarea */}
        <FormField
          control={control}
          name="comments"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Comments *</FormLabel>
              <FormControl>
                <Textarea {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        {/* Event date */}
        <FormField
          control={control}
          name="eventDate"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Event Date *</FormLabel>
              <FormControl>
                <Input type="date" value={field.value ?? ''} onChange={field.onChange} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        {/* Tags multi-select */}
        <FormField
          control={control}
          name="tags"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Tags *</FormLabel>
              <FormControl>
                <select
                  multiple
                  value={field.value ?? []}
                  onChange={(e) =>
                    field.onChange(
                      Array.from(e.target.selectedOptions, (opt) => opt.value)
                    )
                  }
                  className="border rounded p-2 w-full"
                >
                  {opts.map((o: any) => (
                    <option key={o.id} value={o.id}>
                      {o.name}
                    </option>
                  ))}
                </select>
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <Button type="submit">Submit</Button>
      </form>
    </Form>
  );
}

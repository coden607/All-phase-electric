import { z } from 'zod';
import { companyConfig } from '@/config/company';

const jobTypes = companyConfig.jobTypes;
const serviceTypes = companyConfig.services;

export const intakeSchema = z.object({
  jobType: z.enum(jobTypes),
  serviceType: z.enum(serviceTypes),
  description: z.string().trim().min(10).max(4000),
  urgency: z.enum(['normal', 'soon', 'urgent']),
  address: z.object({
    street: z.string().trim().min(3).max(160),
    city: z.string().trim().min(2).max(80),
    state: z.string().trim().length(2).transform((value) => value.toUpperCase()),
    zip: z.string().trim().regex(/^\d{5}(?:-\d{4})?$/),
  }),
  customer: z.object({
    name: z.string().trim().min(2).max(120),
    email: z.string().trim().email().max(254),
    phone: z.string().trim().regex(/^\+?[0-9() .-]{10,20}$/),
    preferredContact: z.enum(['email', 'phone', 'text']),
  }),
  preferredWindows: z.array(z.object({
    date: z.string().regex(/^\d{4}-\d{2}-\d{2}$/),
    period: z.enum(['morning', 'afternoon', 'evening']),
  })).min(1).max(3),
  consent: z.literal(true),
}).strict();

export type IntakeInput = z.input<typeof intakeSchema>;
export type NormalizedIntake = z.output<typeof intakeSchema>;

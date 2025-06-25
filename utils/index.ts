import { Lead } from '../types';

export const getGreeting = (name: string | undefined) => {
  const hour = new Date().getHours();
  let greeting = 'Hello';
  let emoji = '👋';
  if (hour < 12) {
    greeting = 'Good morning';
    emoji = '☀️';
  } else if (hour < 18) {
    greeting = 'Good afternoon';
    emoji = '🌤️';
  } else {
    greeting = 'Good evening';
    emoji = '🌙';
  }
  return `${greeting},${name || 'User'}`;
};

// Email validation regex - basic but comprehensive
const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

// Phone validation regex - supports various formats
const PHONE_REGEX = /^[\+]?[(]?[\d\s\-\(\)\.]{7,}$/;

/**
 * Cleans and normalizes lead data
 */
export function cleanLeadData(lead: Lead): Lead {
  // Clean name - trim whitespace and normalize spacing
  const cleanName = lead.name?.trim().replace(/\s+/g, ' ') || '';

  // Clean email - lowercase, trim, and validate
  let cleanEmail = lead.email?.toLowerCase().trim() || '';
  if (cleanEmail && !EMAIL_REGEX.test(cleanEmail)) {
    cleanEmail = ''; // Invalid email, set to empty
  }

  // Clean company - trim and handle null/empty
  const cleanCompany = lead.company?.trim() || undefined;

  // Clean title - trim and handle empty strings
  const cleanTitle = lead.title?.trim() || undefined;

  // Clean phone - trim and validate
  let cleanPhone = lead.phone?.trim() || undefined;
  if (cleanPhone && !PHONE_REGEX.test(cleanPhone)) {
    cleanPhone = undefined; // Invalid phone, set to undefined
  }

  // Clean tags - remove empty, null, and duplicate tags, trim whitespace
  const cleanTags =
    lead.tags
      ?.map((tag) => tag?.toString().trim())
      .filter((tag) => tag && tag.length > 0)
      .filter((tag, index, array) => array.indexOf(tag) === index) || []; // Remove duplicates

  // Clean notes - trim and handle null
  const cleanNotes = lead.notes?.trim() || undefined;

  // Clean createdAt - validate and format date
  let cleanCreatedAt: string | undefined;
  if (lead.createdAt) {
    const date = new Date(lead.createdAt);
    cleanCreatedAt = isNaN(date.getTime())
      ? new Date().toISOString()
      : lead.createdAt;
  }

  return {
    ...lead,
    name: cleanName,
    email: cleanEmail,
    company: cleanCompany,
    title: cleanTitle,
    phone: cleanPhone,
    tags: cleanTags.length > 0 ? cleanTags : undefined,
    notes: cleanNotes,
    createdAt: cleanCreatedAt,
  };
}

/**
 * Cleans an array of lead data
 */
export function cleanLeadsData(leads: Lead[]): Lead[] {
  return leads.map(cleanLeadData);
}

export * from './contact';


import { Platform, HookPsychology, Tone, HookGoal } from './types';

export const PLATFORMS: Platform[] = ['Reels', 'TikTok', 'Shorts', 'X', 'LinkedIn', 'Instagram', 'Facebook'];

export const PSYCHOLOGIES: HookPsychology[] = [
  'Curiosity Gap',
  'Loss Aversion',
  'Pattern Interrupt',
  'Authority',
  'Relatability',
  'Negative Bias',  // Pro
  'Us vs Them',     // Pro
  'FOMO'            // Pro
];

export const PRO_PSYCHOLOGIES: HookPsychology[] = ['Negative Bias', 'Us vs Them', 'FOMO'];

export const TONES: Tone[] = ['bold', 'calm', 'controversial', 'storytelling', 'witty', 'educational'];

export const GOALS: HookGoal[] = [
  'Get Followers',
  'Drive Engagement',
  'Sell Product',
  'Generate Leads',
  'Build Community',
  'Increase Watch Time'
];

export const NICHES = [
  'Fitness & Health',
  'Business & Finance',
  'Tech & AI',
  'Personal Development',
  'Lifestyle & Travel',
  'Marketing & Sales',
  'Education',
  'Comedy & Entertainment'
];

export const NAV_LINKS = [
  { name: 'Home', path: '/' },
  { name: 'Dashboard', path: '/dashboard' },
  { name: 'Hooks', path: '/generate' },
  { name: 'Captions', path: '/captions' },
  { name: 'Examples', path: '/examples' },
  { name: 'Pricing', path: '/pricing' },
];

export const TESTIMONIALS = [
  {
    name: "Alex Rivera",
    role: "Fitness Influencer",
    content: "HookFlow completely changed my engagement rates. My Reels went from 2k views to 50k+ consistently.",
    avatar: "https://i.pravatar.cc/150?u=alex"
  },
  {
    name: "Sarah Chen",
    role: "SaaS Founder",
    content: "The LinkedIn viral engine is scary good. I've had 3 posts go viral in my first week using it.",
    avatar: "https://i.pravatar.cc/150?u=sarah"
  },
  {
    name: "Marcus Thorne",
    role: "TikTok Creator",
    content: "Pattern interrupt hooks are the secret sauce. Finally, an AI that actually understands psychology.",
    avatar: "https://i.pravatar.cc/150?u=marcus"
  }
];

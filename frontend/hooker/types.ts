
export type Platform = 'Reels' | 'TikTok' | 'Shorts' | 'X' | 'LinkedIn' | 'Instagram' | 'Facebook';

export type HookPsychology = 'Curiosity Gap' | 'Loss Aversion' | 'Pattern Interrupt' | 'Authority' | 'Relatability' | 'Negative Bias' | 'Us vs Them' | 'FOMO';

export type Tone = 'bold' | 'calm' | 'controversial' | 'storytelling' | 'witty' | 'educational';

export type HookGoal =
  | 'Get Followers'
  | 'Drive Engagement'
  | 'Sell Product'
  | 'Generate Leads'
  | 'Build Community'
  | 'Increase Watch Time';

export interface GeneratedHook {
  id: string;
  text: string;
  type: HookPsychology;
  platform: Platform;
  tone: Tone;
  goal?: HookGoal;
  explanation?: string;
}

export interface GeneratedCaption {
  id: string;
  text: string;
  hashtags: string[];
  tone: Tone;
  platform: Platform;
}

export interface UserStats {
  totalGenerated: number;
  savedHooks: number;
  topPlatform: Platform;
}

export interface UserDashboardData {
  stats: {
    plan: string;
    credits: number;
  };
  history: any[];
}

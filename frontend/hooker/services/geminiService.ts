import { Platform, HookPsychology, Tone, GeneratedHook, HookGoal, GeneratedCaption, UserDashboardData } from "../types";
import { API_BASE_URL } from '../config';

export async function generateHooks(params: {
  platform: Platform;
  niche: string;
  psychology: HookPsychology;
  tone: Tone;
  topic: string;
  goal: HookGoal;
  token: string;
}): Promise<GeneratedHook[]> {
  const { platform, niche, psychology, tone, topic, goal, token } = params;

  const queryParams = new URLSearchParams({
    topic,
    tone,
    niche,
    goal,
    platform,
    psychology,
  });

  const response = await fetch(`${API_BASE_URL}/api/hooks/generate?${queryParams.toString()}`, {
    method: 'GET',
    headers: {
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json',
    },
  });

  if (!response.ok) {
    const errData = await response.json().catch(() => ({}));
    if (response.status === 402) {
      throw new Error("INSUFFICIENT_CREDITS");
    }
    throw new Error(errData.detail || errData.error || 'Failed to fetch hooks from backend');
  }

  const rawResults = await response.json();

  return rawResults.map((item: any, index: number) => ({
    id: `${Date.now()}-${index}`,
    text: item.hook || item.text || item.content || item.hook_text || "",
    caption: item.caption || "",
    type: psychology,
    platform: platform,
    tone: tone,
    goal: goal,
    explanation: item.strategy_leak || item.explanation || item.analysis || item.strategy || "No analysis provided."
  }));
}

export async function generateCaptions(params: {
  platform: Platform;
  topic: string;
  tone: Tone;
  token: string;
}): Promise<GeneratedCaption[]> {
  const { platform, topic, tone, token } = params;

  const queryParams = new URLSearchParams({
    topic,
    tone,
    platform,
  });

  const response = await fetch(`${API_BASE_URL}/api/captions/generate?${queryParams.toString()}`, {
    method: 'GET',
    headers: {
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json',
    },
  });

  if (!response.ok) {
    const errData = await response.json().catch(() => ({}));
    if (response.status === 402) {
      throw new Error("INSUFFICIENT_CREDITS");
    }
    throw new Error(errData.detail || errData.error || 'Failed to fetch captions from backend');
  }

  const rawResults = await response.json();

  return rawResults.map((item: any) => ({
    text: item.text || item.caption || item.content || "",
    hashtags: Array.isArray(item.hashtags) ? item.hashtags : [],
    tone: tone,
    platform: platform
  }));
}

export async function getUserDashboard(token: string): Promise<UserDashboardData> {
  const response = await fetch(`${API_BASE_URL}/api/user/dashboard`, {
    method: 'GET',
    headers: {
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json',
    },
  });

  if (!response.ok) {
    throw new Error('Failed to fetch user data');
  }

  return response.json();
}
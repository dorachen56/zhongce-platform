import type { ModelLibraryEntry } from '../types';

export const mockModelLibrary: ModelLibraryEntry[] = [
  { id: 'ml001', name: 'GPT-4o', provider: 'OpenAI' },
  { id: 'ml002', name: 'GPT-4o-mini', provider: 'OpenAI' },
  { id: 'ml003', name: 'GPT-4.1', provider: 'OpenAI' },
  { id: 'ml004', name: 'Claude Opus 4', provider: 'Anthropic' },
  { id: 'ml005', name: 'Claude Sonnet 4.5', provider: 'Anthropic' },
  { id: 'ml006', name: 'Claude Haiku 4.5', provider: 'Anthropic' },
  { id: 'ml007', name: 'Gemini 2.0 Pro', provider: 'Google' },
  { id: 'ml008', name: 'Gemini 2.0 Flash', provider: 'Google' },
  { id: 'ml009', name: 'Gemini 1.5 Pro', provider: 'Google' },
  { id: 'ml010', name: 'DeepSeek-V3', provider: 'DeepSeek' },
  { id: 'ml011', name: 'DeepSeek-R1', provider: 'DeepSeek' },
  { id: 'ml012', name: 'DeepSeek-Coder-V2', provider: 'DeepSeek' },
  { id: 'ml013', name: 'Qwen-Max', provider: '阿里云' },
  { id: 'ml014', name: 'Qwen-72B-Instruct', provider: '阿里云' },
  { id: 'ml015', name: 'Moonshot-v1-128k', provider: '月之暗面' },
  { id: 'ml016', name: '文心一言4.0', provider: '百度' },
];

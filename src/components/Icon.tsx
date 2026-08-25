import clsx from "clsx";
import {
  Plus,
  ArrowRight,
  ChevronRight,
  Server,
  Download,
  AlertCircle,
  Network,
  Cpu,
  Bell,
  Settings,
  Terminal,
  BadgeCheck,
  Box,
  Trophy,
  Brain,
  Rocket,
  Landmark,
  Bot,
  Ear,
  AudioWaveform,
  Ban,
  FileText,
  ClipboardCheck,
  GitBranch,
  RadioTower,
  Globe,
  Play,
  Pause,
  Archive,
  Hourglass,
  type LucideIcon,
} from "lucide-react";

const ICONS: Record<string, LucideIcon> = {
  add: Plus,
  arrow_forward: ArrowRight,
  chevron_right: ChevronRight,
  dns: Server,
  download: Download,
  error: AlertCircle,
  hub: Network,
  memory: Cpu,
  notifications: Bell,
  settings: Settings,
  terminal: Terminal,
  verified: BadgeCheck,
  view_in_ar: Box,
  workspace_premium: Trophy,
  psychology: Brain,
  rocket_launch: Rocket,
  account_balance: Landmark,
  smart_toy: Bot,
  hearing: Ear,
  graphic_eq: AudioWaveform,
  block: Ban,
  description: FileText,
  fact_check: ClipboardCheck,
  account_tree: GitBranch,
  sensors: RadioTower,
  travel_explore: Globe,
  play_arrow: Play,
  pause: Pause,
  inventory_2: Archive,
  hourglass_empty: Hourglass,
  build: Settings,
};

interface IconProps {
  name: string;
  className?: string;
  size?: number;
}

export function Icon({ name, className, size = 20 }: IconProps) {
  const Component = ICONS[name] ?? AlertCircle;
  return <Component className={clsx("shrink-0", className)} size={size} strokeWidth={2} />;
}

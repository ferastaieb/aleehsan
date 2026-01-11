export type Settings = {
  id: number;
  total_surplus: number;
  disks_sold: number;
  families_supported: number;
  projects_launched: number;
  visitors_count: number;
  base_price: number;
  extra_price: number;
  project_title: string;
  progress_percent: number;
  remaining_amount: number;
  sales_points: string;
  updated_at: string;
};

export type Story = {
  id: number;
  title: string;
  description: string;
  image_url: string;
  position: number;
};

export type DetailKind = "income" | "expense" | "in-kind";

export type DetailEntry = {
  id: number;
  kind: DetailKind;
  description: string;
  amount: number | null;
  created_at: string;
};

export type Store = {
  settings: Settings;
  stories: Story[];
};

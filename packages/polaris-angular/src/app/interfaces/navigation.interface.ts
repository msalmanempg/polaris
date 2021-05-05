export interface NavigationItem {
  displayName: string;
  disabled?: boolean;
  icon?: string;
  iconType?: string;
  route?: string;
  children?: NavigationItem[];
}

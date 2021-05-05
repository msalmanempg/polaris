import { NavigationItem } from "@app/interfaces/navigation.interface";

export const navigationIconTypes = Object.freeze({
  // eslint-disable-next-line @typescript-eslint/naming-convention
  SVG_TYPE: "svg",
});

export const navigationItems: NavigationItem[] = [
  {
    displayName: "Dashboard",
    icon: "dashboard",
    route: "customers",
  },
  {
    displayName: "Agreements",
    icon: "agreements",
    iconType: navigationIconTypes.SVG_TYPE,
    children: [
      {
        displayName: "Agreements",
        route: "agreements",
      },
      {
        displayName: "Customers",
        route: "customers",
      },
      {
        displayName: "Invoices",
        route: "invoices",
      },
    ],
  },
  {
    displayName: "Payments",
    icon: "attach_money",
    route: "payments",
  },
  {
    displayName: "Projects",
    icon: "projects",
    iconType: navigationIconTypes.SVG_TYPE,
    children: [
      {
        displayName: "Projects",
        route: "projects",
      },
      {
        displayName: "Units",
        route: "units",
      },
    ],
  },
  {
    displayName: "Settings",
    icon: "settings",
    children: [
      {
        displayName: "Account",
        route: "accounts",
        children: [],
      },
      {
        displayName: "Users",
        route: "users",
        children: [],
      },
    ],
  },
];

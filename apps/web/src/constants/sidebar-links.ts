import {
  IconFileCode,
  IconLayoutDashboard,
  IconListSearch,
  IconRoute,
  IconShield,
} from "@tabler/icons-react";

export const SIDEBAR_LINKS = [
  {
    title: "CloudGuard",
    links: [
      { label: "Overview", icon: IconLayoutDashboard, link: "#overview" },
      { label: "Policies", icon: IconFileCode, link: "#policies" },
      { label: "Findings", icon: IconListSearch, link: "#findings" },
      { label: "Attack path", icon: IconRoute, link: "#attack-path" },
      { label: "Guide", icon: IconShield, link: "#guide" },
    ],
  },
];

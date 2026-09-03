import SvgColor from "src/components/svg-color";

// ----------------------------------------------------------------------

const icon = (name) => (
  <SvgColor
    src={`/assets/icons/navbar/${name}.svg`}
    sx={{ width: 1, height: 1 }}
  />
);

const navConfig = [
  {
    title: "dashboard",
    path: "/dashboard",
    icon: icon("ic_analytics"),
  },
  // {
  //   title: "company management",
  //   path: "/dashboard/company-management",
  //   icon: icon("ic_user"),
  // },
  {
    title: "construction companies",
    path: "/construction-companies",
    icon: icon("construction"),
  },
  {
    title: "truck operator companies",
    path: "/truck-operator-companies",
    icon: icon("truck_operator"),
  },
  {
    title: "feedbacks",
    path: "/feedbacks",
    icon: icon("ic_feedback"),
  },
  {
    title: "notifications",
    path: "/notifications",
    icon: icon("ic_notification"),
  },
  //  {
  //   title: "detail",
  //   path: "/dashboard/detail",
  //   icon: icon("ic_notification"),
  // },
  // {
  //   title: 'plans & fees',
  //   path: '/dashboard/plans&fess',
  //   icon: icon('ic_subscription'),
  // },
  // {
  //   title: 'subscription & commission',
  //   path: '/dashboard/subscription&commission',
  //   icon: icon('ic_subscription'),
  // },
  // {
  //   title: 'login',
  //   path: '/login',
  //   icon: icon('ic_lock'),
  // },
  // {
  //   title: 'Not found',
  //   path: '/404',
  //   icon: icon('ic_disabled'),
  // },
];

export default navConfig;

import { MenuItem } from './types';

export const menuItems: MenuItem[] = [
  {
    name: 'Dashboard',
    icon: '/icons/admin_dashboard.png',
    activeIcon: '/icons/admin_dashboard_act.png',
    href: '/admin',
  },
  {
    name: '통계',
    icon: '/icons/admin_analytics.png',
    activeIcon: '/icons/admin_analytics_act.png',
    href: '/admin/analytics',
  },
  {
    name: '댓글 관리',
    icon: '/icons/admin_management.png',
    activeIcon: '/icons/admin_management_act.png',
    href: '/admin/comment',
  },
  {
    name: '카테고리 관리',
    icon: '/icons/admin_management.png',
    activeIcon: '/icons/admin_management_act.png',
    href: '/admin/category',
  },
  {
    name: '블로그 관리',
    icon: '/icons/admin_blog.png',
    activeIcon: '/icons/admin_blog_act.png',
    href: '/admin/blog-settings',
  },
  {
    name: '관리자 설정',
    icon: '/icons/admin_blog.png',
    activeIcon: '/icons/admin_blog_act.png',
    href: '/admin/admin-settings',
  },
];

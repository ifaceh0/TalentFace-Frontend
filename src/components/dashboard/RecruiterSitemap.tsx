import { Home, User, Settings, Lock, Briefcase, Users, HelpCircle } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export default function RecruiterSitemap() {
  const navigate = useNavigate();

  const sitemapLinks = [
    {
      category: 'Main',
      links: [
        { icon: Home, label: 'Dashboard', path: '/recruiter/dashboard', description: 'Main dashboard overview' },
        { icon: Briefcase, label: 'Jobs', path: '/recruiter/dashboard', description: 'Manage job postings' },
        { icon: Users, label: 'Candidates', path: '/recruiter/dashboard', description: 'View all applicants' },
      ]
    },
    {
      category: 'Account',
      links: [
        { icon: User, label: 'View Profile', path: '/recruiter/profile', description: 'Edit your profile' },
        { icon: Settings, label: 'Settings', path: '/recruiter/settings', description: 'Manage preferences' },
        { icon: Lock, label: 'Change Password', path: '/recruiter/change-password', description: 'Update password' },
      ]
    },
  ];

  return (
    <div className="mt-12 bg-gradient-to-br from-blue-50 to-gray-50 rounded-2xl border border-blue-200 p-8">
      {/* Header */}
      <div className="mb-8">
        <h2 className="text-2xl font-bold text-gray-900">Recruiter Portal Sitemap</h2>
        <p className="text-gray-600 mt-2">Quick access to all pages and features</p>
      </div>

      {/* Sitemap Grid */}
      <div className="grid md:grid-cols-2 gap-8">
        {sitemapLinks.map((section) => (
          <div key={section.category}>
            <h3 className="text-lg font-semibold text-blue-900 mb-4">{section.category}</h3>
            <div className="space-y-3">
              {section.links.map((link) => {
                const IconComponent = link.icon;
                return (
                  <button
                    key={`${link.label}-${link.path}`}
                    onClick={() => navigate(link.path)}
                    className="w-full flex items-start gap-4 p-4 bg-white rounded-xl border border-gray-200 hover:border-blue-400 hover:shadow-md transition group"
                  >
                    <div className="w-10 h-10 rounded-lg bg-blue-100 flex items-center justify-center text-blue-600 group-hover:bg-blue-600 group-hover:text-white transition flex-shrink-0">
                      <IconComponent size={20} />
                    </div>
                    <div className="text-left flex-1">
                      <p className="font-semibold text-gray-900 group-hover:text-blue-600 transition">{link.label}</p>
                      <p className="text-xs text-gray-500 mt-1">{link.description}</p>
                    </div>
                    <div className="text-gray-300 group-hover:text-blue-600 transition">
                      →
                    </div>
                  </button>
                );
              })}
            </div>
          </div>
        ))}
      </div>

      {/* Help Section */}
      <div className="mt-8 p-6 bg-blue-100 border border-blue-300 rounded-xl">
        <div className="flex items-start gap-3">
          <HelpCircle size={20} className="text-blue-600 flex-shrink-0 mt-0.5" />
          <div>
            <p className="font-semibold text-blue-900">Need Help?</p>
            <p className="text-sm text-blue-800 mt-1">
              Use this sitemap to navigate between different sections of the recruiter portal. Click any section below to jump directly to that page.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

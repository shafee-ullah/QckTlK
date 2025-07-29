import React from 'react';
import { User, CreditCard, Clock } from 'lucide-react';

export const ProfileTab = ({ profile }) => {
  if (!profile) return <div>Loading profile...</div>;

  return (
    <div className="space-y-6">
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
        <h2 className="text-2xl font-bold mb-6 text-gray-900 dark:text-white">Profile Information</h2>
        <div className="flex flex-col md:flex-row items-start gap-6">
          <div className="w-24 h-24 rounded-full overflow-hidden border-4 border-blue-100 dark:border-blue-900">
            <img
              src={profile.photoURL}
              alt={profile.displayName}
              className="w-full h-full object-cover"
              onError={(e) => {
                e.target.onerror = null;
                e.target.src = "/default-avatar.svg";
              }}
            />
          </div>
          <div className="flex-1">
            <div className="flex items-center gap-2 mb-2">
              <h3 className="text-xl font-semibold text-gray-900 dark:text-white">
                {profile.displayName}
              </h3>
              {profile.badge && (
                <span className="bg-yellow-100 text-yellow-800 text-xs font-medium px-2.5 py-0.5 rounded-full dark:bg-yellow-900 dark:text-yellow-300">
                  {profile.badge}
                </span>
              )}
            </div>
            <p className="text-gray-600 dark:text-gray-300 mb-4">{profile.email}</p>
            
            <div className="flex items-center gap-4 text-sm">
              <div className="flex items-center gap-2 text-gray-600 dark:text-gray-400">
                <CreditCard className="w-4 h-4" />
                <span className="capitalize">{profile.membership || 'free'} membership</span>
              </div>
              {profile.membershipUpgradedAt && (
                <div className="flex items-center gap-2 text-gray-600 dark:text-gray-400">
                  <Clock className="w-4 h-4" />
                  <span>Member since {new Date(profile.membershipUpgradedAt).toLocaleDateString()}</span>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProfileTab;

import React from 'react';
import { SitePage } from '../types';
import { LandingPage } from '../components/LandingPage';

interface HomePageProps {
  onNavigatePage: (page: SitePage) => void;
  onLaunchDemo: () => void;
}

export const HomePage: React.FC<HomePageProps> = ({
  onNavigatePage,
  onLaunchDemo,
}) => {
  return (
    <LandingPage
      onStartDiagnosis={() => onNavigatePage('prediction')}
      onNavigateDashboard={() => onLaunchDemo()}
      onOpenAuth={() => onLaunchDemo()}
      onNavigatePage={onNavigatePage}
      hideNavAndFooter={true}
    />
  );
};

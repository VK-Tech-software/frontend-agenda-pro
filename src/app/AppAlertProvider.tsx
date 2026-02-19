import { AppAlert } from '../components/alert';

export const AppAlertProvider = ({ children }: { children: React.ReactNode }) => (
  <>
    <AppAlert />
    {children}
  </>
);
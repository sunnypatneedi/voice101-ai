// Type definitions for @testing-library/user-event
// These are minimal type definitions to resolve the TypeScript error
// Full type definitions should be installed via @types/testing-library__user-event

declare module '@testing-library/user-event' {
  import { UserEvent } from '@testing-library/user-event/setup';
  const userEvent: UserEvent;
  export default userEvent;
}

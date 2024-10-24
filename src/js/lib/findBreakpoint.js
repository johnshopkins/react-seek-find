import settings from '../../settings';

export default function findBreakpoint(width) {

  if (width < settings.breakpointTablet) {
    return 'mobile';
  }

  if (width < settings.breakpointDesktop) {
    return 'tablet';
  }

  return 'desktop'
}

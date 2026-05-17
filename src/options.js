export const CREW_ROLES = [
  'Director',
  'Actor',
  'DP / Camera',
  'Sound',
  'Editor',
  'Producer',
  'Writer',
  'PA',
];

export function deriveCheckInCapabilities(roles, resources) {
  return {
    can_act_today: roles.includes('Actor'),
    can_direct_today: roles.includes('Director'),
    can_edit_today: roles.includes('Editor'),
    can_drive_today: false,
    can_provide_camera: resources.includes('eq'),
    can_provide_audio: resources.includes('eq'),
    can_provide_location: resources.includes('loc'),
    can_provide_props: resources.includes('props'),
  };
}

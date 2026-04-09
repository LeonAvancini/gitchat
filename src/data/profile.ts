import type { Profile } from '../types';

export const mockProfile: Profile = {
  displayName: 'Jose\nMasa',
  username: 'josemasa',
  avatarUrl: 'https://i.pravatar.cc/256?img=12',
  bio: 'I think in components and dream in transitions. Somewhere between pixel-perfect and "ship it Friday."',
  location: 'Buenos Aires, Argentina',
  company: 'Concourse',
  joinedYear: 2018,
  stats: {
    repositories: 127,
    followers: 4832,
    following: 189,
    stars: 12400,
  },
};

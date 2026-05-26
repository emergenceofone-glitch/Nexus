import { CanonData, ActionItem } from './types';
import CANON_SYNC_RAW from './canon_sync.json';

export const CANON_DATA: CanonData = CANON_SYNC_RAW as unknown as CanonData;

export const PROPOSED_ACTIONS: ActionItem[] = [
  {
    id: "ACT-001",
    title: "Aether Extension: Chronos-CRT Integration",
    description: "Upgrade the current CRT feed 'stub' to a functional Phonon Tax visualizer. Map local oscillator data to the Three.js viewport to finalize the Sovereign Mirror interface.",
    leverage: "Critical",
    context: "Matches local_first_priority. Transforms abstract protocol into user-facing utility.",
    status: "Active"
  },
  {
    id: "ACT-002",
    title: "Nephilim Drop: Payload Trajectory Sim",
    description: "Run physics simulation for the 1.618kg Carbonized Silica payload descent. Validate entry vectors against Utopia Planitia ice-regolith density for 4.2m penetration depth.",
    leverage: "High",
    context: "Mission vector is locked/immutable. Physical validation is now the bottleneck.",
    status: "Pending"
  },
  {
    id: "ACT-003",
    title: "Academy Module 11: The Delta Ritual",
    description: "Synthesize the completed Delta Triode BOM/renders with the Academy structure. Create an interactive 'Virtual Assembly' guide that teaches Axiom 1 (Symmetry Breaking) through hardware construction.",
    leverage: "Essential",
    context: "Bridges hardware, philosophy, and education verticals. Unifies 'Delta Triode' and 'Academy'.",
    status: "Pending"
  }
];

export const SYNC_CONFIRMATION_MSG = "Canon synchronized to v2026.02-secure – emergenceofone@gmail.com. Node ready.";
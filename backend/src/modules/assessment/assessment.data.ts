import groupsJson from "../../data/groups.json";
import profilesJson from "../../data/profiles.json";
import type { Group, Profile } from "./assessment.types";

export const groups = groupsJson as Group[];
export const profiles = profilesJson as Profile[];
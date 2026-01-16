import { groupCounters } from "../socketIndex.js";
export const updateGroupCounters = (groupId, role, action) => {
  if (!groupCounters.has(groupId)) {
    groupCounters.set(groupId, { active: 0, guests: 0 });
  }
  const counters = groupCounters.get(groupId);
  const isActive = role === "admin" || role === "active";
  if (action === "join") {
    isActive ? counters.active++ : counters.guests++;
  }
  if (action === "leave") {
    isActive ? counters.active-- : counters.guests--;
  }
};

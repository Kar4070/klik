export const calculateDaysRemaining = (trialEndsAt) => {
  if (!trialEndsAt) return 0
  const end = new Date(trialEndsAt)
  const now = new Date()
  // Use local midnight for accurate day calculation
  const endMidnight = new Date(end.getFullYear(), end.getMonth(), end.getDate())
  const nowMidnight = new Date(now.getFullYear(), now.getMonth(), now.getDate())
  const diffMs = endMidnight.getTime() - nowMidnight.getTime()
  const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24))
  return diffDays > 0 ? diffDays : 0
}

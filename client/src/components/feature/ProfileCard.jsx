import { Star, Award } from 'lucide-react'
import { Card } from '../ui/Card'
import { Avatar } from '../ui/Avatar'

// Summary card shown at the top of a profile page (own or someone else's).
export function ProfileCard({ user, profile }) {
  return (
    <Card>
      <div className="flex items-center gap-4">
        <Avatar src={user?.avatar} name={user?.name} size={64} />
        <div>
          <h2 className="font-heading text-xl font-semibold tracking-tight text-text-primary">{user?.name}</h2>
          <p className="text-sm text-text-secondary">{profile?.college}</p>
        </div>
      </div>

      {profile?.bio && <p className="mt-4 text-sm text-text-secondary">{profile.bio}</p>}

      <div className="mt-4 flex gap-6 border-t border-border pt-4">
        <div className="flex items-center gap-1.5 text-sm">
          <Star size={15} className="fill-warning text-warning" />
          <span className="font-medium text-text-primary">{profile?.avgRating?.toFixed(1) || '0.0'}</span>
          <span className="text-text-secondary">rating</span>
        </div>
        <div className="flex items-center gap-1.5 text-sm">
          <Award size={15} className="text-sage-dark" />
          <span className="font-medium text-text-primary">{profile?.reputationScore || 0}</span>
          <span className="text-text-secondary">reputation</span>
        </div>
      </div>

      {profile?.skills?.length > 0 && (
        <div className="mt-4 flex flex-wrap gap-2">
          {profile.skills.map((skill) => (
            <span key={skill} className="rounded-full bg-surface-alt px-2.5 py-1 text-xs text-text-secondary">
              {skill}
            </span>
          ))}
        </div>
      )}
    </Card>
  )
}

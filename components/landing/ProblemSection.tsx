import { BookOpen, Users } from 'lucide-react'
import { STUDENT_DIALOGUE, PARENT_DIALOGUE } from '@/lib/landing-constants'

interface DialogueBubbleProps {
  speaker: string
  role: string
  message: string
  isReply: boolean
  color: 'primary' | 'secondary'
  icon: React.ReactNode
}

function DialogueBubble({
  speaker,
  role,
  message,
  isReply,
  color,
  icon,
}: DialogueBubbleProps) {
  if (isReply) {
    return (
      <div className="flex items-start gap-4 justify-end">
        <div
          className={`text-white glass-card p-6 rounded-2xl rounded-tr-none flex-1 shadow-lg ${
            color === 'primary' ? 'bg-primary' : 'bg-secondary'
          }`}
        >
          <p className="text-body-md italic opacity-90">{message}</p>
          <span className="block mt-2 text-xs font-label-bold">{role}</span>
        </div>
      </div>
    )
  }

  return (
    <div className="flex items-start gap-4">
      <div
        className={`${color === 'primary' ? 'bg-primary/10' : 'bg-secondary/10'} p-3 rounded-full flex-shrink-0`}
      >
        <span
          className={`${
            color === 'primary' ? 'text-primary' : 'text-secondary'
          }`}
        >
          {icon}
        </span>
      </div>
      <div className="glass-card p-6 rounded-2xl rounded-tl-none flex-1">
        <p className="text-body-md text-on-surface">{message}</p>
        <span
          className={`block mt-2 text-xs font-label-bold ${
            color === 'primary' ? 'text-primary' : 'text-secondary'
          }`}
        >
          {role}
        </span>
      </div>
    </div>
  )
}

export function ProblemSection() {
  return (
    <section id="approach" className="py-xl px-6 bg-surface-container-lowest">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="text-center mb-16">
          <h2 className="font-h2 text-h2 text-primary mb-4">
            You're not confused.
          </h2>
          <p className="text-body-lg text-on-surface-variant font-normal italic max-w-2xl mx-auto">
            You just don't have the right guidance yet.
          </p>
        </div>

        {/* Dialogues Grid */}
        <div className="grid md:grid-cols-2 gap-12">
          {/* Student Column */}
          <div className="space-y-6">
            <DialogueBubble
              speaker={STUDENT_DIALOGUE[0].speaker}
              role={STUDENT_DIALOGUE[0].role}
              message={STUDENT_DIALOGUE[0].message}
              isReply={false}
              color="primary"
              icon={<BookOpen className="w-6 h-6" />}
            />
            <DialogueBubble
              speaker={STUDENT_DIALOGUE[1].speaker}
              role={STUDENT_DIALOGUE[1].role}
              message={STUDENT_DIALOGUE[1].message}
              isReply={true}
              color="primary"
              icon={<BookOpen className="w-6 h-6" />}
            />
          </div>

          {/* Parent Column */}
          <div className="space-y-6">
            <DialogueBubble
              speaker={PARENT_DIALOGUE[0].speaker}
              role={PARENT_DIALOGUE[0].role}
              message={PARENT_DIALOGUE[0].message}
              isReply={false}
              color="secondary"
              icon={<Users className="w-6 h-6" />}
            />
            <DialogueBubble
              speaker={PARENT_DIALOGUE[1].speaker}
              role={PARENT_DIALOGUE[1].role}
              message={PARENT_DIALOGUE[1].message}
              isReply={true}
              color="secondary"
              icon={<Users className="w-6 h-6" />}
            />
          </div>
        </div>
      </div>
    </section>
  )
}

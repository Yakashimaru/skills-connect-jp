import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import { getActiveSubscription, cancelSubscription } from '../lib/subscriptions'

const C = {
  brand: '#5C0A1E',
  gold: '#B8860B',
  text: '#1A0208',
  muted: '#7A6060',
  border: '#E8DDD5',
  bg: '#FDF8F2',
}

const PLAN_LABELS: Record<string, { label: string; price: string; bg: string; color: string }> = {
  standard: { label: 'Standard', price: '¥5,000 / month', bg: '#F5F5F5', color: '#1A0208' },
  premium:  { label: 'Premium',  price: '¥10,000 / month', bg: '#5C0A1E', color: '#fff' },
  elite:    { label: 'Elite',    price: '¥50,000 / month', bg: '#1A0208', color: '#fff' },
}

export default function SubscriptionSettings() {
  const navigate = useNavigate()
  const { user } = useAuth()
  const [sub, setSub] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const [confirmCancel, setConfirmCancel] = useState(false)
  const [cancelling, setCancelling] = useState(false)
  const [cancelError, setCancelError] = useState<string | null>(null)

  useEffect(() => {
    if (!user) return
    getActiveSubscription(user.id).then(({ data }) => {
      setSub(data)
      setLoading(false)
    })
  }, [user])

  const plan = sub ? PLAN_LABELS[sub.plan] : null
  const alreadyCancelledAtPeriodEnd = sub?.status === 'active' && !!sub?.cancelled_at
  const renewsAt = sub?.renews_at
    ? new Date(sub.renews_at).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })
    : null
  const startedAt = sub?.started_at
    ? new Date(sub.started_at).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })
    : null

  const handleCancel = async () => {
    setCancelling(true)
    setCancelError(null)
    const result = await cancelSubscription()
    setCancelling(false)
    if ('error' in result) { setCancelError(result.error); return }
    setSub((prev: any) => ({ ...prev, cancelled_at: new Date().toISOString() }))
    setConfirmCancel(false)
  }

  return (
    <div className="min-h-screen" style={{ backgroundColor: C.bg }}>
      <div className="max-w-xl mx-auto px-6 py-12">

        <button
          onClick={() => navigate(-1)}
          className="text-sm mb-8 flex items-center gap-1"
          style={{ color: C.muted }}
        >
          ← Back
        </button>

        <h1 className="text-2xl font-bold mb-1" style={{ color: C.text }}>Subscription</h1>
        <p className="text-sm mb-8" style={{ color: C.muted }}>Manage your current plan and billing.</p>

        {loading ? (
          <div className="text-sm text-center py-12" style={{ color: C.muted }}>Loading…</div>
        ) : plan ? (
          <div className="rounded-2xl overflow-hidden" style={{ border: `0.5px solid ${C.border}`, backgroundColor: '#fff' }}>

            {/* Plan header */}
            <div className="p-6" style={{ backgroundColor: plan.bg }}>
              <p className="text-xs font-semibold tracking-widest uppercase mb-1" style={{ color: C.gold }}>Current plan</p>
              <p className="text-2xl font-bold" style={{ color: plan.color }}>{plan.label}</p>
              <p className="text-sm mt-0.5" style={{ color: C.gold }}>{plan.price}</p>
            </div>

            {/* Details */}
            <div className="p-6 flex flex-col gap-4">
              <div className="flex flex-col gap-3">
                {startedAt && (
                  <Row label="Started" value={startedAt} />
                )}
                {renewsAt && (
                  <Row
                    label={alreadyCancelledAtPeriodEnd ? 'Access ends' : 'Next renewal'}
                    value={renewsAt}
                    valueColor={alreadyCancelledAtPeriodEnd ? '#f87171' : undefined}
                  />
                )}
                <Row
                  label="Status"
                  value={alreadyCancelledAtPeriodEnd ? 'Cancels at period end' : 'Active'}
                  valueColor={alreadyCancelledAtPeriodEnd ? '#f87171' : '#22c55e'}
                />
              </div>

              <hr style={{ borderColor: C.border }} />

              {cancelError && (
                <p className="text-xs text-center" style={{ color: '#f87171' }}>{cancelError}</p>
              )}

              {!alreadyCancelledAtPeriodEnd && !confirmCancel && (
                <button
                  onClick={() => setConfirmCancel(true)}
                  className="w-full py-2.5 rounded-xl text-sm transition-colors"
                  style={{ border: `0.5px solid ${C.border}`, color: '#aaa', backgroundColor: 'transparent' }}
                  onMouseEnter={e => (e.currentTarget.style.color = '#f87171')}
                  onMouseLeave={e => (e.currentTarget.style.color = '#aaa')}
                >
                  Cancel subscription
                </button>
              )}

              {confirmCancel && (
                <div className="rounded-xl p-4" style={{ backgroundColor: C.bg, border: `0.5px solid ${C.border}` }}>
                  <p className="text-sm text-center mb-1 font-medium" style={{ color: C.text }}>Cancel your subscription?</p>
                  <p className="text-xs text-center mb-4" style={{ color: C.muted }}>
                    Your access continues until {renewsAt ?? 'the end of the billing period'}. You won't be charged again.
                  </p>
                  <div className="flex gap-2">
                    <button
                      onClick={handleCancel}
                      disabled={cancelling}
                      className="flex-1 py-2 rounded-lg text-sm font-medium disabled:opacity-60"
                      style={{ backgroundColor: '#f87171', color: '#fff' }}
                    >
                      {cancelling ? '…' : 'Yes, cancel'}
                    </button>
                    <button
                      onClick={() => { setConfirmCancel(false); setCancelError(null) }}
                      disabled={cancelling}
                      className="flex-1 py-2 rounded-lg text-sm"
                      style={{ border: `0.5px solid ${C.border}`, color: C.brand, backgroundColor: 'transparent' }}
                    >
                      Keep plan
                    </button>
                  </div>
                </div>
              )}

              {!alreadyCancelledAtPeriodEnd && !confirmCancel && (
                <button
                  onClick={() => navigate('/subscribe')}
                  className="w-full py-2.5 rounded-xl text-sm transition-colors"
                  style={{ border: `0.5px solid ${C.gold}`, color: C.gold, backgroundColor: 'transparent' }}
                  onMouseEnter={e => (e.currentTarget.style.backgroundColor = 'rgba(184,134,11,0.06)')}
                  onMouseLeave={e => (e.currentTarget.style.backgroundColor = 'transparent')}
                >
                  Change plan
                </button>
              )}

              {alreadyCancelledAtPeriodEnd && (
                <button
                  onClick={() => navigate('/subscribe')}
                  className="w-full py-2.5 rounded-xl text-sm transition-colors"
                  style={{ border: `0.5px solid ${C.gold}`, color: C.gold, backgroundColor: 'transparent' }}
                  onMouseEnter={e => (e.currentTarget.style.backgroundColor = 'rgba(184,134,11,0.06)')}
                  onMouseLeave={e => (e.currentTarget.style.backgroundColor = 'transparent')}
                >
                  Resubscribe
                </button>
              )}
            </div>
          </div>
        ) : (
          <div className="rounded-2xl p-8 text-center" style={{ border: `0.5px solid ${C.border}`, backgroundColor: '#fff' }}>
            <p className="text-sm font-medium mb-1" style={{ color: C.text }}>No active subscription</p>
            <p className="text-xs mb-6" style={{ color: C.muted }}>Subscribe to unlock chat, bookings, and more.</p>
            <button
              onClick={() => navigate('/subscribe')}
              className="px-8 py-3 rounded-xl text-sm font-medium"
              style={{ backgroundColor: C.gold, color: '#3A2400' }}
            >
              View plans
            </button>
          </div>
        )}
      </div>
    </div>
  )
}

function Row({ label, value, valueColor }: { label: string; value: string; valueColor?: string }) {
  return (
    <div className="flex justify-between items-center">
      <span className="text-sm" style={{ color: '#7A6060' }}>{label}</span>
      <span className="text-sm font-medium" style={{ color: valueColor ?? '#1A0208' }}>{value}</span>
    </div>
  )
}

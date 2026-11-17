import moment from 'moment-timezone'

const MARKET_TIME_ZONE = 'America/New_York'
const CHECK_INTERVAL = 30 * 1000
// NYSE published calendar: https://www.nyse.com/trade/hours-calendars
const CLOSED_DAYS = new Set([
  '2026-01-01', '2026-01-19', '2026-02-16', '2026-04-03', '2026-05-25',
  '2026-06-19', '2026-07-03', '2026-09-07', '2026-11-26', '2026-12-25',
  '2027-01-01', '2027-01-18', '2027-02-15', '2027-03-26', '2027-05-31',
  '2027-06-18', '2027-07-05', '2027-09-06', '2027-11-25', '2027-12-24',
  '2028-01-17', '2028-02-21', '2028-04-14', '2028-05-29', '2028-06-19',
  '2028-07-04', '2028-09-04', '2028-11-23', '2028-12-25'
])
const EARLY_CLOSE_DAYS = new Set([
  '2026-11-27', '2026-12-24', '2027-11-26', '2028-07-03', '2028-11-24'
])

function marketTime(now = Date.now()) {
  return moment.tz(now, MARKET_TIME_ZONE)
}

function sessionBoundary(day, hour, minute = 0) {
  return day.clone().hour(hour).minute(minute).second(0).millisecond(0)
}

function isTradingDay(day) {
  return day.isoWeekday() <= 5 && !CLOSED_DAYS.has(day.format('YYYY-MM-DD'))
}

function marketClose(day) {
  return sessionBoundary(day, EARLY_CLOSE_DAYS.has(day.format('YYYY-MM-DD')) ? 13 : 16)
}

export function isIntradayMarketOpen(now = Date.now()) {
  const et = marketTime(now)
  if (!isTradingDay(et)) return false
  return et.isSameOrAfter(sessionBoundary(et, 9, 30)) && et.isBefore(marketClose(et))
}

function nextMarketOpen(now) {
  const et = marketTime(now)
  let opening = sessionBoundary(et, 9, 30)
  if (!opening.isAfter(et)) opening.add(1, 'day')
  while (!isTradingDay(opening)) opening.add(1, 'day')
  return opening
}

// Keeps the 30-second freshness check alive only during regular US market hours.
export function startIntradayMarketRefresh(check) {
  let interval = null
  let boundary = null
  let stopped = false

  const schedule = () => {
    if (stopped) return
    if (interval) clearInterval(interval)
    if (boundary) clearTimeout(boundary)
    interval = null
    const now = Date.now()
    if (isIntradayMarketOpen(now)) {
      check()
      interval = setInterval(check, CHECK_INTERVAL)
      const close = marketClose(marketTime(now))
      boundary = setTimeout(schedule, Math.max(1, close.valueOf() - now))
    } else {
      boundary = setTimeout(schedule, Math.max(1, nextMarketOpen(now).valueOf() - now))
    }
  }

  schedule()
  return () => {
    stopped = true
    if (interval) clearInterval(interval)
    if (boundary) clearTimeout(boundary)
  }
}

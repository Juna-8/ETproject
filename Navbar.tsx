import React from 'react';
import {
  format,
  startOfMonth,
  endOfMonth,
  eachDayOfInterval,
  isSameDay,
  addMonths,
  subMonths,
  isSameMonth,
} from 'date-fns';
import { ko } from 'date-fns/locale';
import { ChevronLeft, ChevronRight, X, MapPin, Clock } from 'lucide-react';
import { Event } from '../types';
import { cn, formatDateTime } from '../lib/utils';
import { motion, AnimatePresence } from 'motion/react';

interface CalendarViewProps {
  events: Event[];
  onEventClick: (event: Event) => void;
  bookmarks: string[];
}

export default function CalendarView({ events, onEventClick, bookmarks }: CalendarViewProps) {
  const [currentDate, setCurrentDate] = React.useState(new Date());
  // 다중 이벤트 모달: 선택된 날의 이벤트 목록
  const [dayEvents, setDayEvents] = React.useState<Event[] | null>(null);
  const [selectedDayLabel, setSelectedDayLabel] = React.useState('');

  const monthStart = startOfMonth(currentDate);
  const monthEnd = endOfMonth(currentDate);
  const days = eachDayOfInterval({ start: monthStart, end: monthEnd });

  const getEventsForDay = (day: Date) =>
    events.filter((event) => isSameDay(new Date(event.date), day));

  const handleDayClick = (day: Date) => {
    const evts = getEventsForDay(day);
    if (evts.length === 0) return;
    if (evts.length === 1) {
      onEventClick(evts[0]);
    } else {
      setSelectedDayLabel(format(day, 'M월 d일 (eee)', { locale: ko }));
      setDayEvents(evts);
    }
  };

  return (
    <>
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-4">
        {/* Month navigation */}
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-lg font-bold text-gray-900">
            {format(currentDate, 'yyyy년 M월', { locale: ko })}
          </h2>
          <div className="flex gap-2">
            <button
              onClick={() => setCurrentDate(subMonths(currentDate, 1))}
              className="p-1 hover:bg-gray-100 rounded-full transition-colors"
            >
              <ChevronLeft size={20} />
            </button>
            <button
              onClick={() => setCurrentDate(addMonths(currentDate, 1))}
              className="p-1 hover:bg-gray-100 rounded-full transition-colors"
            >
              <ChevronRight size={20} />
            </button>
          </div>
        </div>

        {/* Day-of-week header */}
        <div className="grid grid-cols-7 gap-1 mb-2">
          {['일', '월', '화', '수', '목', '금', '토'].map((day, i) => (
            <div
              key={day}
              className={cn(
                'text-center text-[10px] font-bold py-1',
                i === 0 ? 'text-red-400' : i === 6 ? 'text-blue-400' : 'text-gray-400'
              )}
            >
              {day}
            </div>
          ))}
        </div>

        {/* Calendar grid */}
        <div className="grid grid-cols-7 gap-1">
          {Array.from({ length: monthStart.getDay() }).map((_, i) => (
            <div key={`pad-${i}`} className="aspect-square" />
          ))}

          {days.map((day) => {
            const evts = getEventsForDay(day);
            const isToday = isSameDay(day, new Date());
            const hasEvent = evts.length > 0;

            return (
              <div
                key={day.toString()}
                onClick={() => handleDayClick(day)}
                className={cn(
                  'aspect-square relative flex flex-col items-center justify-center rounded-lg transition-colors',
                  isToday ? 'bg-ewha-green text-white' : 'hover:bg-gray-50',
                  hasEvent && !isToday ? 'cursor-pointer' : ''
                )}
              >
                <span
                  className={cn(
                    'text-xs font-medium',
                    !isToday && day.getDay() === 0 ? 'text-red-500' : '',
                    !isToday && day.getDay() === 6 ? 'text-blue-500' : ''
                  )}
                >
                  {format(day, 'd')}
                </span>

                {hasEvent && (
                  <div className="flex gap-0.5 mt-0.5">
                    {evts.slice(0, 3).map((event, i) => {
                      const isBookmarked = bookmarks.includes(event.id);
                      return (
                        <div
                          key={i}
                          className={cn(
                            'w-1 h-1 rounded-full',
                            isToday ? 'bg-white' : isBookmarked ? 'bg-green-500' : 'bg-ewha-green'
                          )}
                        />
                      );
                    })}
                    {evts.length > 3 && (
                      <span className={cn('text-[8px] font-bold leading-none', isToday ? 'text-white' : 'text-ewha-green')}>
                        +{evts.length - 3}
                      </span>
                    )}
                  </div>
                )}
              </div>
            );
          })}
        </div>

        {/* Monthly highlights */}
        <div className="mt-6 space-y-3">
          <h3 className="text-xs font-bold text-gray-400 uppercase tracking-wider">이달의 주요 일정</h3>
          {events
            .filter((e) => isSameMonth(new Date(e.date), currentDate))
            .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime())
            .slice(0, 3)
            .map((event) => (
              <div
                key={event.id}
                onClick={() => onEventClick(event)}
                className="flex items-center gap-3 p-2 hover:bg-gray-50 rounded-lg cursor-pointer transition-colors"
              >
                <div className="flex flex-col items-center justify-center min-w-[40px] h-10 bg-ewha-light rounded-lg text-ewha-green">
                  <span className="text-[10px] font-bold leading-none">
                    {format(new Date(event.date), 'MMM', { locale: ko })}
                  </span>
                  <span className="text-sm font-black leading-none">
                    {format(new Date(event.date), 'd')}
                  </span>
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-bold truncate">{event.title}</p>
                  <p className="text-[10px] text-gray-400">
                    {event.category} • {event.location}
                  </p>
                </div>
              </div>
            ))}
        </div>
      </div>

      {/* 다중 이벤트 모달 */}
      <AnimatePresence>
        {dayEvents && (
          <>
            <motion.div
              key="backdrop"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black/40 z-40"
              onClick={() => setDayEvents(null)}
            />
            <motion.div
              key="modal"
              initial={{ opacity: 0, y: 60 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 60 }}
              transition={{ type: 'spring', damping: 28, stiffness: 260 }}
              className="fixed bottom-0 left-0 right-0 z-50 bg-white rounded-t-3xl px-5 pt-5 pb-8 max-w-md mx-auto shadow-2xl"
            >
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-base font-bold">{selectedDayLabel} 행사</h3>
                <button
                  onClick={() => setDayEvents(null)}
                  className="p-1 hover:bg-gray-100 rounded-full"
                >
                  <X size={20} />
                </button>
              </div>
              <div className="space-y-3 max-h-72 overflow-y-auto">
                {dayEvents.map((event) => (
                  <div
                    key={event.id}
                    onClick={() => {
                      setDayEvents(null);
                      onEventClick(event);
                    }}
                    className="flex items-center gap-3 p-3 bg-gray-50 hover:bg-ewha-light rounded-xl cursor-pointer transition-colors"
                  >
                    <img
                      src={event.imageUrl || `https://picsum.photos/seed/${event.id}/200/200`}
                      alt={event.title}
                      className="w-12 h-12 rounded-lg object-cover shrink-0"
                      referrerPolicy="no-referrer"
                    />
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-bold truncate">{event.title}</p>
                      <div className="flex items-center gap-1 text-[11px] text-gray-400 mt-0.5">
                        <Clock size={11} />
                        <span>{formatDateTime(event.date).split(' ').slice(-1)[0]}</span>
                        <span className="mx-1">·</span>
                        <MapPin size={11} />
                        <span className="truncate">{event.location}</span>
                      </div>
                    </div>
                    <span className="text-[10px] bg-ewha-green/10 text-ewha-green font-bold px-2 py-1 rounded shrink-0">
                      {event.category}
                    </span>
                  </div>
                ))}
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  );
}

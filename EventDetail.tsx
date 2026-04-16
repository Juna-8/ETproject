import React from 'react';
import { Event } from '../types';
import { Calendar, MapPin, Bookmark, ExternalLink } from 'lucide-react';
import { format } from 'date-fns';
import { ko } from 'date-fns/locale';
import { cn } from '../lib/utils';
import { motion } from 'motion/react';

interface EventCardProps {
  event: Event;
  onClick: (event: Event) => void;
  isBookmarked: boolean;
  onBookmarkToggle: (e: React.MouseEvent | null, id: string) => void;
}

export default function EventCard({ event, onClick, isBookmarked, onBookmarkToggle }: EventCardProps) {
  const dateObj = new Date(event.date);
  
  return (
    <motion.div
      whileHover={{ y: -4 }}
      whileTap={{ scale: 0.98 }}
      onClick={() => onClick(event)}
      className="card cursor-pointer group"
    >
      <div className="relative aspect-[4/3] overflow-hidden">
        <img
          src={event.imageUrl || `https://picsum.photos/seed/${event.id}/800/600`}
          alt={event.title}
          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
          referrerPolicy="no-referrer"
        />
        <div className="absolute top-3 left-3 flex gap-2">
          <span className="bg-ewha-green text-white text-[10px] font-bold px-2 py-1 rounded">
            {event.category}
          </span>
          {event.status === '종료' && (
            <span className="bg-gray-800 text-white text-[10px] font-bold px-2 py-1 rounded">
              종료됨
            </span>
          )}
        </div>
        <button
          onClick={(e) => onBookmarkToggle(e, event.id)}
          className={cn(
            "absolute top-3 right-3 p-2 rounded-full transition-colors",
            isBookmarked ? "bg-ewha-green text-white" : "bg-white/80 text-gray-600 hover:bg-white"
          )}
        >
          <Bookmark size={16} fill={isBookmarked ? "currentColor" : "none"} />
        </button>
      </div>
      
      <div className="p-4">
        <h3 className="font-bold text-lg leading-tight mb-2 line-clamp-2 group-hover:text-ewha-green transition-colors flex items-center gap-1.5">
          {event.title}
          {event.applyLink && (
            <ExternalLink size={14} className="text-gray-400 shrink-0" />
          )}
        </h3>
        
        <div className="space-y-1.5 text-sm text-gray-500">
          <div className="flex items-center gap-2">
            <Calendar size={14} />
            <span>{format(dateObj, 'M월 d일 (eee) HH:mm', { locale: ko })}</span>
          </div>
          <div className="flex items-center gap-2">
            <MapPin size={14} />
            <span className="truncate">{event.location}</span>
          </div>
        </div>
        
        <div className="mt-3 flex flex-wrap gap-1">
          {event.tags.slice(0, 3).map(tag => (
            <span key={tag} className="text-[10px] text-gray-400 bg-gray-100 px-1.5 py-0.5 rounded">
              #{tag}
            </span>
          ))}
        </div>
      </div>
    </motion.div>
  );
}

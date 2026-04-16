/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { MOCK_EVENTS, MOCK_REVIEWS } from './data';
import { Event, Category, Review, Comment } from './types';
import Navbar from './components/Navbar';
import EventCard from './components/EventCard';
import EventDetail from './components/EventDetail';
import CalendarView from './components/CalendarView';
import { Search, Filter, Bell, Bookmark, MessageCircle, Heart, ChevronRight } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { cn, formatDate, useLocalStorage } from './lib/utils';

const CURRENT_USER_ID = 'u-current';

export default function App() {
  const [activeTab, setActiveTab] = React.useState('home');
  const [selectedEvent, setSelectedEvent] = React.useState<Event | null>(null);
  const [searchQuery, setSearchQuery] = React.useState('');
  const [activeCategory, setActiveCategory] = React.useState<Category | '전체'>('전체');

  // ① localStorage 영속 상태
  const [bookmarks, setBookmarks] = useLocalStorage<string[]>('ewha-bookmarks', []);
  const [reviews, setReviews] = useLocalStorage<Review[]>('ewha-reviews', MOCK_REVIEWS);

  const categories: (Category | '전체')[] = ['전체', '강연', '세미나', '토크콘서트', '취업행사', '콜로퀴움'];

  const filteredEvents = MOCK_EVENTS.filter((event) => {
    const matchesSearch =
      event.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      event.organizer.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = activeCategory === '전체' || event.category === activeCategory;
    return matchesSearch && matchesCategory;
  });

  const handleBookmarkToggle = (e: React.MouseEvent | null, id: string) => {
    if (e) e.stopPropagation();
    setBookmarks((prev) => (prev.includes(id) ? prev.filter((b) => b !== id) : [...prev, id]));
  };

  const handleAddReview = (content: string) => {
    if (!selectedEvent) return;
    const newReview: Review = {
      id: `r${Date.now()}`,
      eventId: selectedEvent.id,
      userId: CURRENT_USER_ID,
      userName: '이화벗',
      content,
      createdAt: new Date().toISOString(),
      likes: 0,
      likedBy: [],
      comments: [],
    };
    setReviews((prev) => [newReview, ...prev]);
  };

  // ③ 좋아요 토글
  const handleLikeReview = (reviewId: string) => {
    setReviews((prev) =>
      prev.map((r) => {
        if (r.id !== reviewId) return r;
        const alreadyLiked = r.likedBy.includes(CURRENT_USER_ID);
        return {
          ...r,
          likes: alreadyLiked ? r.likes - 1 : r.likes + 1,
          likedBy: alreadyLiked
            ? r.likedBy.filter((id) => id !== CURRENT_USER_ID)
            : [...r.likedBy, CURRENT_USER_ID],
        };
      })
    );
  };

  // ③ 댓글 추가
  const handleAddComment = (reviewId: string, content: string) => {
    const newComment: Comment = {
      id: `c${Date.now()}`,
      reviewId,
      userId: CURRENT_USER_ID,
      userName: '이화벗',
      content,
      createdAt: new Date().toISOString(),
    };
    setReviews((prev) =>
      prev.map((r) =>
        r.id === reviewId
          ? { ...r, comments: [...(r.comments ?? []), newComment] }
          : r
      )
    );
  };

  // ─── Render helpers ────────────────────────────────────────────────────────

  const renderHome = () => (
    <div className="px-4 pt-6 pb-24">
      {/* Header */}
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-2xl font-black text-ewha-green">EWHA Talk</h1>
          <p className="text-xs text-gray-400 font-medium">교내 행사 정보 통합 플랫폼</p>
        </div>
        <button className="p-2 bg-white rounded-full shadow-sm border border-gray-100 relative">
          <Bell size={20} className="text-gray-600" />
          <span className="absolute top-2 right-2 w-2 h-2 bg-red-500 rounded-full border-2 border-white"></span>
        </button>
      </div>

      {/* Search */}
      <div className="relative mb-6">
        <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
        <input
          type="text"
          placeholder="행사명, 주최 기관 검색"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="w-full pl-12 pr-4 py-3.5 bg-white border border-gray-100 rounded-2xl shadow-sm focus:outline-none focus:ring-2 focus:ring-ewha-green/10 focus:border-ewha-green transition-all"
        />
      </div>

      {/* Categories */}
      <div className="flex gap-2 overflow-x-auto pb-4 no-scrollbar mb-6">
        {categories.map((cat) => (
          <button
            key={cat}
            onClick={() => setActiveCategory(cat)}
            className={cn(
              'whitespace-nowrap px-4 py-2 rounded-full text-sm font-medium transition-all',
              activeCategory === cat
                ? 'bg-ewha-green text-white shadow-md shadow-ewha-green/20'
                : 'bg-white text-gray-500 border border-gray-100 hover:bg-gray-50'
            )}
          >
            {cat}
          </button>
        ))}
      </div>

      {/* Featured */}
      {activeCategory === '전체' && !searchQuery && (
        <div className="mb-8">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-bold">이번 주 추천 행사</h2>
            <button className="text-xs text-gray-400 font-bold flex items-center gap-1">
              전체보기 <ChevronRight size={14} />
            </button>
          </div>
          <div className="flex gap-4 overflow-x-auto pb-4 no-scrollbar">
            {MOCK_EVENTS.slice(0, 2).map((event) => (
              <div key={event.id} className="min-w-[280px] max-w-[280px]">
                <EventCard
                  event={event}
                  onClick={setSelectedEvent}
                  isBookmarked={bookmarks.includes(event.id)}
                  onBookmarkToggle={handleBookmarkToggle}
                />
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Event list */}
      <div>
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-bold">
            {activeCategory === '전체' ? '전체 행사' : `${activeCategory} 목록`}
          </h2>
          <button className="p-2 bg-gray-100 rounded-lg">
            <Filter size={16} className="text-gray-600" />
          </button>
        </div>
        <div className="grid grid-cols-1 gap-4">
          {filteredEvents.length > 0 ? (
            filteredEvents.map((event) => (
              <div key={event.id}>
                <EventCard
                  event={event}
                  onClick={setSelectedEvent}
                  isBookmarked={bookmarks.includes(event.id)}
                  onBookmarkToggle={handleBookmarkToggle}
                />
              </div>
            ))
          ) : (
            <div className="text-center py-20 bg-white rounded-2xl border border-dashed border-gray-200">
              <Search size={40} className="mx-auto mb-2 text-gray-200" />
              <p className="text-gray-400 text-sm">검색 결과가 없습니다.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );

  const renderCalendar = () => (
    <div className="px-4 pt-6 pb-24">
      <h1 className="text-2xl font-bold mb-6">행사 캘린더</h1>
      <CalendarView events={MOCK_EVENTS} onEventClick={setSelectedEvent} bookmarks={bookmarks} />
    </div>
  );

  const renderCommunity = () => (
    <div className="px-4 pt-6 pb-24">
      <h1 className="text-2xl font-bold mb-6">커뮤니티</h1>
      <div className="space-y-6">
        {reviews.map((review) => {
          const event = MOCK_EVENTS.find((e) => e.id === review.eventId);
          const isLiked = review.likedBy.includes(CURRENT_USER_ID);
          return (
            <div key={review.id} className="card p-4">
              <div className="flex items-center gap-3 mb-3">
                <div className="w-10 h-10 bg-ewha-accent rounded-full flex items-center justify-center text-ewha-green font-bold">
                  {review.userName[0]}
                </div>
                <div>
                  <p className="text-sm font-bold">{review.userName}</p>
                  {/* ④ formatDate은 lib/utils에서 import */}
                  <p className="text-[10px] text-gray-400">{formatDate(review.createdAt)}</p>
                </div>
              </div>

              {event && (
                <div
                  onClick={() => setSelectedEvent(event)}
                  className="mb-3 p-2 bg-gray-50 rounded-lg border border-gray-100 flex items-center gap-3 cursor-pointer"
                >
                  <img
                    src={event.imageUrl}
                    className="w-12 h-12 rounded object-cover"
                    referrerPolicy="no-referrer"
                  />
                  <div className="flex-1 min-w-0">
                    <p className="text-xs font-bold truncate">{event.title}</p>
                    <p className="text-[10px] text-gray-400">{event.category}</p>
                  </div>
                </div>
              )}

              <p className="text-sm text-gray-600 mb-4 leading-relaxed">{review.content}</p>

              <div className="flex items-center gap-4 text-gray-400">
                {/* ③ 좋아요 토글 */}
                <button
                  onClick={() => handleLikeReview(review.id)}
                  className={cn(
                    'flex items-center gap-1 transition-colors',
                    isLiked ? 'text-red-500' : 'hover:text-red-500'
                  )}
                >
                  <Heart size={16} fill={isLiked ? 'currentColor' : 'none'} />
                  <span className="text-xs">{review.likes}</span>
                </button>
                <button
                  onClick={() => setSelectedEvent(event ?? null)}
                  className="flex items-center gap-1 hover:text-ewha-green transition-colors"
                >
                  <MessageCircle size={16} />
                  <span className="text-xs">
                    댓글 {review.comments?.length ? `(${review.comments.length})` : '달기'}
                  </span>
                </button>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );

  const renderMyPage = () => (
    <div className="px-4 pt-6 pb-24">
      <div className="flex items-center gap-4 mb-8">
        <div className="w-16 h-16 bg-ewha-green rounded-2xl flex items-center justify-center text-white text-2xl font-black">
          E
        </div>
        <div>
          <h1 className="text-xl font-bold">이화벗</h1>
          <p className="text-sm text-gray-400">juna1823@ewhain.net</p>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4 mb-8">
        <div className="bg-white p-4 rounded-2xl border border-gray-100 text-center">
          <p className="text-2xl font-black text-ewha-green">{bookmarks.length}</p>
          <p className="text-xs text-gray-400 font-bold">북마크</p>
        </div>
        <div className="bg-white p-4 rounded-2xl border border-gray-100 text-center">
          <p className="text-2xl font-black text-ewha-green">
            {reviews.filter((r) => r.userId === CURRENT_USER_ID).length}
          </p>
          <p className="text-xs text-gray-400 font-bold">작성 후기</p>
        </div>
      </div>

      <div className="space-y-6">
        {/* 북마크 목록 */}
        <div>
          <h2 className="text-lg font-bold mb-4 flex items-center gap-2">
            <Bookmark size={20} className="text-ewha-green" />
            북마크한 행사
          </h2>
          <div className="space-y-4">
            {bookmarks.length > 0 ? (
              MOCK_EVENTS.filter((e) => bookmarks.includes(e.id)).map((event) => (
                <div
                  key={event.id}
                  onClick={() => setSelectedEvent(event)}
                  className="flex items-center gap-4 p-3 bg-white rounded-xl border border-gray-100 cursor-pointer"
                >
                  <img
                    src={event.imageUrl}
                    className="w-16 h-16 rounded-lg object-cover"
                    referrerPolicy="no-referrer"
                  />
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-bold truncate">{event.title}</p>
                    <p className="text-xs text-gray-400">
                      {event.category} • {event.location}
                    </p>
                  </div>
                  <ChevronRight size={18} className="text-gray-300" />
                </div>
              ))
            ) : (
              <p className="text-center py-10 text-gray-400 text-sm bg-gray-50 rounded-xl border border-dashed border-gray-200">
                북마크한 행사가 없습니다.
              </p>
            )}
          </div>
        </div>

        {/* 내가 쓴 후기 */}
        <div>
          <h2 className="text-lg font-bold mb-4 flex items-center gap-2">
            <MessageCircle size={20} className="text-ewha-green" />
            내가 쓴 후기
          </h2>
          <div className="space-y-3">
            {reviews.filter((r) => r.userId === CURRENT_USER_ID).length > 0 ? (
              reviews
                .filter((r) => r.userId === CURRENT_USER_ID)
                .map((review) => {
                  const event = MOCK_EVENTS.find((e) => e.id === review.eventId);
                  return (
                    <div
                      key={review.id}
                      onClick={() => event && setSelectedEvent(event)}
                      className="p-3 bg-white rounded-xl border border-gray-100 cursor-pointer"
                    >
                      {event && (
                        <p className="text-xs font-bold text-ewha-green mb-1 truncate">
                          {event.title}
                        </p>
                      )}
                      <p className="text-sm text-gray-600 line-clamp-2">{review.content}</p>
                      <p className="text-[10px] text-gray-400 mt-1">{formatDate(review.createdAt)}</p>
                    </div>
                  );
                })
            ) : (
              <p className="text-center py-10 text-gray-400 text-sm bg-gray-50 rounded-xl border border-dashed border-gray-200">
                작성한 후기가 없습니다.
              </p>
            )}
          </div>
        </div>
      </div>
    </div>
  );

  // ─── Root render ───────────────────────────────────────────────────────────

  return (
    <div className="max-w-md mx-auto bg-gray-50 min-h-screen relative shadow-2xl">
      <AnimatePresence mode="wait">
        {selectedEvent ? (
          <motion.div
            key="detail"
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ type: 'spring', damping: 25, stiffness: 200 }}
            className="fixed inset-0 z-50 overflow-y-auto bg-white max-w-md mx-auto"
          >
            <EventDetail
              event={selectedEvent}
              reviews={reviews.filter((r) => r.eventId === selectedEvent.id)}
              onBack={() => setSelectedEvent(null)}
              isBookmarked={bookmarks.includes(selectedEvent.id)}
              onBookmarkToggle={(id) => handleBookmarkToggle(null, id)}
              onAddReview={handleAddReview}
              onLikeReview={handleLikeReview}
              onAddComment={handleAddComment}
            />
          </motion.div>
        ) : (
          <motion.div
            key={activeTab}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.2 }}
          >
            {activeTab === 'home' && renderHome()}
            {activeTab === 'calendar' && renderCalendar()}
            {activeTab === 'community' && renderCommunity()}
            {activeTab === 'mypage' && renderMyPage()}
          </motion.div>
        )}
      </AnimatePresence>

      {!selectedEvent && <Navbar activeTab={activeTab} setActiveTab={setActiveTab} />}
    </div>
  );
}

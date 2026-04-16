export type Category = '강연' | '세미나' | '토크콘서트' | '취업행사' | '콜로퀴움' | '기타';

export type Field = '취업' | '창업' | '인문' | '공학' | '예술' | '사회' | '자연';

export interface Event {
  id: string;
  title: string;
  category: Category;
  field: Field;
  date: string; // ISO string (KST: +09:00)
  location: string;
  organizer: string;
  description: string;
  imageUrl?: string;
  applyLink: string;
  target: string;
  notices: string[];
  tags: string[];
  status: '예정' | '진행중' | '종료';
}

export interface Comment {
  id: string;
  reviewId: string;
  userId: string;
  userName: string;
  content: string;
  createdAt: string;
}

export interface Review {
  id: string;
  eventId: string;
  userId: string;
  userName: string;
  content: string;
  createdAt: string;
  likes: number;
  likedBy: string[];    // userId 목록
  comments?: Comment[]; // 댓글 목록
}

export interface User {
  id: string;
  name: string;
  email: string;
  bookmarks: string[]; // Event IDs
}

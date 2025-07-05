export type TipState = 'unread' | 'inwork' | 'read';

export interface Tip {
    id: string;
    title: string;
    description: string;
    icon: string;
  }


export interface Category {
    icon: string;
    title: string;
    description: string;
    tips: Tip[];
  }
  
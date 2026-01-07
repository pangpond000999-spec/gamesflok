export interface GameItem {
  id: string;
  question: string;
  answer: string;
}

export interface DragItem {
  id: string; // This corresponds to the answer content
  content: string;
  originalId: string; // Keep track of which question it belongs to for checking
}

export type Placements = Record<string, string | null>; // questionId -> answerId (content)